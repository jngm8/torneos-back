import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './tournament.entity';
import { TournamentController } from './tournament.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity]),AuthModule],
  providers: [TournamentService],
  controllers: [TournamentController]
})
export class TournamentModule {}
