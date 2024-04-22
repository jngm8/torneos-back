import { Module } from '@nestjs/common';
import { OrganizerTournamentService } from './organizer-tournament.service';
import { OrganizerTournamentController } from './organizer-tournament.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from '../organizer/organizer.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerEntity, TournamentEntity]), AuthModule],
  providers: [OrganizerTournamentService],
  controllers: [OrganizerTournamentController]
})
export class OrganizerTournamentModule {}
