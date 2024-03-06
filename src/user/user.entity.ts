import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../common/enum/role.enum';

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
}