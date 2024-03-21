// business-listing.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class BusinessListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column()
  businessPhone: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overallRating: number;

  @OneToMany(() => Review, (review) => review.businessListing)
  reviews: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
