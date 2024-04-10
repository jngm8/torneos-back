/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TournamentUserService } from './tournament-user.service';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TournamentEntity } from '../tournament/tournament.entity';
import { faker } from '@faker-js/faker';
import { Role } from '../shared/security/enums/role.enum';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';

describe('TournamentUserService', () => {
  let service: TournamentUserService;
  let tournamentRepository: Repository<TournamentEntity>;
  let userRepository: Repository<UserEntity>;
  let user: UserEntity;
  let tournamentList: TournamentEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TournamentUserService],
    }).compile();

    service = module.get<TournamentUserService>(TournamentUserService);
    tournamentRepository = module.get<Repository<TournamentEntity>>(getRepositoryToken(TournamentEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {

    tournamentRepository.clear();
    userRepository.clear();
    tournamentList = [];

    for(let i = 0; i < 5; i++) {
      const tournament : TournamentEntity  = await tournamentRepository.save({
        name: faker.person.firstName(),
        date: faker.date.recent().toString(),
        address: faker.location.street(),
        image: faker.image.url(),
        users: [],
      }); 
      tournamentList.push(tournament);
    }

    user = await userRepository.save({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      role: Role.USER,
      tournaments: tournamentList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


}
);