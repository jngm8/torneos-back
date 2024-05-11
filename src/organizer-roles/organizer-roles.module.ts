import { Module } from '@nestjs/common';
import { OrganizerRolesService } from './organizer-roles.service';
import { OrganizerRolesController } from './organizer-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { RolesEntity } from '../roles/roles.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerEntity, RolesEntity]),AuthModule],
  providers: [OrganizerRolesService],
  controllers: [OrganizerRolesController]
})
export class OrganizerRolesModule {}
