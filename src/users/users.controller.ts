import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { ValidateUser } from '../dto/userValidate.dto';
import { Users } from '../dto/users.dto';
import { User } from '../schema/users.entity';
import { UsersService } from './users.service';
import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';


@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(+id);
  }

  @Post("createUser")
  async createUser(@Body() user: Users): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Put("updateuser/:id")
  async updateUser(@Param('id') id: string, @Body() user: Users): Promise<User> {
    return this.usersService.updateUser(+id, user);
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
}
