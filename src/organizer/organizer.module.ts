import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from './organizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerEntity])],
  providers: [OrganizerService]
})
export class OrganizerModule {}
