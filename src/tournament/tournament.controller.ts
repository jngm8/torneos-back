import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { TournamentEntity } from './tournament.entity';
import { TournamentDto } from './tournament.dto/tournament.dto';
import { plainToInstance } from 'class-transformer';

@Controller('tournaments')
@UseInterceptors(BusinessErrorsInterceptor)
export class TournamentController {

    constructor(
        private readonly tournamentService: TournamentService
    ){}

    @Get()
    findAll(): Promise<TournamentEntity[]> {
        return this.tournamentService.findAll();
    }

    @Get(':tournamentId')
    findOne(@Param('tournamentId') tournamentId: string): Promise<TournamentEntity> {
        return this.tournamentService.findOne(tournamentId);
    }

    @Post()
    create(@Body() tournamentDto: TournamentDto) {
        const tournament : TournamentEntity = plainToInstance(TournamentEntity, tournamentDto);
        return this.tournamentService.create(tournament);
    }

    @Put(':tournamentId')
    update(@Param('tournamentId') tournamentId: string, @Body() tournamentDto: TournamentDto ) : Promise<TournamentEntity> {
        const tournament : TournamentEntity = plainToInstance(TournamentEntity, tournamentDto);

        return this.tournamentService.update(tournamentId, tournament);
    }

    @Delete(':tournamentId')
    @HttpCode(204)
    delete(@Param('tournamentId') userId: string){
        return this.tournamentService.delete(userId);
    }






}
