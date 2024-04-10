import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from './roles.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/security/errors/business-errors';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(RolesEntity)
        private readonly rolesRepository: Repository<RolesEntity>
    ){}


    async findAll() : Promise<RolesEntity[]>{
        return await this.rolesRepository.find({relations: ["organizers"]})
    }

    async findOne(id: string): Promise<RolesEntity> {
        const roles : RolesEntity = await this.rolesRepository.findOne({where: {id}, relations: ["organizers"]})
        if (!roles) 
            throw new BusinessLogicException("The role with the given id was not found", BusinessError.NOT_FOUND);
        return roles;
    }

    async create(role: RolesEntity): Promise<RolesEntity>{
        return await this.rolesRepository.save(role);
    }

    async update(id:string, role: RolesEntity): Promise<RolesEntity> {
        const persistedRole : RolesEntity = await this.rolesRepository.findOne({where: {id}});
        if (!persistedRole) 
            throw new BusinessLogicException("The role with the given id was not found", BusinessError.NOT_FOUND);
        return await this.rolesRepository.save({...persistedRole,...role});
    }

    async delete(id: string) {
        const role : RolesEntity = await this.rolesRepository.findOne({where: {id}});
        if(!role)
            throw new BusinessLogicException("The role with the given id was not found", BusinessError.NOT_FOUND);
        return await this.rolesRepository.remove(role);

    }



}