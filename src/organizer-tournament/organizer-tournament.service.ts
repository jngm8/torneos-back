import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerEntity } from '../organizer/organizer.entity';
import { BusinessError, BusinessLogicException } from '../shared/security/errors/business-errors';
import { TournamentEntity } from '../tournament/tournament.entity';
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
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}, relations: ["tournaments","roles"]});
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

    async findAllTournamentsFromOrganizer(idOrganizer: string) : Promise<TournamentEntity[]> {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}, relations: ["tournaments","roles"]});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const tournaments : TournamentEntity[] = organizer.tournaments;

        return tournaments;
    }

    async associateTournamentToOrganizer(idOrganizer: string, tournaments: TournamentEntity[]) : Promise<OrganizerEntity> {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}, relations: ["tournaments","roles"]});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        for(let i=0; i < tournaments.length ; i++) {
            const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id : tournaments[i].id}})
            if(!tournament)
                throw new BusinessLogicException("The tournament isnt associated to the organizer", BusinessError.NOT_FOUND);
        }

        organizer.tournaments = tournaments;

        return await this.organizerRepository.save(organizer);
    }

    async deleteTournamentFromOrganizer(idOrganizer: string, idTournament: string) {
        const organizer : OrganizerEntity = await this.organizerRepository.findOne({where: {id: idOrganizer}});
        if(!organizer)
            throw new BusinessLogicException("The organizer with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: idTournament}});
        if (!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);

        const organizerTournament : TournamentEntity = organizer.tournaments.find(tour => tour.id === tournament.id)
        if(!organizerTournament)
            throw new BusinessLogicException("The deleted tournament is not associated to the organizer", BusinessError.PRECONDITION_FAILED);


        organizer.tournaments = organizer.tournaments.filter( tour => tour.id !== idTournament);

        return await this.organizerRepository.save(organizer);
    }
}
