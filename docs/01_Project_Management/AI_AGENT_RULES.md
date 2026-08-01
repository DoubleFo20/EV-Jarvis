# EV-JARVIS AI Agent Rules

> **Document ID:** DOC-001-A
> **Version:** 1.0.0
> **Status:** Draft
> **Project:** EV-JARVIS
> **Owner:** Project Manager
> **Last Updated:** 2026-08-02
> **Reference Document:** docs/01_Project_Management/01_PROJECT_RULES.md (DOC-001)
> **Document Type:** AI Agent Governance Policy

---

# Document Dependency

เอกสารนี้อ้างอิงและขยายจาก PROJECT_RULES (DOC-001)

กฎทุกข้อในเอกสารนี้ต้องสอดคล้องกับ PROJECT_RULES

หากเกิดข้อขัดแย้ง ให้ยึด PROJECT_RULES เป็นหลัก

```
PROJECT_RULES (DOC-001)
    ↓
AI_AGENT_RULES (DOC-001-A)  ← เอกสารนี้
    ↓
PRODUCT_VISION (DOC-002)
    ↓
PRD (DOC-003)
    ↓
SRS (DOC-004)
    ↓
REQUIREMENTS (DOC-005)
    ↓
ARCHITECTURE (DOC-006)
    ↓
DATABASE (DOC-007)
    ↓
API (DOC-008)
```

---

# Table of Contents

1. Purpose
2. Scope
3. AI Agent Roles
4. Repository Governance
5. Documentation Standards
6. Output Policy
7. Prompt Rules
8. Repository Rules
9. File Rules
10. Naming Convention
11. Document Template
12. Cross-Reference Rules
13. Conflict Resolution
14. Quality Checklist
15. Review Checklist
16. Violation Policy
17. Revision History

---

# 1. Purpose

เอกสารนี้กำหนดกฎและขอบเขตการทำงานของ AI Agent ทุกตัวที่เข้าร่วมในโปรเจกต์ EV-JARVIS

เป้าหมายคือ

- ป้องกันการเปลี่ยนแปลงที่ไม่ได้รับอนุมัติ
- รักษาความสอดคล้องของเอกสารทั้งหมด
- กำหนดขอบเขตความรับผิดชอบของ AI แต่ละตัว
- สร้างมาตรฐานคุณภาพที่วัดได้
- ป้องกัน scope creep และ hallucination

---

# 2. Scope

เอกสารนี้ครอบคลุม AI Agent ทุกตัวที่ทำงานกับ repository EV-JARVIS

รวมถึง

- ChatGPT ในบทบาท Project Manager
- Claude ในบทบาท Developer
- Gemini ในบทบาท QA และ Optimizer
- AI Agent อื่น ๆ ที่อาจเพิ่มในอนาคต

ขอบเขตการบังคับใช้

- ทุก commit ที่มาจาก AI
- ทุกเอกสารที่ AI สร้างหรือแก้ไข
- ทุก code ที่ AI เขียนหรือ refactor
- ทุก review ที่ AI ดำเนินการ

---

# 3. AI Agent Roles

## 3.1 Role Definition

| Role ID | AI Agent | Primary Role | Secondary Role |
|---------|----------|-------------|----------------|
| AI-ROLE-001 | ChatGPT | Project Manager | Documentation Architect |
| AI-ROLE-002 | Claude | Feature Developer | Business Logic Engineer |
| AI-ROLE-003 | Gemini | QA Engineer | Performance Optimizer |

## 3.2 ChatGPT — Project Manager

ความรับผิดชอบหลัก

- วางแผนโปรเจกต์และ sprint planning
- เขียนและดูแลเอกสารระดับ project
- ออกแบบ architecture และ system design
- ทำ document review และ approval
- กำหนด requirement priority และ scope

สิ่งที่อนุญาต

- สร้างและแก้ไขเอกสาร Markdown ใน docs/
- กำหนด architecture decision
- เขียน PRD, SRS, Requirements, Architecture
- ทำ cross-document validation

สิ่งที่ห้าม

- เขียน production code โดยตรง
- แก้ไข source code ใน src/
- เปลี่ยน database schema โดยไม่ผ่าน document review
- ลบหรือเปลี่ยน requirement ที่ได้รับอนุมัติแล้ว

## 3.3 Claude — Feature Developer

ความรับผิดชอบหลัก

- พัฒนา feature ตาม requirement
- เขียน business logic
- Refactor code ตามมาตรฐาน
- แก้ bug ที่ได้รับมอบหมาย

สิ่งที่อนุญาต

- เขียนและแก้ไข code ใน src/
- สร้าง component และ service
- เขียน unit test สำหรับ code ที่ตนเองพัฒนา
- เพิ่ม inline comment ใน code

