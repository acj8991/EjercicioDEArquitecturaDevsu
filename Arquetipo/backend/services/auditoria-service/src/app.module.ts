import { Module } from "@nestjs/common";
import { AuditoriaConsumer } from "./auditoria.consumer";
import { HashChainRepository } from "./hash-chain.repository";

@Module({
  providers: [AuditoriaConsumer, HashChainRepository],
})
export class AppModule {}
