import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailerService } from 'src/emailer/emailer.service';
import { Order, OrderSchema } from 'src/order/entities/order.entity';
import { OrderRepository } from 'src/order/order.repository';
import { ProductFeedbackModule } from 'src/product-feedback/product-feedback.module';
import { ProductModule } from 'src/product/product.module';
import { ProductRepository } from 'src/product/product.repository';
import { UserModule } from 'src/user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
    UserModule,
    ProductFeedbackModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ProductRepository, EmailerService],
})
export class OrderModule {}
