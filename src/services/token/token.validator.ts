import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { TokenService } from './token.service';
import { User } from '@/interfaces/users.interface';
import { JwtPayload } from 'jsonwebtoken';

export class TokenValidator implements TokenService {
  constructor(private readonly service: TokenService) {}

  async createToken(user: User): Promise<TokenData> {
    return this.service.createToken(user);
  }

  async createCookie(req: TokenData): Promise<string> {
    return this.service.createCookie(req);
  }
  async revokeToken(user: User): Promise<boolean> {
    return this.service.revokeToken(user);
  }
  async verifyToken(token: string, type: string): Promise<DataStoredInToken> {
    return this.service.verifyToken(token, type);
  }
}
