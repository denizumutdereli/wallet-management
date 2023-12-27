import { TatumBtcSDK } from '@tatumio/btc';
import { generatePrivateKeyFromMnemonic, generateAddressFromXPub, Currency } from '@tatumio/tatum';
import { EstimateFeeFromAddress, FeeBtcBased } from '@tatumio/api-client';
import MnemonicModel from '@/models/mnemonics.model';

class BitcoinService {
  private testnet: boolean;
  private tatumApiKey: string;
  private sdk: any;
  mdata: any;

  constructor(tatumApiKey: string) {
    this.testnet = false;
    this.tatumApiKey = tatumApiKey;

    this.sdk = TatumBtcSDK({ apiKey: this.tatumApiKey });
  }

  async createWallet(): Promise<any> {
    const { mnemonic, xpub } = await this.sdk.wallet.generateWallet(undefined, { testnet: this.testnet });
    console.log(`Mnemonic: ${mnemonic}`);
    console.log(`Xpub: ${xpub}`);

    // Create new blockchain address
    const address = this.sdk.wallet.generateAddressFromXPub(xpub, 0, { testnet: this.testnet });
    console.log(`Address: ${address}.`);

    // Save mnemonic and xpub to database
    const m = MnemonicModel.create({ user: '1', address: address, index: 1, xpub: xpub, mnemonic: mnemonic });

    return m;
  }

  async generatePrivateKeyFromMnemonic(mnemonic: string): Promise<string> {
    try {
      const privateKey = await generatePrivateKeyFromMnemonic(Currency.BTC, true, mnemonic, 0);
      return privateKey;
    } catch (error) {
      throw new Error('Error generating private key: ' + error.message);
    }
  }

  async generatePublicAddressFromXPub(xpub: string, index: number): Promise<string> {
    try {
      const address = await generateAddressFromXPub(Currency.BTC, true, xpub, index);
      return address;
    } catch (error) {
      throw new Error('Error generating public address: ' + error.message);
    }
  }

  async generatePrivateKeyAndPublicAddressFromMnemonic(mnemonic: string): Promise<any> {
    try {
      const privateKey = await this.generatePrivateKeyFromMnemonic(mnemonic);
      const xpub = await this.sdk.wallet.fromMnemonic(mnemonic, { testnet: this.testnet });
      const address = await this.generatePublicAddressFromXPub(xpub, 0);
      return { privateKey, address };
    } catch (error) {
      throw new Error('Error generating private key and public address: ' + error.message);
    }
  }

  async generatePrivateKeyAndPublicAddress(privateKeyHex: string): Promise<any> {
    try {
      const address = await this.sdk.wallet.getAddressFromPrivateKey(privateKeyHex, { testnet: this.testnet });
      return { privateKey: privateKeyHex, address };
    } catch (error) {
      throw new Error('Error generating private key and public address: ' + error.message);
    }
  }

  async getBalance(address: string): Promise<number> {
    try {
      const balance = await this.sdk.blockchain.getBlockchainAccountBalance(address);
      console.log(`Balance of ${address} : ${JSON.stringify(balance)}`);
      return balance;
    } catch (error) {
      throw new Error('Error getting balance: ' + error.message);
    }
  }

  async estimateFee(from: string[], to: string, type = 'TRANSFER', value: number): Promise<any> {
    const estimatedFee = (await this.sdk.blockchain.estimateFee({
      chain: Currency.BTC,
      type: type,
      fromAddress: from,
      to: [
        {
          address: to,
          value: value,
        },
      ],
    } as EstimateFeeFromAddress)) as FeeBtcBased;
    console.log(estimatedFee);
    return estimatedFee;
  }
}

export default BitcoinService;
