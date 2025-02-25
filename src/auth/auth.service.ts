/* eslint-disable prettier/prettier */
import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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

   async signUp(user:UserEntity) : Promise<{access:string, refresh:string}> {


    const username = user.username;
    const password = user.password;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password,salt);

    const payload: JwtPayload = { username, role: user.role}

    const accessToken: string = this.jwtService.sign(payload);

    const refreshToken: string = this.jwtService.sign(payload, { expiresIn: constants.REFRESH_EXPIRES_IN });
    
    const hash = await bcrypt.hash(refreshToken, 10);

    const newUser = await this.userRepository.create({ username, password: hashedPassword, refreshToken: hash})

    try {
        await this.userRepository.save(newUser);

        return {access: accessToken, refresh: refreshToken};
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

        const refreshToken: string = this.jwtService.sign(payload, { secret: constants.REFRESH_SECRET, expiresIn: constants.REFRESH_EXPIRES_IN });
        
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

   async refresh(username: string,refreshToken: string) : Promise<{accessToken:string, role: Role, id:string, newRefreshToken: string}> {
    
    const user = await this.findOneByUsernameWithPassword(username);
    
    const role = user.role;
    const id = user.id;

    if (!user) 
        throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

    if (!user.refreshToken) throw new ForbiddenException('Access Denied');

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);    

    if (!isRefreshTokenValid) 
        throw new UnauthorizedException("Invalid refresh token");

    const payload: JwtPayload = { username, role: user.role}

    const accessToken: string = this.jwtService.sign(payload);

    const newRefreshToken: string = this.jwtService.sign(payload, { secret: constants.REFRESH_SECRET, expiresIn: constants.REFRESH_EXPIRES_IN });

    await this.updateRefreshToken(user.id, newRefreshToken);
    
    return {accessToken:accessToken, role: role, id, newRefreshToken: newRefreshToken};

   }
}
