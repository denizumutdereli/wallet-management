import { Types } from 'mongoose';

export interface Mnemonic {
  id: string;
  user: string; //mongoose.Types.ObjectId;
  domain: string; //mongoose.Types.ObjectId;
  network: string;
  mnemonic: string;
  testnet: string;
  indexesCreated: number;
  xpub: string;
  etherscanLink?: string;
  date?: () => Date | number;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}
