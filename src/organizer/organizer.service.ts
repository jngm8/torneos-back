import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerEntity } from './organizer.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/security/errors/business-errors';

@Injectable()
export class OrganizerService {
    constructor(
        @InjectRepository(OrganizerEntity)
        private readonly organizerRepository : Repository<OrganizerEntity>
    ){}

    async findAll(): Promise<OrganizerEntity[]> {
        return await this.organizerRepository.find({relations:["tournaments","roles"]});
    }

    async findRolesByOrganizerId(organizerId: string): Promise<OrganizerEntity> {
        const organizer : OrganizerEntity =  await this.organizerRepository.findOne({where: {id: organizerId}, relations:["roles"]});
        if (!organizer)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        return organizer
    }
}
