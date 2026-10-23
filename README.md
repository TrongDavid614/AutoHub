# 🚗 AutoHub - Frontend Architecture Platform
> **Đề tài:** Website giới thiệu, bán ô tô và phụ kiện ô tô trực tuyến  
> **Môn học:** Lập Trình WWW Java — Trường Đại học Công nghiệp TP.HCM (IUH)  
> **Nhóm thực hiện:** Nhóm 7 (Lớp: DHKTPM19ATT)  
> **Giảng viên hướng dẫn:** TS. Nguyễn Vũ Lâm

---

## 📌 1. Giới Thiệu Dự Án
**AutoHub** là giải pháp nền tảng thương mại điện tử chuyên biệt cho lĩnh vực ô tô và phụ kiện chính hãng, được thiết kế theo mô hình kiến trúc phân tách độc lập (**Decoupled Client-Server**):
- **Frontend (Repo này):** Single-Page Application (SPA) phát triển trên nền tảng **React 18+ (TypeScript)** cùng công cụ đóng gói siêu tốc **Vite**, định kiểu hướng tiện ích với **Tailwind CSS**. Ứng dụng tối ưu hóa mật độ hiển thị thông tin cao cho môi trường **Desktop Web** (độ phân giải từ WXGA 1366×768 đến Full HD 1920×1080).
- **Backend:** Xây dựng trên nền tảng **Java 21 LTS** và **Spring Boot 3.x**, bảo mật đa tầng với Spring Security 6 & Stateless JWT, tích hợp cổng thanh toán VNPay HMAC-SHA512.

---

## 🛠️ 2. Công Nghệ & Thư Viện Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ / Thư viện | Vai trò trong hệ thống |
|---|---|---|
| **Core Framework** | **React 18+ & TypeScript** | Xây dựng giao diện hướng thành phần, định kiểu tĩnh an toàn |
| **Build Tool** | **Vite** | Máy chủ phát triển HMR cực nhanh, tối ưu hóa bundle sản phẩm |
| **Routing** | **React Router DOM v6** | Định tuyến SPA, triển khai `ProtectedRoute` kiểm soát truy cập RBAC |
| **State Management** | **Zustand** | Quản lý Global State (Auth, Giỏ hàng Guest/User, So sánh xe) nhẹ và nhanh |
| **Styling** | **Tailwind CSS & PostCSS** | Thiết kế giao diện Desktop-first theo phương pháp Utility-First |
| **Icons & UI Assets** | **Lucide React** | Hệ thống biểu tượng vector hiện đại, đồng bộ phong cách thiết kế |
| **HTTP Client** | **Axios** | Giao tiếp RESTful API với Spring Boot 3, tự động gắn Bearer JWT |
| **Form & Validation** | **React Hook Form + Zod** | Quản lý biểu mẫu hiệu năng cao, xác thực dữ liệu chặt chẽ theo Zod Schema |

---

## 🏗️ 3. Cấu Trúc Thư Mục Dự Án (Feature-Driven Architecture)

Dự án được tổ chức theo kiến trúc **Feature-driven**, phân tách rõ ràng giữa cấu hình ứng dụng, thành phần dùng chung và các module nghiệp vụ độc lập:

