import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gym } from '../../gyms/entities/gyms.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'cognito_userId',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  cognitoId: string;

  @Column({ name: 'first_name', type: 'varchar', length: 20 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 20 })
  lastName: string;

  @Column({ name: 'document', type: 'varchar', length: 8, unique: true })
  document: string;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 9, unique: true })
  phone: string;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Gym, (gym) => gym.user, { lazy: true })
  gyms: Gym[];
}
