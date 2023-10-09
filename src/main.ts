import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.PREFIX_URL);

  const config = new DocumentBuilder()
    // .setBasePath('api/v1')
    .setTitle('PetsLa APIs Docs')
    .setDescription('This is APIs documentations for PestLa')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${process.env.PREFIX_URL}/docs`, app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
