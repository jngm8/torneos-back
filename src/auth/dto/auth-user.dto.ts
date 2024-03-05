/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString  } from 'class-validator';

export class AuthUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}