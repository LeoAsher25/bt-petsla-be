import { Document, FilterQuery, Model, QueryOptions } from 'mongoose';
import CommonConstants from 'src/common/constants/common.constants';

const generateUniqueIdReadable = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let idReadable = '';
  for (let i = 0; i < CommonConstants.ID_READABLE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    idReadable += characters[randomIndex];
  }
  return idReadable;
};

function hasIdReadableField(model: Model<any>): boolean {
  const schema = model.schema;
  return schema.paths.hasOwnProperty('idReadable');
}

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc): Promise<any> {
    if (hasIdReadableField(this.model)) {
      doc.idReadable = generateUniqueIdReadable();
    }
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T> {
    return this.model.findById(id, null, option);
  }

  findOne(
    filter: FilterQuery<T>,
    returnFields?: any,
    queryOptions?: QueryOptions,
  ): Promise<T> {
    return this.model.findOne(filter, returnFields, queryOptions).exec();
  }

  async getByCondition(
    filter,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  // async deleteOne(id: string) {
  //   return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  // }

  // async deleteMany(id: string[]) {
  //   return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  // }

  // async deleteByCondition(filter) {
  //   return this.model.deleteMany(filter);
  // }

  async findByConditionAndUpdate(filter, update) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, update);
  }

  // async updateMany(filter, update, option?: any | null, callback?: any | null) {
  //   return this.model.updateMany(filter, update, option);
  // }

  async findByIdAndUpdate(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  // async deleteMany(filter: any) {
  //   return this.model.deleteMany(filter);
  // }
}
