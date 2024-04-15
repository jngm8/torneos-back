import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserDto } from './user.dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    findAll(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get('userId')
    findOne(@Param('userId') userId: string): Promise<UserEntity> {
        return this.userService.findOne(userId);
    }

    @Post()
    create(@Body() userDto: UserDto) {
        const user : UserEntity = plainToInstance(UserEntity, userDto);
        return this.userService.create(user);
    }

    @Put('userId')
    update(@Param('userId') userId: string, @Body() userDto: UserDto): Promise<UserEntity> {
        const user : UserEntity = plainToInstance(UserEntity, userDto);
        return this.userService.update(userId, user);
    }

    
    @Delete(':userId')
    @HttpCode(204)
    delete(@Param('userId') userId: string) {
        return this.userService.delete(userId);
    }
}

