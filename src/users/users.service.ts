import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../dto/users.dto';
import { User } from '../schema/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';
import { Product } from 'src/schema/product.entity';

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

  async updateUser(id: number, updateUser: Users): Promise<User> {
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

  async getSelectedProducts(userId) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin(ProductSellerMapping, 'mapping', 'mapping.productId = product.id')
      .innerJoin(User, 'user', 'user.id = mapping.userId')
      .where('user.id = :userId', { userId })
      .getMany();
    return products;
  }

  async getUnselectedProducts(userId) {
    const selectedProducts = await this.getSelectedProducts(userId);
    const selectedIds = selectedProducts.map(item => item.id);
    return this.productRepository.find({
      where: {
        id: Not(In(selectedIds)),
      },
    });
  }
}
