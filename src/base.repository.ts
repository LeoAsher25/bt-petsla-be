import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
} from 'mongoose';
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

  async findById(
    id: string,
    projection?: ProjectionType<T> | null | undefined,
    option?: QueryOptions,
  ): Promise<T> {
    return this.model.findById(id, projection, option);
  }

  findOne(
    filter: FilterQuery<T>,
    returnFields?: any,
    queryOptions?: QueryOptions,
  ): Promise<T> {
    return this.model.findOne(filter, returnFields, queryOptions).exec();
  }

  async getByCondition(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T>,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, projection, options).populate(populate);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async getAndCount(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T>,
    populate?: any | null,
  ) {
    const totalRecords = await this.model.count(filter);
    const dataList = await this.model
      .find(filter, projection, options)
      .populate(populate);
    return {
      totalRecords,
      dataList,
    };
  }

  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  async findByConditionAndUpdate(filter, update) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, update);
  }

  async findByIdAndUpdate(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async count(filter?: FilterQuery<T>) {
    return this.model.count(filter);
  }
}
