import { createParamDecorator } from "@nestjs/common";

export const GetRefreshToken = createParamDecorator((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.refreshToken;
})