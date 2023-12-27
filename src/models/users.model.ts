import { Model, model, PaginateModel, Schema, Types } from 'mongoose';
import crypto from 'crypto-js';
import i18n from '@/i18n';
import { User } from '@interfaces/users.interface';
import { UserRoles, UserStatus } from '@/enums/user.enums';
import { BaseSchema } from './base.schema';
import { SECRET_KEY } from '@/config';
import { decryptString, encryptString } from '@/utils/encrypt';

const userSchema: Schema = new BaseSchema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, `${i18n.t('ISREQUIRED', { field: '{PATH}' })}`],
  },
  password: {
    type: String,
    required: [true, `${i18n.t('ISREQUIRED', { field: '{PATH}' })}`],
  },
  role: {
    type: String,
    enum: UserRoles,
    required: [true, `${i18n.t('ISREQUIRED', { field: '{PATH}' })}`],
    lowercase: true,
    immutable: false,
  },
  status: {
    type: String,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    immutable: false,
  },
  domain: {
    type: Types.ObjectId,
    immutable: false,
    required: true,
  },
});

userSchema.pre('save', function (next) {
  console.log('hook-save');
  next();
});

userSchema.pre('update', function (next) {
  console.log('hook-update');
  next();
});

userSchema.pre('deleteOne', function (next) {
  console.log('hook-deleteOne');
  next();
});

userSchema.index({ email: 1, domain: 1 }, { unique: true });

const userModel: Model<User> & PaginateModel<User> = model<User>('User', userSchema) as Model<User> & PaginateModel<User>;
export default userModel;
