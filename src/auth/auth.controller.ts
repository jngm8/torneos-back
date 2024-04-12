import { Controller, Get, Req } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../shared/enums/role.enum';
import { Auth } from './decorators/auth.decorator';
import RequestUser from './interfaces/request-user.interface';



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
    signin(@Body() authUserDto:AuthUserDto): Promise<{accessToken: string, role: Role,user}> {
        return this.authService.signIn(authUserDto);
    }



    @Get('profile')
    @Auth([Role.ADMIN])
    profile(@Req() req: RequestUser) {
        return req.user;
    }
}
