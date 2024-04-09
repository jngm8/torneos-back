import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TournamentEntity } from './tournament.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TournamentService', () => {
  let service: TournamentService;
  let repository: Repository<TournamentEntity>;
  let tournamentList: TournamentEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [TournamentService],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
    repository = module.get<Repository<TournamentEntity>>(getRepositoryToken(TournamentEntity));
    await seedDataBase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDataBase = async () => {
    repository.clear();
    tournamentList = [];
    for(let i = 0; i < 5; i++) {
      const tournament : TournamentEntity = await repository.save({
        name: faker.person.firstName(),
        date: faker.date.recent().toString(),
        address: faker.location.street(),
        image: faker.image.url(),
        users: [],
      });
      tournamentList.push(tournament);
    }
  }
});
