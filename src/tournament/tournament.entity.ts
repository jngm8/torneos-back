import { OrganizerEntity } from "../organizer/organizer.entity";
import { TournamentUserEntity } from "../user-tournament/user-tournament.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TournamentEntity {

    // @CreateDateColumn({
    //     type: 'timestamptz',
    //     default: () => 'CURRENT_TIMESTAMP',
    // })
    // createdAt: Date;

    // @UpdateDateColumn({
    //     type: 'timestamptz',
    //     default: 'CURRENT_TIMESTAMP',
    // })
    // updatedAt: Date;

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    date: string

    @Column()
    dateEnd: string

    @Column()
    address: string

    @Column()
    image: string

    @Column()
    description: string

    // ManyToOne relation between organizer and tournaments || An organizer has many tournaments
    @ManyToOne(() => OrganizerEntity, (organizer) => organizer.tournaments)
    organizer: OrganizerEntity
    
    // OneToMany relation between user and tournament (ManyToMany relation) || A user participates in a specific tournament
    @OneToMany(() => TournamentUserEntity, (user) => user.tournament)
    users: TournamentUserEntity[]
}
