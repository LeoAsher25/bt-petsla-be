import { Test, TestingModule } from '@nestjs/testing';
import { ProductFeedbackController } from './product-feedback.controller';
import { ProductFeedbackService } from './product-feedback.service';

describe('ProductFeedbackController', () => {
  let controller: ProductFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFeedbackController],
      providers: [ProductFeedbackService],
    }).compile();

    controller = module.get<ProductFeedbackController>(ProductFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
