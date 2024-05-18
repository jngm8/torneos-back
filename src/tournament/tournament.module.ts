import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './tournament.entity';
import { TournamentController } from './tournament.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import constants from '../shared/constants';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity]),AuthModule,
  PassportModule,
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN }, // Example expiration time
    }),],
  providers: [TournamentService,JwtStrategy,JwtAuthGuard],
  controllers: [TournamentController],
  exports: [JwtAuthGuard]
})
export class TournamentModule {}
