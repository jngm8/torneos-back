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
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import constants from "../shared/constants";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

    findOneByUsernameWithPassword(username: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { username }, select: ['username','role','password','id','refreshToken'] });
    }

   async signUp(user:UserEntity) : Promise<string[]> {


    const username = user.username;
    const password = user.password;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password,salt);

    const payload: JwtPayload = { username, role: user.role}

    const accessToken: string = this.jwtService.sign(payload);

    const refreshToken: string = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    const hash = await bcrypt.hash(refreshToken, 10);

    const newUser = await this.userRepository.create({ username, password: hashedPassword, refreshToken: hash})

    try {
        await this.userRepository.save(newUser);

        return [accessToken, refreshToken];
    } catch (error) {
        if(error.code === '23505') {
            throw new ConflictException("Username already exists")
        } else {
           throw new InternalServerErrorException
        }
    }

   }

   async signIn(authUserDto:AuthUserDto) : Promise<{accessToken:string, role: Role,user, id:string, refreshToken: string}> {
    const { username, password } = authUserDto;
    
    const user = await this.findOneByUsernameWithPassword(username);

    if ((user) && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { username, role: user.role}

        const accessToken: string = this.jwtService.sign(payload);

        const refreshToken: string = this.jwtService.sign(payload, { secret: constants.REFRESH_SECRET, expiresIn: '7d' });
        
        await this.updateRefreshToken(user.id, refreshToken);

        return { accessToken, role: user.role,user: user.username, id: user.id, refreshToken};
    } else {
        throw new UnauthorizedException("Please check your credentials")
    }
    
   }

   async signout(username: string) : Promise<void> {

    const persistedUser : UserEntity = await this.userRepository.findOne({where: {username: username}});

    if (!persistedUser) 
        throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    
    persistedUser.refreshToken = null;

    await this.userRepository.save(persistedUser);

   }

   async updateRefreshToken(idUsername: string, refreshToken: string) : Promise<void> {

    const hash = await bcrypt.hash(refreshToken, 10);

    const persistedUser : UserEntity = await this.userRepository.findOne({where: {id: idUsername}});

    if (!persistedUser) 
        throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    
    persistedUser.refreshToken = hash;

    await this.userRepository.save(persistedUser);

   }

   async refresh(req) : Promise<{refresh: string, access: string}> {
    
    const username = req.user["username"];

    const user = await this.findOneByUsernameWithPassword(username);

    if (!user) 
        throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

    const refreshToken = req.user["refreshToken"];

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenValid) 
        throw new UnauthorizedException("Invalid refresh token");


    const payload: JwtPayload = { username, role: user.role}

    const accessToken: string = this.jwtService.sign(payload);

    const NewRefreshToken: string = this.jwtService.sign(payload, { secret: constants.REFRESH_SECRET, expiresIn: '7d' });

    await this.updateRefreshToken(user.id, NewRefreshToken);
    
    return {refresh: NewRefreshToken, access:accessToken};

   }
}
