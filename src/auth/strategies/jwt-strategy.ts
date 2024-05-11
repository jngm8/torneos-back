/* eslint-disable prettier/prettier */
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
// import { Repository } from "typeorm";
// import { UserEntity } from "../../user/user.entity";
// import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import constants from "../../shared/constants";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {

    constructor(
        // @InjectRepository(UserEntity)
        // private userRepository: Repository<UserEntity>
    ){
        super({
            secretOrKey: constants.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload) : Promise<JwtPayload> {

        return payload;
    }
}