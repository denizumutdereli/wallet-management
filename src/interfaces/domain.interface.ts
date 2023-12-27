import { DomainStatus } from '@/enums/domain.enums';
import { Types } from 'mongoose';

export interface Domain {
  id: string;
  name: string;
  callback: string;
  status: DomainStatus;
  config: Record<string, unknown>;
  date?: () => Date | number;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}