สิ่งที่ห้าม

- เปลี่ยน architecture โดยไม่ได้รับอนุมัติ
- เพิ่ม feature นอก scope ที่กำหนด
- แก้ไขเอกสาร requirement โดยตรง
- ลบ test ที่มีอยู่โดยไม่มีเหตุผล
- เดา requirement ที่ไม่ชัดเจน

## 3.4 Gemini — QA Engineer

ความรับผิดชอบหลัก

- ทดสอบ feature ที่พัฒนาเสร็จ
- Debug ปัญหาที่พบ
- Optimize performance
- Review เอกสารด้าน technical accuracy

สิ่งที่อนุญาต

- เขียน test case และ test script
- รัน test suite และรายงานผล
- แก้ไข code เฉพาะ bug fix
- เพิ่ม performance optimization

สิ่งที่ห้าม

- เพิ่ม feature ใหม่
- เปลี่ยน business logic โดยไม่ได้รับอนุมัติ
- แก้ไข requirement document
- ลบ feature ที่ทำงานอยู่

## 3.5 Role Boundary Matrix

| Action | ChatGPT | Claude | Gemini |
|--------|---------|--------|--------|
| สร้างเอกสาร Requirement | ✅ | ❌ | ❌ |
| แก้ไขเอกสาร Architecture | ✅ | ❌ | ❌ |
| เขียน Production Code | ❌ | ✅ | ❌ |
| เขียน Business Logic | ❌ | ✅ | ❌ |
| เขียน Test Case | ❌ | ✅ | ✅ |
| แก้ Bug | ❌ | ✅ | ✅ |
| Refactor Code | ❌ | ✅ | ✅ |
| Performance Optimization | ❌ | ❌ | ✅ |
| Document Review | ✅ | ❌ | ✅ |
| Architecture Review | ✅ | ❌ | ❌ |
| Sprint Planning | ✅ | ❌ | ❌ |
| เพิ่ม Feature ใหม่ | ✅ | ❌ | ❌ |
| เปลี่ยน Scope | ✅ | ❌ | ❌ |

---

# 4. Repository Governance

## 4.1 Repository Structure

AI ทุกตัวต้องเคารพโครงสร้าง repository ที่กำหนดไว้

```
EV-JARVIS/
├── docs/
│   ├── 01_Project_Management/
│   │   ├── 01_PROJECT_RULES.md
│   │   └── AI_AGENT_RULES.md
│   ├── 02_Requirements/
│   │   ├── 02_PRODUCT_VISION.md
│   │   ├── 03_PRD.md
│   │   ├── 04_SRS.md
│   │   └── 05_REQUIREMENTS.md
│   ├── 03_Architecture/
│   ├── 04_Development/
│   ├── 05_Testing/
│   ├── 06_Deployment/
│   └── assets/
├── src/
│   ├── backend/
│   ├── frontend/
│   ├── database/
│   └── api/
├── tests/
├── scripts/
├── assets/
└── deployment/
```

## 4.2 Folder Ownership

| Folder | Primary Owner | Allowed Agents |
|--------|--------------|----------------|
| docs/01_Project_Management/ | ChatGPT | ChatGPT |
| docs/02_Requirements/ | ChatGPT | ChatGPT |
| docs/03_Architecture/ | ChatGPT | ChatGPT, Gemini (review only) |
| docs/04_Development/ | Claude | Claude, ChatGPT (review only) |
| docs/05_Testing/ | Gemini | Gemini |
| docs/06_Deployment/ | Gemini | Gemini, ChatGPT (review only) |
| src/backend/ | Claude | Claude |
| src/frontend/ | Claude | Claude |
| src/database/ | Claude | Claude |
| src/api/ | Claude | Claude |
| tests/ | Gemini | Gemini, Claude |

## 4.3 Governance Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| GOV-001 | No Cross-Boundary Edit | ห้าม AI แก้ไขไฟล์ที่อยู่นอกขอบเขตของตน |
| GOV-002 | Document Before Code | ต้องมีเอกสาร requirement ก่อนเริ่มเขียน code |
| GOV-003 | Review Before Merge | ทุกการเปลี่ยนแปลงต้องผ่าน review ก่อน merge |
| GOV-004 | Audit Trail Required | ทุกการเปลี่ยนแปลงต้องมี reason และ impact |
| GOV-005 | Scope Lock Enforcement | Requirement ที่ approved แล้วห้ามเปลี่ยนโดยไม่ผ่าน change control |

---

# 5. Documentation Standards

## 5.1 Document Metadata

ทุกเอกสารที่ AI สร้างต้องมี metadata ดังนี้

