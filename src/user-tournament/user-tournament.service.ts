import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { TournamentUserEntity } from './user-tournament.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { TournamentEntity } from '../tournament/tournament.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TournamentUserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(TournamentEntity)
        private readonly tournamentRepository : Repository<TournamentEntity>,
        @InjectRepository(TournamentUserEntity)
        private readonly tournamentUserRepository : Repository<TournamentUserEntity>,

    ){}

    async addTournamentToUser(idUser: string, idTournament: string, category: string): Promise<TournamentUserEntity> {

        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments", "tournaments.tournament"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: idTournament}});
        if(!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);

        if(!user.tournaments)
            user.tournaments = []

        const userTournament = this.tournamentUserRepository.findOne({where: {user: user, tournament: tournament}});
        if(userTournament)
            throw new BusinessLogicException("The tournament is already associated to the user", BusinessError.PRECONDITION_FAILED);
        
        const tournamentUser : TournamentUserEntity = new TournamentUserEntity();

        tournamentUser.category = category;
        tournamentUser.tournament = tournament;
        tournamentUser.user = user;

        const plainClass = plainToClass(TournamentUserEntity, tournamentUser)

        user.tournaments = [...user.tournaments, plainClass]

        return await this.tournamentUserRepository.save(tournamentUser);        

    }

    async findTournamentFromUser(idUser: string, idTournament: string) : Promise<TournamentEntity> {

        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments", "tournaments.tournament", "tournaments.user"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: idTournament}});
        if(!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);
        
        const userTournament : TournamentUserEntity = user.tournaments.find( tour => tour.tournament.id === tournament.id)
        if (!userTournament)
            throw new BusinessLogicException("The tournament with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED);
        
        return userTournament.tournament;
    }

    async findAllTournamentsFromUser(idUser: string) : Promise<TournamentUserEntity[]> {
        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments", "tournaments.tournament"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return user.tournaments;
    }

    async associateTournamentsToUser(idUser: string, tournaments: TournamentEntity[]) : Promise<TournamentUserEntity[]> {
        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments", "tournaments.tournament"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        // Verify the existance of the tournaments
        for(let i = 0; i < tournaments.length ; i++) {
            const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: tournaments[i].id}})
            if(!tournament)
                throw new BusinessLogicException("A tournament from the list of tournaments does not exist", BusinessError.NOT_FOUND);    
        }

        // Check if the user has already associated tournaments and delete them
        const userCheck = await this.tournamentUserRepository.find({where: {user: user}});
        if(userCheck)
            await this.tournamentUserRepository.delete({user: user});

        //Associate the new tournaments to the user
        const listTournaments: TournamentUserEntity[] = [];
        for(let i = 0; i < tournaments.length; i++) {
            const tournamentUser : TournamentUserEntity = new TournamentUserEntity();
            tournamentUser.tournament = tournaments[i];
            tournamentUser.user = user;
            tournamentUser.category = "intermidiate";
            listTournaments.push(tournamentUser);
            await this.tournamentUserRepository.save(tournamentUser);
        }

        return listTournaments;

    }

    async deleteTournamentFromUser(idUser: string, idTournament: string) {
        const user : UserEntity = await this.userRepository.findOne({where: {id: idUser}, relations: ["tournaments", "tournaments.tournament"]});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);

        const tournament : TournamentEntity = await this.tournamentRepository.findOne({where: {id: idTournament}});
        if(!tournament)
            throw new BusinessLogicException("The tournament with the given id was not found", BusinessError.NOT_FOUND);
        
        const userTournament : TournamentUserEntity = user.tournaments.find( tour => tour.tournament.id === tournament.id)
        if (!userTournament)
            throw new BusinessLogicException("The tournament does not exist for the given user", BusinessError.PRECONDITION_FAILED);

        user.tournaments = user.tournaments.filter( tour => tour.tournament.id !== idTournament);

        await this.tournamentUserRepository.delete(userTournament.id);

        return await this.userRepository.save(user);
    }


}
