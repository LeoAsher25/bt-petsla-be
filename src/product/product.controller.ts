import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UnidecodeQuery } from 'src/common/decorators/unidecode-query.decorator';

import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { QueryProductDto } from 'src/product/dto/product-query.dto';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Req() req) {
    return this.productService.create(req.body);
  }

  @Get()
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'usesTypes', required: false })
  @ApiQuery({ name: 'petType', required: false })
  @ApiQuery({ name: 'isSpecial', required: false })
  findAll(
    // @Query() query: QueryProductDto,
    @UnidecodeQuery({
      fields: ['keyword', 'usesTypes', 'petType', 'isSpecial'],
      dto: QueryProductDto,
    })
    query: QueryProductDto,
  ) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
