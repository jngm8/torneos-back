import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import constants from "../../shared/constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super();
        console.log('JwtService:', this.jwtService); // Check if this logs properly
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();        
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header not provided');
        }

        const accessToken = authorizationHeader.split(' ')[1];
        
        if (!accessToken) {
            throw new UnauthorizedException('Access token not provided');
        }
      
        try {
            const decoded = this.jwtService.verify(accessToken, { secret: constants.JWT_SECRET });            
            request.user = decoded;
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ForbiddenException('Access token expired');
            } else {
                throw new UnauthorizedException('Invalid access token');
            }
        }
    }
}
