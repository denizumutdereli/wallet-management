import { DEFAULT_FIAT_CURRENCY, TATUM_API_KEY } from '@/config';
import { SupportedNetwork } from '@/enums/wallet.enums';
import { errs } from '@/exceptions/HttpException';
import Mnemonic from '@/models/mnemonics.model';
import VirtualAccounts from '@/models/virtual.accounts.model';
import { TatumBchSDK } from '@tatumio/bch';
import { TatumBscSDK } from '@tatumio/bsc';
import { TatumBtcSDK } from '@tatumio/btc';
import { TatumCeloSDK } from '@tatumio/celo';
import { TatumDogeSDK } from '@tatumio/doge';
import { TatumEthSDK } from '@tatumio/eth';
import { TatumLtcSDK } from '@tatumio/ltc';
import { TatumPolygonSDK } from '@tatumio/polygon';

import { Account, CreateAccount, Currency, Fiat, createAccount } from '@tatumio/tatum';
import { TatumTronSDK } from '@tatumio/tron';
import { ObjectId } from 'mongoose';

export class BlockchainService {
  private testnet: boolean;
  private tatumApiKey: string;
  private sdk: any;
  private currency: string;
  private mnemonics: any;
  private virtualAccounts: any;
  private user: ObjectId;
  private domain: ObjectId;

  constructor(testnet = 'true', currency: string = SupportedNetwork.BTC) {
    this.testnet = testnet === 'true' ? true : false;
    this.tatumApiKey = TATUM_API_KEY;
    this.currency = currency;
    this.mnemonics = Mnemonic;
    this.virtualAccounts = VirtualAccounts;

    switch (this.currency) {
      case SupportedNetwork.BTC:
        this.sdk = TatumBtcSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.BCH:
        this.sdk = TatumBchSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.ETH:
        this.sdk = TatumEthSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.TRON:
        this.sdk = TatumTronSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.LTC:
        this.sdk = TatumLtcSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.DOGE:
        this.sdk = TatumDogeSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.BSC:
        this.sdk = TatumBscSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.CELO:
        this.sdk = TatumCeloSDK({ apiKey: this.tatumApiKey });
        break;
      case SupportedNetwork.MATIC:
        this.sdk = TatumPolygonSDK({ apiKey: this.tatumApiKey });
        break;
      default:
        throw new Error(`Unsupported currency: ${this.currency}`);
    }
  }

  async createVirtualWallet(walletData: {
    user: string;
    domain: string;
    network: string;
    testnet: string;
    currency: string;
    accountingCurrency?: string;
  }): Promise<any> {
    try {
      const { user, domain, network, testnet, currency, accountingCurrency } = walletData;
      const mnemonics = await this.mnemonics.find({ user, domain, network, testnet });

      if (mnemonics.length === 0) {
        throw new Error(`BlockchainService: External wallet not found for network ${network}`);
      }

      const crypto_currency = Currency[currency as keyof Currency];
      const fiat_currency = Fiat[(accountingCurrency as Fiat) ? accountingCurrency : DEFAULT_FIAT_CURRENCY];
      const accountCode = crypto_currency + '_' + fiat_currency + '_' + domain; // TODO: semantic name for accountCode

      const createAccountData: CreateAccount = {
        currency: crypto_currency,
        xpub: mnemonics[0].xpub,
        accountNumber: domain,
        accountingCurrency: fiat_currency,
        accountCode,
      };

      // Currently supporting only one account per domain/network
      const existingAccount = await this.virtualAccounts.find({
        user,
        domain,
        network,
        testnet,
        accountNumber: domain,
        accountCode,
        currency: crypto_currency,
        accountingCurrency: fiat_currency,
      });
      if (existingAccount.length > 0) {
        throw errs.VALIDATION(`BlockchainService: This virtual account is already exist. id: ${existingAccount[0]._id}`); // Assuming only one record will be.
      }

      const newVirtualAccount = await this.virtualAccounts
        .create({
          user,
          domain,
          network,
          testnet,
          accountNumber: domain,
          accountCode,
          currency: crypto_currency,
          accountingCurrency: fiat_currency,
          serviceId: 0, // temporary
        })
        .catch(err => {
          console.log(err);
          throw new Error(`BlockchainService: ${err.message}`);
        });

      try {
        const virtual_account: Account = await createAccount(createAccountData);
        console.log(virtual_account);

        const updateVirtualAccountId = await this.virtualAccounts.findOneAndUpdate(
          newVirtualAccount,
          { serviceId: virtual_account.id },
          { new: true },
        );

        return updateVirtualAccountId;
      } catch (err) {
        console.log(err);
        throw new Error(`External Service: ${err.message}`);
      }
    } catch (error) {
      console.log(error);
      throw error; // TODO: semantic error message with tatum error message
    }
  }

