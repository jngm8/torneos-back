/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { Role } from "../../shared/enums/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (role: Role[]) => SetMetadata(ROLES_KEY, role)