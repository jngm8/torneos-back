import { IsNotEmpty, IsString } from "class-validator";

export class TournamentDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsString()
    readonly date: string;

    @IsNotEmpty()
    @IsString()
    readonly image: string;
}
