import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TournamentUserService } from './tournament-user.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { TournamentUserEntity } from './tournament-user.entity';
import { TournamentDto } from 'src/tournament/tournament.dto/tournament.dto';
import { plainToInstance } from 'class-transformer';
import { TournamentEntity } from 'src/tournament/tournament.entity';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class TournamentUserController {

    constructor(
        private readonly tournamentUserService: TournamentUserService
    ){}

    @Post(':userId/tournaments/:tournamentId')
    addTournamentToUser(@Param('userId') idUser: string, @Param('tournamentId') idTournament: string, @Body('category') category: string) {
        return this.tournamentUserService.addTournamentToUser(idUser,idTournament,category);
    }

    @Get(':userId/tournaments/:tournamentId')
    findTournamentFromUser(@Param('userId') userId: string, @Param('tournamentId') tournamentId: string) : Promise<TournamentEntity> {
        return this.tournamentUserService.findTournamentFromUser(userId,tournamentId);
    }

    @Get(':userId/tournaments')
    findAllTOurnamentsFromUser(@Param('userId') userId: string) : Promise<TournamentUserEntity[]> {
        return this.tournamentUserService.findAllTournamentsFromUser(userId);
    }

    @Put(':userId/tournaments')
    associateTournamentsToUser(@Param('userId') userId: string, @Body() tournamentsDto: TournamentDto[]) : Promise<{id: string, username: string, role: string, tournaments: TournamentUserEntity[]}> {
        const tournaments = plainToInstance(TournamentEntity, tournamentsDto)
        return this.tournamentUserService.associateTournamentsToUser(userId, tournaments);
    }

    @Delete(':userId/tournaments/:tournamentId')
    @HttpCode(204)
    deleteTournamentFromUser(@Param('userId') userId: string, @Param('tournamentId') tournamentId: string) {
        return this.tournamentUserService.deleteTournamentFromUser(userId, tournamentId);
    }


}