```
src/
├── app/                        # Cấu hình cấp ứng dụng
│   ├── layouts/                # Khung giao diện theo từng phân hệ
│   │   ├── PublicLayout.tsx    # Header, Nav, Search, Giỏ hàng, AI Trigger, Footer
│   │   ├── CustomerLayout.tsx  # Giao diện thành viên có Sidebar quản lý cá nhân
│   │   ├── StaffLayout.tsx     # Giao diện Back-office nghiệp vụ nhân viên
│   │   └── AdminLayout.tsx     # Giao diện Back-office trung tâm quản trị Admin
│   └── routes/
│       ├── ProtectedRoute.tsx  # Route Guard phân quyền RBAC đa tầng (Role-based)
│       └── index.tsx           # Bản đồ định tuyến React Router DOM v6
├── components/                 # Bộ UI Components tái sử dụng (Button, Input, Badge, Modal, Table...)
├── config/                     # Hằng số hệ thống, biến môi trường, danh mục API Endpoints
├── features/                   # CÁC MIỀN NGHIỆP VỤ ĐỘC LẬP (Feature Modules)
│   ├── auth/                   # Đăng nhập, đăng ký, quên mật khẩu (Stateless JWT)
│   ├── profile/                # Hồ sơ cá nhân, Sổ địa chỉ giao hàng (UC03)
│   ├── cars/                   # Showroom danh mục xe (F01), Chi tiết mẫu xe & ảnh 360 (F02)
│   ├── car-estimator/          # Dự toán lăn bánh theo tỉnh thành & Lãi vay trả góp (F03, F04)
│   ├── car-comparison/         # Bàn cân đối đầu so sánh tối đa 3 xe song song (F05)
│   ├── ai-consultant/          # Trợ lý ảo AI tư vấn thông minh tích hợp LLM (F25)
│   ├── accessories/            # Sàn TMĐT phụ kiện, bộ lọc tương thích dòng xe & năm (F06, F07)
│   ├── cart/                   # Giỏ hàng phụ kiện thông minh (hỗ trợ Guest & đồng bộ User) (F08)
│   ├── checkout/               # Đặt hàng & thanh toán trực tuyến qua VNPay / COD (F09)
│   ├── car-deposit/            # Quy trình đặt cọc giữ suất xe 72h & định danh CCCD (F13, UC17)
│   ├── test-drive/             # Đăng ký lái thử online & cam kết GPLX hợp lệ (F12, UC16)
│   ├── staff-operations/       # 5 phân hệ tiếp nhận, điều phối, gán VIN, đóng gói, đổi trả (UC20-UC24)
│   └── admin-portal/           # 5 phân hệ thống kê Chart.js, quản trị xe, phụ kiện, voucher, RBAC (F19-F24)
├── hooks/                      # Custom hooks dùng chung (useDebounce, useLocalStorage...)
├── lib/
│   ├── axios.ts                # Axios Client cấu hình Interceptor gắn token và xử lý lỗi toàn cục
│   └── utils.ts                # Tiện ích nối lớp (clsx, twMerge), định dạng tiền tệ VNĐ, ngày tháng
├── store/                      # Zustand Global Stores (useAuthStore, useCartStore, useCompareStore)
└── types/                      # Domain Model Interfaces & Enums (Khớp 100% tài liệu phân tích)
    ├── auth.types.ts           # Vai trò (ROLE_CUSTOMER, ROLE_STAFF, ROLE_ADMIN), User, Address
    ├── car.types.ts            # Hãng, Dòng, Phiên bản, Màu sắc, Tồn kho VIN, Xe Demo
    ├── accessory.types.ts      # Danh mục, Phụ kiện, Bảng tương thích xe
    ├── order.types.ts          # Đơn hàng phụ kiện (9 trạng thái), Chi tiết đơn, Đổi trả
    ├── deposit.types.ts        # Phiếu đặt cọc xe (8 trạng thái theo quy định 72 giờ)
    ├── test-drive.types.ts     # Lịch hẹn lái thử (5 trạng thái)
    └── api.types.ts            # Cấu trúc phản hồi chuẩn hóa ApiResponse<T>, PageResponse<T>
```

---

## 👥 4. Cơ Chế Phân Quyền Đa Tầng (RBAC)

