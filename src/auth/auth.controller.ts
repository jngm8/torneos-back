import { Controller, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../shared/enums/role.enum';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UserEntity } from 'src/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
// import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


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
    signUp(@Body() authUserDto:AuthUserDto): Promise<string[]>{
        const user : UserEntity = plainToInstance(UserEntity, authUserDto);
        return this.authService.signUp(user);
    }

    @Post('signin')
    signin(@Body() authUserDto:AuthUserDto): Promise<{accessToken: string, role: Role,user, id:string}> {
        return this.authService.signIn(authUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('signout')
    signout(@Req() req: Request): Promise<void> {
        
        const userId = req.user;
        
        return this.authService.signout(userId["username"]);
    }


    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    refresh(@Req() req: Request): Promise<{refresh: string, access: string}> {
                
        console.log(req);
        
        return this.authService.refresh(req);
    }
}
