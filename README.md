# Código fuente — Scaffold de referencia (BP Banca Digital)

> ⚠️ **Este código es un arquetipo, no un producto ejecutable.**
> Es material adicional fuera del alcance del ejercicio (el enunciado solo pide
> el documento de arquitectura en PDF). Su único propósito es **ilustrar con
> código real** las decisiones, patrones y estructura descritos en
> `BP_Arquitectura_Banca_Digital.pdf`. **No está pensado para instalarse,
> compilarse ni levantarse como un sistema funcional** — no hay base de datos,
> no hay integración real contra AWS ni contra el Core Bancario, y varios
> métodos están marcados explícitamente con `// TODO` en los puntos donde un
> equipo real tendría que conectar la lógica de negocio, la persistencia o las
> credenciales. Trátalo como planos (blueprint), no como una aplicación.

## 1. Qué es y qué no es

**Es:**
- Un esqueleto de carpetas y archivos que refleja 1:1 los contenedores y
  componentes del Diagrama C4 (Nivel 2 y 3) del PDF.
- Una referencia de cómo se verían implementados los patrones arquitectónicos
  clave: BFF (Backend for Frontend), Circuit Breaker, Adapter/Anti-Corruption
  Layer, Transactional Outbox, OAuth 2.0 Authorization Code + PKCE, WebAuthn/FIDO2.
- Código sintácticamente válido (revisado con linters/parsers estructurales),
  con firmas de función, contratos (DTOs) y comentarios que citan la sección
  del PDF que justifica cada decisión.

**No es:**
- Un sistema desplegable ni un MVP.
- Código con pruebas automatizadas, `node_modules`/dependencias descargadas,
  `docker-compose`, pipelines de CI/CD, ni Infraestructura como Código (IaC).
- Una implementación completa: la lógica de negocio real (validaciones contra
  el Core Bancario, persistencia en Aurora, publicación real a EventBridge/MSK,
  llamadas reales al IdP) está marcada con `// TODO` porque depende de sistemas
  externos que no existen en este ejercicio.

## 2. Estructura completa del repositorio

```
codigo-fuente/
├── README.md                         <- este archivo
│
├── backend/
│   ├── README.md                     <- detalle de stack por servicio
│   ├── libs/
│   │   ├── shared-dto/               <- DTOs/tipos compartidos (BFF + SPA + móvil)
│   │   │   └── src/index.ts
│   │   └── integration/              <- capa de integración (mapea a C4 Nivel 3)
│   │       └── src/
│   │           ├── orchestration.service.ts   <- Orchestration Service (patrón Facade)
│   │           ├── circuit-breaker.ts         <- Circuit Breaker + retry/backoff
│   │           ├── cache.client.ts            <- Cache Client (Redis, cache-aside)
│   │           ├── outbox.publisher.ts        <- Event Publisher (Transactional Outbox)
│   │           ├── adapters/
│   │           │   ├── clientes.adapter.ts
│   │           │   ├── movimientos.adapter.ts
│   │           │   └── transferencias.adapter.ts
│   │           └── index.ts
│   │
│   ├── bff-web/                      <- BFF Web (Node.js/NestJS)
│   │   └── src/token-handler.controller.ts   <- Token Handler: cookie httpOnly, nunca expone el JWT
│   │
│   ├── bff-mobile/                   <- BFF Mobile (Node.js/NestJS)
│   │   └── src/auth.middleware.ts    <- valida Access Token emitido tras PKCE nativo
│   │
│   └── services/                     <- 7 microservicios de dominio (uno por responsabilidad)
│       ├── identity-service/         <- Node.js/NestJS — token broker OAuth 2.0 + WebAuthn
│       ├── onboarding-service/       <- Node.js/NestJS — registro + verificación biométrica
│       ├── clientes-service/         <- Java/Spring Boot — agrega Core + Complementario
│       ├── movimientos-service/      <- Node.js/NestJS — histórico y saldos
│       ├── transferencias-service/   <- Java/Spring Boot — propias e interbancarias (Outbox)
│       ├── notificaciones-service/   <- Node.js/NestJS — orquesta push/SMS/email
│       └── auditoria-service/        <- Node.js/NestJS — consume eventos, hash-chaining
│
├── web/                               <- SPA (React + Vite + TypeScript)
│   └── src/
│       ├── api/httpClient.ts         <- credentials:'include' (cookie httpOnly del BFF)
│       ├── auth/AuthContext.tsx
│       └── pages/
│
└── mobile/                            <- App móvil (React Native + Expo + TypeScript)
    └── src/
        ├── api/
        ├── auth/
        │   ├── pkce.ts                <- Authorization Code + PKCE (expo-auth-session)
        │   └── secureStorage.ts       <- Keychain/Keystore (expo-secure-store)
        └── screens/
            └── OnboardingScreen.tsx   <- captura selfie + liveness
```

## 3. Backend polyglota: qué servicio usa qué stack

La mayoría de los microservicios usan **Node.js + NestJS**, adecuado para
servicios que son principalmente orquestadores de llamadas a APIs externas
(cuello de botella de red, no de cómputo). Dos servicios usan
**Java + Spring Boot**, por requerir transformación/orquestación más compleja
antes de comunicarse con el Core Bancario:

