import { IsOptional, IsString } from 'class-validator';
import { Trimmed } from 'src/common/decorators/trimed.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class QueryProductDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Trimmed()
  keyword: string;

  @IsString()
  @IsOptional()
  @Trimmed()
  categories: string; // multiple _id joined with `,`
}
