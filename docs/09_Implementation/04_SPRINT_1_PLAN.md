---
id: DOC-033
title: Sprint 1 Plan — Foundation & Authentication
version: 1.1.0
last_updated: 2026-08-07
status: Approved
progress: Complete
author: Lead Software Engineer
references:
  - docs/01_Project_Management/01_PROJECT_RULES.md
  - docs/01_Project_Management/PROJECT_PROGRESS.md
  - docs/02_Requirements/03_PRD.md
  - docs/02_Requirements/04_SRS.md
  - docs/03_Architecture/01_SYSTEM_ARCHITECTURE.md
  - docs/03_Architecture/05_SECURITY_ARCHITECTURE.md
  - docs/07_Database/01_DATABASE_DESIGN.md
  - docs/08_API/01_API_SPECIFICATION.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
---

# Sprint 1 Plan — Foundation & Authentication

> **Document ID:** DOC-033
> **Version:** 1.1.0
> **Status:** Approved
> **Sprint:** Sprint 1 — Foundation & Authentication
> **Duration:** 2 สัปดาห์ตาม Master Implementation Plan
> **Owner approval required before implementation:** Satisfied for Milestones 2–3

## 0. Approved Owner Decision Record

| Date | Decision | Scope |
|---|---|---|
| 2026-08-07 | อนุมัติให้ใช้ Next.js 16 App Router + React 19 + TypeScript, Server Components/Server Actions และ `@supabase/ssr` cookie-based session แทน React/Vite SPA ที่เอกสารเดิมกำหนด | Sprint 1 Milestone 3 และ Frontend baseline ถัดไป |

เหตุผลด้านความปลอดภัยคือ protected route และ session check ทำงานฝั่งเซิร์ฟเวอร์, token lifecycle จัดการผ่าน cookie adapter ของ Supabase SSR และไม่มี Service Role/Secret Key ใน client bundle การอนุมัตินี้ไม่รวม Production deployment หรือการเปลี่ยน Database/RLS/Migration เพิ่มเติม

## 1. Sprint Goal

ทำให้โครงสร้าง Frontend, Backend และ Database พร้อมใช้งานร่วมกัน และส่งมอบ Authentication flow ตาม EPIC-001 โดยยึด PRD เป็นขอบเขต, Implementation Plan เป็นแผนเวลา และ PROJECT_PROGRESS เป็นสถานะจริง

## 2. Entry Criteria

- Pre-Sprint repository verification ผ่าน Build, Typecheck, Lint, Test และ bounded runtime check
- Project Owner อนุมัติเอกสารสถานะ Review ที่เกี่ยวข้อง
- Project Owner ยืนยัน Supabase project และอนุญาตการเชื่อมต่อ
- Project Owner ยืนยัน Authentication, Authorization และ Migration decisions ในหัวข้อ 11
- ไม่มี secret อยู่ใน Git และใช้เฉพาะ environment variables

หาก Entry Criteria ข้อใดไม่ผ่าน ห้ามเริ่มงานที่พึ่งพาข้อนั้น

## 3. In Scope

- Foundation ของ Next.js App Router + React + TypeScript ตาม Owner decision วันที่ 2026-08-07
- Prisma และ Supabase PostgreSQL configuration ตาม Database Design
- Supabase Authentication และ JWT verification ใน Backend
- Authentication module สำหรับ FEAT-001 ถึง FEAT-004 ตามลำดับที่ Project Owner อนุมัติ
- Registration, login, logout/session handling, profile และ authorization ขั้นพื้นฐาน
- API contract, validation, structured error, logging และ automated tests ที่เกี่ยวข้อง
- RLS และ migration เฉพาะที่ได้รับอนุมัติก่อนดำเนินการ

## 4. Out of Scope

- Vehicle, telemetry, charging, trip, notification, AI Assistant และ Admin Console ที่เกิน Authentication scope
- Advanced AI, RAG, LLM provider integration และ pgvector workload
- Production deployment, external resource creation และ secret provisioning
- Database migration หรือ Supabase configuration ที่ยังไม่ได้รับอนุมัติ
- Architecture redesign และ feature ที่ไม่มี Requirement ID

## 5. Task Breakdown and Dependency Order

