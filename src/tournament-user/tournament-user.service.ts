import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { TournamentUserEntity } from './tournament-user.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TournamentUserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(TournamentUserEntity)
        private readonly tournamentUserRepository : Repository<TournamentUserEntity>
    ){}

    async addTournamentToUser(idUser: string, idTournament: string): Promise<UserEntity> {

        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentUserEntity = await this.tournamentUserRepository.findOne({where: {id: idTournament}});
        if(!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);

        if(!user.tournaments)
            user.tournaments = []
        
        user.tournaments = [...user.tournaments, tournament]

        return await this.userRepository.save(user)

    }

    async findTournamentFromUser(idUser: string, idTournament: string) : Promise<TournamentUserEntity> {

        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentUserEntity = await this.tournamentUserRepository.findOne({where: {id: idTournament}});
        if(!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);


        const userTournament : TournamentUserEntity = user.tournaments.find( tour => tour.id === tournament.id)
        if (!userTournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.PRECONDITION_FAILED);

        return userTournament;
    }

    async findAllTournamentsFromUser(idUser: string) : Promise<TournamentUserEntity[]> {
        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        return user.tournaments;
    }

    async associateTournamentsToUser(idUser: string, tournaments: TournamentUserEntity[]) : Promise<UserEntity> {
        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < tournaments.length ; i++) {
            const tournament : TournamentUserEntity = await this.tournamentUserRepository.findOne({where: {id: tournaments[i].id}})
            if(!tournament)
                throw new BusinessLogicException("A tournament from the list of arrays does not exist", BusinessError.NOT_FOUND)
        }

        user.tournaments = tournaments;

        return await this.userRepository.save(user);
    }

    async deleteTournamentFromUser(idUser: string, idTournament: string) {
        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentUserEntity = await this.tournamentUserRepository.findOne({where: {id: idTournament}});
        if(!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);

        const userTournament : TournamentUserEntity = user.tournaments.find( tour => tour.id === tournament.id)
        if (!userTournament)
            throw new BusinessLogicException("The tournament does not exist for the given user", BusinessError.PRECONDITION_FAILED);

        user.tournaments = user.tournaments.filter( tour => tour.id !== idTournament);

        return await this.userRepository.save(user);
    }

}
