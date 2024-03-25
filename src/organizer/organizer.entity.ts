import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
