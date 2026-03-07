# Policy Decision Service (OPA)

**SB-003** | **Version** 1.0 | **Status** APPROVED | **Realises** AB-003 Governance & Policy Enforcement

## Purpose

Realises the Governance ABB (AB-003) using Open Policy Agent (OPA). It decouples policy logic from application code, providing a high-performance evaluation engine using the Rego language for real-time authorization and operational decisions.

## Product Mapping

• **Policy Decision Point.** Open Policy Agent (OPA) Engine.
• **Policy Authoring.** Rego language via VS Code.
• **Policy Repository.** GitHub (Version Control).
• **Policy Distribution.** OPA Bundle Service.
• **Enforcement Adapter.** Envoy Proxy / OPA SDK.
• **Evidence Collection.** OPA Decision Logs.

## Cross-Cutting Posture

• **Identity & Access.** OPA-to-Bundle communication secured via Entra Workload ID.
• **Observability.** OPA decision logs exported via OpenTelemetry for audit.
• **Governance & Policy.** Rego unit tests and mandatory policy signing in CI/CD.

## Key Design Decisions

• **Policy-as-Code.** All rules version-controlled and peer-reviewed.
• **Signed Bundles.** Only cryptographically signed policies are accepted by engines.
• **Fail-Closed.** Authorization requests fail denied if the OPA service is unreachable.

## Key Interfaces

• **I1** Service → OPA API. REST/JSON policy decision request.
• **I4** OPA → Bundle Server. Signed policy bundle download.
• **I8** OPA → OTel Collector. Decision log export for evidence.
