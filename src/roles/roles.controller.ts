import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesEntity } from './roles.entity';
import { RolesDto } from './roles.dto/roles.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
@UseInterceptors(BusinessErrorsInterceptor)
export class RolesController {

    constructor(
        private readonly rolesService: RoleService
    ){}

    @Get()
    findAll(): Promise<RolesEntity[]> {
        return this.rolesService.findAll();
    }

    @Get(':roleId')
    findOne(@Param('roleId') roleId: string): Promise<RolesEntity> {
        return this.rolesService.findOne(roleId);
    }

    @Post()
    create(@Body() roleDto: RolesDto) {
        const role: RolesEntity = plainToInstance(RolesEntity, roleDto);
        return this.rolesService.create(role);
    }

    @Put(':roleId')
    update(@Param('roleId') roleId: string, @Body() roleDto: RolesDto): Promise<RolesEntity> {
        const role : RolesEntity = plainToInstance(RolesEntity, roleDto);
        return this.rolesService.update(roleId,role);
    }

    @Delete(':roleId')
    @HttpCode(204)
    delete(@Param('roleId') roleId: string) {
        return this.rolesService.delete(roleId);
    }
}
