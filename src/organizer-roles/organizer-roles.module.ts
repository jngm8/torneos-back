import { Module } from '@nestjs/common';
import { OrganizerRolesService } from './organizer-roles.service';

@Module({
  providers: [OrganizerRolesService]
})
export class OrganizerRolesModule {}
