import { Test, TestingModule } from '@nestjs/testing';
import { TournamentUserService } from './tournament-user.service';

describe('TournamentUserService', () => {
  let service: TournamentUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentUserService],
    }).compile();

    service = module.get<TournamentUserService>(TournamentUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
