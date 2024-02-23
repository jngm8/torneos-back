/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserDto } from './dto/auth-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

   async signUp(authUserDto:AuthUserDto) : Promise<void> {

    const { username, email, password, } = authUserDto;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password,salt);

    const user = await this.userRepository.create({ username,email, password: hashedPassword})
    
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

   async signIn(authUserDto:AuthUserDto) : Promise<string> {
    const { username, password } = authUserDto;
    
    const user = await this.userRepository.findOne({where: {username}})

    // const em = await this.userRepository.findOne({where:{email}})

    if ((user) && (await bcrypt.compare(password, user.password))) {
        return `success`
    } else {
        throw new UnauthorizedException("Please check your credentials")
    }
   }
}