| Order | Task | Traceability | Depends On | Deliverable |
|---|---|---|---|---|
| 1 | ยืนยัน Owner decisions และ Sprint entry gate | PROJECT_RULES, DOC-023 | Pre-Sprint verification | บันทึกคำตัดสินที่อนุมัติแล้ว |
| 2 | จัดทำ Frontend foundation ตามโครงสร้างที่อนุมัติ | EPIC-001, UI-001 ถึง UI-004 | Task 1 | Next.js SSR app ที่ build และ test ได้ |
| 3 | เพิ่ม Prisma configuration และตรวจ schema กับ Database Design | DB-001 ถึง DB-004 | Task 1, Supabase approval | Prisma schema ที่ review ได้ โดยยังไม่ migrate จนกว่าจะอนุมัติ |
| 4 | กำหนด Auth provider/client และ Backend JWT verification | SEC-001 ถึง SEC-004, API-001 ถึง API-004 | Tasks 1, 3 | Auth integration boundary และ middleware |
| 5 | พัฒนา User Registration | FEAT-001, US-001, FR-001 | Tasks 2–4 | Registration flow และ consent handling |
| 6 | พัฒนา Login และ session lifecycle | FEAT-002, US-002, FR-002 | Task 4 | Login/logout/session flow |
| 7 | พัฒนา User Profile และ Preferences ขั้นพื้นฐาน | FEAT-003, US-003, FR-003 | Tasks 5–6 | Protected profile flow |
| 8 | พัฒนา RBAC ขั้นพื้นฐานตาม role ที่อนุมัติ | FEAT-004, US-004, FR-004 | Tasks 3–7 | Authorization policy และ negative tests |
| 9 | ทำ contract, integration, security และ UI flow verification | TEST-001 ถึง TEST-004 | Tasks 2–8 | Verification evidence ครบตาม DoD |
| 10 | อัปเดต PROJECT_PROGRESS และขออนุมัติ Commit | PROJECT_RULES | Task 9 | Sprint evidence และ commit gate |

## 6. Acceptance Criteria

- FEAT-001 ถึง FEAT-004 ที่ถูกเลือกเข้า Sprint มี traceability ถึง requirement และ test ที่ตรงกัน
- ผู้ใช้สมัครด้วย Email/Password ได้ตาม FR-001 และระบบจัดการ consent ตามเอกสาร requirement
- ผู้ใช้ login ได้และ Backend ปฏิเสธ token ที่ขาดหาย หมดอายุ หรือไม่ถูกต้อง
- Protected API ตรวจ authentication และ authorization แบบ deny-by-default
- Profile ของผู้ใช้เข้าถึงได้เฉพาะสิทธิ์ที่กำหนด
- API ใช้ `/api/v1`, JSON และ error contract ที่เอกสาร API กำหนด
- ไม่มี password, access token, refresh token, key หรือ secret ปรากฏใน log หรือ Git
- Frontend และ Backend ผ่าน Build, Typecheck, Lint และ automated tests
- Migration และ RLS (ถ้ามี) ผ่าน review และมี rollback procedure ก่อนใช้กับ Supabase
- Sprint Verification ผ่านก่อน Commit ตาม PROJECT_RULES

## 7. Definition of Done

- Scope และ acceptance criteria ของทุก task ได้รับอนุมัติ
- Production code มี test ครอบคลุม success, validation, authentication, authorization และ dependency failure ที่เกี่ยวข้อง
- Typecheck, Lint, Unit/Integration Test และ Build ผ่านด้วยคำสั่งที่บันทึกไว้
- Runtime health checks และ Authentication smoke test ผ่าน
- API/Database documentation อัปเดตเฉพาะส่วนที่ implementation เปลี่ยนจริง
- Security review ไม่พบ Critical/High issue ที่ยังไม่แก้
- Working tree มีเฉพาะไฟล์ใน scope และไม่มี secret/generated artifact
- PROJECT_PROGRESS สะท้อนสถานะจริง
- Project Owner ตรวจ Verification evidence และอนุมัติ Commit

## 8. Verification Checklist

- [ ] ตรวจ branch และ Git status ก่อนเริ่ม
- [ ] ตรวจ environment contract โดยไม่แสดงค่า secret
- [ ] Backend: install reproducibly, typecheck, lint, test และ build ผ่าน
- [x] Frontend: install reproducibly, typecheck, lint, test และ build ผ่าน
- [ ] API contract tests สำหรับ FEAT-001 ถึง FEAT-004 ผ่าน
- [ ] Authentication negative tests: missing, malformed, expired และ invalid token ผ่าน
- [ ] Authorization negative tests และ object ownership checks ผ่าน
- [x] Registration/Login/Profile UI flow ผ่านใน browser ที่กำหนด
- [ ] Migration dry-run/review และ rollback procedure ผ่านก่อน apply
- [x] RLS policy tests ผ่านสำหรับ anonymous, authenticated owner และ unauthorized user
- [x] Secret scan และ `git diff --check` ผ่าน
- [x] Bounded runtime/smoke test ผ่านและไม่มี process ค้าง
- [x] PROJECT_PROGRESS และ verification evidence อัปเดตแล้ว
- [ ] Project Owner อนุมัติก่อน Commit

