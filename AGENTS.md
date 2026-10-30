# 📘 BỘ QUY CHUẨN LẬP TRÌNH FRONTEND AUTOHUB (CODING CONVENTIONS)

> **Dự án:** AutoHub - Nền tảng thương mại điện tử ô tô và phụ kiện trực tuyến  
> **Phiên bản:** 1.0.0 (Production Architecture Guideline)  
> **Đối tượng áp dụng:** Bắt buộc cho toàn bộ lập trình viên (Developers) và các AI Coding Assistants (Claude Code, Antigravity, GitHub Copilot, Gemini CLI...).  
> **Nguồn sự thật duy nhất (Single Source of Truth):** Mọi file quy tắc khác (`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`) đều dẫn chiếu về tài liệu này.

---

## 📑 MỤC LỤC
1. [Tổng quan & 10 Nguyên tắc vàng](#1-tổng-quan--10-nguyên-tắc-vàng)
2. [Cấu hình Alias `@/` & Quy tắc Import](#2-cấu-hình-alias--quy-tắc-import)
3. [Quy ước đặt tên (Naming Conventions)](#3-quy-ước-đặt-tên-naming-conventions)
4. [Cấu trúc Feature Module & Checklist thêm Feature mới](#4-cấu-trúc-feature-module--checklist-thêm-feature-mới)
5. [Quy tắc TypeScript nghiêm ngặt](#5-quy-tắc-typescript-nghiêm-ngặt)
6. [Quy tắc React Component & Kiến trúc UI](#6-quy-tắc-react-component--kiến-trúc-ui)
7. [Tailwind CSS & Thiết kế Desktop-First](#7-tailwind-css--thiết-kế-desktop-first)
8. [Quy chuẩn gọi API (Axios Service + Custom Hook)](#8-quy-chuẩn-gọi-api-axios-service--custom-hook)
9. [Chiến lược Mock Data độc lập](#9-chiến-lược-mock-data-độc-lập)
10. [Form & Xác thực dữ liệu (React Hook Form + Zod)](#10-form--xác-thực-dữ-liệu-react-hook-form--zod)
11. [Quản lý State toàn cục với Zustand](#11-quản-lý-state-toàn-cục-với-zustand)
12. [Định tuyến & Phân quyền bảo mật RBAC](#12-định-tuyến--phân-quyền-bảo-mật-rbac)
13. [Kho Template chuẩn hóa cho từng loại file](#13-kho-template-chuẩn-hóa-cho-từng-loại-file)
14. [Quy chuẩn Git & Conventional Commits](#14-quy-chuẩn-git--conventional-commits)
15. [Chỉ dẫn tác vụ dành riêng cho AI Agent khi Vibe Coding](#15-chỉ-dẫn-tác-vụ-dành-riêng-cho-ai-agent-khi-vibe-coding)
16. [Bộ quy chuẩn phòng chống "AI Slop" & Nâng cao gu thiết kế (Anti-AI-Slop Guidelines)](#16-bộ-quy-chuẩn-phòng-chống-ai-slop--nâng-cao-gu-thiết-kế-anti-ai-slop-guidelines)
17. [Checklist kiểm tra trước khi Commit / Mở PR](#17-checklist-kiểm-tra-trước-khi-commit--mở-pr)

---

## 1. TỔNG QUAN & 10 NGUYÊN TẮC VÀNG

### 1.1. Tóm tắt Tech Stack
- **Core:** React 19 / 18+ (Function Components), TypeScript (Strict Mode).
- **Tooling:** Vite, ESLint 9+ Flat Config, PostCSS.
- **Styling:** Tailwind CSS v4, Lucide React (Icons duy nhất), `clsx` + `tailwind-merge`.
- **State & Routing:** Zustand 5+, React Router DOM v6/v7 (Data Router).
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers`).
- **Data Fetching:** Axios instance tập trung (`@/lib/axios`), Custom Hooks tự viết (KHÔNG dùng React Query/SWR).
- **Target Resolution:** Desktop Web Application (Tối ưu mật độ thông tin cao từ **1366×768** đến **1920×1080**).

### 1.2. 10 Nguyên tắc vàng (Bắt buộc tuân thủ)
1. **CẤM DÙNG `any`:** Mọi biến, tham số, dữ liệu trả về đều PHẢI có kiểu rõ ràng. Nếu kiểu chưa rõ, dùng `unknown` kèm Type Guard.
2. **CẤM TỰ Ý CÀI THƯ VIỆN NGOÀI:** Chỉ sử dụng các dependencies đã khai báo trong `package.json`. Mọi đề xuất thêm thư viện mới PHẢI được Tech Lead phê duyệt.
3. **CẤM HARDCODE CHUỖI CỐ ĐỊNH:** URL API, Role, mã trạng thái, số giờ hết hạn... PHẢI lấy từ `@/config/api.config`, `@/config/constants` hoặc `@/types`.
4. **CẤM HARDCODE MÀU SẮC (HEX/RGB):** Dùng bảng màu Semantic Tailwind của dự án (`slate`, `red`, `emerald`, `amber`, `blue`).
5. **ĐỌC TRƯỚC KHI VIẾT:** Trước khi tạo file mới, PHẢI đọc file mẫu tương ứng trong `src/components`, `src/store` hoặc tài liệu này.
6. **THAY ĐỔI NHỎ GỌN (ATOMIC):** Chỉ thay đổi đúng phạm vi yêu cầu (Task Scope). KHÔNG tiện tay refactor file không liên quan.
7. **TÁCH BIỆT LOGIC KHỎI VIEW:** Component chỉ lo việc render JSX. State quản lý API, tính toán phức tạp PHẢI đưa vào Custom Hook (`hooks/useXxx.ts`).
8. **ĐỒNG BỘ CONTRACT 100% VỚI SPRING BOOT:** Mọi DTO/Interface đặt tại `@/types` phải khớp chính xác thuộc tính trả về từ Backend Java 21 / Spring Boot 3.
9. **NGÔN NGỮ CHUẨN HÓA:** Code, comment kỹ thuật, commit message bằng **Tiếng Anh**. Văn bản hiển thị người dùng (label, button, thông báo lỗi, toast) bằng **Tiếng Việt**.
10. **KHÔNG BAO GIỜ PHÁ HỎNG BUILD:** Mã nguồn sau mỗi bước sửa đổi PHẢI vượt qua lệnh `npm run build` (`tsc -b && vite build`) với 0 lỗi.

---

## 2. CẤU HÌNH ALIAS `@/` & QUY TẮC IMPORT

Dự án đã cấu hình alias `@/` trỏ tới thư mục `./src` trong cả `tsconfig.app.json` và `vite.config.ts`.

### 2.1. Quy tắc sử dụng Alias
- **PHẢI** dùng `@/` cho mọi import xuyên thư mục khác cấp.
- **CHỈ ĐƯỢC** dùng `./` cho file nằm cùng một thư mục.
- **TUYỆT ĐỐI CẤM** dùng đường dẫn tương đối lùi tầng (`../`, `../../`).

```typescript
// ❌ SAI: Dùng tương đối lùi tầng khó bảo trì
import { axiosClient } from '../../lib/axios';
import { Button } from '../../../components/Button';
import { Car } from '../../types/car.types';

// ✅ ĐÚNG: Dùng Alias @/ cho import xuyên module
import { axiosClient } from '@/lib/axios';
import { Button } from '@/components/Button';
import type { Car } from '@/types/car.types';

// ✅ ĐÚNG: Dùng ./ cho file cùng cấp thư mục
import { CarCard } from './CarCard';
```

### 2.2. Thứ tự Import trong mỗi file
Mọi file mã nguồn PHẢI sắp xếp import theo 4 khối ngăn nắp, cách nhau 1 dòng trống:
1. Thư viện bên ngoài (React, React Router, Lucide, Zustand...)
2. Module nội bộ dùng alias `@/` (Components, Lib, Config, Store...)
3. Module cùng thư mục `./`
4. Type-only imports (`import type { ... }`)

```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car as CarIcon, AlertCircle } from 'lucide-react';

// 2. Internal modules with @/
import { Button } from '@/components/Button';
import { formatCurrencyVND } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

// 3. Same directory modules
import { CarCardSkeleton } from './CarCardSkeleton';

// 4. Type-only imports
import type { CarVariant } from '@/types/car.types';
```

---

## 3. QUY ƯỚC ĐẶT TÊN (NAMING CONVENTIONS)

| Đối tượng | Quy tắc định dạng | Vị trí / Quy cách | Ví dụ ĐÚNG (✅) | Ví dụ SAI (❌) |
|---|---|---|---|---|
| **Thư mục** | `kebab-case` | Toàn bộ trong `src/` | `car-estimator/`, `staff-operations/` | `carEstimator/`, `Staff_Operations/` |
| **Component / Page** | `PascalCase.tsx` | Khớp 1:1 tên Component | `CarCard.tsx`, `CarListPage.tsx` | `carCard.tsx`, `car-list.tsx` |
| **Custom Hook** | `useCamelCase.ts` | Tiền tố `use` | `useDebounce.ts`, `useCarList.ts` | `debounce.ts`, `UseCarList.ts` |
| **Zustand Store** | `use<Name>Store.ts` | Đặt tại `src/store/` | `useCartStore.ts`, `useAuthStore.ts` | `cartStore.ts`, `use_cart.ts` |
| **API Service** | `<domain>.service.ts` | Trong `features/<x>/services/` | `car.service.ts`, `deposit.service.ts` | `CarService.ts`, `carApi.ts` |
| **Domain Type / Enum** | `<domain>.types.ts` | Đặt tại `src/types/` | `car.types.ts`, `order.types.ts` | `CarTypes.ts`, `types.ts` |
| **Zod Schema** | `<domain>.schema.ts` | Trong `features/<x>/schemas/` | `deposit.schema.ts` | `DepositSchema.ts`, `schema.ts` |
| **Mock Data** | `<domain>.mock.ts` | Trong `features/<x>/mocks/` | `car.mock.ts`, `accessory.mock.ts` | `mockData.ts`, `carData.json` |
| **Hằng số (Constants)** | `UPPER_SNAKE_CASE` | Biến static, freeze | `MAX_COMPARE_CARS`, `API_TIMEOUT` | `maxCompareCars`, `api_timeout` |
| **Interface / Type** | `PascalCase` | Định nghĩa kiểu | `CarModel`, `UserResponse` | `ICarModel`, `user_type` |
| **Props Interface** | `<Component>Props` | Gắn liền Component | `ButtonProps`, `CarTableProps` | `IProps`, `Props` |
| **Biến Boolean** | `is/has/can/should...`| Rõ ràng ngữ cảnh | `isLoading`, `hasVoucher`, `canRefund`| `loading`, `checkVoucher` |
| **Event Handler** | `handle<Action>` | Hàm nội bộ Component | `handleSubmit`, `handleSelectVariant`| `onSubmitForm`, `submit` |
| **Callback Prop** | `on<Event>` | Thuộc tính truyền vào | `onSuccess`, `onVariantChange` | `handleSuccess`, `changeVariant` |
| **Enum Role** | `ROLE_<NAME>` | Khớp chuẩn Spring Security | `ROLE_CUSTOMER`, `ROLE_ADMIN` | `CUSTOMER`, `Admin` |

*Ghi chú:* Được phép sử dụng mã ca sử dụng và tính năng (F01, F13, UC16, UC22...) trong comment và tài liệu để đối soát với hồ sơ kiến trúc.

---

## 4. CẤU TRÚC FEATURE MODULE & CHECKLIST THÊM FEATURE MỚI

Mỗi feature đặt tại `src/features/<ten-feature>/` là một miền nghiệp vụ tự đóng gói (Self-contained Module):

```
src/features/<ten-feature>/
├── components/         # Các UI components con chỉ phục vụ riêng feature này
│   ├── FeatureCard.tsx
│   └── FeatureModal.tsx
├── pages/              # Trang hoàn chỉnh gắn với route
│   └── FeaturePage.tsx
├── hooks/              # Custom hook chứa business logic & gọi service
│   └── useFeatureData.ts
├── services/           # Tầng giao tiếp HTTP Axios
│   └── feature.service.ts
├── schemas/            # Zod schema xác thực dữ liệu đầu vào
│   └── feature.schema.ts
├── mocks/              # Dữ liệu giả lập phục vụ phát triển khi chưa có backend
│   └── feature.mock.ts
└── index.ts            # Public API (Barrel file) - Điểm export duy nhất
```

### 4.1. Luật biên giới Feature (Feature Boundaries)
- **CHỈ TẠO THƯ MỤC CON KHI CÓ NHU CẦU:** Không tạo thư mục rỗng. Nếu feature đơn giản chưa cần form, không tạo `schemas/`.
- **CẤM IMPORT SÂU XUYÊN FEATURE:** Feature A KHÔNG ĐƯỢC import vào sâu bên trong Feature B (`@/features/b/components/PrivateCard`).
  - ✅ **ĐÚNG:** `import { CarCard } from '@/features/cars';` (thông qua `index.ts`).
  - ❌ **SAI:** `import { CarCard } from '@/features/cars/components/CarCard';`
- **TÁI SỬ DỤNG TRÊN 2 NƠI:** Bất kỳ component/hook/util nào được sử dụng từ 2 features khác nhau trở lên PHẢI được chuyển vào `src/components`, `src/hooks`, hoặc `src/lib`.
- **VỊ TRÍ DOMAIN TYPES:** Tất cả Types/Interfaces đại diện cho thực thể Domain chung PHẢI đặt tại `src/types/` (để tránh vòng lặp phụ thuộc Circular Dependencies).

### 4.2. Checklist từng bước khi thêm một Feature mới
- [ ] **Bước 1: Domain Modeling:** Xác nhận hoặc bổ sung DTO/Interface tại `src/types/<domain>.types.ts`.
- [ ] **Bước 2: API Endpoints:** Khai báo URL endpoint tại `src/config/api.config.ts`.
- [ ] **Bước 3: Mock Data:** Tạo `features/<name>/mocks/<domain>.mock.ts` khớp 100% Type từ bước 1.
- [ ] **Bước 4: Service Layer:** Viết `features/<name>/services/<domain>.service.ts` xử lý rẽ nhánh Mock / Real API.
- [ ] **Bước 5: Custom Hook:** Viết `features/<name>/hooks/use<Feature>.ts` bọc service, xử lý trạng thái Loading/Error/AbortController.
- [ ] **Bước 6: Zod Schema (nếu có form):** Viết schema trong `features/<name>/schemas/` với thông báo tiếng Việt.
- [ ] **Bước 7: UI & Page:** Xây dựng Components và Page hoàn thiện xử lý đủ 3 trạng thái.
- [ ] **Bước 8: Barrel Export:** Export Page/Component cần thiết tại `features/<name>/index.ts`.
- [ ] **Bước 9: Khai báo Route:** Đăng ký route và bọc `ProtectedRoute` tại `src/app/routes/index.tsx`.
- [ ] **Bước 10: Build Verification:** Chạy `npm run build` xác nhận không có lỗi type hay bundle.

---

## 5. QUY TẮC TYPESCRIPT NGHIÊM NGẶT

Dự án kích hoạt chế độ TypeScript khắt khe (`verbatimModuleSyntax: true`, `noUnusedLocals: true`).

### 5.1. Bắt buộc Type-only Import
Khi import một Interface hoặc Type mà không chứa giá trị lúc runtime, **BẮT BUỘC** dùng từ khóa `type`.
```typescript
// ❌ SAI: Gây lỗi build TS1484 khi bật verbatimModuleSyntax
import { Role, User } from '@/types/auth.types';

// ✅ ĐÚNG:
import type { Role, User } from '@/types/auth.types';
```

### 5.2. Cấm `any` tuyệt đối
```typescript
// ❌ SAI:
const parseApiResponse = (res: any) => res.data;

// ✅ ĐÚNG:
const parseApiResponse = <T>(res: ApiResponse<T>): T => res.data;

// ✅ ĐÚNG: Khi kiểu dữ liệu không xác định trước từ nguồn ngoài
const handleUnknownError = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return 'Lỗi không xác định';
};
```

### 5.3. Sử dụng Interface vs Type
- Dùng `interface` cho định nghĩa hình dạng đối tượng (Object Shapes, Component Props, Model Entities).
- Dùng `type` cho Union, Primitive Aliases, Tuple hoặc Utility Types suy diễn (`z.infer`).
```typescript
// ✅ ĐÚNG:
export interface UserProfileProps {
  userId: number;
  onRefresh: () => void;
}

export type PaymentMethod = 'VNPAY' | 'COD';
```

### 5.4. Định dạng phản hồi API chuẩn
Mọi tương tác dữ liệu từ Backend PHẢI bao bọc qua cấu trúc chuẩn từ `@/types/api.types`:
- Dữ liệu đơn lẻ/danh sách nhỏ: `ApiResponse<T>`
- Danh sách phân trang: `ApiResponse<PageResponse<T>>`

---

## 6. QUY TẮC REACT COMPONENT & KIẾN TRÚC UI

### 6.1. Named Export bắt buộc
- **PHẢI** dùng **Named Export** cho mọi component, hook, và util.
- **CẤM** dùng `export default` (ngoại trừ file cấu hình bắt buộc như `vite.config.ts`, `tailwind.config.js`).

```typescript
// ❌ SAI:
export default function CarCard() { ... }

// ✅ ĐÚNG:
export const CarCard: React.FC<CarCardProps> = ({ variant }) => { ... };
```

### 6.2. Kích thước & Trách nhiệm Component
- Giới hạn độ dài: Component vượt quá **~200 dòng** PHẢI được phân rã thành các sub-components.
- Tách biệt UI & State: Component chỉ nhận `props` và render. Mọi hàm biến đổi phức tạp đưa vào util; state fetching đưa vào custom hook.

### 6.3. Xử lý triệt để 3 trạng thái bắt buộc
Mỗi màn hình hoặc danh sách dữ liệu **BẮT BUỘC** thể hiện trực quan 3 trạng thái:
1. **Loading:** Hiển thị Skeleton hoặc Spinner chỉn chu (không để màn hình trắng).
2. **Error:** Hiển thị thông điệp cảnh báo lỗi tiếng Việt thân thiện kèm nút "Thử lại" (Retry).
3. **Empty:** Hiển thị trạng thái rỗng (`emptyText`) khi danh sách trả về mảng rỗng `[]`.

### 6.4. Key ổn định trong danh sách
```typescript
// ❌ SAI: Dùng index làm key cho danh sách có thể thay đổi
{items.map((item, index) => <div key={index}>{item.name}</div>)}

// ✅ ĐÚNG: Luôn dùng id định danh duy nhất
{items.map((item) => <div key={item.id}>{item.name}</div>)}
```

### 6.5. Biểu tượng (Icons)
- **CHỈ SỬ DỤNG** thư viện `lucide-react`. Cấm cài thêm `@heroicons`, `react-icons`, `font-awesome`.

---

## 7. TAILWIND CSS & THIẾT KẾ DESKTOP-FIRST

AutoHub được định hình là ứng dụng Desktop Web chuyên nghiệp, tối ưu hiển thị thông tin bảng biểu, thông số kỹ thuật xe dày đặc.

### 7.1. Độ phân giải mục tiêu
- Màn hình tiêu chuẩn: **1366×768 (Laptop HD)** đến **1920×1080 (Desktop Full HD)**.
- Bố cục lưới sử dụng Tailwind Container tối đa `max-w-7xl` hoặc full-width cho bảng điều khiển back-office.

### 7.2. Hợp nhất Class với `cn()`
- **BẮT BUỘC** dùng hàm `cn()` từ `@/lib/utils` (kết hợp `clsx` và `twMerge`) khi có điều kiện ghép class hoặc nhận `className` từ ngoài vào.
- **CẤM** viết nối chuỗi thủ công bằng template string.

```typescript
// ❌ SAI:
<div className={`p-4 bg-white ${isActive ? 'border-red-500' : 'border-slate-200'} ${className}`}>

// ✅ ĐÚNG:
<div className={cn('p-4 bg-white border border-slate-200', isActive && 'border-red-500', className)}>
```

### 7.3. Cấm Inline Styles & File CSS tùy tiện
- **CẤM** dùng `style={{ ... }}` trừ các giá trị tính toán động thực sự (ví dụ: góc quay ảnh 360, thanh tiến trình % linh động).
- **CẤM** tạo thêm các file `.css` / `.scss` con. Toàn bộ định kiểu nằm trong Tailwind utilities tại `src/index.css`.

### 7.4. Thứ tự sắp xếp Utility Class (Khuyến nghị chuẩn)
Sắp xếp class theo trình tự logic giúp code dễ quét:
1. **Layout / Display:** `flex`, `grid`, `hidden`, `block`, `relative`, `fixed`.
2. **Kích thước & Spacing:** `w-full`, `h-16`, `p-4`, `gap-2`, `m-auto`.
3. **Typography:** `text-sm`, `font-bold`, `text-center`, `tracking-wide`.
4. **Màu sắc & Nền:** `bg-slate-900`, `text-white`, `border-slate-200`.
5. **Bo góc & Hiệu ứng:** `rounded-lg`, `shadow-md`, `hover:bg-red-600`, `transition-colors`.

---

## 8. QUY CHUẨN GỌI API (AXIOS SERVICE + CUSTOM HOOK)

Dự án sử dụng cơ chế **Axios Instance + Custom Hook**. **KHÔNG CÀI THÊM** TanStack React Query hay SWR để giữ ứng dụng gọn nhẹ và kiểm soát chặt chẽ.

### 8.1. Luật giao tiếp mạng
- **CHỈ ĐƯỢC** gọi API qua instance `@/lib/axios` (`axiosClient`).
- **CẤM** gọi `fetch()` gốc hay `axios` trực tiếp trong React Component.
- **URL Endpoints:** Lấy từ `@/config/api.config.ts`. Tuyệt đối không viết cứng chuỗi URL trong service.

### 8.2. Kiến trúc 2 tầng (Two-Tier Data Fetching)
1. **Tầng Service (`features/<x>/services/<domain>.service.ts`):** Là các hàm async thuần túy, gọi API, bóc tách `data` và trả về Typed Promise. Không chứa logic React State hay JSX.
2. **Tầng Hook (`features/<x>/hooks/use<Feature>.ts`):** Quản lý `data`, `isLoading`, `error`, `refetch`, xử lý hủy request với `AbortController` khi component unmount, ngăn ngừa Memory Leak và Race Condition.

---

## 9. CHIẾN LƯỢC MOCK DATA ĐỘC LẬP

Để phục vụ phát triển giao diện nhanh chóng khi Backend Spring Boot 3 đang hoàn thiện song song, hệ thống áp dụng cơ chế Mock Data cách ly:

### 9.1. Biến môi trường điều khiển
- Khai báo tại file `.env`: `VITE_USE_MOCK=true` (hoặc `false`).
- File mẫu `.env.example` phải luôn cập nhật biến này.

### 9.2. Nguyên tắc Mock Data
- File mock đặt tại `src/features/<x>/mocks/<domain>.mock.ts`.
- **BẮT BUỘC** có comment đầu file: `// TODO(mock): remove when backend ready`.
- Dữ liệu mock **BẮT BUỘC** gán kiểu chính xác từ `@/types/`. Khớp 100% Schema Backend để khi tắt mock, toàn bộ UI và Hook giữ nguyên không cần sửa một dòng code nào.
- Việc chọn dữ liệu Thật hay Mock **CHỈ ĐƯỢC PHÉP NẰM TẠI TẦNG SERVICE**. Component và Hook hoàn toàn không biết dữ liệu đến từ đâu.
- Mock PHẢI giả lập độ trễ mạng thực tế (300ms - 600ms) bằng hàm `delay()`.

---

## 10. FORM & XÁC THỰC DỮ LIỆU (REACT HOOK FORM + ZOD)

Toàn bộ các biểu mẫu (Đặt cọc giữ xe, Đăng ký lái thử, Địa chỉ, Thanh toán...) đều phải xử lý qua bộ đôi **React Hook Form** và **Zod**.

### 10.1. Quy chuẩn Schema
- Đặt schema tại `src/features/<x>/schemas/<domain>.schema.ts`.
- Định dạng thông báo lỗi: **Bắt buộc bằng Tiếng Việt thân thiện**.
- Suy diễn Type trực tiếp từ schema thông qua `z.infer<typeof schema>` (không khai báo trùng lặp bằng tay).

### 10.2. Quy tắc lập trình Form
- Sử dụng `zodResolver(schema)` để liên kết với `useForm`.
- Disable nút submit và hiển thị trạng thái đang xử lý khi `isSubmitting === true`.
- Tận dụng `errors.<field>?.message` để hiển thị lỗi ngay dưới trường nhập liệu.

---

## 11. QUẢN LÝ STATE TOÀN CỤC VỚI ZUSTAND

Zustand được chọn làm giải pháp quản lý trạng thái tập trung gọn nhẹ cho AutoHub.

### 11.1. Phạm vi sử dụng Store
Chỉ đưa vào Zustand các trạng thái toàn cục xuyên suốt nhiều phân hệ:
1. `useAuthStore`: Phiên đăng nhập, token JWT, thông tin user hiện tại, role.
2. `useCartStore`: Giỏ hàng phụ kiện, đồng bộ giỏ hàng vãng lai.
3. `useCompareStore`: Danh sách tối đa 3 xe đang trên bàn cân so sánh.

*Tất cả trạng thái cục bộ (đóng/mở modal, từ khóa tìm kiếm trang, bộ lọc tạm thời...) PHẢI giữ trong component bằng `useState`.*

### 11.2. Quy tắc Store Zustand
- **Selector Pattern:** Khi lấy dữ liệu trong component, PHẢI dùng selector để tránh re-render thừa.
  - ✅ **ĐÚNG:** `const user = useAuthStore((s) => s.user);`
  - ❌ **SAI:** `const { user, login, logout } = useAuthStore();` (gây re-render khi bất kỳ state nào trong store đổi).
- **Quy tắc đặt tên Storage Key:** Khi sử dụng middleware `persist`, key lưu trữ `localStorage` PHẢI có tiền tố `autohub_` (ví dụ: `autohub_auth_state`, `autohub_guest_cart`).
- **Bảo mật:** Tuyệt đối không lưu mật khẩu hoặc thông tin thẻ ngân hàng thô vào persist store.

---

## 12. ĐỊNH TUYẾN & PHÂN QUYỀN BẢO MẬT RBAC

### 12.1. Cấu hình Route tập trung
Toàn bộ cây điều hướng đặt tại `src/app/routes/index.tsx` sử dụng `createBrowserRouter` của React Router DOM v6/v7.

### 12.2. Bảng phân quyền Role-Based Access Control (RBAC)

| Phân hệ Route | Vai trò được phép (`allowedRoles`) | Layout áp dụng | Mô tả chức năng |
|---|---|---|---|
| `/` (Root) | Mọi người dùng (Guest, Customer, Staff, Admin) | `PublicLayout` | Showroom xe, Dự toán lăn bánh, Phụ kiện, Bàn cân so sánh xe, AI Consultant |
| `/auth/*` | Khách vãng lai chưa đăng nhập | `PublicLayout` | Đăng nhập, Đăng ký thành viên, Quên mật khẩu |
| `/customer/*` | `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN` | `CustomerLayout` | Hồ sơ cá nhân, Sổ địa chỉ (UC03), Lịch hẹn lái thử, Phiếu cọc xe 72h, Đơn hàng |
| `/staff/*` | `ROLE_STAFF`, `ROLE_ADMIN` | `StaffLayout` | Tiếp nhận tư vấn (UC20), Lái thử (UC21), Gán VIN cọc (UC22), Đóng gói (UC23), Đổi trả (UC24) |
| `/admin/*` | Duy nhất `ROLE_ADMIN` | `AdminLayout` | Thống kê Chart.js (F19), Master Data xe (F20), Phụ kiện (F21), Biểu phí/Voucher (F22), Quản trị RBAC (F24) |

### 12.3. Bắt buộc kiểm soát qua ProtectedRoute
Mọi route thuộc phân hệ nội bộ đều PHẢI nằm dưới component bảo vệ `ProtectedRoute`:
```tsx
{
  path: '/admin',
  element: <ProtectedRoute allowedRoles={['ROLE_ADMIN']} />,
  children: [ ... ]
}
```

---

## 13. KHO TEMPLATE CHUẨN HÓA CHO TỪNG LOẠI FILE

Mọi file mới được tạo PHẢI tuân thủ 100% cấu trúc của các template dưới đây.

### 13.1. Template Component UI thường (`src/components/XxxCard.tsx`)
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface XxxCardProps {
  title: string;
  description?: string;
  isActive?: boolean;
  className?: string;
  onSelect?: () => void;
}

export const XxxCard: React.FC<XxxCardProps> = ({
  title,
  description,
  isActive = false,
  className,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'p-4 bg-white border border-slate-200 rounded-xl shadow-sm transition-all cursor-pointer',
        isActive ? 'border-red-600 ring-2 ring-red-500/20' : 'hover:border-slate-300',
        className
      )}
    >
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
};
```

### 13.2. Template Zod Schema (`schemas/<domain>.schema.ts`)
```typescript
import { z } from 'zod';
import { VN_PHONE_REGEX, CCCD_REGEX } from '@/config/constants';

export const carDepositSchema = z.object({
  customerName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
  customerPhone: z.string().regex(VN_PHONE_REGEX, 'Số điện thoại di động không hợp lệ'),
  identityCardNumber: z.string().regex(CCCD_REGEX, 'Số Căn cước công dân phải đúng 12 chữ số'),
  showroomLocation: z.string().min(1, 'Vui lòng chọn Showroom tiếp nhận bàn giao'),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'Bạn phải cam kết quy định giữ xe tối đa 72 giờ' }),
  }),
});

export type CarDepositFormValues = z.infer<typeof carDepositSchema>;
```

### 13.3. Template Mock Data (`mocks/<domain>.mock.ts`)
```typescript
// TODO(mock): remove when backend ready
import type { CarVariant } from '@/types/car.types';

export const MOCK_CAR_VARIANTS: CarVariant[] = [
  {
    id: 101,
    modelId: 1,
    variantName: 'Ford Territory Titanium X 1.5 AT',
    engineSpecs: '1.5L EcoBoost Turbo',
    horsepower: 160,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINE',
    listedPrice: 929000000,
    depositPrice: 20000000,
    colors: [
      { id: 1, colorName: 'Trắng Kim Cương', colorCodeHex: '#FFFFFF' },
      { id: 2, colorName: 'Đen Ánh Kim', colorCodeHex: '#000000' },
    ],
    images: [
      { id: 1, imageUrl: '/images/cars/territory-thumb.png', viewType: 'THUMBNAIL', displayOrder: 1 },
    ],
  },
];
```

### 13.4. Template API Service có Mock Switch (`services/<domain>.service.ts`)
```typescript
import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { CarVariant } from '@/types/car.types';
import { MOCK_CAR_VARIANTS } from '../mocks/car.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const carService = {
  getVariants: async (modelId?: number): Promise<CarVariant[]> => {
    if (USE_MOCK) {
      await delay(400);
      return modelId
        ? MOCK_CAR_VARIANTS.filter((v) => v.modelId === modelId)
        : MOCK_CAR_VARIANTS;
    }

    const response = await axiosClient.get<unknown, ApiResponse<CarVariant[]>>(
      API_CONFIG.ENDPOINTS.CARS.VARIANTS,
      { params: { modelId } }
    );
    return response.data;
  },

  getVariantById: async (id: number): Promise<CarVariant> => {
    if (USE_MOCK) {
      await delay(300);
      const item = MOCK_CAR_VARIANTS.find((v) => v.id === id);
      if (!item) throw new Error('Không tìm thấy thông tin phiên bản xe');
      return item;
    }

    const response = await axiosClient.get<unknown, ApiResponse<CarVariant>>(
      `${API_CONFIG.ENDPOINTS.CARS.VARIANTS}/${id}`
    );
    return response.data;
  },
};
```

### 13.5. Template Custom Hook gọi API (`hooks/use<Feature>.ts`)
```typescript
import { useState, useEffect, useCallback } from 'react';
import type { CarVariant } from '@/types/car.types';
import { carService } from '../services/car.service';

interface UseCarVariantsResult {
  variants: CarVariant[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCarVariants = (modelId?: number): UseCarVariantsResult => {
  const [variants, setVariants] = useState<CarVariant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await carService.getVariants(modelId);
      setVariants(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tải danh sách phiên bản xe';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [modelId]);

  useEffect(() => {
    let isMounted = true;

    fetchVariants().catch(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [fetchVariants]);

  return { variants, isLoading, error, refetch: fetchVariants };
};
```

### 13.6. Template Page với 3 trạng thái (`pages/<Name>Page.tsx`)
```tsx
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/Button';
import { formatCurrencyVND } from '@/lib/utils';
import { useCarVariants } from '../hooks/useCarVariants';

export const CarListPage: React.FC = () => {
  const { variants, isLoading, error, refetch } = useCarVariants();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Showroom Danh Mục Xe Ô Tô</h1>
          <p className="text-xs text-slate-500 mt-1">Danh sách xe đang có sẵn suất đặt cọc trực tuyến</p>
        </div>
      </div>

      {/* 1. TRẠNG THÁI LOADING */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* 2. TRẠNG THÁI LỖI */}
      {!isLoading && error && (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-rose-900">Không thể tải dữ liệu xe</h3>
          <p className="text-xs text-rose-600 mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()} className="mt-4">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Thử lại
          </Button>
        </div>
      )}

      {/* 3. TRẠNG THÁI RỖNG */}
      {!isLoading && !error && variants.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">Hiện chưa có phiên bản xe nào sẵn sàng phục vụ.</p>
        </div>
      )}

      {/* DỮ LIỆU HIỂN THỊ */}
      {!isLoading && !error && variants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variants.map((variant) => (
            <div key={variant.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900">{variant.variantName}</h3>
              <p className="text-xs text-slate-500">{variant.engineSpecs} | {variant.horsepower} HP</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Giá niêm yết</span>
                  <span className="text-sm font-black text-red-600">{formatCurrencyVND(variant.listedPrice)}</span>
                </div>
                <Button size="sm">Xem chi tiết</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 13.7. Template Form đầy đủ (`components/<Name>Form.tsx`)
```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { carDepositSchema, type CarDepositFormValues } from '../schemas/deposit.schema';

export interface CarDepositFormProps {
  onSuccess: (data: CarDepositFormValues) => void;
  defaultShowroom?: string;
}

export const CarDepositForm: React.FC<CarDepositFormProps> = ({ onSuccess, defaultShowroom = '' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CarDepositFormValues>({
    resolver: zodResolver(carDepositSchema),
    defaultValues: {
      showroomLocation: defaultShowroom,
    },
  });

  const onSubmit = async (values: CarDepositFormValues) => {
    // Giả lập gửi dữ liệu
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSuccess(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto bg-white p-6 border border-slate-200 rounded-xl">
      <Input
        label="Họ và tên khách hàng"
        placeholder="Nguyễn Văn A"
        error={errors.customerName?.message}
        {...register('customerName')}
      />

      <Input
        label="Số điện thoại di động"
        placeholder="0912345678"
        error={errors.customerPhone?.message}
        {...register('customerPhone')}
      />

      <Input
        label="Số Căn cước công dân (12 chữ số)"
        placeholder="001202000000"
        error={errors.identityCardNumber?.message}
        {...register('identityCardNumber')}
      />

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 uppercase">Showroom tiếp nhận</label>
        <select
          {...register('showroomLocation')}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">-- Chọn Showroom --</option>
          <option value="Hà Nội - Showroom Cầu Giấy">Hà Nội - Showroom Cầu Giấy</option>
          <option value="TP.HCM - Showroom Quận 1">TP.HCM - Showroom Quận 1</option>
        </select>
        {errors.showroomLocation && (
          <p className="text-xs text-rose-600 font-medium">{errors.showroomLocation.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          id="agreeTerms"
          {...register('agreeTerms')}
          className="mt-1 rounded text-red-600 focus:ring-red-500"
        />
        <label htmlFor="agreeTerms" className="text-xs text-slate-600">
          Tôi xác nhận thông tin CCCD là chính xác và cam kết giữ chỗ trong vòng 72 giờ theo hợp đồng.
        </label>
      </div>
      {errors.agreeTerms && (
        <p className="text-xs text-rose-600 font-medium">{errors.agreeTerms.message}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        {isSubmitting ? 'Đang khởi tạo phiếu cọc...' : 'Tiến hành đặt cọc qua VNPay'}
      </Button>
    </form>
  );
};
```

---

## 14. QUY CHUẨN GIT & CONVENTIONAL COMMITS

Tuân thủ nghiêm ngặt phương pháp luận **GitFlow** đã nêu trong hồ sơ đồ án.

### 14.1. Quy tắc phân nhánh
- `main`: Nhánh Release / Báo cáo nghiệm thu sản phẩm.
- `develop`: Nhánh tích hợp chính.
- `feature/<tên-tính-năng>`: Nhánh phát triển mới, rẽ nhánh từ `develop` (ví dụ: `feature/car-deposit`, `feature/car-estimator`).
- `bugfix/<tên-lỗi>`: Nhánh sửa lỗi phát sinh trong kiểm thử.

### 14.2. Chuẩn mực Conventional Commits
- Commit Message **BẮT BUỘC bằng Tiếng Anh**.
- Định dạng chuẩn: `<type>(<scope>): <short description>`
- Scope chính là tên feature module hoặc tầng kiến trúc (`cars`, `deposit`, `auth`, `router`, `lib`...).

```bash
# ✅ ĐÚNG:
feat(car-deposit): implement 72h reservation form with zod validation
fix(cart): resolve local storage sync bug upon login
refactor(routes): lazy load customer and admin layouts
docs: update AGENTS.md conventions guideline

# ❌ SAI:
git commit -m "fix bug"
git commit -m "update code"
git commit -m "them chuc nang dat coc"
```

---

## 15. CHỈ DẪN TÁC VỤ DÀNH RIÊNG CHO AI AGENT KHI VIBE CODING

Khi thực thi bất kỳ yêu cầu lập trình nào từ người dùng, AI Agent PHẢI tuân thủ:

### 15.1. Quy trình làm việc 6 bước (Mandatory 6-Step Workflow)
1. **Hiểu rõ phạm vi:** Đọc yêu cầu, xác định chính xác Feature Module liên quan trong `src/features/`.
2. **Kiểm tra file mẫu:** Mở 1-2 file tương tự đã có trong codebase để đồng bộ hóa phong cách định kiểu và layout.
3. **Domain & API:** Kiểm tra hoặc cập nhật DTO tại `src/types/` và endpoint tại `src/config/api.config.ts`.
4. **Service & Mock:** Tạo/cập nhật service trong `features/<x>/services/`, bổ sung mock data nếu chưa có backend.
5. **Business Hook:** Viết hook quản lý state dữ liệu tại `features/<x>/hooks/`.
6. **UI Component & Route:** Hoàn thiện giao diện, liên kết vào Router và kiểm tra `npm run build`.

### 15.2. Các điều TUYỆT ĐỐI CẤM đối với AI
- 🚫 **CẤM** tự ý chạy `npm install` thêm thư viện lạ khi chưa được yêu cầu. Khi cần cài đặt dependencies có sẵn, luôn dùng cờ:
  ```bash
  npm install --legacy-peer-deps
  ```
- 🚫 **CẤM** sửa đổi cấu hình gốc (`tsconfig.json`, `vite.config.ts`, `eslint.config.js`) ngoài chỉ dẫn cụ thể.
- 🚫 **CẤM** tạo các component trùng lặp với bộ UI có sẵn (`Button`, `Input`, `Badge`, `Modal`, `Table` trong `src/components`).
- 🚫 **CẤM** để lại các lệnh debug `console.log`, biến rác không sử dụng, hoặc comment TODO vô nghĩa.
- 🚫 **KHI THIẾU THÔNG TIN:** Hãy dừng lại và đặt câu hỏi làm rõ với người dùng thay vì tự ý phỏng đoán logic nghiệp vụ ô tô (ví dụ: công thức tính phí trước bạ, điều kiện hoàn cọc 72h).

### 15.3. Báo cáo kết quả
Sau mỗi phiên hoàn thành code, Agent PHẢI liệt kê:
1. Danh sách các file đã tạo mới / chỉnh sửa.
2. Kết quả kiểm tra biên dịch `npm run build`.
3. Các giả định nghiệp vụ đã được áp dụng trong quá trình sinh code.

---

## 16. BỘ QUY CHUẨN PHÒNG CHỐNG "AI SLOP" & NÂNG CAO GU THIẾT KẾ (ANTI-AI-SLOP GUIDELINES)

### 16.1. Định nghĩa "AI Slop" trong AutoHub Frontend
"AI Slop" (rác thiết kế / mã nguồn vô hồn do AI sinh ra) là những mẫu giao diện, bố cục và logic rập khuôn, hời hợt mà các mô hình AI (LLMs) tự động sinh ra theo quán tính dữ liệu đào tạo trung bình. 
Đặc trưng của AI Slop là **bề ngoài có vẻ bóng bẩy nhưng rỗng tuếch về giá trị sử dụng và thiếu bản sắc sản phẩm**:
- Lạm dụng dải màu gradient tím/xanh vũ trụ (`indigo`/`purple`) cùng hiệu ứng hào quang phát sáng (glows) vô tội vạ.
- Bố cục rập khuôn theo "công thức lười biếng": hàng 3 card tính năng giống hệt nhau, mỗi card cắm một icon trong ô tròn màu pastel.
- Giao diện quản trị (Staff/Admin) bị biến thành dashboard template rẻ tiền: câu chào sáo rỗng "Welcome back John 👋", 4 thẻ KPI chứa số liệu tăng trưởng ảo "+12.5%", biểu đồ diện tích loang lổ nhiều màu che lấp dữ liệu.
- Ngôn từ tiếp thị sáo rỗng kiểu AI ("Unlock the future", "Nâng tầm đẳng cấp", "Trải nghiệm vượt trội", "Seamless", "Supercharge") thay cho thông số kỹ thuật xe hơi chính xác.
- Mã nguồn và component hời hợt (Shallow UI): bấm nút không có phản hồi thật, thiếu hoàn toàn các trạng thái biên (loading, error, empty), không hiểu logic nghiệp vụ thực tế của ngành ô tô.

> [!CAUTION]
> **CẢNH BÁO KIẾN TRÚC:** AutoHub là nền tảng thương mại điện tử giao dịch sản phẩm giá trị cao (ô tô hàng trăm triệu đến hàng tỷ đồng). Mọi màn hình người dùng và quản trị **BẮT BUỘC** phải toát lên tinh thần **Automotive Substance**: Cơ khí chính xác, Vững chắc, Đĩnh đạc, Trung thực và Tối ưu mật độ thông tin cao cho Desktop. **AI SLOP BỊ NGHIÊM CẤM 100% TRONG TOÀN BỘ DỰ ÁN.**

---

### 16.2. Sổ tay nhận diện & Các điều CẤM TRIỆT ĐỂ (The Banned Slop Tells)

Dựa trên nghiên cứu chuẩn mực thiết kế (Anti-slop House Style), dự án thiết lập danh mục các "Tells" (dấu vết tố cáo AI sinh mã cẩu thả) bị **CẤM TUYỆT ĐỐI**:

#### A. Visual & Styling Tells (Giao diện & Thẩm mỹ rập khuôn)
1. **🚫 CẤM Gradient tím / chàm phát sáng (Purple/Indigo Glows & Gradients):**
   - *Cấm:* Các class như `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`, bóng đổ mờ ảo màu neon quanh các nút bấm hoặc card.
   - *Chuẩn thay thế:* Sử dụng bề mặt màu phẳng (`bg-white`, `bg-slate-900`), điểm xuyết màu nhấn cơ khí của thương hiệu (`bg-red-600` thể thao hoặc `bg-emerald-600` cho phân khúc xe điện).
2. **🚫 CẤM Chữ Gradient (Gradient Text):**
   - *Cấm:* `bg-clip-text text-transparent bg-gradient-to-r...` trên các thẻ tiêu đề `h1`, `h2`.
   - *Chuẩn thay thế:* Màu chữ đơn sắc đồng nhất, tương phản cao (`text-slate-900` trên nền sáng hoặc `text-white` trên nền tối).
3. **🚫 CẤM Lạm dụng Glassmorphism & Backdrop Blur:**
   - *Cấm:* Rải `backdrop-blur-md bg-white/20 border-white/30` khắp nơi tạo cảm giác nhòe nhoẹt, giảm khả năng đọc và gây giật lag trình duyệt.
   - *Chuẩn thay thế:* Phân tách bề mặt bằng bước tông màu phẳng đục (Opaque Tone Step: `bg-slate-50` đặt trên `bg-white`) và đường viền mảnh sắc gọn `border-slate-200`.
4. **🚫 CẤM Bộ 3 Card tính năng rập khuôn (Cliché 3-Card Feature Row):**
   - *Cấm:* Hàng 3 khối giống hệt nhau, mỗi khối gắn một icon trong ô tròn/vuông màu pastel nhạt ở trên cùng.
   - *Chuẩn thay thế:* Bố cục có chiều sâu dựa trên nội dung xe thực tế: Bảng so sánh thông số kỹ thuật 2 cột bất đối xứng, lưới phụ kiện dày dặn, lát cắt ảnh động cơ hoặc góc chụp khoang lái thực tế.
5. **🚫 CẤM Nhãn nhỏ in hoa li ti (Eyebrows / Kickers & Badges vô nghĩa):**
   - *Cấm:* Đặt một nhãn nhỏ chữ in hoa giãn cách trên đầu tiêu đề ("INTRODUCING", "FEATURES", "AUTOHUB EXCLUSIVE") hoặc badge "New ✨".
   - *Chuẩn thay thế:* Đưa thẳng thông điệp giá trị vào tiêu đề chính hoặc câu mô tả bổ trợ bên dưới.
6. **🚫 CẤM Số thứ tự đếm trang trí lười biếng & Kẻ viền Tech Cosplay:**
   - *Cấm:* Rải `01 / 02 / 03`, `(001)`, đường ngắm chữ thập (crosshairs), dấu crop-mark, hoặc đường kẻ mảnh li ti để giả phong cách công nghệ vũ trụ.
   - *Chuẩn thay thế:* Phân cấp bằng kích thước chữ, khoảng cách trắng (whitespace), hoặc cấu trúc thẻ `<ol>` có ý nghĩa ngữ nghĩa thực sự.
7. **🚫 CẤM Dùng Emoji làm icon:**
   - *Cấm:* Dùng `🚗`, `⚡`, `🚀`, `🔥`, `⭐` trong tiêu đề, danh sách hoặc nút bấm.
   - *Chuẩn thay thế:* Chỉ dùng icon hình học tinh gọn từ thư viện `lucide-react` hoặc ảnh chụp thực tế.

#### B. Dashboard & Back-Office Tells (Bảng điều khiển Staff & Admin)
1. **🚫 CẤM Lời chào rỗng tuếch & Icon vẫy tay:**
   - *Cấm:* "Welcome back, John! 👋" chiếm diện tích quý giá trên màn hình làm việc của nhân viên showroom.
   - *Chuẩn thay thế:* Tiêu đề làm việc thực chất, nêu rõ nhiệm vụ và phạm vi: "Điều phối giao xe & Lái thử trong ngày", "Danh sách 18 hợp đồng cọc chờ gán số VIN".
2. **🚫 CẤM 4 thẻ KPI rập khuôn với số liệu tăng trưởng ảo:**
   - *Cấm:* 4 ô KPI luôn luôn có icon trong vòng tròn màu, con số `+12.5% vs last month` màu xanh lá và sparkline uốn lượn vô căn cứ.
   - *Chuẩn thay thế:* Thẻ chỉ số hiển thị con số thật với typography dứt khoát, gắn liền với nghiệp vụ ô tô (Ví dụ: "Xe sẵn sàng bàn giao: 12 xe", "Cọc quá hạn 72h cần xử lý: 3 phiếu").
3. **🚫 CẤM Biểu đồ Gradient 7 sắc cầu vồng (Rainbow / Gradient Area Charts):**
   - *Cấm:* Biểu đồ vùng đổ dốc màu tím sang hồng mờ mịt không rõ ý nghĩa phân tích, trục tọa độ thiếu đơn vị (VND, số lượng xe).
   - *Chuẩn thay thế:* Biểu đồ cột (Bar) hoặc đường mảnh (Line) với 1 màu dữ liệu chủ đạo (`slate-800` hoặc `blue-600`), lưới tọa độ mờ tối giản, số liệu có chú giải rõ ràng.
4. **🚫 CẤM Thanh xám giả lập (Grey bars / Dummy skeletons):**
   - *Cấm:* Vẽ các thanh màu xám `h-4 bg-slate-200 rounded` để giả lập dashboard trong các bản demo.
   - *Chuẩn thay thế:* Hiển thị dữ liệu thực tế: Mã số VIN 17 ký tự chuẩn quốc tế, tên dòng xe (Sedan, SUV), tên showroom, biển số tạm, giá trị đặt cọc VND.

#### C. Content & Copywriting Tells (Ngôn từ tiếp thị sáo rỗng)
1. **🚫 CẤM Khẩu hiệu tiếp thị rỗng tuếch kiểu AI:**
   - *Cấm:* "Mở khóa tương lai ngành ô tô", "Nâng tầm đẳng cấp thượng lưu", "Trải nghiệm vượt trội không giới hạn", "Seamless", "Supercharge", "Cutting-edge", "All-in-one solution".
   - *Chuẩn thay thế:* Văn phong đĩnh đạc, trung thực, tập trung vào sự thật và lợi ích khách hàng: "Dự toán chi phí lăn bánh chính xác theo quy chuẩn từng tỉnh thành", "Đặt cọc trực tuyến giữ xe trong 72 giờ cam kết bàn giao đúng hẹn", "Đăng ký lái thử tận nhà miễn phí".
2. **🚫 CẤM Bịa đặt bằng chứng xã hội (Fake Social Proof):**
   - *Cấm:* Tự bịa đánh giá "Nguyễn Văn A - CEO XYZ: Dịch vụ tuyệt vời nhất...", "Hơn 50,000+ khách hàng tin dùng".
   - *Chuẩn thay thế:* Chỉ hiển thị đánh giá thực từ database hoặc ẩn hẳn phần review khi chưa có dữ liệu thật.
3. **🚫 CẤM Tiêu đề dài dòng lê thê:**
   - *Cấm:* Tiêu đề dài 4 dòng chữ chiếm hết màn hình đầu tiên (Above the fold).
   - *Chuẩn thay thế:* Tiêu đề tối đa 2 dòng (khoảng 5-7 từ, dưới 35 ký tự), câu bổ trợ bên dưới giải đáp ngay câu hỏi lớn nhất của người mua xe.

#### D. Code & Interaction Tells (Lập trình cẩu thả & Hời hợt)
1. **🚫 CẤM Giao diện rỗng ruột (Shallow UI):**
   - *Cấm:* Vẽ component cho có hình thức nhưng nút bấm không có phản hồi, bấm submit chỉ hiện `alert('Thành công')`, không validate dữ liệu, không có disable state khi đang submit.
   - *Chuẩn thay thế:* Kết nối đầy đủ React Hook Form + Zod, xử lý disable button, hiển thị spinner khi pending, bắt lỗi API và thông báo toast rõ ràng.
2. **🚫 CẤM Bịa đặt logic & Công thức nghiệp vụ ô tô:**
   - *Cấm:* Tự phỏng đoán công thức thuế phí lăn bánh (ví dụ: nhân bừa 10%) hoặc bịa quy trình hoàn cọc 72h.
   - *Chuẩn thay thế:* Tuân thủ chính xác biểu phí nhà nước (Hà Nội & TP.HCM: 12% trước bạ; tỉnh khác: 10%; xe điện: 0%; phí biển số 20 triệu vs 1 triệu) và hợp đồng cọc xe đã quy định trong đồ án.

---

### 16.3. Bảng đối chiếu nhanh: Slop bị cấm vs Chuẩn mực AutoHub

| Khía cạnh | ❌ AI Slop (Bị cấm) | ✅ Chuẩn mực AutoHub (Bắt buộc) |
|---|---|---|
| **Bảng màu (Palette)** | Gradient tím, hồng, xanh neon, nền đen mờ phát sáng | Bảng màu Semantic vững chãi: Nền `slate-50`/`white`, Text `slate-900`, Điểm nhấn `red-600` hoặc `slate-900` |
| **Bề mặt (Surfaces)** | Đổ bóng mờ nhạt lơ lửng khắp mọi card, viền kính mờ glassmorphism | Bề mặt phẳng, phân tách bằng bước tông màu (`bg-slate-50` vs `bg-white`) và viền mảnh sắc nét `border-slate-200` |
| **Khối tính năng** | Hàng 3 card giống hệt nhau với icon trong vòng tròn màu pastel | Bố cục đa dạng: Bảng thông số kỹ thuật (Specs grid), ảnh cắt lớp động cơ, so sánh tương quan thực chất |
| **Tiêu đề (Headlines)** | Câu văn dài 3-4 dòng, chữ tô màu loang lổ (gradient text) | Tiêu đề tối đa 2 dòng, chữ màu đơn sắc đậm nét, kích thước tương phản rõ rệt với đoạn văn |
| **Trang trí (Ornaments)** | Eyebrow in hoa li ti, status dot nhấp nháy, emoji 🚗⚡ | Xóa bỏ mọi trang trí thừa thãi; dùng ảnh xe thật sắc nét và thông số cơ khí chính xác làm điểm nhấn |
| **Dashboard Back-Office** | Câu chào sáo rỗng 👋, 4 KPI có sparkline ảo, biểu đồ nhiều màu | Mật độ thông tin cao (High-density), bảng biểu dữ liệu căn chỉnh thẳng hàng, bộ lọc thao tác 1-click |
| **Văn bản (Copy)** | Sáo rỗng: "Mở khóa tương lai", "Nâng tầm đẳng cấp", "Seamless" | Thực tế, đĩnh đạc: "Dự toán chi phí lăn bánh", "Hợp đồng cọc giữ xe 72h", "Cam kết giao xe đúng hẹn" |
| **Chất lượng code** | UI tĩnh không logic, `useEffect` race conditions, alert giả lập | Custom Hook có AbortController, React Hook Form + Zod, đủ 3 trạng thái Loading/Error/Empty |

---

### 16.4. Tôn chỉ thiết kế: "Substance over Ornament" (Thực chất hơn hào nhoáng)

Khi xây dựng giao diện cho AutoHub, lập trình viên và AI Agent **PHẢI** tuân thủ 4 nguyên tắc nghệ thuật sau:

1. **Chất cơ khí chính xác (Mechanical Precision):**
   - Xe hơi là đỉnh cao của kỹ thuật cơ khí và an toàn. Giao diện AutoHub phải thể hiện sự đĩnh đạc, vững chắc và tin cậy.
   - Tôn vinh hình ảnh sản phẩm: Hình ảnh xe phải chụp ở các góc độ sắc nét (góc 3/4 trước, khoang lái, động cơ, mâm xe). Thông số kỹ thuật phải được trình bày rõ ràng, minh bạch (Mã lực, Mô-men xoắn, Hộp số, Dung tích xy-lanh, Mức tiêu thụ nhiên liệu L/100km).
2. **Khoảng cách và mật độ có chủ đích (Intentional Spacing & Density):**
   - **Showroom / Khách hàng:** Khoảng cách giữa các section rộng rãi (80px – 120px trên màn hình desktop), tạo cảm giác sang trọng như bước vào showroom thực tế.
   - **Back-Office (Staff / Admin):** Áp dụng bố cục mật độ cao (High-Density): padding tinh gọn (`py-2.5`, `px-3`), bảng dữ liệu hiển thị được nhiều hàng trên một màn hình, giúp nhân viên xử lý đơn cọc và gán số VIN nhanh chóng mà không phải cuộn trang liên tục.
3. **Màu sắc phục vụ dữ liệu, không phục vụ khung viền (Color for Data, Not Chrome):**
   - Giữ cho khung viền (sidebar, header, card border) luôn ở gam màu trung tính (`slate-200`, `slate-700`).
   - Màu sắc nổi bật chỉ xuất hiện để biểu thị trạng thái dữ liệu nghiệp vụ:
     - `emerald-600`: Xe sẵn sàng giao / Đã hoàn tất thanh toán cọc VNPay.
     - `amber-600`: Phiếu cọc đang chờ duyệt / Đang trong 72 giờ giữ xe.
     - `rose-600`: Hết hạn cọc 72h / Yêu cầu hoàn cọc từ chối.
     - `blue-600`: Lịch hẹn lái thử đã xác nhận.
4. **Kiểm tra thực tế (The Reality Check):**
   - Trước khi hoàn thành một màn hình, hãy tự hỏi: *"Nếu che logo AutoHub đi, giao diện này có bị nhầm với một template bán khóa học, crypto hay SaaS chung chung không?"*.
   - Nếu có, hãy loại bỏ ngay các icon trong vòng tròn màu, dải gradient và bổ sung các đặc trưng thực thụ của ô tô (bảng thông số kỹ thuật xe, mã số VIN, phụ kiện chính hãng, bảng tính lăn bánh).

---

## 17. CHECKLIST KIỂM TRA TRƯỚC KHI COMMIT / MỞ PR

Trước khi tạo commit hoặc mở Pull Request, lập trình viên và AI Agent **PHẢI** tự rà soát danh sách kiểm tra sau:

- [ ] **1. Compile TS & Build:** Lệnh `npm run build` chạy thành công không có bất kỳ lỗi hoặc warning nào.
- [ ] **2. Lint sạch sẽ:** Lệnh `npm run lint` không báo lỗi vi phạm cú pháp.
- [ ] **3. Cấm `any`:** Không có bất kỳ từ khóa `any` nào trong mã nguồn mới.
- [ ] **4. Chuẩn Import `@/`:** Mọi import xuyên thư mục đều sử dụng `@/`, không còn `../` lùi tầng.
- [ ] **5. Type-only Imports:** Mọi import kiểu dữ liệu đều dùng cú pháp `import type { ... }`.
- [ ] **6. Đặt tên chuẩn:** File, component, hook, store, service đều tuân thủ bảng mục 3.
- [ ] **7. Đủ 3 trạng thái:** Các trang tải dữ liệu đều có giao diện Loading, Error (có nút retry), và Empty.
- [ ] **8. Ngôn ngữ chuẩn:** Toàn bộ text giao diện, placeholder, validation message đều bằng **Tiếng Việt**.
- [ ] **9. Không Hardcode:** Không hardcode URL API, Role, mã màu Hex hay hằng số hệ thống.
- [ ] **10. Responsive Desktop:** Giao diện hiển thị rõ ràng, không vỡ layout ở độ phân giải 1366×768 và 1920×1080.
- [ ] **11. Dọn dẹp mã nguồn:** Đã xóa bỏ mọi `console.log` thử nghiệm và import không dùng tới.
- [ ] **12. Loại bỏ hoàn toàn AI Slop:** Không có gradient tím/xanh phát sáng, không dùng chữ gradient, không lạm dụng backdrop-blur, không có hàng 3 card rập khuôn với icon trong vòng tròn màu.
- [ ] **13. Ngôn từ thực chất (No Slop Copy):** Không sử dụng khẩu hiệu sáo rỗng ("Seamless", "Elevate", "Nâng tầm tương lai"), tiêu đề súc tích <= 2 dòng, dữ liệu phản ánh nghiệp vụ ô tô thật.
- [ ] **14. Dashboard đúng chuẩn Desktop:** Mật độ thông tin cao, không chứa lời chào sáo rỗng hay KPI sparkline ảo, màu sắc chỉ dùng cho trạng thái dữ liệu.
- [ ] **15. Tương tác hoàn thiện:** Mọi nút bấm, form nhập liệu đều có validation và xử lý submit/error/loading đầy đủ (không shallow UI).
- [ ] **16. Commit Message:** Tuân thủ Conventional Commits bằng tiếng Anh (ví dụ: `feat(car-deposit): ...`).
