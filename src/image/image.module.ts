import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Image, ImageSchema } from 'src/image/entities/image.entity';
import { ImageRepository } from 'src/image/image.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        limits: {
          fileSize: 1024 * 1024 * parseInt(process.env.MAX_FILE_SIZE),
        },
        storage: diskStorage({
          filename: (req, file, callback) => {
            let name = file.originalname.split('.').slice(0, -1).join('.'); // remove extension of the file
            name = name.split(/\s+/).join('-'); // remove space between words in name
            const fileExtName = extname(file.originalname);
            callback(null, `${name}_${Date.now()}${fileExtName}`);
          },
          destination: (req, file, cb) => {
            const imageType = req?.query?.imageType || 'products';
            cb(null, `./${process.env.IMAGE_UPLOAD_DIR}/${imageType}`);
          },
        }),
      }),
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService, UserRepository, ImageRepository],
})
export class ImageModule {}
