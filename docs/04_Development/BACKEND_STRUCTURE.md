---
id: DOC-028
title: Backend Structure
version: 1.0.0
last_updated: 2026-08-05
status: Review
progress: Complete
owner: Lead Software Engineer
author: Codex
references:
  - docs/03_Architecture/01_SYSTEM_ARCHITECTURE.md
  - docs/03_Architecture/03_TECH_STACK.md
  - docs/08_API/01_API_SPECIFICATION.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
---

# Backend Structure — EV-JARVIS

# 1. Purpose

กำหนดขอบเขตและโครงสร้าง Backend ตาม Modular Monolith, Clean Architecture และ Feature-based Modules ที่ได้รับอนุมัติ โดยไม่เปลี่ยน Architecture เดิม

# 2. Current Repository Structure

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── package.json
├── package-lock.json
├── eslint.config.mjs
└── tsconfig.json
```

โครงสร้างปัจจุบันเป็น Backend foundation เท่านั้น ยังไม่มี Domain Feature, Prisma หรือ Supabase integration

# 3. Target Module Responsibilities

เมื่อ Sprint Task อนุมัติให้สร้าง Feature ให้จัดโค้ดตาม Domain ภายใต้ `backend/src/modules/<feature>/` โดยแยกความรับผิดชอบดังนี้:

| Layer | Responsibility |
|---|---|
| Route | กำหนด HTTP method, path และ middleware chain |
| Controller | แปลง HTTP request/response และเรียก Application Service |
| Service / Use Case | Business logic และ orchestration |
| Repository Port | Interface สำหรับ data access |
| Repository Adapter | Prisma/Supabase implementation ตาม Architecture |
| Schema / DTO | Zod validation และ API contract |
| Test | Unit และ integration tests ที่ผูกกับ Acceptance Criteria |

Shared middleware, errors, logging และ configuration ต้องอยู่ใน shared area ภายใน `backend/src/` และห้ามเรียก Prisma โดยตรงจาก Controller

# 4. Sprint 1 Applicability

Sprint 1 จำกัดที่ Foundation และ Authentication ตาม Task ที่ Project Owner อนุมัติ งานเตรียม Repository รอบนี้ไม่สร้าง Auth Module หรือ Business Schema

ก่อนเพิ่มโครงสร้างใหม่ต้องตรวจ PRD, SRS, Security Architecture, API Authentication และ Sprint 1 Plan

# 5. Constraints

- Node.js และ TypeScript strict mode
- Express REST API ภายใต้ `/api/v1`
- Error response ตาม RFC 7807
- Structured logging โดยไม่บันทึก Secret หรือ PII
- Input validation ฝั่ง Server
- Supabase Auth เป็น Identity Provider
- Prisma เป็น ORM ตามเอกสาร Tech Stack
- ห้ามเปลี่ยน Architecture หรือเพิ่ม Dependency นอก Sprint Scope

# 6. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.0.0 | 2026-08-05 | Review | Codex | กำหนดโครงสร้าง Backend ขั้นต่ำและขอบเขตสำหรับ Sprint 1 |
