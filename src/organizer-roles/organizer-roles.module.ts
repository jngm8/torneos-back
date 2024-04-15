import { Module } from '@nestjs/common';
import { OrganizerRolesService } from './organizer-roles.service';
import { OrganizerRolesController } from './organizer-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { RolesEntity } from '../roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerEntity, RolesEntity])],
  providers: [OrganizerRolesService],
  controllers: [OrganizerRolesController]
})
export class OrganizerRolesModule {}
