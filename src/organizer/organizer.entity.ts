import { RolesEntity } from "../roles/roles.entity";
import { TournamentEntity } from "../tournament/tournament.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrganizerEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    company: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    location: string;

    @Column()
    webpage: string

    // OneToMany relation between organizer and tournaments || A tournament has a unique organizer
    @OneToMany(() => TournamentEntity, tournament => tournament.organizer)
    tournaments: TournamentEntity[]

    // ManyToMany relation between organizer and roles || A role can be used by many organizers
    @ManyToMany(() => RolesEntity, (role) => role.organizers)
    @JoinTable()
    roles: RolesEntity[]
}
