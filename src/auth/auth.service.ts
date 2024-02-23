/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

   async signUp(authUserDto:AuthUserDto) : Promise<void> {

    const { username, email, password, } = authUserDto;

    const user = await this.userRepository.create({ username,email, password})
    
    try {
        await this.userRepository.save(user);
    } catch (error) {
        if(error.code === '23505') {
            throw new ConflictException("Username already exists")
        } else {
           throw new InternalServerErrorException
        }
    }

   }
}
