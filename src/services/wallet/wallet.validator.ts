import validateAndTransform from '@/utils/validateAndTransform';
import { CreateRequest, CreateResponse, SearchRequest, SearchResponse } from './wallet.dto';
import WalletService from './wallet.service';

export class WalletValidator implements WalletService {
  constructor(private readonly service: WalletService) {}

  async create(req: CreateRequest): Promise<CreateResponse> {
    req = await validateAndTransform(CreateRequest, req, true);

    return this.service.create(req);
  }

  async getWallet(req: CreateRequest): Promise<Partial<CreateResponse>> {
    req = await validateAndTransform(CreateRequest, req, true);

    return this.service.getWallet(req);
  }

  async getCustomerWallets(req: SearchRequest): Promise<Partial<CreateResponse>[]> {
    req = await validateAndTransform(SearchRequest, req, true);

    return this.service.getCustomerWallets(req);
  }

  async getNetworkWallets(req: SearchRequest): Promise<Partial<CreateResponse>[]> {
    req = await validateAndTransform(SearchRequest, req, true);

    return this.service.getNetworkWallets(req);
  }

  async search(req: SearchRequest): Promise<SearchResponse> {
    console.log('req', req);
    req = await validateAndTransform(SearchRequest, req, false);
    return this.service.search(req);
  }

  // async getBalance(req: CreateRequest): Promise<Partial<CreateResponse>> {
  //   req = await validateAndTransform(CreateRequest, req, true);

  //   return this.service.getBalance(req);
  // }

  // async subscribe(req: any): Promise<any> {
  //   req = await validateAndTransform(CreateRequest, req, true);

  //   return this.service.subscribe(req);
  // }

  // async autocomplete(req: SearchRequest): Promise<SearchResponse> {
  //   req = await validateAndTransform(SearchRequest, req, false);
  //   return this.service.autocomplete(req);
  // }

  // async findDataById(req: FindByIdRequest): Promise<Wallet> {
  //   req = await validateAndTransform(FindByIdRequest, req, true);

  //   return this.service.findDataById(req);
  // }

  // // async update(data: Partial<Wallet>): Promise<CreateResponse> {

  // //   const req = await validateAndTransform(UpdateRequest, data, true);

  // //   return this.service.update(req);
  // // }

  // async delete(dataId: string): Promise<void> {
  //   if (!isValidObjectId(dataId)) {
  //     throw errs.VALIDATION('Invalid data ID');
  //   }

  //   return this.service.delete(dataId);
  // }
}
