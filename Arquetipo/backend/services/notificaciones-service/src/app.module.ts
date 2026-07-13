import { Module } from "@nestjs/common";
import { NotificacionesConsumer } from "./notificaciones.consumer";
import { PushSmsProvider } from "./providers/push-sms.provider";
import { EmailProvider } from "./providers/email.provider";

@Module({
  providers: [NotificacionesConsumer, PushSmsProvider, EmailProvider],
})
export class AppModule {}
