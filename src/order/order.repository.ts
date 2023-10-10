import { Order } from './entities/order.entity';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }
  async countDocuments(filter) {
    return this.orderModel.countDocuments(filter);
  }
}
