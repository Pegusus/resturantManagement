// business-listing.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => Review, (review) => review.businessListing)
  reviews: Review[];
}
