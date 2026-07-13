import { Controller, Get, Post, Req, Res, Query } from "@nestjs/common";
import type { Request, Response } from "express";

/**
 * Patrón "Token Handler" (BFF de seguridad para SPA) -- ver PDF §7.
 *
 * - GET  /auth/login     -> redirige al IdP con Authorization Code + PKCE.
 * - GET  /auth/callback  -> intercambia el code por tokens; guarda el
 *                           Access/Refresh Token en cookie httpOnly, nunca
 *                           expuestos a JavaScript en el navegador.
 * - GET  /auth/me        -> informa a la SPA si hay sesión activa.
 * - POST /auth/logout    -> revoca sesión.
 */
@Controller("auth")
export class TokenHandlerController {
  @Get("login")
  login(@Res() res: Response) {
    // TODO: generar code_verifier/code_challenge (PKCE) y redirigir al IdP.
    const idpAuthorizeUrl = process.env.IDP_AUTHORIZE_URL ?? "";
    res.redirect(idpAuthorizeUrl);
  }

  @Get("callback")
  async callback(@Query("code") code: string, @Res() res: Response) {
    // TODO: intercambiar `code` + code_verifier por tokens contra el IdP.
    // Guardar el Access Token en cookie httpOnly/Secure/SameSite=Strict.
    res.cookie("bp_session", "TODO-token-real", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.redirect(process.env.SPA_ORIGIN ?? "/");
  }

  @Get("me")
  me(@Req() req: Request) {
    const hasSession = Boolean(req.cookies?.["bp_session"]);
    return { authenticated: hasSession };
  }

  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie("bp_session");
    res.status(204).send();
  }
}
