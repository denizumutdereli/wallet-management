import { UserStatus, UserRoles } from '@enums/user.enums';
import { Document, ObjectId, Types } from 'mongoose';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
  domain: string;
  date?: () => Date | number;
  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
}
