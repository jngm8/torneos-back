import { OrganizerEntity } from "../organizer/organizer.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RolesEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    role: string;

    // ManyToMany relation between organizer and roles || An organizer has many roles
    @ManyToMany(() => OrganizerEntity, (organizer) => organizer.roles)
    organizers: OrganizerEntity[]
}
