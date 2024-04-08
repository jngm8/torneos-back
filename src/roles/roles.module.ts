import { Module } from '@nestjs/common';
import { RolesEntity } from './roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './roles.service';

@Module({
    imports: [TypeOrmModule.forFeature([RolesEntity])],
    providers: [RoleService],
})
export class RolesModule {}
