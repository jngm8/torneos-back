import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrganizerModule } from './organizer/organizer.module';
import { RoleModule } from './role/role.module';
import { TournamentUserModule } from './tournament-user/tournament-user.module';
import { TournamentModule } from './tournament/tournament.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'turbobet',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    OrganizerModule,
    RoleModule,
    TournamentUserModule,
    TournamentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
