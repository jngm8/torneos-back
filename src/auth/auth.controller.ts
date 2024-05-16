import { Controller, Get, Res, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UserEntity } from 'src/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorators/get-user.decorator';
// import { GetRefreshToken } from './decorators/get-refresh-token.decorator';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';


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
    async signin(@Body() authUserDto:AuthUserDto, @Res() res): Promise<void> {
        const { accessToken, role, user, id, refreshToken } = await this.authService.signIn(authUserDto);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
          });

          res.json({accessToken, role,user, id})
    }

    @UseGuards(RefreshJwtAuthGuard)
    @Post('signout')
    signout(@GetUser() username: string, @Res() res) {                
        this.authService.signout(username);
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
    
        // Optionally, you can also send a response indicating successful signout
        res.status(200).json({ message: 'Successfully signed out' });
    }


    @UseGuards(RefreshJwtAuthGuard)
    @Get('refresh')
    async refresh(@GetUser() username, @Res() res, @Req() req): Promise<void> {

        const refreshToken = req.cookies['refreshToken'];

        const { accessToken, role, id,  newRefreshToken } = await this.authService.refresh(username, refreshToken);
    
        // Set the refresh token as a cookie
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
        });
    
        // Send the access token in the response body
        res.json({ accessToken, role, username, id });       
        
        
    }
}
