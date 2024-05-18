import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../../shared/enums/role.enum";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

export function Auth(roles: Role[]) {
  return applyDecorators(Roles(roles), UseGuards(JwtAuthGuard, RolesGuard));
}