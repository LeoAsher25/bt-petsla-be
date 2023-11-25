import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductFeedbackService } from './product-feedback.service';
import { CreateProductFeedbackDto } from './dto/create-product-feedback.dto';
import { UpdateProductFeedbackDto } from './dto/update-product-feedback.dto';

@Controller('product-feedback')
export class ProductFeedbackController {
  constructor(
    private readonly productFeedbackService: ProductFeedbackService,
  ) {}

  @Post()
  create(@Body() createProductFeedbackDto: CreateProductFeedbackDto) {
    return this.productFeedbackService.create(createProductFeedbackDto);
  }

  @Get()
  findAllByProduct(@Query('productId') productId: string) {
    return this.productFeedbackService.findAllByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFeedbackService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductFeedbackDto: UpdateProductFeedbackDto,
  ) {
    return this.productFeedbackService.update(id, updateProductFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFeedbackService.remove(+id);
  }
}
