import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Trimmed } from 'src/common/decorators/trimed.decorator';
import { QueryDto } from 'src/common/dto/query.dto';

export class QueryProductDto extends QueryDto {
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
