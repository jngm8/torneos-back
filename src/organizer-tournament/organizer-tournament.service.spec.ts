import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerTournamentService } from './organizer-tournament.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
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
          description: faker.lorem.sentence(),
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
        tournaments: tournamentList
      });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTournamentToOrganizer add tournament to organizer', async () => {
    const newTournament : TournamentEntity = await tournamentRepository.save({
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      users: [],
    });

    const newOrganizer : OrganizerEntity = await organizerRepository.save({
      company: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      location: faker.location.direction(),
      phone: faker.phone.number(),
      webpage: faker.internet.url()
    });


    const result : OrganizerEntity = await service.addTournamentToOrganizer(newOrganizer.id, newTournament.id);

    expect(result.tournaments.length).toBe(1);
    expect(result.tournaments[0]).not.toBeNull();
    expect(result.tournaments[0].id).toBe(newTournament.id);
    expect(result.tournaments[0].name).toBe(newTournament.name);
    expect(result.tournaments[0].date).toBe(newTournament.date);
    expect(result.tournaments[0].address).toBe(newTournament.address);
    expect(result.tournaments[0].image).toBe(newTournament.image);
  });

  it('addTournamentToOrganizer should throw an exception for an invalid tournament', async () => {

    const newOrganizer : OrganizerEntity = await organizerRepository.save({
      company: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      location: faker.location.direction(),
      phone: faker.phone.number(),
      webpage: faker.internet.url()
    });
    await expect(service.addTournamentToOrganizer(newOrganizer.id, "0")).rejects.toHaveProperty("message", "The tournament with the given id was not found");
  });

  it('addTournamentToOrganizer should throw an exception for an invalid organizer', async () => {

    const newTournament : TournamentEntity = await tournamentRepository.save({
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      users: [],
    });
    await expect(service.addTournamentToOrganizer("0", newTournament.id)).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('findTournamentFromOrganizer finds a tournament fron an organizer', async () => {
    const tournament : TournamentEntity = tournamentList[0];

    const storedTournament : TournamentEntity = await service.findTournamentFromOrganizer(organizer.id, tournament.id);

    expect(storedTournament).not.toBeNull();
    expect(storedTournament.id).toBe(tournament.id)
    expect(storedTournament.name).toBe(tournament.name);
    expect(storedTournament.address).toBe(tournament.address);
    expect(storedTournament.date).toBe(tournament.date);
    expect(storedTournament.image).toBe(tournament.image);
  });

  it('findTournamentsFromOrganizer should throw an exception for an invalid organizer', async () => {
    await expect(service.findAllTournamentsFromOrganizer("0")).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('associateTournamentToOrganizer should update a tournament list for a organizer', async () => {
    const newTournament : TournamentEntity = await tournamentRepository.save({
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
    });

    const updatedOrganizer : OrganizerEntity = await service.associateTournamentToOrganizer(organizer.id, [newTournament]);

    expect(updatedOrganizer.tournaments.length).toBe(1);
    expect(updatedOrganizer.tournaments[0]).not.toBeNull();
    expect(updatedOrganizer.tournaments[0].id).toBe(newTournament.id);
    expect(updatedOrganizer.tournaments[0].name).toBe(newTournament.name);
    expect(updatedOrganizer.tournaments[0].date).toBe(newTournament.date);
    expect(updatedOrganizer.tournaments[0].address).toBe(newTournament.address);
    expect(updatedOrganizer.tournaments[0].image).toBe(newTournament.image);
  });

  it('associateTournamentToOrganizer should throw an exception for an invalid organizer', async () => {
    const newTournament : TournamentEntity = await tournamentRepository.save({
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
    });

    await expect(service.associateTournamentToOrganizer("0", [newTournament])).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('associateTournamentToOrganizer should throw an exception for an invalid tournament', async () => {
    const newTournament : TournamentEntity = tournamentList[0];

    newTournament.id = "0";

    await expect(service.associateTournamentToOrganizer(organizer.id, [newTournament])).rejects.toHaveProperty("message", "The tournament isnt associated to the organizer");
  });

  it('deleteTournamentFromOrganizer should delete a tournament from an organizer', async () => {
    const tournament : TournamentEntity = tournamentList[0];

    await service.deleteTournamentFromOrganizer(organizer.id, tournament.id);

    const storedOrganizer : OrganizerEntity = await organizerRepository.findOne({ where: {id: organizer.id},relations: ['tournaments']});

    const storedTournament : TournamentEntity = await storedOrganizer.tournaments.find( tour => tour.id === tournament.id);

    expect(storedTournament).toBeUndefined();
  });

  it('deleteTournamentFromOrganizer should throw an exception for an invalid tournament', async () => {
    await expect(service.deleteTournamentFromOrganizer(organizer.id,"0")).rejects.toHaveProperty("message", "The tournament with the given id was not found");
  });

  it('deleteTournamentFromOrganizer should throw an exception for an invalid organizer', async () => {
    const tournament : TournamentEntity = tournamentList[0];
    await expect(service.deleteTournamentFromOrganizer("0", tournament.id)).rejects.toHaveProperty("message", "The organizer with the given id was not found");
  });

  it('deleteTournamentFromOrganizer should throw an exception for a no associated tournament', async () => {
    const newTournament : TournamentEntity = await tournamentRepository.save({
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
    });

    await expect(() => service.deleteTournamentFromOrganizer(organizer.id, newTournament.id)).rejects.toHaveProperty("message", "The deleted tournament is not associated to the organizer");

  });

});
