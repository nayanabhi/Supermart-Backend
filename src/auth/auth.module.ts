import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/schema/users.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { Product } from 'src/schema/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProductSellerMapping, Product]), UsersModule, JwtModule,],
  controllers: [AuthController],
  providers: [UsersService, AuthService, JwtService],
})
export class AuthModule {}
