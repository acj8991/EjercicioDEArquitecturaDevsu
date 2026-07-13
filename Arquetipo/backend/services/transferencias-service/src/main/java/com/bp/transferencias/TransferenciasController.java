package com.bp.transferencias;

import com.bp.transferencias.dto.EjecutarTransferenciaRequest;
import com.bp.transferencias.dto.TransferenciaResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transferencias")
public class TransferenciasController {

    private final TransferenciasService service;

    public TransferenciasController(TransferenciasService service) {
        this.service = service;
    }

    @PostMapping
    public TransferenciaResponse ejecutar(@Valid @RequestBody EjecutarTransferenciaRequest request) {
        return service.ejecutar(request);
    }
}
