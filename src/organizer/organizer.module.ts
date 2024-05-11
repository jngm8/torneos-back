import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from './organizer.entity';
import { OrganizerController } from './organizer.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerEntity]), AuthModule],
  providers: [OrganizerService],
  controllers: [OrganizerController]
})
export class OrganizerModule {}
