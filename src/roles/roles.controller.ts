import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesEntity } from './roles.entity';
import { RolesDto } from './roles.dto/roles.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
@UseInterceptors(BusinessErrorsInterceptor)
export class RolesController {

    constructor(
        private readonly rolesService: RoleService
    ){}

    @Get()
    @ApiOperation({ summary: 'Retrieve all roles'})
    findAll(): Promise<RolesEntity[]> {
        return this.rolesService.findAll();
    }

    @Get(':roleId')
    @ApiOperation({ summary: 'Retrieve one role'})
    findOne(@Param('roleId') roleId: string): Promise<RolesEntity> {
        return this.rolesService.findOne(roleId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a role'})
    create(@Body() roleDto: RolesDto) {
        const role: RolesEntity = plainToInstance(RolesEntity, roleDto);
        return this.rolesService.create(role);
    }

    @Put(':roleId')
    @ApiOperation({ summary: 'Update a role'})
    update(@Param('roleId') roleId: string, @Body() roleDto: RolesDto): Promise<RolesEntity> {
        const role : RolesEntity = plainToInstance(RolesEntity, roleDto);
        return this.rolesService.update(roleId,role);
    }

    @Delete(':roleId')
    @ApiOperation({ summary: 'Delete a role'})
    @HttpCode(204)
    delete(@Param('roleId') roleId: string) {
        return this.rolesService.delete(roleId);
    }
}
