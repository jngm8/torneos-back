import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentUserEntity } from './tournament-user.entity';
import { TournamentUserService } from './tournament-user.service';

@Module({
    imports: [TypeOrmModule.forFeature([TournamentUserEntity])],
    providers: [TournamentUserService]
})
export class TournamentUserModule {}