```markdown
> **Document ID:** DOC-XXX
> **Version:** X.X.X
> **Status:** Draft | Review | Approved | Deprecated
> **Project:** EV-JARVIS
> **Owner:** [Role Name]
> **Last Updated:** YYYY-MM-DD
> **Reference Document:** [path to parent document]
```

## 5.2 Document ID Convention

| Document | Document ID |
|----------|-------------|
| PROJECT_RULES | DOC-001 |
| AI_AGENT_RULES | DOC-001-A |
| PRODUCT_VISION | DOC-002 |
| PRD | DOC-003 |
| SRS | DOC-004 |
| REQUIREMENTS | DOC-005 |
| ARCHITECTURE | DOC-006 |
| DATABASE | DOC-007 |
| API | DOC-008 |

## 5.3 Version Convention

| Component | Format | ตัวอย่าง |
|-----------|--------|----------|
| Major | เปลี่ยน scope หรือ structure หลัก | 2.0.0 |
| Minor | เพิ่มเนื้อหาหรือ section ใหม่ | 1.1.0 |
| Patch | แก้ไขเล็กน้อย typo หรือ clarification | 1.0.1 |

## 5.4 Status Lifecycle

```
Draft → Review → Approved → Deprecated
```

| Status | คำอธิบาย |
|--------|----------|
| Draft | กำลังเขียนหรือแก้ไข ยังไม่พร้อม review |
| Review | พร้อมให้ review สามารถมี comment ได้ |
| Approved | ผ่านการ review และอนุมัติแล้ว |
| Deprecated | ถูกแทนที่ด้วยเอกสารเวอร์ชันใหม่ |

## 5.5 Language Policy

| Element | Language | ตัวอย่าง |
|---------|----------|----------|
| Section Title | English | # Authentication Module |
| คำอธิบาย | Thai | ระบบต้องรองรับการเข้าสู่ระบบ |
| Technical Term | English | JWT, API Gateway, SOC |
| Table Header | English | Priority, Status, Risk |
| Table Content | Thai + English | P0, ต้องทำใน MVP |
| Requirement ID | English | FR-001, NFR-001 |
| Code Example | English | camelCase, PascalCase |
| Error Message | Thai + English | 409 EMAIL_ALREADY_EXISTS |

## 5.6 Markdown Formatting Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| MD-001 | ใช้ heading hierarchy ที่ถูกต้อง | H1 สำหรับชื่อเอกสาร, H2 สำหรับ section หลัก, H3 สำหรับ subsection |
| MD-002 | ใช้ table สำหรับข้อมูลเชิงเปรียบเทียบ | ห้ามใช้ bullet list แทน table เมื่อมีข้อมูลหลายมิติ |
| MD-003 | ใช้ code block สำหรับ technical content | ระบุ language identifier เสมอ |
| MD-004 | ใช้ horizontal rule คั่น section | ใช้ `---` ระหว่าง section หลัก |
| MD-005 | ห้ามใช้ HTML ใน Markdown | ยกเว้น mermaid diagram ที่จำเป็น |
| MD-006 | ทุก table ต้องมี header row | ห้ามสร้าง table ที่ไม่มี header |
| MD-007 | Mermaid diagram ต้อง quote label ที่มีอักขระพิเศษ | ใช้ `id["Label (Info)"]` |

---

# 6. Output Policy

## 6.1 Allowed Output

| Output Type | Extension | Allowed | คำอธิบาย |
|-------------|-----------|---------|----------|
| Markdown Document | .md | ✅ | เอกสารหลักและ deliverable |
| Source Code | .js, .ts, .jsx, .tsx | ✅ | เฉพาะ Claude ใน src/ |
| Style Sheet | .css, .scss | ✅ | เฉพาะ Claude ใน src/ |
| Configuration | .json, .yaml, .env.example | ✅ | ตามความจำเป็น |
| SQL Migration | .sql | ✅ | เฉพาะ Claude ใน src/database/ |
| Test File | .test.js, .test.ts, .spec.js, .spec.ts | ✅ | เฉพาะ Claude และ Gemini ใน tests/ |

## 6.2 Forbidden Output

| Output Type | Extension | Forbidden | เหตุผล |
|-------------|-----------|-----------|--------|
| PowerShell Script | .ps1 | ❌ | ห้ามสร้าง helper script |
| Python Script | .py | ❌ | ห้ามสร้าง generator |
| Bash Script | .sh | ❌ | ห้ามสร้าง automation script |
| Batch File | .bat | ❌ | ห้ามสร้าง helper script |
| Command File | .cmd | ❌ | ห้ามสร้าง helper script |
| Temporary File | .tmp, .temp | ❌ | ห้ามสร้างไฟล์ชั่วคราว |
| Log File | .log | ❌ | ห้ามสร้างไฟล์ log ใน repository |
| Compiled File | .exe, .dll, .o | ❌ | ห้ามเก็บ binary ใน repository |

