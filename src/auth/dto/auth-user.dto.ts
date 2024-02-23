/* eslint-disable prettier/prettier */

import { IsString, MaxLength, MinLength, IsEmail, Matches } from 'class-validator';

export class AuthUserDto {

    @IsString()
    @MinLength(4)
    @MaxLength(8)
    username: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(25)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message: 'password is weak'})
    password: string;
}