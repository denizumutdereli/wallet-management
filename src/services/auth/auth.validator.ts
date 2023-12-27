import { ByeReponse, LoginRequest, LoginResponse } from './auth.dto';
import AuthService from './auth.service';
import validateAndTransform from '@/utils/validateAndTransform';
import { DataStoredInToken } from '@/interfaces/auth.interface';

export class AuthValidator implements AuthService {
  constructor(private readonly service: AuthService) {}

  async login(req: LoginRequest): Promise<LoginResponse> {
    req = await validateAndTransform(LoginRequest, req, true);
    return this.service.login(req);
  }

  async logout(req: DataStoredInToken): Promise<ByeReponse> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.service.logout(req);
  }

  async refresh(req: DataStoredInToken): Promise<LoginResponse> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.service.refresh(req);
  }
}
