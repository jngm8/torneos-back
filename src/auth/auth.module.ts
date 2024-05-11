import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import constants from '../shared/constants';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule.register({ defaultStrategy: 'jwt-refresh' }), // Refresh token strategy
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: {
        expiresIn: constants.JWT_EXPIRES_IN,
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, RefreshJwtStrategy],
})
export class AuthModule {}
