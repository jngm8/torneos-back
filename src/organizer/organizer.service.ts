import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerEntity } from './organizer.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/security/errors/business-errors';

@Injectable()
export class OrganizerService {
    constructor(
        @InjectRepository(OrganizerEntity)
        private readonly organizerRepository : Repository<OrganizerEntity>
    ){}

    async findAll(): Promise<OrganizerEntity[]> {
        return await this.organizerRepository.find({relations:["tournaments","roles"]});
    }

    async findOne(id: string) :Promise<OrganizerEntity> {

        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id}, relations:["roles","tournaments"]})

        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        return organizer;

    }

    async create(organizer:OrganizerEntity): Promise<OrganizerEntity>{
        return this.organizerRepository.save(organizer);
    }

    async update(id: string, organizer: OrganizerEntity): Promise<OrganizerEntity> {
        const persistedOrganizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id}});
        if (!persistedOrganizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);
        return await this.organizerRepository.save({...persistedOrganizer, organizer});
    }

    async delete(id: string) {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id}})
        if(!organizer)
            throw new BusinessLogicException("THe orgaizer with the given id was not found", BusinessError.NOT_FOUND);
        return await this.organizerRepository.remove(organizer);
    }

    async findRolesByOrganizerId(organizerId: string): Promise<OrganizerEntity> {
        const organizer : OrganizerEntity =  await this.organizerRepository.findOne({where: {id: organizerId}, relations:["roles"]});
        if (!organizer)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        return organizer
    }
}
