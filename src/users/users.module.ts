import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../schema/users.entity';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { Product } from 'src/schema/product.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, ProductSellerMapping, Product])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
