import { DomainStatus } from '@/enums/domain.enums';
import { errs } from '@/exceptions/HttpException';
import { Domain } from '@/interfaces/domain.interface';
import { User } from '@interfaces/users.interface';
import { hash } from 'bcrypt';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateRequest, CreateResponse, FindByIdRequest, SearchRequest, SearchResponse, UpdateRequest } from './user.dto';
import { UserValidator } from './user.validator';

export interface UserService {
  create(data: CreateRequest): Promise<CreateResponse>;
  search(data: SearchRequest): Promise<SearchResponse>;
  autocomplete(data: SearchRequest): Promise<SearchResponse>;
  findDataById(data: FindByIdRequest): Promise<User>;
  update(data: UpdateRequest): Promise<CreateResponse>;
  delete(dataId: string): Promise<void>;
}

export function initService(users: Model<User> & PaginateModel<User>, domains: Model<Domain>): UserService {
  const service = new UserValidator(new Service(users, domains));
  return service;
}

class Service implements UserService {
  constructor(private readonly users: Model<User> & PaginateModel<User>, private readonly domains: Model<Domain>) {}

  public async create(data: CreateRequest): Promise<CreateResponse> {
    const findData: User = await this.users.findOne({ email: data.email });
    if (findData) throw errs.VALIDATION(`This email ${data.email} already exists`);

    const findDomain: Domain = await this.domains.findById(data.domain);
    if (!findDomain) throw errs.VALIDATION(`This domain ${data.domain} not exists`);
    if (findDomain.status !== DomainStatus.ACTIVE) throw errs.VALIDATION(`This domain has a status of ${findDomain.status}`);

    const hashedPassword = await hash(data.password, 10);
    const createUserData: User = await this.users.create({ ...data, password: hashedPassword });
    createUserData.password = '**********';
    return createUserData;
  }

  public async search(data: SearchRequest): Promise<SearchResponse> {
    const findData: PaginateResult<User> = await this.users.paginate({ ...data }, { page: data.page, limit: data.limit, select: { password: 0 } });

    if (findData.docs.length == 0) throw errs.NOT_FOUND(`No data found`);

    return { result: findData };
  }

  public async autocomplete(data: SearchRequest): Promise<SearchResponse> {
    const findData: PaginateResult<User> = await this.users.paginate(
      { email: { $regex: `${data.search}`, $options: 'i' } },
      { page: data.page, limit: data.limit, select: { password: 0 } },
    );

    if (findData.docs.length == 0) throw errs.NOT_FOUND(`No data found`);

    return { result: findData };
  }

  public async findDataById(data: FindByIdRequest): Promise<User | null> {
    const findData: User | null = await this.users.findById(data, { password: 0 });

    if (!findData) throw errs.NOT_FOUND(`No data found`);

    return findData;
  }

  public async update(data: UpdateRequest): Promise<CreateResponse> {
    const user: User = await this.users.findById(data.id);
    if (!user) throw errs.NOT_FOUND(`Data not found with id ${data.id}`);

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const updatedUser: User = await this.users.findByIdAndUpdate(data.id, data, { new: true });
    updatedUser.password = '**********';
    return updatedUser;
  }

  public async delete(dataId: string): Promise<void> {
    const data: User = await this.users.findById(dataId);
    if (!data) throw errs.NOT_FOUND(`Data not found with id ${dataId}`);
    await this.users.findByIdAndDelete(dataId);
  }
}

export default UserService;
