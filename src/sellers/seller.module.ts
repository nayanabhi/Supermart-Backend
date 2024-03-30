import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { Seller } from 'src/schema/seller.entity';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { ProductService } from 'src/products/product.service';
import { Product } from '../schema/product.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Seller, ProductSellerMapping, Product])],
  controllers: [SellerController],
  providers: [SellerService, ProductService],
})
export class SellerModule {}
