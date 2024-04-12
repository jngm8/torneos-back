import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './roles.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
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

  const seedDataBase = async () => {
    repository.clear();
    roleList = [];
    for(let i = 0; i < 5; i++) {
      const role : RolesEntity = await repository.save({
        role: faker.person.jobTitle(),
      });
      roleList.push(role);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all roles', async () => {
    const roles : RolesEntity[] = await service.findAll();
    expect(roles).not.toBeNull();
    expect(roles).toHaveLength(roleList.length);
  });

  it('should return a role by id', async () => {
    const storedRole : RolesEntity = roleList[0];
    const role : RolesEntity = await service.findOne(storedRole.id);
    expect(role).not.toBeNull();
    expect(role.role).toEqual(storedRole.role);
  });

  it('should return an exception when the role does not exist', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The role with the given id was not found");
  });

  it('create a role', async () => {
    const role = {
      id: "1",
      role: "admin",
      organizers: []
    }

    const newRole : RolesEntity = await service.create(role);
    expect(newRole).not.toBeNull();
  });

  it('should update a role', async () => {
    const role : RolesEntity = roleList[0];
    role.role = "admin";
    const updatedRole : RolesEntity = await service.update(role.id, role);
    expect(updatedRole).not.toBeNull();
    const storedRole : RolesEntity = await repository.findOne({where:{id: role.id}});
    expect(storedRole.role).toEqual(role.role);
  });

  it('update should return an exception when the role does not exist', async () => {
    let role : RolesEntity = roleList[0];
    role ={
      ...role,
      id: "2",
      role: "admin"
    }
    await expect(() => service.update("0", role)).rejects.toHaveProperty("message", "The role with the given id was not found");
  });

  it('delete should remove a role', async () => {
    const role : RolesEntity = roleList[0];
    await service.delete(role.id);
    const storedRole : RolesEntity = await repository.findOne({where:{id: role.id}});
    expect(storedRole).toBeNull();
  });

  it('delete should return an exception when the role does not exist', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The role with the given id was not found");
  });

});
