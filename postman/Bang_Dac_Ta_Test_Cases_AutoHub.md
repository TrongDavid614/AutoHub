# BẢNG ĐẶC TẢ CHI TIẾT CÁC TEST CASES DỰ ÁN AUTOHUB

- **Sinh viên thực hiện:** Nguyễn Văn Quốc - MSSV: 23645971
- **Môn học:** Lập trình WWW với Java (IUH)
- **Tổng số ca kiểm thử:** 44 Test Cases
- **Tỷ lệ Pass:** 100% (44/44 PASS - 0 FAILED - 0 ERROR)

| STT | Mã TC | Phân hệ / UC | Tên Test Case | Method & Endpoint | Role | Kỳ vọng (Expected) | Trạng thái |
| :---: | :---: | :--- | :--- | :--- | :---: | :--- | :---: |
| 1 | `TC_AUTH_01` | 01. Authentication & Phân Quyền RBAC | 1. Đăng nhập Khách hàng (Customer) | `POST` `/api/auth/login` | `Public` | HTTP 200 OK, trả về accessToken và vai trò ROLE_CUSTOMER | **PASS** |
| 2 | `TC_AUTH_02` | 01. Authentication & Phân Quyền RBAC | 2. Đăng nhập Nhân viên Showroom (Staff) | `POST` `/api/auth/login` | `Public` | HTTP 200 OK, trả về accessToken và vai trò ROLE_STAFF | **PASS** |
| 3 | `TC_AUTH_03` | 01. Authentication & Phân Quyền RBAC | 3. Đăng nhập Quản trị viên (Admin) | `POST` `/api/auth/login` | `Public` | HTTP 200 OK, trả về accessToken và vai trò ROLE_ADMIN | **PASS** |
| 4 | `TC_AUTH_04` | 01. Authentication & Phân Quyền RBAC | 4. Đăng nhập sai mật khẩu (Negative Case) | `POST` `/api/auth/login` | `Public` | HTTP 400/401, success=false, thông báo lỗi xác thực | **PASS** |
| 5 | `TC_AUTH_05` | 01. Authentication & Phân Quyền RBAC | 5. Xem thông tin tài khoản cá nhân (Profile) | `GET` `/api/customer/profile` | `ROLE_CUSTOMER` | HTTP 200 OK, trả về họ tên, email, số điện thoại | **PASS** |
| 6 | `TC_AUTH_06` | 01. Authentication & Phân Quyền RBAC | 6. Chặn Customer truy cập API Quản trị Admin (Negative Case 403) | `GET` `/api/admin/system-monitor/health` | `ROLE_CUSTOMER` | HTTP 403 Forbidden, bảo vệ an toàn phân quyền Spring Security | **PASS** |
| 7 | `TC_CAR_01` | 02. Danh Mục Dòng Xe & Phiên Bản | 7. Lấy danh sách toàn bộ dòng xe | `GET` `/api/customer/cars` | `Public` | HTTP 200 OK, danh sách các mẫu xe GT-e, SUV, Sedan | **PASS** |
| 8 | `TC_CAR_02` | 02. Danh Mục Dòng Xe & Phiên Bản | 8. Lấy chi tiết dòng xe hợp lệ (id=1) | `GET` `/api/customer/cars/1` | `Public` | HTTP 200 OK, trả về chi tiết AutoHub GT-e Grand Touring | **PASS** |
| 9 | `TC_CAR_03` | 02. Danh Mục Dòng Xe & Phiên Bản | 9. Lấy chi tiết dòng xe không tồn tại (Negative Case 404) | `GET` `/api/customer/cars/9999` | `Public` | HTTP 404 Not Found | **PASS** |
| 10 | `TC_CAR_04` | 02. Danh Mục Dòng Xe & Phiên Bản | 10. So sánh thông số kỹ thuật 2 phiên bản xe | `GET` `/api/customer/cars/compare?variantIds=1,2` | `Public` | HTTP 200 OK, trả về cấu hình pin, công suất, tầm vận hành | **PASS** |
| 11 | `TC_ACC_01` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 11. Lấy danh mục nhóm phụ kiện chính hãng | `GET` `/api/customer/accessories/categories` | `Public` | HTTP 200 OK, trả về các nhóm danh mục phụ kiện | **PASS** |
| 12 | `TC_ACC_02` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 12. Lấy danh sách phụ kiện chính hãng | `GET` `/api/customer/accessories` | `Public` | HTTP 200 OK, mảng phụ kiện kèm giá và số lượng tồn kho | **PASS** |
| 13 | `TC_ACC_03` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 13. Tìm kiếm phụ kiện theo từ khóa Wallbox | `GET` `/api/customer/accessories?keyword=Wallbox` | `Public` | HTTP 200 OK, trả về các bộ sạc Wallbox phù hợp | **PASS** |
| 14 | `TC_ACC_04` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 14. Lấy chi tiết phụ kiện hợp lệ (id=1) | `GET` `/api/customer/accessories/1` | `Public` | HTTP 200 OK, thông tin bộ sạc treo tường thông minh 22kW | **PASS** |
| 15 | `TC_ACC_05` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 15. Lấy chi tiết phụ kiện không tồn tại (Negative Case 404) | `GET` `/api/customer/accessories/9999` | `Public` | HTTP 404 Not Found | **PASS** |
| 16 | `TC_ACC_06` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 16. Thêm phụ kiện vào giỏ hàng | `POST` `/api/customer/cart/items` | `ROLE_CUSTOMER` | HTTP 200 OK, giỏ hàng được cập nhật | **PASS** |
| 17 | `TC_ACC_07` | 03. Phụ Kiện Ô Tô & Giỏ Hàng | 17. Lấy danh sách giỏ hàng hiện tại | `GET` `/api/customer/cart` | `ROLE_CUSTOMER` | HTTP 200 OK, trả về danh sách items và subtotal | **PASS** |
| 18 | `TC_DEP_01` | 04. Đặt Cọc & Giữ Xe Trực Tuyến | 18. Tra cứu lịch sử đặt cọc của Khách hàng | `GET` `/api/customer/deposits` | `ROLE_CUSTOMER` | HTTP 200 OK, danh sách phiếu cọc kèm trạng thái | **PASS** |
| 19 | `TC_DEP_02` | 04. Đặt Cọc & Giữ Xe Trực Tuyến | 19. Tra cứu chi tiết phiếu cọc đã tạo (id=1) | `GET` `/api/customer/deposits/1` | `ROLE_CUSTOMER` | HTTP 200 OK, thông tin số tiền cọc, hạn giữ xe 72h | **PASS** |
| 20 | `TC_DEP_03` | 04. Đặt Cọc & Giữ Xe Trực Tuyến | 20. Webhook SePay - Chặn sai API Key (Negative Case 401) | `POST` `/api/payment/sepay-webhook` | `Public` | HTTP 401 Unauthorized, từ chối giao dịch | **PASS** |
| 21 | `TC_DEP_04` | 04. Đặt Cọc & Giữ Xe Trực Tuyến | 21. Webhook SePay - Xác nhận giao dịch cọc xe hợp lệ | `POST` `/api/payment/sepay-webhook` | `Gateway` | HTTP 200 OK, thông báo kích hoạt giữ xe 72 giờ | **PASS** |
| 22 | `TC_ORD_01` | 05. Đơn Hàng Phụ Kiện Trực Tuyến | 22. Lấy danh sách đơn hàng đã mua | `GET` `/api/customer/orders` | `ROLE_CUSTOMER` | HTTP 200 OK, danh sách đơn hàng kèm trạng thái | **PASS** |
| 23 | `TC_ORD_02` | 05. Đơn Hàng Phụ Kiện Trực Tuyến | 23. Tra cứu chi tiết đơn hàng id=1 | `GET` `/api/customer/orders/1` | `ROLE_CUSTOMER` | HTTP 200 OK, trả về chi tiết sản phẩm và tổng tiền | **PASS** |
| 24 | `TC_TD_01` | 06. Đăng Ký Lái Thử & Xe Demo | 24. Lấy danh sách lịch hẹn lái thử của Khách hàng | `GET` `/api/customer/engagement/test-drives` | `ROLE_CUSTOMER` | HTTP 200 OK, thông tin địa điểm và thời gian lái thử | **PASS** |
| 25 | `TC_TD_02` | 06. Đăng Ký Lái Thử & Xe Demo | 25. Đặt lịch lái thử vi phạm chưa cam kết GPLX (Negative Case 400) | `POST` `/api/customer/engagement/test-drives` | `ROLE_CUSTOMER` | HTTP 400 Bad Request, từ chối đặt lịch khi chưa cam kết GPLX | **PASS** |
| 26 | `TC_TD_03` | 06. Đăng Ký Lái Thử & Xe Demo | 26. Đặt lịch lái thử vi phạm thời gian dưới 24h (Negative Case 400) | `POST` `/api/customer/engagement/test-drives` | `ROLE_CUSTOMER` | HTTP 400 Bad Request, báo lỗi quy định thời gian tối thiểu 24h | **PASS** |
| 27 | `TC_STF_01` | 07. Cổng Nghiệp Vụ Nhân Viên Showroom | 27. Nhân viên Showroom xem tổng quan Workspace | `GET` `/api/staff/workspace` | `ROLE_STAFF` | HTTP 200 OK, trả về số ca lái thử trong ngày, cọc cần gán VIN | **PASS** |
| 28 | `TC_STF_02` | 07. Cổng Nghiệp Vụ Nhân Viên Showroom | 28. Nhân viên xem danh sách ca lái thử cần phục vụ | `GET` `/api/staff/test-drives` | `ROLE_STAFF` | HTTP 200 OK, thông tin khách hẹn, ca giờ, trạng thái duyệt | **PASS** |
| 29 | `TC_STF_03` | 07. Cổng Nghiệp Vụ Nhân Viên Showroom | 29. Nhân viên tra cứu đội xe Demo khả dụng | `GET` `/api/staff/test-drives/demo-cars` | `ROLE_STAFF` | HTTP 200 OK, danh sách xe demo kèm biển số và trạng thái | **PASS** |
| 30 | `TC_STF_04` | 07. Cổng Nghiệp Vụ Nhân Viên Showroom | 30. Nhân viên tra cứu phiếu cọc chờ cấp phát số VIN | `GET` `/api/staff/deposits` | `ROLE_STAFF` | HTTP 200 OK, danh sách phiếu cọc PAID chờ gán VIN | **PASS** |
| 31 | `TC_FIN_01` | 08. Chính Sách, Tài Chính & Phê Duyệt | 31. Dự toán chi phí lăn bánh ô tô theo tỉnh thành | `GET` `/api/customer/estimator/calculate?variantId=1&provinceId=1` | `Public` | HTTP 200 OK, bảng chiết tính chi phí minh bạch | **PASS** |
| 32 | `TC_FIN_02` | 08. Chính Sách, Tài Chính & Phê Duyệt | 32. Lấy biểu phí lăn bánh theo quy định nhà nước | `GET` `/api/admin/registration-fees` | `ROLE_ADMIN` | HTTP 200 OK, danh sách mức phí KV1 (HN, TPHCM) và KV2/KV3 | **PASS** |
| 33 | `TC_FIN_03` | 08. Chính Sách, Tài Chính & Phê Duyệt | 33. Lấy biểu lãi suất vay trả góp ngân hàng liên kết | `GET` `/api/admin/registration-fees/loans` | `ROLE_ADMIN` | HTTP 200 OK, lãi suất cố định, tỷ lệ vay tối đa 80% | **PASS** |
| 34 | `TC_FIN_04` | 08. Chính Sách, Tài Chính & Phê Duyệt | 34. Thống kê biểu phí đăng ký xe toàn quốc | `GET` `/api/admin/registration-fees/stats` | `ROLE_ADMIN` | HTTP 200 OK, số tỉnh áp dụng chính sách ưu đãi | **PASS** |
| 35 | `TC_FIN_05` | 08. Chính Sách, Tài Chính & Phê Duyệt | 35. Admin tra cứu danh sách yêu cầu hoàn cọc | `GET` `/api/admin/refunds` | `ROLE_ADMIN` | HTTP 200 OK, danh sách hồ sơ kèm lý do và số tiền hoàn | **PASS** |
| 36 | `TC_AUTO_01` | 09. Tác Vụ Ngầm Tự Động Hóa (UC34 - UC36) | 36. UC34 - Tự động thu hồi cọc 72h & Hủy đơn hàng 15m | `POST` `/api/admin/automation/sweep-expired` | `ROLE_ADMIN` | HTTP 200 OK, hoàn trả tồn kho xe và phụ kiện an toàn | **PASS** |
| 37 | `TC_AUTO_02` | 09. Tác Vụ Ngầm Tự Động Hóa (UC34 - UC36) | 37. UC35 - Tự động hủy lịch lái thử chưa duyệt trước 12h | `POST` `/api/admin/automation/sweep-test-drives` | `ROLE_ADMIN` | HTTP 200 OK, giải phóng xe demo về trạng thái sẵn sàng | **PASS** |
| 38 | `TC_AUTO_03` | 09. Tác Vụ Ngầm Tự Động Hóa (UC34 - UC36) | 38. UC36 - Tự động gửi email nhắc lịch lái thử trước 24h | `POST` `/api/admin/automation/send-reminders` | `ROLE_ADMIN` | HTTP 200 OK, gửi thư nhắc hẹn và bật cờ daGuiNhacLich=1 | **PASS** |
| 39 | `TC_AUTO_04` | 09. Tác Vụ Ngầm Tự Động Hóa (UC34 - UC36) | 39. Tra cứu trạng thái hàng đợi các tác vụ tự động hóa | `GET` `/api/admin/automation/status` | `ROLE_ADMIN` | HTTP 200 OK, trả về số lượng bản ghi trong từng hàng đợi | **PASS** |
| 40 | `TC_SYS_01` | 10. Quản Trị Hệ Thống & Telemetry | 40. Giám sát sức khỏe toàn hệ thống (System Health Monitor) | `GET` `/api/admin/system-monitor/health` | `ROLE_ADMIN` | HTTP 200 OK, tất cả dịch vụ ở trạng thái ONLINE/HEALTHY | **PASS** |
| 41 | `TC_SYS_02` | 10. Quản Trị Hệ Thống & Telemetry | 41. Kích hoạt chạy ngầm từ System Monitor Dashboard | `POST` `/api/admin/system-monitor/trigger-cron` | `ROLE_ADMIN` | HTTP 200 OK, status=SUCCESS, thời gian thực thi < 100ms | **PASS** |
| 42 | `TC_SYS_03` | 10. Quản Trị Hệ Thống & Telemetry | 42. Báo Cáo Phân Tích Hành Vi & Telemetry Người Dùng | `GET` `/api/admin/analytics/overview` | `ROLE_ADMIN` | HTTP 200 OK, kết nối CSDL thực tế thành công không lỗi 500 | **PASS** |
| 43 | `TC_SYS_04` | 10. Quản Trị Hệ Thống & Telemetry | 43. Tra cứu lịch sử Nhật Ký Kiểm Toán (Audit Logs) | `GET` `/api/admin/system-monitor/audit-logs?limit=20` | `ROLE_ADMIN` | HTTP 200 OK, mảng nhật ký gồm IP, thời gian, thao tác | **PASS** |
| 44 | `TC_SYS_05` | 10. Quản Trị Hệ Thống & Telemetry | 44. Xuất Báo Cáo Nhật Ký Kiểm Toán (.csv Excel UTF-8) | `GET` `/api/admin/system-monitor/export` | `ROLE_ADMIN` | HTTP 200 OK, file CSV UTF-8 tải về thành công | **PASS** |
