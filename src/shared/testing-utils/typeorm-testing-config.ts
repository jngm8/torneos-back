import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from '../../organizer/organizer.entity';
import { RolesEntity } from '../../roles/roles.entity';
import { UserEntity } from '../../user/user.entity';
import { TournamentUserEntity } from '../../tournament-user/tournament-user.entity';
import { TournamentEntity } from '../../tournament/tournament.entity';


export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [OrganizerEntity, RolesEntity, UserEntity, TournamentUserEntity, TournamentEntity],
    synchronize: true,
    keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([OrganizerEntity, RolesEntity, UserEntity, TournamentUserEntity, TournamentEntity])
]