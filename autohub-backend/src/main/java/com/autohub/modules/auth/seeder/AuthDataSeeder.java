package com.autohub.modules.auth.seeder;

import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class AuthDataSeeder implements CommandLineRunner {

    private final NguoiDungRepository nguoiDungRepository;
    private final ShowroomRepository showroomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Bắt đầu kiểm tra và khởi tạo tài khoản test mặc định (AuthDataSeeder)...");

        String defaultRawPassword = "Test@1234";
        String encodedPassword = passwordEncoder.encode(defaultRawPassword);

        Showroom firstShowroom = showroomRepository.findById(1L).orElse(null);

        // 1. Admin test account
        ensureUser("admin.test@autohub.vn", "Trần Đức Nam (Admin Test)", encodedPassword, "0988111222", "001099001122",
                VaiTroNguoiDung.ROLE_ADMIN, TrangThaiTaiKhoan.HOAT_DONG, firstShowroom);

        // 2. Staff test account
        ensureUser("staff.test@autohub.vn", "Nguyễn Văn Tuấn (Staff Test)", encodedPassword, "0977222333", "001099002233",
                VaiTroNguoiDung.ROLE_STAFF, TrangThaiTaiKhoan.HOAT_DONG, firstShowroom);

        // 3. Customer test account
        ensureUser("customer.test@autohub.vn", "Lê Hoàng Long (Customer Test)", encodedPassword, "0911333444", "001099003344",
                VaiTroNguoiDung.ROLE_CUSTOMER, TrangThaiTaiKhoan.HOAT_DONG, null);

        // 4. Locked test account (for 403 / locked testing)
        ensureUser("locked.test@autohub.vn", "Tài Khoản Bị Khóa (Test)", encodedPassword, "0911555666", "001099004455",
                VaiTroNguoiDung.ROLE_CUSTOMER, TrangThaiTaiKhoan.BI_KHOA, null);

        // 5. Đồng bộ mật khẩu Test@1234 cho các tài khoản mặc định
        nguoiDungRepository.findByEmail("admin@autohub.vn").ifPresent(admin -> {
            admin.setMatKhauBam(encodedPassword);
            nguoiDungRepository.save(admin);
        });

        nguoiDungRepository.findByEmail("tuan.nguyen@autohub.vn").ifPresent(staff -> {
            staff.setMatKhauBam(encodedPassword);
            nguoiDungRepository.save(staff);
        });

        log.info("Hoàn tất khởi tạo dữ liệu tài khoản test!");
    }

    private void ensureUser(String email, String hoTen, String encodedPassword, String phone, String cccd,
                            VaiTroNguoiDung role, TrangThaiTaiKhoan status, Showroom showroom) {
        if (!nguoiDungRepository.existsByEmail(email)) {
            NguoiDung user = NguoiDung.builder()
                    .email(email)
                    .hoTen(hoTen)
                    .matKhauBam(encodedPassword)
                    .soDienThoai(phone)
                    .soCCCD(cccd)
                    .vaiTro(role)
                    .trangThaiTaiKhoan(status)
                    .showroom(showroom)
                    .ngayTao(LocalDateTime.now())
                    .isDeleted(false)
                    .build();
            nguoiDungRepository.save(user);
            log.info("Đã tạo mới tài khoản test: [{}] - Role: [{}]", email, role);
        } else {
            nguoiDungRepository.findByEmail(email).ifPresent(user -> {
                user.setMatKhauBam(encodedPassword);
                user.setTrangThaiTaiKhoan(status);
                nguoiDungRepository.save(user);
            });
        }
    }
}
