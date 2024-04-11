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

  it('addRoleToOrganizer add role to organizer', async () => {
    const newRole : RolesEntity = await roleRepository.save({
      role : faker.person.jobArea()
    })

    const newOrganizer : OrganizerEntity = await organizerRepository.save({
      company: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      location: faker.location.direction(),
      phone: faker.phone.number(),
      webpage: faker.internet.url()
    })

    const result : OrganizerEntity = await service.addRolesToOrganizer(newOrganizer.id, newRole.id);

    expect(result.roles.length).toBe(1);
    expect(result.roles[0]).not.toBeNull();
    expect(result.roles[0].id).toBe(newRole.id);
  });

  it('addRoleToOrganizer should throw an exception for an invalid role', async () => {

    const newOrganizer : OrganizerEntity = await organizerRepository.save({
      company: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      location: faker.location.direction(),
      phone: faker.phone.number(),
      webpage: faker.internet.url()
    })

    await expect(service.addRolesToOrganizer(newOrganizer.id, "0")).rejects.toHaveProperty("message", "The role with the given id was not found");
  });

  it('addRoleToOrganizer should throw an exception for an invalid organizer', async () => {

    const newRole : RolesEntity = await roleRepository.save({
      role : faker.person.jobArea()
    })
    await expect(service.addRolesToOrganizer("0", newRole.id)).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('findRoleFromOrganizer find role from organizer', async() => {
    const role : RolesEntity = rolesList[0];

    const storedRole : RolesEntity = await service.findRoleFromOrganizer(organizer.id, role.id);

    expect(storedRole).not.toBeNull();
    expect(storedRole.id).toBe(role.id)
    expect(storedRole.role).toBe(role.role)
  });

  it('findRolesFromOrganizer throws an exception for an invalid organizer', async() => {
    await expect(service.findAllRolesFromOrganizer("0")).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('associateRolesToOrganizer associate roles list to organizer', async() => {
    const newRole : RolesEntity = await roleRepository.save({
      role : faker.person.jobArea()
    });

    const updatedOrganizer : OrganizerEntity = await service.associateRolesToOrganizer(organizer.id, [newRole]);

    expect(updatedOrganizer.roles.length).toBe(1);
    expect(updatedOrganizer.roles[0].id).toBe(newRole.id);
  });

  it('associateRolesToOrganizer should throw an exception for an invalid organizer', async() => {
    const newRole : RolesEntity = await roleRepository.save({
      role : faker.person.jobArea()
    });

    await expect(service.associateRolesToOrganizer("0", [newRole])).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('associateRolesToOrganizer should throw an exception for an invalid role', async() => {
    const newRole : RolesEntity = await roleRepository.save({
      role : faker.person.jobArea()
    });

    newRole.id = "0";

    await expect(service.associateRolesToOrganizer(organizer.id, [newRole])).rejects.toHaveProperty("message", "The role with the given id was not found");
  });

  it('removeRoleFromOrganizer remove role from organizer', async() => {
    const role : RolesEntity = rolesList[0];

    await service.deleteRoleFromOrganizer(organizer.id, role.id);

    const storedOrganizer : OrganizerEntity = await organizerRepository.findOne({where: {id: organizer.id}, relations: ["roles"]});

    const storedRole : RolesEntity = storedOrganizer.roles.find( r => r.id === role.id);

    expect(storedRole).toBeUndefined();
  });

  it('removeRoleFromOrganizer should throw an exception for an invalid role', async() => {
    await expect(() => service.deleteRoleFromOrganizer(organizer.id,"0")).rejects.toHaveProperty("message", "The role with the given id was not found");
  });

  it('removeRoleFromOrganizer should throw an exception for an invalid organizer', async() => {
    const role : RolesEntity = rolesList[0];
    await expect(() => service.deleteRoleFromOrganizer("0", role.id)).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('removeRoleFromOrganizer should throw an exception for an invalid role', async() => {
    const newRole : RolesEntity = await roleRepository.save({
      role : faker.person.jobArea()
    });

    await expect(() => service.deleteRoleFromOrganizer(organizer.id, newRole.id)).rejects.toHaveProperty("message", "The role is not associated to the organizer");
  });

});
