import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

/**
 * BFF Web -- Contenedor dedicado al canal SPA (Diagrama de Contenedores).
 * Actúa como cliente OAuth 2.0 confidencial: ejecuta el intercambio
 * Authorization Code + PKCE con el IdP y expone al navegador solo una
 * cookie de sesión httpOnly/Secure (patrón "Token Handler"). Ver PDF §7.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: process.env.SPA_ORIGIN, credentials: true });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
