import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../../common/enum/role.enum";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "@nestjs/passport";

export function Auth(roles: Role[]) {
  return applyDecorators(Roles(roles), UseGuards(AuthGuard(), RolesGuard));
}