# GovConnect Architecture Specification

This document provides a comprehensive technical overview of the interoperability patterns, data transformation standards, security controls, and workflow orchestration implemented in **GovConnect**.

---

## 1. Syntactic Interoperability

**Syntactic Interoperability** guarantees that independent software systems can exchange data structures smoothly regardless of the underlying encoding or transport format.

- **Legacy Revenue System Format**: Legacy government revenue portals serialize citizen income records using XML schema formats:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <Citizen>
      <RevenueId>REV-7845</RevenueId>
      <AnnualIncome>75000</AnnualIncome>
      <FinancialYear>2025-2026</FinancialYear>
  </Citizen>
  ```
- **GovConnect Syntactic Adapter**: The `xmlTransformer` service utilizes high-performance AST XML parsing (`fast-xml-parser`) to parse string XML trees into internal JSON objects without loss of field fidelity or data precision.

---

## 2. Semantic Interoperability

**Semantic Interoperability** ensures that the precise meaning of exchanged data is preserved and interpreted consistently by the receiving department.

- **Common Data Model (CDM)**:
  ```json
  {
    "citizenId": "CIT-1001",
    "revenueId": "REV-7845",
    "annualIncome": 75000,
    "financialYear": "2025-2026",
    "source": "Revenue Department Legacy System (XML Interface)",
    "verifiedAt": "2026-09-07T06:14:00.000Z",
    "verified": true
  }
  ```
- **Data Quality Validator**:
  1. Validates that `annualIncome` is numeric and non-negative (`>= 0`).
  2. Asserts mandatory existence of citizen identifiers.
  3. Verifies data source provenance headers.

---

## 3. Master Data & Identity Mapping

Different government departments maintain distinct identity databases:
- **Social Welfare Department**: Citizen Identifier = `CIT-1001`
- **Revenue Department**: Citizen Identifier = `REV-7845`

The **CitizenIdMapping Service** maintains an index mapping between `welfareId` and `revenueId`. When a citizen applies for a scheme, the middleware dynamically resolves `CIT-1001` → `REV-7845` before querying the Revenue API.

---

## 4. Digital Consent Management Engine

- **Principle**: No personal financial data is fetched or transmitted without active, explicit citizen consent.
- **Enforcement**: The `verifyCitizenConsent` middleware inspects the `Consent` database collection prior to executing cross-departmental API requests.
- **Revocation**: Citizens can revoke active consent at any time via the Citizen Portal, immediately terminating Revenue API data access for future scheme processing.

---

## 5. Workflow State Machine

Applications transition through non-repudiable states managed by `workflowService`:

```
SUBMITTED
  │
  ▼
CONSENT_PENDING
  │
  ▼
INCOME_VERIFICATION  ─────── (XML fetch from Revenue Dept)
  │
  ▼
INCOME_VERIFIED      ─────── (Parsed & Validated)
  │
  ▼
ELIGIBILITY_CHECK    ─────── (Deterministic Rule Evaluator)
  │
  ├──────────────────────────┐
  ▼                          ▼
ELIGIBLE                NOT_ELIGIBLE
  │
  ▼
APPROVED / COMPLETED
```

---

## 6. Security, RBAC & Audit Logging

- **Authentication**: Json Web Tokens (JWT) with HS256 encryption.
- **Role-Based Access Control (RBAC)**:
  - `CITEN`: Access own applications & consent records.
  - `WELFARE_OFFICER`: Review welfare applications & verified income payloads.
  - `REVENUE_OFFICER`: Inspect revenue XML dispatch logs.
  - `ADMIN`: Monitor system metrics, audit logs, and configure dynamic rules.
- **Audit Trails**: Every API call, identity resolution, consent grant/revocation, and rule evaluation writes an immutable audit record to `AuditLog`.
