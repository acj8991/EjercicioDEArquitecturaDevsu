package com.bp.transferencias.outbox;

import java.util.Map;

public record DomainEvent(String type, String aggregateId, Map<String, Object> payload, String occurredAt) {}
