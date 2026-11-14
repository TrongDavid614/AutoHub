package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.pricing.entity.TinhThanh;
import com.autohub.core.pricing.repository.TinhThanhRepository;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import com.autohub.core.showroom.repository.XeDemoRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.admin.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/showrooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminShowroomController {

    private final ShowroomRepository showroomRepository;
    private final TinhThanhRepository tinhThanhRepository;
    private final XeDemoRepository xeDemoRepository;
    private final TonKhoXeRepository tonKhoXeRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PhienBanXeRepository phienBanXeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminShowroomDto>>> getAllShowrooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Boolean active) {

        List<Showroom> list = showroomRepository.findAllByOrderByIdAsc();

        List<AdminShowroomDto> dtos = list.stream()
                .map(this::toDto)
                .filter(sr -> {
                    if (keyword != null && !keyword.trim().isEmpty()) {
                        String kw = keyword.trim().toLowerCase();
                        boolean matchName = sr.getName() != null && sr.getName().toLowerCase().contains(kw);
                        boolean matchAddress = sr.getAddress() != null && sr.getAddress().toLowerCase().contains(kw);
                        boolean matchHotline = sr.getHotline() != null && sr.getHotline().contains(kw);
                        boolean matchCode = sr.getCode() != null && sr.getCode().toLowerCase().contains(kw);
                        if (!matchName && !matchAddress && !matchHotline && !matchCode) return false;
                    }
                    if (region != null && !region.trim().isEmpty() && !region.equalsIgnoreCase("ALL")) {
                        if (!region.equalsIgnoreCase(sr.getRegion())) return false;
                    }
                    if (active != null) {
                        if (sr.isActive() != active) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải danh sách mạng lưới showroom thành công"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminShowroomStatsDto>> getShowroomStats() {
        List<Showroom> showrooms = showroomRepository.findAll();
        int totalShowrooms = showrooms.size();
        int activeShowrooms = (int) showrooms.stream().filter(Showroom::isDangHoatDong).count();
        int inactiveShowrooms = totalShowrooms - activeShowrooms;

        int totalDemoFleet = (int) xeDemoRepository.count();
        int readyDemoFleet = (int) xeDemoRepository.countByTrangThai(TrangThaiXeDemo.SAN_SANG);

        Integer totalPhysical = tonKhoXeRepository.sumTotalPhysicalAllShowrooms();
        Integer totalReserved = tonKhoXeRepository.sumTotalReservedAllShowrooms();

        int totalStaff = (int) showrooms.stream()
                .mapToLong(sr -> nguoiDungRepository.countByShowroomId(sr.getId()))
                .sum();

        Map<String, Integer> regionDistribution = new LinkedHashMap<>();
        regionDistribution.put("Miền Bắc", 0);
        regionDistribution.put("Miền Trung", 0);
        regionDistribution.put("Miền Nam", 0);

        for (Showroom sr : showrooms) {
            String r = resolveRegion(sr.getTinhThanh());
            regionDistribution.put(r, regionDistribution.getOrDefault(r, 0) + 1);
        }

        AdminShowroomStatsDto stats = AdminShowroomStatsDto.builder()
                .totalShowrooms(totalShowrooms)
                .activeShowrooms(activeShowrooms)
                .inactiveShowrooms(inactiveShowrooms)
                .totalDemoFleet(totalDemoFleet)
                .readyDemoFleet(readyDemoFleet)
                .totalPhysicalInventory(totalPhysical != null ? totalPhysical : 0)
                .totalReservedInventory(totalReserved != null ? totalReserved : 0)
                .totalStaff(totalStaff)
                .regionDistribution(regionDistribution)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(stats, "Tải thống kê mạng lưới showroom thành công"));
    }

    @GetMapping("/provinces")
    public ResponseEntity<ApiResponse<List<ProvinceDto>>> getProvinces() {
        List<TinhThanh> list = tinhThanhRepository.findAllByOrderByTenTinhAsc();
        List<ProvinceDto> dtos = list.stream().map(tt -> ProvinceDto.builder()
                .id(tt.getId())
                .name(tt.getTenTinh())
                .region(resolveRegion(tt))
                .licensePrefixZone(tt.getPhanVungBienSo())
                .build()
        ).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải danh mục tỉnh thành thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminShowroomDetailDto>> getShowroomDetail(@PathVariable Long id) {
        Showroom showroom = showroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy showroom với ID: " + id));

        AdminShowroomDto basicDto = toDto(showroom);

        // Demo Cars
        List<XeDemo> demoCars = xeDemoRepository.findByShowroomIdOrderByIdDesc(id);
        List<AdminShowroomDetailDto.DemoCarItemDto> demoCarDtos = demoCars.stream().map(dc -> {
            PhienBanXe pb = dc.getPhienBanXe();
            String modelName = pb != null && pb.getDongXe() != null ? pb.getDongXe().getTenDongXe() : "Chưa xác định";
            String versionName = pb != null ? pb.getTenPhienBan() : "Chưa xác định";
            return AdminShowroomDetailDto.DemoCarItemDto.builder()
                    .id(dc.getId())
                    .carVersionId(pb != null ? pb.getId() : null)
                    .carModelName(modelName)
                    .carVersionName(versionName)
                    .licensePlate(dc.getBienSo())
                    .currentOdo(dc.getSoOdoHienTai())
                    .lastMaintenanceDate(dc.getNgayBaoDuongGanNhat())
                    .nextMaintenanceDate(dc.getNgayBaoDuongTiepTheo())
                    .status(dc.getTrangThai() != null ? dc.getTrangThai().name() : "SAN_SANG")
                    .active(dc.isDangHoatDong())
                    .build();
        }).collect(Collectors.toList());

        // Inventory Items
        List<TonKhoXe> inventory = tonKhoXeRepository.findByShowroomIdOrderByIdAsc(id);
        List<AdminShowroomDetailDto.InventoryItemDto> inventoryDtos = inventory.stream().map(tk -> {
            PhienBanXe pb = tk.getPhienBanXe();
            String modelName = pb != null && pb.getDongXe() != null ? pb.getDongXe().getTenDongXe() : "Chưa xác định";
            String versionName = pb != null ? pb.getTenPhienBan() : "Chưa xác định";
            String colorName = tk.getMauSac() != null ? tk.getMauSac().getTenMau() : "Tiêu chuẩn";
            String colorHex = tk.getMauSac() != null ? tk.getMauSac().getMaHex() : "#334155";
            int avail = tk.getSoLuongKhaDung() != null ? tk.getSoLuongKhaDung() : 0;
            int reserved = tk.getSoLuongDangGiuCho() != null ? tk.getSoLuongDangGiuCho() : 0;
            return AdminShowroomDetailDto.InventoryItemDto.builder()
                    .id(tk.getId())
                    .carVersionId(pb != null ? pb.getId() : null)
                    .carModelName(modelName)
                    .carVersionName(versionName)
                    .colorName(colorName)
                    .colorHex(colorHex)
                    .availableStock(avail)
                    .reservedStock(reserved)
                    .totalStock(avail + reserved)
                    .build();
        }).collect(Collectors.toList());

        // Staff members
        List<NguoiDung> staffList = nguoiDungRepository.findByShowroomIdOrderByIdAsc(id);
        List<AdminShowroomDetailDto.StaffItemDto> staffDtos = staffList.stream().map(st ->
                AdminShowroomDetailDto.StaffItemDto.builder()
                        .id(st.getId())
                        .fullName(st.getHoTen())
                        .email(st.getEmail())
                        .phone(st.getSoDienThoai())
                        .role(st.getVaiTro() != null ? st.getVaiTro().name() : "ROLE_STAFF")
                        .status(st.getTrangThaiTaiKhoan() != null ? st.getTrangThaiTaiKhoan().name() : "HOAT_DONG")
                        .build()
        ).collect(Collectors.toList());

        AdminShowroomDetailDto detailDto = AdminShowroomDetailDto.builder()
                .showroom(basicDto)
                .demoCars(demoCarDtos)
                .inventoryItems(inventoryDtos)
                .staffMembers(staffDtos)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(detailDto, "Tải chi tiết showroom thành công"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<AdminShowroomDto>> createShowroom(
            @Valid @RequestBody CreateShowroomRequest request) {

        String name = request.getName().trim();
        if (showroomRepository.existsByTenShowroomIgnoreCase(name)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên showroom '" + name + "' đã tồn tại trên hệ thống"));
        }

        TinhThanh tinhThanh = tinhThanhRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tỉnh/thành phố với ID: " + request.getProvinceId()));

        if (request.getOpenTime() != null && request.getCloseTime() != null) {
            if (!request.getCloseTime().isAfter(request.getOpenTime())) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Giờ đóng cửa phải sau giờ mở cửa"));
            }
        }

        Showroom showroom = Showroom.builder()
                .tenShowroom(name)
                .tinhThanh(tinhThanh)
                .diaChi(request.getAddress().trim())
                .soDienThoai(request.getHotline().trim())
                .gioMoCua(request.getOpenTime() != null ? request.getOpenTime() : LocalTime.of(8, 0))
                .gioDongCua(request.getCloseTime() != null ? request.getCloseTime() : LocalTime.of(19, 0))
                .dangHoatDong(request.getActive() != null ? request.getActive() : true)
                .build();

        showroom = showroomRepository.save(showroom);
        log.info("Admin created new Showroom: #{} {}", showroom.getId(), showroom.getTenShowroom());

        return ResponseEntity.ok(ApiResponse.ok(toDto(showroom), "Thêm showroom mới vào mạng lưới thành công"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<AdminShowroomDto>> updateShowroom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShowroomRequest request) {

        Showroom showroom = showroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy showroom với ID: " + id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String name = request.getName().trim();
            if (showroomRepository.existsByTenShowroomIgnoreCaseAndIdNot(name, id)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Tên showroom '" + name + "' đã được sử dụng bởi chi nhánh khác"));
            }
            showroom.setTenShowroom(name);
        }

        if (request.getProvinceId() != null) {
            TinhThanh tinhThanh = tinhThanhRepository.findById(request.getProvinceId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tỉnh/thành phố với ID: " + request.getProvinceId()));
            showroom.setTinhThanh(tinhThanh);
        }

        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            showroom.setDiaChi(request.getAddress().trim());
        }

        if (request.getHotline() != null && !request.getHotline().trim().isEmpty()) {
            showroom.setSoDienThoai(request.getHotline().trim());
        }

        LocalTime open = request.getOpenTime() != null ? request.getOpenTime() : showroom.getGioMoCua();
        LocalTime close = request.getCloseTime() != null ? request.getCloseTime() : showroom.getGioDongCua();
        if (open != null && close != null && !close.isAfter(open)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Giờ đóng cửa phải sau giờ mở cửa"));
        }
        if (request.getOpenTime() != null) showroom.setGioMoCua(request.getOpenTime());
        if (request.getCloseTime() != null) showroom.setGioDongCua(request.getCloseTime());

        if (request.getActive() != null) {
            showroom.setDangHoatDong(request.getActive());
        }

        showroom = showroomRepository.save(showroom);
        log.info("Admin updated Showroom: #{} {}", showroom.getId(), showroom.getTenShowroom());

        return ResponseEntity.ok(ApiResponse.ok(toDto(showroom), "Cập nhật thông tin showroom thành công"));
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminShowroomDto>> toggleStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        Showroom showroom = showroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy showroom với ID: " + id));

        showroom.setDangHoatDong(active);
        showroomRepository.save(showroom);
        log.info("Admin toggled Showroom #{} active status to {}", id, active);

        return ResponseEntity.ok(ApiResponse.ok(toDto(showroom), "Cập nhật trạng thái hoạt động showroom thành công"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteShowroom(@PathVariable Long id) {
        Showroom showroom = showroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy showroom với ID: " + id));

        long staffCount = nguoiDungRepository.countByShowroomId(id);
        long demoCount = xeDemoRepository.countByShowroomId(id);
        Integer physicalStock = tonKhoXeRepository.sumTotalPhysicalByShowroomId(id);

        if (staffCount > 0 || demoCount > 0 || (physicalStock != null && physicalStock > 0)) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    String.format("Không thể xóa showroom '%s' vì hiện đang có %d nhân sự, %d xe demo và %d xe kho. Hãy chuyển trạng thái sang Tạm dừng thay vì xóa dữ liệu.",
                            showroom.getTenShowroom(), staffCount, demoCount, (physicalStock != null ? physicalStock : 0))
            ));
        }

        showroomRepository.delete(showroom);
        log.info("Admin deleted Showroom #{} {}", id, showroom.getTenShowroom());

        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa showroom khỏi mạng lưới thành công"));
    }

    @PostMapping("/{id}/demo-cars")
    @Transactional
    public ResponseEntity<ApiResponse<AdminShowroomDetailDto.DemoCarItemDto>> addDemoCar(
            @PathVariable Long id,
            @Valid @RequestBody CreateDemoCarRequest request) {

        Showroom showroom = showroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy showroom với ID: " + id));

        PhienBanXe carVersion = phienBanXeRepository.findById(request.getCarVersionId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên bản xe với ID: " + request.getCarVersionId()));

        String plate = request.getLicensePlate().trim().toUpperCase();
        if (xeDemoRepository.existsByBienSoIgnoreCase(plate)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Biển số xe '" + plate + "' đã tồn tại trên hệ thống"));
        }

        TrangThaiXeDemo status = TrangThaiXeDemo.SAN_SANG;
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                status = TrangThaiXeDemo.valueOf(request.getStatus().trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái xe demo không hợp lệ (SAN_SANG, DANG_LAI_THU, BAO_DUONG)"));
            }
        }

        XeDemo demoCar = XeDemo.builder()
                .showroom(showroom)
                .phienBanXe(carVersion)
                .bienSo(plate)
                .soOdoHienTai(request.getCurrentOdo() != null ? request.getCurrentOdo() : 0)
                .ngayBaoDuongGanNhat(request.getLastMaintenanceDate())
                .ngayBaoDuongTiepTheo(request.getNextMaintenanceDate())
                .trangThai(status)
                .dangHoatDong(true)
                .build();

        demoCar = xeDemoRepository.save(demoCar);
        log.info("Admin added Demo Car #{} {} to Showroom #{}", demoCar.getId(), demoCar.getBienSo(), id);

        String modelName = carVersion.getDongXe() != null ? carVersion.getDongXe().getTenDongXe() : "Chưa xác định";
        AdminShowroomDetailDto.DemoCarItemDto dto = AdminShowroomDetailDto.DemoCarItemDto.builder()
                .id(demoCar.getId())
                .carVersionId(carVersion.getId())
                .carModelName(modelName)
                .carVersionName(carVersion.getTenPhienBan())
                .licensePlate(demoCar.getBienSo())
                .currentOdo(demoCar.getSoOdoHienTai())
                .lastMaintenanceDate(demoCar.getNgayBaoDuongGanNhat())
                .nextMaintenanceDate(demoCar.getNgayBaoDuongTiepTheo())
                .status(demoCar.getTrangThai().name())
                .active(demoCar.isDangHoatDong())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(dto, "Thêm xe demo trải nghiệm vào showroom thành công"));
    }

    @PutMapping("/{id}/demo-cars/{demoCarId}/status")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> updateDemoCarStatus(
            @PathVariable Long id,
            @PathVariable Long demoCarId,
            @RequestParam String status,
            @RequestParam(required = false) Integer odo) {

        XeDemo demoCar = xeDemoRepository.findById(demoCarId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe demo với ID: " + demoCarId));

        if (!demoCar.getShowroom().getId().equals(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Xe demo không thuộc showroom này"));
        }

        try {
            TrangThaiXeDemo st = TrangThaiXeDemo.valueOf(status.trim().toUpperCase());
            demoCar.setTrangThai(st);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái xe demo không hợp lệ"));
        }

        if (odo != null && odo >= 0) {
            demoCar.setSoOdoHienTai(odo);
        }

        xeDemoRepository.save(demoCar);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cập nhật trạng thái xe demo thành công"));
    }

    private AdminShowroomDto toDto(Showroom sr) {
        String code = generateCode(sr);
        String region = resolveRegion(sr.getTinhThanh());

        int staffCount = (int) nguoiDungRepository.countByShowroomId(sr.getId());
        int demoFleet = (int) xeDemoRepository.countByShowroomId(sr.getId());
        int demoFleetReady = (int) xeDemoRepository.countByShowroomIdAndTrangThai(sr.getId(), TrangThaiXeDemo.SAN_SANG);

        Integer physicalStock = tonKhoXeRepository.sumTotalPhysicalByShowroomId(sr.getId());
        Integer reservedStock = tonKhoXeRepository.sumReservedByShowroomId(sr.getId());

        return AdminShowroomDto.builder()
                .id(sr.getId())
                .code(code)
                .name(sr.getTenShowroom())
                .provinceId(sr.getTinhThanh() != null ? sr.getTinhThanh().getId() : null)
                .provinceName(sr.getTinhThanh() != null ? sr.getTinhThanh().getTenTinh() : "Toàn quốc")
                .region(region)
                .address(sr.getDiaChi())
                .hotline(sr.getSoDienThoai())
                .openTime(sr.getGioMoCua())
                .closeTime(sr.getGioDongCua())
                .active(sr.isDangHoatDong())
                .staffCount(staffCount)
                .demoFleet(demoFleet)
                .demoFleetReady(demoFleetReady)
                .inventoryPhysical(physicalStock != null ? physicalStock : 0)
                .inventoryReserved(reservedStock != null ? reservedStock : 0)
                .build();
    }

    private String generateCode(Showroom sr) {
        String prefix = "SR";
        if (sr.getTinhThanh() != null && sr.getTinhThanh().getTenTinh() != null) {
            String pName = sr.getTinhThanh().getTenTinh().toLowerCase();
            if (pName.contains("hà nội") || pName.contains("ha noi")) prefix = "SR-HN";
            else if (pName.contains("hồ chí minh") || pName.contains("ho chi minh") || pName.contains("hcm")) prefix = "SR-HCM";
            else if (pName.contains("đà nẵng") || pName.contains("da nang")) prefix = "SR-DN";
            else if (pName.contains("bình dương") || pName.contains("binh duong")) prefix = "SR-BD";
            else if (pName.contains("đồng nai") || pName.contains("dong nai")) prefix = "SR-DNI";
            else if (pName.contains("quảng ninh") || pName.contains("quang ninh")) prefix = "SR-QN";
            else if (pName.contains("hải phòng") || pName.contains("hai phong")) prefix = "SR-HP";
            else if (pName.contains("cần thơ") || pName.contains("can tho")) prefix = "SR-CT";
        }
        return String.format("%s-%02d", prefix, sr.getId());
    }

    private String resolveRegion(TinhThanh tinhThanh) {
        if (tinhThanh == null || tinhThanh.getTenTinh() == null) return "Toàn quốc";
        String name = tinhThanh.getTenTinh().toLowerCase();

        if (name.contains("hà nội") || name.contains("quảng ninh") || name.contains("hải phòng") ||
                name.contains("hưng yên") || name.contains("hải dương") || name.contains("bắc ninh") ||
                name.contains("vĩnh phúc") || name.contains("thái nguyên") || name.contains("nam định") ||
                name.contains("ninh bình") || name.contains("thái bình") || name.contains("hà nam") ||
                name.contains("bắc giang") || name.contains("phú thọ") || name.contains("lạng sơn") ||
                name.contains("tuyên quang") || name.contains("hà giang") || name.contains("cao bằng") ||
                name.contains("bắc kạn") || name.contains("lào cai") || name.contains("yên bái") ||
                name.contains("điện biên") || name.contains("lai châu") || name.contains("sơn la") ||
                name.contains("hòa bình")) {
            return "Miền Bắc";
        }

        if (name.contains("đà nẵng") || name.contains("huế") || name.contains("quảng nam") ||
                name.contains("quảng ngãi") || name.contains("bình định") || name.contains("phú yên") ||
                name.contains("khánh hòa") || name.contains("ninh thuận") || name.contains("bình thuận") ||
                name.contains("thanh hóa") || name.contains("nghệ an") || name.contains("hà tĩnh") ||
                name.contains("quảng bình") || name.contains("quảng trị") || name.contains("kon tum") ||
                name.contains("gia lai") || name.contains("đắk lắk") || name.contains("đắk nông") ||
                name.contains("lâm đồng")) {
            return "Miền Trung";
        }

        return "Miền Nam";
    }
}
