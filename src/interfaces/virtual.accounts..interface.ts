import { Types } from 'mongoose';

export interface VirtualAccounts {
  id: string;
  user: string; //mongoose.Types.ObjectId;
  domain: string; //mongoose.Types.ObjectId;
  network: string;
  testnet: string;
  accountNumber: string;
  accountCode: string;
  accountingCurrency: number;
  serviceId: string;
  currency: string;
  indexesCreated: number;
  date?: () => Date | number;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}
