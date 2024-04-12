import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class OrganizerDto {

    @IsNotEmpty()
    @IsString()
    company: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsUrl()
    @IsNotEmpty()
    webpage: string;
}
