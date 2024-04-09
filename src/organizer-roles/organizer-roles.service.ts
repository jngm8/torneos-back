import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerEntity } from "../organizer/organizer.entity";
import { RolesEntity } from "../roles/roles.entity";
import { BusinessError, BusinessLogicException } from '../shared/security/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizerRolesService {
    constructor(
        @InjectRepository(OrganizerEntity)
        private readonly organizerRepository: Repository<OrganizerEntity>,
        @InjectRepository(RolesEntity)
        private readonly rolesRepository: Repository<RolesEntity>
    ){}

    async addRolesToOrganizer(idOrganizer: string, idRoles: string) {

        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const role : RolesEntity = await this.rolesRepository.findOne({where: {id: idRoles}});
        if (!role)
            throw new BusinessLogicException("The role with the given id was not found", BusinessError.NOT_FOUND);

        organizer.roles = [...organizer.roles, role]

        return await this.organizerRepository.save(organizer);

    }

    async findRoleFromOrganizer(idOrganizer: string, idRole: string) : Promise<RolesEntity> {

        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const role : RolesEntity = await this.rolesRepository.findOne({where: {id: idRole}});
        if (!role)
            throw new BusinessLogicException("The role with the given id was not found", BusinessError.NOT_FOUND);

        const organizerRole : RolesEntity = organizer.roles.find( rol => rol.id === role.id )

        if(!organizerRole)
            throw new BusinessLogicException("The given role has not been set to the organizer", BusinessError.PRECONDITION_FAILED);

        return organizerRole;
        
    }

    async findAllRolesFromOrganizer(idOrganizer: string) : Promise<RolesEntity[]> {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}, relations: ["torunaments","roles"]});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        return organizer.roles;
    }

    async associateRolesToOrganizer(idOrganizer: string, roles: RolesEntity[]) : Promise<OrganizerEntity> {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}, relations: ["torunaments","roles"]});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < roles.length; i++ ) {
            const role : RolesEntity = await this.rolesRepository.findOne({where: {id: roles[i].id}});
            if(!role)
                throw new BusinessLogicException("A role in the set of roles does not exist", BusinessError.NOT_FOUND);
        }
        organizer.roles = roles;

        return await this.organizerRepository.save(organizer);
    }

    async deleteRoleFromOrganizer(idOrganizer: string, idRole: string) {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const role : RolesEntity = await this.rolesRepository.findOne({where: {id: idRole}});
        if (!role)
            throw new BusinessLogicException("The role with the given id was not found", BusinessError.NOT_FOUND);

        const organizerRole : RolesEntity= organizer.roles.find( rol => rol.id === role.id)
        if(!organizerRole)
            throw new BusinessLogicException("The role is not associated to the organizer", BusinessError.NOT_FOUND);

        organizer.roles = organizer.roles.filter( rol => rol.id !== idRole)

        return await this.organizerRepository.save(organizer);
    }
}
