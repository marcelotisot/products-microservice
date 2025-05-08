import { 
  IsArray,
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  IsUUID, 
  Min 
} from "class-validator";

import { Type } from "class-transformer";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({
    maxDecimalPlaces: 4
  })
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
