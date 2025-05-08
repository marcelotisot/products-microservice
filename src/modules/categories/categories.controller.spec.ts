import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto } from '../../common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService
        }
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service create method with dto information', async () => {
    const dto: CreateCategoryDto = { name: 'Test category' };

    await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service findAll method with pagination dto', async () => {
    const dto: PaginationDto = { page: 1, limit: 10 };

    await controller.findAll(dto);

    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('should call service findOne method', async () => {
    const id = '202630dc-e808-4702-b4af-31d1c1cfbb41';

    await controller.findOne(id);

    expect(service.findOne).toHaveBeenCalledWith(id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should call service update method', async () => {
    const id = '202630dc-e808-4702-b4af-31d1c1cfbb41';

    const dto: UpdateCategoryDto = { name: 'Updated category' };

    await controller.update(id, dto);

    expect(service.update).toHaveBeenCalledWith(id, dto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('should call service remove method', async () => {
    const id = '202630dc-e808-4702-b4af-31d1c1cfbb41';

    await controller.remove(id);

    expect(service.remove).toHaveBeenCalledWith(id);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
