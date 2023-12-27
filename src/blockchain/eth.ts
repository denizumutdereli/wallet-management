import { fromSeed } from 'bip32';
import * as bip39 from 'bip39';
import fromPrivateKey from 'ethereumjs-wallet';
import { ethers } from 'ethers';
import {
  CheckDepositsDto,
  GetERC20TokenBalanceDto,
  GetERC20TokenContractDto,
  GetWalletFromMnemonicDto,
  HDWalletInfo,
  SendERC20TokenDto,
  SendERC20TokenWithMnemonicDto,
  SendETHDto,
  SendETHWithMnemonicDto,
  WaitForConfirmationsCallback,
  WaitForConfirmationsDto,
} from './dto/eth.dto'; // TODO : @
import tokens from './tokens.json';

export class ETHNodeService {
  providerUrl: string;
  provider: ethers.providers.JsonRpcProvider;

  constructor(providerUrl: string) {
    this.providerUrl = providerUrl;
    this.connectProvider();
    this.checkConnection();
  }

  /**
   * connectProvider - Initializes a new JsonRpcProvider instance and sets up
   * an error event listener to handle reconnecting.
   */
  async connectProvider() {
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl);

    // Add an event listener for the error event
    this.provider.on('error', error => {
      console.error('Provider connection error:', error);

      // Try to reconnect after a certain delay
      setTimeout(() => {
        this.connectProvider();
      }, 5000); // Attempt to reconnect after 5 seconds
    });
  }

  async checkConnection(): Promise<boolean> {
    try {
      // const blockNumber = await this.provider.getBlockNumber();
      // console.log('Current block number:', blockNumber);
      return true;
    } catch (error) {
      console.error('Error checking connection:', this.providerUrl, error);
      return false;
    }
  }

  /**
   * Creates a new HD wallet using BIP44 derivation path and returns the wallet, mnemonic, and xpub.
   * @returns {HDWalletInfo} An object containing the wallet, mnemonic, xpub, and etherscan link.
   */
  async createWallet(): Promise<HDWalletInfo> {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed);
    const derivationPath = "m/44'/60'/0'/0/0"; // BIP44 derivation path for Ethereum
    const childNode = root.derivePath(derivationPath);
    const wallet = new fromPrivateKey(childNode.privateKey);
    const xpub = root.neutered().toBase58();

    const ethersWallet = new ethers.Wallet(wallet.getPrivateKeyString());

    // Create the Etherscan link for the wallet address
    const network = 'mainnet'; // Change this according to the network you are using (e.g., "ropsten", "rinkeby", "kovan")
    const etherscanBaseUrl = network === 'mainnet' ? 'https://etherscan.io' : `https://${network}.etherscan.io`;
    const etherscanLink = `${etherscanBaseUrl}/address/${ethersWallet.address}`;

    return {
      wallet: ethersWallet,
      mnemonic: mnemonic,
      xpub: xpub,
      etherscanLink: etherscanLink,
    };
  }

  /**
   * Derives a wallet from a mnemonic and index using BIP44 derivation path.
   * @param {GetWalletFromMnemonicDto} dto - The data transfer object containing the mnemonic and index.
   * @returns {Promise<ethers.Wallet>} The derived wallet.
   */
  async getWalletFromMnemonic(dto: GetWalletFromMnemonicDto): Promise<ethers.Wallet> {
    const path = `m/44'/60'/0'/0/${dto.index}`;
    const mnemonic = dto.mnemonic;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    return wallet;
  }

  /**
   * Returns an ERC20 token contract instance for the specified token symbol.
   * @param {GetERC20TokenContractDto} dto - The data transfer object containing the token symbol.
   * @returns {Promise<ethers.Contract>} The ERC20 token contract instance.
   */
  async getERC20TokenContract(dto: GetERC20TokenContractDto): Promise<ethers.Contract> {
    const token = tokens[dto.tokenSymbol];
    const contract = new ethers.Contract(token.address, token.abi, this.provider);
    return contract;
  }

  /**
   * Gets the balance of an ERC20 token for a specific address.
   * @param {GetERC20TokenBalanceDto} dto - The data transfer object containing the contract and address.
   * @returns {Promise<ethers.BigNumber>} The token balance.
   */
  async getERC20TokenBalance(dto: GetERC20TokenBalanceDto): Promise<ethers.BigNumber> {
    const contract = dto.contract;
    const balance = await contract.balanceOf(dto.address);
    return balance;
  }

  /**
   * Sends an ERC20 token from a connected wallet to a specified address.
   * @param {SendERC20TokenDto} dto - The data transfer object containing the wallet, contract, destination address, and the amount of tokens to send.
   * @returns {Promise<string>} The transaction hash.
   */
  async sendERC20Token(dto: SendERC20TokenDto): Promise<string> {
    if (await !this.validateAmount(dto.amount)) {
      throw new Error('Invalid amount');
    }

    const wallet = dto.wallet.connect(this.provider);
    const contract = dto.contract.connect(wallet);
    const tx = await contract.transfer(dto.to, dto.amount);

    // Return the transaction hash immediately without waiting for confirmation
    return tx.hash;
  }

  /**
   * Sends ERC20 tokens from a wallet derived from mnemonic and index to a specific address.
   * @param {SendERC20TokenWithMnemonicDto} dto - The data transfer object containing the mnemonic, index, contract, to address, and amount.
   * @returns {Promise<string>} The transaction hash.
   */
  async sendERC20TokenWithMnemonic(dto: SendERC20TokenWithMnemonicDto): Promise<any> {
    const getWalletDto: GetWalletFromMnemonicDto = {
      mnemonic: dto.mnemonic,
      index: dto.index,
    };
    const wallet = await this.getWalletFromMnemonic(getWalletDto);
    const connectedWallet = wallet.connect(this.provider);
    const connectedContract = dto.contract.connect(connectedWallet);

    const tx = await connectedContract.transfer(dto.to, dto.amount);
    return tx.hash;
  }

  /**
   * Gets the ETH balance for a specific address.
   * @param {string} address - The Ethereum address to get the balance of.
   * @returns {Promise<string>} The ETH balance.
   */
  async getETHBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);

    // Format the balance in Ether
    const balanceInEther = ethers.utils.formatEther(balance._hex);

    return balanceInEther;
  }

  /**
   * Sends Ether from a connected wallet to a specified address.
   * @param {SendETHDto} dto - The data transfer object containing the wallet, destination address, and the amount of Ether to send.
   * @returns {Promise<string>} The transaction hash.
   */
  async sendETH(dto: SendETHDto): Promise<string> {
    if (await !this.validateAmount(dto.amount)) {
      throw new Error('Invalid amount');
    }

    const wallet = dto.wallet.connect(this.provider);
    const tx = await wallet.sendTransaction({
      to: dto.to,
      value: dto.amount,
    });

    // Return the transaction hash immediately without waiting for confirmation
    return tx.hash;
  }

  /**
   * Sends ETH from a wallet derived from mnemonic and index to a specific address.
   * @param {SendETHWithMnemonicDto} dto - The data transfer object containing the mnemonic, index, to address, and amount.
   * @returns {Promise<string>} The transaction hash.
   */
  async sendETHWithMnemonic(dto: SendETHWithMnemonicDto): Promise<string> {
    const getWalletDto: GetWalletFromMnemonicDto = {
      mnemonic: dto.mnemonic,
      index: dto.index,
    };
    const wallet = await this.getWalletFromMnemonic(getWalletDto);
    const connectedWallet = wallet.connect(this.provider);

    const tx = await connectedWallet.sendTransaction({
      to: dto.to,
      value: dto.amount,
    });
    return tx.hash;
  }

  /**
   * Checks deposits made to a specific address from an ERC20 token contract.
   * @param {CheckDepositsDto} dto - The data transfer object containing the contract address, ABI, address, fromBlock, and toBlock.
   * @returns {Promise<void>}
   */
  async checkDepositsFromContract(dto: CheckDepositsDto): Promise<void> {
    const contract = new ethers.Contract(dto.contractAddress, dto.abi, this.provider);
    const filter = contract.filters.Transfer(null, dto.address);
    const events = await contract.queryFilter(filter, dto.fromBlock, dto.toBlock);

    for (const event of events) {
      const { args } = event;
      if (args && args.to === dto.address) {
        console.log(`Received ${ethers.utils.formatEther(args.value)} tokens from ${args.from} at block ${event.blockNumber}`);
      }
    }
  }

  /**
   * Waits for a specified number of confirmations for a transaction and optionally calls a callback function during the process.
   * @param {WaitForConfirmationsDto} dto - The data transfer object containing the transaction hash and the number of confirmations.
   * @param {WaitForConfirmationsCallback} [callback] - An optional callback function to be called during the waiting process.
   * @returns {Promise<ethers.providers.TransactionReceipt>} The transaction receipt.
   */
  async waitForConfirmations(dto: WaitForConfirmationsDto, callback?: WaitForConfirmationsCallback): Promise<ethers.providers.TransactionReceipt> {
    const transaction = await this.provider.getTransaction(dto.txHash);
    if (!transaction) {
      throw new Error(`Transaction not found: ${dto.txHash}`);
    }

    const targetBlock = transaction.blockNumber + dto.confirmations;
    let currentBlock = transaction.blockNumber;

    while (currentBlock < targetBlock) {
      if (callback) {
        callback(currentBlock - transaction.blockNumber, targetBlock - currentBlock);
      }
      await new Promise<void>(resolve => {
        this.provider.once((currentBlock + 1).toString(), () => {
          resolve();
        });
      });
      currentBlock = await this.provider.getBlockNumber();
    }

    return await this.provider.getTransactionReceipt(transaction.hash);
  }

  /**
   * Validates the amount to be sent in a transaction.
   * @param {ethers.BigNumber} amount - The amount to be sent.
   * @returns {boolean} - True if the amount is valid, false otherwise.
   */
  async validateAmount(amount: ethers.BigNumber): Promise<boolean> {
    return amount.gt(0) && !amount.isNegative();
  }
}
