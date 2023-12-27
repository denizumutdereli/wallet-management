// Local imports
import validateAndTransform from '@/utils/validateAndTransform';
import { CreateRequest, CreateResponse, SearchRequest, SearchResponse } from './wallet.dto';
import WalletService from './wallet.service';

export class WalletValidator implements WalletService {
  constructor(private readonly service: WalletService) {}

  async create(req: CreateRequest): Promise<CreateResponse> {
    req = await validateAndTransform(CreateRequest, req, true);

    return this.service.create(req);
  }

  async search(req: SearchRequest): Promise<SearchResponse> {
    req = await validateAndTransform(SearchRequest, req, false);
    return this.service.search(req);
  }

  /**
   * Validates and transforms the request data, then calls the WalletService create method
   * @function createNodeWallet
   * @memberof WalletValidator
   * @param {CreateRequest} req - The data required to create a wallet
   * @returns {Promise<CreateResponse>} - A promise that resolves to the created wallet
   * @throws {HttpException} - If the request data is invalid or the create method fails
   */

  // async createNodeWallet(req: CreateRequest): Promise<CreateResponse> {
  //   req = await validateAndTransform(CreateRequest, req, true);

  //   return this.service.createNodeWallet(req);
  // }

  /**
   * Validates and transforms the request data, then calls the WalletService createVirtualAccount method
   * @function createVirtualAccount
   * @memberof WalletValidator
   * @param {CreateRequest} req - The data required to create a virtual account
   * @returns {Promise<CreateResponse>} - A promise that resolves to the created virtual account
   * @throws {HttpException} - If the request data is invalid or the createVirtualAccount method fails
   */

  // async createVirtualAccount(req: CreateVARequest): Promise<CreateResponse> {
  //   req = await validateAndTransform(CreateVARequest, req, true);

  //   return this.service.createVirtualAccount(req);
  // }

  // async engageToVirtualAccount(req: EngageRequest): Promise<CreateResponse> {
  //   req = await validateAndTransform(EngageRequest, req, true);

  //   return this.service.engageToVirtualAccount(req);
  // }
}
