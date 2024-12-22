import { RoleEnum } from "./constants";

export function isUserAdmin(memberships, user) {
    return memberships.some((m) => m.user === user.username && m.role === RoleEnum.ADMIN);
}