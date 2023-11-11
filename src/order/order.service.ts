import { getPagingData } from './../common/utils/get-paging-data';
import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryDto } from 'src/common/dto/query.dto';
import { Product } from 'src/product/entities/product.entity';
import { ProductRepository } from 'src/product/product.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, customerId: string) {
    if (!createOrderDto.orderItems || createOrderDto.orderItems.length === 0) {
      throw new BadRequestException('No product is selected');
    }

    let totalCost = 0;

    for (const item of createOrderDto.orderItems) {
      console.log('createOrderDto: ', createOrderDto);
      const product: Product = await this.productRepository.findById(
        String(item.productId),
      );

      if (!product) {
        throw new BadRequestException(
          `Product with Id '${item.productId}' is not exist in store`,
        );
      }

      if (product.stock <= 0) {
        throw new BadRequestException(`'${item.name}' is out of stock`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `The quantity of '${item.name}' isn't enought`,
        );
      }

      // Update the stock of the product
      await this.productRepository.findByIdAndUpdate(item.productId, {
        stock: product.stock - item.quantity,
      });

      totalCost += product.price * item.quantity;
    }

    return this.orderRepository.create({
      ...createOrderDto,
      customerId,
      totalCost,
    });
  }

  findAll(query: QueryDto) {
    const { page, limit } = query;
    return this.orderRepository.getAndCount({}, '', {
      ...getPagingData(page, limit),
      sort: { createdAt: -1 },
    });
  }

  findOne(id: string) {
    return this.orderRepository.findById(id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
