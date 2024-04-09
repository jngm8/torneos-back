import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerService } from './organizer.service';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizerEntity } from './organizer.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('OrganizerService', () => {
  let service: OrganizerService;
  let repository: Repository<OrganizerEntity>;
  let organizerList: OrganizerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [OrganizerService],
    }).compile();

    service = module.get<OrganizerService>(OrganizerService);
    repository = module.get<Repository<OrganizerEntity>>(getRepositoryToken(OrganizerEntity));
    await seedDataBase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDataBase = async () => {
    repository.clear();
    organizerList = []
    for(let i = 0; i < 5; i++) {
      const organizer : OrganizerEntity = await repository.save({
        company: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        location: faker.location.direction(),
        phone: faker.phone.number(),
        webpage: faker.internet.url(),
        tournaments: [],
        roles:[]
      });
      organizerList.push(organizer);
    }
  }
});
