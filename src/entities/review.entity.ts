// review.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BusinessListing } from './business-listing.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(
    () => BusinessListing,
    (businessListing) => businessListing.reviews,
  )
  businessListing: BusinessListing;
}
