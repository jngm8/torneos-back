import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerRolesService } from './organizer-roles.service';

describe('OrganizerRolesService', () => {
  let service: OrganizerRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizerRolesService],
    }).compile();

    service = module.get<OrganizerRolesService>(OrganizerRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
