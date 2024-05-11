import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrganizerModule } from './organizer/organizer.module';
import { RolesModule } from './roles/roles.module';
import { TournamentUserModule } from './user-tournament/user-tournament.module';
import { TournamentModule } from './tournament/tournament.module';
import { OrganizerTournamentModule } from './organizer-tournament/organizer-tournament.module';
import { OrganizerRolesModule } from './organizer-roles/organizer-roles.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'postgres_db', for docker
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
    RolesModule,
    TournamentUserModule,
    TournamentModule,
    OrganizerTournamentModule,
    OrganizerRolesModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
