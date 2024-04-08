import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentUserEntity } from './tournament-user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TournamentUserEntity])]
})
export class TournamentUserModule {}
