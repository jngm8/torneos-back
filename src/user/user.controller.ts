import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
