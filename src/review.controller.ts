// review.controller.ts
import { Controller, Post, UseGuards, Req, Res, Body, Put, NotFoundException, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { AuthGuard } from './auth/auth.guard';
import Role from './auth/user.constants';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('')
  @UseGuards(new AuthGuard([Role.USER])) // Only authenticated users can post reviews
  async createReview(@Req() req: Request, @Res() res: Response) {
    try {
      const decodedUser = (req as any).user; // Extract user ID from request
      const { businessListingId, rating, comment } = req.body;
      if (!businessListingId) {
        res.status(400).json('Business Listing ID is required');
      }
      await this.reviewService.createReview(decodedUser.id, businessListingId, rating, comment);
      res.status(201).json({ message: 'Review created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post('/reply')
  @UseGuards(new AuthGuard([Role.BUSINESS_OWNER, Role.ADMIN])) // Only business owners can respond to reviews
  async respondToReview(@Req() req: Request, @Res() res: Response) {
    try {
      const businessOwner = (req as any).user; // Extract business owner ID from request
      const { reviewId, reply } = req.body;
      await this.reviewService.respondToReview(businessOwner.id, reviewId, reply);
      res.status(200).json({ message: 'Response added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Put('')
  @UseGuards(new AuthGuard([Role.USER, Role.ADMIN]))
  async updateReview(@Req() req: Request, @Res() res: Response) {
    const reviewId = req.query.reviewId as string;
    const { comment, rating } = req.body;
    const decodedUser = (req as any).user; 
    if (!reviewId) res.status(400).json('Review Id is required');
    if (!comment || !rating) res.status(400).json('Comment or rating either required');
    await this.reviewService.updateReview(parseInt(reviewId), decodedUser, comment, rating);
    res.status(200).json('Updated');
  }

  @Delete('')
  @UseGuards(new AuthGuard([Role.USER, Role.ADMIN]))
  async deleteReview(@Req() req: Request, @Res() res: Response) {
    const reviewId = req.query.reviewId as string;
    const decodedUser = (req as any).user; 
    
    if (!reviewId) {
      res.status(400).json('Review Id is required');
      return;
    }
    await this.reviewService.deleteReview(parseInt(reviewId), decodedUser);
    res.status(200).json('Deleted');
  }
}
