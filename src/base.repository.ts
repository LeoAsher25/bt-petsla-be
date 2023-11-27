import {
  AggregateOptions,
  Document,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import CommonConstants from 'src/common/constants/common.constants';

const generateUniqueIdReadable = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
    return this.model.findOne(filter, returnFields, queryOptions).lean();
  }

  async findByCondition(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T>,
    populate?: any | null,
  ) {
    return await this.model
      .find(filter, projection, options)
      .populate(populate)
      .lean();
  }

  async findAll() {
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
      .populate(populate)
      .lean();
    return {
      totalRecords,
      dataList,
    };
  }

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
    return this.model.aggregate(pipeline, options);
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

  async updateOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T> | null,
  ) {
    return this.model.updateOne(filter, update, options);
  }

  async count(filter?: FilterQuery<T>) {
    return this.model.count(filter);
  }

  async delete(id: string) {
    return this.model.deleteOne({ _id: id });
  }
}
