import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentUserEntity } from './user-tournament.entity';
import { TournamentUserService } from './user-tournament.service';
import { UserTournamentController } from './user-tournament.controller';
import { UserEntity } from '../user/user.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, TournamentUserEntity, TournamentEntity]), AuthModule],
    providers: [TournamentUserService],
    controllers: [UserTournamentController]
})
export class TournamentUserModule {}
