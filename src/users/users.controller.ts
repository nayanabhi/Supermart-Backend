import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { ValidateUser } from '../dto/userValidate.dto';
import { Users } from '../dto/users.dto';
import { User } from '../schema/users.entity';
import { UsersService } from './users.service';
import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query } from '@nestjs/common';
import { Product } from 'src/schema/product.entity';


@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("createUser")
  async createUser(@Body() user: Users): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Get("all")
  async getAllUser(): Promise<User[]> {
    return this.usersService.getAllUser();
  }

  @Post("updatePassword")
  async updatePassword(@Req() req: Request, @Body() formData): Promise<User> {
    return this.usersService.updatePassword(formData.email, formData.password);
  }

  @Put("updateUser")
  async updateUser(@Req() req: Request, @Body() user: Users): Promise<User> {
    const userId = req['user'].sub;
    return this.usersService.updateUser(userId, user);
  }

  @Delete("delete/:id")
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(+id);
  }

  @Get("price/:id") 
  async getPrice(@Param('id') id: string, @Req() req: Request): Promise<ProductSellerMapping[]> {
    const userId = req['user'].sub;
    return this.usersService.getPrice(+id, userId);
  }

  @Post("addProduct/:id") 
  async addProduct(@Param('id') id: string, @Req() req: Request): Promise<ProductSellerMapping> {
    const userId = req['user'].sub;
    return this.usersService.addProduct(+id, userId);
  }

  @Post("updateProductStatus") 
  async updateProductStatus(@Req() req: Request, @Body() formData): Promise<ProductSellerMapping> {
    const userId = req['user'].sub;
    return this.usersService.updateProductStatus(formData.productId, userId, formData.status, formData.price);
  }

  @Get("getProductStatus/:id") 
  async getProductStatus(@Param('id') productId: string, @Req() req: Request, ): Promise<ProductSellerMapping> {
    const userId = req['user'].sub;
    return this.usersService.getProductSellerEntry(userId, productId);
  }

  @Get("getProductStatus/:userId/:productId") 
  async getUserProductStatus(@Param('userId') userId: string, @Param('productId') productId: string, @Req() req: Request, ): Promise<ProductSellerMapping> {
    return this.usersService.getProductSellerEntry(+userId, productId);
  }

  @Post("removeProduct/:id") 
  async removeProduct(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].sub;
    return this.usersService.removeProduct(+id, userId);
  }

  @Get("getAvailableSellers/:productId")
  async getAvailableSellers(@Param('productId') productId: string) {
    return this.usersService.getAvailableSellers(productId);
  }
 
  @Get("selectedProducts") 
  async selectedProducts(@Req() req: Request, @Query() query: any): Promise<Product[]> {
    const userId = req['user'].sub;
    const searchText = query?.searchText || "";
    return this.usersService.getSelectedProducts(userId, searchText);
  }

  @Get("unSelectedProducts") 
  async unSelectedProducts(@Req() req: Request, @Query() query: any): Promise<Product[]> {
    const userId = req['user'].sub;
    const searchText = query?.searchText || "";
    return this.usersService.getUnselectedProducts(userId, searchText);
  }
  @Get("/id")
  async getUserById(@Req() req: Request): Promise<User> {
    const userId = req['user'].sub;
    return this.usersService.getUserById(userId);
  }
}
