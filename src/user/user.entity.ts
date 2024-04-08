import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../shared/security/enums/role.enum';
import { TournamentUserEntity } from 'src/tournament-user/tournament-user.entity';

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  username: string;

  @Column({select: false})
  password: string;

  @Column({type:'enum', default: Role.USER, enum: Role})
  roles: Role[];

  //OneToMany relation between tournament and user (ManyToMany relation) || A tournament has an specific user
  @OneToMany(() => TournamentUserEntity, (tournament) => tournament.user)
  tournaments: TournamentUserEntity[];
}