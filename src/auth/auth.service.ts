/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserDto } from './dto/auth-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from '../shared/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

    findOneByUsernameWithPassword(username: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { username }, select: ['username','role','password','id'] });
    }

   async signUp(user:UserEntity) : Promise<void> {


    const username = user.username;
    const password = user.password;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await this.userRepository.create({ username, password: hashedPassword})
    
    try {
        await this.userRepository.save(newUser);
    } catch (error) {
        if(error.code === '23505') {
            throw new ConflictException("Username already exists")
        } else {
           throw new InternalServerErrorException
        }
    }

   }

   async signIn(authUserDto:AuthUserDto) : Promise<{accessToken:string, role: Role,user, id:string}> {
    const { username, password } = authUserDto;
    
    const user = await this.findOneByUsernameWithPassword(username);

    if ((user) && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { username, role: user.role}

        const accessToken: string = this.jwtService.sign(payload);
        
        return { accessToken, role: user.role,user: user.username, id: user.id};
    } else {
        throw new UnauthorizedException("Please check your credentials")
    }
   }
}
