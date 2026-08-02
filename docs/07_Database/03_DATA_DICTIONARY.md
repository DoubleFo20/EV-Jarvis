---
id: DOC-017
title: Data Dictionary
version: 1.0.0
last_updated: 2026-08-02
status: Complete
author: Chief Database Architect
references:
  - docs/01_Project_Management/MASTER_CONTEXT.md
  - docs/02_Requirements/05_REQUIREMENTS.md
  - docs/03_Architecture/01_SYSTEM_ARCHITECTURE.md
  - docs/03_Architecture/03_TECH_STACK.md
  - docs/07_Database/01_DATABASE_DESIGN.md
  - docs/07_Database/02_ERD.md
---

# Data Dictionary — EV-JARVIS

> **Document ID:** DOC-017
> **Version:** 1.0.0
> **Status:** Complete
> **Project:** EV-JARVIS
> **Owner:** Chief Database Architect
> **Last Updated:** 2026-08-02
> **Database Engine:** PostgreSQL 15+ (Supabase)

---

## 1. Metadata

เอกสารฉบับนี้รวบรวมพจนานุกรมข้อมูล (Data Dictionary) ระดับ Production-ready สำหรับระบบ EV-JARVIS เพื่อให้วิศวกรซอฟต์แวร์และนักวิเคราะห์ข้อมูลใช้เป็นแหล่งอ้างอิงกลาง (Single Source of Truth) ในการพัฒนาและการ Query ฐานข้อมูล

---

## 2. Purpose

เพื่ออธิบายความหมาย ชนิดข้อมูล กฎเกณฑ์ ข้อจำกัด (Constraints) นโยบายความปลอดภัย (RLS) และจุดประสงค์ทางธุรกิจของทุกฟิลด์ในทุกตารางภายในฐานข้อมูล ป้องกันความสับสนในการตั้งชื่อและการใช้งาน

---

## 3. Scope

ครอบคลุมทุกตาราง (Entities) ตามที่ระบุไว้ใน `02_ERD.md` รวมไปถึงมาตรฐานการกำหนดชนิดข้อมูล การทำ Security Classification และแนวทางการขยายผลด้วย AI (Vector, LLM Context)

---

## 4. Naming Convention

- **Tables:** ใช้ตัวพิมพ์เล็กทั้งหมด เชื่อมด้วย Underscore แบบพหูพจน์ (Snake Case, Plural) เช่น `users`, `charging_sessions`
- **Columns:** ใช้ตัวพิมพ์เล็กทั้งหมด เชื่อมด้วย Underscore แบบเอกพจน์ (Snake Case) เช่น `first_name`, `created_at`
- **Foreign Keys:** ลงท้ายด้วย `_id` เสมอ (เช่น `vehicle_id`)
- **Booleans:** ขึ้นต้นด้วยคำกริยาแสดงสถานะ เช่น `is_`, `has_`, `can_` (เช่น `is_active`)
- **Indexes:** นำหน้าด้วย `idx_` (เช่น `idx_users_email`)
- **Constraints:** นำหน้าด้วยชนิดตัวย่อ เช่น `fk_`, `uq_`, `chk_`

---

## 5. Schema Overview

ฐานข้อมูล EV-JARVIS จัดการผ่าน Schema `public` สำหรับ Business Logic หลัก และเชื่อมต่อกับ Schema `auth` (จัดการโดย Supabase) สำหรับการทำ Authentication

---

## 6. Data Type Standard

มาตรฐานชนิดข้อมูล (Data Types) ใน PostgreSQL:

- **UUID Standard:** ใช้ `UUID` แทน `INTEGER` สำหรับ Primary Keys ทุกตาราง สร้างผ่านฟังก์ชัน `uuid_generate_v4()` ป้องกันปัญหา IDOR และการชนกันระดับสากล
- **Timestamp Standard:** ใช้ `TIMESTAMPTZ` (Timestamp with Time Zone) เสมอ เพื่อให้บันทึกเป็น UTC+0 ป้องกันปัญหาเวลาคลาดเคลื่อนข้ามโซน
- **Boolean Standard:** ใช้ `BOOLEAN` และมักจะตั้งค่า Default เป็น `FALSE` เสมอ ห้ามเก็บเป็น `0`/`1`
- **Enum Standard:** สร้าง Enum Type ของ Postgres หากคอลัมน์นั้นมีค่าจำกัดไม่เกิน 10 ค่า เช่น `trip_status ('PLANNED', 'IN_PROGRESS', 'COMPLETED')`
- **JSONB Standard:** ใช้ `JSONB` ไม่ใช่ `JSON` สำหรับฟิลด์ข้อมูลที่โครงสร้างไม่แน่นอน เพราะประมวลผลเร็วและทำ GIN Index ได้

