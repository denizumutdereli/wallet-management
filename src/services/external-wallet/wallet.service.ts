import { BlockchainService } from '@/blockchain/chain';
import { DomainStatus } from '@/enums/domain.enums';
import { UserStatus } from '@/enums/user.enums';
import { SupportedNetwork } from '@/enums/wallet.enums';
import { errs } from '@/exceptions/HttpException';
import { Domain } from '@/interfaces/domain.interface';
import { Mnemonic } from '@/interfaces/mnemonics.interface';
import { User } from '@/interfaces/users.interface';
import { Wallet } from '@/interfaces/wallet.interface';
import { Currency } from '@tatumio/tatum';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateRequest, CreateResponse, SearchRequest, SearchResponse } from './wallet.dto';
import { WalletValidator } from './wallet.validator';
// import { MAX_WALLET_PER_DOMAIN_NETWORK } from '@/config';

/**
 * Interface representing the WalletService and its methods
 * @interface WalletService
 * @property {Function} create - Method to create a new wallet
 * @property {Function} createVirtualAccount - Method to create a new virtual account
 */

export interface WalletService {
  create(data: CreateRequest): Promise<CreateResponse>;
  search(data: SearchRequest): Promise<SearchResponse>;
  // createNodeWallet(data: CreateRequest): Promise<CreateResponse>;
  // createVirtualAccount(data: CreateVARequest): Promise<any>; // TODO: create VA response
  // engageToVirtualAccount(data: EngageRequest): Promise<any>; // TODO: create VA response
}

export function initService(
  users: Model<User>,
  domains: Model<Domain>,
  wallets: Model<Wallet>,
  mnemonics: Model<Mnemonic> & PaginateModel<Mnemonic>,
): WalletService {
  const service = new WalletValidator(new Service(users, domains, wallets, mnemonics));
  return service;
}

class Service implements WalletService {
  constructor(
    private readonly users: Model<User>,
    private readonly domains: Model<Domain>,
    private readonly wallets: Model<Wallet>,
    private readonly mnemonics: Model<Mnemonic> & PaginateModel<Mnemonic>,
  ) {}

  public async search(data: SearchRequest): Promise<SearchResponse> {
    const findData: PaginateResult<Mnemonic> = await this.mnemonics.paginate(
      { ...data },
      { page: data.page, limit: data.limit, select: { user: 1, domain: 1, network: 1, testnet: 1, indexesCreated: 1, created_by: 1 } },
    );

    if (findData.docs.length == 0) throw errs.NOT_FOUND(`No data found`);

    return { result: findData };
  }

  public async create(walletData: CreateRequest): Promise<CreateResponse> {
    const findDomain: Domain = await this.domains.findById(walletData.domain);
    if (!findDomain) throw errs.VALIDATION(`This domain ${walletData.domain} not exists`);
    if (findDomain.status !== DomainStatus.ACTIVE) throw errs.VALIDATION(`This domain has a status of ${findDomain.status}`);

    const findUser: User = await this.users.findOne({ _id: walletData.user, domains: walletData.domain });
    if (!findUser) throw errs.VALIDATION(`This user ${walletData.user} not exists or not related with the domain ${walletData.domain}`);
    if (findUser.status !== UserStatus.ACTIVE) throw errs.VALIDATION(`This user has a status of ${findUser.status}`);

    const { network, domain, user } = walletData;

    const testnet = 'false'; //bypass network testnet

    const currencyKey = Object.keys(SupportedNetwork).find(key => SupportedNetwork[key as keyof typeof SupportedNetwork] === network);

    if (!currencyKey) {
      throw errs.VALIDATION(`Invalid blockchain specified`);
    }

    const currency = Currency[currencyKey as keyof typeof Currency];
    if (!currency) {
      throw errs.VALIDATION(`Invalid blockchain specified`);
    }

    // const existingWallet = await this.wallets.find({ network: walletData.network, domain: walletData.domain });
    // console.log({ network: walletData.network, domain: walletData.domain });
    // if (existingWallet.length >= parseInt(MAX_WALLET_PER_DOMAIN_NETWORK)) {
    //   throw errs.VALIDATION(
    //     `Max wallet size for network ${walletData.network} and domain ${walletData.domain} reached. (${MAX_WALLET_PER_DOMAIN_NETWORK})`,
    //   );
    // }

    const blockchainService = new BlockchainService(testnet, walletData.network);
    const externalService = await blockchainService.createMnemonicAndXPub();

    const data = {
      user: user,
      domain: domain,
      network: network,
      testnet: testnet,
      mnemonic: externalService.mnemonic,
      xpub: externalService.xpub,
    };

    const createWalletData: Mnemonic = await this.mnemonics.create(data);
    createWalletData.mnemonic = '*****************';
    createWalletData.xpub = '*****************';

    return createWalletData;
  }

