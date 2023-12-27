// import { SECRET_KEY } from '@/config';
import { SupportedNetwork } from '@/enums/wallet.enums';
import { Mnemonic } from '@/interfaces/mnemonics.interface';
import mongoose, { Model, PaginateModel, Schema, model } from 'mongoose';
// import encryption from 'mongoose-encryption';
import { BaseSchema } from './base.schema';

const mnemonicSchema: Schema = new BaseSchema({
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
  testnet: {
    type: Boolean,
    default: false,
  },
  indexesCreated: {
    type: Number,
    required: true,
    default: 0,
  },
  mnemonic: {
    type: String,
    required: true,
  },
  etherscanLink: {
    type: String,
    //required: true,
  },
  memo: {
    type: String,
    //required: true,
  },
  xpub: {
    type: String,
    required: true,
  },
});

// no exported interface

// mnemonicSchema.plugin(encryption, { secret: SECRET_KEY, encryptedFields: ['mnemonic', 'xpub'] });

mnemonicSchema.index({ apiuser: 1, apidomain: 1, network: 1, testnet: 1 }, { unique: false });

const mnemonicModel: Model<Mnemonic> & PaginateModel<Mnemonic> = model<Mnemonic>('Mnemonic', mnemonicSchema) as Model<Mnemonic> &
  PaginateModel<Mnemonic>;

export default mnemonicModel;