---

## 7. Common Constraints

- **Unique Constraints (`UQ`):** ค่าต้องไม่ซ้ำกันทั้งฐานข้อมูล (เช่น อีเมล, เลขตัวถังรถ)
- **Check Constraints (`CHK`):** ใช้กรองความถูกต้องเบื้องต้น (เช่น `soc >= 0 AND soc <= 100`)
- **Foreign Key Rules (`FK`):** 
  - `ON DELETE CASCADE` หากตารางลูกไม่สามารถอยู่รอดได้โดยไม่มีตารางแม่ (เช่น รถถูกลบ ข้อมูล Telemetry ต้องถูกลบ)
  - `ON DELETE SET NULL` หรือ `RESTRICT` หากตารางแม่หายไปแต่ข้อมูลลูกจำเป็นต้องเก็บไว้เป็นประวัติ

---

## 8. Reserved Columns

ทุกตาราง (ยกเว้นตารางเชื่อม) ควรมีคอลัมน์มาตรฐานดังนี้:

- `created_at`: (`TIMESTAMPTZ`) บันทึกเวลาสร้าง (Default: `NOW()`)
- `updated_at`: (`TIMESTAMPTZ`) บันทึกเวลาอัปเดตล่าสุด (Trigger ควบคุม)
- `deleted_at`: (`TIMESTAMPTZ`, Nullable) ใช้สำหรับการทำ Soft Delete
- `created_by`: (`UUID`, Nullable) รหัสผู้สร้าง (Audit Trail)
- `updated_by`: (`UUID`, Nullable) รหัสผู้แก้ไข (Audit Trail)
- `version`: (`INTEGER`) หมายเลขเวอร์ชันของแถวนั้นๆ ป้องกัน Optimistic Concurrency Control (ถ้ามี)

---

## 9. Table Dictionary

*(รวมตารางที่สำคัญตามขอบเขตของโปรเจกต์ EV-JARVIS)*

### 9.1 `users`
- **Description:** ตารางผู้ใช้งานระบบหลัก (แยกต่างหากจาก `auth.users` เพื่อใส่ข้อมูลธุรกิจ)
- **Business Purpose:** ระบุตัวตนและการเชื่อมโยงข้อมูลรถยนต์, การชาร์จ ไปยังบุคคลที่รับผิดชอบ
- **Lifecycle:** Soft Delete เมื่อยกเลิกบัญชี
- **Security Classification:** Confidential (PII)
- **RLS Considerations:** Owner เท่านั้นที่สามารถอ่านและแก้ไขข้อมูลตนเอง
- **Columns:**

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK, FK (`auth.users.id`) | `123e4...` | ต้องเป็น UUID |
| `email` | String | No | - | UQ | `user@test.com` | Email format |
| `is_active`| Boolean| No | `TRUE` | - | `true` | - |
| `deleted_at`| Timestamptz| Yes| - | - | `null` | - |

### 9.2 `user_profiles`
- **Description:** ข้อมูลส่วนบุคคลเพิ่มเติมของผู้ใช้งาน
- **RLS Considerations:** Owner-only

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`), UQ | `...` | - |
| `full_name` | String | Yes | - | - | `Somchai E.` | Max 100 chars |
| `phone_number`| String | Yes | - | UQ | `+66812345678` | E.164 format |

### 9.3 `vehicles`
- **Description:** ตารางข้อมูลรถยนต์ไฟฟ้า
- **Business Purpose:** เป็น Entity กลางของข้อมูล Telemetry และการเชื่อมต่อ AI
- **Lifecycle:** Soft Delete (ขายรถ/ยกเลิกใช้)
- **Security Classification:** Internal

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`) | `...` | - |
| `vin` | String | No | - | UQ | `NLHA23...` | 17-char VIN |
| `make` | String | No | - | - | `Tesla` | - |
| `model` | String | No | - | - | `Model 3` | - |
| `current_soc`| Int | Yes | `null` | CHK (0-100) | `80` | Cache ล่าสุด |

