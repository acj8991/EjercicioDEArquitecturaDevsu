# Backend -- BP Banca Digital

> Arquetipo de referencia -- no pensado para ejecutarse como sistema real. Ver disclaimer completo en `../README.md`.

Monorepo con los contenedores de backend descritos en el Diagrama de
Contenedores (C4 Nivel 2):

- `libs/integration`: componentes reusables de la capa de integración (Orchestration
  Service, Circuit Breaker, Cache Client, Adapters, Event Publisher/Outbox) -- mapea
  1:1 al Diagrama de Componentes (C4 Nivel 3).
- `libs/shared-dto`: contratos (DTOs/tipos) compartidos entre BFF, SPA y app móvil.
- `bff-web`, `bff-mobile`: un contenedor por canal (patrón BFF).
- `services/*`: microservicios de dominio, cada uno con responsabilidad única.

## Stack por servicio (backend polyglota)

La mayoría de los microservicios usan **Node.js + NestJS** (I/O no bloqueante,
adecuado para orquestadores de llamadas a APIs externas). Dos servicios usan
**Java + Spring Boot**, por requerir transformación/orquestación más compleja
antes de comunicarse con el Core Bancario:

| Servicio | Stack | Cómo correrlo |
|---|---|---|
| `services/identity-service` | Node.js + NestJS | `npm run start:dev` |
| `services/onboarding-service` | Node.js + NestJS | `npm run start:dev` |
| `services/clientes-service` | **Java + Spring Boot** | `mvn spring-boot:run` |
| `services/movimientos-service` | Node.js + NestJS | `npm run start:dev` |
| `services/transferencias-service` | **Java + Spring Boot** | `mvn spring-boot:run` |
| `services/notificaciones-service` | Node.js + NestJS | `npm run start:dev` |
| `services/auditoria-service` | Node.js + NestJS | `npm run start:dev` |

Todos exponen el mismo tipo de contrato REST/HTTPS hacia el BFF, por lo que el
lenguaje de implementación es un detalle interno del contenedor y no afecta al
Diagrama de Contenedores/Componentes (C4) ni a los adapters del lado del BFF
(`libs/integration/src/adapters/*`).
