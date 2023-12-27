import mongoose, { Model, PaginateModel, Schema, model } from 'mongoose';
import { BaseSchema } from './base.schema';
// import { SECRET_KEY } from '@/config';
import { SupportedNetwork } from '@/enums/wallet.enums';
import { Wallet } from '@/interfaces/wallet.interface';
// import encryption from 'mongoose-encryption';

const WalletsSchema: Schema = new BaseSchema({
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
    enum: SupportedNetwork,
  },
  customerId: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  testnet: {
    type: Boolean,
    default: false,
  },
  mainWallet: {
    type: String,
    required: true,
  },
  index: {
    type: String,
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
      mainWallet: this.mainWallet,
    };
    const count = await walletModel.countDocuments(conditions);

    this.index = count + 1;

    next();
  } catch (error) {
    next(error);
  }
};

WalletsSchema.pre('save', incrementIndexesCreated);

// WalletsSchema.pre('update', function (next) {
//   console.log('hook-update');
//   next();
// });

// WalletsSchema.pre('deleteOne', function (next) {
//   console.log('hook-deleteOne');
//   next();
// });

// WalletsSchema.plugin(encryption, { secret: SECRET_KEY, encryptedFields: ['address', 'index'] });

WalletsSchema.index({ network: 1, domain: 1, user: 1, testnet: 1, customerId: 1 }, { unique: true });

const walletModel: Model<Wallet> & PaginateModel<Wallet> = model<Wallet>('Wallet', WalletsSchema) as Model<Wallet> & PaginateModel<Wallet>;
export default walletModel;
