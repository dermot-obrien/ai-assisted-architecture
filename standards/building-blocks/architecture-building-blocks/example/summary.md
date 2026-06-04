# Human-in-the-Loop

**ABB-004** | **Version** 1.0.0 | **Status** DRAFT | **Category** Messaging & Integration

## Purpose

This building block captures the architecture for bidirectional interaction between an AI agent and a human participant. The agent pauses its reasoning loop to solicit human judgement (approvals, corrections, or decisions) at defined points, and resumes once a response is received. The boundary encompasses agent orchestration, messaging channel, compute hosting, and the identity layer.

## Key Components

- **Agent Orchestration.** Controls the reasoning loop and state transitions; determines when human input is required.
- **Reasoning & Inference.** Generates responses, decisions, and plans from conversation context.
- **Conversation State.** Persists dialogue history, checkpoints, and pending approvals.
- **Channel Abstraction.** Normalises messages to a common model; decouples agent from channel.
- **Message Routing.** Delivers messages between agent and human via push/pull models.
- **Agent Runtime.** Hosts the agent workload with scaling and health management.
- **Workload Identity.** Binds agent identity to runtime without stored secrets.

## Cross-Cutting Posture

- **Identity & Access.** Non-human agent identity via federated workload credentials. Least-privilege authorisation; conditional access evaluates risk on every request.
- **Observability.** End-to-end conversation recording, append-only audit trail, operational telemetry, and compliance reporting aligned with GDPR and AI Act.
- **Governance & Policy.** Conditional access enforces deny/allow/step-up decisions. Data classified as PII-capable with encryption and tamper-evident trails. Central lifecycle governance.

## Key Interfaces

- **I1** Agent → Channel. Normalised outbound message requesting human input.
- **I2** Channel → Agent. Normalised inbound human response.
- **I3** Channel → Human. Message rendered in channel native format.
- **I5** Agent → IAM. Token request and validation for agent identity.
- **I7** IAM → Channel. Conditional access policy enforcement.
- **I8** Agent → Observability. Conversation events and reasoning traces.

## Policy Alignment

- **AI Governance.** Agents cannot bypass human approval for high-impact actions.
- **Information Security.** All interactions authenticated and auditable; non-human identities under least privilege.
- **Data Retention.** Conversations recorded, tamper-evident, retained per regulatory schedules.
- **AI Transparency.** Observability data supports human oversight under EU AI Act Article 14.
