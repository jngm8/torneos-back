import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerTournamentService } from './organizer-tournament.service';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { OrganizerEntity } from '../organizer/organizer.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('OrganizerTournamentService', () => {
  let service: OrganizerTournamentService;
  let organizerRepository: Repository<OrganizerEntity>;
  let tournamentRepository: Repository<TournamentEntity>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let organizer: OrganizerEntity;
  let tournamentList: TournamentEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OrganizerTournamentService],
    }).compile();

    service = module.get<OrganizerTournamentService>(OrganizerTournamentService);
    organizerRepository = module.get<Repository<OrganizerEntity>>(getRepositoryToken(OrganizerEntity));
    tournamentRepository = module.get<Repository<TournamentEntity>>(getRepositoryToken(TournamentEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {
      
      organizerRepository.clear();
      tournamentRepository.clear();
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
  
      organizer = await organizerRepository.save({
        company: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        location: faker.location.direction(),
        phone: faker.phone.number(),
        webpage: faker.internet.url(),
        tournaments: tournamentList,
        roles:[]
      });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
