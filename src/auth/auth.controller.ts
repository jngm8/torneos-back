/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('signup')
    signUp(@Body() authUserDto:AuthUserDto): Promise<void>{
        return this.authService.signUp(authUserDto);
    }

    @Post('signin')
    signin(@Body() authUserDto:AuthUserDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authUserDto);
    }
}
