import { Column, PrimaryGeneratedColumn } from "typeorm";

export class TournamentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    date: string

    @Column()
    address: string

    @Column()
    image: string

    
}
