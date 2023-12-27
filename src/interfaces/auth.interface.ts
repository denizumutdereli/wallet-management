import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { UserRoles, UserStatus } from '@/enums/user.enums';
import { ObjectId } from 'mongoose';
import { DomainStatus } from '@/enums/domain.enums';
import { Domain } from '@interfaces/domain.interface';

export interface DataStoredInToken {
  [x: string]: any;
  id: string;
  email: string;
  domain?: string;
  domainName?: string;
  domainStatus?: DomainStatus;
  role: UserRoles;
  status?: UserStatus;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expires: {
    accessToken: number;
    refreshToken: number;
  };
  expiresIn: {
    accessToken: number;
    refreshToken: number;
  };
}

export interface RequestWithUser extends Request {
  req: import('mongoose').Query<any, any, {}, any>;
  decoded: any;
  user?: User;
  domain?: Domain;
}