## 9. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Supabase project หรือ permissions ยังไม่พร้อม | Block DB/Auth integration | ยืนยัน project และสิทธิ์ก่อน Task 3–4 |
| JWT strategy ไม่ตรงระหว่าง Frontend, Backend และ Supabase | Login ใช้งานไม่ได้หรือเกิดช่องโหว่ | ใช้ Supabase-issued token และยืนยัน verification method ก่อนเขียน middleware |
| Role model ไม่ชัด | Privilege escalation หรือ schema rework | อนุมัติ global/vehicle roles ก่อน schema/migration |
| Migration กระทบฐานข้อมูลที่มีอยู่ | Data loss หรือ downtime | Review SQL, backup, dry-run และ rollback; apply เฉพาะเมื่ออนุมัติ |
| OAuth/Email provider ทำให้ scope ขยาย | Sprint ล่าช้า | เริ่ม Email/Password; เพิ่ม provider เฉพาะที่ Owner ยืนยัน |
| Token storage ไม่ปลอดภัย | XSS/CSRF และ session compromise | ยืนยัน browser session design และทดสอบ security negative cases |

## 10. Rollback Plan

- Code: revert เฉพาะ Sprint commit หลังระบุ dependency และตรวจ working tree
- Configuration: คืนค่าด้วย version-controlled example/contract โดยไม่บันทึก secret
- Database: ใช้ migration rollback ที่ผ่าน review หรือ restore จาก backup ตาม Database Policy
- Supabase Auth/RLS: เก็บ change record และ rollback statement ก่อน apply ทุกครั้ง
- ห้ามใช้ destructive rollback กับ Production โดยไม่มี Owner approval

## 11. Required Owner Decisions

ต้องได้รับคำตอบก่อนเริ่ม implementation ที่เกี่ยวข้อง:

1. อนุมัติ `AI_AGENT_RULES.md` v2.0.0, `CODEx_CONTEXT.md` และเอกสาร Pre-Sprint สถานะ Review หรือไม่
2. Supabase project ถูกสร้างแล้วหรือไม่ และอนุญาตให้เชื่อมต่อใน Sprint 1 หรือไม่
3. อนุญาตให้สร้างและ apply migration ใน Development Supabase หรือให้จัดทำเฉพาะ migration file เพื่อ review
4. Authentication methods: แนะนำ Email/Password ใน Sprint 1; OAuth ดำเนินการภายหลังเมื่อยืนยัน provider
5. OAuth providers ที่ต้องใช้ใน MVP: Google, Apple หรือทั้งสอง
6. Email strategy/provider สำหรับ verification และ password reset
7. Global roles: แนะนำ `user`, `admin`; ยังไม่เพิ่ม `super_admin` ใน MVP
8. Vehicle-level roles: แนะนำ `owner`, `co_owner` และให้ `co_owner` เป็น read-only โดยค่าเริ่มต้นตาม BR-002
9. Token/session policy: แนะนำ access token 1 ชั่วโมง, refresh session 7 วัน โดยต้องตรวจให้ตรงกับ Supabase configuration
10. Browser token storage: ต้องยืนยันรูปแบบที่เข้ากับ Supabase SDK และ CSRF/XSS controls ก่อน implementation
11. Storage bucket: Sprint 1 ต้องใช้หรือไม่; หากไม่ใช้ให้เลื่อนไป Sprint ที่มี file feature
12. Database permission: บัญชี/role ใดอนุญาตให้ Codex ใช้ใน Development และมีสิทธิ์ migration หรือไม่

## 12. Exit Criteria

- Acceptance Criteria และ Definition of Done ผ่านทั้งหมด
- Verification Checklist มี evidence และไม่มี blocker ค้าง
- Requirement, API, Database และ implementation สอดคล้องกัน
- PROJECT_PROGRESS อัปเดตตามสถานะจริง
- Project Owner อนุมัติผล Verification ก่อน Commit

## Revision History

| Version | Date | Status | Author | Change Summary |
|---|---|---|---|---|
| 1.1.0 | 2026-08-07 | Approved | Project Owner / Codex | บันทึก Owner decision สำหรับ Next.js SSR และผล verification ของ Milestone 3 |
| 1.0.0 | 2026-08-05 | Review | Lead Software Engineer | สร้างแผน Sprint 1, acceptance criteria, DoD, verification, risks, rollback และ owner decision gate โดยยังไม่เริ่ม production feature |
