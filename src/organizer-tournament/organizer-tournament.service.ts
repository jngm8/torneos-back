import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/security/errors/business-errors';
import { TournamentEntity } from 'src/tournament/tournament.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizerTournamentService {

    constructor(

        @InjectRepository(OrganizerEntity)
        private readonly organizerRepository: Repository<OrganizerEntity>,
        @InjectRepository(TournamentEntity)
        private readonly tournamentRepository: Repository<TournamentEntity>

    ){}


    async addTournamentToOrganizer(idTournament: string, idOrganizer: string): Promise<OrganizerEntity> {
        
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: idTournament}});
        if (!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);

        organizer.tournaments = [...organizer.tournaments, tournament]

        return await this.organizerRepository.save(organizer)
    }

    async findTournamentFromOrganizer(idTournament: string, idOrganizer: string): Promise<TournamentEntity> {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: idTournament}});
        if (!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);

        const organizerTournament : TournamentEntity = organizer.tournaments.find(tournament => tournament.id === tournament.id);

        if(!organizerTournament)
            throw new BusinessLogicException("The organizer does not have this tournament", BusinessError.PRECONDITION_FAILED)
        
        return organizerTournament;
    }
}
