import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Role } from '../shared/security/enums/role.enum';


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
      });
      userList.push(user);
      }
    };

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return all users', async () => {
      const users : UserEntity[] = await service.findAll();
      expect(users).not.toBeNull();
      expect(users).toHaveLength(userList.length);
    });

    it('should return a user by id', async () => {
      const storedUser : UserEntity = userList[0];
      const user : UserEntity = await service.findOne(storedUser.id);
      expect(user).not.toBeNull();
      expect(user.username).toEqual(storedUser.username);
      expect(user.password).toEqual(storedUser.password);
    });

    it('should return an exception when the user does not exist', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('create a user', async () => {
      const user = {
        id: "1",
        username: faker.person.firstName(),
        password: faker.internet.password(),
        tournaments: [],
        role: Role.USER
      }

      const newUser : UserEntity = await service.create(user);
      expect(newUser).not.toBeNull();
      expect(newUser.username).toEqual(user.username);
      expect(newUser.password).toEqual(user.password);
    });

    it('should update a user', async () => {
      const user : UserEntity = userList[0];
      user.username = faker.person.firstName();
      user.password = faker.internet.password();
      const updatedUser : UserEntity = await service.update(user.id, user);
      expect(updatedUser).not.toBeNull();
      const storedUser : UserEntity = await repository.findOne({where: {id: user.id}});
      expect(storedUser.username).toEqual(user.username);
      expect(storedUser.password).toEqual(user.password);
    });

    it('update should return an exception when the user does not exist', async () => {
      let user : UserEntity = userList[0];
      user = {
        ...user,
        id: "2",
        username: faker.person.firstName(),
        password: faker.internet.password()
      }
      await expect(() => service.update("0", user)).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('delete should remove a user', async () => {
      const user : UserEntity = userList[0];
      await service.delete(user.id);
      const storedUser : UserEntity = await repository.findOne({where: {id: user.id}});
      expect(storedUser).toBeNull();
    });

    it('delete should return an exception when the user does not exist', async () => {
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

  }
);

