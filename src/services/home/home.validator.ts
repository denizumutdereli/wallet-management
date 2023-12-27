import { CreateDefaultResponse } from './home.dto';
import { HomeService } from './home.service';
// import validateAndTransform from '@/utils/validateAndTransform';

export class HomeValidator implements HomeService {
  constructor(private readonly service: HomeService) {}

  async index(): Promise<CreateDefaultResponse> {
    // console.log('called');
    // req = await validateAndTransform(CreateUserRequest, req);

    return this.service.index();
  }

  async setup(): Promise<CreateDefaultResponse> {
    // console.log('called');
    // req = await validateAndTransform(CreateUserRequest, req);

    return this.service.setup();
  }

  async config(): Promise<CreateDefaultResponse> {
    // console.log('called');
    // req = await validateAndTransform(CreateUserRequest, req);

    return this.service.config();
  }

  // async wallet(): Promise<any> {
  //   // console.log('called');
  //   // req = await validateAndTransform(CreateUserRequest, req);

  //   return this.service.wallet();
  // }

  // async balance(address: string): Promise<any> {
  //   // console.log('called');
  //   // req = await validateAndTransform(CreateUserRequest, req);

  //   return this.service.balance(address);
  // }
}
