import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/entities/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { ProductRepository } from 'src/product/product.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from 'src/product/product.module';
import { EmailerService } from 'src/emailer/emailer.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ProductRepository, EmailerService],
})
export class OrderModule {}
