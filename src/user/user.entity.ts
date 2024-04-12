import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../shared/enums/role.enum';
import { TournamentUserEntity } from '../tournament-user/tournament-user.entity';

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  username: string;

  @Column()
  password: string;

  @Column({default: Role.USER})
  role: Role;

  //OneToMany relation between tournament and user (ManyToMany relation) || A tournament has an specific user
  @OneToMany(() => TournamentUserEntity, (tournament) => tournament.user)
  tournaments: TournamentUserEntity[];
}