import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../shared/enums/role.enum';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UserEntity } from 'src/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { GetRefreshToken } from './decorators/get-refresh-token.decorator';


@ApiTags('auth')
@Controller('auth')
@UseInterceptors(BusinessErrorsInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('signup')
    @ApiCreatedResponse({ description: 'The user has been successfully created.'})
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    signUp(@Body() authUserDto:AuthUserDto): Promise<{access:string, refresh:string}>{
        const user : UserEntity = plainToInstance(UserEntity, authUserDto);
        return this.authService.signUp(user);
    }

    @Post('signin')
    signin(@Body() authUserDto:AuthUserDto): Promise<{accessToken: string, role: Role,user, id:string}> {
        return this.authService.signIn(authUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('signout')
    signout(@GetUser() username: string): Promise<void> {                
        return this.authService.signout(username);
    }


    @UseGuards(RefreshJwtAuthGuard)
    @Post('refresh')
    refresh(@GetUser() username: string, @GetRefreshToken() refreshToken: string): Promise<{refresh: string, access: string}> {  
        return this.authService.refresh(username, refreshToken);
    }
}
