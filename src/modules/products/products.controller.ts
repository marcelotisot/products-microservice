import { 
  Controller, 
  ParseUUIDPipe,
} from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../../common';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('create-product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('find-all-products')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('find-one-product')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('update-product')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(
      updateProductDto.id, 
      updateProductDto
    );
  }

  @MessagePattern('delete-product')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @MessagePattern('find-product-by-slug')
  findBySlug(@Payload('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