| Servicio | Stack | Responsabilidad | Runtime (referencial) |
|---|---|---|---|
| `identity-service` | Node.js + NestJS | Token broker OAuth 2.0 + registro WebAuthn/FIDO2 | `npm run start:dev` |
| `onboarding-service` | Node.js + NestJS | Registro + verificación biométrica (liveness/match) | `npm run start:dev` |
| `clientes-service` | **Java + Spring Boot** | Agrega Core Bancario + Sistema Complementario | `mvn spring-boot:run` |
| `movimientos-service` | Node.js + NestJS | Histórico de movimientos y saldos (cacheable) | `npm run start:dev` |
| `transferencias-service` | **Java + Spring Boot** | Transferencias propias e interbancarias, Outbox | `mvn spring-boot:run` |
| `notificaciones-service` | Node.js + NestJS | Orquesta canales push/SMS/email | `npm run start:dev` |
| `auditoria-service` | Node.js + NestJS | Consume eventos, persiste log append-only (hash chain) | `npm run start:dev` |

Todos exponen el mismo tipo de contrato REST/HTTPS hacia el BFF correspondiente
— el lenguaje de implementación es un detalle interno del contenedor y no
afecta al Diagrama de Contenedores/Componentes (C4) ni a los adapters del lado
del BFF (`backend/libs/integration/src/adapters/*`).

## 4. Patrones arquitectónicos y dónde encontrarlos

| Patrón | Archivo(s) | Sección del PDF |
|---|---|---|
| Backend for Frontend (BFF) | `backend/bff-web/`, `backend/bff-mobile/` | §5, §7 |
| Token Handler (tokens fuera del navegador) | `bff-web/src/token-handler.controller.ts` | §7 |
| Circuit Breaker + Retry + Timeout | `libs/integration/src/circuit-breaker.ts` | §6.3 |
| Adapter / Anti-Corruption Layer | `libs/integration/src/adapters/*`, `clientes-service/.../adapter/*` | §10 |
| Transactional Outbox | `libs/integration/src/outbox.publisher.ts`, `transferencias-service/.../outbox/*` | §9 |
| Cache-aside | `libs/integration/src/cache.client.ts` | §10 |
| OAuth 2.0 Authorization Code + PKCE | `mobile/src/auth/pkce.ts`, `bff-web/src/token-handler.controller.ts` | §7 |
| WebAuthn/FIDO2 (segundo factor local) | `identity-service` | §8 |
| Almacenamiento seguro nativo (Keychain/Keystore) | `mobile/src/auth/secureStorage.ts` | §7 |
| Orchestration Service (Facade) | `libs/integration/src/orchestration.service.ts` | Diagrama de Componentes |

## 5. Cómo leer este código (orden sugerido)

No se recomienda tratar de "correrlo" de punta a punta. Para entenderlo, el
orden más útil suele ser:

1. `README.md` (este archivo) y `backend/README.md` — mapa general.
2. `backend/libs/integration/src/` — los componentes que aparecen en el
   Diagrama de Componentes (C4 Nivel 3): Orchestration Service, Circuit
   Breaker, Adapters, Outbox.
3. `backend/bff-web/src/token-handler.controller.ts` — cómo el BFF absorbe el
   manejo de tokens para que la SPA nunca los toque.
4. Un servicio Node.js (`onboarding-service`) y un servicio Java
   (`transferencias-service`) — para comparar el mismo tipo de responsabilidad
   (controller → service → adapter) en ambos stacks.
5. `mobile/src/auth/pkce.ts` y `web/src/api/httpClient.ts` — el flujo de
   autenticación visto desde cada canal cliente.

## 6. Requisitos si alguien decide intentar levantarlo de todos modos

Esto **no está probado ni soportado**, pero si se quisiera experimentar con un
servicio de forma aislada (sin sus dependencias externas reales):

- **Servicios Node.js/NestJS:** Node.js 20+, `npm install && npm run start:dev`
  dentro de la carpeta del servicio. Las URLs de sistemas externos
  (`CORE_BANCARIO_URL`, etc.) se leen de variables de entorno y no apuntan a
  nada real.
- **Servicios Java/Spring Boot:** JDK 17+ y Maven, `mvn spring-boot:run` dentro
  de la carpeta del servicio. Igual que arriba, las URLs externas son
  placeholders (`application.yml`).
- **Web (SPA):** Node.js 20+, `npm install && npm run dev` (Vite).
- **Mobile:** Node.js 20+, Expo CLI, `npm install && npm run start`.

Ningún servicio tiene una base de datos real configurada, ni hay
`docker-compose` para levantar Aurora/Redis/EventBridge localmente — eso está
descrito conceptualmente en el PDF, sección 11 (Infraestructura cloud AWS).

## 7. Relación con el documento de arquitectura

| Carpeta | Diagrama C4 | Sección del PDF |
|---|---|---|
| `backend/libs/integration` | Componentes (Nivel 3) | §6.3 — Capa de integración |
| `backend/bff-web`, `backend/bff-mobile` | Contenedores (Nivel 2) | §5, §7 — BFF y autenticación |
| `backend/services/*` | Contenedores (Nivel 2) | §6.2, §8, §9 |
| `web/` | Contenedores (Nivel 2) | §5 — SPA con Token Handler |
| `mobile/` | Contenedores (Nivel 2) | §7, §8 — PKCE + biometría |

## 8. Autoría

Andrés Eduardo Cárdenas Jaramillo — Arquitecto de Soluciones.
Scaffold generado como material adicional al ejercicio de arquitectura
"Diseño de Arquitectura de Solución — Sistema de Banca por Internet BP".
