import { errs } from '@/exceptions/HttpException';
import { User } from '@/interfaces/users.interface';
import { Domain } from '@interfaces/domain.interface';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateRequest, CreateResponse, FindByIdRequest, SearchRequest, SearchResponse, UpdateResponse } from './domain.dto';
import { DomainValidator } from './domain.validator';

export interface DomainService {
  create(data: CreateRequest): Promise<CreateResponse>;
  search(data: SearchRequest): Promise<SearchResponse>;
  autocomplete(data: SearchRequest): Promise<SearchResponse>;
  findDataById(data: FindByIdRequest): Promise<Domain>;
  update(data: Partial<Domain>): Promise<CreateResponse>;
  delete(dataId: FindByIdRequest): Promise<void>;
}

export function initService(users: Model<User>, domains: Model<Domain> & PaginateModel<Domain>): DomainService {
  const service = new DomainValidator(new Service(users, domains));
  return service;
}
class Service implements DomainService {
  constructor(private readonly users: Model<User>, private readonly domains: Model<Domain> & PaginateModel<Domain>) {}

  public async create(domainData: CreateRequest): Promise<CreateResponse> {
    const findDomain: Domain = await this.domains.findOne({ name: domainData.name });
    if (findDomain) throw errs.VALIDATION(`This domain ${domainData.name} exists`);

    const configJSON = JSON.parse(domainData.config);
    delete domainData.config;

    const createDomainData: Domain = await this.domains.create({ ...domainData, config: configJSON });
    return createDomainData;
  }

  public async search(data: SearchRequest): Promise<SearchResponse> {
    const findData: PaginateResult<Domain> = await this.domains.paginate(
      { ...data },
      { page: data.page, limit: data.limit, select: { password: 0 } },
    );

    if (findData.docs.length == 0) throw errs.NOT_FOUND(`No data found`);

    return { result: findData };
  }

  public async autocomplete(data: SearchRequest): Promise<SearchResponse> {
    const findData: PaginateResult<Domain> = await this.domains.paginate(
      { email: { $regex: `${data.search}`, $options: 'i' } },
      { page: data.page, limit: data.limit, select: { password: 0 } },
    );

    if (findData.docs.length == 0) throw errs.NOT_FOUND(`No data found`);

    return { result: findData };
  }

  public async findDataById(data: FindByIdRequest): Promise<Domain | null> {
    const findData: Domain | null = await this.domains.findById(data, { __v: 0 });

    if (!findData) throw errs.NOT_FOUND(`No data found`);

    return findData;
  }

  public async update(data: Partial<Domain>): Promise<UpdateResponse> {
    const domainData = await this.domains.findById(data.id);

    if (!domainData) throw errs.NOT_FOUND(`No domain found`);

    const configJSON = domainData.config ? JSON.parse(data.config as any) : undefined;
    if (configJSON) {
      delete domainData.config;
    }

    const updatedDomainData = {
      ...data,
      ...(configJSON && { config: configJSON }),
    };

    const updatedDomain = await this.domains.findByIdAndUpdate(domainData._id, updatedDomainData, { new: true });

    return updatedDomain;
  }

  //TODO: DeleteRequest
  public async delete(dataId: FindByIdRequest): Promise<void> {
    const data: Domain = await this.domains.findById(dataId);
    if (!data) throw errs.NOT_FOUND(`Data not found with id ${dataId}`);
    await this.domains.findByIdAndDelete(dataId);
  }
}

export default DomainService;
