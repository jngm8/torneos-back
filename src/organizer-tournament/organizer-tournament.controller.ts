import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { OrganizerTournamentService } from './organizer-tournament.service';
import { TournamentEntity } from 'src/tournament/tournament.entity';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { TournamentDto } from 'src/tournament/tournament.dto/tournament.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('organizers')
@UseInterceptors(BusinessErrorsInterceptor)
export class OrganizerTournamentController {
    constructor(
        private readonly organizerTournamentService: OrganizerTournamentService
    ){}

    @Post(':organizerId/tournaments/:tournamentId')
    addTournamentToOrganizer(@Param('organizerId') organizerId: string, @Param('tournamentId') tournamentId: string) {
        return this.organizerTournamentService.addTournamentToOrganizer(organizerId,tournamentId);
    }

    @Get(':organizerId/tournaments/:tournamentId')
    findTournamentFromOrganizer(@Param('organizerId') organizerId: string, @Param('tournamentId') tournamentId: string): Promise<TournamentEntity> {
        return this.organizerTournamentService.findTournamentFromOrganizer(organizerId, tournamentId);
    }

    @Get(':organizerId/tournaments')
    findAllTournamentsFromOrganizer(@Param('organizerId') organizerId: string) : Promise<TournamentEntity[]> {
        return this.organizerTournamentService.findAllTournamentsFromOrganizer(organizerId);
    }

    @Put(':organizerId/tournaments')
    associateTournamentsToOrganizer(@Param('organizerId') organizerId: string, @Body() tournamentDto: TournamentDto[]) : Promise<OrganizerEntity> {
        const tournaments = plainToInstance(TournamentEntity, tournamentDto);
        return this.organizerTournamentService.associateTournamentToOrganizer(organizerId,tournaments);
    }

    @Delete(':organizerId/tournaments/:tournamentId')
    @HttpCode(204)
    deleteTournamentFromOrganizer(@Param('organizerId') organizerId: string, @Param('tournamentId') tournamentId: string) {
        return this.organizerTournamentService.deleteTournamentFromOrganizer(organizerId,tournamentId);
    }
}
