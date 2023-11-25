import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UnidecodeQuery } from 'src/common/decorators/unidecode-query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('orders')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.orderService.create(createOrderDto, currentUser);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'keyword', required: false })
  findAll(
    @GetCurrentUser() currentUser: User,
    // @Query() query: QueryProductDto,
    @UnidecodeQuery({
      fields: ['keyword'],
      dto: QueryDto,
    })
    query: QueryDto,
  ) {
    return this.orderService.findAll(query, currentUser);
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
