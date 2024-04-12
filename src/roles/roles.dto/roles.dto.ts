import { IsNotEmpty, IsString } from "class-validator";

export class RolesDto {
    @IsString()
    @IsNotEmpty()
    role: string
}
