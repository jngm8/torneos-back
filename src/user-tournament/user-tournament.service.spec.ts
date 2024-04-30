import { Test, TestingModule } from '@nestjs/testing';
import { TournamentUserService } from './user-tournament.service';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TournamentUserEntity } from './user-tournament.entity';
import { faker } from '@faker-js/faker';
import { Role } from '../shared/enums/role.enum';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TournamentEntity } from '../tournament/tournament.entity';

describe('TournamentUserService', () => {
  let service: TournamentUserService;
  let tournamentUserRepository: Repository<TournamentUserEntity>;
  let userRepository: Repository<UserEntity>;
  let user: UserEntity;
  let tournamentRepository: Repository<TournamentEntity>;
  let tournamentList: TournamentUserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TournamentUserService],
    }).compile();

    service = module.get<TournamentUserService>(TournamentUserService);
    tournamentUserRepository = module.get<Repository<TournamentUserEntity>>(getRepositoryToken(TournamentUserEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    tournamentRepository = module.get<Repository<TournamentEntity>>(getRepositoryToken(TournamentEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {

    tournamentUserRepository.clear();
    userRepository.clear();
    tournamentList = [];

    for(let i = 0; i < 5; i++) {
      const tournament : TournamentUserEntity  = await tournamentUserRepository.save({
        category: faker.lorem.word(), 
        tournament: await tournamentRepository.save({
          name: faker.person.firstName(),
          date: faker.date.recent().toString(),
          address: faker.location.street(),
          image: faker.image.url(),
          description: faker.lorem.sentence(),
        }),
      }); 
      tournamentList.push(tournament);
    }

    user = await userRepository.save({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      role: Role.USER,
      tournaments: tournamentList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  

  it('Add tournament to user', async () => {

    const newTournament : TournamentEntity = await tournamentRepository.save({
      name: faker.person.firstName(),
      date: faker.date.recent().toString(),
      address: faker.location.street(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
    });

      const newUser : UserEntity = await userRepository.save({
        username: faker.person.firstName(),
        password: faker.internet.password(),
      });

      const result : TournamentUserEntity = await service.addTournamentToUser(newUser.id, newTournament.id, faker.lorem.word());
      
      expect(result.user.tournaments.length).toBe(1);
      expect(result.user.tournaments[0]).not.toBeNull();
      expect(result.user.tournaments[0].tournament.id).toBe(newTournament.id);
    });

    it('addTournamentToUser should throw an exception for an invalid tournament', async () => {

      const newUser : UserEntity = await userRepository.save({
        username: faker.person.firstName(),
        password: faker.internet.password(),
      });
      await expect(service.addTournamentToUser(newUser.id, "0",faker.lorem.word(),  
    )).rejects.toHaveProperty("message", "The tournament with the given id was not found");
    });

    it('addTournamentToUser should throw an exception for an invalid user', async () => {

      const newTournament : TournamentUserEntity = await tournamentUserRepository.save({
        idTournament: faker.string.uuid(),
        category: faker.lorem.word(),  
      });
      await expect(service.addTournamentToUser("0", newTournament.id,faker.lorem.word())).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('findTournamentFromUser find tournament from user', async() => {
      const tournament : TournamentUserEntity = tournamentList[0];

      const storedTournament : TournamentEntity = await service.findTournamentFromUser(user.id, tournament.tournament.id);

      expect(storedTournament).not.toBeNull();
      expect(storedTournament.id).toBe(tournament.tournament.id);
    });

    it('findTournamentsFromUser should throw an exception for an invalid user', async() => {
      await expect(service.findAllTournamentsFromUser("0")).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('associateTournamentToUser should update a tournament list from a user' , async () => {
      const newTournament : TournamentEntity = await tournamentRepository.save({
        name: faker.person.firstName(),
        date: faker.date.recent().toString(),
        address: faker.location.street(),
        image: faker.image.url(),
        description: faker.lorem.sentence(),
      });

      const storedUserTournament : TournamentUserEntity[] = await service.associateTournamentsToUser(user.id, [newTournament]);

      expect(storedUserTournament.length).toBe(1);
      expect(storedUserTournament[0].tournament.id).toBe(newTournament.id);
      expect(storedUserTournament[0].tournament.name).toBe(newTournament.name);
      expect(storedUserTournament[0].tournament.date).toBe(newTournament.date);
      expect(storedUserTournament[0].tournament.address).toBe(newTournament.address);

    });

    it('associateTournamentToUser should throw an exception for an invalid user', async () => {
      const newTournament : TournamentEntity = await tournamentRepository.save({
        name: faker.person.firstName(),
        date: faker.date.recent().toString(),
        address: faker.location.street(),
        image: faker.image.url(),
        description: faker.lorem.sentence(),
      });

      await expect(() => service.associateTournamentsToUser("0", [newTournament])).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('deleteTournamentFromUser should delete a tournament from a user', async () => {
      const tournament : TournamentUserEntity = tournamentList[0];

      await service.deleteTournamentFromUser(user.id, tournament.tournament.id);

      const storedUser : UserEntity = await userRepository.findOne({where: {id: user.id}, relations: ["tournaments"]});

      const storedTournament : TournamentUserEntity = storedUser.tournaments.find( tour => tour.id === tournament.id);
      
      expect(storedTournament).toBeUndefined();
    });

    it('deleteTournamentFromUser should throw an exception for an invalid tournament', async () => {
      await expect(() => service.deleteTournamentFromUser(user.id, "0")).rejects.toHaveProperty("message", "The tournament with the given id was not found");
    });

    it('deleteTournamentFromUser should throw an exception for an invalid user', async () => {
      const tournament : TournamentUserEntity = tournamentList[0];
      await expect(() => service.deleteTournamentFromUser("0", tournament.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('deleteTournamentFromUser should throw an exception for a tournament not associated to the user', async () => {
      const newTournament : TournamentEntity = await tournamentRepository.save({
        name: faker.person.firstName(),
        date: faker.date.recent().toString(),
        address: faker.location.street(),
        image: faker.image.url(),
        description: faker.lorem.sentence()
      });      
      await expect(() => service.deleteTournamentFromUser(user.id, newTournament.id)).rejects.toHaveProperty("message", "The tournament does not exist for the given user");
    });

  }
);