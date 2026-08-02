---
id: DOC-025
title: AI Task Breakdown
version: 1.0.0
last_updated: 2026-08-02
status: Complete
author: Chief AI Systems Architect & Technical Program Manager
references:
  - docs/01_Project_Management/MASTER_CONTEXT.md
  - docs/02_Requirements/03_PRD.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
  - docs/09_Implementation/02_MVP_CHECKLIST.md
---

# AI Task Breakdown — EV-JARVIS

> **Document ID:** DOC-025
> **Version:** 1.0.0
> **Status:** Complete
> **Project:** EV-JARVIS
> **Owner:** Chief AI Systems Architect & Technical Program Manager
> **Last Updated:** 2026-08-02

---

## 1. Purpose
เอกสารฉบับนี้คือ **คัมภีร์ย่อยงานสำหรับการพัฒนาด้วย AI (AI Development Task Breakdown)** โดยแบ่งระบบ EV-JARVIS ทั้งหมดออกเป็นงานขนาดเล็ก (Micro-tasks) ที่สามารถนำไปป้อนเป็น Prompt หรือ Assign ให้กับ AI Agents แขนงต่างๆ ในการเขียนโค้ดได้อย่างมีประสิทธิภาพ ป้องกันอาการ "AI Context Limit" หรือหลงลืมเป้าหมายหลัก

## 2. Development Strategy
- **Database-first:** สร้างรากฐาน Database (Schema & Migration) ก่อนเสมอ
- **API-first:** กำหนดและพัฒนา Controller/Route ให้ส่งข้อมูลถูกต้องตาม OpenAPI ก่อนที่ฝั่ง Frontend จะเรียกใช้
- **Feature-first:** ทยอยทำให้เสร็จทีละ Epic หรือทีละ Feature (Vertical Slice) มากกว่าการทำทีละ Layer แนวนอน
- **Incremental Development:** พัฒนาเพิ่มจากเล็กไปใหญ่ (Start small, then iterate)
- **AI Assisted Development:** แต่ละ Task ถูกออกแบบขนาดมาให้พอดีกับความยาวที่ LLM ยุคปัจจุบัน (Gemini 3.1 Pro, GPT-5.x) สามารถ Gen โค้ดได้สมบูรณ์ใน 1 Prompt

## 3. Global Task Workflow

```mermaid
flowchart TD
    A[Database Migration & Schema] --> B[Backend Services & Models]
    B --> C[REST API Routes & Controllers]
    C --> D[Frontend Services (Axios/Zod)]
    D --> E[Frontend UI Components & Pages]
    E --> F[AI Assistant Integration]
    F --> G[Testing (Unit, E2E)]
    G --> H[Production Deployment]
```

---

## 4. Epic Breakdown

อ้างอิงจาก Product Requirements Document (PRD)

### EPIC-001: Authentication
- **TASK-001:** Setup Auth Module (Express Routers & Zod Schemas)
- **TASK-002:** Create Auth Policies in Supabase (RLS)
- **TASK-003:** Register API Controller
- **TASK-004:** Login API Controller
- **TASK-005:** Create JWT Authentication Middleware
- **TASK-006:** Refresh Token Endpoint & Logic
- **TASK-007:** Frontend Login/Register Page UI
- **TASK-008:** Frontend Auth Context (React Context / Zustand)

### EPIC-002: Vehicle Management
- **TASK-009:** Create Vehicles & Batteries Tables Migration
- **TASK-010:** Vehicles CRUD APIs (Backend)
- **TASK-011:** Telemetry Ingestion Endpoint
- **TASK-012:** Frontend Vehicle List & Add Vehicle Form
- **TASK-013:** Frontend Vehicle Detail & Real-time Status View

### EPIC-003: Charging & Battery
- **TASK-014:** Create Charging Sessions Table
- **TASK-015:** Charging History API & Aggregation
- **TASK-016:** Frontend Charging Graph (Chart.js / Recharts)
- **TASK-017:** AI Station Recommendation Logic (Backend)

