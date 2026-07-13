import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/** Servicio de Identidad -- token broker OAuth 2.0 + registro WebAuthn/FIDO2. */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
