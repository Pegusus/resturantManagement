// business-listing.controller.ts
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BusinessListingService } from './business-listing.service';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { AuthGuard } from './auth/auth.guard';
import Role from './auth/user.constants';

@Controller('business-listing')
export class BusinessListingController {
  constructor(
    private readonly businessListingService: BusinessListingService,
  ) {}

  @Post()
  @UseGuards(new AuthGuard([Role.ADMIN, Role.BUSINESS_OWNER]))
  async create(@Req() req: Request, @Res() res: Response) {
    const data = req.body;
    const decodedUser: User = (req as any).user;
    await this.businessListingService.create(data, decodedUser);
    res.status(201).json('Business Data created');
  }

  @Get('')
  @UseGuards(new AuthGuard([Role.ADMIN, Role.BUSINESS_OWNER, Role.USER]))
  async findAll(@Req() req: Request, @Res() res: Response) {
    const userListings = await this.businessListingService.findAll();
    res.status(200).json(userListings);
  }

  @Put('')
  @UseGuards(new AuthGuard([Role.BUSINESS_OWNER]))
  async updateBuinessListing(@Req() req: Request, @Res() res: Response) {
    const { id, ...businessListingData } = req.body;
    const decodedUser: User = (req as any).user;
    if (!id) {
      res.status(400).json('Business Id is required');
    }
    const updatedListing = await this.businessListingService.update(
      id,
      businessListingData,
      decodedUser,
    );
    if (!updatedListing) {
      throw new NotFoundException('Business listing not found');
    }
    res.status(200).json(updatedListing);
  }

  @Delete('/:id')
  @UseGuards(new AuthGuard([Role.BUSINESS_OWNER, Role.ADMIN]))
  async deleteBuinessListing(@Req() req: Request, @Res() res: Response) {
    const { id } = req.params;
    const decodedUser: User = (req as any).user;
    if (!id) {
      res.status(400).json('Business Id is required');
    }
    await this.businessListingService.delete(parseInt(id), decodedUser);
    res.status(201).json('Deleted');
  }

  @Get('/user')
  @UseGuards(new AuthGuard([Role.BUSINESS_OWNER]))
  async getByUserId(@Req() req: Request, @Res() res: Response) {
    const decodedUser: User = (req as any).user;
    const businessListings = await this.businessListingService.findByUserId(
      decodedUser?.id,
    );
    res.status(200).json(businessListings);
  }

  @Get('/user/business/:businessId')
  @UseGuards(new AuthGuard([Role.BUSINESS_OWNER]))
  async getByBusinessIdUserId(@Req() req: Request, @Res() res: Response) {
    const { businessId } = req.params;
    const decodedUser: User = (req as any).user;
    const businessListings =
      await this.businessListingService.findByUserIdAndId(
        decodedUser?.id,
        parseInt(businessId),
      );
    res.status(200).json(businessListings);
  }
}
