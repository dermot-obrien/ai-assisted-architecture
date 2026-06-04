# Event Streaming & Messaging

AB Summary | Version 1.0.0 | Status DRAFT

## Purpose

Shared asynchronous integration fabric that standardises event transport, schema governance, delivery assurance, and replay operations.

## Key Components

- Broker Runtime. Provides durable publish-subscribe and queue transport.
- Topic Management. Controls topic and queue lifecycle and partitioning.
- Subscription Control. Manages consumer groups and delivery subscriptions.
- Schema Registry. Stores versioned event contracts and metadata.
- Producer Validation. Validates event envelopes at publish boundaries.
- Compatibility Checks. Enforces schema evolution compatibility policy.
- Retry Control. Coordinates retry behaviour for transient failures.
- Dead-Letter Handling. Isolates failed events for controlled remediation.
- Replay Services. Replays event streams for recovery and reprocessing.

## Cross-Cutting Posture

- Identity & Access. Applies least-privilege identity controls for event access.
- Observability. Monitors lag, throughput, failure rates, and consumer health.
- Governance & Policy. Enforces classification, retention, and replay governance rules.

## Key Interfaces

- I1 Producer -> Event Platform. Event publication.
- I2 Event Platform -> Consumer. Asynchronous delivery.
- I3 Producer -> Schema Registry. Contract validation.
- I5 Operator -> Event Platform. Replay request.
- I6 Event Platform -> Observability. Pipeline telemetry.
- I8 Event Platform -> IAM. Identity verification.

## Policy Alignment

- Integration Policy. Governed asynchronous channels.
- Data Governance. Classified event payload handling.
- Resilience Policy. Retry and dead-letter controls.
- Security Policy. Identity-authenticated producer/consumer access.
