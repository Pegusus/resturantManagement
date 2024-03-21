// app.module.ts or a dedicated module file

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './auth/user.controller';
import { UserService } from './auth/user.service';
import { User } from './entities/user.entity';

import * as path from 'path';
import { BusinessListingController } from './business-listing.controller';
import { BusinessListingService } from './business-listing.service';
import { BusinessListing } from './entities/business-listing.entity';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  'localhost', // 'resturantmanagement-postgres-1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [path.join(__dirname, 'entities', '*.entity{.ts,.js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, BusinessListing, Review]),
  ],
  controllers: [UserController, BusinessListingController, ReviewController],
  providers: [UserService, BusinessListingService, ReviewService],
})
export class AppModule {}
