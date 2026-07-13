# Diseño de Arquitectura de Solución — Sistema de Banca por Internet BP

**Autor:** Andrés Eduardo Cárdenas Jaramillo — Arquitecto de Soluciones

> ⚠️ **El código en `arquetipo/` es un arquetipo, no un producto ejecutable.**
> Es material adicional fuera del alcance del ejercicio (el enunciado solo pide
> el documento de arquitectura en PDF). Su único propósito es **ilustrar con
> código real** las decisiones, patrones y estructura descritos en el
> documento de arquitectura. No está pensado para instalarse, compilarse ni
> levantarse como un sistema funcional.

## 1. Contenido de este repositorio

```
.
├── README.md                              <- este archivo
├── BP_Arquitectura_Banca_Digital.pdf      <- documento de arquitectura completo
├── documentos/                            <- diagramas editables (.drawio / draw.io)
│   ├── 01_contexto.drawio
│   ├── 02_contenedores.drawio
│   ├── 03_componentes.drawio
│   ├── 04_secuencia_onboarding_auth.drawio
│   └── 05_infraestructura_ha_dr.drawio
└── arquetipo/                             <- código de referencia (ver sección 4)
    ├── backend/
    ├── web/
    └── mobile/
```

## 2. El documento de arquitectura (PDF)

`BP_Arquitectura_Banca_Digital.pdf` es el entregable principal del ejercicio:
el diseño de arquitectura de solución para el sistema de Banca por Internet
de BP, modelado bajo el **C4 Model** (Contexto, Contenedores, Componentes),
con las decisiones técnicas justificadas (mínimo dos razones cada una) y los
diagramas complementarios de secuencia e infraestructura.

Índice del documento:

1. Resumen ejecutivo
2. Alcance y supuestos
3. Consideraciones normativas y de cumplimiento
4. Decisiones arquitectónicas clave (justificadas, mínimo 2 razones c/u)
5. Arquitectura de las aplicaciones front-end y móvil
6. Diagramas C4 (Contexto, Contenedores, Componentes)
7. Arquitectura de autenticación y autorización
8. Onboarding con verificación biométrica + diagrama de secuencia
9. Diseño de la solución de auditoría
10. Arquitectura de acceso a datos
11. Infraestructura cloud AWS, alta disponibilidad y DR
12. Seguridad
13. Monitoreo, excelencia operativa y auto-healing
14. Gestión de costos
15. Arquitectura desacoplada, reusable y extensible
16. Conclusiones

## 3. Diagramas editables (`documentos/`)