### 9.4 `batteries`
- **Description:** ข้อมูลเฉพาะเจาะจงของแบตเตอรี่รถยนต์
- **Future AI Fields:** AI วิเคราะห์ SOH อัตโนมัติ

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`), UQ | `...` | - |
| `capacity_kwh`| Float| No | - | - | `75.0` | > 0 |
| `soh_percent` | Float| Yes | `100` | CHK (0-100) | `98.5` | - |

### 9.5 `charging_stations`
- **Description:** ข้อมูลพิกัดสถานีชาร์จสาธารณะ
- **JSONB Fields:** `plug_types` เก็บสเปกหัวชาร์จที่หลากหลาย

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `name` | String | No | - | - | `PEA Volta BKK` | - |
| `latitude` | Float | No | - | - | `13.7563` | -90 to 90 |
| `longitude`| Float | No | - | - | `100.5018` | -180 to 180|
| `plug_types`| JSONB | No | `[]` | - | `["CCS2", "CHAdeMO"]` | Array of Enums |

### 9.6 `charging_sessions`
- **Description:** ประวัติการชาร์จไฟของรถแต่ละคัน
- **Business Purpose:** สรุปค่าใช้จ่ายและประสิทธิภาพการชาร์จ

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `station_id` | UUID | Yes | - | FK (`charging_stations.id`) | `...` | - |
| `start_time` | Timestamptz| No | - | - | `2026...` | < end_time |
| `end_time` | Timestamptz| Yes| - | - | `...` | - |
| `kwh_added` | Float | Yes| - | - | `30.5` | >= 0 |
| `total_cost` | Float | Yes| - | - | `150.00` | >= 0 |

### 9.7 `trips`
- **Description:** ประวัติและแผนการเดินทาง

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `status` | Enum | No | `PLANNED`| - | `COMPLETED`| Enum TripStatus |
| `distance_km`| Float | Yes| - | - | `120.5` | >= 0 |

### 9.8 `trip_statistics`
- **Description:** สถิติสรุปภาพรวมจากการเดินทาง (แยกเพื่อประสิทธิภาพการคำนวณ)

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `trip_id` | UUID | No | - | FK (`trips.id`), UQ | `...` | - |
| `avg_kwh_100km`| Float| No | - | - | `14.2` | >= 0 |

### 9.9 `maintenance_records`
- **Description:** ประวัติการเข้าบำรุงรักษา

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `service_date`| Timestamptz| No | - | - | `2026-05...`| - |
| `description`| String | No | - | - | `Change Tires`| - |

### 9.10 `telemetry`
- **Description:** ข้อมูล Real-time ส่งจากรถ (Time-series)
- **Retention Policy:** 30 วันก่อนย้ายไป `gps_history` / `energy_usage`

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `timestamp` | Timestamptz| No | - | - | `2026-08...`| - |
| `speed_kmh` | Float | No | `0` | - | `90.5` | >= 0 |
| `soc_percent`| Int | No | - | CHK (0-100) | `85` | - |

### 9.11 `gps_history`
- **Description:** ประวัติพิกัดรถยนต์รายนาที แยกเพื่อไม่ให้หนักตารางหลัก

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `timestamp` | Timestamptz| No | - | - | `2026...` | - |
| `latitude` | Float | No | - | - | `13.7` | - |
| `longitude` | Float | No | - | - | `100.5`| - |

### 9.12 `sensor_data`
- **Description:** ข้อมูลเซ็นเซอร์เชิงลึก (ลมยาง, แอร์)
- **JSONB Fields:** `raw_data` เก็บค่าจาก API รถ

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `raw_data` | JSONB | No | - | - | `{"tire_pressure": 35}` | - |

### 9.13 `energy_usage`
- **Description:** สถิติพลังงานสะสมรายวัน

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `vehicle_id` | UUID | No | - | FK (`vehicles.id`) | `...` | - |
| `date` | Date | No | - | UQ (`date`, `vehicle_id`)| `2026-08-01`| - |
| `kwh_used` | Float | No | - | - | `25.5` | - |

### 9.14 `alerts` & 9.15 `notifications`
- **Description:** แจ้งเตือนระดับระบบ (Alerts - เครื่องยนต์มีปัญหา) และข้อความให้ผู้ใช้ (Notifications)

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`) | `...` | - |
| `title` | String | No | - | - | `Battery Low`| - |
| `is_read` | Boolean| No | `FALSE` | - | `false` | - |

### 9.16 `roles` & 9.17 `permissions`
- **Description:** RBAC Management
- **Columns:** `id`, `name`, `description`

