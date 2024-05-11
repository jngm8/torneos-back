import { Module } from '@nestjs/common';
import { RolesEntity } from './roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './roles.service';
import { RolesController } from './roles.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([RolesEntity]), AuthModule],
    providers: [RoleService],
    controllers: [RolesController],
})
export class RolesModule {}
