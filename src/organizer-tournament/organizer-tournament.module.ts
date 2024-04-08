import { Module } from '@nestjs/common';
import { OrganizerTournamentService } from './organizer-tournament.service';

@Module({
  providers: [OrganizerTournamentService]
})
export class OrganizerTournamentModule {}
