import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerRolesService } from './organizer-roles.service';
import { RolesEntity } from '../roles/roles.entity';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { OrganizerEntity } from '../organizer/organizer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('OrganizerRolesService', () => {
  let service: OrganizerRolesService;
  let organizerRepository: Repository<OrganizerEntity>;
  let roleRepository: Repository<RolesEntity>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let organizer: OrganizerEntity;
  let rolesList : RolesEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OrganizerRolesService],
    }).compile();

    service = module.get<OrganizerRolesService>(OrganizerRolesService);
    organizerRepository = module.get<Repository<OrganizerEntity>>(getRepositoryToken(OrganizerEntity));
    roleRepository = module.get<Repository<RolesEntity>>(getRepositoryToken(RolesEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {
      
      organizerRepository.clear();
      roleRepository.clear();
      rolesList = [];
  
      for(let i = 0; i < 5; i++) {
        const role : RolesEntity  = await roleRepository.save({
          role: faker.person.firstName(),
          organizers: []
        }); 
        rolesList.push(role);
      }
  
      organizer = await organizerRepository.save({
        company: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        location: faker.location.direction(),
        phone: faker.phone.number(),
        webpage: faker.internet.url(),
        tournaments: [],
        roles: rolesList
      });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