## 6.3 Output Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| OUT-001 | No Helper Scripts | ห้ามสร้าง script ช่วยสร้างเอกสาร |
| OUT-002 | No Document Generators | ห้ามสร้าง script ที่ generate เอกสาร |
| OUT-003 | No Code Solvers | ห้ามแก้ปัญหาเอกสารด้วย code |
| OUT-004 | Direct Write Only | ต้องเขียนเนื้อหาลงไฟล์ Markdown โดยตรง |
| OUT-005 | Final Deliverable | ไฟล์ Markdown ที่เขียนคือ deliverable สุดท้าย |
| OUT-006 | No Intermediate Files | ห้ามสร้างไฟล์กลางทางระหว่าง process |
| OUT-007 | No Temp Directory Usage | ห้ามใช้ temp directory สำหรับงานเอกสาร |

---

# 7. Prompt Rules

## 7.1 Mandatory Reference

AI ทุกตัวต้องอ้างอิงเอกสารต่อไปนี้ก่อนเริ่มทำงาน

| Priority | Document | เมื่อไรต้องอ้างอิง |
|----------|----------|-------------------|
| 1 | PROJECT_RULES (DOC-001) | ทุกครั้งที่เริ่มงาน |
| 2 | AI_AGENT_RULES (DOC-001-A) | ทุกครั้งที่เริ่มงาน |
| 3 | PRODUCT_VISION (DOC-002) | เมื่อทำงานเกี่ยวกับ scope หรือ direction |
| 4 | PRD (DOC-003) | เมื่อทำงานเกี่ยวกับ feature หรือ requirement |
| 5 | SRS (DOC-004) | เมื่อทำงานเกี่ยวกับ technical specification |
| 6 | REQUIREMENTS (DOC-005) | เมื่อทำงานเกี่ยวกับ detailed requirements |
| 7 | ARCHITECTURE (DOC-006) | เมื่อทำงานเกี่ยวกับ system design |
| 8 | DATABASE (DOC-007) | เมื่อทำงานเกี่ยวกับ data model |
| 9 | API (DOC-008) | เมื่อทำงานเกี่ยวกับ API specification |

## 7.2 Prompt Behavior Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| PROMPT-001 | No Guessing Requirements | ห้ามเดา requirement ที่ไม่มีในเอกสาร |
| PROMPT-002 | No Architecture Changes | ห้ามเปลี่ยน architecture โดยไม่ได้รับอนุมัติ |
| PROMPT-003 | No Feature Addition | ห้ามเพิ่ม feature ที่ไม่มีใน PRD |
| PROMPT-004 | Stop and Ask | หากพบ requirement ไม่ชัดเจน ให้หยุดและสอบถาม |
| PROMPT-005 | No Scope Creep | ห้ามขยาย scope เกินที่กำหนดใน sprint ปัจจุบัน |
| PROMPT-006 | No Assumption Making | ห้ามตั้งสมมติฐานเกี่ยวกับ business logic โดยไม่อ้างอิงเอกสาร |
| PROMPT-007 | Cite Source | ต้องอ้างอิง Document ID หรือ Requirement ID เมื่อตัดสินใจ |
| PROMPT-008 | No Hallucination | ห้ามสร้างข้อมูลที่ไม่มีอยู่ในเอกสารหรือ context |
| PROMPT-009 | Consistent Terminology | ใช้ technical term เดียวกับที่กำหนดใน Glossary ของ PRD |
| PROMPT-010 | Incremental Changes | ทำการเปลี่ยนแปลงทีละขั้นตอน ไม่เปลี่ยนหลายระบบพร้อมกัน |

## 7.3 Prompt Context Chain

เมื่อ AI ได้รับ prompt ใหม่ ต้องดำเนินการตามลำดับนี้

```
1. ตรวจ scope ว่าอยู่ใน role ของตนหรือไม่
    ↓
2. ตรวจว่า requirement มีอยู่ในเอกสารหรือไม่
    ↓
3. ตรวจว่ามี dependency document ที่ต้องอ้างอิงหรือไม่
    ↓
4. ตรวจว่าการเปลี่ยนแปลงกระทบเอกสารอื่นหรือไม่
    ↓
5. ดำเนินการตาม instruction
    ↓
6. ตรวจผลลัพธ์กับ Quality Checklist
```

## 7.4 Forbidden Prompt Patterns

