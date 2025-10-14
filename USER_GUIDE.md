# 📊 System Catalog Dashboard - User Guide

**คู่มือการใช้งานระบบ**  
Version 1.0.0

---

## 🔗 Quick Links

- [⚡ Quick Start](QUICKSTART.md)  
  _เริ่มต้นใช้งานใน 5 นาที_

- [📖 Full Documentation](README.md)  
  _เอกสารฉบับเต็ม_

- [⚙️ Configuration](CONFIG.md)  
  _วิธีตั้งค่าระบบ_

- [🔌 API Reference](postman/API_DOCUMENTATION.md)  
  _เอกสาร API_

---

## ✨ ฟีเจอร์หลัก

- 🔐 **Login ด้วย Google**  
  เข้าสู่ระบบด้วย Google Account อย่างปลอดภัย

- 📊 **Dashboard แบบ Real-time**  
  ดูสถิติและกราฟแบบเรียลไทม์

- 🖥️ **จัดการ Systems**  
  เพิ่ม แก้ไข ลบ และค้นหาข้อมูลระบบงาน

- 📋 **จัดการ Requirements**  
  ติดตามความต้องการและความคืบหน้า

- 🔍 **ค้นหาและกรองข้อมูล**  
  ค้นหาและกรองข้อมูลได้อย่างรวดเร็ว

- 📱 **รองรับทุกอุปกรณ์**  
  ใช้งานได้บน Mobile, Tablet, และ Desktop

---

## 📖 วิธีการใช้งาน

### 1️⃣ เข้าสู่ระบบ

1. เปิดเว็บไซต์
2. คลิก "Sign in with Google"
3. เลือก Google Account
4. รอระบบโหลดข้อมูล

### 2️⃣ ดู Dashboard

- ดูจำนวนระบบทั้งหมด
- ดูระบบที่ Active
- ดู Requirements ทั้งหมด
- ดู Completion Rate
- ดูกราฟ Systems by Status
- ดูกราฟ Requirements by Status
- ดูตารางความคืบหน้า

### 3️⃣ จัดการ Systems

- **สร้าง:** คลิก "+ Add System" → กรอกข้อมูล → Save
- **แก้ไข:** คลิก "Edit" → แก้ไขข้อมูล → Update
- **ลบ:** คลิก "Delete" → ยืนยันการลบ
- **ค้นหา:** พิมพ์คำค้นหาในช่อง Search
- **กรอง:** เลือก Status ที่ต้องการ

### 4️⃣ จัดการ Requirements

- **สร้าง:** คลิก "+ Add Requirement" → เลือก System → กรอกข้อมูล → Save
- **แก้ไข:** คลิก "Edit" → แก้ไขข้อมูล → Update
- **ลบ:** คลิก "Delete" → ยืนยันการลบ
- **ค้นหา:** พิมพ์คำค้นหาในช่อง Search
- **กรอง:** เลือก Status ที่ต้องการ

### 5️⃣ ออกจากระบบ

- คลิก "ออกจากระบบ" ด้านบนขวา
- ระบบจะ logout อัตโนมัติ

---

## 📌 Status Reference

### Systems Status

| Status      | สี           | ความหมาย         |
|-------------|--------------|------------------|
| **Active**      | 🟩 เขียว      | ใช้งานอยู่       |
| **In Develop**  | 🟦 น้ำเงิน     | กำลังพัฒนา       |
| **Review**      | 🟨 เหลือง     | ตรวจสอบ          |
| **Planning**    | 🟪 ม่วง       | วางแผน           |
| **Retired**     | ⬜ เทา        | ยกเลิกใช้งาน     |

### Requirements Status

| Status         | สี           | ความหมาย         |
|----------------|--------------|------------------|
| **Done**          | 🟩 เขียว      | เสร็จสมบูรณ์     |
| **In Develop**    | 🟦 น้ำเงิน     | กำลังทำ          |
| **Pending**       | 🟥 แดง        | รอดำเนินการ      |

---

## 🔧 แก้ปัญหาเบื้องต้น

- **❌ ไม่สามารถ Login ได้**  
  → ตรวจสอบว่า Email ของคุณอยู่ใน Allowed Users

- **❌ ไม่มีข้อมูลแสดง**  
  → ตรวจสอบการเชื่อมต่อ Internet และ Refresh หน้าเว็บ

- **❌ สร้างข้อมูลไม่ได้**  
  → ตรวจสอบว่ากรอกข้อมูล Required fields ครบถ้วน

- **❌ หน้าจอโหลดช้า**  
  → Clear Browser Cache และลองใหม่อีกครั้ง

---

## Footer

_System Catalog Dashboard v1.0.0_  
_Made with ❤️ for NIEMS_

[Documentation](README.md) • [Quick Start](QUICKSTART.md) • [Configuration](CONFIG.md)