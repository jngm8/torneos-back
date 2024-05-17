import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserDto } from './user.dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/shared/enums/role.enum';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Auth([Role.ADMIN])
    @Get()
    @ApiOperation({ summary: 'Retrieve all users'})
    findAll(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Retrieve one user'})
    findOne(@Param('userId') userId: string): Promise<UserEntity> {
        return this.userService.findOne(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a user'})
    create(@Body() userDto: UserDto) {
        const user : UserEntity = plainToInstance(UserEntity, userDto);
        return this.userService.create(user);
    }

    @Put(':userId')
    @ApiOperation({ summary: 'Update a user'})
    update(@Param('userId') userId: string, @Body() userDto: UserDto): Promise<UserEntity> {
        const user : UserEntity = plainToInstance(UserEntity, userDto);
        return this.userService.update(userId, user);
    }

    
    @Delete(':userId')
    @ApiOperation({ summary: 'Delete a user'})
    @ApiBearerAuth()
    @Auth([Role.ADMIN])
    @HttpCode(204)
    delete(@Param('userId') userId: string) {
        return this.userService.delete(userId);
    }
}