  //continue from here...
  async engageToVirtualAccount(walletData: {
    user: string;
    domain: string;
    network: string;
    testnet: string;
    currency: string;
    accountingCurrency?: string;
  }): Promise<any> {
    try {
      const { user, domain, network, testnet, currency, accountingCurrency } = walletData;
      const mnemonics = await this.mnemonics.find({ user, domain, network, testnet });

      if (mnemonics.length === 0) {
        throw new Error(`BlockchainService: External wallet not found for network ${network}`);
      }

      const crypto_currency = Currency[currency as keyof Currency];
      const fiat_currency = Fiat[(accountingCurrency as Fiat) ? accountingCurrency : DEFAULT_FIAT_CURRENCY];
      const accountCode = crypto_currency + '_' + fiat_currency + '_' + domain; // TODO: semantic name for accountCode

      const createAccountData: CreateAccount = {
        currency: crypto_currency,
        xpub: mnemonics[0].xpub,
        accountNumber: domain,
        accountingCurrency: fiat_currency,
        accountCode,
      };

      // Currently supporting only one account per domain/network
      const existingAccount = await this.virtualAccounts.find({
        user,
        domain,
        network,
        testnet,
        accountNumber: domain,
        accountCode,
        currency: crypto_currency,
        accountingCurrency: fiat_currency,
      });
      if (existingAccount.length > 0) {
        throw errs.VALIDATION(`BlockchainService: This virtual account is already exist. id: ${existingAccount[0]._id}`); // Assuming only one record will be.
      }

      const newVirtualAccount = await this.virtualAccounts
        .create({
          user,
          domain,
          network,
          testnet,
          accountNumber: domain,
          accountCode,
          currency: crypto_currency,
          accountingCurrency: fiat_currency,
          serviceId: 0, // temporary
        })
        .catch(err => {
          console.log(err);
          throw new Error(`BlockchainService: ${err.message}`);
        });

      try {
        const virtual_account: Account = await createAccount(createAccountData);
        console.log(virtual_account);

        const updateVirtualAccountId = await this.virtualAccounts.findOneAndUpdate(
          newVirtualAccount,
          { serviceId: virtual_account.id },
          { new: true },
        );

        return updateVirtualAccountId;
      } catch (err) {
        console.log(err);
        throw new Error(`External Service: ${err.message}`);
      }
    } catch (error) {
      console.log(error);
      throw error; // TODO: semantic error message with tatum error message
    }
  }

  async generatePublicAddress(walletData: {
    user: string;
    domain: string;
    network: string;
    testnet: string;
    index: number;
  }): Promise<{ address: string; id: string }> {
    const { user, domain, network, testnet, index } = walletData;
    const mnemonics = await this.mnemonics.find({ user, domain, network, testnet });

    if (mnemonics.length === 0) {
      throw new Error(`BlockchainService: External wallet not found for network ${network}`);
    }

    const sortedMnemonics = mnemonics.sort((a, b) => a.indexesCreated - b.indexesCreated);
    const selectedMnemonic = sortedMnemonics[0];

    const address = await this.sdk.wallet.generateAddressFromXPub(selectedMnemonic.xpub, index, { testnet: this.testnet });

    await selectedMnemonic.save();

    return { address, id: selectedMnemonic._id.toString() };
  }

