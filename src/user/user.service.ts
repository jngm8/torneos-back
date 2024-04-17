import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>
    ){}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({relations:["tournaments", "tournaments.tournament"]})
    }

    async findOne(id: string) : Promise<UserEntity> {
        const user : UserEntity = await this.userRepository.findOne({where: {id}, relations: ["tournaments", "tournaments.tournament"]})
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return user;
    }

    // This function is for academic purposes, since in the auth module theres the signup to create a user properly
    async create(user: UserEntity) : Promise<UserEntity> {
        return this.userRepository.save(user);
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const persistedUser : UserEntity = await this.userRepository.findOne({where: {id}});
        if (!persistedUser) 
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return await this.userRepository.save({...persistedUser, ...user});
    }

    async delete(id: string) {
        const user : UserEntity = await this.userRepository.findOne({where: {id}});
        if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return await this.userRepository.remove(user);
    }

}
