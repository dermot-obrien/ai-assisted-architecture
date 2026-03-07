# Human-in-the-Loop via Microsoft Teams

**SB-004** | **Version** 0.2 | **Status** DRAFT | **Realises** AB-004 Human-in-the-Loop

## Purpose

Realises the Human-in-the-Loop ABB (AB-004) using Microsoft Teams as the human-facing channel and AWS as the agent compute platform. Messages route through Azure AI Bot Service to the agent on AWS (EKS / Agent Core). Uses Graph or Strands for orchestration, Amazon Bedrock for inference, and Entra Agent ID for non-human identity.

## Product Mapping

- **Agent Orchestration.** Graph / Strands (AWS).
- **Reasoning & Inference.** Amazon Bedrock (Claude / Nova).
- **Conversation State.** DynamoDB / Aurora.
- **Channel Abstraction.** Teams SDK CloudAdapter.
- **Agent Identity.** Entra Agent ID.
- **Message Routing.** Azure AI Bot Service.
- **Message Presentation.** Adaptive Cards v1.5+.
- **Agent Runtime.** EKS pod / Agent Core.
- **Workload Identity.** AWS IAM (IRSA / Pod ID).

## Cross-Cutting Posture

- **Identity & Access.** Entra Agent ID + Conditional Access (Azure); AWS IRSA + OIDC federation (AWS). No stored secrets.
- **Observability.** CloudWatch + X-Ray (AWS); Purview Audit (Teams); Entra sign-in logs. QuickSight / Power BI dashboards.
- **Governance & Policy.** Agent-aware Conditional Access; Teams Admin scope control; DLP connector policies; GDPR / AI Act Art. 14 compliance.

## Key Design Decisions

- **Cross-cloud pattern.** Agent on AWS; human interaction via Microsoft Teams. Azure AI Bot Service bridges the two.
- **Identity bridge.** Entra Agent ID authenticates to Bot Service; OIDC federation links Entra to AWS IAM.
- **Teams SDK v2.** Bot Framework SDK retired Dec 2025; new builds use Teams SDK v2 or M365 Agents SDK.

## Key Interfaces

- **I1** Agent (AWS) → Bot Svc. Adaptive Card via ConversationReference.
- **I2** Bot Svc → Agent (AWS). Action.Execute callback (approve / reject).
- **I5** Agent → Entra. Entra Agent ID OAuth 2.0 client credentials.
- **I6** AWS Pod → Entra/AWS. OIDC federated identity (IRSA).
- **I7** Entra CA → Bot Svc. Agent-aware Conditional Access evaluation.
- **I8** Agent → CloudWatch. Custom metrics, X-Ray traces.