| Pattern | ตัวอย่าง | เหตุผลที่ห้าม |
|---------|----------|--------------|
| Guessing Implementation | "น่าจะใช้ Redis สำหรับ cache" | ต้องอ้างอิง Architecture Document |
| Adding Unscoped Feature | "เพิ่ม social login ด้วย" | ไม่มีใน PRD scope |
| Changing Approved Spec | "เปลี่ยน JWT เป็น session-based" | ต้องผ่าน change control |
| Skipping Dependency | "เขียน API เลยไม่ต้องรอ SRS" | ต้อง follow document dependency chain |
| Cross-Role Action | "Claude เขียน architecture document" | ไม่ใช่ role ของ Claude |

---

# 8. Repository Rules

## 8.1 File Creation Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| REPO-001 | ห้ามสร้างไฟล์นอกโครงสร้างที่กำหนด | ทุกไฟล์ต้องอยู่ใน folder ที่ระบุไว้ |
| REPO-002 | ห้ามสร้าง folder ใหม่โดยไม่ได้รับอนุมัติ | โครงสร้าง folder ต้องผ่าน review |
| REPO-003 | ห้ามลบไฟล์ที่มี status Approved | ต้องเปลี่ยนเป็น Deprecated ก่อน |
| REPO-004 | ทุกไฟล์ต้องมี purpose ที่ชัดเจน | ห้ามสร้างไฟล์ว่างหรือ placeholder โดยไม่มีเหตุผล |
| REPO-005 | ห้ามเก็บ secret ใน repository | API key, password, token ต้องอยู่ใน .env เท่านั้น |

## 8.2 File Modification Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| REPO-006 | ต้องอัปเดต version เมื่อแก้ไขเอกสาร | ทุกการแก้ไขต้องเพิ่ม version number |
| REPO-007 | ต้องอัปเดต Last Updated date | ใช้ format YYYY-MM-DD |
| REPO-008 | ต้องเพิ่ม entry ใน Revision History | ระบุ version, date, description |
| REPO-009 | ห้ามลบ comment หรือ docstring ที่ไม่เกี่ยวข้อง | รักษา documentation integrity |
| REPO-010 | ห้ามแก้ไข Revision History ย้อนหลัง | history ที่บันทึกแล้วห้ามเปลี่ยน |

## 8.3 Commit Message Rules

| Component | Format | ตัวอย่าง |
|-----------|--------|----------|
| Type | feat, fix, docs, refactor, test, chore | docs |
| Scope | module หรือ document name | AI_AGENT_RULES |
| Description | สรุปสิ่งที่ทำเป็นภาษาอังกฤษ | add output policy section |

Format

```
type(scope): description

docs(AI_AGENT_RULES): add output policy section
feat(auth): implement login endpoint
fix(dashboard): correct battery level calculation
test(charging): add unit test for cost calculation
```

---

# 9. File Rules

## 9.1 Document File Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| FILE-001 | ใช้ .md extension สำหรับเอกสารทั้งหมด | ไม่ใช้ .txt, .doc, .pdf |
| FILE-002 | ใช้ UPPER_CASE สำหรับชื่อเอกสารหลัก | 01_PROJECT_RULES.md |
| FILE-003 | ใช้ number prefix สำหรับเอกสารที่มีลำดับ | 01_, 02_, 03_ |
| FILE-004 | ใช้ underscore คั่นคำ | AI_AGENT_RULES.md |
| FILE-005 | ห้ามใช้ space ในชื่อไฟล์ | ใช้ underscore แทน |
| FILE-006 | ใช้ UTF-8 encoding | รองรับภาษาไทย |
| FILE-007 | ใช้ LF line ending | ไม่ใช้ CRLF สำหรับ cross-platform |

## 9.2 Source Code File Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| FILE-008 | ใช้ kebab-case สำหรับชื่อไฟล์ | user-service.js |
| FILE-009 | ใช้ PascalCase สำหรับ component file | DashboardCard.jsx |
| FILE-010 | ใช้ .test.js หรือ .spec.js สำหรับ test file | user-service.test.js |
| FILE-011 | ใช้ index file สำหรับ module export | index.js |
| FILE-012 | จำกัดขนาดไฟล์ไม่เกิน 500 บรรทัด | แยกไฟล์เมื่อเกินขนาด |

## 9.3 File Location Rules

| File Type | Allowed Location | ห้ามอยู่ |
|-----------|-----------------|----------|
| Project Document | docs/01_Project_Management/ | src/, tests/ |
| Requirement Document | docs/02_Requirements/ | src/, tests/ |
| Architecture Document | docs/03_Architecture/ | src/, tests/ |
| Development Guide | docs/04_Development/ | docs/01_*, docs/02_* |
| Test Document | docs/05_Testing/ | src/ |
| Backend Code | src/backend/ | docs/, tests/ |
| Frontend Code | src/frontend/ | docs/, tests/ |
| Database Migration | src/database/ | docs/, src/backend/ |
| API Definition | src/api/ | docs/, src/frontend/ |
| Test Code | tests/ | src/, docs/ |