### EPIC-004: Trips & Navigation
- **TASK-018:** Create Trips & Routes Tables
- **TASK-019:** Trip Planning AI API Endpoint
- **TASK-020:** Frontend Map Component (Leaflet / Google Maps)
- **TASK-021:** Frontend Trip Planner UI

### EPIC-005: AI Assistant
- **TASK-022:** Create AI Conversations & Memory Tables
- **TASK-023:** Build RAG Search Pipeline (pgvector)
- **TASK-024:** AI Conversation SSE Controller (Streaming)
- **TASK-025:** Frontend AI Chat Interface
- **TASK-026:** AI Context Injection Logic

### EPIC-006: Dashboard & Notifications
- **TASK-027:** Dashboard Overview Aggregation API
- **TASK-028:** Frontend Dashboard Widgets
- **TASK-029:** Webhook Receiver for Push Notifications
- **TASK-030:** Frontend Bell Notification Component

---

## 5. Backend Task Breakdown
*แบ่งตามโครงสร้างโฟลเดอร์*
- **Controllers:** `AuthController`, `VehicleController`, `TripController`, `AIController`
- **Routes:** `authRoutes`, `vehicleRoutes`, `tripRoutes`, `aiRoutes`
- **Services:** `SupabaseService`, `GeminiService`, `OpenAIService`, `MapService`
- **Repositories:** (ใช้ Prisma Client ตรงผ่าน Service)
- **Middlewares:** `requireAuth`, `requireAdmin`, `rateLimiter`, `errorHandler`
- **Validation:** `userSchema`, `vehicleSchema`, `tripSchema` (Zod)
- **Utils:** `jwtUtils`, `hashUtils`, `responseFormatter`
- **Config:** `env`, `cors`, `helmet`

## 6. Frontend Task Breakdown
*แบ่งตามโครงสร้างการพัฒนา*
- **Layouts:** `AuthLayout`, `MainAppLayout`
- **Pages:** `Login`, `Dashboard`, `Vehicles`, `Trips`, `Chat`, `Settings`
- **Components:** `Button`, `Input`, `Card`, `Modal`, `DataTable`, `ChatBubble`
- **Hooks:** `useAuth`, `useVehicle`, `useChat`, `useWebsocket`
- **Stores:** `authStore`, `appStore` (Zustand)
- **Utilities:** `apiClient` (Axios), `dateFormatter`
- **Charts:** `SOCChart`, `ExpenseChart`
- **Maps:** `TripRouteMap`
- **PWA:** `manifest.json`, `service-worker.ts`
- **Responsive:** Tailwind Mobile-first Implementation

## 7. Database Task Breakdown
- **Tables:** `users`, `vehicles`, `trips`, `charging_sessions`, `ai_memory`
- **Views:** `vw_monthly_charging_stats`
- **Indexes:** B-Tree (Foreign Keys), HNSW (`ai_memory.embedding`)
- **Policies:** RLS (Row Level Security) ขั้นต่ำ 15 Rules
- **Functions:** สคริปต์คำนวณระยะทาง
- **Triggers:** `on_auth_user_created`
- **Seed Data:** Fake Vehicles, Charging Stations
- **Migration:** Prisma Migrate Scripts

## 8. API Task Breakdown
- **REST APIs:** Develop > 20 Endpoints
- **Authentication:** Bearer JWT Security
- **Pagination:** Cursor-based / Offset-based logic
- **Validation:** Zod parsing before controller execution
- **Webhook:** Stripe Signature Validator, AI Callback Receiver
- **OpenAPI:** Swagger UI hosting on `/api-docs`

## 9. AI Task Breakdown
- **Gemini 3.1 Pro:** Setup Main System Instructions
- **OpenAI GPT-5.x:** Setup Alternative Engine Logic
- **Prompt Templates:** Trip Planner Prompts, EV Expert Prompts
- **Recommendation Engine:** Vector similarity search scoring
- **Conversation Memory:** DB-backed conversation arrays
- **RAG Preparation:** Embeddings processing pipeline
- **Fallback Logic:** Error trapping -> return static advice
- **Observability:** Token counting & logging

