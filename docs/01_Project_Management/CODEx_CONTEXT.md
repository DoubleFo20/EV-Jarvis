---
id: DOC-027
title: Codex Context
version: 1.2.0
last_updated: 2026-09-28
status: Approved
author: Codex
references:
  - docs/01_Project_Management/01_PROJECT_RULES.md
  - docs/01_Project_Management/AI_AGENT_RULES.md
  - docs/01_Project_Management/PROJECT_PROGRESS.md
  - docs/02_Requirements/03_PRD.md
  - docs/09_Implementation/01_IMPLEMENTATION_PLAN.md
---

# Codex Context — EV-JARVIS

> **Document ID:** DOC-027
> **Version:** 1.2.0
> **Status:** Approved
> **Project:** EV-JARVIS
> **Owner:** Project Owner
> **Last Updated:** 2026-09-28
> **Document Type:** AI Agent Working Context

---

# 1. Purpose

เอกสารนี้เป็นบริบทการทำงานสำหรับ Codex ในบทบาท Lead Software Engineer ของโครงการ EV-JARVIS ใช้กำหนดลำดับเอกสารอ้างอิง ขอบเขต MVP สถานะ Sprint และกฎก่อนเริ่มงานพัฒนา โดยไม่ใช้แทนเอกสาร Requirement, Architecture หรือ Implementation Plan ที่มีอยู่แล้ว

เอกสารนี้ห้ามใช้เพื่อเปลี่ยน Architecture, เพิ่ม Feature นอก Scope หรือแก้ไข Requirement ที่ได้รับอนุมัติแล้ว

---

# 2. Document Authority

ลำดับอำนาจสูงสุดในการทำงาน:

1. `01_PROJECT_RULES.md` — กฎสูงสุดของโครงการ
2. `AI_AGENT_RULES.md` — กฎการทำงานของ AI Agent
3. `02_PRODUCT_VISION.md` — ทิศทางและเป้าหมายผลิตภัณฑ์
4. `03_PRD.md` — Scope, Priority และ Release Scope
5. `04_SRS.md` และ `05_REQUIREMENTS.md` — ข้อกำหนดเชิงเทคนิคและ Acceptance Criteria
6. เอกสาร Architecture, Database และ API — รูปแบบระบบที่ห้ามเปลี่ยนโดยไม่ได้รับอนุมัติ
7. `01_IMPLEMENTATION_PLAN.md` — แผนการดำเนินงานและลำดับ Sprint
8. `PROJECT_PROGRESS.md` — รายงานสถานะที่เกิดขึ้นจริง ณ เวลาที่อัปเดตล่าสุด

หากเอกสารขัดแย้งกัน ต้องหยุดงานและถาม Project Owner ก่อนดำเนินการ ห้ามตีความเพื่อเปลี่ยน Scope หรือ Architecture เอง

---

# 3. Approved Source of Truth Decision

Project Owner อนุมัติเมื่อวันที่ 2026-08-05 ว่าไม่ใช้เอกสารเพียงไฟล์เดียวควบคุมทั้ง Scope และ Timeline เพราะเอกสารแต่ละชนิดมีหน้าที่ต่างกัน โดยกำหนดแหล่งอ้างอิงหลักดังนี้:

| Information | Single Source of Truth | Responsibility |
|---|---|---|
| Product และ MVP Scope | `docs/02_Requirements/03_PRD.md` | กำหนด Epic, Feature, Priority, MVP และสิ่งที่อยู่นอก Scope |
| Sprint Scope และ Execution Timeline | `docs/09_Implementation/01_IMPLEMENTATION_PLAN.md` | กำหนดลำดับ Sprint, Dependency และ Deliverable |
| Current Actual Status | `docs/01_Project_Management/PROJECT_PROGRESS.md` | รายงานสิ่งที่เสร็จแล้ว กำลังทำ และติด Blocker |

เมื่อข้อมูลไม่ตรงกัน:

- เรื่อง Scope ให้ยึด PRD
- เรื่อง Timeline ให้ยึด Implementation Plan
- เรื่องสถานะปัจจุบันให้ตรวจ Repository และ Verification Evidence ก่อน แล้วจึงเทียบกับ PROJECT_PROGRESS
- PROJECT_PROGRESS ไม่สามารถขยาย Scope หรือเปลี่ยน Architecture ได้

---

# 4. AI Assistant in MVP

Project Owner อนุมัติให้ AI Assistant แบบพื้นฐานอยู่ใน MVP Version 1 เพื่อรักษาจุดแตกต่างหลักของ EV-JARVIS แต่จำกัดขอบเขตเพื่อลดความเสี่ยงและให้ส่งมอบได้จริง

## 4.1 Version 1 — Included

- EV Q&A ภาษาไทยตาม `FEAT-026`
- คำตอบจากข้อมูลที่ผู้ใช้อนุญาตและมีสิทธิ์เข้าถึงเท่านั้น
- Provider Adapter และ Fallback แบบปลอดภัย
- Safety Guardrails, Disclaimer และ User Feedback ตาม `FEAT-028`
- Read-only Recommendations สำหรับแบตเตอรี่ การชาร์จ และการเดินทาง
- แสดงสถานะไม่มั่นใจหรือไม่ทราบแทนการเดาข้อมูล
- ห้าม AI ควบคุมรถหรือเขียนข้อมูลสำคัญโดยอัตโนมัติ

## 4.2 Version 2 — Deferred

