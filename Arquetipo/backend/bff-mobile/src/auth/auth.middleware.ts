import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

/**
 * Auth Middleware (Diagrama de Componentes) -- valida la firma y expiración
 * del Bearer Access Token contra el JWKS publicado por el IdP (OAuth 2.0 /
 * OIDC), sin llamar al IdP en cada request. Ver PDF §7 y §6.3.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Falta Access Token");
    }
    // TODO: verificar firma JWT contra JWKS (cacheado) y expiración.
    next();
  }
}
