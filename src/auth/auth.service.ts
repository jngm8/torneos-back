/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserDto } from './dto/auth-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

   async signUp(authUserDto:AuthUserDto) : Promise<void> {

    const { username, password, } = authUserDto;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password,salt);

    const user = await this.userRepository.create({ username, password: hashedPassword})
    
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

   async signIn(authUserDto:AuthUserDto) : Promise<{accessToken:string}> {
    const { username, password } = authUserDto;
    
    const user = await this.userRepository.findOne({where: {username}})

    if ((user) && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { username }

        const accessToken: string = await this.jwtService.sign(payload);

        return { accessToken };
    } else {
        throw new UnauthorizedException("Please check your credentials")
    }
   }
}
