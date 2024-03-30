import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../dto/users.dto';
import { User } from '../schema/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seller } from 'src/schema/seller.entity';
import { Sellers } from 'src/dto/seller.dto';
import { ProductSellerMappings } from 'src/dto/productSellerMapping.dto';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { ProductService } from 'src/products/product.service';

@Injectable()
export class SellerService {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(ProductSellerMapping)
    private productSellerRepository: Repository<ProductSellerMapping>,
  ) {}

  async getSellerById(id: number): Promise<Seller> {
    return await this.sellerRepository.findOne({where: {id}});
  }
  async findUserByUsername(username: string): Promise<Seller> {
    return await this.sellerRepository.findOne({where: {username}});
  }

  async createSeller(seller: Sellers): Promise<Seller> {
    const newSeller = new Seller();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(seller?.password, salt);
    seller.password = hashedPassword;
    Object.assign(newSeller, seller);
    return await this.sellerRepository.save(newSeller);
  }

  async updateSeller(id: number, updateSellers: Sellers): Promise<Seller> {
    const seller = await this.getSellerById(id);
    if(!seller) {
      throw new HttpException('Seller not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(seller, updateSellers);
    return await this.sellerRepository.save(seller);
  }

  async deleteSeller(id: number): Promise<void> {
    const seller = await this.getSellerById(id);
    if(!seller) {
      throw new HttpException('Seller not found', HttpStatus.NOT_FOUND);
    }
    await this.sellerRepository.delete(id);
  }

  async addProduct(productSellerDetails: ProductSellerMappings): Promise<ProductSellerMapping> {
    const newProductSellerMapping = new ProductSellerMapping();
    Object.assign(newProductSellerMapping, productSellerDetails);
    return await this.productSellerRepository.save(newProductSellerMapping);
  }

  async updateProductStatus(productSellerDetails: ProductSellerMappings): Promise<ProductSellerMapping> {
    const productSellerMapping = await this.getProductSeller(productSellerDetails.productId, productSellerDetails.sellerId);
    if(!productSellerMapping) {
      throw new HttpException('Seller not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(productSellerMapping, productSellerDetails);
    return await this.productSellerRepository.save(productSellerMapping);
  }

  async getProductSeller(productId, sellerId): Promise<ProductSellerMapping> {
    return await this.productSellerRepository.findOne({where: {productId, sellerId}});
  }

  async getAllProducts(id: number) {
      const result = await this.productSellerRepository.find({where: {sellerId: id}});

      const updatedResults: any[] = [];

    for (const item of result) {
        try {
            const additionalInfo = await this.productService.getProductById(item.productId);
            const updatedItem = { ...item, ...additionalInfo };
            updatedResults.push(updatedItem);
        } catch (error) {
            console.error(`Error fetching additional info for item: ${item}`, error);
        }
    }
    return updatedResults;

  }
}
