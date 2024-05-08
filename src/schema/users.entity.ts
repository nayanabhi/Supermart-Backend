// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  

  @Column(({ unique: true }))
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string; 

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zipcode: string;

  @Column('jsonb', { nullable: true })
  roles: string[]; // Optional property for roles
}