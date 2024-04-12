import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from './organizer.entity';
import { OrganizerController } from './organizer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerEntity])],
  providers: [OrganizerService],
  controllers: [OrganizerController]
})
export class OrganizerModule {}
