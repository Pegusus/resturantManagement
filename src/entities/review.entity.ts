// review.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @Column({nullable: true})
  reply: string;

  @ManyToOne(
    () => BusinessListing,
    (businessListing) => businessListing.reviews,
  )
  businessListing: BusinessListing;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
