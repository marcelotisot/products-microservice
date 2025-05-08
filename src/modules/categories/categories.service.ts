import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  OnModuleInit } from '@nestjs/common';

import { Category, PrismaClient } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('CategoriesService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const category = this.category.create({
      data: {
        slug: slugify(name).toLowerCase().trim(),
        ...createCategoryDto
      }
    });

    return category;
  }

  findAll() {
    return this.category.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const category = await this.category.findUnique({
      where: { id, deleted: false }
    });

    if(!category) 
      throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;

    return this.category.update({
      where: { id },
      data: {
        slug: name ? slugify(name).toLowerCase().trim() : undefined,
        ...updateCategoryDto
      }
    });
  }

  
  async remove(id: string) {
    const category = await this.category.update({
      where: { id },
      data: { deleted: true }
    });

    return category;
  }
}