---

# 10. Naming Convention

## 10.1 Requirement ID Format

| Prefix | Format | ตัวอย่าง | ใช้เมื่อ |
|--------|--------|----------|---------|
| FR | FR-XXX | FR-001 | Functional Requirement |
| NFR | NFR-XXX | NFR-001 | Non-functional Requirement |
| UI | UI-XXX | UI-001 | Interface Requirement |
| API | API-XXX | API-001 | API Requirement |
| DB | DB-XXX | DB-001 | Database Requirement |
| SEC | SEC-XXX | SEC-001 | Security Requirement |
| PERF | PERF-XXX | PERF-001 | Performance Requirement |
| LOG | LOG-XXX | LOG-001 | Logging Requirement |
| VAL | VAL-XXX | VAL-001 | Validation Requirement |
| ERR | ERR-XXX | ERR-001 | Error Handling Requirement |
| STATE | STATE-XXX | STATE-001 | State Transition Requirement |
| TEST | TEST-XXX | TEST-001 | Test Requirement |
| BR | BR-XXX | BR-001 | Business Rule |
| CON | CON-XXX | CON-001 | Constraint |

## 10.2 Epic, Feature, User Story ID Format

| Type | Format | ตัวอย่าง |
|------|--------|----------|
| Epic | EPIC-XXX | EPIC-001 |
| Feature | FEAT-XXX | FEAT-001 |
| User Story | US-XXX | US-001 |

## 10.3 Code Naming Convention

ตาม PROJECT_RULES (DOC-001) Section 9

| Element | Convention | ตัวอย่าง |
|---------|-----------|----------|
| Variable | camelCase | batteryLevel |
| Function | camelCase | calculateRange |
| Class | PascalCase | ChargingSession |
| Constant | UPPER_CASE | MAX_BATTERY_CAPACITY |
| File | kebab-case | charging-service.js |
| Component | PascalCase | BatteryCard.jsx |
| Database Table | snake_case | charging_sessions |
| Database Column | snake_case | created_at |
| API Endpoint | kebab-case | /api/v1/charging-sessions |
| Environment Variable | UPPER_CASE | DATABASE_URL |

---

# 11. Document Template

## 11.1 Standard Document Template

ทุกเอกสารใหม่ต้องใช้โครงสร้างนี้

```markdown
# [Document Title]

> **Document ID:** DOC-XXX
> **Version:** 1.0.0
> **Status:** Draft
> **Project:** EV-JARVIS
> **Owner:** [Role]
> **Last Updated:** YYYY-MM-DD
> **Reference Document:** [path to parent document]

---

# Table of Contents

[numbered list of sections]

---

# 1. [First Section]

[content]

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial [Document Name] |
```

## 11.2 Required Sections

ทุกเอกสารต้องมี section ดังนี้เป็นอย่างน้อย

| Section | Required | คำอธิบาย |
|---------|----------|----------|
| Document Metadata | ✅ | Header พร้อม ID, version, status |
| Table of Contents | ✅ | สารบัญเนื้อหาทั้งหมด |
| Main Content | ✅ | เนื้อหาหลักของเอกสาร |
| Revision History | ✅ | ประวัติการเปลี่ยนแปลง |
| Document Dependency | ✅ | อ้างอิงเอกสารก่อนหน้า |

---

# 12. Cross-Reference Rules

## 12.1 Dependency Chain

ทุกเอกสารต้องอ้างอิงเอกสารก่อนหน้าใน dependency chain

| Document | Must Reference |
|----------|---------------|
| AI_AGENT_RULES | PROJECT_RULES |
| PRODUCT_VISION | PROJECT_RULES, AI_AGENT_RULES |
| PRD | PRODUCT_VISION |
| SRS | PRD |
| REQUIREMENTS | SRS |
| ARCHITECTURE | REQUIREMENTS |
| DATABASE | ARCHITECTURE |
| API | ARCHITECTURE, DATABASE |

## 12.2 Cross-Reference Format

เมื่ออ้างอิงเอกสารอื่น ใช้ format นี้

```markdown
ตาม PRD (DOC-003) Section [section name]
อ้างอิง SRS (DOC-004) Requirement [requirement ID]
สอดคล้องกับ PROJECT_RULES (DOC-001) Section [section number]
```

## 12.3 Traceability Rules

