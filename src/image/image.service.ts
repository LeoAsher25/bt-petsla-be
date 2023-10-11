import { ImageRepository } from './image.repository';
import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  create(createImageDto: CreateImageDto) {
    return this.imageRepository.create(createImageDto);
  }
}
