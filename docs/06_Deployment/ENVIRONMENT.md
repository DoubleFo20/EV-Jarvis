---
id: DOC-032
title: Environment Contract
version: 1.1.0
last_updated: 2026-08-07
status: Approved
progress: Complete
owner: Lead Software Engineer
author: Codex
references:
  - docs/03_Architecture/03_TECH_STACK.md
  - docs/03_Architecture/04_DEPLOYMENT.md
  - docs/03_Architecture/05_SECURITY_ARCHITECTURE.md
  - docs/08_API/02_AUTHENTICATION.md
---

# Environment Contract — EV-JARVIS

# 1. Purpose

กำหนดชื่อและขอบเขต Environment Variables โดยไม่เก็บค่าจริงหรือเชื่อมต่อ External Service ในรอบเตรียม Repository

# 2. Environments

| Environment | Purpose | Data Rule |
|---|---|---|
| Development | Local development | ห้ามใช้ Production data |
| Test | Automated tests | ใช้ isolated test resources หรือ mocks |
| Staging | Pre-production verification | แยก Project และ Secret จาก Production |
| Production | Live service | Secret Store และ Approval required |

# 3. Backend Variables

| Variable | Classification | Purpose |
|---|---|---|
| `NODE_ENV` | Non-secret | Runtime environment |
| `PORT` | Non-secret | Backend HTTP port; Architecture กำหนด 4000 |
| `CORS_ORIGIN` | Non-secret | Allowed Frontend origin |
| `DATABASE_URL` | Server-only secret | Pooled PostgreSQL connection |
| `DIRECT_URL` | Server-only secret | Direct connection สำหรับ approved migration workflow |
| `SUPABASE_URL` | Server configuration | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public/project key | Supabase public client key; ยังต้องควบคุม RLS |
| `SUPABASE_SECRET_KEY` | Server-only secret | Privileged server operation; ห้ามส่ง Frontend |
| `EV_JARVIS_ENVIRONMENT` | Non-secret safety gate | ต้องเป็น `EV-JARVIS-DEV` สำหรับ destructive DEV verifier |
| `EV_JARVIS_DEV_PROJECT_REF_SHA256` | Non-secret identity fingerprint | SHA-256 ของ approved DEV project ref โดยไม่พิมพ์ project ref |
| `ALLOW_DESTRUCTIVE_AUTH_DEV_VERIFICATION` | Non-secret explicit opt-in | ต้องเป็น `true` เฉพาะการรัน verifier ที่ Owner อนุมัติ; ค่าเริ่มต้น `false` |

# 4. Frontend Variables

| Variable | Classification | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public frontend variable | Next.js site URL และ Auth callback origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Public frontend variable | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public frontend variable | Supabase publishable key ภายใต้ RLS |
| `API_BASE_URL` | Server-only configuration | Backend API base URL สำหรับ Server Components/Actions |

Frontend ห้ามมี Service Role Key, JWT Secret, Database URL หรือ Secret ของ Provider

# 5. Secret Handling

- `.env` และ `.env.*` ต้องถูก Ignore
- Commit ได้เฉพาะ `.env.example` ที่ไม่มี Secret
- ห้ามพิมพ์ Secret ใน Log, Test Output หรือ Chat
- Production Secret ต้องอยู่ใน Platform Secret Store
- การเชื่อม Supabase, Migration และ Production Configuration ต้องได้รับ Approval

# 6. Sprint 1 Applicability

Sprint 1 ต้องยืนยัน Supabase project, Auth methods, Role model, Token strategy, Email provider และ Migration permission ก่อนเชื่อมต่อจริง

# 7. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.1.0 | 2026-08-07 | Approved | Project Owner / Codex | ปรับ contract ให้ตรง Next.js/Supabase keys และเพิ่ม EV-JARVIS-DEV destructive verifier gates |
| 1.0.0 | 2026-08-05 | Review | Codex | กำหนด Environment Contract และ Secret boundary สำหรับ Sprint 1 |
