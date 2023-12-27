import { BlockchainService } from '@/blockchain/chain';
import { errs } from '@/exceptions/HttpException';
import { Domain } from '@/interfaces/domain.interface';
import { Mnemonic } from '@/interfaces/mnemonics.interface';
import { User } from '@/interfaces/users.interface';
import { Wallet } from '@/interfaces/wallet.interface';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateRequest, CreateResponse, SearchRequest, SearchResponse } from './wallet.dto';
import { WalletValidator } from './wallet.validator';

// const Web3 = require('web3');

export interface WalletService {
  create(data: CreateRequest): Promise<CreateResponse>;
  getWallet(data: CreateRequest): Promise<Partial<CreateResponse>>;
  getCustomerWallets(walletData: SearchRequest): Promise<Partial<CreateResponse>[]>;
  getNetworkWallets(walletData: SearchRequest): Promise<Partial<CreateResponse>[]>;
  search(data: SearchRequest): Promise<SearchResponse>;

  // subscribe(data: any): Promise<any>;
  // getBalance(data: CreateRequest): Promise<Partial<CreateResponse>>;
  // getWallet(user: number, domain: string): Promise<Wallet>;
  // updateWallet(user: number, domain: string, wallet: Partial<Wallet>): Promise<Wallet>;
  // deleteWallet(user: number, domain: string): Promise<void>;
  // createTransaction(user: number, chain: string, domain: string, to: string, amount: number): Promise<string>;
  // checkTransactionStatus(user: number, domain: string, txId: string): Promise<string>;
  // listLatestTransactions(user: number, domain: string): Promise<any[]>;
}

export function initService(
  users: Model<User>,
  domains: Model<Domain>,
  wallets: Model<Wallet> & PaginateModel<Wallet>,
  externalwallets: Model<Mnemonic>,
): WalletService {
  const service = new WalletValidator(new Service(users, domains, wallets, externalwallets));
  return service;
}

class Service implements WalletService {
  constructor(
    private readonly users: Model<User>,
    private readonly domains: Model<Domain>,
    private readonly wallets: Model<Wallet> & PaginateModel<Wallet>,
    private readonly externalwallets: Model<Mnemonic>,
  ) {}

  public async create(walletData: CreateRequest): Promise<CreateResponse> {
    const existingWallet = await this.wallets.find({
      user: walletData.user,
      domain: walletData.domain,
      customerId: walletData.customerId,
      testnet: walletData.testnet,
      network: walletData.network,
    });
    if (existingWallet.length > 0)
      throw errs.VALIDATION(`Wallet for user ${walletData.user} and domain ${walletData.domain}, the wallet already exists`);

    // Find the external wallet

    const externalWallet = await this.externalwallets.findOne({
      user: walletData.user,
      domain: walletData.domain,
      network: walletData.network,
      testnet: walletData.testnet,
    });
    if (!externalWallet)
      throw errs.VALIDATION(
        `External-wallet for user ${walletData.user} and domain ${walletData.domain}, and the network ${walletData.network} with testnet option "${walletData.testnet}" not exists`,
      );

    const lastWallet = await this.wallets.find({
      user: walletData.user,
      domain: walletData.domain,
      testnet: walletData.testnet,
      network: walletData.network,
    });
    const index = lastWallet.length > 0 ? Math.max(...lastWallet.map(wallet => wallet.index)) + 1 : 0;

    // Generate the address using the new index
    const blockchainService = new BlockchainService(walletData.testnet, walletData.network);
    const address: { address: string; id: string } = await blockchainService.generatePublicAddress({
      user: walletData.user,
      domain: walletData.domain,
      network: walletData.network,
      testnet: 'false', // walletData.testnet,
      index: index,
    });

    // Create the wallet with the generated address
    const createdWallet: Wallet = await this.wallets.create({
      ...walletData,
      index: index.toString(),
      mainWallet: address.id,
      address: address.address,
    });

    const filter = { _id: address.id };
    const update = { $inc: { indexesCreated: 1 } };
    const options = { new: true };

    await this.externalwallets.findOneAndUpdate(filter, update, options);

    return createdWallet;
  }

  public async getWallet(walletData: CreateRequest): Promise<Partial<CreateResponse>> {
    const existingWallet = await this.wallets.findOne({
      user: walletData.user,
      domain: walletData.domain,
      customerId: walletData.customerId,
      testnet: walletData.testnet,
      network: walletData.network,
    });
    if (!existingWallet) throw errs.VALIDATION(`Wallet for user ${walletData.user} and domain ${walletData.domain}, not exists`);

    // get the recorded wallet
    const wallet: Partial<CreateResponse> = {
      customerId: existingWallet.customerId,
      testnet: existingWallet.testnet,
      network: existingWallet.network,
      address: existingWallet.address,
      mainWallet: existingWallet.mainWallet,
    };

    return wallet;
  }

  public async getCustomerWallets(walletData: SearchRequest): Promise<Partial<CreateResponse>[]> {
    const existingWallets = await this.wallets.find({
      user: walletData.user,
      domain: walletData.domain,
      customerId: walletData.customerId,
    });

    if (!existingWallets || existingWallets.length === 0) {
      throw errs.VALIDATION(`Wallet for user ${walletData.user} and domain ${walletData.domain} not exists`);
    }

    // Get the recorded wallets
    const wallets: Partial<CreateResponse>[] = existingWallets.map(wallet => ({
      customerId: wallet.customerId,
      testnet: wallet.testnet,
      network: wallet.network,
      address: wallet.address,
      mainWallet: wallet.mainWallet,
    }));

    return wallets;
  }

  public async getNetworkWallets(walletData: SearchRequest): Promise<Partial<CreateResponse>[]> {
    const existingWallets = await this.wallets.find({
      user: walletData.user,
      domain: walletData.domain,
      network: walletData.network,
      testnet: walletData.testnet,
    });

    if (!existingWallets || existingWallets.length === 0) {
      throw errs.VALIDATION(`Wallet for user ${walletData.user} and domain ${walletData.domain} not exists`);
    }

    // Get the recorded wallets
    const wallets: Partial<CreateResponse>[] = existingWallets.map(wallet => ({
      customerId: wallet.customerId,
      testnet: wallet.testnet,
      network: wallet.network,
      address: wallet.address,
      mainWallet: wallet.mainWallet,
    }));

    return wallets;
  }

  public async search(data: SearchRequest): Promise<SearchResponse> {
    console.log(data, '****************');
    const findData: PaginateResult<Wallet> = await this.wallets.paginate(
      { ...data },
      { page: data.page, limit: data.limit, select: { address: 1, network: 1, testnet: 1, mainWallet: 1, created_at: 1 } },
    );

    if (findData.docs.length == 0) throw errs.NOT_FOUND(`No data found`);

    return { result: findData };
  }
}

export default WalletService;
