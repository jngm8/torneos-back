import { Module } from '@nestjs/common';
import { RolesEntity } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RolesEntity])],
})
export class RolesModule {}