  async createMnemonicAndXPub(): Promise<any> {
    try {
      const { mnemonic, xpub } = await this.sdk.wallet.generateWallet(undefined, { testnet: this.testnet });
      return { mnemonic, xpub };
    } catch (error) {
      throw new Error('Error creating mnemonic and xpub: ' + error.message);
    }
  }

  async generatePrivateKeyFromMnemonic(mnemonic: string): Promise<string> {
    try {
      const privateKey = await this.sdk.wallet.generatePrivateKeyFromMnemonic(this.currency, true, mnemonic, 0);
      return privateKey;
    } catch (error) {
      throw new Error('Error generating private key: ' + error.message);
    }
  }

  async generatePublicAddressFromXPub(xpub: string, index: number): Promise<string> {
    try {
      const address = await this.sdk.wallet.generateAddressFromXPub(this.currency, true, xpub, index);
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
      const { balance } = await this.sdk.blockchain.getBlockchainAccountBalance(address);
      console.log(`Balance of ${address} : ${JSON.stringify(balance)}`);
      return balance;
    } catch (error) {
      throw new Error('Error getting balance: ' + error.message);
    }
  }

  async subscribeToAddress(address: string, callbackUrl: string): Promise<void> {
    try {
      const crypto_currency = Currency[this.currency as keyof Currency];
      const subscription = await this.sdk.subscriptions.createSubscription({
        type: 'ADDRESS_TRANSACTION',
        attr: {
          address,
          chain: Currency.BTC, //crypto_currency,
          url: callbackUrl,
        },
      });
      console.log(`Subscribed to address ${address}`);
      return subscription;
    } catch (error) {
      throw new Error('Error subscribing to address: ' + error.message);
    }
  }

  async cancelSubscription(id: string): Promise<void> {
    try {
      const cancel = await this.sdk.subscriptions.deleteSubscription(id as string);
      console.log('Subscription cancelled: ', id, cancel);
      return cancel;
    } catch (error) {
      throw new Error('Error subscribing to address: ' + error.message);
    }
  }

  async getSubscriptions(limit = 10): Promise<void> {
    try {
      const subscriptions = await this.sdk.subscriptions.getSubscriptions(limit);
      console.log('Subscriptions: ', subscriptions);
      return subscriptions;
    } catch (error) {
      throw new Error('Error subscribing to address: ' + error.message);
    }
  }

  async createTransaction(from: string, to: string, amount: number, chain: string, domain: string, index: string): Promise<string> {
    try {
      // Find the mnemonic associated with the domain
      const mnemonic = await this.mnemonics.findOne({ domain: domain, network: chain });
      if (!mnemonic) throw new Error(`Mnemonic not found for domain ${domain}`);

      // Derive the private key using the index
      const privateKey = await this.sdk.wallet.generatePrivateKeyFromMnemonic(mnemonic.phrase, parseInt(index), { testnet: this.testnet });

      const txData = {
        fromPrivateKey: privateKey,
        amount: amount,
        currency: this.currency,
        testnet: this.testnet,
        to: to,
        from: from,
      };

      const txId = await this.sdk.transaction.send(txData);
      return txId;
    } catch (error) {
      throw new Error('Error creating transaction: ' + error.message);
    }
  }

  // Function to get the transaction status
  async getTransactionStatus(txId: string): Promise<string> {
    try {
      const txStatus = await this.sdk.transaction.getTransaction(txId);
      return txStatus;
    } catch (error) {
      throw new Error('Error getting transaction status: ' + error.message);
    }
  }

  // Function to get the latest transactions for a wallet address
  async getLatestTransactions(address: string, limit: number): Promise<any> {
    try {
      const transactions = await this.sdk.blockchain.getTransactionsByAddress(this.currency, address, 1, limit);
      return transactions;
    } catch (error) {
      throw new Error('Error getting latest transactions: ' + error.message);
    }
  }
}

export default BlockchainService;
