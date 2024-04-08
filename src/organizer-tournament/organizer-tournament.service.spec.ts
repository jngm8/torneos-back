import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerTournamentService } from './organizer-tournament.service';

describe('OrganizerTournamentService', () => {
  let service: OrganizerTournamentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizerTournamentService],
    }).compile();

    service = module.get<OrganizerTournamentService>(OrganizerTournamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
