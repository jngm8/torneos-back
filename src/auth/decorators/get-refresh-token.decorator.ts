import { createParamDecorator } from "@nestjs/common";

export const GetRefreshToken = createParamDecorator((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    
    const refreshToken = req.cookies['refreshToken'];
    
    return refreshToken;
})