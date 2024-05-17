import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { OrganizerRolesService } from './organizer-roles.service';
import { RolesEntity } from 'src/roles/roles.entity';
import { RolesDto } from 'src/roles/roles.dto/roles.dto';
import { OrganizerEntity } from 'src/organizer/organizer.entity';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('organizer-roles')
@Controller('organizers')
export class OrganizerRolesController {
    constructor(
        private readonly organizerRolesService: OrganizerRolesService
    ){}

    @Post(':organizerId/roles/:roleId')
    @ApiOperation({ summary: 'Add a role to an organizer'})
    addRoleToOrganizer(@Param('organizerId') organizerId: string, @Param('roleId') roleId: string) {
        return this.organizerRolesService.addRolesToOrganizer(organizerId,roleId);
    }

    @Get(':organizerId/roles/:roleId')
    @ApiOperation({ summary: 'Retrieve a role from an organizer'})
    findRoleFromOrganizer(@Param('organizerId') organizerId: string, @Param('roleId') roleId: string) : Promise<RolesEntity> {
        return this.organizerRolesService.findRoleFromOrganizer(organizerId,roleId);
    }

    @Get(':organizerId/roles')
    @ApiOperation({ summary: 'Retrieve all roles from an organizer'})
    findAllRolesFromOrganizer(@Param('organizerId') organizerId: string) : Promise<RolesEntity[]> {
        return this.organizerRolesService.findAllRolesFromOrganizer(organizerId);
    }

    @Put(':organizerId/roles')
    @ApiOperation({ summary: 'Associate roles to an organizer'})
    associateRolesToOrganizer(@Param('organizerId') organizerId: string, @Body() rolesDto: RolesDto[]) : Promise<OrganizerEntity> {
        const roles = plainToInstance(RolesEntity, rolesDto);
        return this.organizerRolesService.associateRolesToOrganizer(organizerId, roles);
    }

    @Delete(':organizerId/roles/:roleId')
    @ApiOperation({ summary: 'Delete a role from an organizer'})
    @HttpCode(204)
    deleteRoleFromOrganizer(@Param('organizerId') organizerId: string, @Param('roleId') roleId: string) {
        return this.organizerRolesService.deleteRoleFromOrganizer(organizerId,roleId);
    }
}