| Rule ID | Rule | คำอธิบาย |
|---------|------|----------|
| TRACE-001 | ทุก feature ต้อง trace กลับไปที่ PRD | ห้ามมี feature ที่ไม่มีใน PRD |
| TRACE-002 | ทุก requirement ต้อง trace กลับไปที่ SRS | ห้ามมี requirement ที่ไม่มีใน SRS |
| TRACE-003 | ทุก API ต้อง trace กลับไปที่ requirement | ห้ามมี API ที่ไม่มี requirement รองรับ |
| TRACE-004 | ทุก database table ต้อง trace กลับไปที่ requirement | ห้ามมี table ที่ไม่มี requirement รองรับ |
| TRACE-005 | ทุก test ต้อง trace กลับไปที่ requirement | ห้ามมี test ที่ไม่มี requirement รองรับ |

---

# 13. Conflict Resolution

## 13.1 Document Priority

เมื่อเกิดข้อขัดแย้งระหว่างเอกสาร ให้ใช้ลำดับความสำคัญนี้

```
1. PROJECT_RULES (สูงสุด)
2. AI_AGENT_RULES
3. PRODUCT_VISION
4. PRD
5. SRS
6. REQUIREMENTS
7. ARCHITECTURE
8. DATABASE
9. API (ต่ำสุด)
```

## 13.2 Conflict Handling Process

```
1. ระบุข้อขัดแย้งพร้อม reference ทั้งสองฝ่าย
    ↓
2. ตรวจลำดับความสำคัญของเอกสาร
    ↓
3. ยึดเอกสารที่มีลำดับสูงกว่า
    ↓
4. อัปเดตเอกสารที่มีลำดับต่ำกว่าให้สอดคล้อง
    ↓
5. บันทึกการแก้ไขใน Revision History
```

## 13.3 Escalation

หาก AI ไม่สามารถตัดสินข้อขัดแย้งได้

- หยุดการทำงาน
- รายงานข้อขัดแย้งพร้อม reference
- รอการตัดสินจาก Project Manager หรือ Owner

---

# 14. Quality Checklist

## 14.1 Document Quality Checklist

AI ต้องตรวจทุกข้อก่อนส่งมอบเอกสาร

| Check ID | Checkpoint | ผ่าน/ไม่ผ่าน |
|----------|-----------|--------------|
| QC-001 | มี Document Metadata ครบถ้วน | ☐ |
| QC-002 | Document ID ถูกต้องตาม convention | ☐ |
| QC-003 | Version number ถูกต้อง | ☐ |
| QC-004 | Status ถูกต้อง | ☐ |
| QC-005 | Last Updated date เป็นวันที่ปัจจุบัน | ☐ |
| QC-006 | Reference Document ระบุถูกต้อง | ☐ |
| QC-007 | มี Table of Contents | ☐ |
| QC-008 | Table of Contents ตรงกับ section จริง | ☐ |
| QC-009 | มี Revision History | ☐ |
| QC-010 | Revision History มี entry สำหรับ version ปัจจุบัน | ☐ |
| QC-011 | ใช้ภาษาไทยสำหรับคำอธิบาย | ☐ |
| QC-012 | ใช้ภาษาอังกฤษสำหรับ technical term | ☐ |
| QC-013 | Heading hierarchy ถูกต้อง | ☐ |
| QC-014 | Table มี header row | ☐ |
| QC-015 | ไม่มี broken link หรือ reference | ☐ |
| QC-016 | ไม่มี TODO หรือ placeholder ที่ค้างอยู่ | ☐ |
| QC-017 | เนื้อหาสอดคล้องกับ parent document | ☐ |
| QC-018 | ไม่มี requirement ที่ขัดแย้งกับเอกสารอื่น | ☐ |
| QC-019 | Requirement ID ไม่ซ้ำกับเอกสารอื่น | ☐ |
| QC-020 | ไม่มี secret, password, API key ในเอกสาร | ☐ |

## 14.2 Code Quality Checklist

AI ต้องตรวจทุกข้อก่อนส่งมอบ code

| Check ID | Checkpoint | ผ่าน/ไม่ผ่าน |
|----------|-----------|--------------|
| QC-C001 | Naming convention ถูกต้อง | ☐ |
| QC-C002 | ไม่มี hardcoded secret | ☐ |
| QC-C003 | มี error handling ที่เหมาะสม | ☐ |
| QC-C004 | มี input validation | ☐ |
| QC-C005 | มี comment สำหรับ logic ที่ซับซ้อน | ☐ |
| QC-C006 | ไม่มี console.log ที่ไม่จำเป็น | ☐ |
| QC-C007 | ไม่มี unused import | ☐ |
| QC-C008 | ไม่มี unused variable | ☐ |
| QC-C009 | File size ไม่เกิน 500 บรรทัด | ☐ |
| QC-C010 | มี unit test สำหรับ function สำคัญ | ☐ |

