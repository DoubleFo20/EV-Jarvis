---
id: DOC-030
title: Coding Standard
version: 1.1.0
last_updated: 2026-09-28
status: Review
progress: Complete
owner: Lead Software Engineer
author: Codex
references:
  - docs/01_Project_Management/01_PROJECT_RULES.md
  - docs/01_Project_Management/AI_AGENT_RULES.md
  - docs/03_Architecture/03_TECH_STACK.md
---

# Coding Standard — EV-JARVIS

# 1. Purpose

กำหนดมาตรฐานขั้นต่ำสำหรับ Production Code และ Test โดยขยายจาก PROJECT_RULES และไม่เปลี่ยน Architecture

# 2. TypeScript

- เปิด `strict: true`
- หลีกเลี่ยง `any`, `@ts-ignore` และ unsafe type assertion
- Export type ที่จำเป็นเท่านั้น
- Validate external input ก่อนใช้ใน Business Logic
- Function และ Module ต้องมีหน้าที่ชัดเจน

# 3. Naming

| Element | Convention | Example |
|---|---|---|
| Variable / Function | camelCase | `batteryLevel` |
| Class / Type / Component | PascalCase | `BatteryCard` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Source File | kebab-case | `health-controller.ts` |
| React Component File | PascalCase | `LoginForm.tsx` |
| Database Table / Column | snake_case | `charging_sessions` |
| API Path | kebab-case, plural | `/api/v1/charging-sessions` |

# 4. Backend Rules

- Route จัดการ routing และ middleware เท่านั้น
- Controller ไม่มี Database Query โดยตรง
- Business Logic อยู่ใน Service/Use Case
- Error response ใช้ RFC 7807 และไม่เปิดเผย Stack Trace ใน Production
- Log ต้องเป็น Structured Log และห้ามมี Secret, Token หรือ PII ที่ไม่จำเป็น
- Async operation ต้องจัดการ error และ shutdown อย่างเหมาะสม

# 5. Frontend Rules

- ใช้ Functional Components และ Hooks
- Component ต้องไม่รวม data access และ presentation จนเกินความรับผิดชอบเดียว
- Server State ใช้ TanStack Query
- Form validation ใช้ React Hook Form และ Zod
- รองรับภาษาไทย, Responsive Design และ Accessibility ตาม Requirement

# 6. Testing and Review

- Code ใหม่ต้องมี Relevant Test ตาม Risk
- ห้ามลบหรือ Skip Test เพื่อให้ Pipeline ผ่าน
- ตรวจ Build, Lint, Typecheck และ Tests ก่อนขอ Commit
- Diff ต้องอยู่ใน Sprint Scope และไม่มีการ Format ไฟล์นอก Scope
- ใช้ one-writer-per-file/path: subagents ทำงานพร้อมกันได้เมื่อ ownership เป็น disjoint และไม่แก้ไฟล์ทับซ้อนกัน
- ไฟล์ shared ต้องมีผู้เขียนหนึ่งตัวและ serialize; หากพบ ownership หรือ content conflict ให้หยุดและรายงานก่อนแก้ต่อ

# 7. Sprint 1 Applicability

ใช้กับ Foundation, Authentication และ Test Tooling ของ Sprint 1 การเปลี่ยน Authentication Policy, Database Schema หรือ Dependency ต้องผ่าน Approval ตาม Risk Classification

# 8. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.1.0 | 2026-09-28 | Review | Codex | เพิ่ม disjoint file/path ownership และ shared-file serialization rules โดยไม่เปลี่ยน coding conventions |
| 1.0.0 | 2026-08-05 | Review | Codex | กำหนดมาตรฐาน Code และ Test ขั้นต่ำสำหรับ Sprint 1 |
