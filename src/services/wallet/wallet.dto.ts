import { SupportedNetwork } from '@/enums/wallet.enums';
import { Wallet } from '@/interfaces/wallet.interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { PaginateResult } from 'mongoose';
import { Paggination } from '../common/paggination'; //TODO: @service

export class CreateRequest {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  user: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  domain: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly customerId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SupportedNetwork)
  readonly network: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly mainWallet?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['true', 'false'])
  readonly testnet?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly created_by?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly updated_by?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly deletedBy?: string;
}

export class CreateResponse {
  id: string;
  user: string;
  domain: string;
  customerId: string;
  address: string;
  network: string;
  testnet: string;
  mainWallet: string;
  index: number;
  date?: () => number | Date;
  created_by?: string;
  updated_by?: string;
  deletedBy?: string;
}

export class SearchRequest extends Paggination {
  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly _id?: string; // interception of id vs _id property

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  user?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  domain?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  customerId?: string;

  @IsString()
  @IsOptional()
  @IsEnum(SupportedNetwork)
  readonly network?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly mainWallet?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(['true', 'false'])
  readonly testnet?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly address?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly index?: string;
}

export class SearchResponse {
  result: PaginateResult<Wallet>;
}

export class FindByIdRequest {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24,100}$/, { message: 'Invalid ID' })
  readonly id: string;
}
