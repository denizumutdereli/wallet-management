import { VirtualAccounts } from '@/interfaces/virtual.accounts..interface';
import mongoose, { Model, PaginateModel, Schema, model } from 'mongoose';
import { BaseSchema } from './base.schema';

const virtualAccountsSchema: Schema = new BaseSchema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  domain: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  network: {
    type: String,
    required: true,
  },
  testnet: {
    type: Boolean,
    default: false,
  },
  accountNumber: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  accountCode: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  accountingCurrency: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  indexesCreated: {
    type: Number,
    required: true,
    default: 0,
  },
});

const incrementIndexesCreated = async function (next: any) {
  try {
    const conditions = {
      apiuser: this.apiuser,
      apidomain: this.apidomain,
      network: this.network,
      testnet: this.testnet,
      currency: this.currency,
      accountingCurrency: this.accountingCurrency,
    };
    const count = await virtualAccoutnsModel.countDocuments(conditions);

    this.indexesCreated = count + 1;

    next();
  } catch (error) {
    next(error);
  }
};

virtualAccountsSchema.pre('save', incrementIndexesCreated);

//virtualAccountsSchema.plugin(encryption, { secret: SECRET_KEY, encryptedFields: ['currency', 'accountingCurrency', 'serviceId'] });

virtualAccountsSchema.index({ apiuser: 1, apidomain: 1, network: 1, testnet: 1, currency: 1, accountingCurrency: 1 }, { unique: true });
virtualAccountsSchema.index({ accountCode: 1 }, { unique: true });

const virtualAccoutnsModel: Model<VirtualAccounts> & PaginateModel<VirtualAccounts> = model<VirtualAccounts>(
  'VirtualAccounts',
  virtualAccountsSchema,
) as Model<VirtualAccounts> & PaginateModel<VirtualAccounts>;

export default virtualAccoutnsModel;
