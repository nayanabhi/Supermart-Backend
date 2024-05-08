import { Products } from '../dto/product.dto';
import { ProductService } from './product.service';
import { Product } from '../schema/product.entity';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';


@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get("/all")
  async getAllProducts(@Query('searchText') searchText): Promise<Product[]> {
    return this.productService.getAllProducts(searchText);
  }

  @Get("/:id")
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(+id);
  }

  @Post("/createProduct")
  async createProduct(@Body() product: Products): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Put("/updateProduct/:id")
  async updateProduct(@Param('id') id: string, @Body() product: Products): Promise<Product> {
    return this.productService.updateProduct(+id, product);
  }

  @Delete("/deleteProduct/:id")
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(+id);
  }
}
