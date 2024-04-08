import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentEntity } from './tournament.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TournamentService {

    constructor(
        @InjectRepository(TournamentEntity)
        private tournamentRepository: Repository<TournamentEntity>
    ){}

   async findAll(): Promise<TournamentEntity[]> {
    return await this.tournamentRepository.find({relations: ["organizers", "users"]})
   } 
}