  // public async createNodeWallet(walletData: CreateRequest): Promise<any> {
  //   const findDomain: Domain = await this.domains.findById(walletData.domain);
  //   if (!findDomain) throw errs.VALIDATION(`This domain ${walletData.domain} not exists`);
  //   if (findDomain.status !== DomainStatus.ACTIVE) throw errs.VALIDATION(`This domain has a status of ${findDomain.status}`);

  //   // TODO: check if user is in domain

  //   const { network, domain, user, testnet } = walletData;

  //   const currencyKey = Object.keys(SupportedNetwork).find(key => SupportedNetwork[key as keyof typeof SupportedNetwork] === network);

  //   if (!currencyKey) {
  //     throw errs.VALIDATION(`Invalid blockchain specified`);
  //   }

  //   const currency = Currency[currencyKey as keyof typeof Currency];
  //   if (!currency) {
  //     throw errs.VALIDATION(`Invalid blockchain specified`);
  //   }

  //   // const existingWallet = await this.wallets.find({ network: walletData.network, domain: walletData.domain });
  //   // console.log({ network: walletData.network, domain: walletData.domain });
  //   // if (existingWallet.length >= parseInt(MAX_WALLET_PER_DOMAIN_NETWORK)) {
  //   //   throw errs.VALIDATION(
  //   //     `Max wallet size for network ${walletData.network} and domain ${walletData.domain} reached. (${MAX_WALLET_PER_DOMAIN_NETWORK})`,
  //   //   );
  //   // }

  //   const nodeService = new ETHNodeService(ETH_NODE);
  //   const externalService = await nodeService.createWallet();

  //   return externalService;
  //   // const data = {
  //   //   user: user,
  //   //   domain: domain,
  //   //   network: network,
  //   //   testnet: testnet,
  //   //   mnemonic: externalService.mnemonic,
  //   //   xpub: externalService.xpub,
  //   //   etherscanLink: externalService.etherscanLink,
  //   // };

  //   // //const createWalletData: Mnemonic = await this.mnemonics.create(data);

  //   // return createWalletData;
  // }

  // public async createVirtualAccount(walletData: CreateVARequest): Promise<any> {
  //   const findDomain: Domain = await this.domains.findById(walletData.domain);
  //   if (!findDomain) throw errs.VALIDATION(`This domain ${walletData.domain} not exists`);
  //   if (findDomain.status !== DomainStatus.ACTIVE) throw errs.VALIDATION(`This domain has a status of ${findDomain.status}`);

  //   // TODO: check if user is allowed to create VA
  //   const { network, testnet } = walletData;

  //   const currencyKey = Object.keys(SupportedNetwork).find(key => SupportedNetwork[key as keyof typeof SupportedNetwork] === network);

  //   if (!currencyKey) {
  //     throw errs.VALIDATION(`Invalid blockchain specified`);
  //   }

  //   const currency = Currency[currencyKey as keyof typeof Currency];
  //   if (!currency) {
  //     throw errs.VALIDATION(`Invalid currency specified`);
  //   }

  //   const blockchainService = new BlockchainService(testnet, walletData.network);
  //   const virtualAccount = await blockchainService.createVirtualWallet(walletData);

  //   // TODO: save va to db
  //   return virtualAccount;
  // }

  // public async engageToVirtualAccount(walletData: EngageRequest): Promise<any> {
  //   const findDomain: Domain = await this.domains.findById(walletData.domain);
  //   if (!findDomain) throw errs.VALIDATION(`This domain ${walletData.domain} not exists`);
  //   if (findDomain.status !== DomainStatus.ACTIVE) throw errs.VALIDATION(`This domain has a status of ${findDomain.status}`);

  //   const { network } = walletData;

  //   const testnet = 'false'; // bypass network testnet

  //   const userWallet: Wallet & { currency: string } = await this.wallets.findOne({ ...walletData }); // TODO: check currency interfece

  //   if (!userWallet) throw errs.VALIDATION(`This wallet not exists`);

  //   const blockchainService = new BlockchainService(testnet, walletData.network);
  //   const virtualAccount = await blockchainService.engageToVirtualAccount(userWallet);

  //   // TODO: save va to db
  //   return virtualAccount;
  // }
}

export default WalletService;
