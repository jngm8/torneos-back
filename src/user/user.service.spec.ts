import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';


describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let userList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDataBase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDataBase = async () => {
    repository.clear();
    userList = [];
    for(let i = 0; i < 5; i++) {
      const user : UserEntity = await repository.save({
        username: faker.person.firstName(),
        password: faker.internet.password(),
        roles: [],
        tournaments: [],
      });
      userList.push(user);
      }
    };

  }
);

