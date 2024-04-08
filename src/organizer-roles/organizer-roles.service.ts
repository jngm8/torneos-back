import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { RolesEntity } from 'src/roles/roles.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/security/errors/business-errors';
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
}
