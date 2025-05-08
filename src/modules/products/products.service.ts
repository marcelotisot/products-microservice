import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  OnModuleInit 
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './dto';
import { CategoriesService } from '../categories/categories.service';
import slugify from 'slugify';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  constructor(
    private readonly categoriesService: CategoriesService
  ) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createProductDto: CreateProductDto) {
    const { name, description, price, stock, sizes, categoryId } = createProductDto;

    const category = await this.categoriesService.findOne(categoryId);


    const product = await this.product.create({
      data: {
        name, description, price, stock, sizes,
        slug: slugify(name).toLowerCase().trim(),
        category: {
          connect: {
            id: category.id
          }
        }
      }
    });

    return product;
  }

  findAll() {
    return this.product.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'desc' },
      include: { category: true } 
    })
  }

  async findOne(id: string) {
    const product = await this.product.findUnique({
      where: { id, deleted: false },
      include: { category: true }
    });

    if(!product) 
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { name, description, price, stock, sizes, categoryId } = updateProductDto;

    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId);

      return this.product.update({
        where: { id },
        data: {
          name, description, price, stock, sizes,
          slug: name ? slugify(name).toLowerCase().trim() : undefined,
          category: {
            connect: {
              id: category.id
            }
          }
        }
      });
    }

    return this.product.update({
      where: { id },
      data: {
        name, description, price, stock, sizes,
        slug: name ? slugify(name).toLowerCase().trim() : undefined
      }
    });
  }

  async remove(id: string) {
    const product = await this.product.update({
      where: { id },
      data: { deleted: true }
    });

    return product;
  }
}
