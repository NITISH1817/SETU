# SETU (GovConnect) – Government Interoperability Framework & Middleware

GovConnect is a comprehensive government interoperability framework, middleware layer, and federated service delivery architecture designed to enable secure, standards-based information exchange across independent government portals without replacing existing legacy databases.

---

## 📋 Comprehensive Problem Statement Coverage Matrix

| Expected Solution Requirement | How GovConnect Covers It | Component / Implementation |
| :--- | :--- | :--- |
| **API-Based Exchange** | REST API Gateway connecting independent departmental portals with OpenAPI 3.0 specs. | Backend Express API Gateway (`/api/*`), Swagger UI (`/api-docs`). |
| **Common Data Standards** | Syntactic & Semantic Interoperability converting legacy XML into a Common JSON Model. | `xmlTransformer.ts` (XML ➔ JSON Common Data Model). |
| **Master-Data Management & ID Mapping** | Identity Resolution mapping Welfare Citizen IDs to Revenue IDs. | `idMappingService.ts` (`CIT-1001` ↔ `REV-7845`). |
| **Consent-Based Data Sharing** | Strict digital consent management allowing citizens to grant or revoke data access. | `Consent.ts` model, `verifyCitizenConsent.ts` middleware. |
| **Single Sign-On / Federated Identity** | JWT-based authentication & Role-Based Access Control across all portals. | `auth.ts`, `rbac.ts` (`CITIZEN`, `WELFARE_OFFICER`, `REVENUE_OFFICER`, `ADMIN`). |
| **Event-Driven Notifications** | In-app notification engine delivering real-time status updates to citizens. | `notificationService.ts`, `NotificationsList.tsx`. |
| **Unified Application Tracking** | End-to-end multi-department application tracker showing timeline & next steps. | `ApplicationTracker.tsx` (`APP-2026-001` tracking timeline). |
| **Configurable Workflow Orchestration** | Non-repudiable state machine handling application lifecycle transitions. | `workflowService.ts` (`SUBMITTED` ➔ `VERIFIED` ➔ `ELIGIBLE` ➔ `COMPLETED`). |
| **Reusable Connectors (Legacy & Modern)** | Connectors for legacy XML interfaces (Revenue) and modern REST JSON APIs (Welfare). | `revenueClient.ts` (XML), REST API Gateway (JSON). |
| **Audit Logs & Security** | Immutable audit log ledger recording all system events, identity mappings & API hits. | `AuditLog.ts`, `auditService.ts`, Admin Audit Trail Table. |
| **Data Quality Checks** | 6-point schema quality validator ensuring non-negative income & non-empty fields. | `dataValidator.ts`. |
| **Exception Handling & Resilience** | Central error handler & automatic fallback to `mongodb-memory-server` for offline mode. | `errorHandler.ts`, `db.ts`. |
| **Monitoring Dashboards** | Professional monitoring dashboard displaying API health, latency & rule configurators. | `AdminDashboard.tsx`, `MiddlewareHub.tsx`. |
| **Monochrome UI & i18n** | Strict monochrome government aesthetic with full multilingual support (react-i18next). | `index.css` (variables), `i18n.ts`, Locales. |

---

## 🏛️ Multi-Department Architecture Overview

```
   Citizen (Citizen Portal)
            │
            ▼
 ┌────────────────────────────────────────────────────────┐
 │            GovConnect Interoperability Middleware      │
 │                                                        │
 │  1. JWT & RBAC Auth Check                              │
 │  2. Digital Consent Management                         │
 │  3. Master Identity Resolution (CIT-1001 ➔ REV-7845)   │
 │  4. Revenue API Request Dispatch                       │
 │  5. Legacy XML Parsing & Data Quality Validation       │
 │  6. Common JSON Data Model Standard                    │
 │  7. Configurable Deterministic Rules Engine           │
 │  8. Audit Trail & Non-repudiable State Machine         │
 └──────────────┬─────────────────────────┬───────────────┘
                │                         │
                ▼                         ▼
   Revenue Dept Legacy API       Social Welfare Dept
   GET /api/revenue/citizen/...  Eligibility & Disbursement
   [ Returns Legacy XML ]        [ Scholarship / Pension ]
```

---

## 🚀 Quickstart & Execution

```bash
# 1. Start Backend Server (Port 5000)
cd backend
npm run dev

# 2. Start Frontend Portal (Port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Hackathon Demo Credentials

| Role | Email | Password | Identifier / Scenario |
| :--- | :--- | :--- | :--- |
| **Citizen (Scholarship)** | `citizen@gov.in` | `Citizen123!` | Welfare ID `CIT-1001` (Revenue `REV-7845`, ₹75,000 → **Eligible**) |
| **Citizen (Pension)** | `citizen2@gov.in` | `Citizen123!` | Welfare ID `CIT-1002` (Revenue `REV-9214`, ₹2,10,000 → **Eligible**) |
| **Citizen (High Income)** | `citizen3@gov.in` | `Citizen123!` | Welfare ID `CIT-1003` (Revenue `REV-3312`, ₹4,50,000 → **Ineligible**) |
| **Welfare Officer** | `welfare@gov.in` | `Welfare123!` | Welfare Dept Review & Benefit Payout |
| **Revenue Officer** | `revenue@gov.in` | `Revenue123!` | Revenue Dept XML API & Income Editor |
| **System Admin** | `admin@gov.in` | `Admin123!` | Gateway Monitoring, Audit Logs & Rules Engine |

---

## 📊 Live Links

- **Frontend Portal**: [http://localhost:5173](http://localhost:5173)
- **Revenue Dept Portal**: [http://localhost:5173/revenue-department](http://localhost:5173/revenue-department)
- **Social Welfare Dept Portal**: [http://localhost:5173/welfare-department](http://localhost:5173/welfare-department)
- **Interoperability Gateway Hub**: [http://localhost:5173/middleware-hub](http://localhost:5173/middleware-hub)
- **OpenAPI / Swagger Specs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
