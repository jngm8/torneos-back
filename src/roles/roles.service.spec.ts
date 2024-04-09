import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './roles.service';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './roles.entity';
import { faker } from '@faker-js/faker';

describe('RoleService', () => {
  let service: RoleService;
  let repository: Repository<RolesEntity>;
  let roleList: RolesEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [RoleService],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get<Repository<RolesEntity>>(getRepositoryToken(RolesEntity));
    await seedDataBase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDataBase = async () => {
    repository.clear();
    roleList = [];
    for(let i = 0; i < 5; i++) {
      const role : RolesEntity = await repository.save({
        role: faker.person.jobTitle(),
        organizers: [],
      });
      roleList.push(role);
    }
  }
});
