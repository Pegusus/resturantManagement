// review.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { BusinessListingService } from './business-listing.service';
import { User } from './entities/user.entity';
import Role from './auth/user.constants';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private businessListingService: BusinessListingService
  ) {}

  async createReview(userId: number, businessListingId: number, rating: number, comment: string): Promise<void> {
    // Create a new review entity
    const createdReview = {
      userId,
      rating,
      comment,
      businessListing: { id: businessListingId },
    }
    const newReview = this.reviewRepository.create(createdReview);

    // Save the review to the database
    await this.reviewRepository.save(newReview);

    // Update overall rating
    await this.businessListingService.updateOverallRating(businessListingId);
  }

  async respondToReview(businessOwnerId: number, reviewId: number, reply: string): Promise<void> {
    // Find the review by ID
    const review = await this.reviewRepository.findOne({where: { id: reviewId }, relations: { businessListing: true }});
    if (!review) {
      throw new Error('Review not found');
    }
    // Check if the review belongs to the business owner
    if (review.businessListing.userId !== businessOwnerId) {
      throw new Error('Unauthorized');
    }
    // Add the response to the review
    review.reply = reply;
    // Save the updated review to the database
    await this.reviewRepository.save(review);
  }

  async updateReview(reviewId: number, decodedUser: User, comment: string = null, rating: number = null): Promise<Review> {
    const review = await this.reviewRepository.findOne({where: { id: reviewId }, relations: { businessListing: true }});
    if (!review) {
      return null;
    }
    if (decodedUser.role !== Role.ADMIN && review.userId !== decodedUser.id){
        throw new UnauthorizedException('You are not allowed to update this review');
    }
    let updateRating = false;
    if (rating) updateRating = true;
    review.comment = comment;
    review.rating = rating;
     await this.reviewRepository.save(review);
    if (updateRating) 
    await this.businessListingService.updateOverallRating(review.businessListing.id);
  }

  async deleteReview(reviewId: number, decodedUser: User): Promise<void> {
    // Find the review by ID
    const review = await this.reviewRepository.findOneBy({id: reviewId});

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the review belongs to the user
    if (decodedUser.role !== Role.ADMIN && review.userId !== decodedUser.id){
        throw new UnauthorizedException('You are not allowed to delete this review');
    }

    // Delete the review
    await this.reviewRepository.delete(reviewId);
  }
}
