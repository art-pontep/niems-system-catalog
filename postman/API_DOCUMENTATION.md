# 📘 System Catalog API Documentation

**Version:** 1.0  
**Author:** NIEMS  
**Base URL:** `{{BASE_URL}}` (e.g., `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)  
**Authentication:** Requires **Google OAuth ID Token** (`idToken` field)

---

## 🔐 Authentication

Every request (except Health Check) requires an `idToken` from Google OAuth.  
Example:
```json
"idToken": "{{ID_TOKEN}}"
```

---

## 🩺 Health Check

### 1. Health Check (POST)
**Method:** `POST`  
**URL:** `{{BASE_URL}}`  
**Body:**
```json
{
  "action": "health"
}
```
**Description:** Check API health status and database connection.

---

### 2. Health Check (GET)
**Method:** `GET`  
**URL:** `{{BASE_URL}}?action=health`  
**Description:** Simple health status check via GET method.

---

## 🧩 Systems

### 1. Get All Systems
**Method:** `POST`  
**URL:** `{{BASE_URL}}`  
**Body:**
```json
{
  "method": "GET",
  "sheet": "systems",
  "idToken": "{{ID_TOKEN}}"
}
```
**Description:** Retrieve all system records.

---

### 2. Get System by ID
**Method:** `POST`  
**URL:** `{{BASE_URL}}`  
**Body:**
```json
{
  "method": "GET",
  "sheet": "systems",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "id": "1"
  }
}
```
**Description:** Retrieve a specific system record by ID.

---

### 3. Create System
**Method:** `POST`  
**URL:** `{{BASE_URL}}`  
**Body:**
```json
{
  "method": "POST",
  "sheet": "systems",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "Name": "การให้บริการคลาวด์สำหรับ NDEMS",
    "Description": "การให้บริการคลาวด์สำหรับ NDEMS",
    "Business Owner": "สพฉ.",
    "Technical Owner": "iNET",
    "Overall Status": "active",
    "Category": "infrastructure",
    "System Type": "external",
    "Go Live Date": "2024-10-15",
    "Goal": "โครงสร้างพื้นฐานสำหรับระบบดิจิทัลทั้งหมด (บริการ 24x7)"
  }
}
```
**Description:** Create a new system record.

---

### 4. Update System
**Method:** `POST`  
**Body:**
```json
{
  "method": "PUT",
  "sheet": "systems",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "ID": "EXT-0001",
    "Name": "การให้บริการคลาวด์สำหรับ NDEMS",
    "Overall Status": "in-develop"
  }
}
```
**Description:** Update an existing system by ID.

---

### 5. Delete System
**Method:** `POST`  
**Body:**
```json
{
  "method": "DELETE",
  "sheet": "systems",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "ID": "L0J4VH_ABCDE"
  }
}
```
**Description:** Delete a system record by ID.

---

## 📄 Documents

### 1. Get All Documents
```json
{
  "method": "GET",
  "sheet": "documents",
  "idToken": "{{ID_TOKEN}}"
}
```

### 2. Create Document
```json
{
  "method": "POST",
  "sheet": "documents",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "Name": "API Documentation",
    "Document Type": "api-spec",
    "Description": "API specification document",
    "URL": "https://example.com/api-docs",
    "System ID": "2",
    "Version": "1.0",
    "Status": "completed"
  }
}
```

### 3. Update Document
```json
{
  "method": "PUT",
  "sheet": "documents",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "ID": "DOC_12345",
    "Name": "Updated Document Name",
    "Status": "reviewed"
  }
}
```

### 4. Delete Document
```json
{
  "method": "DELETE",
  "sheet": "documents",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "ID": "DOC_12345"
  }
}
```

---

## 🧾 Requirements

### 1. Get All Requirements
```json
{
  "method": "GET",
  "sheet": "requirements",
  "idToken": "{{ID_TOKEN}}"
}
```

### 2. Create Requirement
```json
{
  "method": "POST",
  "sheet": "requirements",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "System ID": "INT-0001",
    "Title": "ต้องมีหน้าตาที่สวยงาม",
    "Priority": "low",
    "Status": "done",
    "Type": "non-functional"
  }
}
```

### 3. Update Requirement
```json
{
  "method": "PUT",
  "sheet": "requirements",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "ID": "NONREQ-0002",
    "Title": "ต้องมีหน้าตาที่สวยงาม",
    "Status": "done"
  }
}
```

### 4. Delete Requirement
```json
{
  "method": "DELETE",
  "sheet": "requirements",
  "idToken": "{{ID_TOKEN}}",
  "data": {
    "ID": "REQ-001"
  }
}
```

---

## ⚙️ Environment Variables

| Variable   | Example Value                                               | Description                |
|-------------|-------------------------------------------------------------|-----------------------------|
| `BASE_URL`  | `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`   | Google Apps Script endpoint |
| `ID_TOKEN`  | `YOUR_GOOGLE_ID_TOKEN_HERE`                                | OAuth ID Token              |

---

## 🧠 Notes
- All endpoints use **HTTP POST** (except health check).
- The `sheet` parameter determines which Google Sheet tab to operate on.
- The `method` parameter defines the CRUD operation:
  - `GET` → Read  
  - `POST` → Create  
  - `PUT` → Update  
  - `DELETE` → Delete  
