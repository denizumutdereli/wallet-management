import { errs } from '@/exceptions/HttpException';
import { Domain } from '@/interfaces/domain.interface';
import validateAndTransform from '@/utils/validateAndTransform';
import { isValidObjectId } from 'mongoose';
import { ConfigRequest, CreateRequest, CreateResponse, FindByIdRequest, SearchRequest, SearchResponse } from './domain.dto';
import DomainService from './domain.service';

export class DomainValidator implements DomainService {
  constructor(private readonly service: DomainService) {}

  async create(req: CreateRequest): Promise<CreateResponse> {
    req = await validateAndTransform(CreateRequest, req, true);

    //config validation
    await validateAndTransform(ConfigRequest, req.config, true);

    return this.service.create(req);
  }

  async search(req: SearchRequest): Promise<SearchResponse> {
    req = await validateAndTransform(SearchRequest, req, false);
    return this.service.search(req);
  }

  async autocomplete(req: SearchRequest): Promise<SearchResponse> {
    req = await validateAndTransform(SearchRequest, req, false);
    return this.service.autocomplete(req);
  }

  async findDataById(req: FindByIdRequest): Promise<Domain> {
    req = await validateAndTransform(FindByIdRequest, req, true);

    return this.service.findDataById(req);
  }

  async update(data: Partial<Domain>): Promise<CreateResponse> {
    const req = await validateAndTransform(CreateRequest, data, true);

    return this.service.update(req);
  }

  async delete(dataId: FindByIdRequest): Promise<void> {
    if (!isValidObjectId(dataId)) {
      throw errs.VALIDATION('Invalid data ID');
    }

    return this.service.delete(dataId);
  }
}
