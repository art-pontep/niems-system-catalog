# Google Sheet Setup Guide

## สร้าง Google Sheet สำหรับ System Catalog

### 1. สร้าง Spreadsheet ใหม่

1. ไปที่ [Google Sheets](https://sheets.google.com/)
2. คลิก **+ Blank** เพื่อสร้าง Spreadsheet ใหม่
3. ตั้งชื่อ: `System Catalog Database`

### 2. สร้าง Sheet: `systems`

สร้าง Sheet แรกชื่อ `systems` พร้อม Headers ดังนี้:

| Column | Description | Type | Required |
|--------|-------------|------|----------|
| ID | ระบุ ID อัตโนมัติ (EXT-0001, INT-0001) | Auto | ✅ |
| Name | ชื่อระบบ | Text | ✅ |
| Description | รายละเอียดระบบ | Text | ❌ |
| Business Owner | หน่วยงานเจ้าของ | Text | ❌ |
| Technical Owner | ทีมเทคนิค | Text | ❌ |
| Overall Status | สถานะ (active, in-develop, review, planning, retired) | Dropdown | ❌ |
| Category | ประเภท (core, support, infrastructure) | Dropdown | ❌ |
| System Type | ชนิด (internal, external) | Dropdown | ❌ |
| Go Live Date | วันที่เปิดใช้งาน (YYYY-MM-DD) | Date | ❌ |
| Goal | เป้าหมาย | Text | ❌ |
| Created Date | วันที่สร้าง (Auto) | Auto | - |
| Created By | ผู้สร้าง (Auto) | Auto | - |
| Last Updated | วันที่แก้ไขล่าสุด (Auto) | Auto | - |
| Last Updated By | ผู้แก้ไขล่าสุด (Auto) | Auto | - |

**คัดลอก Headers นี้ไปวางในแถวที่ 1:**
```
ID	Name	Description	Business Owner	Technical Owner	Overall Status	Category	System Type	Go Live Date	Goal	Created Date	Created By	Last Updated	Last Updated By
```

### 3. สร้าง Sheet: `requirements`

สร้าง Sheet ที่สองชื่อ `requirements` พร้อม Headers ดังนี้:

| Column | Description | Type | Required |
|--------|-------------|------|----------|
| ID | ระบุ ID อัตโนมัติ (REQ-0001, NONREQ-0001) | Auto | ✅ |
| System ID | ID ของระบบที่เกี่ยวข้อง | Text | ✅ |
| Title | หัวข้อ Requirement | Text | ✅ |
| Type | ประเภท (functional, non-functional) | Dropdown | ❌ |
| Priority | ความสำคัญ (high, medium, low) | Dropdown | ❌ |
| Status | สถานะ (done, in-develop, pending) | Dropdown | ❌ |
| Created Date | วันที่สร้าง (Auto) | Auto | - |
| Created By | ผู้สร้าง (Auto) | Auto | - |
| Last Updated | วันที่แก้ไขล่าสุด (Auto) | Auto | - |
| Last Updated By | ผู้แก้ไขล่าสุด (Auto) | Auto | - |

**คัดลอก Headers นี้ไปวางในแถวที่ 1:**
```
ID	System ID	Title	Type	Priority	Status	Created Date	Created By	Last Updated	Last Updated By
```

### 4. เพิ่ม Data Validation (Optional)

#### สำหรับ Systems Sheet:

**Overall Status:**
- คลิกคอลัมน์ F (Overall Status)
- Data → Data validation
- Criteria: List of items
- Values: `active,in-develop,review,planning,retired`

**Category:**
- คลิกคอลัมน์ G (Category)
- Data → Data validation
- Criteria: List of items
- Values: `core,support,infrastructure`

**System Type:**
- คลิกคอลัมน์ H (System Type)
- Data → Data validation
- Criteria: List of items
- Values: `internal,external`

#### สำหรับ Requirements Sheet:

**Type:**
- คลิกคอลัมน์ D (Type)
- Data → Data validation
- Criteria: List of items
- Values: `functional,non-functional`

**Priority:**
- คลิกคอลัมน์ E (Priority)
- Data → Data validation
- Criteria: List of items
- Values: `high,medium,low`

**Status:**
- คลิกคอลัมน์ F (Status)
- Data → Data validation
- Criteria: List of items
- Values: `done,in-develop,pending`

### 5. Get Sheet ID

1. เปิด Google Sheet ของคุณ
2. ดู URL ในแถบ Address:
   ```
   https://docs.google.com/spreadsheets/d/1DOEJwB_XyZ.../edit
                                           ^^^^^^^^
                                           Sheet ID
   ```
3. คัดลอกส่วน Sheet ID ไปใช้ใน `backend.gs`

### 6. Share Settings

1. คลิก **Share** มุมขวาบน
2. General access: **Restricted** (Only people added can access)
3. เพิ่มตัวเอง (email ที่จะใช้งาน)
4. Role: **Editor**

### 7. ตัวอย่างข้อมูล

#### Systems Sheet:
```
ID          Name                    Business Owner  Technical Owner  Overall Status  Category        System Type
EXT-0001    การให้บริการคลาวด์       สพฉ.            iNET            active          infrastructure   external
INT-0001    ระบบจองห้องประชุม        สพฉ.            NIEMS           in-develop      support         internal
```

#### Requirements Sheet:
```
ID          System ID   Title                           Type            Priority    Status
REQ-0001    INT-0001    จองห้องประชุมภายในองค์กรได้       functional      high        pending
NONREQ-0001 INT-0001    ระบบล็อคอินด้วย google ได้       non-functional  medium      in-develop
```

### 8. คัดลอก Sample Data (Optional)

คุณสามารถ Import ข้อมูลตัวอย่างจาก:
- `backend/_System Catalog - Systems.csv`
- `backend/_System Catalog - Requirements.csv`

**วิธี Import:**
1. File → Import
2. Upload → Select CSV file
3. Import location: **Replace data at selected cell**
4. Separator type: **Comma**
5. Import data

---

## ✅ Checklist

- [ ] สร้าง Google Sheet
- [ ] สร้าง Sheet: `systems` พร้อม Headers
- [ ] สร้าง Sheet: `requirements` พร้อม Headers
- [ ] เพิ่ม Data Validation (Optional)
- [ ] คัดลอก Sheet ID
- [ ] ตั้ง Share Settings
- [ ] ใส่ข้อมูลตัวอย่าง (Optional)
- [ ] ทดสอบเพิ่ม/แก้ไขข้อมูลด้วยมือ

---

## 📝 Notes

- **Auto-generated fields** (ID, Created Date, Created By, Last Updated, Last Updated By) จะถูกสร้างโดย Backend อัตโนมัติ
- **Required fields** จะถูกตรวจสอบโดย API
- **Dropdown values** ควรตรงกับที่กำหนดใน UI
- แนะนำให้ใช้ **Data Validation** เพื่อป้องกันข้อมูลผิดพลาด

---

**หลังจากตั้งค่าเสร็จ:** อัปเดต `SHEET_ID` ใน `backend/backend.gs` และ Deploy!
