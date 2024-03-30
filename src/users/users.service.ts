import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../dto/users.dto';
import { User } from '../schema/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProductSellerMapping)
    private productSellerRepository: Repository<ProductSellerMapping>,
  ) {}

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({where: {id}});
  }
  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({where: {username}});
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
    if(!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUser);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    if(!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
  }
  async getPrice(productId: number, userId) {
    const user = await this.getUserById(userId);
    const city = user.city;
    return await this.productSellerRepository.find({where: {productId}});
  }
}