## 10. DevOps Task Breakdown
- **GitHub:** Branch Rules, PR Templates
- **Railway:** NodeJS Dockerfile, App Deployment
- **Vercel:** React App Deployment, Build Settings
- **Supabase:** Project Creation, Database URL config
- **Redis:** Upstash Redis Provisioning
- **CI/CD:** GitHub Actions (Lint, Test, Build)
- **Monitoring:** Sentry Error Tracking
- **Backup:** Scheduled Supabase Backups
- **Logging:** Request / Error Logging configuration
- **Secrets:** .env management across environments

## 11. Testing Breakdown
- **Unit:** Jest for Services & Utils
- **Integration:** Supertest for Express Routes
- **API:** Postman/Bruno Collections
- **Frontend:** React Testing Library for Components
- **Performance:** K6 Load Testing on AI Chat
- **Security:** NPM Audit, Snyk
- **UAT:** User Acceptance Criteria Checklist
- **Regression:** Pre-deployment CI checks

---

## 12. Task Dependency Matrix

| Task A (Prerequisite) | ➔ | Task B (Dependent) | ➔ | Task C (Final) |
|---|---|---|---|---|
| TASK-001: Setup Auth | ➔ | TASK-005: JWT Middleware | ➔ | TASK-010: Vehicle API |
| TASK-009: Vehicle DB | ➔ | TASK-010: Vehicle API | ➔ | TASK-012: Vehicle UI |
| TASK-022: AI DB | ➔ | TASK-023: RAG Pipeline | ➔ | TASK-024: Chat Controller |
| TASK-010: Vehicle API | ➔ | TASK-027: Dashboard API | ➔ | TASK-028: Dashboard UI |

---

## 13. Estimated Complexity

**Rating Scale:** 🟢 Easy | 🟡 Medium | 🔴 Hard | ⚫ Very Hard

| Module | Complexity | Est. Time | Risk Level | Priority |
|---|---|---|---|---|
| **Database Setup** | 🟢 Easy | 2 Days | Low | P0 (Highest) |
| **Authentication** | 🟡 Medium | 3 Days | Medium | P0 |
| **Vehicle API & UI** | 🟡 Medium | 4 Days | Low | P1 |
| **Dashboard & Charts** | 🟡 Medium | 3 Days | Low | P2 |
| **AI Integration & RAG** | 🔴 Hard | 7 Days | High | P1 |
| **Map & Trip Planning** | ⚫ Very Hard | 7 Days | High | P2 |
| **Webhooks & Queue** | 🔴 Hard | 4 Days | Medium | P2 |
| **Deployment & CI/CD** | 🟡 Medium | 2 Days | Low | P1 |

---

## 14. AI Assignment (Model Recommendations)

คำแนะนำสำหรับการใช้ AI Models รุ่นปัจจุบัน (Current-generation) ที่เหมาะสมกับแต่ละ Task เพื่อประสิทธิภาพสูงสุด:

- **System Architecture & DB Design** ➔ **Gemini 3.1 Pro** (Context Window กว้าง วิเคราะห์โครงสร้างโปรเจกต์ได้ทั้งหมด)
- **Backend (Express, Prisma, Type Logic)** ➔ **GPT-5.5 / GPT-5.6** (แม่นยำสูงด้านการเขียนโค้ด Backend Complex Logic)
- **Frontend UI & React Components** ➔ **Claude 3.5 Sonnet / Claude 3.x** (โดดเด่นด้านการเขียน Component UI แบบสวยงามและทันสมัย)
- **Security Review & Edge Cases** ➔ **Claude** (คิดรอบคอบ หาจุดโหว่ด้านความปลอดภัยได้ดี)
- **Bug Fix & Quick Regex** ➔ **GPT-5.x** (เร็วและแก้บั๊กได้ตรงจุด)
- **Documentation & Summarization** ➔ **Gemini 3.1 Pro** (สรุปเนื้อหา จัดรูปเล่มและร้อยเรียงคำได้เป็นธรรมชาติ)

---

## 15. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.0.0 | 2026-08-02 | Complete | Chief AI Systems Architect | สถาปนาเอกสาร AI Task Breakdown อย่างสมบูรณ์ เพื่อใช้เป็น Prompt Instruction Master สำหรับ AI Agent ในการเขียนโค้ด |