---

# 15. Review Checklist

## 15.1 Document Review Checklist

Reviewer ต้องตรวจทุกข้อก่อนอนุมัติเอกสาร

| Review ID | Review Point | Reviewer | ผ่าน/ไม่ผ่าน |
|-----------|-------------|----------|--------------|
| REV-001 | เนื้อหาครบตาม requirement ที่กำหนด | ChatGPT | ☐ |
| REV-002 | ไม่มี scope creep | ChatGPT | ☐ |
| REV-003 | สอดคล้องกับ dependency chain | ChatGPT | ☐ |
| REV-004 | Metadata ถูกต้องและครบถ้วน | ChatGPT | ☐ |
| REV-005 | ภาษาถูกต้องตาม language policy | ChatGPT | ☐ |
| REV-006 | Technical accuracy ถูกต้อง | Gemini | ☐ |
| REV-007 | ไม่มีข้อมูลที่ขัดแย้งกับเอกสารอื่น | Gemini | ☐ |
| REV-008 | Requirement ID ไม่ซ้ำและถูก format | ChatGPT | ☐ |
| REV-009 | Mermaid diagram render ได้ถูกต้อง | Gemini | ☐ |
| REV-010 | Table format ถูกต้อง | Gemini | ☐ |

## 15.2 Code Review Checklist

Reviewer ต้องตรวจทุกข้อก่อนอนุมัติ code

| Review ID | Review Point | Reviewer | ผ่าน/ไม่ผ่าน |
|-----------|-------------|----------|--------------|
| REV-C001 | Code ตรงกับ requirement ที่กำหนด | ChatGPT | ☐ |
| REV-C002 | ไม่มี feature นอก scope | ChatGPT | ☐ |
| REV-C003 | Architecture สอดคล้องกับ design document | ChatGPT | ☐ |
| REV-C004 | Security best practice ถูกต้อง | Gemini | ☐ |
| REV-C005 | Error handling ครบถ้วน | Gemini | ☐ |
| REV-C006 | Performance ผ่านเกณฑ์ | Gemini | ☐ |
| REV-C007 | Test coverage เพียงพอ | Gemini | ☐ |
| REV-C008 | Naming convention ถูกต้อง | Gemini | ☐ |
| REV-C009 | ไม่มี security vulnerability ที่ชัดเจน | Gemini | ☐ |
| REV-C010 | Documentation ใน code เพียงพอ | Gemini | ☐ |

## 15.3 Review Process

```
1. AI สร้างหรือแก้ไขงาน
    ↓
2. AI ตรวจ Quality Checklist ด้วยตนเอง
    ↓
3. ส่งให้ Reviewer ตาม role
    ↓
4. Reviewer ตรวจ Review Checklist
    ↓
5a. ผ่าน → อนุมัติ และเปลี่ยน status เป็น Approved
5b. ไม่ผ่าน → ส่งกลับพร้อม comment
    ↓
6. AI แก้ไขตาม comment
    ↓
7. กลับไปขั้นตอน 3
```

---

# 16. Violation Policy

## 16.1 Violation Categories

| Category | ตัวอย่าง | Severity |
|----------|----------|----------|
| Scope Violation | เพิ่ม feature ที่ไม่มีใน PRD | Critical |
| Role Violation | AI ทำงานนอก role ที่กำหนด | High |
| Output Violation | สร้าง script แทนที่จะเขียน Markdown | High |
| Reference Violation | ไม่อ้างอิงเอกสารที่จำเป็น | Medium |
| Format Violation | ไม่มี metadata หรือ revision history | Medium |
| Naming Violation | ใช้ naming convention ผิด | Low |
| Style Violation | ใช้ภาษาผิดตาม language policy | Low |

## 16.2 Violation Response

| Severity | Response | คำอธิบาย |
|----------|----------|----------|
| Critical | Reject and Rollback | ปฏิเสธผลงานทันทีและย้อนกลับการเปลี่ยนแปลง |
| High | Reject and Fix | ปฏิเสธผลงานและต้องแก้ไขก่อนส่งใหม่ |
| Medium | Conditional Accept | รับผลงานแต่ต้องแก้ไขใน revision ถัดไป |
| Low | Note and Fix | บันทึกไว้และแก้ไขเมื่อมีโอกาส |

---

# Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2026-08-02 | ChatGPT | Initial AI Agent Rules — ครอบคลุม role definition, repository governance, documentation standards, output policy, prompt rules, repository rules, file rules, naming convention, document template, cross-reference rules, conflict resolution, quality checklist, review checklist, violation policy |
