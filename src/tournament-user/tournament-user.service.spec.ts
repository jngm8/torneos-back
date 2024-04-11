import { Test, TestingModule } from '@nestjs/testing';
import { TournamentUserService } from './tournament-user.service';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TournamentUserEntity } from './tournament-user.entity';
import { faker } from '@faker-js/faker';
import { Role } from '../shared/security/enums/role.enum';
import { TypeOrmTestingConfig } from '../shared/security/testing-utils/typeorm-testing-config';

describe('TournamentUserService', () => {
  let service: TournamentUserService;
  let tournamentUserRepository: Repository<TournamentUserEntity>;
  let userRepository: Repository<UserEntity>;
  let user: UserEntity;
  let tournamentList: TournamentUserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TournamentUserService],
    }).compile();

    service = module.get<TournamentUserService>(TournamentUserService);
    tournamentUserRepository = module.get<Repository<TournamentUserEntity>>(getRepositoryToken(TournamentUserEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {

    tournamentUserRepository.clear();
    userRepository.clear();
    tournamentList = [];

    for(let i = 0; i < 5; i++) {
      const tournament : TournamentUserEntity  = await tournamentUserRepository.save({
        participants: faker.number.int(),
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

    const newTournament : TournamentUserEntity = await tournamentUserRepository.save({
      participants: faker.number.int(),
      });

      const newUser : UserEntity = await userRepository.save({
        username: faker.person.firstName(),
        password: faker.internet.password(),
      });

      const result : UserEntity = await service.addTournamentToUser(newUser.id, newTournament.id);
      expect(result.tournaments.length).toBe(1);
      expect(result.tournaments[0]).not.toBeNull();
      expect(result.tournaments[0].id).toBe(newTournament.id);
    });

    it('addTurnamentToUser should throw an exception for an invalid tournament', async () => {

      const newUser : UserEntity = await userRepository.save({
        username: faker.person.firstName(),
        password: faker.internet.password(),
      });
      await expect(service.addTournamentToUser(newUser.id, "0")).rejects.toHaveProperty("message", "The tournament with the given id was not found");
    });

    it('addTurnamentToUser should throw an exception for an invalid user', async () => {

      const newTournament : TournamentUserEntity = await tournamentUserRepository.save({
        participants: faker.number.int(),
      });
      await expect(service.addTournamentToUser("0", newTournament.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('findTournamentFromUser find tournament from user', async() => {
      const tournament : TournamentUserEntity = tournamentList[0];

      const storedTournament : TournamentUserEntity = await service.findTournamentFromUser(user.id, tournament.id);

      expect(storedTournament).not.toBeNull();
      expect(storedTournament.id).toBe(tournament.id)
      expect(storedTournament.participants).toBe(tournament.participants)
    });

    it('findTournamentsFromUser should throw an exception for an invalid user', async() => {
      await expect(service.findAllTournamentsFromUser("0")).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('associateTournamentToUser should update a tournament list from a user' , async () => {
      const newTournament : TournamentUserEntity = await tournamentUserRepository.save({
        participants: faker.number.int(),
      });

      const storedUser : UserEntity = await service.associateTournamentsToUser(user.id, [newTournament]);

      expect(storedUser.tournaments.length).toBe(1);
      expect(storedUser.tournaments[0].id).toBe(newTournament.id);
    });

    it('associateTournamentToUser should throw an exception for an invalid user', async () => {
      const newTournament : TournamentUserEntity = await tournamentUserRepository.save({
        participants: faker.number.int(),
      });

      await expect(() => service.associateTournamentsToUser("0", [newTournament])).rejects.toHaveProperty("message", "The user with the given id was not found");
    });

    it('associateTournamentToUser should throw an exception for an invalid tournament', async () => {
      const newTournament : TournamentUserEntity = tournamentList[0];

      newTournament.id = "0"; 

      expect(() => service.associateTournamentsToUser(user.id, [newTournament])).rejects.toHaveProperty("message", "A tournament from the list of arrays does not exist");
    });

    it('deleteTournamentFromUser should delete a tournament from a user', async () => {
      const tournament : TournamentUserEntity = tournamentList[0];

      await service.deleteTournamentFromUser(user.id, tournament.id);

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
      const newTournament : TournamentUserEntity = await tournamentUserRepository.save({
        participants: faker.number.int(),
      });      
      await expect(() => service.deleteTournamentFromUser(user.id, newTournament.id)).rejects.toHaveProperty("message", "The tournament does not exist for the given user");
    });

  }
);