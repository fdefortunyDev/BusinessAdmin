import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { IGym } from '../dtos/out/gym.interface';
  
  @Entity('gyms')
  export class Gyms implements IGym {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 150, nullable: false })
    name: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    address: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone?: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    website?: string;
  
    @Column({ type: 'tinyint', default: 1 })
    isActive: boolean;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
  }
  