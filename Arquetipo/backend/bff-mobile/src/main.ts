import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * BFF Mobile -- Contenedor dedicado al canal app móvil. A diferencia del
 * BFF Web, aquí el cliente (app nativa) SÍ es el que ejecuta PKCE
 * directamente contra el IdP (RFC 8252); este BFF solo valida el Bearer
 * Access Token recibido (ver AuthMiddleware) y orquesta los 3 servicios.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