Hệ thống thiết lập 3 cấp bậc vai trò người dùng kết hợp Route Guard (`ProtectedRoute`):
- **Khách vãng lai (Guest):** Xem showroom xe, bộ sưu tập ảnh 360, dự toán lăn bánh, so sánh xe, tra cứu phụ kiện tương thích, thêm vào giỏ hàng cục bộ, tư vấn với AI.
- **Khách hàng thành viên (`ROLE_CUSTOMER`):** Quản lý hồ sơ cá nhân, sổ địa chỉ nhận hàng, theo dõi đơn phụ kiện, quản lý lịch lái thử và phiếu cọc giữ xe 72h.
- **Nhân viên vận hành (`ROLE_STAFF`):** Tiếp nhận yêu cầu tư vấn (UC20), điều phối xe demo & lịch lái thử (UC21), đối soát phiếu cọc & gán số khung VIN (UC22), đóng gói xuất kho phụ kiện (UC23), xử lý yêu cầu đổi trả (UC24).
- **Quản trị viên (`ROLE_ADMIN`):** Báo cáo thống kê Chart.js (F19), quản lý Master Data xe & xe Demo (F20), quản lý phụ kiện & tồn kho (F21), quản lý biểu phí lăn bánh & Voucher (F22), quản lý phân quyền tài khoản (F24).

---

## 🚀 5. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 5.1. Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị Node.js v20 LTS hoặc v24)
- **Trình quản lý gói:** `npm` (hoặc `yarn` / `pnpm`)
- **Backend API:** Spring Boot 3 chạy tại `http://localhost:8080` (hoặc qua biến môi trường)

### 5.2. Các bước khởi chạy

1. **Di chuyển vào thư mục dự án:**
   ```bash
   cd D:\WWWJava\autohub-frontend
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Cấu hình biến môi trường (Environment Variables):**
   Tạo file `.env` tại thư mục gốc của dự án:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

4. **Khởi chạy môi trường phát triển (Development):**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ khả dụng tại địa chỉ: `http://localhost:5173`

5. **Kiểm tra kiểu dữ liệu & Đóng gói sản phẩm (Production Build):**
   ```bash
   npm run build
   ```
   Thư mục đóng gói đầu ra: `dist/`

---

## 🌿 6. Quy Trình Quản Lý Phiên Bản GitFlow

Để đảm bảo tính nhất quán và chất lượng mã nguồn theo quy chuẩn đề tài:

1. **Quy tắc phân nhánh:**
   - `main`: Nhánh ổn định, phản ánh phiên bản nghiệm thu/báo cáo đề tài.
   - `develop`: Nhánh tích hợp chính của toàn đội ngũ lập trình.
   - `feature/<ten-tinh-nang>`: Nhánh làm tính năng riêng (ví dụ: `feature/car-deposit`, `feature/car-estimator`).
   - `bugfix/<ten-loi>`: Nhánh xử lý lỗi phát sinh trong quá trình kiểm thử.

2. **Quy trình làm việc (Workflow):**
   ```bash
   # Cập nhật mã nguồn mới nhất từ develop
   git checkout develop
   git pull origin develop

   # Rẽ nhánh làm tính năng mới
   git checkout -b feature/car-deposit

   # Thực hiện lập trình và commit theo quy chuẩn Conventional Commits
   git add .
   git commit -m "feat(deposit): implement 72h car reservation form with zod validation"

   # Đẩy nhánh tính năng lên GitHub
   git push -u origin feature/car-deposit
   ```

3. **Quy trình nghiệm thu:**
   Tạo **Pull Request (PR)** trên GitHub từ `feature/*` vào `develop`. Các thành viên đối soát chéo về tính tương thích API Contract với Spring Boot trước khi phê duyệt (Merge).

---

## 📄 7. Tác Giả & Bản Quyền
- Dự án được phát triển phục vụ mục đích học thuật và nghiên cứu kỹ thuật phần mềm tại **Khoa Công Nghệ Thông Tin — Trường Đại học Công nghiệp TP.HCM (IUH)**.
- Giữ toàn quyền sở hữu trí tuệ thuộc về **Nhóm 7 — DHKTPM19ATT**.