- Predictive Maintenance ขั้นสูง
- Autonomous Workflow และ Direct Vehicle Control
- Multi-agent Orchestration เต็มรูปแบบ
- Advanced RAG และ Long-term Semantic Memory
- Smart Charging Automation
- Route Planning ขั้นสูงที่ตัดสินใจแทนผู้ใช้
- AI Insight ขั้นสูงที่ต้องอาศัย Telemetry ปริมาณมาก

แนวทางนี้สอดคล้องกับ PRD ที่กำหนด AI Q&A เป็นส่วนหนึ่งของ MVP และยังคงเจตนาของ Product Vision ที่วาง Advanced AI Integration ไว้ใน Version 2

---

# 5. Current Sprint

ตามคำสั่งของ Project Owner วันที่ 2026-08-05 สถานะการทำงานปัจจุบันคือ:

| Field | Value |
|---|---|
| Current Sprint | Sprint 1 — Foundation & Authentication |
| Status | Sprint 1 Closure Pending — GitHub CI verified; clean-tree disposition remains open |
| Previous Sprint | Sprint 0 — Backend Foundation |
| Development Rule | ทำเฉพาะ Sprint 1 closure remediation ที่ได้รับมอบหมาย; Android implementation ยังถูก gate จนกว่า Sprint 1 จะปิด |
| Architecture Rule | ห้ามออกแบบ Architecture ใหม่หรือเปลี่ยน Architecture เดิม |
| Documentation Rule | ห้ามแก้ไขเอกสารที่ Completed เว้นแต่ได้รับคำสั่งโดยตรง |

Sprint 1 ต้องดำเนินงานตาม Task ที่ Project Owner มอบหมายเท่านั้น ห้ามเริ่ม Feature ถัดไปเอง และห้ามขยาย Scope จากคำอธิบายใน Sprint

---

# 6. Sprint Verification Gate

ก่อน Commit ทุก Sprint ต้องมีหลักฐาน Verification ที่เกี่ยวข้องกับขอบเขตงานจริง:

1. Build สำเร็จ
2. Lint สำเร็จ
3. TypeScript ไม่มี Error
4. Test ที่เกี่ยวข้องสำเร็จ
5. Dev Server หรือ Runtime เริ่มทำงานได้
6. Endpoint หรือ User Flow ที่เปลี่ยนแปลงได้รับการตรวจสอบ
7. ไม่มี Critical Warning ที่ยังไม่ได้อธิบาย
8. ตรวจ Git Status และยืนยันว่าไม่มีไฟล์นอก Scope ถูกแก้ไข
9. รายงานคำสั่งที่รันและผลลัพธ์จริง

หาก Verification รายการใดล้มเหลว ห้าม Commit และห้ามรายงานว่า Sprint Complete ต้องแก้ Root Cause หรือหยุดถาม Project Owner เมื่อข้อมูลไม่เพียงพอ

## 6.1 Disjoint File Ownership Workflow

- ใช้ one-writer-per-file/path ไม่ใช่ one-writer ระดับทั้ง repository
- Subagents ทำงานพร้อมกันได้เฉพาะเมื่อ Task กำหนด disjoint file/path ownership ที่ไม่ทับซ้อนกันอย่างชัดเจน
- ไฟล์ shared หรือ path ที่ ownership ไม่ชัดเจนต้อง serialize; agent ต้องทำ receiver preflight และหยุดเมื่อพบ overlap/content conflict
- แต่ละ agent ต้องแก้และรายงานเฉพาะ path ที่ได้รับมอบหมาย; handoff ไม่ได้อนุมัติ Scope, Requirement หรือ Architecture ใหม่

---

# 7. Codex Working Rules

- อ่าน Sprint Task และเอกสารอ้างอิงที่เกี่ยวข้องก่อนแก้ไข
- ตรวจ Repository และ Convention ปัจจุบันก่อนเขียนโค้ด
- ทำการเปลี่ยนแปลงให้น้อยที่สุดแต่แก้ปัญหาได้ครบ
- ห้ามเพิ่ม Dependency หากไม่จำเป็น
- ห้ามแก้ Generated Files, Lockfiles, Environment Files หรือ CI Configuration เว้นแต่ Task กำหนด
- ห้ามเปิดเผย Secret หรือค่า Environment ที่เป็นความลับ
- ห้ามเปลี่ยน Database หรือสร้าง Migration โดยไม่ได้รับคำสั่ง
- ห้าม Commit หรือ Push ก่อนผ่าน Verification และได้รับคำสั่ง
- หาก Requirement, Acceptance Criteria, Credential, External Resource หรือ Business Rule ขาดหาย ต้องหยุดและถาม Project Owner

---

# 8. Ready State

Codex เข้าใจบริบทของ EV-JARVIS และพร้อมรับ Sprint 1 Task โดยจะไม่เริ่มงานเพิ่มเติมเองจนกว่าจะได้รับคำสั่งจาก Project Owner

---

# 9. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.2.0 | 2026-09-28 | Review | Codex | อัปเดต Sprint 1/GitHub CI current state และเพิ่ม disjoint file ownership workflow โดยคง Scope และ Architecture เดิม |
| 1.1.0 | 2026-08-05 | Approved | Project Owner / Codex | อนุมัติแหล่งอ้างอิงหลักสำหรับ Scope, Timeline และ Current Status พร้อมยืนยันขอบเขต AI Assistant ใน MVP Version 1 |
| 1.0.0 | 2026-08-05 | Draft | Codex | สร้างบริบทการทำงาน กำหนดแหล่งอ้างอิง Scope และ Timeline แนะนำขอบเขต AI สำหรับ MVP และบันทึกความพร้อมสำหรับ Sprint 1 |
