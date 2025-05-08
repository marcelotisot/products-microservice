import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import slugify from 'slugify';
import { PaginationDto } from '../../common';

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

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const totalPages = await this.category.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.category.findMany({
        where: { deleted: false },
        orderBy: { createdAt: 'desc' },
        
        // Paginacion
        skip: (page - 1) * limit,
        take: limit
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }
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
