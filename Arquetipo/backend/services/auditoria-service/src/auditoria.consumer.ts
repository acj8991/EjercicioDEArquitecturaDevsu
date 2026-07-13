import { Injectable } from "@nestjs/common";
import { HashChainRepository } from "./hash-chain.repository";
import type { DomainEvent } from "@bp/integration";

/** Consumidor asíncrono del bus de eventos -- nunca bloquea una transferencia. */
@Injectable()
export class AuditoriaConsumer {
  constructor(private readonly repo: HashChainRepository) {}

  async onEvent(evento: DomainEvent) {
    await this.repo.agregar(evento);
  }
}
