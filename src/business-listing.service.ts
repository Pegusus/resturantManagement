// business-listing.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessListing } from './entities/business-listing.entity';
import { User } from './entities/user.entity';
import Role from './auth/user.constants';

@Injectable()
export class BusinessListingService {
  constructor(
    @InjectRepository(BusinessListing)
    private businessListingRepository: Repository<BusinessListing>,
  ) {}

  async findById(id: number): Promise<BusinessListing> {
    return await this.businessListingRepository.findOneBy({id});
  }

  async findAll(): Promise<BusinessListing[]> {
    return await this.businessListingRepository.createQueryBuilder('businessListing')
      .leftJoinAndSelect('businessListing.reviews', 'reviews')
      .orderBy('reviews.updatedAt', 'DESC')
      .getMany();
  }

  async findByUserIdAndId(
    userId: number,
    id: number,
  ): Promise<BusinessListing | undefined> {
    return this.businessListingRepository.findOne({ where: { userId, id }, relations: {
      reviews: true,
  }, });
  }

  async create(
    businessListingData: Partial<BusinessListing>,
    decodedUser: Partial<User>,
  ): Promise<BusinessListing> {
    const addBusinessData = { ...businessListingData, userId: decodedUser.id };
    const businessListing =
      this.businessListingRepository.create(addBusinessData);
    return this.businessListingRepository.save(businessListing);
  }

  async findByUserId(userId: number): Promise<BusinessListing[]> {
    return this.businessListingRepository.find({ where: { userId }, relations: {
      reviews: true,
  }, });
  }

  async update(
    id: number,
    businessListingData: BusinessListing,
    decodedUser: Partial<User>,
  ): Promise<BusinessListing> {
    let existingListing;
    if (decodedUser.role === Role.BUSINESS_OWNER) {
      existingListing = await this.findByUserIdAndId(decodedUser.id, id);
    } else if (decodedUser.role === Role.ADMIN) {
      existingListing = await this.businessListingRepository.findOneBy({ id });
    }

    if (!existingListing) {
      throw new NotFoundException('Business listing not found');
    }
    // Update existing listing with new data
    delete businessListingData.id;
    delete businessListingData.userId;
    const updatedListing = { ...existingListing, ...businessListingData };
    return await this.businessListingRepository.save(updatedListing);
  }

  async delete(id: number, decodedUser: Partial<User>): Promise<void> {
    let existingListing;
    if (decodedUser.role === Role.BUSINESS_OWNER) {
      existingListing = await this.findByUserIdAndId(decodedUser.id, id);
    } else if (decodedUser.role === Role.ADMIN) {
      existingListing = await this.businessListingRepository.findOneBy({ id });
    }

    if (!existingListing) {
      throw new NotFoundException('Business listing not found');
    }

    // Check if the user has permission to delete the listing
    if (
      decodedUser.role !== Role.ADMIN &&
      existingListing.userId !== decodedUser.id
    ) {
      throw new UnauthorizedException(
        'You are not authorized to delete this listing',
      );
    }

    await this.businessListingRepository.delete(id);
  }

  async updateOverallRating(businessListingId: number): Promise<void> {
    const businessListing = await this.businessListingRepository.findOne({where: {id: businessListingId}, relations: {
      reviews: true,
  }});

    if (!businessListing) {
      throw new Error('Business listing not found');
    }

    const totalRating = businessListing.reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / businessListing.reviews.length;

    businessListing.overallRating = averageRating;

    await this.businessListingRepository.save(businessListing);
  }
}
