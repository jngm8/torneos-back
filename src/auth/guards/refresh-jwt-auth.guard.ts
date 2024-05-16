import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../../shared/constants';

@Injectable()
export class RefreshJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, { secret: constants.REFRESH_SECRET });
      request.user = decoded;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Refresh token expired');
      } else {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  }
}
