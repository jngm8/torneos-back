import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoleEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    role: string;
}
