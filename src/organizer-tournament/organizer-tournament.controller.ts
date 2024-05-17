import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { OrganizerTournamentService } from './organizer-tournament.service';
import { TournamentEntity } from 'src/tournament/tournament.entity';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { TournamentDto } from 'src/tournament/tournament.dto/tournament.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('organizer-tournaments')
@Controller('organizers')
@UseInterceptors(BusinessErrorsInterceptor)
export class OrganizerTournamentController {
    constructor(
        private readonly organizerTournamentService: OrganizerTournamentService
    ){}

    @Post(':organizerId/tournaments/:tournamentId')
    @ApiOperation({ summary: 'Add a tournament to an organizer'})
    @ApiBearerAuth()
    @Auth([Role.ADMIN])
    addTournamentToOrganizer(@Param('organizerId') organizerId: string, @Param('tournamentId') tournamentId: string) {
        return this.organizerTournamentService.addTournamentToOrganizer(organizerId,tournamentId);
    }

    @Get(':organizerId/tournaments/:tournamentId')
    @ApiOperation({ summary: 'Retrieve a tournament from an organizer'})
    findTournamentFromOrganizer(@Param('organizerId') organizerId: string, @Param('tournamentId') tournamentId: string): Promise<TournamentEntity> {
        return this.organizerTournamentService.findTournamentFromOrganizer(organizerId, tournamentId);
    }

    @Get(':organizerId/tournaments')
    @ApiOperation({ summary: 'Retrieve all tournaments from an organizer'})
    findAllTournamentsFromOrganizer(@Param('organizerId') organizerId: string) : Promise<TournamentEntity[]> {
        return this.organizerTournamentService.findAllTournamentsFromOrganizer(organizerId);
    }

    @Put(':organizerId/tournaments')
    @ApiOperation({ summary: 'Associate tournaments to an organizer'})
    @ApiBearerAuth()
    @Auth([Role.ADMIN])
    associateTournamentsToOrganizer(@Param('organizerId') organizerId: string, @Body() tournamentDto: TournamentDto[]) : Promise<OrganizerEntity> {
        const tournaments = plainToInstance(TournamentEntity, tournamentDto);
        return this.organizerTournamentService.associateTournamentToOrganizer(organizerId,tournaments);
    }

    @Delete(':organizerId/tournaments/:tournamentId')
    @ApiOperation({ summary: 'Delete a tournament from an organizer'})
    @ApiBearerAuth()
    @Auth([Role.ADMIN])
    @HttpCode(204)
    deleteTournamentFromOrganizer(@Param('organizerId') organizerId: string, @Param('tournamentId') tournamentId: string) {
        return this.organizerTournamentService.deleteTournamentFromOrganizer(organizerId,tournamentId);
    }
}
