import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Consumidor asíncrono del bus de eventos (EventBridge/MSK). No expone
 * endpoints REST de negocio; en un despliegue real correría como un
 * worker (sin listener HTTP).
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3023);
}
bootstrap();
