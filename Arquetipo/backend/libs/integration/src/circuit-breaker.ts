/**
 * Circuit Breaker simple (timeout + reintentos + apertura de circuito).
 * Ver PDF §4.8 -- Patrón de resiliencia: Circuit Breaker + Retry + Timeout.
 *
 * Envuelve llamadas salientes hacia dependencias externas (Core Bancario,
 * sistema complementario, red interbancaria) para evitar que una falla en
 * cascada de un sistema externo tumbe el canal del cliente.
 */
export interface CircuitBreakerOptions {
  timeoutMs?: number;
  maxFailures?: number;
  resetAfterMs?: number;
}

type State = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: State = "CLOSED";
  private failureCount = 0;
  private openedAt = 0;

  constructor(private readonly opts: CircuitBreakerOptions = {}) {
    this.opts.timeoutMs ??= 3000;
    this.opts.maxFailures ??= 5;
    this.opts.resetAfterMs ??= 15000;
  }

  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    if (this.state === "OPEN") {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed < this.opts.resetAfterMs!) {
        if (fallback) return fallback();
        throw new Error("Circuit breaker abierto: dependencia degradada");
      }
      this.state = "HALF_OPEN";
    }

    try {
      const result = await this.withTimeout(fn(), this.opts.timeoutMs!);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      if (fallback) return fallback();
      throw err;
    }
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), ms),
      ),
    ]);
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.opts.maxFailures!) {
      this.state = "OPEN";
      this.openedAt = Date.now();
    }
  }
}
