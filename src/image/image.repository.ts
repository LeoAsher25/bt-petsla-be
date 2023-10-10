import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class ImageRepository extends BaseRepository<Image> {
  constructor(
    @InjectModel('Image')
    private readonly imageModel: Model<Image>,
  ) {
    super(imageModel);
  }
  async countDocuments(filter) {
    return this.imageModel.countDocuments(filter);
  }
}
