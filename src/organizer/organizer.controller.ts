import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerEntity } from './organizer.entity';
import { OrganizerDto } from './organizer.dto/organizer.dto';
import { plainToInstance } from 'class-transformer';

@Controller('organizer')
export class OrganizerController {

    constructor(
        private readonly organizerService: OrganizerService
    ){}

    @Get()
    findAll(): Promise<OrganizerEntity[]> {
        return this.organizerService.findAll();
    }

    @Get('organizerId')
    findOne(@Param('organizerId') organizerId: string): Promise<OrganizerEntity> {
        return this.organizerService.findOne(organizerId);
    }

    @Post()
    create(@Body() organizerDto: OrganizerDto) {
        const organizer : OrganizerEntity = plainToInstance(OrganizerEntity, organizerDto);
        return this.organizerService.create(organizer);
    }
}
