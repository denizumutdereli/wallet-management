import { compare } from 'bcrypt';
import { ByeReponse, LoginRequest, LoginResponse } from './auth.dto';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { Model } from 'mongoose';
import { AuthValidator } from './auth.validator';
import { errs } from '@/exceptions/HttpException';
import { initTokenService } from '../token/token.service';
import userModel from '@/models/users.model';
import { DataStoredInToken } from '@/interfaces/auth.interface';

export interface AuthService {
  login(userData: LoginRequest): Promise<LoginResponse>;
  logout(decoded: DataStoredInToken): Promise<ByeReponse>;
  refresh(decoded: DataStoredInToken): Promise<LoginResponse>;
}

export function initAuthService(users: Model<User>): AuthService {
  const service = new AuthValidator(new Service(users));
  return service;
}

class Service implements AuthService {
  tokens: import('@services/token/token.service').TokenService;
  constructor(private readonly users: Model<User>) {
    this.tokens = initTokenService(userModel);
  }

  public async login(userData: LoginRequest): Promise<LoginResponse> {
    if (isEmpty(userData)) throw errs.VALIDATION('userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw errs.UNAUTHORIZED(`This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw errs.UNAUTHORIZED('Password is not matching');

    const tokenData = await this.tokens.createToken(findUser);
    const cookie = await this.tokens.createCookie(tokenData);

    return { cookie, token: tokenData };
  }

  public async refresh(decoded: DataStoredInToken): Promise<LoginResponse> {
    if (isEmpty(decoded)) throw errs.VALIDATION('userData is empty');

    const findUser: User = await this.users.findOne({ id: decoded.id });
    if (!findUser) throw errs.UNAUTHORIZED(`This user not found`);

    const tokenData = await this.tokens.createToken(findUser);
    const cookie = await this.tokens.createCookie(tokenData);

    return { cookie, token: tokenData };
  }

  public async logout(decoded: DataStoredInToken): Promise<ByeReponse> {
    if (isEmpty(decoded)) throw errs.VALIDATION('userData is empty');

    const findUser: User = await this.users.findOne({ id: decoded.id });
    if (!findUser) throw errs.UNAUTHORIZED(`This user not found`);

    await this.tokens.revokeToken(findUser);

    return { status: true, message: 'bye' };
  }
}

export default AuthService;
