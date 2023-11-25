import { PartialType } from '@nestjs/swagger';
import { CreateProductFeedbackDto } from './create-product-feedback.dto';

export class UpdateProductFeedbackDto extends PartialType(CreateProductFeedbackDto) {}
