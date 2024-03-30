import { Products } from '../dto/product.dto';
import { ProductService } from './product.service';
import { Product } from '../schema/product.entity';
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';


@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get(":id")
  async getUserById(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(+id);
  }

  @Post("createProduct")
  async createUser(@Body() product: Products): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Put("updateProduct/:id")
  async updateUser(@Param('id') id: string, @Body() product: Products): Promise<Product> {
    return this.productService.updateProduct(+id, product);
  }

  @Delete("deleteProduct/:id")
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(+id);
  }
}
