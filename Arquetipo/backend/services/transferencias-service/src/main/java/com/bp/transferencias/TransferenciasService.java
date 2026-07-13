package com.bp.transferencias;

import com.bp.transferencias.adapter.InterbancariaAdapter;
import com.bp.transferencias.dto.EjecutarTransferenciaRequest;
import com.bp.transferencias.dto.TransferenciaResponse;
import com.bp.transferencias.outbox.DomainEvent;
import com.bp.transferencias.outbox.TransferenciasOutboxRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class TransferenciasService {

    private final InterbancariaAdapter interbancaria;
    private final TransferenciasOutboxRepository outbox;

    public TransferenciasService(InterbancariaAdapter interbancaria, TransferenciasOutboxRepository outbox) {
        this.interbancaria = interbancaria;
        this.outbox = outbox;
    }

    public TransferenciaResponse ejecutar(EjecutarTransferenciaRequest input) {
        // TODO: validar saldo/limites contra Aurora PostgreSQL (transaccional).

        Object resultadoInterbancario = null;
        if (input.interbancaria()) {
            resultadoInterbancario = interbancaria.originar(input).block();
        }

        outbox.guardarYPublicar(new DomainEvent(
                "TransferenciaRealizada",
                input.clienteId(),
                Map.of(
                        "cuentaOrigen", input.cuentaOrigen(),
                        "cuentaDestino", input.cuentaDestino(),
                        "monto", input.monto(),
                        "moneda", input.moneda(),
                        "resultadoInterbancario", resultadoInterbancario == null ? "" : resultadoInterbancario
                ),
                Instant.now().toString()
        ));

        return new TransferenciaResponse("COMPLETADA", resultadoInterbancario);
    }
}
