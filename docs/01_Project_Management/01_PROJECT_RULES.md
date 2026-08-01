# EV-JARVIS Project Rules

> **Document ID:** DOC-001
> **Version:** 1.0.0
> **Status:** Draft
> **Project:** EV-JARVIS
> **Owner:** Project Manager
> **Last Updated:** 2026-08-02

---

# Table of Contents

1. Project Overview
2. Project Goals
3. Project Scope
4. Team Roles
5. AI Workflow
6. Development Workflow
7. Requirement Freeze Policy
8. Documentation Rules
9. Coding Standards
10. Git Workflow
11. Branch Strategy
12. Testing Policy
13. Security Policy
14. Release Policy
15. Product Backlog
16. Definition of Done
17. Change Management
18. Folder Structure
19. AI Prompt Rules

---

# 1. Project Overview

EV-JARVIS คือระบบ AI Assistant สำหรับรถยนต์ไฟฟ้า (EV)

ระบบถูกออกแบบให้เป็น Modular Architecture
รองรับการเพิ่มฟีเจอร์ในอนาคตโดยไม่กระทบระบบเดิม

เป้าหมายคือ

- AI Assistant
- Dashboard
- Vehicle Monitoring
- Charging Management
- Battery Analytics
- Maintenance Tracking
- Driver Profile
- OTA Ready

---

# 2. Project Goals

Primary Goals

- Stable
- Secure
- Maintainable
- Scalable
- Easy to Extend

Secondary Goals

- Modern UI
- Fast Response
- Offline Support
- AI Ready

---

# 3. Project Scope

Version 1.0

Included

- Authentication
- Dashboard
- Vehicle
- Battery
- Charging
- Trips
- Settings

Excluded

- OTA Update
- Marketplace
- Community
- Fleet Management

---

# 4. Team Roles

Project Manager

- Planning
- Review
- Documentation
- Approval

Developer

- Implement Features
- Fix Bugs

Tester

- Testing
- QA

---

# 5. AI Workflow

ChatGPT

Role

- Project Manager
- Documentation
- Architecture
- Review

Claude

Role

- Feature Development
- Refactor
- Business Logic

Gemini

Role

- Debug
- Testing
- Optimization
- Documentation Review

---

# 6. Development Workflow

Requirement

↓

Planning

↓

Architecture

↓

Development

↓

Testing

↓

Review

↓

Merge

↓

Release

---

# 7. Requirement Freeze Policy

เมื่อ Requirement ถูกอนุมัติแล้ว

Allowed

- Bug Fix
- Security Fix
- Documentation Update

Not Allowed

- New Feature
- Scope Change
- Major Refactor

ทุก Feature ใหม่

ต้องถูกเพิ่มเข้า Product Backlog เท่านั้น

---

# 8. Documentation Rules

ทุกเอกสารต้องมี

- Version
- Status
- Owner
- Last Updated

ทุก Requirement ต้องมี ID

เช่น

FR-001

NFR-001

API-001

DB-001

---

# 9. Coding Standards

Naming

Variables

camelCase

Functions

camelCase

Class

PascalCase

Constants

UPPER_CASE

Files

kebab-case

Components

PascalCase

---

# 10. Git Workflow

Main

Production

Develop

Integration

Feature

Development

Hotfix

Critical Fix

---

# 11. Branch Strategy

feature/login

feature/dashboard

feature/battery

bugfix/login

hotfix/security

---

# 12. Testing Policy

Required

Unit Test

Integration Test

Manual Test

Regression Test

Performance Test

---

# 13. Security Policy

Authentication Required

JWT

HTTPS

Password Hash

Environment Variables

No Hardcoded Secret

Input Validation

Rate Limiting

---

# 14. Release Policy

Development

↓

Testing

↓

Staging

↓

Production

---

# 15. Product Backlog

Priority

Critical

High

Medium

Low

Future Features

ต้องอยู่ใน Backlog

ห้ามเพิ่มเข้า Sprint ปัจจุบัน

---

# 16. Definition of Done

Feature ถือว่าเสร็จเมื่อ

- Code Complete
- Build Success
- No Error
- Tested
- Reviewed
- Documentation Updated
- Merged

---

# 17. Change Management

ทุกการเปลี่ยนแปลง

ต้องมี

Reason

Impact

Approval

Documentation Update

---

# 18. Folder Structure

```
EV-JARVIS/

docs/

src/

backend/

frontend/

database/

api/

tests/

scripts/

assets/

deployment/
```

---

# 19. AI Prompt Rules

AI ทุกตัวต้อง

อ้างอิง

- PRD
- SRS
- Requirements

ห้าม

- เดา Requirement
- เปลี่ยน Architecture
- เพิ่ม Feature

หากพบ Requirement ไม่ชัดเจน

ให้หยุดและสอบถามก่อน

---

# Revision History

| Version | Date | Description |
|----------|------------|----------------|
| 1.0.0 | 2026-08-02 | Initial Project Rules |