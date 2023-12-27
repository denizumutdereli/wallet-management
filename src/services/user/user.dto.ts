import { IsEmail, IsString, MinLength, IsEnum, MaxLength, IsStrongPassword, Validate, IsOptional } from 'class-validator';
import { PaginateResult, Types } from 'mongoose';

import { UserRoles, UserStatus } from '@/enums/user.enums';
import { User } from '@/interfaces/users.interface';
import { Paggination } from '@/services/common/paggination'; //TODO: @service
import { IsObjectId } from '@/decorators/isObjectId';
import { isMatchedPassword } from '@/decorators/isMatchedPassword';
import { ConditionalFieldsValidator } from '@/decorators/isVerifyPasswordConditionMatch';

export type UserDTO = Omit<User, 'password'>;

export class CreateRequest {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @IsStrongPassword()
  public password: string;

  @IsString()
  @MinLength(6)
  @isMatchedPassword('password')
  public verifyPassword: string;

  @IsString()
  @IsObjectId()
  public domain: string;

  @IsString()
  @IsEnum(UserRoles)
  public role: string;

  @IsString()
  @IsEnum(UserStatus)
  public status: string;

  @IsOptional()
  @IsObjectId()
  public created_by?: Types.ObjectId;
}

export class UpdateRequest {
  @IsString()
  @IsObjectId()
  public _id?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(10)
  @IsStrongPassword()
  public password?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @isMatchedPassword('password')
  public verifyPassword?: string;

  @IsString()
  @IsOptional()
  @IsObjectId()
  public domain?: string;

  @IsString()
  @IsEnum(UserRoles)
  @IsOptional()
  public role?: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserStatus)
  public status?: string;

  @IsOptional()
  @IsObjectId()
  public updated_by?: Types.ObjectId;

  @Validate(ConditionalFieldsValidator)
  _conditionalFieldsValidator?: never;

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    this._id = value;
  }
}

export class CreateResponse implements UserDTO {
  id: string;
  email: string;
  role: UserRoles;
  status: UserStatus;
  domain: string;
  date?: () => number | Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}

export class SearchRequest extends Paggination {
  @IsString()
  @IsObjectId()
  public _id?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  @IsObjectId()
  public domain?: string;

  @IsString()
  @IsEnum(UserRoles)
  @IsOptional()
  public role?: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserStatus)
  public status?: string;

  @IsOptional()
  @IsObjectId()
  public created_by?: Types.ObjectId;

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    this._id = value;
  }
}

export class SearchResponse {
  result: PaginateResult<User>;
}

export class FindByIdRequest {
  @IsString()
  @IsObjectId()
  private _id?: string;

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    this._id = value;
  }
}
