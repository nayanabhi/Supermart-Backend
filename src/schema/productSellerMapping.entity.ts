// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index} from 'typeorm';
import { Product } from './product.entity';
import { Seller } from './seller.entity';
import { User } from './users.entity';
import { Optional } from '@nestjs/common';

@Entity()
@Index(['productId', 'userId'], { unique: true })
export class ProductSellerMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  sellerId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Seller, seller => seller.id)
  @JoinColumn({ name: 'sellerId' })
  seller: Seller;

  @Column(Optional)
  price: number;

  @Column({ default: true })
  available: boolean;
}