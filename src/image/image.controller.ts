import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiImage } from 'src/common/decorators/api-image.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileResponse } from 'src/image/image.interface';
import { UserRepository } from 'src/user/user.repository';
import { ImageService } from './image.service';

enum ImageType {
  PRODUCTS = 'products',
  USERS = 'users',
}
@ApiBearerAuth()
@Controller('images')
@UseGuards(AuthGuard)
@ApiTags('Image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('upload')
  @ApiImage()
  @UseInterceptors(FileInterceptor('image'))
  async uploadOne(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
    @Query() type: ImageType,
  ): Promise<FileResponse> {
    if (!image) throw new BadRequestException('Không có ảnh nào được tải lên');
    const { mimetype, filename, originalname, size } = image;
    const user = await this.userRepository.findOne({
      _id: req.user.sub,
    });

    const createdImage = await this.imageService.create({
      filename,
      mimetype,
      originalname,
      size,
      owner: user,
    });

    return createdImage;
  }
}
