// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index} from 'typeorm';
import { Product } from './product.entity';
import { Seller } from './seller.entity';

@Entity()
@Index(['productId', 'sellerId'], { unique: true })
export class ProductSellerMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  sellerId: number;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Seller, seller => seller.id)
  @JoinColumn({ name: 'sellerId' })
  seller: Seller;

  @Column()
  price: number;

  @Column({ default: true })
  available: boolean;
}