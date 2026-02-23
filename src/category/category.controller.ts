import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { JwtGuard } from '../auth/guard';
  import { categoryService } from './category.service';
  import {
    CategoryDto
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('categories')
  export class categoryController {
    constructor(
      private categoryService: categoryService,
    ) {}
  
    @Get()
    getCategories() {
      return this.categoryService.getCategories(
      );
    }
  
    @Get(':id')
    getCategoryById(
      @Param('id', ParseIntPipe) categoryId: number,
    ) {
      return this.categoryService.getCategoryById(
        categoryId,
      );
    }

    @Get('getCategoryByValue/:value')
    getCategoryByValue(
      @Param('value') value: string,
    ) {
      return this.categoryService.getCategoryByValue(
        value,
      );
    }
  
    @Post()
    createCategory(
      @Body() dto: CategoryDto,
    ) {
      return this.categoryService.createCategory(
        dto,
      );
    }
  
    @Patch(':id')
    editCategoryById(
      @Param('id', ParseIntPipe) categoryId: number,
      @Body() dto: CategoryDto,
    ) {
      return this.categoryService.editCategoryById(
        categoryId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteCategoryById(
      @Param('id', ParseIntPipe) categoryId: number,
    ) {
      return this.categoryService.deleteCategoryById(
        categoryId,
      );
    }
  }