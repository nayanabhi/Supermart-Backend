// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quantity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column(({ unique: true }))
  unitOfMeasurement: string;

}