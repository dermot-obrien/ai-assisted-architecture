---
id: OC-010
kind: outcome
version: "0.1.0"
status: draft
created: "2026-06-06"
last_modified: "2026-06-06"
owner: "dermot.obrien@patternode.com"
title: "OC-010 Configuration Consistency & Secret Hygiene"
---

# OC-010 Configuration Consistency & Secret Hygiene

| Property | Value |
| :--- | :--- |
| **Outcome ID** | `OC-010` |
| **Name** | Configuration Consistency & Secret Hygiene |
| **Measure** | Zero production incidents caused by configuration drift or expired/leaked secrets, with 100% of secrets automatically rotated within policy. |
| **Status** | `draft`|

## 1. Definition
Achieve a state where all application configuration is centrally managed with environment parity, and all secrets are short-lived, automatically rotated, and never stored in code or configuration files.

## 2. Business Rationale
Configuration drift is a leading cause of deployment failures and environment-specific bugs. Hard-coded or long-lived secrets are among the most common causes of security breaches. Central management eliminates both risks.

## 3. Traceability
- **[CAP-036 Centralised Configuration Management](../../../capabilities/CAP-036/)**
- **[CAP-037 Secret Lifecycle & Rotation](../../../capabilities/CAP-037/)**
- **[CAP-038 Feature Management & Progressive Delivery](../../../capabilities/CAP-038/)**
