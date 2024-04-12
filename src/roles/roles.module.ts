import { Module } from '@nestjs/common';
import { RolesEntity } from './roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RolesEntity])],
    providers: [RoleService],
    controllers: [RolesController],
})
export class RolesModule {}
