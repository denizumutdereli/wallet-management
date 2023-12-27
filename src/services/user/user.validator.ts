import { User } from '@/interfaces/users.interface';
import { CreateResponse, UpdateRequest, FindByIdRequest, SearchRequest, SearchResponse, CreateRequest } from './user.dto';
import UserService from './user.service';
import validateAndTransform from '@/utils/validateAndTransform';
import { isValidObjectId } from 'mongoose';
import { errs } from '@/exceptions/HttpException';
import { isStrongPassword } from 'class-validator';

export class UserValidator implements UserService {
  constructor(private readonly service: UserService) {}

  async create(req: CreateRequest): Promise<CreateResponse> {
    req = await validateAndTransform(CreateRequest, req, true);

    if (req.password !== req.verifyPassword) {
      throw new Error('password and verify password must match.');
    }

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

  async findDataById(req: FindByIdRequest): Promise<User> {
    req = await validateAndTransform(FindByIdRequest, req, true);

    return this.service.findDataById(req);
  }

  async update(data: UpdateRequest): Promise<CreateResponse> {
    // Make sure password is a strong password
    if (data.password && !isStrongPassword(data.password)) {
      throw errs.VALIDATION('Password is not strong enough');
    }

    const req = await validateAndTransform(UpdateRequest, data, true);

    return this.service.update(req);
  }

  async delete(dataId: string): Promise<void> {
    if (!isValidObjectId(dataId)) {
      throw errs.VALIDATION('Invalid data ID');
    }

    return this.service.delete(dataId);
  }
}