### 9.18 `api_keys`
- **Description:** คีย์สำหรับการเข้าใช้งานผ่าน Developer API
- **Security Classification:** Strictly Confidential

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`) | `...` | - |
| `key_hash` | String | No | - | UQ | `$argon2...` | Hashed only |

### 9.19 `settings`
- **Description:** การตั้งค่าแอป

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`) | `...` | - |
| `preferences`| JSONB | No | `{}` | - | `{"theme":"dark"}` | - |

### 9.20 `integrations`
- **Description:** จัดการสถานะเชื่อมต่อ Third-Party (เช่น Google API)

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`) | `...` | - |
| `provider` | String | No | - | - | `GOOGLE` | - |
| `tokens` | JSONB | No | - | - | `{"refresh":"..."}`| Encrypted |

### 9.21 `system_logs` & 9.22 `audit_logs`
- **Description:** บันทึกการกระทำสำคัญ
- **RLS:** Admin-only access

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `action` | String | No | - | - | `VEHICLE_DELETE`| - |
| `payload` | JSONB | Yes| - | - | `{"before":...}`| - |

### 9.23 `ai_conversations`
- **Description:** ประวัติการคุยของระบบ AI Assistant

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `user_id` | UUID | No | - | FK (`users.id`) | `...` | - |
| `title` | String | No | - | - | `Trip to BKK`| - |

### 9.24 `ai_memory`
- **Description:** ข้อความบริบทของ AI รองรับระบบ Vector RAG

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `conversation_id`| UUID | No | - | FK (`ai_conversations.id`)| `...` | - |
| `role` | Enum | No | - | - | `USER` / `ASSISTANT`| Enum AIRole |
| `content` | Text | No | - | - | `แผนที่ไหนดี?`| - |
| `embedding` | Vector| Yes| - | - | `[0.1, -0.2...]`| 1536 dims |

### 9.25 `ai_feedback`
- **Description:** การประเมินคุณภาพคำตอบของ AI

| Column | Type | Null | Default | Constraints | Example | Validation Rules |
|---|---|---|---|---|---|---|
| `id` | UUID | No | `uuid_v4()` | PK | `...` | - |
| `memory_id` | UUID | No | - | FK (`ai_memory.id`)| `...` | - |
| `is_helpful` | Boolean| No | - | - | `true` | - |

---

## 10. Glossary

- **Telemetry:** ข้อมูลที่ถูกส่งมาจากตัวรถยนต์ไฟฟ้าผ่านอินเทอร์เน็ต เช่น สถานะแบต (SOC), ความเร็ว
- **SOC (State of Charge):** ปริมาณพลังงานแบตเตอรี่คงเหลือ หน่วยเป็นเปอร์เซ็นต์ (0-100%)
- **SOH (State of Health):** ความเสื่อมสภาพของแบตเตอรี่ หน่วยเป็นเปอร์เซ็นต์ (100% คือสภาพใหม่)
- **RLS (Row Level Security):** นโยบายจำกัดสิทธิ์ในระดับแถวข้อมูล ป้องกันผู้ใช้ดึงข้อมูลของผู้อื่น

---

## 11. Abbreviations

- **PK:** Primary Key
- **FK:** Foreign Key
- **UQ:** Unique Constraint
- **CHK:** Check Constraint
- **PII:** Personally Identifiable Information
- **RAG:** Retrieval-Augmented Generation

---

## 12. Best Practices

- ห้ามใช้ `SELECT *` ในชั้น Business Logic ควรระบุคอลัมน์ที่ต้องการใช้ดึงชัดเจน
- หากมีการเปลี่ยนแปลงโครงสร้าง (Schema Evolution) ต้องทำผ่าน Prisma Migration (`.sql` files) เสมอ
- การจัดเก็บข้อมูลเวลา (Timestamp) ต้องส่งมาเป็น UTC จาก Backend และ Frontend ทำหน้าที่ปรับ Timezone
- อย่าใช้ฟิลด์ JSONB สำหรับข้อมูลที่มีโครงสร้างตายตัวและจำเป็นต้องทำ Relation การเข้ารหัส (JOIN) ให้แยกเป็นตารางแทน

---

## 13. Revision History

| Version | Date | Status | Author | Change Description |
|---|---|---|---|---|
| 1.0.0 | 2026-08-02 | Complete | Chief Database Architect | จัดทำ Data Dictionary แบบครอบคลุมทุกตาราง (Users, Vehicles, AI Memory, Telemetry) กำหนดมาตรฐานชนิดข้อมูล การตั้งชื่อ และเตรียมความพร้อมสำหรับ AI (Vector Embedding) |
