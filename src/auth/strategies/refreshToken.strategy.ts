/* eslint-disable prettier/prettier */
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ForbiddenException, Injectable } from "@nestjs/common";
import constants from "src/shared/constants";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Request } from "express";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,'jwt-refresh') {

    constructor(){
        super({
            secretOrKey: constants.REFRESH_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: JwtPayload) {

        const refreshToken = req
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        
        return {
            ...payload,
            refreshToken
        }

    }
}