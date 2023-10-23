import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryProductDto } from 'src/common/dto/query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Req() req, @Body() createProductDto: CreateProductDto) {
    console.log('createProductDt1o: ', createProductDto, req.body);
    return this.productService.create(req.body);
  }

  @Get()
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'categories', required: false })
  findAll(
    @Query() query: QueryProductDto,
    // @UnidecodeQuery({ fields: ['keyword'], dto: QueryProductDto })
    // query: QueryProductDto,
  ) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
