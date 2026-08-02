---
id: DOC-011
title: Deployment Architecture
version: 1.0.0
last_updated: 2026-08-02
status: Complete
author: Principal Cloud Architect & DevOps Lead
references:
  - docs/01_Project_Management/MASTER_CONTEXT.md
  - docs/03_Architecture/01_SYSTEM_ARCHITECTURE.md
  - docs/03_Architecture/02_C4_MODEL.md
  - docs/02_Requirements/03_PRD.md
  - docs/02_Requirements/04_SRS.md
  - docs/02_Requirements/05_REQUIREMENTS.md
---

# Deployment Architecture — EV-JARVIS

> **Document ID:** DOC-011
> **Version:** 1.0.0
> **Status:** Complete
> **Project:** EV-JARVIS
> **Owner:** Principal Cloud Architect & DevOps Lead
> **Last Updated:** 2026-08-02
> **Reference Documents:** System Architecture (DOC-009), C4 Model (DOC-010)
> **Document Type:** Deployment Architecture Documentation

---

# Table of Contents

1. [Purpose](#1-purpose)
2. [Deployment Goals](#2-deployment-goals)
3. [Deployment Principles](#3-deployment-principles)
4. [Environment Strategy](#4-environment-strategy)
5. [Infrastructure Overview](#5-infrastructure-overview)
6. [Deployment Topology](#6-deployment-topology)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Branch Deployment Strategy](#8-branch-deployment-strategy)
9. [Environment Variables](#9-environment-variables)
10. [Docker Strategy](#10-docker-strategy)
11. [Release Strategy](#11-release-strategy)
12. [Rollback Strategy](#12-rollback-strategy)
13. [Backup Strategy](#13-backup-strategy)
14. [Disaster Recovery](#14-disaster-recovery)
15. [Monitoring Strategy](#15-monitoring-strategy)
16. [Performance Strategy](#16-performance-strategy)
17. [Security During Deployment](#17-security-during-deployment)
18. [Operational Checklist](#18-operational-checklist)
19. [Deployment Decision Matrix](#19-deployment-decision-matrix)
20. [Risks](#20-risks)
21. [Future Expansion](#21-future-expansion)
22. [Revision History](#22-revision-history)

---

# 1. Purpose

เอกสารนี้กำหนดสถาปัตยกรรมการ Deploy ระบบ EV-JARVIS อย่างเป็นทางการ ครอบคลุมตั้งแต่โครงสร้าง Environment, Infrastructure, CI/CD Pipeline, Release Strategy, Rollback, Monitoring, Scalability และ Disaster Recovery

เอกสารนี้เป็นเอกสารสถาปัตยกรรมการ Deploy (Deployment Architecture Documentation) ไม่ใช่ Infrastructure-as-Code และไม่ใช่ Source Code

เอกสารนี้สอดคล้องกับ:
- System Architecture (DOC-009) Section 23: Deployment Overview
- C4 Model (DOC-010) Section 13: Deployment Mapping
- SRS (DOC-004) Performance Requirements (PERF-*) และ Security Requirements (SEC-*)
- Requirements (DOC-005) Deployment Requirements (DEP-001)

---

# 2. Deployment Goals

เป้าหมายหลักของสถาปัตยกรรมการ Deploy:

| Goal ID | Goal | คำอธิบาย | Metric |
|---|---|---|---|
| DG-001 | **Zero-Downtime Deployment** | การ Deploy ต้องไม่ทำให้ระบบหยุดให้บริการ | Downtime = 0 ระหว่าง Deployment |
| DG-002 | **Automated Pipeline** | ทุก Deployment ต้องผ่าน CI/CD Pipeline อัตโนมัติ | Manual Intervention = 0 สำหรับ Build/Test/Deploy |
| DG-003 | **Fast Rollback** | สามารถ Rollback ไปเวอร์ชันก่อนหน้าได้ภายใน 5 นาที | Rollback Time < 5 นาที |
| DG-004 | **Environment Parity** | ทุก Environment ต้องมีโครงสร้างใกล้เคียงกัน | Configuration Drift = 0 |
| DG-005 | **Security First** | ทุก Secret ต้องไม่ถูกเปิดเผยใน Source Code หรือ Log | Secret Exposure = 0 (อ้างอิง REPO-005) |
| DG-006 | **Observability** | ระบบต้องมี Metrics, Logs และ Tracing ครบถ้วน | Monitoring Coverage = 100% สำหรับ Critical Path |
| DG-007 | **Reproducible Builds** | ทุก Build ต้องให้ผลลัพธ์เหมือนกันเมื่อใช้ Input เดียวกัน | Build Determinism = 100% |
| DG-008 | **API Availability** | ระบบ Production ต้องพร้อมใช้งานไม่น้อยกว่า 99.0% | Uptime ≥ 99.0% (อ้างอิง TM-001 ใน PRD) |

---

# 3. Deployment Principles

หลักการที่ใช้เป็นแนวทางในการตัดสินใจเกี่ยวกับ Deployment ทุกจุด:

| Principle | คำอธิบาย | เหตุผล |
|---|---|---|
| **Infrastructure as Configuration** | กำหนด Infrastructure ผ่าน Configuration Files (Docker Compose, GitHub Actions YAML) แทนการตั้งค่าด้วยมือ | ลด Human Error และทำให้ Environment Reproducible |
| **Immutable Deployments** | ทุก Deployment ใช้ Docker Image ใหม่ที่ Build จาก Source ไม่แก้ไข Container ที่กำลัง Run อยู่ | ป้องกัน Configuration Drift และทำให้ Rollback ง่าย |
| **Shift Left Security** | ตรวจสอบ Security ตั้งแต่ขั้นตอน Build (Lint, Dependency Scan) ไม่รอถึง Production | ลดค่าใช้จ่ายในการแก้ไข Vulnerability |
| **Progressive Delivery** | Deploy ไป Staging ก่อน Production เสมอ โดย Production ต้องผ่าน Manual Approval | ลดความเสี่ยงจาก Regression ใน Production |
| **Fail Fast, Recover Fast** | Pipeline ต้องหยุดทันทีเมื่อ Test Fail และ Rollback ต้องเร็วกว่า Forward Fix | ลดเวลาที่ระบบอยู่ในสถานะ Degraded |
| **Managed Services First** | เลือกใช้ Managed Service (Supabase, Vercel, Railway) แทนการดูแลเอง สำหรับ MVP | ลด Operational Overhead ให้ทีมเล็กโฟกัสที่ Product |
| **Environment Isolation** | แยก Environment (Development, Staging, Production) อย่างเด็ดขาด ทั้ง Database, Secret และ API Key | ป้องกันข้อมูล Production หลุดไปยัง Non-production |

---

# 4. Environment Strategy

## 4.1 Environment Definition

| Environment | Purpose | Access | คำอธิบาย |
|---|---|---|---|
| **Development** | Local Development | นักพัฒนาแต่ละคน | สภาพแวดล้อมบนเครื่องนักพัฒนา ใช้ Docker Compose สำหรับ Backend + Redis + Supabase Local |
| **Testing** | Automated Testing | CI/CD Pipeline | สภาพแวดล้อมชั่วคราวที่สร้างขึ้นอัตโนมัติโดย GitHub Actions สำหรับ Unit Test, Integration Test และ E2E Test |
| **Staging** | Pre-production Validation | ทีมพัฒนา + QA | สภาพแวดล้อมที่เหมือน Production ใช้สำหรับทดสอบก่อน Release (อ้างอิง DEP-001) |
| **Production** | Live System | ผู้ใช้จริง | ระบบจริงสำหรับผู้ใช้ ต้องผ่าน Manual Approval จาก Lead Engineer ก่อน Deploy |

## 4.2 Environment Relationship

```mermaid
flowchart LR
    subgraph Local["Development (Local)"]
        DevFE["React Dev Server\n(localhost:3000)"]
        DevBE["Express.js\n(localhost:4000)"]
        DevDB["Supabase Local\n(Docker)"]
        DevRedis["Redis\n(Docker)"]
    end

    subgraph Testing["Testing (CI/CD)"]
        TestRunner["GitHub Actions\nRunner"]
        TestDB["Supabase Local\n(Docker-in-CI)"]
        TestRedis["Redis\n(Docker-in-CI)"]
    end

    subgraph Staging["Staging"]
        StageFE["Vercel\n(Preview)"]
        StageBE["Railway\n(Staging)"]
        StageDB["Supabase\n(Staging Project)"]
        StageRedis["Upstash Redis\n(Staging)"]
    end

    subgraph Production["Production"]
        ProdFE["Vercel\n(Production)"]
        ProdBE["Railway\n(Production)"]
        ProdDB["Supabase\n(Production Project)"]
        ProdRedis["Upstash Redis\n(Production)"]
    end

    Local -->|"git push"| Testing
    Testing -->|"Auto Deploy"| Staging
    Staging -->|"Manual Approval"| Production
```

## 4.3 Environment Configuration

| Configuration | Development | Testing | Staging | Production |
|---|---|---|---|---|
| **Supabase** | Supabase CLI (Local Docker) | Supabase CLI (Docker-in-CI) | Supabase Cloud (Staging Project) | Supabase Cloud (Production Project) |
| **Redis** | Docker Container (localhost:6379) | Docker Container (CI Runner) | Upstash Redis (Staging Instance) | Upstash Redis (Production Instance) |
| **Frontend** | Vite Dev Server (localhost:3000) | Build Artifact (Test Only) | Vercel Preview Deployment | Vercel Production Deployment |
| **Backend** | Express.js (localhost:4000) | Docker Container (CI Runner) | Railway Staging Service | Railway Production Service |
| **AI Providers** | Mock API / Development Keys | Mock API (No Real Calls) | Production API Keys (Rate Limited) | Production API Keys (Full Quota) |
| **Google Maps** | Development Key (Unrestricted) | Mock API (No Real Calls) | Production Key (Domain Restricted) | Production Key (Domain Restricted) |
| **Firebase FCM** | Mock Notification | Mock Notification | Production FCM (Staging Topic) | Production FCM (Production Topic) |
| **Log Level** | debug | info | info | warn |
| **Source Maps** | Enabled | Enabled | Enabled | Disabled (Uploaded to Sentry) |

---

# 5. Infrastructure Overview

## 5.1 Infrastructure Components

| Component | Provider | Service | คำอธิบาย | เหตุผลที่เลือก |
|---|---|---|---|---|
| **Frontend Hosting** | Vercel | Vercel Platform | Static Site Hosting + Edge Network + Preview Deployments | Zero-config สำหรับ React, Global CDN, Automatic Preview per PR |
| **Backend Hosting** | Railway | Railway Platform | Container Hosting + Auto Deploy + Health Checks | ใช้งานง่าย Deploy จาก Dockerfile, Auto-scaling, Managed Networking |
| **Backend Alternative** | Render | Render Platform | Container Hosting (Alternative) | Fallback หาก Railway ไม่พร้อมใช้งาน Architecture เหมือนกัน |
| **Database** | Supabase | PostgreSQL (Managed) | Relational Database หลัก เข้าถึงผ่าน Prisma ORM | PostgreSQL รองรับ Relational Data Model ที่ซับซ้อน (อ้างอิง ADR-001) |
| **Authentication** | Supabase | Supabase Auth | Identity Provider สำหรับ JWT + OAuth2 | ลด Overhead ของการจัดการ Auth เอง รวมอยู่กับ Supabase |
| **Storage** | Supabase | Supabase Storage | Object Storage สำหรับ รูปภาพ เอกสาร | S3-compatible, RLS Policies, CDN Built-in |
| **Realtime** | Supabase | Supabase Realtime | WebSocket Service สำหรับ Live Updates | CDC (Change Data Capture) จาก PostgreSQL โดยตรง |
| **Cache & Queue** | Upstash | Upstash Redis | Redis สำหรับ Caching และ BullMQ Queue | Serverless Redis, Pay-per-request, Auto-scale (อ้างอิง ADR-009) |
| **Notification** | Firebase | Firebase Cloud Messaging | Push Notification | Cross-platform Push ไปยัง PWA และ Mobile Device |
| **Maps** | Google | Google Maps Platform | Directions, Places, Geocoding APIs | ครอบคลุม API ที่ต้องการ และ Developer Ecosystem ใหญ่ |
| **AI (Primary)** | OpenAI | GPT-4o API | Primary LLM Provider | ประสิทธิภาพสูงสุดสำหรับ General-purpose Chat (อ้างอิง ADR-004) |
| **AI (Secondary)** | Google | Gemini API | Secondary LLM + Multimodal | Fallback + Multimodal Capability |
| **AI (Tertiary)** | Anthropic | Claude API | Tertiary LLM + Long Context | Fallback + Long Context Window |
| **CI/CD** | GitHub | GitHub Actions | Build, Test, Deploy Pipeline | ผสานกับ GitHub Repository โดยตรง ไม่ต้องตั้งค่า External CI |
| **Error Tracking** | Sentry | Sentry Platform | Error Monitoring + Performance | Real-time Error Tracking, Stack Trace, Release Tracking |
| **Metrics Dashboard** | Grafana | Grafana Cloud | Metrics Visualization + Alerting | Dashboard ที่ยืดหยุ่น รองรับ Multiple Data Sources |
| **Tracing** | OpenTelemetry | OpenTelemetry SDK | Distributed Tracing | Vendor-neutral Standard, Export ไป Grafana หรือ Sentry ได้ |
| **Logging** | Winston | Winston Library | Structured Logging | Standard Node.js Logger, JSON Format, Multiple Transports |

## 5.2 Infrastructure Diagram

```mermaid
flowchart TD
    subgraph Developers["👨‍💻 Developers"]
        Dev["Local Development\n(Docker Compose)"]
    end

    subgraph GitHub["GitHub"]
        Repo["📦 GitHub Repository"]
        Actions["⚙️ GitHub Actions\n(CI/CD Pipeline)"]
        Secrets["🔐 GitHub Secrets"]
    end

    subgraph Vercel["Vercel (Frontend)"]
        VercelProd["🌐 Production\n(ev-jarvis.vercel.app)"]
        VercelPreview["👁️ Preview\n(pr-*.vercel.app)"]
    end

    subgraph Railway["Railway (Backend)"]
        RailwayProd["⚙️ Production Service\n(Docker Container)"]
        RailwayStaging["🧪 Staging Service\n(Docker Container)"]
    end

    subgraph Supabase["Supabase Platform"]
        SupaProd["🗄️ Production Project\n(PostgreSQL + Auth\n+ Storage + Realtime)"]
        SupaStaging["🧪 Staging Project\n(PostgreSQL + Auth\n+ Storage + Realtime)"]
    end

    subgraph Upstash["Upstash"]
        RedisProd["⚡ Production Redis"]
        RedisStaging["🧪 Staging Redis"]
    end

    subgraph External["External Services"]
        AI["🤖 AI Providers\n(OpenAI / Gemini / Claude)"]
        Maps["🗺️ Google Maps"]
        FCM["🔔 Firebase FCM"]
        Sentry["🐛 Sentry"]
        Grafana["📊 Grafana Cloud"]
    end

    Dev -->|"git push"| Repo
    Repo -->|"trigger"| Actions
    Actions -->|"deploy frontend"| VercelProd
    Actions -->|"deploy frontend preview"| VercelPreview
    Actions -->|"deploy backend"| RailwayProd
    Actions -->|"deploy staging"| RailwayStaging
    Actions -->|"read"| Secrets

    VercelProd -->|"HTTPS"| RailwayProd
    VercelPreview -->|"HTTPS"| RailwayStaging

    RailwayProd -->|"Prisma"| SupaProd
    RailwayProd -->|"BullMQ"| RedisProd
    RailwayProd -->|"REST"| AI
    RailwayProd -->|"REST"| Maps
    RailwayProd -->|"SDK"| FCM
    RailwayProd -->|"SDK"| Sentry
    RailwayProd -->|"OTLP"| Grafana

    RailwayStaging -->|"Prisma"| SupaStaging
    RailwayStaging -->|"BullMQ"| RedisStaging
```

---

# 6. Deployment Topology

## 6.1 Topology Summary

| Layer | Component | Provider | URL Pattern | Port |
|---|---|---|---|---|
| **Frontend** | React PWA | Vercel | `ev-jarvis.vercel.app` | 443 (HTTPS) |
| **Backend API** | Express.js (Docker) | Railway | `api.ev-jarvis.railway.app` | 443 (HTTPS) |
| **Backend Worker** | BullMQ Worker (Docker) | Railway | Internal (ไม่เปิด Public) | ไม่มี |
| **Database** | PostgreSQL | Supabase | `db.<project-ref>.supabase.co` | 5432 (TCP) |
| **Auth** | Supabase Auth | Supabase | `<project-ref>.supabase.co/auth/v1` | 443 (HTTPS) |
| **Storage** | Supabase Storage | Supabase | `<project-ref>.supabase.co/storage/v1` | 443 (HTTPS) |
| **Realtime** | Supabase Realtime | Supabase | `<project-ref>.supabase.co/realtime/v1` | 443 (WSS) |
| **Cache** | Redis | Upstash | `<instance>.upstash.io` | 6379 (TLS) |
| **AI Primary** | GPT-4o | OpenAI | `api.openai.com` | 443 (HTTPS) |
| **AI Secondary** | Gemini | Google | `generativelanguage.googleapis.com` | 443 (HTTPS) |
| **AI Tertiary** | Claude | Anthropic | `api.anthropic.com` | 443 (HTTPS) |
| **Maps** | Google Maps | Google | `maps.googleapis.com` | 443 (HTTPS) |
| **Notification** | FCM | Firebase | `fcm.googleapis.com` | 443 (HTTPS) |

## 6.2 Deployment Topology Diagram

```mermaid
flowchart TD
    subgraph Users["Users"]
        EVOwner["👤 EV Owner\n(Browser / PWA)"]
        Admin["🔧 Administrator\n(Browser)"]
    end

    subgraph CDN["Vercel Edge Network (CDN)"]
        FE["📱 React PWA\n(Static Files)\nev-jarvis.vercel.app"]
    end

    subgraph RailwayCluster["Railway Platform"]
        API["⚙️ Backend API\n(Express.js Docker)\napi.ev-jarvis.railway.app"]
        Worker["🔄 Background Worker\n(BullMQ Docker)\nInternal Only"]
    end

    subgraph SupabaseCluster["Supabase Cloud"]
        PG["🗄️ PostgreSQL\n(Managed Database)"]
        Auth["🔐 Auth Service\n(JWT + OAuth2)"]
        Storage["📦 Storage\n(S3-compatible)"]
        RT["📡 Realtime\n(WebSocket CDC)"]
    end

    subgraph ManagedCache["Upstash"]
        Redis["⚡ Redis\n(Serverless)"]
    end

    subgraph ExternalAPIs["External APIs"]
        OpenAI["🤖 OpenAI\n(GPT-4o)"]
        Gemini["🤖 Gemini\n(Multimodal)"]
        Claude["🤖 Claude\n(Long Context)"]
        GMaps["🗺️ Google Maps\n(Directions/Places)"]
        FCM["🔔 Firebase FCM\n(Push Notification)"]
    end

    subgraph Observability["Observability Stack"]
        SentryIO["🐛 Sentry\n(Error Tracking)"]
        GrafanaCloud["📊 Grafana Cloud\n(Metrics + Dashboards)"]
    end

    EVOwner -->|"HTTPS"| FE
    Admin -->|"HTTPS"| FE
    FE -->|"REST API\n/api/v1/*"| API
    FE -->|"WSS"| RT
    FE -->|"SDK"| Auth

    API -->|"Prisma ORM"| PG
    API -->|"JWT Verify"| Auth
    API -->|"File Ops"| Storage
    API -->|"BullMQ Enqueue"| Redis
    API -->|"REST"| OpenAI
    API -->|"REST"| Gemini
    API -->|"REST"| Claude
    API -->|"REST"| GMaps

    Worker -->|"BullMQ Consume"| Redis
    Worker -->|"Prisma ORM"| PG
    Worker -->|"Admin SDK"| FCM

    RT -->|"CDC"| PG

    API -->|"SDK"| SentryIO
    API -->|"OTLP"| GrafanaCloud
    Worker -->|"SDK"| SentryIO
```

---

# 7. CI/CD Pipeline

## 7.1 Pipeline Overview

ระบบ CI/CD ของ EV-JARVIS ใช้ **GitHub Actions** เป็น Pipeline หลัก ทำงานแบบ **GitHub Flow** (Feature Branch → Pull Request → main) โดยมีขั้นตอนดังนี้:

| Stage | คำอธิบาย | Trigger | Failure Action |
|---|---|---|---|
| **Lint** | ตรวจสอบ Code Style (ESLint, Prettier) และ TypeScript Type Check | ทุก Push และ PR | Block PR Merge |
| **Test** | รัน Unit Tests, Integration Tests ด้วย Vitest | ทุก Push และ PR | Block PR Merge |
| **Security Scan** | ตรวจ Dependency Vulnerabilities (npm audit) | ทุก Push และ PR | Block PR Merge (Critical/High) |
| **Build** | Build Docker Image สำหรับ Backend, Build Frontend สำหรับ Vercel | เมื่อ Merge เข้า main | Notify ทีม + Block Deploy |
| **Deploy Staging** | Deploy Backend ไป Railway Staging, Frontend ไป Vercel Preview | เมื่อ Merge เข้า main | Notify ทีม |
| **Smoke Test** | รัน Basic API Health Check บน Staging | หลัง Deploy Staging สำเร็จ | Block Production Deploy |
| **Deploy Production** | Deploy Backend ไป Railway Production, Frontend ไป Vercel Production | Manual Approval จาก Lead Engineer | Rollback อัตโนมัติ |
| **Post-Deploy** | รัน Health Check บน Production + Notify ทีม | หลัง Deploy Production สำเร็จ | Trigger Rollback |

## 7.2 CI/CD Pipeline Diagram

```mermaid
flowchart TD
    subgraph Trigger["Trigger"]
        Push["git push\n(feature/*)"]
        PR["Pull Request\n(→ main)"]
        Merge["Merge to main"]
    end

    subgraph CI["CI Stage (GitHub Actions)"]
        Lint["🔍 Lint\n(ESLint + Prettier\n+ TypeScript)"]
        Test["🧪 Test\n(Vitest Unit\n+ Integration)"]
        SecScan["🔒 Security Scan\n(npm audit\n+ Snyk)"]
    end

    subgraph Build["Build Stage"]
        BuildFE["🏗️ Build Frontend\n(Vite Build)"]
        BuildBE["🐳 Build Backend\n(Docker Image)"]
        BuildWorker["🐳 Build Worker\n(Docker Image)"]
    end

    subgraph DeployStaging["Deploy Staging"]
        DeployFEStage["📤 Deploy Frontend\n(Vercel Preview)"]
        DeployBEStage["📤 Deploy Backend\n(Railway Staging)"]
        SmokeTest["🔥 Smoke Test\n(Health Check API)"]
    end

    subgraph Approval["Gate"]
        ManualApproval["✅ Manual Approval\n(Lead Engineer)"]
    end

    subgraph DeployProd["Deploy Production"]
        DeployFEProd["🚀 Deploy Frontend\n(Vercel Production)"]
        DeployBEProd["🚀 Deploy Backend\n(Railway Production)"]
        HealthCheck["❤️ Health Check\n(Production API)"]
        Notify["📢 Notify Team\n(Slack / Discord)"]
    end

    subgraph Rollback["Rollback"]
        AutoRollback["⏪ Auto Rollback\n(Previous Version)"]
    end

    Push --> Lint
    PR --> Lint
    Lint --> Test
    Test --> SecScan

    Merge --> BuildFE
    Merge --> BuildBE
    Merge --> BuildWorker

    BuildFE --> DeployFEStage
    BuildBE --> DeployBEStage
    BuildWorker --> DeployBEStage
    DeployFEStage --> SmokeTest
    DeployBEStage --> SmokeTest

    SmokeTest -->|"Pass"| ManualApproval
    SmokeTest -->|"Fail"| AutoRollback

    ManualApproval --> DeployFEProd
    ManualApproval --> DeployBEProd
    DeployFEProd --> HealthCheck
    DeployBEProd --> HealthCheck
    HealthCheck -->|"Pass"| Notify
    HealthCheck -->|"Fail"| AutoRollback
```

## 7.3 GitHub Actions Workflow Structure

| Workflow File | Trigger | คำอธิบาย |
|---|---|---|
| `ci.yml` | Push to any branch, PR to main | Lint + Type Check + Unit Test + Security Scan |
| `deploy-staging.yml` | Push to main (auto) | Build Docker + Deploy to Railway Staging + Vercel Preview |
| `deploy-production.yml` | Manual Dispatch (approval required) | Deploy to Railway Production + Vercel Production + Health Check |
| `rollback.yml` | Manual Dispatch | Rollback Railway to Previous Deployment + Vercel to Previous Build |
| `db-migrate.yml` | Manual Dispatch | Run Prisma Migration on Staging or Production |

---

# 8. Branch Deployment Strategy

## 8.1 Branch Model

ระบบใช้ **GitHub Flow** ที่ปรับให้เหมาะกับ EV-JARVIS:

| Branch | Purpose | Deploy Target | Protection Rules |
|---|---|---|---|
| `main` | Production-ready Code | Staging (Auto) → Production (Manual Approval) | Require PR, Require CI Pass, Require 1 Approval, No Direct Push |
| `develop` | Integration Branch สำหรับ Feature ที่กำลังพัฒนา | ไม่ Deploy (CI Only) | Require PR, Require CI Pass |
| `feature/*` | Branch สำหรับพัฒนา Feature แต่ละชิ้น | ไม่ Deploy (CI Only) | ไม่มี (Developer Branch) |
| `hotfix/*` | Branch สำหรับแก้ไข Bug เร่งด่วนบน Production | Staging (Auto) → Production (Manual Approval) | Require CI Pass, Fast-track Approval |
| `release/*` | Branch สำหรับเตรียม Release (Version Bump, Changelog) | Staging (Auto) | Require PR to main, Require CI Pass |

## 8.2 Branch Flow Diagram

```mermaid
gitgraph
    commit id: "initial"
    branch develop
    checkout develop
    commit id: "setup"
    branch feature/auth
    checkout feature/auth
    commit id: "feat: login"
    commit id: "feat: register"
    checkout develop
    merge feature/auth id: "merge auth"
    branch feature/vehicle
    checkout feature/vehicle
    commit id: "feat: add vehicle"
    checkout develop
    merge feature/vehicle id: "merge vehicle"
    branch release/1.0.0
    checkout release/1.0.0
    commit id: "chore: version bump"
    checkout main
    merge release/1.0.0 id: "release v1.0.0" tag: "v1.0.0"
    branch hotfix/login-fix
    checkout hotfix/login-fix
    commit id: "fix: login bug"
    checkout main
    merge hotfix/login-fix id: "hotfix v1.0.1" tag: "v1.0.1"
    checkout develop
    merge main id: "sync hotfix"
```

## 8.3 Branch Naming Convention

| Branch Type | Format | ตัวอย่าง |
|---|---|---|
| Feature | `feature/<epic-id>-<short-description>` | `feature/epic-001-auth-login` |
| Hotfix | `hotfix/<issue-id>-<short-description>` | `hotfix/42-login-token-expired` |
| Release | `release/<version>` | `release/1.0.0` |
| Bugfix | `bugfix/<issue-id>-<short-description>` | `bugfix/55-battery-soc-overflow` |

---

# 9. Environment Variables

## 9.1 Development Environment Variables

| Variable | คำอธิบาย | ตัวอย่างค่า | Required |
|---|---|---|---|
| `NODE_ENV` | Runtime Environment | `development` | ใช่ |
| `PORT` | Backend Server Port | `4000` | ใช่ |
| `DATABASE_URL` | PostgreSQL Connection String (Supabase Local) | `postgresql://postgres:postgres@localhost:54322/postgres` | ใช่ |
| `DIRECT_URL` | Direct PostgreSQL Connection (ไม่ผ่าน PgBouncer) | `postgresql://postgres:postgres@localhost:54322/postgres` | ใช่ |
| `SUPABASE_URL` | Supabase Project URL | `http://localhost:54321` | ใช่ |
| `SUPABASE_ANON_KEY` | Supabase Anon Key (Client-side) | `eyJhbG...` | ใช่ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Server-side) | `eyJhbG...` | ใช่ |
| `REDIS_URL` | Redis Connection String | `redis://localhost:6379` | ใช่ |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-dev-...` | ใช่ |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIza...` | ไม่จำเป็น |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | `sk-ant-...` | ไม่จำเป็น |
| `GOOGLE_MAPS_API_KEY` | Google Maps API Key | `AIza...` | ใช่ |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Service Account JSON (Base64) | `eyJ0eXAi...` | ไม่จำเป็น |
| `SENTRY_DSN` | Sentry Data Source Name | `https://...@sentry.io/...` | ไม่จำเป็น |
| `LOG_LEVEL` | Winston Log Level | `debug` | ไม่จำเป็น |
| `CORS_ORIGIN` | Allowed CORS Origins | `http://localhost:3000` | ใช่ |
| `JWT_SECRET` | JWT Signing Secret (Supabase Managed) | `super-secret-jwt-token` | ใช่ |

## 9.2 Production Environment Variables

| Variable | Source | คำอธิบาย |
|---|---|---|
| `NODE_ENV` | Railway Environment | ตั้งค่าเป็น `production` |
| `PORT` | Railway Environment | Railway กำหนดให้อัตโนมัติ |
| `DATABASE_URL` | GitHub Secrets → Railway | Supabase Production Connection String (ผ่าน PgBouncer) |
| `DIRECT_URL` | GitHub Secrets → Railway | Supabase Production Direct Connection |
| `SUPABASE_URL` | GitHub Secrets → Railway | Supabase Production Project URL |
| `SUPABASE_ANON_KEY` | GitHub Secrets → Railway | Supabase Production Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Secrets → Railway | Supabase Production Service Role Key |
| `REDIS_URL` | GitHub Secrets → Railway | Upstash Redis Production Connection String (TLS) |
| `OPENAI_API_KEY` | GitHub Secrets → Railway | OpenAI Production API Key |
| `GEMINI_API_KEY` | GitHub Secrets → Railway | Google Gemini Production API Key |
| `ANTHROPIC_API_KEY` | GitHub Secrets → Railway | Anthropic Claude Production API Key |
| `GOOGLE_MAPS_API_KEY` | GitHub Secrets → Railway | Google Maps Production API Key (Domain Restricted) |
| `FIREBASE_SERVICE_ACCOUNT` | GitHub Secrets → Railway | Firebase Service Account JSON (Base64 Encoded) |
| `SENTRY_DSN` | GitHub Secrets → Railway | Sentry Production DSN |
| `SENTRY_AUTH_TOKEN` | GitHub Secrets | Sentry Release Auth Token |
| `LOG_LEVEL` | Railway Environment | ตั้งค่าเป็น `warn` |
| `CORS_ORIGIN` | Railway Environment | `https://ev-jarvis.vercel.app` |

## 9.3 Secret Management

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **Storage** | GitHub Secrets + Railway Environment Variables | Secrets เก็บใน GitHub Secrets และ Inject เข้า Railway ผ่าน CI/CD Pipeline |
| **Rotation** | Manual Rotation ทุก 90 วัน | API Keys และ Service Role Keys ต้องถูก Rotate ตามกำหนด |
| **Access Control** | Repository Admin Only | เฉพาะ Repository Admin เท่านั้นที่เข้าถึง GitHub Secrets ได้ |
| **Audit** | GitHub Audit Log | ทุกการเข้าถึง Secret ถูก Log โดย GitHub |
| **Source Code** | ห้ามเก็บ Secret ใน Source Code | ใช้ `.env.example` สำหรับ Template เท่านั้น ไม่เก็บค่าจริง (อ้างอิง REPO-005) |
| **Docker** | ไม่ COPY `.env` เข้า Docker Image | Inject ผ่าน Environment Variables ตอน Runtime |
| **Logging** | ห้าม Log Secret | Winston Redaction Filter ป้องกัน Secret หลุดเข้า Log (อ้างอิง PRIV-001) |

---

# 10. Docker Strategy

## 10.1 Docker Images

| Image | Base Image | Purpose | คำอธิบาย |
|---|---|---|---|
| `ev-jarvis-api` | `node:20-alpine` | Backend API Server | Express.js Application ที่ Serve RESTful API |
| `ev-jarvis-worker` | `node:20-alpine` | Background Job Worker | BullMQ Worker สำหรับ Async Processing |

## 10.2 Dockerfile Strategy

| Stage | คำอธิบาย | เหตุผล |
|---|---|---|
| **Multi-stage Build** | แยก Build Stage (Install Dependencies + Compile TS) จาก Production Stage (Copy Compiled JS) | ลดขนาด Final Image โดยไม่รวม devDependencies และ Source TypeScript |
| **Alpine Base** | ใช้ `node:20-alpine` เป็น Base Image | ขนาดเล็กกว่า Default Image 5 เท่า ลด Attack Surface |
| **Non-root User** | รัน Application ด้วย User `node` ไม่ใช่ `root` | ลดความเสี่ยงจาก Container Escape |
| **Health Check** | กำหนด `HEALTHCHECK` ใน Dockerfile | Railway และ Docker Compose ใช้ตรวจสอบสถานะ Container |
| **Layer Caching** | COPY `package.json` + `package-lock.json` ก่อน COPY Source Code | ใช้ Docker Layer Cache สำหรับ npm install เมื่อ Dependencies ไม่เปลี่ยน |

## 10.3 Docker Compose (Development)

| Service | Image | Ports | คำอธิบาย |
|---|---|---|---|
| `api` | Build from `./Dockerfile` | `4000:4000` | Backend API Server (Hot Reload ด้วย ts-node-dev) |
| `worker` | Build from `./Dockerfile.worker` | ไม่เปิด Port | BullMQ Background Worker |
| `supabase` | Supabase CLI (`supabase start`) | `54321:54321`, `54322:5432` | Supabase Local (Auth + DB + Storage + Realtime) |
| `redis` | `redis:7-alpine` | `6379:6379` | Redis สำหรับ Cache และ BullMQ Queue |

## 10.4 Docker Compose (Production-like Local Testing)

| Service | Image | คำอธิบาย |
|---|---|---|
| `api` | `ev-jarvis-api:latest` (Pre-built) | จำลอง Production Container สำหรับทดสอบ |
| `worker` | `ev-jarvis-worker:latest` (Pre-built) | จำลอง Production Worker สำหรับทดสอบ |
| `redis` | `redis:7-alpine` | Redis สำหรับทดสอบ Queue |

---

# 11. Release Strategy

## 11.1 Semantic Versioning

ระบบ EV-JARVIS ใช้ **Semantic Versioning 2.0.0** (SemVer) สำหรับ Release:

| Component | Format | คำอธิบาย | ตัวอย่าง |
|---|---|---|---|
| **Major** | `X.0.0` | Breaking Changes ที่ไม่ Backward Compatible | `2.0.0` |
| **Minor** | `X.Y.0` | เพิ่ม Feature ใหม่ที่ Backward Compatible | `1.1.0` |
| **Patch** | `X.Y.Z` | Bug Fix ที่ไม่เปลี่ยน API Contract | `1.0.1` |
| **Pre-release** | `X.Y.Z-beta.N` | Version สำหรับทดสอบก่อน Release | `1.1.0-beta.1` |

## 11.2 Release Workflow

```mermaid
flowchart TD
    Start["🏁 Start Release"] --> CreateBranch["สร้าง Branch\nrelease/X.Y.Z"]
    CreateBranch --> VersionBump["📝 Version Bump\n(package.json)"]
    VersionBump --> Changelog["📋 Update CHANGELOG"]
    Changelog --> PRMain["📤 Create PR\n(release/X.Y.Z → main)"]
    PRMain --> CICheck["⚙️ CI Pipeline\n(Lint + Test + Build)"]
    CICheck -->|"Pass"| ReviewApproval["✅ Code Review\n+ Approval"]
    CICheck -->|"Fail"| FixIssues["🔧 Fix Issues"]
    FixIssues --> CICheck
    ReviewApproval --> MergeMain["🔀 Merge to main"]
    MergeMain --> TagRelease["🏷️ Create Git Tag\n(vX.Y.Z)"]
    TagRelease --> DeployStaging["📤 Auto Deploy\n(Staging)"]
    DeployStaging --> SmokeStaging["🔥 Smoke Test\n(Staging)"]
    SmokeStaging -->|"Pass"| ApprovalProd["✅ Manual Approval\n(Lead Engineer)"]
    SmokeStaging -->|"Fail"| HotfixBranch["🚑 Create Hotfix"]
    HotfixBranch --> FixIssues
    ApprovalProd --> DeployProd["🚀 Deploy Production"]
    DeployProd --> HealthProd["❤️ Health Check\n(Production)"]
    HealthProd -->|"Pass"| GitHubRelease["📦 Create GitHub Release\n(with Release Notes)"]
    HealthProd -->|"Fail"| Rollback["⏪ Rollback"]
    GitHubRelease --> SyncDevelop["🔄 Sync main → develop"]
    SyncDevelop --> Done["✅ Release Complete"]
```

## 11.3 Rolling Deployment

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Deployment Method** | Rolling Update | Railway ใช้ Rolling Deployment โดย Default: สร้าง Instance ใหม่ก่อน แล้วค่อยหยุด Instance เก่า |
| **Health Check** | HTTP Health Endpoint | Railway ตรวจ `/healthz` ก่อนส่ง Traffic ไปยัง Instance ใหม่ |
| **Traffic Shift** | Gradual | Traffic ถูกเปลี่ยนไปยัง Instance ใหม่ทีละน้อย |
| **Rollback Trigger** | Health Check Failure | หาก Instance ใหม่ไม่ผ่าน Health Check ระบบ Rollback อัตโนมัติ |

## 11.4 Blue-Green Deployment (Concept)

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Current State** | Rolling Update (Railway Default) | ใช้ Rolling Update สำหรับ MVP เพื่อความเรียบง่าย |
| **Future State** | Blue-Green Deployment | เมื่อย้ายไป Kubernetes สามารถใช้ Blue-Green ได้เต็มรูปแบบ ตาม DEP-001 |
| **Blue Environment** | Active Production | Instance ที่กำลังรับ Traffic จากผู้ใช้จริง |
| **Green Environment** | Standby with New Version | Instance ใหม่ที่ถูก Deploy และทดสอบแล้ว พร้อมรับ Traffic |
| **Switch** | DNS/Load Balancer Swap | เปลี่ยน Traffic จาก Blue ไป Green เมื่อ Green ผ่านการทดสอบ |
| **Rollback** | Switch Back to Blue | เปลี่ยน Traffic กลับมาที่ Blue ทันที หาก Green มีปัญหา |

---

# 12. Rollback Strategy

## 12.1 Application Rollback

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Frontend (Vercel)** | Instant Rollback | Vercel รองรับ Rollback ไปยัง Previous Deployment ได้ทันทีผ่าน Dashboard หรือ CLI |
| **Backend (Railway)** | Redeploy Previous Image | Railway รองรับ Redeploy จาก Previous Deployment ได้ทันทีผ่าน Dashboard หรือ API |
| **Worker (Railway)** | Redeploy Previous Image | ใช้กลไกเดียวกับ Backend |
| **Trigger** | Manual หรือ Auto (Health Check Fail) | Rollback ถูก Trigger เมื่อ Health Check Fail หรือ Error Rate เกิน Threshold |
| **Time Target** | น้อยกว่า 5 นาที | Rollback ต้องเสร็จสิ้นภายใน 5 นาที (อ้างอิง DG-003) |
| **Notification** | Slack / Discord | แจ้งทีมทันทีเมื่อ Rollback เกิดขึ้น |

## 12.2 Database Rollback

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Migration Tool** | Prisma Migrate | ใช้ `prisma migrate` สำหรับ Forward Migration |
| **Rollback Method** | Reverse Migration Script | เตรียม Reverse SQL Script สำหรับทุก Migration ที่ทำการเปลี่ยนแปลง Schema |
| **Data Migration** | Separate from Schema Migration | แยก Data Migration ออกจาก Schema Migration เพื่อให้ Rollback Schema ไม่กระทบข้อมูล |
| **Before Migration** | Backup Database | สร้าง Backup ก่อน Run Migration ทุกครั้ง |
| **Testing** | Run on Staging First | ทุก Migration ต้องผ่าน Staging ก่อน Production |
| **Backward Compatibility** | 1-version Backward Compatible | Schema Change ต้อง Backward Compatible กับ Application Version ก่อนหน้า 1 เวอร์ชัน |

## 12.3 Infrastructure Rollback

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Railway** | Previous Deployment | Redeploy จาก Previous Deployment ID |
| **Vercel** | Previous Deployment | Revert ไปยัง Previous Production Deployment |
| **Environment Variables** | Version Controlled | เก็บ Environment Variable Template ใน `.env.example` สำหรับ Reference |
| **Supabase** | Point-in-time Recovery | Supabase Pro Plan รองรับ Point-in-time Recovery ของ PostgreSQL |
| **Redis** | No Persistent Rollback | Redis เป็น Cache + Queue ไม่ต้อง Rollback (ข้อมูลถูก Rebuild จาก Source of Truth) |

---

# 13. Backup Strategy

## 13.1 Database Backup

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Automatic Backup** | Supabase Daily Backup | Supabase Pro Plan ทำ Daily Automatic Backup ของ PostgreSQL |
| **Point-in-time Recovery** | Supabase PITR (Pro Plan) | กู้คืนข้อมูลไปยังจุดใดก็ได้ภายใน 7 วันย้อนหลัง |
| **Manual Backup** | pg_dump ก่อน Migration | สร้าง Manual Backup ก่อนรัน Database Migration ทุกครั้ง |
| **Backup Location** | Supabase Cloud (AWS S3) | Backup ถูกเก็บใน AWS S3 ที่ Encrypt ด้วย AES-256 |
| **Retention** | 7 วัน (Daily) + 4 สัปดาห์ (Weekly) | เก็บ Daily Backup 7 วัน และ Weekly Backup 4 สัปดาห์ |
| **Test Restore** | ทุก 30 วัน | ทดสอบ Restore Backup ไปยัง Staging ทุก 30 วัน เพื่อยืนยันว่า Backup ใช้ได้จริง |

## 13.2 Storage Backup

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Provider** | Supabase Storage (S3-backed) | Supabase Storage ใช้ AWS S3 เป็น Backend ซึ่งมี Durability 99.999999999% (11 9s) |
| **Redundancy** | AWS S3 Standard | S3 เก็บข้อมูลข้าม Availability Zone อัตโนมัติ |
| **Versioning** | Disabled (MVP) | เปิดใช้ S3 Versioning เมื่อจำเป็นในอนาคต |
| **CDN Cache** | Supabase CDN | ไฟล์ที่เข้าถึงบ่อยถูก Cache ที่ Edge |

## 13.3 Configuration Backup

| Aspect | Strategy | คำอธิบาย |
|---|---|---|
| **Source Code** | GitHub Repository | Source Code ทั้งหมดอยู่ใน Git มี Version Control ครบถ้วน |
| **Environment Variables** | GitHub Secrets + Documented in `.env.example` | Template ของ Environment Variables อยู่ใน Repository |
| **Prisma Schema** | `prisma/schema.prisma` ใน Git | Schema Definition เป็น Code-first อยู่ใน Version Control |
| **Migration History** | `prisma/migrations/` ใน Git | Migration Files ทั้งหมดถูก Track ด้วย Git |
| **GitHub Actions Workflows** | `.github/workflows/` ใน Git | CI/CD Configuration ทั้งหมดอยู่ใน Version Control |
| **Docker Configuration** | `Dockerfile`, `docker-compose.yml` ใน Git | Docker Configuration ทั้งหมดอยู่ใน Version Control |

---

# 14. Disaster Recovery

## 14.1 Recovery Objectives

| Objective | Target | คำอธิบาย |
|---|---|---|
| **RPO (Recovery Point Objective)** | 1 ชั่วโมง | ยอมรับการสูญเสียข้อมูลได้สูงสุด 1 ชั่วโมง (Supabase PITR) |
| **RTO (Recovery Time Objective)** | 30 นาที | ระบบต้องกลับมาให้บริการได้ภายใน 30 นาที |
| **MTBF (Mean Time Between Failures)** | 720 ชั่วโมง (30 วัน) | เป้าหมายเวลาเฉลี่ยระหว่าง Failure |
| **MTTR (Mean Time To Recovery)** | 15 นาที | เป้าหมายเวลาเฉลี่ยในการ Recover จาก Failure |

## 14.2 Failure Scenarios and Recovery Procedures

| Scenario | Impact | Recovery Procedure | RTO |
|---|---|---|---|
| **Frontend Down (Vercel)** | ผู้ใช้ไม่สามารถเข้าถึง Web Application | 1. ตรวจ Vercel Status Page 2. หาก Vercel ล่ม: Deploy Frontend ไป Netlify (Alternative) 3. อัปเดต DNS | 15 นาที |
| **Backend Down (Railway)** | API ไม่ตอบ Request | 1. ตรวจ Railway Dashboard 2. Redeploy Previous Version 3. หาก Railway ล่ม: Deploy ไป Render (Alternative) | 10 นาที |
| **Database Down (Supabase)** | ไม่สามารถอ่านเขียนข้อมูล | 1. ตรวจ Supabase Status Page 2. ใช้ Read Replica (ถ้ามี) 3. รอ Supabase Recovery (Managed Service) 4. หากยืดเยื้อ: Restore จาก Backup ไปยัง Supabase Project ใหม่ | 30 นาที |
| **Redis Down (Upstash)** | Cache Miss + Queue Stall | 1. Application ทำงานได้โดยไม่มี Cache (Degraded Mode) 2. Queue Jobs ถูก Buffer ใน Application Memory ชั่วคราว 3. รอ Upstash Recovery หรือสร้าง Instance ใหม่ | 5 นาที |
| **AI Provider Down** | AI Assistant ไม่ตอบ | 1. Automatic Fallback Chain: OpenAI → Gemini → Claude → Rule-based (อ้างอิง ADR-004) 2. แจ้ง User ว่า AI อยู่ใน Limited Mode | 0 นาที (Auto) |
| **Google Maps Down** | ไม่สามารถคำนวณเส้นทาง | 1. แสดง Cached Route Data (ถ้ามี) 2. แจ้งผู้ใช้ว่าบริการแผนที่ไม่พร้อมชั่วคราว 3. รอ Google Maps Recovery | 0 นาที (Graceful) |
| **Firebase FCM Down** | Push Notification ไม่ส่ง | 1. Notification ถูก Queue ใน Dead Letter Queue 2. Retry เมื่อ FCM กลับมาพร้อม 3. ผู้ใช้ยังเห็น In-app Notification ได้ | 0 นาที (Queued) |
| **GitHub Actions Down** | ไม่สามารถ Deploy ได้ | 1. Deploy ด้วยมือผ่าน Railway CLI + Vercel CLI 2. รอ GitHub Actions Recovery | 15 นาที (Manual) |
| **Complete Infrastructure Failure** | ระบบทั้งหมดล่ม | 1. Restore Database จาก Backup 2. Deploy Backend ไป Render (Alternative) 3. Deploy Frontend ไป Netlify (Alternative) 4. อัปเดต DNS 5. Verify ทุก Service | 60 นาที |

---

# 15. Monitoring Strategy

## 15.1 Metrics

| Metric Category | Metric | Tool | Threshold | Alert Action |
|---|---|---|---|---|
| **API Health** | `/healthz` Response | Grafana + Uptime Monitor | ไม่ตอบภายใน 5 วินาที | Restart Container |
| **API Response Time** | P95 Latency | OpenTelemetry → Grafana | P95 > 800ms (อ้างอิง PM-002) | Alert ไปยัง Slack |
| **Error Rate** | 5xx Error Percentage | Sentry + Grafana | > 1.0% (อ้างอิง TM-002) | Alert ไปยัง Slack + PagerDuty |
| **CPU Usage** | Container CPU | Railway Metrics + Grafana | > 70% | Auto-scale (Railway) |
| **Memory Usage** | Container Memory | Railway Metrics + Grafana | > 80% | Alert + Investigation |
| **Database Connections** | Active Connections | Supabase Dashboard | > 80% of Pool | Alert + Pool Expansion |
| **Queue Length** | BullMQ Pending Jobs | BullMQ Dashboard + Grafana | > 1000 Jobs | Alert + Scale Workers |
| **AI Response Time** | AI P95 First Response | OpenTelemetry → Grafana | P95 > 5 วินาที (อ้างอิง PM-003) | Alert + Check Provider Status |
| **Dashboard Load Time** | Frontend P95 Load | Vercel Analytics + Sentry | P95 > 2.5 วินาที (อ้างอิง PM-001) | Alert + Performance Investigation |

## 15.2 Logging

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **Library** | Winston | Standard Node.js Logger สำหรับ Backend (อ้างอิง System Architecture Section 19) |
| **Format** | Structured JSON | ทุก Log Entry เป็น JSON พร้อม `timestamp`, `level`, `message`, `requestId`, `module` |
| **Levels** | error, warn, info, debug | Production ใช้ `warn` ขึ้นไป Development ใช้ `debug` |
| **Transport** | Console + Grafana Loki | Development: Console, Production: Console + Grafana Loki |
| **Redaction** | Sensitive Data Filter | ห้าม Log Password, Token, API Key, PII (อ้างอิง PRIV-001) |
| **Request ID** | UUID per Request | ทุก Request มี `requestId` สำหรับ Correlation |
| **Retention** | 30 วัน | Log ถูกเก็บ 30 วัน ใน Grafana Loki |

### Log Format

```json
{
  "timestamp": "2026-08-02T13:30:00.000Z",
  "level": "info",
  "message": "Vehicle created successfully",
  "requestId": "req_8f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "module": "vehicle",
  "action": "vehicle.create",
  "actorId": "usr_anonymized_hash",
  "duration": 125
}
```

## 15.3 Distributed Tracing

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **SDK** | OpenTelemetry Node.js SDK | Vendor-neutral Tracing Standard |
| **Exporter** | OTLP Exporter → Grafana Tempo | ส่ง Trace Data ไปยัง Grafana Tempo สำหรับ Visualization |
| **Instrumentation** | Auto-instrumentation (HTTP, Express, Prisma) | Auto-instrument HTTP Requests, Express Routes และ Prisma Queries |
| **Trace Context** | W3C Trace Context | ใช้ W3C Standard สำหรับ Cross-service Trace Propagation |
| **Sampling** | Head-based Sampling (10%) | Sample 10% ของ Requests ใน Production เพื่อลด Cost |
| **Error Traces** | 100% Sampling | ทุก Error Request ถูก Trace 100% |

## 15.4 Alerting

| Alert Level | Channel | Response Time | คำอธิบาย |
|---|---|---|---|
| **Critical** | Slack + PagerDuty + Email | ภายใน 15 นาที | ระบบล่ม Data Loss หรือ Security Breach |
| **High** | Slack + Email | ภายใน 1 ชั่วโมง | Performance Degradation หรือ Error Rate สูง |
| **Medium** | Slack | ภายใน 4 ชั่วโมง | Capacity Warning หรือ Non-critical Service Down |
| **Low** | Slack (Digest) | Next Business Day | Informational Alerts เช่น Backup Complete, Deploy Complete |

---

# 16. Performance Strategy

## 16.1 CDN Strategy

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **Provider** | Vercel Edge Network | Vercel มี Edge Network กระจายทั่วโลก |
| **Static Assets** | Immutable Cache | HTML, CSS, JS, Images ถูก Cache ด้วย Content Hash ใน Filename |
| **Cache Control** | `public, max-age=31536000, immutable` | Static Assets ถูก Cache 1 ปี (เปลี่ยน Hash เมื่อเนื้อหาเปลี่ยน) |
| **API Response** | No CDN Cache | API Response ไม่ถูก Cache ที่ CDN (Cache ที่ Redis แทน) |
| **Edge Functions** | Vercel Edge Middleware | ใช้สำหรับ Redirect, Rewrite และ Geo-based Routing ในอนาคต |

## 16.2 Application Caching

| Cache Layer | Implementation | TTL | คำอธิบาย |
|---|---|---|---|
| **API Response Cache** | Upstash Redis | 5-60 นาที (ตาม Endpoint) | Cache API Response สำหรับ Read-heavy Endpoints เช่น Vehicle Profile, Battery State |
| **Session Cache** | Upstash Redis | 1 ชั่วโมง (ตาม JWT Expiry) | Cache User Session Data เพื่อลด Database Query |
| **AI Context Cache** | Upstash Redis | 15 นาที | Cache User Context ที่ Build สำหรับ AI Prompt |
| **Static Data Cache** | Upstash Redis | 24 ชั่วโมง | Cache Reference Data เช่น Charger Types, TOU Rates |
| **Browser Cache** | Service Worker | ตาม Cache Strategy | Cache Critical Resources สำหรับ PWA Offline Mode |
| **Database Query Cache** | Prisma Query Cache | 1 นาที (ตาม Query) | Cache Frequent Database Queries ที่ Prisma Level |

## 16.3 Compression

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **HTTP Compression** | Gzip / Brotli (Vercel + Railway) | Compress HTTP Response ด้วย Brotli (ถ้า Client รองรับ) หรือ Gzip |
| **Brotli Priority** | Brotli (Level 4) | ขนาดเล็กกว่า Gzip 15-25% สำหรับ Text-based Content |
| **Image Optimization** | Vercel Image Optimization | Vercel ทำ Auto Image Optimization (WebP, AVIF) |
| **API Payload** | Minimal JSON Response | ส่งเฉพาะ Field ที่จำเป็น ไม่ส่ง Internal Metadata ไปยัง Client |

## 16.4 Performance Optimization

| Optimization | Implementation | คำอธิบาย |
|---|---|---|
| **Code Splitting** | Vite Dynamic Import | แยก JavaScript Bundle ตาม Route เพื่อลด Initial Load Size |
| **Tree Shaking** | Vite Production Build | ลบ Dead Code ออกจาก Bundle |
| **Lazy Loading** | React.lazy + Suspense | โหลด Component เมื่อจำเป็น ไม่โหลดทั้งหมดพร้อมกัน |
| **Database Indexing** | Prisma Schema Index | สร้าง Index สำหรับ Column ที่ Query บ่อย (เช่น vehicle_id, user_id, created_at) |
| **Connection Pooling** | PgBouncer (Supabase) | ใช้ Connection Pool เพื่อลดจำนวน Connection ที่เปิดพร้อมกัน |
| **Prefetching** | React Query Prefetch | Prefetch Data ที่ User น่าจะต้องการถัดไป |

---

# 17. Security During Deployment

## 17.1 Transport Security

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **HTTPS** | TLS 1.3 (ทุก Endpoint) | การสื่อสารทั้งหมดต้องผ่าน HTTPS ห้ามใช้ HTTP (อ้างอิง SEC-001) |
| **SSL Certificate** | Managed by Vercel + Railway | SSL Certificate ถูกจัดการอัตโนมัติโดย Platform |
| **HSTS** | `Strict-Transport-Security` Header | บังคับให้ Browser ใช้ HTTPS เท่านั้น |
| **Redis TLS** | Upstash TLS (Required) | Connection ไปยัง Upstash Redis ต้องใช้ TLS |
| **Database TLS** | Supabase TLS (Default) | Connection ไปยัง Supabase PostgreSQL ใช้ TLS |

## 17.2 Authentication & Authorization

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **JWT** | Supabase Auth JWT | Access Token อายุ 1 ชั่วโมง, Refresh Token อายุ 7 วัน (อ้างอิง C4 Model Section 12.1) |
| **JWT Verification** | Auth Middleware | ทุก Protected API ตรวจ JWT Signature และ Expiration |
| **RBAC** | Role-based Access Control | owner, co-owner, admin Roles พร้อม Ownership Verification (อ้างอิง C4 Model Section 12.2) |
| **OAuth2** | Supabase Auth (Google/Apple) | รองรับ Social Login ผ่าน OAuth2 |

## 17.3 Secrets Protection

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **Storage** | GitHub Secrets + Railway Environment Variables | ห้ามเก็บ Secret ใน Source Code (อ้างอิง REPO-005) |
| **Docker** | Runtime Injection | ห้าม COPY `.env` เข้า Docker Image, Inject ผ่าน Environment Variables |
| **Logging** | Redaction Filter | Winston ต้อง Redact API Key, Token, Password จาก Log (อ้างอิง PRIV-001) |
| **Git** | `.gitignore` + `git-secrets` | `.env` อยู่ใน `.gitignore` และใช้ `git-secrets` ป้องกัน Secret Push |
| **Rotation** | ทุก 90 วัน | API Keys และ Service Role Keys ต้องถูก Rotate ตามกำหนด |

## 17.4 API Security

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **CORS** | Express CORS Middleware | อนุญาตเฉพาะ Frontend Domain ที่กำหนด (อ้างอิง C4 Model Section 12.4) |
| **Rate Limiting** | express-rate-limit | Global: 100 req/min, Auth: 10 req/min, AI: 20 req/min (อ้างอิง C4 Model Section 12.5) |
| **Input Validation** | Zod Schema | ตรวจสอบ Payload ทั้ง Client-side และ Server-side (อ้างอิง VAL-001) |
| **Error Sanitization** | RFC 7807 | ไม่เปิดเผย Stack Trace หรือ Internal Error Details (อ้างอิง ERR-001) |
| **Helmet** | Express Helmet Middleware | ตั้งค่า Security Headers (X-Frame-Options, X-Content-Type-Options, CSP) |
| **API Key Restriction** | Google Cloud Console | Google Maps API Key ถูก Restrict ด้วย Domain และ IP |

## 17.5 CI/CD Security

| Aspect | Implementation | คำอธิบาย |
|---|---|---|
| **Dependency Scan** | npm audit + Snyk | ตรวจ Vulnerability ใน Dependencies ทุก Build |
| **Secret Scanning** | GitHub Secret Scanning | GitHub ตรวจ Secret ที่ถูก Push เข้า Repository อัตโนมัติ |
| **Branch Protection** | GitHub Branch Rules | main ต้อง PR + CI Pass + 1 Approval ห้าม Direct Push |
| **CODEOWNERS** | `.github/CODEOWNERS` | กำหนดผู้รับผิดชอบ Review แต่ละ Directory |
| **Signed Commits** | GPG Signed Commits (Recommended) | แนะนำให้ Sign Commit เพื่อยืนยันตัวตนผู้ Commit |

---

# 18. Operational Checklist

## 18.1 Before Deployment

| Check | คำอธิบาย | Responsible |
|---|---|---|
| ✅ CI Pipeline ผ่านทั้ง Lint, Test และ Security Scan | ตรวจว่า Pipeline สีเขียวทั้งหมด | Developer |
| ✅ Code Review ผ่านอย่างน้อย 1 Approval | PR ถูก Review และ Approve แล้ว | Reviewer |
| ✅ Database Migration ถูกทดสอบบน Staging | Migration รันสำเร็จบน Staging โดยไม่มี Error | Developer |
| ✅ Environment Variables ครบถ้วน | ตรวจว่า Secret ใหม่ถูกเพิ่มใน GitHub Secrets และ Railway | DevOps |
| ✅ Staging Smoke Test ผ่าน | Health Check และ Critical API ทำงานได้บน Staging | QA |
| ✅ CHANGELOG ถูกอัปเดต | บันทึกการเปลี่ยนแปลงใน CHANGELOG | Developer |
| ✅ Version Bump ถูกต้อง | package.json version ตรงกับ Release Tag | Developer |
| ✅ Backup Database ก่อน Migration | สร้าง Manual Backup หาก Migration มีการเปลี่ยน Schema | DevOps |
| ✅ Rollback Plan พร้อม | มีแผน Rollback ที่ทดสอบแล้ว | DevOps |

## 18.2 During Deployment

| Check | คำอธิบาย | Responsible |
|---|---|---|
| ✅ Monitor Deployment Progress | ตรวจ Railway Dashboard และ Vercel Dashboard | DevOps |
| ✅ Watch Error Rate | ตรวจ Sentry สำหรับ Error ใหม่ที่เกิดขึ้น | Developer |
| ✅ Watch Response Time | ตรวจ Grafana สำหรับ Latency Spike | Developer |
| ✅ Verify Health Check | เรียก `/healthz` และ `/readyz` Endpoints | DevOps |
| ✅ Verify Database Connection | ตรวจว่า Prisma เชื่อมต่อ Database สำเร็จ | DevOps |
| ✅ Verify Redis Connection | ตรวจว่า BullMQ Queue ทำงานได้ | DevOps |
| ✅ Verify External Services | ตรวจว่า AI Provider, Google Maps, FCM ตอบกลับ | Developer |

## 18.3 After Deployment

| Check | คำอธิบาย | Responsible |
|---|---|---|
| ✅ Production Health Check ผ่าน | `/healthz` ตอบ 200 OK | DevOps |
| ✅ Critical User Flow ทำงานได้ | Login, Add Vehicle, View Dashboard, AI Chat | QA |
| ✅ Error Rate ปกติ | Sentry ไม่มี New Error Spike | Developer |
| ✅ Response Time ปกติ | Grafana แสดง P95 ภายใน Threshold | Developer |
| ✅ Notification ส่งสำเร็จ | ทดสอบ Push Notification | QA |
| ✅ Create GitHub Release | สร้าง Release พร้อม Release Notes | Developer |
| ✅ แจ้งทีม | ส่ง Deployment Summary ไปยัง Slack / Discord | DevOps |
| ✅ Monitor 1 ชั่วโมง | ตรวจ Metrics และ Errors หลัง Deploy | Developer |

---

# 19. Deployment Decision Matrix

ตารางช่วยตัดสินใจว่าควร Deploy อย่างไรในแต่ละสถานการณ์:

| Scenario | Strategy | Approval | Migration | Rollback Plan |
|---|---|---|---|---|
| **Feature Release (Minor)** | Rolling Update ไป Staging → Production | Lead Engineer Approval | Run Migration on Staging → Production | Redeploy Previous Version |
| **Bug Fix (Patch)** | Rolling Update ไป Staging → Production | Lead Engineer Approval (Fast-track) | ไม่มี Migration (Code-only) | Redeploy Previous Version |
| **Hotfix (Critical)** | Direct to Staging → Production (Expedited) | Lead Engineer Approval (Immediate) | เฉพาะ Data Fix (ถ้าจำเป็น) | Redeploy Previous Version |
| **Database Migration** | Run on Staging → Verify → Run on Production | Lead Engineer + DBA Approval | Prisma Migrate + Backup Before | Reverse Migration Script |
| **Configuration Change** | Update Environment Variables | Lead Engineer Approval | ไม่มี | Revert Environment Variables |
| **Infrastructure Change** | Update Railway / Vercel / Supabase Config | Lead Engineer Approval | ไม่มี | Revert Configuration |
| **Dependency Update** | Standard CI/CD Pipeline | Lead Engineer Approval | ไม่มี | Redeploy Previous Version |
| **Security Patch** | Expedited Pipeline (Skip Non-critical Tests) | Lead Engineer Approval (Immediate) | ไม่มี | Redeploy Previous Version |

---

# 20. Risks

ความเสี่ยงที่เกี่ยวข้องกับ Deployment และแนวทางรับมือ:

| Risk ID | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| DR-001 | **Railway Service Outage** | Low | High | มี Alternative Provider (Render) ที่ทดสอบไว้แล้ว Docker Image เดียวกัน Deploy ได้ทันที |
| DR-002 | **Vercel Service Outage** | Low | Medium | Frontend เป็น Static Files สามารถ Deploy ไป Netlify หรือ Cloudflare Pages ได้ทันที |
| DR-003 | **Supabase Service Outage** | Low | Critical | ใช้ Daily Backup + PITR สำหรับ Recovery มี Runbook สำหรับ Restore ไปยัง Project ใหม่ |
| DR-004 | **GitHub Actions Outage** | Low | Medium | มี Manual Deploy Script ด้วย Railway CLI + Vercel CLI เป็น Fallback |
| DR-005 | **Secret Exposure** | Low | Critical | GitHub Secret Scanning + git-secrets + ห้าม Hardcode Secret + Rotate ทุก 90 วัน |
| DR-006 | **Database Migration Failure** | Medium | High | ทุก Migration ต้องผ่าน Staging ก่อน + Backup ก่อน Run + มี Reverse Script |
| DR-007 | **Container Image Vulnerability** | Medium | Medium | npm audit + Snyk ใน CI Pipeline + Alpine Base Image ลด Attack Surface |
| DR-008 | **Vendor Lock-in** | Medium | Medium | ใช้ Docker Container สำหรับ Backend (Portable) + Prisma ORM (Database Agnostic) + OpenTelemetry (Vendor-neutral Observability) |
| DR-009 | **Cost Escalation จาก AI API** | Medium | Medium | ใช้ Rate Limiting + Cache AI Context + Monitor Usage Dashboard + ตั้ง Budget Alert |
| DR-010 | **Upstash Redis Data Loss** | Low | Low | Redis เป็น Cache + Queue ไม่ใช่ Source of Truth ข้อมูลถูก Rebuild จาก PostgreSQL |

---

# 21. Future Expansion

## 21.1 Multi-region Deployment

| Aspect | Current State | Future State | เหตุผล |
|---|---|---|---|
| **Frontend** | Vercel (Global CDN) | Vercel (Global CDN) | Vercel มี Edge Network ทั่วโลกอยู่แล้ว ไม่ต้องเปลี่ยน |
| **Backend** | Railway (Single Region) | Railway Multi-region หรือ Cloud Run (Multi-region) | Deploy API ใน Region ใกล้ผู้ใช้ (เช่น ap-southeast-1 สำหรับ Thailand) |
| **Database** | Supabase (Single Region) | Supabase + Read Replica | สร้าง Read Replica ใน Region ใกล้ผู้ใช้เพื่อลด Latency |
| **Redis** | Upstash (Single Region) | Upstash Global Database | Upstash Global ให้ Read Replica ทั่วโลกอัตโนมัติ |
| **Trigger** | User Base > 10,000 หรือ Latency > 500ms จาก Target Region | - | Expand เมื่อ Performance ไม่ถึงเป้าสำหรับผู้ใช้ใน Region ที่เพิ่มขึ้น |

## 21.2 Container Orchestration

| Aspect | Current State | Future State | เหตุผล |
|---|---|---|---|
| **Orchestrator** | Railway (Managed) | Kubernetes (GKE / EKS) | ต้องการ Fine-grained Scaling, Service Mesh และ Blue-Green Deployment เต็มรูปแบบ |
| **Service Mesh** | ไม่มี | Istio / Linkerd | Traffic Management, Mutual TLS และ Observability ระหว่าง Services |
| **Auto Scaling** | Railway Auto-scale | Kubernetes HPA | Horizontal Pod Autoscaler ตาม CPU, Memory หรือ Custom Metrics |
| **Deployment Strategy** | Rolling Update | Blue-Green / Canary | ลดความเสี่ยงในการ Deploy ด้วย Canary Release |
| **Trigger** | Team Size > 5 หรือ Service Count > 3 | - | Expand เมื่อ Modular Monolith ถูก Extract เป็น Microservices |

## 21.3 Kubernetes Readiness

สถาปัตยกรรมปัจจุบันออกแบบให้พร้อมสำหรับ Kubernetes Migration:

| Readiness Factor | Status | คำอธิบาย |
|---|---|---|
| **Docker Image** | ✅ พร้อม | Backend และ Worker ใช้ Docker Image อยู่แล้ว |
| **Health Check** | ✅ พร้อม | มี `/healthz` และ `/readyz` Endpoints |
| **Stateless Application** | ✅ พร้อม | Backend API เป็น Stateless (Session อยู่ใน Redis) |
| **Configuration** | ✅ พร้อม | Configuration ทั้งหมดอยู่ใน Environment Variables |
| **Logging** | ✅ พร้อม | Structured JSON Logging ที่ Kubernetes รองรับ |
| **Graceful Shutdown** | ✅ พร้อม | Application รองรับ SIGTERM สำหรับ Graceful Shutdown |
| **Horizontal Scaling** | ✅ พร้อม | Application เป็น Stateless สามารถ Scale Horizontal ได้ |
| **Service Discovery** | ⬜ ต้องเพิ่ม | ต้องเพิ่ม DNS-based Service Discovery เมื่อ Migrate |
| **Kubernetes Manifests** | ⬜ ต้องสร้าง | ต้องสร้าง Deployment, Service, Ingress, HPA Manifests |
| **Helm Charts** | ⬜ ต้องสร้าง | ต้องสร้าง Helm Charts สำหรับ Repeatable Deployment |

---

# 22. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.0.0 | 2026-08-02 | Complete | Principal Cloud Architect & DevOps Lead | Initial Deployment Architecture. 4 Environments (Development, Testing, Staging, Production). Infrastructure: Vercel (Frontend), Railway (Backend), Supabase (Database/Auth/Storage/Realtime), Upstash Redis (Cache/Queue), Firebase FCM (Push), OpenAI/Gemini/Claude (AI), Google Maps. CI/CD: GitHub Actions (6 stages). Branch Strategy: GitHub Flow with 5 branch types. Docker Multi-stage Build (Alpine). Release: SemVer + Rolling Deployment. Rollback: Application + Database + Infrastructure. Backup: Supabase Daily + PITR. DR: RPO 1h / RTO 30min. Monitoring: Sentry + Grafana + OpenTelemetry + Winston. Performance: Vercel CDN + Redis Cache + Brotli. Security: TLS 1.3 + JWT + RBAC + Rate Limiting + Secret Rotation. Operational Checklists (Before/During/After). Decision Matrix (8 scenarios). Risks (10 identified). Future: Multi-region + Kubernetes readiness. |
