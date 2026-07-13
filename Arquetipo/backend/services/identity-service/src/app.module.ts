import { Module } from "@nestjs/common";
import { IdentityController } from "./identity/identity.controller";
import { WebauthnService } from "./identity/webauthn.service";

@Module({
  controllers: [IdentityController],
  providers: [WebauthnService],
})
export class AppModule {}
