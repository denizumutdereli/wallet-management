import { REFRESH_SECRET_KEY, SECRET_KEY } from '@/config';
import { errs } from '@/exceptions/HttpException';
import i18n from '@/i18n';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import RedisClient from '@/utils/redis';
import jwt, { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { config } from './token.config';
import { TokenValidator } from './token.validator';

export interface TokenService {
  createToken(user: User): Promise<TokenData>;
  createCookie(tokenData: TokenData): Promise<string>;
  revokeToken(user: User): Promise<boolean>;
  verifyToken(token: string, type: string): Promise<DataStoredInToken>;
}

export function initTokenService(user: Model<User>): TokenService {
  const service = new TokenValidator(new Service(user));
  return service;
}

class Service implements TokenService {
  redis: RedisClient;
  constructor(private readonly user: Model<User>) {
    this.redis = new RedisClient();
  }

  public async createToken(user: User): Promise<TokenData> {
    const dataStoredInToken: DataStoredInToken = { id: user.id.toString(), email: user.email, role: user.role, domain: user.domain };
    const secretKey: string = SECRET_KEY;
    const refreshTokenSecret: string = REFRESH_SECRET_KEY;

    const expiresIn: number = Date.now() + config.tokenLife;
    const refreshTokenExpiresIn: number = Date.now() + config.refreshTokenLife;

    const token = sign(dataStoredInToken, secretKey, { expiresIn });
    const refreshToken = sign(dataStoredInToken, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });

    const response = {
      accessToken: token,
      refreshToken: refreshToken,
      expires: {
        accessToken: config.tokenLife,
        refreshToken: config.refreshTokenLife,
      },
      expiresIn: {
        accessToken: await this.expireIn(config.tokenLife),
        refreshToken: await this.expireIn(config.refreshTokenLife),
      },
    };

    //redis tokens
    this.redis.setKeyValue(dataStoredInToken.id, response);

    return response;
  }

  public async expireIn(minutes: number): Promise<number> {
    const now = new Date();
    const expiresIn = new Date(now.getTime() + minutes * 1000);
    //return Math.floor(expiresIn.getTime() / 1000);
    return expiresIn.getTime();
  }

  public async createCookie(tokenData: TokenData): Promise<string> {
    return `Authorization=${tokenData.accessToken}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public async revokeToken(user: User): Promise<boolean> {
    try {
      this.redis.deleteKey(user.id.toString());
      return true;
    } catch (error) {
      throw errs.UNAUTHORIZED(error);
    }
  }

  public async verifyToken(token: string, type = 'refresh'): Promise<DataStoredInToken> {
    const secret = type !== 'refresh' ? config.api_secret : config.refreshTokenSecret;
    try {
      const decoded = await new Promise<DataStoredInToken>((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded as DataStoredInToken);
          }
        });
      });

      const redisToken = await this.redis.getKeyValue(decoded.id);
      if (!redisToken) {
        throw errs.UNAUTHORIZED(i18n.t('LOGIN.TOKENEXPIRED'));
      }

      const expiresIn = type === 'refresh' ? redisToken.expiresIn.refreshToken : redisToken.expiresIn.accessToken;
      const tokenValue = type === 'refresh' ? redisToken.refreshToken : redisToken.accessToken;

      if (tokenValue !== token) {
        throw errs.UNAUTHORIZED(i18n.t('LOGIN.TOKENEXPIREDORINVALID'));
      }

      if (expiresIn - Date.now() <= 0) {
        console.log(expiresIn, Date.now(), expiresIn - Date.now());
        throw errs.UNAUTHORIZED(i18n.t('LOGIN.TOKENEXPIRED'));
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw errs.UNAUTHORIZED(error.message);
      } else {
        throw errs.UNAUTHORIZED(error);
      }
    }
  }
}
