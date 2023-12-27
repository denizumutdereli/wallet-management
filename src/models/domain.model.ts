import { Model, model, PaginateModel, Schema } from 'mongoose';
import crypto from 'crypto-js';
import i18n from '@/i18n';
import { Domain } from '@interfaces/domain.interface';
import { DomainStatus } from '@/enums/domain.enums';
import { BaseSchema } from './base.schema';
import userModel from './users.model';

const domainSchema: Schema = new BaseSchema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, `${i18n.t('ISREQUIRED', { field: '{PATH}' })}`],
  },
  callback: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, `${i18n.t('ISREQUIRED', { field: '{PATH}' })}`],
  },
  status: {
    type: String,
    enum: DomainStatus,
    default: DomainStatus.ACTIVE,
    immutable: false,
  },
  config: { type: Schema.Types.Mixed, required: true },
});

/* Hooks */

const deleteUsersByDomain = async function (next: any) {
  try {
    const domainId = this.getQuery()._id;
    await userModel.deleteMany({ domain: domainId });
    next();
  } catch (error) {
    next(error);
  }
};

const updateUsersStatusByDomain = async function (next: any) {
  const update = this.getUpdate ? this.getUpdate() : this;
  if (update.status) {
    try {
      const domainId = this.getQuery ? this.getQuery()._id : update._id;
      await userModel.updateMany({ domain: domainId }, { status: update.status });
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};

domainSchema.pre('deleteOne', { document: false, query: true }, deleteUsersByDomain);
domainSchema.pre('remove', { document: false, query: true }, deleteUsersByDomain);
domainSchema.pre('save', updateUsersStatusByDomain);
domainSchema.pre('update', { document: false, query: true }, updateUsersStatusByDomain);
domainSchema.pre('findOneAndUpdate', { document: false, query: true }, updateUsersStatusByDomain);

const domainModal: Model<Domain> & PaginateModel<Domain> = model<Domain>('Domain', domainSchema) as Model<Domain> & PaginateModel<Domain>;
export default domainModal;
