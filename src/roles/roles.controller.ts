import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesEntity } from './roles.entity';
import { RolesDto } from './roles.dto/roles.dto';
import { plainToInstance } from 'class-transformer';

@Controller('roles')
export class RolesController {

    constructor(
        private readonly rolesService: RoleService
    ){}

    @Get()
    findAll(): Promise<RolesEntity[]> {
        return this.rolesService.findAll();
    }

    @Get('roleId')
    findOne(@Param('roleId') roleId: string): Promise<RolesEntity> {
        return this.rolesService.findOne(roleId);
    }

    @Post()
    create(@Body() roleDto: RolesDto) {
        const role: RolesEntity = plainToInstance(RolesEntity, roleDto);
        return this.rolesService.create(role);
    }
}
