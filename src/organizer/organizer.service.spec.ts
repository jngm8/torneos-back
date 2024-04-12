import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerService } from './organizer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
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


  const seedDataBase = async () => {
    repository.clear();
    organizerList = []
    for(let i = 0; i < 5; i++) {
      const organizer : OrganizerEntity = await repository.save({
        company: faker.company.name(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        location: faker.location.direction(),
        phone: faker.phone.number(),
        webpage: faker.internet.url()
      });
      organizerList.push(organizer);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all organizers', async () => {
    const organizers : OrganizerEntity[] = await service.findAll();
    expect(organizers).not.toBeNull();
    expect(organizers).toHaveLength(organizerList.length);
  });

  it('should return an organizer by id', async () => {
    const storedOrganizer : OrganizerEntity = organizerList[0];
    const organizer : OrganizerEntity = await service.findOne(storedOrganizer.id);
    expect(organizer).not.toBeNull();
    expect(organizer.company).toEqual(storedOrganizer.company);
    expect(organizer.email).toEqual(storedOrganizer.email);
    expect(organizer.location).toEqual(storedOrganizer.location);
    expect(organizer.phone).toEqual(storedOrganizer.phone);
    expect(organizer.webpage).toEqual(storedOrganizer.webpage);
  });

  it("should return an exception when the organizer does not exist", async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('create should return a new organizer', async () => {
    const organizer = {
      id: "1",
      company: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      location: faker.location.direction(),
      phone: faker.phone.number(),
      webpage: faker.internet.url(),
      tournaments: [],
      roles: []
    }

    const newOrganizer = await service.create(organizer);
    expect(newOrganizer).not.toBeNull();
    expect(newOrganizer.company).toEqual(organizer.company);
    expect(newOrganizer.email).toEqual(organizer.email);
    expect(newOrganizer.location).toEqual(organizer.location);
    expect(newOrganizer.phone).toEqual(organizer.phone);
    expect(newOrganizer.webpage).toEqual(organizer.webpage);
  });

  it('should update an organizer', async () => {
    const organizer : OrganizerEntity = organizerList[0];
    organizer.company = "New name";
    organizer.email = "new email";
    const updatedOrganizer : OrganizerEntity = await service.update(organizer.id, organizer);
    expect(updatedOrganizer).not.toBeNull();
    const storedOrganizer : OrganizerEntity = await repository.findOne({where: {id: organizer.id}});
    expect(storedOrganizer.company).toEqual(organizer.company);
    expect(storedOrganizer.email).toEqual(organizer.email);
  });

  it('update should return an exception when the organizer does not exist', async () => {
    let organizer : OrganizerEntity = organizerList[0];
    organizer = {
      ...organizer,
      id: "2",
      company: "new name",
      email: "new email"
    }
    await expect(() => service.update("0", organizer)).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('delete should remove an organizer', async () => {
    const organizer : OrganizerEntity = organizerList[0];
    await service.delete(organizer.id);
    const storedOrganizer : OrganizerEntity = await repository.findOne({where: {id: organizer.id}});
    expect(storedOrganizer).toBeNull();
  });

  it('should return an exception when the organizer does not exist', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });
});
