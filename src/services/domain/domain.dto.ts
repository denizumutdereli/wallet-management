import { IsObjectId } from '@/decorators/isObjectId';
import { DomainStatus, DomainTransports } from '@/enums/domain.enums';
import { Domain } from '@/interfaces/domain.interface';
import { Paggination } from '@/services/common/paggination';
import { IsBoolean, IsEnum, IsJSON, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PaginateResult, Types } from 'mongoose';

export type DomainDTO = Omit<Domain, '_id'>;

//TODO: customer error messages
export class CreateRequest {
  @IsString()
  public name: string;

  @IsString()
  @MinLength(6)
  public callback: string;

  @IsJSON()
  public config: any;

  @IsString()
  @IsEnum(DomainStatus)
  public status: string;

  @IsOptional()
  @IsObjectId()
  public created_by?: Types.ObjectId;
}

export class CreateResponse implements DomainDTO {
  id: string;
  name: string;
  callback: string;
  config: Record<string, unknown>;
  status: DomainStatus;
  date?: () => number | Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}

export class UpdateRequest {
  @IsString()
  @IsObjectId()
  readonly _id?: string; // interception of id vs _id property

  @IsString()
  public name: string;

  @IsString()
  @MinLength(6)
  public callback: string;

  @IsJSON()
  public config: any;

  @IsString()
  @IsEnum(DomainStatus)
  public status: string;
}

export class UpdateResponse implements DomainDTO {
  id: string;
  name: string;
  callback: string;
  config: Record<string, unknown>;
  status: DomainStatus;
  date?: () => number | Date;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}

export class SearchRequest extends Paggination {
  @IsString()
  @IsObjectId()
  private _id?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  public name?: string;

  @IsString()
  @IsEnum(DomainStatus)
  public status?: string;

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    this._id = value;
  }
}

export class SearchResponse {
  result: PaginateResult<Domain>;
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

export class ConfigRequest {
  @IsBoolean()
  public config: boolean;

  @IsNumber()
  public token_life: number;

  @IsBoolean()
  public white_list: boolean;

  @IsString()
  @MaxLength(255)
  public ips: string;

  @IsString()
  @IsEnum(DomainTransports)
  public transport: string;
}
