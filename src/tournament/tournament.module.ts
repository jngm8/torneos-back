import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './tournament.entity';
import { TournamentController } from './tournament.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity])],
  providers: [TournamentService],
  controllers: [TournamentController]
})
export class TournamentModule {}
