---
id: DOC-026
title: Technical Debt Register
version: 1.0.0
last_updated: 2026-08-02
status: Complete
author: Principal Software Architect
references:
  - docs/01_Project_Management/PROJECT_PROGRESS.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
  - docs/09_Implementation/02_MVP_CHECKLIST.md
  - docs/09_Implementation/03_AI_TASK_BREAKDOWN.md
---

# Technical Debt Register — EV-JARVIS

> **Document ID:** DOC-026
> **Version:** 1.0.0
> **Status:** Complete
> **Project:** EV-JARVIS
> **Owner:** Principal Software Architect
> **Last Updated:** 2026-08-02

---

## 1. Purpose
เอกสารฉบับนี้ใช้สำหรับบันทึก **หนี้ทางเทคนิค (Technical Debt)** ที่เกิดขึ้นจาก "การตัดสินใจหรือประนีประนอมเชิงระบบอย่างตั้งใจ" ในระหว่างการพัฒนาเวอร์ชัน MVP เพื่อให้สามารถส่งมอบผลิตภัณฑ์ออกสู่ตลาดได้ทันเวลา เอกสารนี้จะไม่ได้บันทึก "ฟีเจอร์ที่อยากทำ" แต่จะบันทึกข้อจำกัดทางสถาปัตยกรรมและโค้ดที่จำเป็นต้องได้รับการ Refactor ในอนาคต

---

## 2. Current Technical Debt

### 2.1 Architecture & Backend
| Description | Reason for Compromise | Priority | Planned Resolution | Target Version |
|---|---|---|---|---|
| **Monolithic Repository** | เพื่อให้ AI Agent พัฒนาและ Deploy ได้รวดเร็วในรอบแรก | 🟡 Medium | ย้ายบางระบบหนักไปเป็น Microservices | v2.0 |
| **No Real-time Kafka** | ลดความซับซ้อนของการตั้งค่า Event Streaming | 🟡 Medium | หากปริมาณ Telemetry ทะลุ 10M rows/เดือน ให้เปลี่ยนจาก Express Queue ไปใช้ Kafka/Kinesis | v1.5 |

### 2.2 Frontend
| Description | Reason for Compromise | Priority | Planned Resolution | Target Version |
|---|---|---|---|---|
| **Basic Local Caching** | PWA เซ็ตอัปพื้นฐานไม่ได้ใช้ IndexedDB เก็บข้อมูลรถลึก ๆ | 🟡 Medium | ย้ายระบบ State หนัก ๆ ไปเก็บลง IndexedDB ด้วย RxDB/Dexie | v1.1 |
| **Tailwind Heavy Inline** | รีบพัฒนา UI โดยไม่ได้ทำ Component Abstraction 100% | 🟢 Low | รวบรวมคลาสเดิมไปผูกกับ UI Component Library (เช่น Shadcn) | v1.1 |

### 2.3 Database
| Description | Reason for Compromise | Priority | Planned Resolution | Target Version |
|---|---|---|---|---|
| **No Table Partitioning** | ข้อมูลในช่วง 6 เดือนแรกยังไม่ใหญ่ถึงขีดจำกัดของ Postgres | 🔴 High | สร้าง Range Partitioning (รายเดือน) ให้ตาราง `telemetry` และ `charging_sessions` | v1.5 |
| **Simple Vector Indexing** | HNSW พื้นฐานบน `pgvector` ไม่มีการจูน Hyperparameters | 🟢 Low | ปรับค่า m และ ef_construction ตามขนาดของ `ai_memory` | v1.1 |

### 2.4 AI & DevOps
| Description | Reason for Compromise | Priority | Planned Resolution | Target Version |
|---|---|---|---|---|
| **Hardcoded Prompts** | System Prompt บางตัวฝังใน Code ของ Express แทน Database | 🟡 Medium | ย้าย Prompt ทั้งหมดไปเก็บและเวอร์ชันใน Database (Prompt Library) | v1.1 |
| **Basic Observability** | ใช้แค่ Logging พื้นฐาน ไม่ได้ติด LangSmith / Vercel AI SDK เต็มระบบ | 🔴 High | ติดตั้งระบบ Analytics ติดตาม Cost ของ Token ที่ใช้แบบรายผู้ใช้ | v1.2 |

---

## 3. Deferred Features
รายการเหล่านี้คือความต้องการที่ถูกตัดออก หรือ **เลื่อนออกไป** หลังเฟส MVP โดยตั้งใจ:

- **Offline AI Assistant:** เลื่อนออกไปเพื่อรอจังหวะที่ Local LLM บนมือถือมีขนาดเล็กลงและสมบูรณ์
- **Predictive Maintenance:** ต้องการเก็บ Data อย่างน้อย 6-12 เดือนเพื่อเทรนโมเดลเฉพาะบุคคล
- **Fleet Management:** เลื่อนออกไปเนื่องจากต้องปรับปรุงโครงสร้าง DB จาก B2C เป็น B2B
- **Mobile Application (Native):** เลื่อนไปใช้ React Native/Expo หลัง PWA เปิดตัว
- **Advanced Analytics & Export:** ยังไม่จำเป็นสำหรับกลุ่มผู้ใช้ทั่วไปในช่วงเริ่มต้น

---

## 4. Refactoring Plan

การจัดการหนี้ทางเทคนิคจะถูกนำไปรวมในไทม์ไลน์หลัง MVP:

```mermaid
flowchart LR
    MVP[Version 1.0 (MVP) <br> Launch & Stabilization] --> V11[Version 1.1 <br> Code Cleanup & IndexedDB]
    V11 --> V15[Version 1.5 <br> DB Partitioning & Metrics]
    V15 --> V20[Version 2.0 <br> Microservices & Native Apps]
```

---

## 5. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.0.0 | 2026-08-02 | Complete | Principal Software Architect | จัดทำ Technical Debt Register บันทึกข้อจำกัดที่ยอมรับได้ในเฟส MVP และแนวทางแก้ไขในอนาคต |
