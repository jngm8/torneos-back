import { IsNotEmpty, IsString, IsUrl } from "class-validator";

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
    @IsUrl()
    readonly image: string;
}
