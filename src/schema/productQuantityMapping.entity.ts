// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Quantity } from './quantity.entity';

@Entity()
export class ProductQuantityMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Quantity, quantity => quantity.id)
  @JoinColumn({ name: 'quantityId' })
  quantity: Quantity;

}