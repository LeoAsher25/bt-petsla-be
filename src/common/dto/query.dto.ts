import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Trimmed } from 'src/common/decorators/trimed.decorator';

export class QueryProjectDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @Trimmed()
  keyword: string;
}