La carpeta `documentos/` contiene las 5 versiones editables (formato
`.drawio`, abrir en [draw.io](https://app.diagrams.net)) de los diagramas que
aparecen en el PDF: Contexto, Contenedores, Componentes, Secuencia de
onboarding/autenticación e Infraestructura AWS (HA/DR).

## 4. Arquetipo de código (`arquetipo/`)

La carpeta `arquetipo/` contiene un esqueleto de código desarrollado por
**Andrés Eduardo Cárdenas Jaramillo**, a modo de material adicional para
ilustrar con código real las decisiones y patrones descritos en el documento.
No es un requisito del ejercicio.

**Es:**
- Un esqueleto de carpetas y archivos que refleja 1:1 los contenedores y
  componentes del Diagrama C4 (Nivel 2 y 3) del PDF.
- Una referencia de cómo se verían implementados los patrones arquitectónicos
  clave: BFF (Backend for Frontend), Circuit Breaker, Adapter/Anti-Corruption
  Layer, Transactional Outbox, OAuth 2.0 Authorization Code + PKCE, WebAuthn/FIDO2.
- Código sintácticamente válido, con firmas de función, contratos (DTOs) y
  comentarios que citan la sección del PDF que justifica cada decisión.

**No es:**
- Un sistema desplegable ni un MVP.
- Código con pruebas automatizadas, `node_modules`/dependencias descargadas,
  `docker-compose`, pipelines de CI/CD, ni Infraestructura como Código (IaC).
- Una implementación completa: la lógica de negocio real (validaciones contra
  el Core Bancario, persistencia en Aurora, publicación real a EventBridge/MSK,
  llamadas reales al IdP) está marcada con `// TODO` porque depende de sistemas
  externos que no existen en este ejercicio.

### 4.1 Estructura completa del arquetipo

```
arquetipo/
├── backend/
│   ├── README.md
│   ├── libs/
│   │   ├── shared-dto/               <- DTOs/tipos compartidos (BFF + SPA + móvil)
│   │   └── integration/              <- capa de integración (mapea a C4 Nivel 3)
│   │       └── src/
│   │           ├── orchestration.service.ts   <- Orchestration Service (patrón Facade)
│   │           ├── circuit-breaker.ts         <- Circuit Breaker + retry/backoff
│   │           ├── cache.client.ts            <- Cache Client (Redis, cache-aside)
│   │           ├── outbox.publisher.ts        <- Event Publisher (Transactional Outbox)
│   │           └── adapters/
│   │               ├── clientes.adapter.ts
│   │               ├── movimientos.adapter.ts
│   │               └── transferencias.adapter.ts
│   │
│   ├── bff-web/                      <- BFF Web (Node.js/NestJS)
│   │   └── src/token-handler.controller.ts   <- Token Handler: cookie httpOnly
│   │
│   ├── bff-mobile/                   <- BFF Mobile (Node.js/NestJS)
│   │   └── src/auth.middleware.ts    <- valida Access Token emitido tras PKCE nativo
│   │
│   └── services/                     <- 7 microservicios de dominio
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

### 4.2 Backend polyglota: qué servicio usa qué stack

La mayoría de los microservicios usan **Node.js + NestJS**, adecuado para
servicios que son principalmente orquestadores de llamadas a APIs externas
(cuello de botella de red, no de cómputo). Dos servicios usan
**Java + Spring Boot**, por requerir transformación/orquestación más compleja
antes de comunicarse con el Core Bancario:

| Servicio | Stack | Responsabilidad |
|---|---|---|
| `identity-service` | Node.js + NestJS | Token broker OAuth 2.0 + registro WebAuthn/FIDO2 |
| `onboarding-service` | Node.js + NestJS | Registro + verificación biométrica (liveness/match) |
| `clientes-service` | **Java + Spring Boot** | Agrega Core Bancario + Sistema Complementario |
| `movimientos-service` | Node.js + NestJS | Histórico de movimientos y saldos (cacheable) |
| `transferencias-service` | **Java + Spring Boot** | Transferencias propias e interbancarias, Outbox |
| `notificaciones-service` | Node.js + NestJS | Orquesta canales push/SMS/email |
| `auditoria-service` | Node.js + NestJS | Consume eventos, persiste log append-only (hash chain) |

Todos exponen el mismo tipo de contrato REST/HTTPS hacia el BFF correspondiente
— el lenguaje de implementación es un detalle interno del contenedor y no
afecta al Diagrama de Contenedores/Componentes (C4) ni a los adapters del lado
del BFF (`arquetipo/backend/libs/integration/src/adapters/*`).

### 4.3 Patrones arquitectónicos y dónde encontrarlos

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

### 4.4 Cómo leer este código (orden sugerido)

No se recomienda tratar de "correrlo" de punta a punta. Para entenderlo, el
orden más útil suele ser:

1. Este README y `arquetipo/backend/README.md` — mapa general.
2. `arquetipo/backend/libs/integration/src/` — los componentes que aparecen en
   el Diagrama de Componentes (C4 Nivel 3): Orchestration Service, Circuit
   Breaker, Adapters, Outbox.
3. `arquetipo/backend/bff-web/src/token-handler.controller.ts` — cómo el BFF
   absorbe el manejo de tokens para que la SPA nunca los toque.
4. Un servicio Node.js (`onboarding-service`) y un servicio Java
   (`transferencias-service`) — para comparar el mismo tipo de responsabilidad
   (controller → service → adapter) en ambos stacks.
5. `mobile/src/auth/pkce.ts` y `web/src/api/httpClient.ts` — el flujo de
   autenticación visto desde cada canal cliente.

## 5. Relación entre las carpetas y el documento

| Carpeta | Diagrama C4 | Sección del PDF |
|---|---|---|
| `arquetipo/backend/libs/integration` | Componentes (Nivel 3) | §6.3 — Capa de integración |
| `arquetipo/backend/bff-web`, `bff-mobile` | Contenedores (Nivel 2) | §5, §7 — BFF y autenticación |
| `arquetipo/backend/services/*` | Contenedores (Nivel 2) | §6.2, §8, §9 |
| `arquetipo/web/` | Contenedores (Nivel 2) | §5 — SPA con Token Handler |
| `arquetipo/mobile/` | Contenedores (Nivel 2) | §7, §8 — PKCE + biometría |
| `documentos/*.drawio` | Contexto, Contenedores, Componentes, Secuencia, Infraestructura | Todo el documento |

## 6. Autoría

Andrés Eduardo Cárdenas Jaramillo — Arquitecto de Soluciones.
Documento de arquitectura y arquetipo de código desarrollados para el
ejercicio "Diseño de Arquitectura de Solución — Sistema de Banca por Internet BP".
