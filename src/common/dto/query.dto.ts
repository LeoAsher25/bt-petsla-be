import { IsBoolean, IsOptional, IsString } from 'class-validator';
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
  usesTypes: string; // multiple _id joined with `,`

  @IsString()
  @IsOptional()
  @Trimmed()
  petType: string; // one _id

  @IsBoolean()
  @IsOptional()
  isSpecial: boolean;
}
