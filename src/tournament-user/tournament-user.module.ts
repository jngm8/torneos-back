import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentUserEntity } from './tournament-user.entity';
import { TournamentUserService } from './tournament-user.service';
import { TournamentUserController } from './tournament-user.controller';
import { UserEntity } from '../user/user.entity';
import { TournamentEntity } from '../tournament/tournament.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, TournamentUserEntity, TournamentEntity])],
    providers: [TournamentUserService],
    controllers: [TournamentUserController]
})
export class TournamentUserModule {}
