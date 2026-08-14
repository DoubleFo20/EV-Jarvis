---
id: DOC-031
title: Test Plan
version: 1.1.0
last_updated: 2026-08-07
status: Approved
progress: Complete
owner: QA Engineer
author: Codex
references:
  - docs/01_Project_Management/01_PROJECT_RULES.md
  - docs/02_Requirements/04_SRS.md
  - docs/03_Architecture/03_TECH_STACK.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
---

# Test Plan — EV-JARVIS

# 1. Purpose

กำหนด Test Strategy และ Verification Gate ขั้นต่ำสำหรับ EV-JARVIS โดยใช้ Vitest, Supertest และ Playwright ตาม Tech Stack

# 2. Test Levels

| Level | Tool | Scope |
|---|---|---|
| Unit | Vitest | Service, utility, validation และ domain logic |
| Integration | Vitest + Supertest | Express middleware, route, controller และ database adapter บน test environment |
| End-to-End | Browser/runtime smoke | Critical Next.js SSR Auth flows บน EV-JARVIS-DEV เมื่อได้รับอนุมัติ |
| Performance | K6 หรือ Artillery ตาม Task | API และ AI endpoints ที่มี performance requirement |
| Manual Smoke | Runtime tools | Server startup, health และ changed flow |

# 3. Sprint 1 Preparation Scope

รอบเตรียม Repository ต้องมี Test Script ที่รันได้และ Foundation Test อย่างน้อยสำหรับ Health API โดยไม่สร้าง Authentication Feature

# 4. Sprint 1 Feature Scope

เมื่อ Sprint 1 implementation ได้รับอนุมัติ Test ต้องครอบคลุม:

- Registration, Login, Logout และ Session ตาม Feature Scope ที่ยืนยันแล้ว
- Missing/invalid token
- Unauthorized และ forbidden access
- Validation failure
- Password policy negative cases: ความยาวขั้นต่ำ 8 ตัว, ตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข และสัญลักษณ์
- Error response contract
- Secret และ sensitive-data redaction
- Server-side protected-route redirect, Profile RLS และ forced session refresh

# 5. Test Environment

- ใช้ Environment แยกจาก Production
- ห้ามใช้ Production Database หรือ Production Credential
- Test ต้องทำซ้ำได้และไม่พึ่งลำดับการรัน
- External Provider ต้อง Mock เมื่อไม่ใช่ Integration Test ที่ได้รับอนุมัติ
- Destructive Auth verifier ต้องผ่าน `EV-JARVIS-DEV` environment-name, project-ref SHA-256 fingerprint และ explicit opt-in gate ก่อนสร้างหรือลบผู้ใช้

# 6. Entry and Exit Criteria

Entry:

- Requirement และ Acceptance Criteria ชัดเจน
- Test environment variables ถูกกำหนดโดยไม่มี Secret ใน Repository

Exit:

- Build, Lint, Typecheck และ Relevant Tests ผ่าน
- ไม่มี Critical/High defect ที่ยังไม่ได้อนุมัติ
- Verification Evidence ครบ

# 7. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.1.0 | 2026-08-07 | Approved | Project Owner / Codex | เพิ่ม Next.js SSR Auth flow, password-policy negatives และ destructive DEV verifier gate |
| 1.0.0 | 2026-08-05 | Review | Codex | กำหนด Test Strategy และ Sprint 1 preparation gate |
