import { 
  Controller, 
  ParseUUIDPipe
} from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto } from '../../common';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('create-category')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern('find-all-categories')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @MessagePattern('find-one-category')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @MessagePattern('update-category')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(
      updateCategoryDto.id, 
      updateCategoryDto
    );
  }

  @MessagePattern('delete-category')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
