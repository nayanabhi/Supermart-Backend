import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../dto/product.dto';
import { Product } from '../schema/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getProductById(id: number): Promise<Product> {
    return await this.productRepository.findOne({where: {id}});
  }

  async getAllProducts(searchText): Promise<Product[]> {
    if(searchText != '') {
      return await this.productRepository.createQueryBuilder('product')
      .where('LOWER(product.name) LIKE LOWER(:searchText)', { searchText: `%${searchText}%` })
      .getMany();
  }else {
    return await this.productRepository.find();
  }
    
  }

  async createProduct(product: Products): Promise<Product> {
    const newProduct = new Product();
    Object.assign(newProduct, product);
    return await this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, updateProduct: Products): Promise<Product> {
    const product = await this.getProductById(id);
    if(!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(product, updateProduct);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id);
    if(!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.productRepository.delete(id);
  }
}
