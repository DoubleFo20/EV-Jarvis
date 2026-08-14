---
id: DOC-029
title: Frontend Structure
version: 1.1.0
last_updated: 2026-08-07
status: Approved
progress: Complete
owner: Lead Software Engineer
author: Codex
references:
  - docs/03_Architecture/01_SYSTEM_ARCHITECTURE.md
  - docs/03_Architecture/03_TECH_STACK.md
  - docs/08_API/01_API_SPECIFICATION.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
---

# Frontend Structure — EV-JARVIS

# 1. Purpose

กำหนดโครงสร้าง Frontend ตาม Next.js App Router, React, TypeScript, Server Components/Server Actions และ Feature-based Architecture ที่ Project Owner อนุมัติเมื่อ 2026-08-07 โดยแทนที่ React/Vite SPA contract เดิม

# 2. Current Status

`frontend/` มี Next.js 16 implementation สำหรับ Sprint 1 Authentication แล้ว ใช้ `@supabase/ssr` และ cookie-based session โดยตรวจ protected route ฝั่งเซิร์ฟเวอร์

# 3. Target Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── auth/confirm/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── profile/
│   │   └── register/
│   ├── features/
│   ├── shared/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
├── public/
├── next.config.ts
├── src/proxy.ts
├── package.json
└── tsconfig.json
```

# 4. Responsibilities

| Area | Responsibility |
|---|---|
| `app/` | App Router, layouts, Server Components, pages และ Auth callback route |
| `features/` | Server Actions, schema และ error mapping แยกตาม Domain Feature |
| `shared/components/` | UI primitives ที่ไม่มี Business Logic |
| `shared/lib/` | Supabase browser/server clients, verified session และ safe redirect utility |
| `shared/types/` | Shared frontend types ที่สอดคล้องกับ API contract |
| `proxy.ts` | Refresh cookie session และป้องกัน `/dashboard` กับ `/profile` ก่อน render |

# 5. State and Data Rules

- Auth form ส่งเข้า Server Actions และตรวจด้วย Zod ฝั่งเซิร์ฟเวอร์
- Protected page ต้องเรียก verified claims ฝั่งเซิร์ฟเวอร์และใช้ RLS สำหรับข้อมูลผู้ใช้
- Session ใช้ cookie adapter ของ `@supabase/ssr`; ห้ามเก็บ token ใน `localStorage`
- Client Component ใช้เฉพาะเมื่อจำเป็นต่อ browser interaction
- ห้ามใส่ Service Role Key, Database URL หรือ Server-only Secret ในตัวแปร `NEXT_PUBLIC_*`

# 6. Sprint 1 Applicability

Sprint 1 Milestone 3 ส่งมอบ Register, Login, Email confirmation callback, Dashboard, Profile/RLS, Refresh และ Logout แล้ว การตรวจ live flow ใช้ EV-JARVIS-DEV เท่านั้น และไม่มี Production access

# 7. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.1.0 | 2026-08-07 | Approved | Project Owner / Codex | เปลี่ยน frontend contract เป็น Next.js SSR ตาม Owner decision และ implementation ที่ตรวจผ่าน |
| 1.0.0 | 2026-08-05 | Review | Codex | กำหนดโครงสร้าง Frontend ขั้นต่ำสำหรับ React PWA และ Sprint 1 |
