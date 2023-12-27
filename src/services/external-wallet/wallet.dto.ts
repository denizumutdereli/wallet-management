import { IsObjectId } from '@/decorators/isObjectId';
import { SupportedNetwork } from '@/enums/wallet.enums';
import { Mnemonic } from '@/interfaces/mnemonics.interface';
import { Currency, Fiat } from '@tatumio/tatum';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { PaginateResult, Types } from 'mongoose';
import { Paggination } from '../common/paggination'; //TODO: @service

export class CreateRequest {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly user: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly domain: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SupportedNetwork) //internal
  readonly network: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['true', 'false'])
  readonly testnet: string;
}

export class CreateResponse {
  id: string;
  user: string;
  domain: string;
  network: string;
  indexesCreated: number;
  date?: () => number | Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}

export class SearchRequest extends Paggination {
  @IsString()
  @IsObjectId()
  public _id?: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly user: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly domain: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SupportedNetwork) //internal
  readonly network: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['true', 'false'])
  readonly testnet: string;

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
  result: PaginateResult<Mnemonic>;
}

export class CreateVARequest {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly user: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly domain: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SupportedNetwork) //internal
  readonly network: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['true', 'false'])
  readonly testnet: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Currency) //external
  readonly currency: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Fiat) //external
  readonly accountingCurrency: string;
}

export class EngageRequest {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly user: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly domain: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly customerId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SupportedNetwork)
  readonly network: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['true', 'false'])
  readonly testnet: string;
}

export class FindByIdRequest {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly id: string;
}
