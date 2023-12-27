import mongoose, { Schema } from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export class BaseSchema extends Schema {
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  constructor(sche: any) {
    super(
      {
        ...sche,
      },
      {
        timestamps: true,
      },
    );
    this.setCommonFields(sche);
    this.setCustomSerialization();
    this.setHooks();
    this.registerPlugins();
  }

  private setCommonFields(sche: any) {
    sche.id = true;

    sche.created_by = {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    };
    sche.updated_by = {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    };
    sche.date = {
      type: Date,
      default: Date.now,
    };
  }

  private setCustomSerialization() {
    this.set('toJSON', {
      virtuals: true,
      getters: true,
      transform: function (doc, ret: any) {
        doc.id = ret._id;
        delete ret._id;
        const sortedRet: any = { id: ret.id };
        const keys = Object.keys(ret)
          .filter(key => key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt')
          .sort();
        for (const key of keys) {
          sortedRet[key] = ret[key];
        }
        sortedRet.createdAt = ret.createdAt;
        sortedRet.updatedAt = ret.updatedAt;
        return sortedRet;
      },
    });
    this.set('toObject', { getters: true });
  }

  private setHooks() {
    this.pre('save', function (next) {
      console.log('default hook-save');
      next();
    });

    this.pre('update', function (next) {
      console.log('default hook-update');
      next();
    });

    this.pre('deleteOne', function (next) {
      console.log('default hook-deleteOne');
      next();
    });
  }

  private registerPlugins() {
    this.plugin(mongoose_delete, {
      overrideMethods: true,
      indexFields: 'all',
      validateBeforeDelete: true,
      deletedAt: true,
    });
    this.plugin(mongoosePaginate);
    this.plugin(aggregatePaginate);
  }
}
