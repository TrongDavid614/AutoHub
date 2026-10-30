# 🚗 AutoHub - Fullstack Automotive Platform (Monorepo)
> **Đề tài:** Website giới thiệu, bán ô tô và phụ kiện ô tô trực tuyến  
> **Môn học:** Lập Trình WWW Java — Trường Đại học Công nghiệp TP.HCM (IUH)  
> **Nhóm thực hiện:** Nhóm 7 (Lớp: DHKTPM19ATT)  
> **Giảng viên hướng dẫn:** TS. Nguyễn Vũ Lâm

---

## 📌 1. Giới Thiệu Dự Án
**AutoHub** là giải pháp nền tảng thương mại điện tử chuyên biệt cho lĩnh vực ô tô và phụ kiện chính hãng, được tổ chức theo cấu trúc **Monorepo** chứa cả Frontend và Backend:
- **Frontend (`autohub-frontend/`):** Single-Page Application (SPA) phát triển trên nền tảng **React 19/18+ (TypeScript)** cùng công cụ đóng gói siêu tốc **Vite**, định kiểu hướng tiện ích với **Tailwind CSS**. Tối ưu hiển thị cho môi trường **Desktop Web** (1366×768 đến 1920×1080).
- **Backend (`autohub-backend/`):** Xây dựng trên nền tảng **Java 21 LTS** và **Spring Boot 3.4.1** với công cụ xây dựng **Gradle**, bảo mật đa tầng với Spring Security 6 & Stateless JWT, tích hợp cơ sở dữ liệu Microsoft SQL Server (MSSQL).

---

## 🏗️ 2. Cấu Trúc Monorepo

```
AutoHub/
├── .agents/                    # Quy chuẩn và tài nguyên AI Coding Assistant
├── .github/                    # GitHub Workflows & Issue/PR templates
├── autohub-frontend/           # Ứng dụng Frontend (React + Vite + Tailwind)
│   ├── src/                    # Mã nguồn các phân hệ (Customer, Staff, Admin)
│   ├── public/                 # Video và tài nguyên tĩnh
│   ├── package.json            # Cấu hình dependencies Frontend
│   └── vite.config.ts          # Cấu hình Vite & Path Alias @/
├── autohub-backend/            # Dịch vụ Backend (Spring Boot 3 + Java 21)
│   ├── src/                    # Controller, Service, Security, Domain Entities
│   ├── gradle/                 # Gradle wrapper binaries & properties
│   └── build.gradle            # Cấu hình dependencies Spring Boot & JPA
├── .gitignore                  # Cấu hình loại trừ file rác cho cả FE & BE
├── AGENTS.md                   # Bộ quy chuẩn kiến trúc (Single Source of Truth)
├── CLAUDE.md                   # Dẫn chiếu quy tắc cho Claude
├── GEMINI.md                   # Dẫn chiếu quy tắc cho Gemini
└── README.md                   # Hướng dẫn tổng quan & cài đặt
```

---

## 🛠️ 3. Công Nghệ Sử Dụng (Tech Stack)

### Frontend (`autohub-frontend/`)
| Hạng mục | Công nghệ / Thư viện |
|---|---|
| **Core Framework** | React 19/18+ & TypeScript Strict Mode |
| **Build Tool** | Vite |
| **Routing** | React Router DOM v6/v7 Data Router |
| **State Management** | Zustand 5+ |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **HTTP Client** | Axios Instance (`@/lib/axios`) |
| **Forms & Validation** | React Hook Form + Zod |

### Backend (`autohub-backend/`)
| Hạng mục | Công nghệ / Thư viện |
|---|---|
| **Platform** | Java 21 LTS |
| **Framework** | Spring Boot 3.4.1 |
| **Build Tool** | Gradle |
| **Security & Auth** | Spring Security 6, Stateless JWT (JJWT 0.12.6) |
| **Data Persistence** | Spring Data JPA, Hibernate, Microsoft SQL Server JDBC |
| **Validation** | Jakarta Bean Validation |
| **Utility** | Project Lombok |

---

## 🚀 4. Hướng Dẫn Cài Đặt & Chạy Dự Án

### 4.1. Khởi chạy Backend (`autohub-backend/`)
Yêu cầu: Đã cài đặt **JDK 21** và **Microsoft SQL Server**.

```bash
cd autohub-backend

# Chạy trực tiếp qua Gradle Wrapper (Windows PowerShell)
.\gradlew.bat bootRun

# Hoặc trên Linux/macOS
./gradlew bootRun
```
*Backend API mặc định khởi chạy tại:* `http://localhost:8080`

### 4.2. Khởi chạy Frontend (`autohub-frontend/`)
Yêu cầu: Đã cài đặt **Node.js 18+** hoặc **20+**.

```bash
cd autohub-frontend

# Cài đặt thư viện dependencies (nếu chưa có)
npm install

# Khởi chạy máy chủ phát triển
npm run dev

# Kiểm tra build sản phẩm
npm run build
```
*Frontend Web mặc định khởi chạy tại:* `http://localhost:5173`

---

## 📋 5. Quy Chuẩn Lập Trình & Đóng Góp

Mọi lập trình viên tham gia dự án bắt buộc phải đọc và tuân thủ các quy tắc trong:
- **`AGENTS.md`**: Quy định về kiến trúc module, đặt tên, phân quyền RBAC, và hợp đồng dữ liệu giữa Frontend và Spring Boot.
