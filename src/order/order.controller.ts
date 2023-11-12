import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { UnidecodeQuery } from 'src/common/decorators/unidecode-query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('orders')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUserId() customerId: string,
  ) {
    console.log('createOrderDtocreateOrderDto: ', createOrderDto);
    return this.orderService.create(createOrderDto, customerId);
  }

  @Get()
  @ApiQuery({ name: 'keyword', required: false })
  findAll(
    // @Query() query: QueryProductDto,
    @UnidecodeQuery({
      fields: ['keyword'],
      dto: QueryDto,
    })
    query: QueryDto,
  ) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
