import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerEntity } from './organizer.entity';
import { OrganizerDto } from './organizer.dto/organizer.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('organizers')
@Controller('organizers')
@UseInterceptors(BusinessErrorsInterceptor)
export class OrganizerController {

    constructor(
        private readonly organizerService: OrganizerService
    ){}

    @Get()
    findAll(): Promise<OrganizerEntity[]> {
        return this.organizerService.findAll();
    }

    @Get(':organizerId')
    findOne(@Param('organizerId') organizerId: string): Promise<OrganizerEntity> {
        return this.organizerService.findOne(organizerId);
    }

    @Post()
    create(@Body() organizerDto: OrganizerDto) {
        const organizer : OrganizerEntity = plainToInstance(OrganizerEntity, organizerDto);
        return this.organizerService.create(organizer);
    }

    @Put(':organizerId')
    update(@Param('organizerId') organizerId: string, @Body() organizerDto: OrganizerDto): Promise<OrganizerEntity> {
        const organizer : OrganizerEntity = plainToInstance(OrganizerEntity, organizerDto)
        return this.organizerService.update(organizerId,organizer)
    }

    @Delete(':organizerId')
    @HttpCode(204)
    delete(@Param('organizerId') organizerId: string) {
        return this.organizerService.delete(organizerId);
    }
}
