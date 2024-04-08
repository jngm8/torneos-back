import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentEntity } from 'src/tournament/tournament.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { TournamentUserEntity } from './tournament-user.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/security/errors/business-errors';

@Injectable()
export class TournamentUserService {

    constructor(
        @InjectRepository(TournamentEntity)
        private readonly tournamentRepository : Repository<TournamentEntity>,
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

        
        user.tournaments = [...user.tournaments, tournament]

        return await this.userRepository.save(user)


    }

}
