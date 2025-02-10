import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { IMembership } from '../dtos/out/membership-response.dto';
import { TimesPerWeek } from '../../../utils/enums/memberships/times-per-week.enum';
import { MembershipPeriod } from '../../../utils/enums/memberships/membership-period.enum';

@Entity('memberships')
export class Membership implements IMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'enum', enum: MembershipPeriod })
  period: MembershipPeriod;

  @Column({ type: 'varchar', length: 255 })
  daysOfWeek: string;

  @Column({ type: 'enum', enum: TimesPerWeek })
  timesPerWeek: TimesPerWeek;

  @Column({ type: 'int' })
  slots: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Business, (business) => business.memberships)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
