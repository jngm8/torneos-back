import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TournamentEntity } from './tournament.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TournamentService', () => {
  let service: TournamentService;
  let repository: Repository<TournamentEntity>;
  let tournamentList: TournamentEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [TournamentService],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
    repository = module.get<Repository<TournamentEntity>>(getRepositoryToken(TournamentEntity));
    await seedDataBase();
  });


  const seedDataBase = async () => {
    repository.clear();
    tournamentList = [];
    for(let i = 0; i < 5; i++) {
      const tournament : TournamentEntity = await repository.save({
        name: faker.person.firstName(),
        date: faker.date.recent().toString(),
        dateEnd: faker.date.recent().toString(),
        address: faker.location.street(),
        image: faker.image.url(),
        description: faker.lorem.sentence(),
      });
      tournamentList.push(tournament);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tournaments', async () => {
    const tournaments : TournamentEntity[] = await service.findAll();
    expect(tournaments).not.toBeNull();
    expect(tournaments).toHaveLength(tournamentList.length);
  });

  it('should return a tournament by id', async () => {
    const storedTournament : TournamentEntity = tournamentList[0];
    const tournament : TournamentEntity = await service.findOne(storedTournament.id);
    expect(tournament).not.toBeNull();
    expect(tournament.name).toEqual(storedTournament.name);
    expect(tournament.date).toEqual(storedTournament.date);
    expect(tournament.address).toEqual(storedTournament.address);

  });

  it('should return an exception when the tournament does not exist', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The tournament with the given id was not found")
  });

  it('create should return a new tournament', async () => {
    const tournament = {
      id: "1",
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      dateEnd: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      organizer: null,
      users: []
    }

    const newTournament = await service.create(tournament);
    expect(newTournament).not.toBeNull();
    expect(newTournament.name).toEqual(tournament.name);
    expect(newTournament.date).toEqual(tournament.date);
    expect(newTournament.address).toEqual(tournament.address);
    expect(newTournament.image).toEqual(tournament.image);
  });

  it('shouil update a tournament', async () => {
    const tournament : TournamentEntity = tournamentList[0];
    tournament.name = "new name";
    tournament.address = "new address";
    const updatedTournament : TournamentEntity = await service.update(tournament.id, tournament);
    expect(updatedTournament).not.toBeNull();
    const storedTournament : TournamentEntity = await repository.findOne({where: {id: tournament.id}});
    expect(storedTournament.name).toEqual(tournament.name);
    expect(storedTournament.address).toEqual(tournament.address);

  });

  it('update should return an exception when the tournament does not exist', async () => {
    let tournament : TournamentEntity = tournamentList[0];

    tournament = {
      ...tournament,
      name: "new name",
      address: "new address"
    }

    await expect(() => service.update("0", tournament)).rejects.toHaveProperty("message", "The tournament with the given id was not found");
  });

  it('should delete a tournament', async () => {
    const tournament : TournamentEntity = tournamentList[0];
    await service.delete(tournament.id);
    const storedTournament : TournamentEntity = await repository.findOne({where: {id: tournament.id}});
    expect(storedTournament).toBeNull();
  });

  it('should return an exception when the tournament does not exist', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The tournament with the given id was not found");
  });


});
