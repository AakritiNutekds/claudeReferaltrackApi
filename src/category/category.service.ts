import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    CategoryDto
  } from './dto';
  
  @Injectable()
  export class categoryService {
    constructor(private prisma: PrismaService) {}
  
    getCategories() {
      return this.prisma.category.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    }
  
    getCategoryById(
      categoryId: number,
    ) {
      return this.prisma.category.findFirst({
        where: {
          categoryId: categoryId,
        },
      });
    }

    getCategoryByValue(
      value: string,
    ) {
      return this.prisma.category.findFirst({
        where: {
          value: value,
        },
      });
    }
  
    async createCategory(
      dto: CategoryDto,
    ) {
      const category =
        await this.prisma.category.create({
          data: {
            ...dto,
          },
        });
  
      return category;
    }
  
    async editCategoryById(
      categoryId: number,
      dto: CategoryDto,
    ) {
      // get the category by id
      const category =
        await this.prisma.category.findUnique({
          where: {
            categoryId: categoryId,
          },
        });
  
      // check if user owns the category
      if (!category || category.categoryId !== categoryId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.category.update({
        where: {
          categoryId: categoryId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteCategoryById(
      categoryId: number,
    ) {
      const category =
        await this.prisma.category.findUnique({
          where: {
            categoryId: categoryId,
          },
        });
  
      // check if user owns the category
      if (!category || category.categoryId !== categoryId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.category.delete({
        where: {
          categoryId: categoryId,
        },
      });
    }
  }