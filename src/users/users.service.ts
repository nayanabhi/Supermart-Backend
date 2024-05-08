import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../dto/users.dto';
import { User } from '../schema/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { Product } from 'src/schema/product.entity';
import { AnyARecord } from 'dns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProductSellerMapping)
    private productSellerRepository: Repository<ProductSellerMapping>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getProductSellerEntry(userId: number, productId): Promise<ProductSellerMapping> {
    return await this.productSellerRepository.findOne({ where: { userId, productId } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    const salt = await bcrypt.genSalt();
    console.log({434234: password, salt})
    password = await bcrypt.hash(password, salt);
    Object.assign(user, {password});
    return await this.userRepository.save(user);
  }
  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async createUser(user: Users): Promise<User> {
    const newUser = new User();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user?.password, salt);
    user.password = hashedPassword;
    Object.assign(newUser, user);
    return await this.userRepository.save(newUser);
  }

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateUser(id: number, updateUser: any): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUser);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
  }
  async getPrice(productId: number, userId) {
    const user = await this.getUserById(userId);
    const city = user.city;
    return await this.productSellerRepository.find({ where: { productId } });
  }

  async addProduct(productId: number, userId) {
    const newProductSellerMapping = new ProductSellerMapping();
    newProductSellerMapping.productId = productId;
    newProductSellerMapping.userId = userId;
    newProductSellerMapping.sellerId = 4;
    return await this.productSellerRepository.save(newProductSellerMapping);
  }

  async removeProduct(productId: number, userId) {
    // const newProductSellerMapping = new ProductSellerMapping();
    // newProductSellerMapping.productId = productId;
    // newProductSellerMapping.userId = userId;
    // newProductSellerMapping.sellerId = 4;
    return await this.productSellerRepository.delete({productId, userId});
  }

  async updateProductStatus(productId: number, userId, isAvailable: boolean, price) {
    const updateProductSeller = {
      available: isAvailable,
      price
    }
    const productSellerEntry = await this.getProductSellerEntry(userId, productId);
    if (!productSellerEntry) {
      throw new HttpException('Product seller not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(productSellerEntry, updateProductSeller);
    return await this.productSellerRepository.save(productSellerEntry);
  }

  async getSelectedProducts(userId, searchText) {
    if(searchText != '') {
        const products = await this.productRepository
        .createQueryBuilder('product')
        .innerJoin(ProductSellerMapping, 'mapping', 'mapping.productId = product.id')
        .innerJoin(User, 'user', 'user.id = mapping.userId')
        .where('user.id = :userId', { userId })
        .andWhere('LOWER(product.name) LIKE LOWER(:searchText)', { searchText: `${searchText}%` })
        .getMany();
      return products;
    }else {
        const products = await this.productRepository
        .createQueryBuilder('product')
        .innerJoin(ProductSellerMapping, 'mapping', 'mapping.productId = product.id')
        .innerJoin(User, 'user', 'user.id = mapping.userId')
        .where('user.id = :userId', { userId })
        .getMany();
      return products;
    }
    
  }

  async getUnselectedProducts(userId, searchText: string) {
    if(searchText != '') {
      const selectedProducts = await this.getSelectedProducts(userId, "");
      const selectedIds = selectedProducts.map(item => item.id);
      return this.productRepository
        .createQueryBuilder('product')
        .where('product.id NOT IN (:...selectedIds)', { selectedIds })
        .andWhere('LOWER(product.name) LIKE LOWER(:searchText)', { searchText: `${searchText}%` })
        .getMany();
    }else {
      const selectedProducts = await this.getSelectedProducts(userId, "");
      const selectedIds = selectedProducts.map(item => item.id);

      if (selectedIds.length === 0) {
        return this.productRepository
          .createQueryBuilder('product')
          .getMany();
      } else {
        return this.productRepository
          .createQueryBuilder('product')
          .where('product.id NOT IN (:...selectedIds)', { selectedIds: selectedIds })
          .getMany();
      }
    }
    
  }
}
