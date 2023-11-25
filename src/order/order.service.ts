import { ProductFeedbackRepository } from './../product-feedback/product-feedback.repository';
import { getPagingData } from './../common/utils/get-paging-data';
import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryDto } from 'src/common/dto/query.dto';
import { Product } from 'src/product/entities/product.entity';
import { ProductRepository } from 'src/product/product.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { EmailerService } from 'src/emailer/emailer.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly productFeedbackRepository: ProductFeedbackRepository,
    private readonly emailerService: EmailerService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: User) {
    if (!createOrderDto.orderItems || createOrderDto.orderItems.length === 0) {
      throw new BadRequestException('No product is selected');
    }

    if (createOrderDto.note.length > 500) {
      throw new BadRequestException(`Ghi chú chỉ được tối đa 500 kí tự`);
    }

    let totalCost = 0;

    for (const item of createOrderDto.orderItems) {
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

      totalCost += product.price * item.quantity;
    }

    const response = await this.orderRepository.create({
      ...createOrderDto,
      customerId: currentUser._id,
      totalCost,
    });

    this.emailerService.sendOrderSuccessEmail(
      currentUser.email,
      totalCost,
      createOrderDto,
    );
    for (const item of createOrderDto.orderItems) {
      // Update the stock of the product
      const product: Product = await this.productRepository.findById(
        String(item.productId),
      );

      await this.productRepository.findByIdAndUpdate(item.productId, {
        stock: product.stock - item.quantity,
      });
    }

    return response;
  }

  findAll(query: QueryDto, currentUser: User) {
    const { page, limit } = query;
    return this.orderRepository.getAndCount(
      {
        customerId: currentUser._id,
      },
      '',
      {
        ...getPagingData(page, limit),
        sort: { createdAt: -1 },
      },
    );
  }

  async findOne(id: string) {
    const order = await (await this.orderRepository.findById(id)).toObject();
    if (!order) return order;

    const feedbackList = await this.productFeedbackRepository.findByCondition(
      {
        order: id,
      },
      null,
      null,
      [
        {
          path: 'product',
          select: 'name image',
        },
      ],
    );

    console.log('feedbackList: ', feedbackList, id);

    return {
      ...order,
      feedbackList,
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const response = await this.orderRepository.findByIdAndUpdate(
        id,
        updateOrderDto,
      );

      const responseOrder = {
        ...response.toObject(),
        ...updateOrderDto,
      };

      return responseOrder;
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
