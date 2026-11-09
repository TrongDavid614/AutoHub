-- ====================================================================================================
-- DỰ ÁN: AUTOHUB - TOÀN BỘ CƠ SỞ DỮ LIỆU & DỮ LIỆU MẪU MOCKUP FRONTEND
-- CHẠY TRỰC TIẾP TRÊN: Microsoft SQL Server 2019 / 2022 (SSMS)
-- TỰ ĐỘNG TÁI TẠO CSDL AutoHubDB, TẠO 32 BẢNG VÀ NẠP TOÀN BỘ DỮ LIỆU TỪ MOCKUP FRONTEND
-- (Khớp 100% car.mock.ts, accessory.mock.ts, staff.mock.ts, orders.mock.ts)
-- ====================================================================================================

USE master;
GO

-- Xóa database cũ nếu đã tồn tại để tránh xung đột dữ liệu, sau đó tạo mới tinh
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'AutoHubDB')
BEGIN
    ALTER DATABASE AutoHubDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE AutoHubDB;
END
GO

CREATE DATABASE AutoHubDB COLLATE Vietnamese_CI_AS;
GO

USE AutoHubDB;
GO

-- ====================================================================================================
-- PHẦN 1: TẠO CẤU TRÚC 32 BẢNG (DDL SCHEMA)
-- ====================================================================================================

-- 1. tinh_thanh
CREATE TABLE dbo.tinh_thanh (
    id                BIGINT IDENTITY(1,1) NOT NULL,
    ten_tinh          NVARCHAR(100) NOT NULL,
    phan_vung_bien_so NVARCHAR(30)  NOT NULL,
    CONSTRAINT PK_tinh_thanh PRIMARY KEY (id),
    CONSTRAINT UQ_tinh_thanh_ten UNIQUE (ten_tinh)
);

-- 2. showroom
CREATE TABLE dbo.showroom (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    tinh_thanh_id  BIGINT        NOT NULL,
    ten_showroom   NVARCHAR(150) NOT NULL,
    dia_chi        NVARCHAR(255) NOT NULL,
    so_dien_thoai  VARCHAR(15)   NOT NULL,
    gio_mo_cua     TIME(0)       NOT NULL,
    gio_dong_cua   TIME(0)       NOT NULL,
    dang_hoat_dong BIT NOT NULL CONSTRAINT DF_sr_hd DEFAULT 1,
    CONSTRAINT PK_showroom PRIMARY KEY (id),
    CONSTRAINT FK_sr_tinh_thanh FOREIGN KEY (tinh_thanh_id) REFERENCES dbo.tinh_thanh(id),
    CONSTRAINT CK_sr_gio CHECK (gio_mo_cua < gio_dong_cua)
);

-- 3. nguoi_dung
CREATE TABLE dbo.nguoi_dung (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    showroom_id          BIGINT        NULL,
    ho_ten               NVARCHAR(100) NOT NULL,
    email                VARCHAR(100)  NOT NULL,
    mat_khau_bam         VARCHAR(100)  NOT NULL,
    so_dien_thoai        CHAR(10)      NOT NULL,
    anh_dai_dien         NVARCHAR(500) NULL,
    so_cccd              CHAR(12)      NULL,
    vai_tro              VARCHAR(30)   NOT NULL CONSTRAINT DF_nd_vai_tro DEFAULT 'ROLE_CUSTOMER',
    trang_thai_tai_khoan VARCHAR(30)   NOT NULL CONSTRAINT DF_nd_trang_thai DEFAULT 'CHUA_KICH_HOAT',
    ngay_tao             DATETIME2(0)  NOT NULL CONSTRAINT DF_nd_ngay_tao DEFAULT SYSDATETIME(),
    updated_at           DATETIME2(0)  NULL,
    CONSTRAINT PK_nguoi_dung PRIMARY KEY (id),
    CONSTRAINT UQ_nguoi_dung_email UNIQUE (email),
    CONSTRAINT FK_nd_showroom FOREIGN KEY (showroom_id) REFERENCES dbo.showroom(id),
    CONSTRAINT CK_nd_vai_tro CHECK (vai_tro IN ('ROLE_CUSTOMER','ROLE_STAFF','ROLE_ADMIN')),
    CONSTRAINT CK_nd_trang_thai CHECK (trang_thai_tai_khoan IN ('CHUA_KICH_HOAT','HOAT_DONG','BI_KHOA')),
    CONSTRAINT CK_nd_ho_ten CHECK (LEN(LTRIM(RTRIM(ho_ten))) > 0),
    CONSTRAINT CK_nd_sdt CHECK (so_dien_thoai LIKE '0[35789][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    CONSTRAINT CK_nd_cccd CHECK (so_cccd IS NULL OR (LEN(so_cccd) = 12 AND so_cccd NOT LIKE '%[^0-9]%'))
);

-- 4. so_dia_chi
CREATE TABLE dbo.so_dia_chi (
    id                BIGINT IDENTITY(1,1) NOT NULL,
    nguoi_dung_id     BIGINT        NOT NULL,
    ho_ten_nguoi_nhan NVARCHAR(100) NOT NULL,
    so_dien_thoai     CHAR(10)      NOT NULL,
    tinh_thanh        NVARCHAR(100) NOT NULL,
    quan_huyen        NVARCHAR(100) NOT NULL,
    phuong_xa         NVARCHAR(100) NOT NULL,
    dia_chi_chi_tiet  NVARCHAR(255) NOT NULL,
    mac_dinh          BIT           NOT NULL CONSTRAINT DF_sdc_mac_dinh DEFAULT 0,
    CONSTRAINT PK_so_dia_chi PRIMARY KEY (id),
    CONSTRAINT FK_sdc_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES dbo.nguoi_dung(id) ON DELETE CASCADE,
    CONSTRAINT CK_sdc_sdt CHECK (so_dien_thoai LIKE '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);
CREATE UNIQUE INDEX UX_sdc_mac_dinh ON dbo.so_dia_chi(nguoi_dung_id) WHERE mac_dinh = 1;

-- 5. hang_xe
CREATE TABLE dbo.hang_xe (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    ten_hang_xe    NVARCHAR(100) NOT NULL,
    dang_hoat_dong BIT NOT NULL CONSTRAINT DF_hx_hd DEFAULT 1,
    CONSTRAINT PK_hang_xe PRIMARY KEY (id),
    CONSTRAINT UQ_hang_xe_ten UNIQUE (ten_hang_xe)
);

-- 6. dong_xe
CREATE TABLE dbo.dong_xe (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    hang_xe_id     BIGINT        NOT NULL,
    ten_dong_xe    NVARCHAR(100) NOT NULL,
    phan_khuc      NVARCHAR(30)  NOT NULL,
    xuat_xu        NVARCHAR(100) NOT NULL,
    mo_ta          NVARCHAR(MAX) NULL,
    dang_hoat_dong BIT NOT NULL CONSTRAINT DF_dx_hd DEFAULT 1,
    CONSTRAINT PK_dong_xe PRIMARY KEY (id),
    CONSTRAINT FK_dx_hang_xe FOREIGN KEY (hang_xe_id) REFERENCES dbo.hang_xe(id),
    CONSTRAINT UQ_dx_hang_ten UNIQUE (hang_xe_id, ten_dong_xe),
    CONSTRAINT CK_dx_phan_khuc CHECK (phan_khuc IN (N'Sedan', N'SUV', N'Bán tải', N'Thương mại', N'GT Hypercar', N'Shooting Brake'))
);

-- 7. phien_ban_xe
CREATE TABLE dbo.phien_ban_xe (
    id                BIGINT IDENTITY(1,1) NOT NULL,
    dong_xe_id        BIGINT        NOT NULL,
    ten_phien_ban     NVARCHAR(150) NOT NULL,
    nam_san_xuat      INT           NOT NULL,
    hop_so            NVARCHAR(50)  NOT NULL,
    loai_nhien_lieu   NVARCHAR(50)  NOT NULL,
    so_cho_ngoi       INT           NOT NULL,
    gia_niem_yet      DECIMAL(18,0) NOT NULL,
    muc_tien_coc      DECIMAL(18,0) NOT NULL CONSTRAINT DF_pb_coc DEFAULT 20000000,
    thong_so_ky_thuat NVARCHAR(MAX) NULL,
    dang_hoat_dong    BIT NOT NULL CONSTRAINT DF_pb_hd DEFAULT 1,
    CONSTRAINT PK_phien_ban_xe PRIMARY KEY (id),
    CONSTRAINT FK_pb_dong_xe FOREIGN KEY (dong_xe_id) REFERENCES dbo.dong_xe(id),
    CONSTRAINT UQ_pb_dong_ten UNIQUE (dong_xe_id, ten_phien_ban, nam_san_xuat),
    CONSTRAINT CK_pb_gia  CHECK (gia_niem_yet > 0),
    CONSTRAINT CK_pb_coc  CHECK (muc_tien_coc IN (10000000, 20000000)),
    CONSTRAINT CK_pb_cho  CHECK (so_cho_ngoi > 0),
    CONSTRAINT CK_pb_nam  CHECK (nam_san_xuat BETWEEN 1990 AND 2100)
);

-- 8. mau_sac
CREATE TABLE dbo.mau_sac (
    id      BIGINT IDENTITY(1,1) NOT NULL,
    ten_mau NVARCHAR(50) NOT NULL,
    ma_hex  CHAR(7)      NOT NULL,
    CONSTRAINT PK_mau_sac PRIMARY KEY (id),
    CONSTRAINT UQ_mau_sac_ten UNIQUE (ten_mau),
    CONSTRAINT CK_mau_hex CHECK (ma_hex LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]')
);

-- 9. hinh_anh_xe
CREATE TABLE dbo.hinh_anh_xe (
    id              BIGINT IDENTITY(1,1) NOT NULL,
    phien_ban_id    BIGINT        NOT NULL,
    mau_sac_id      BIGINT        NULL,
    duong_dan       NVARCHAR(500) NOT NULL,
    loai_anh        VARCHAR(20)   NOT NULL,
    thu_tu_hien_thi INT           NOT NULL CONSTRAINT DF_ha_tt DEFAULT 0,
    CONSTRAINT PK_hinh_anh_xe PRIMARY KEY (id),
    CONSTRAINT FK_ha_phien_ban FOREIGN KEY (phien_ban_id) REFERENCES dbo.phien_ban_xe(id) ON DELETE CASCADE,
    CONSTRAINT FK_ha_mau_sac   FOREIGN KEY (mau_sac_id)   REFERENCES dbo.mau_sac(id),
    CONSTRAINT CK_ha_loai CHECK (loai_anh IN ('NGOAI_THAT','NOI_THAT'))
);

-- 10. ton_kho_xe
CREATE TABLE dbo.ton_kho_xe (
    id                    BIGINT IDENTITY(1,1) NOT NULL,
    phien_ban_id          BIGINT NOT NULL,
    mau_sac_id            BIGINT NOT NULL,
    showroom_id           BIGINT NOT NULL,
    so_luong_kha_dung     INT    NOT NULL CONSTRAINT DF_tk_kd DEFAULT 0,
    so_luong_dang_giu_cho INT    NOT NULL CONSTRAINT DF_tk_gc DEFAULT 0,
    row_version           ROWVERSION,
    CONSTRAINT PK_ton_kho_xe PRIMARY KEY (id),
    CONSTRAINT FK_tk_phien_ban FOREIGN KEY (phien_ban_id) REFERENCES dbo.phien_ban_xe(id),
    CONSTRAINT FK_tk_mau_sac   FOREIGN KEY (mau_sac_id)   REFERENCES dbo.mau_sac(id),
    CONSTRAINT FK_tk_showroom  FOREIGN KEY (showroom_id)  REFERENCES dbo.showroom(id),
    CONSTRAINT UQ_tk_bo_ba UNIQUE (phien_ban_id, mau_sac_id, showroom_id),
    CONSTRAINT CK_tk_kd CHECK (so_luong_kha_dung >= 0),
    CONSTRAINT CK_tk_gc CHECK (so_luong_dang_giu_cho >= 0)
);

-- 11. xe_dinh_danh (VIN)
CREATE TABLE dbo.xe_dinh_danh (
    id           BIGINT IDENTITY(1,1) NOT NULL,
    ton_kho_id   BIGINT   NOT NULL,
    so_khung_vin CHAR(17) NOT NULL,
    trang_thai   VARCHAR(20) NOT NULL CONSTRAINT DF_xdd_tt DEFAULT 'CO_SAN',
    CONSTRAINT PK_xe_dinh_danh PRIMARY KEY (id),
    CONSTRAINT UQ_xdd_vin UNIQUE (so_khung_vin),
    CONSTRAINT FK_xe_dinh_danh_ton_kho FOREIGN KEY (ton_kho_id) REFERENCES dbo.ton_kho_xe(id),
    CONSTRAINT CK_xdd_tt  CHECK (trang_thai IN ('CO_SAN','DA_GIU_CHO','DA_BAN')),
    CONSTRAINT CK_xdd_vin CHECK (so_khung_vin NOT LIKE '%[^A-HJ-NPR-Za-hj-npr-z0-9]%')
);

-- 12. xe_demo
CREATE TABLE dbo.xe_demo (
    id                      BIGINT IDENTITY(1,1) NOT NULL,
    showroom_id             BIGINT      NOT NULL,
    phien_ban_id            BIGINT      NOT NULL,
    bien_so                 VARCHAR(15) NOT NULL,
    so_odo_hien_tai         INT         NOT NULL CONSTRAINT DF_xdm_odo DEFAULT 0,
    ngay_bao_duong_gan_nhat DATE        NULL,
    ngay_bao_duong_tiep_theo DATE       NULL,
    trang_thai              VARCHAR(20) NOT NULL CONSTRAINT DF_xdm_tt DEFAULT 'SAN_SANG',
    dang_hoat_dong          BIT         NOT NULL CONSTRAINT DF_xdm_hd DEFAULT 1,
    CONSTRAINT PK_xe_demo PRIMARY KEY (id),
    CONSTRAINT UQ_xdm_bien_so UNIQUE (bien_so),
    CONSTRAINT FK_xdm_showroom  FOREIGN KEY (showroom_id)  REFERENCES dbo.showroom(id),
    CONSTRAINT FK_xdm_phien_ban FOREIGN KEY (phien_ban_id) REFERENCES dbo.phien_ban_xe(id),
    CONSTRAINT CK_xdm_tt CHECK (trang_thai IN ('SAN_SANG','DANG_CHAY_THU','BAO_DUONG'))
);

-- 13. bieu_phi_lan_banh
CREATE TABLE dbo.bieu_phi_lan_banh (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    tinh_thanh_id        BIGINT        NOT NULL,
    ty_le_phi_truoc_ba   DECIMAL(5,2)  NOT NULL,
    phi_cap_bien_so      DECIMAL(18,0) NOT NULL,
    phi_dang_kiem        DECIMAL(18,0) NOT NULL,
    phi_bao_tri_duong_bo DECIMAL(18,0) NOT NULL,
    phi_bao_hiem_tnds    DECIMAL(18,0) NOT NULL,
    ngay_ap_dung         DATE          NOT NULL,
    ngay_het_hieu_luc    DATE          NULL,
    CONSTRAINT PK_bieu_phi PRIMARY KEY (id),
    CONSTRAINT FK_bp_tinh FOREIGN KEY (tinh_thanh_id) REFERENCES dbo.tinh_thanh(id),
    CONSTRAINT CK_bp_ty_le CHECK (ty_le_phi_truoc_ba IN (10, 12)),
    CONSTRAINT CK_bp_phi CHECK (phi_cap_bien_so >= 0 AND phi_dang_kiem >= 0
                                AND phi_bao_tri_duong_bo >= 0 AND phi_bao_hiem_tnds >= 0),
    CONSTRAINT CK_bp_ngay CHECK (ngay_het_hieu_luc IS NULL OR ngay_het_hieu_luc >= ngay_ap_dung)
);
CREATE UNIQUE INDEX UX_bp_hieu_luc ON dbo.bieu_phi_lan_banh(tinh_thanh_id) WHERE ngay_het_hieu_luc IS NULL;

-- 14. chuong_trinh_khuyen_mai
CREATE TABLE dbo.chuong_trinh_khuyen_mai (
    id               BIGINT IDENTITY(1,1) NOT NULL,
    ten_chuong_trinh NVARCHAR(200) NOT NULL,
    loai_uu_dai      VARCHAR(30)   NOT NULL,
    gia_tri          DECIMAL(18,2) NOT NULL,
    ngay_bat_dau     DATE          NOT NULL,
    ngay_ket_thuc    DATE          NOT NULL,
    dang_hoat_dong   BIT           NOT NULL CONSTRAINT DF_ctkm_hd DEFAULT 1,
    CONSTRAINT PK_ctkm PRIMARY KEY (id),
    CONSTRAINT CK_ctkm_loai CHECK (loai_uu_dai IN ('GIAM_TIEN_MAT','HO_TRO_LE_PHI_TRUOC_BA')),
    CONSTRAINT CK_ctkm_ngay CHECK (ngay_ket_thuc >= ngay_bat_dau),
    CONSTRAINT CK_ctkm_gt   CHECK (gia_tri > 0),
    CONSTRAINT CK_ctkm_pt   CHECK (loai_uu_dai <> 'HO_TRO_LE_PHI_TRUOC_BA' OR gia_tri <= 100)
);

-- 15. khuyen_mai_phien_ban (N-N)
CREATE TABLE dbo.khuyen_mai_phien_ban (
    chuong_trinh_id BIGINT NOT NULL,
    phien_ban_id    BIGINT NOT NULL,
    CONSTRAINT PK_kmpb PRIMARY KEY (chuong_trinh_id, phien_ban_id),
    CONSTRAINT FK_kmpb_ct FOREIGN KEY (chuong_trinh_id) REFERENCES dbo.chuong_trinh_khuyen_mai(id) ON DELETE CASCADE,
    CONSTRAINT FK_kmpb_pb FOREIGN KEY (phien_ban_id)    REFERENCES dbo.phien_ban_xe(id)
);

-- 16. voucher
CREATE TABLE dbo.voucher (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    ma_voucher     VARCHAR(30)   NOT NULL,
    phan_tram_giam DECIMAL(5,2)  NOT NULL,
    giam_toi_da    DECIMAL(18,0) NOT NULL,
    ngay_het_han   DATE          NOT NULL,
    dang_hoat_dong BIT           NOT NULL CONSTRAINT DF_vc_hd DEFAULT 1,
    CONSTRAINT PK_voucher PRIMARY KEY (id),
    CONSTRAINT UQ_voucher_ma UNIQUE (ma_voucher),
    CONSTRAINT CK_vc_pt CHECK (phan_tram_giam BETWEEN 0 AND 100),
    CONSTRAINT CK_vc_td CHECK (giam_toi_da >= 0)
);

-- 17. yeu_cau_tu_van
CREATE TABLE dbo.yeu_cau_tu_van (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    nguoi_dung_id       BIGINT        NULL,
    phien_ban_id        BIGINT        NULL,
    nhan_vien_id        BIGINT        NULL,
    ho_ten              NVARCHAR(100) NOT NULL,
    so_dien_thoai       CHAR(10)      NOT NULL,
    email               VARCHAR(100)  NOT NULL,
    noi_dung_can_tu_van NVARCHAR(1000) NOT NULL,
    khung_gio_tiep_nhan NVARCHAR(100) NULL,
    ngay_gui            DATETIME2(0)  NOT NULL CONSTRAINT DF_yctv_ngay DEFAULT SYSDATETIME(),
    trang_thai          VARCHAR(20)   NOT NULL CONSTRAINT DF_yctv_tt DEFAULT 'PENDING',
    ghi_chu_cskh        NVARCHAR(MAX) NULL,
    CONSTRAINT PK_yeu_cau_tu_van PRIMARY KEY (id),
    CONSTRAINT FK_yctv_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_yctv_nhan_vien  FOREIGN KEY (nhan_vien_id)  REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_yctv_phien_ban  FOREIGN KEY (phien_ban_id)  REFERENCES dbo.phien_ban_xe(id),
    CONSTRAINT CK_yctv_tt  CHECK (trang_thai IN ('PENDING','CONTACTED','CLOSED')),
    CONSTRAINT CK_yctv_sdt CHECK (so_dien_thoai LIKE '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    CONSTRAINT CK_yctv_email CHECK (email LIKE '_%@_%._%'),
    CONSTRAINT CK_yctv_ho_ten CHECK (LEN(LTRIM(RTRIM(ho_ten))) > 0)
);

-- 18. nhat_ky_tu_van (CRM Activity Timeline)
CREATE TABLE dbo.nhat_ky_tu_van (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    yeu_cau_tu_van_id   BIGINT        NOT NULL,
    nhan_vien_id        BIGINT        NOT NULL,
    loai_tuong_tac      VARCHAR(30)   NOT NULL,
    noi_dung_trao_doi   NVARCHAR(MAX) NOT NULL,
    ngan_sach_du_kien   DECIMAL(18,2) NULL,
    ket_qua_cuoc_goi    NVARCHAR(100) NULL,
    thoi_gian_tuong_tac DATETIME2(0)  NOT NULL CONSTRAINT DF_nktv_tg DEFAULT SYSDATETIME(),
    CONSTRAINT PK_nhat_ky_tu_van PRIMARY KEY (id),
    CONSTRAINT FK_nktv_yctv FOREIGN KEY (yeu_cau_tu_van_id) REFERENCES dbo.yeu_cau_tu_van(id),
    CONSTRAINT FK_nktv_staff FOREIGN KEY (nhan_vien_id) REFERENCES dbo.nguoi_dung(id)
);

-- 19. lich_hen_lai_thu
CREATE TABLE dbo.lich_hen_lai_thu (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    nguoi_dung_id       BIGINT        NOT NULL,
    phien_ban_id        BIGINT        NOT NULL,
    xe_demo_id          BIGINT        NULL,
    showroom_id         BIGINT        NULL,
    thoi_gian_hen       DATETIME2(0)  NOT NULL,
    thoi_luong_phut     INT           NOT NULL CONSTRAINT DF_lh_tl DEFAULT 60,
    dia_diem_lai_thu    NVARCHAR(255) NOT NULL,
    ho_ten_khach        NVARCHAR(100) NOT NULL,
    so_dien_thoai_khach CHAR(10)      NOT NULL,
    cam_ket_gplx        BIT           NOT NULL,
    so_gplx_kiem_tra    VARCHAR(20)   NULL,
    odo_bat_dau         INT           NULL,
    odo_ket_thuc        INT           NULL,
    thoi_gian_checkin   DATETIME2(0)  NULL,
    thoi_gian_checkout  DATETIME2(0)  NULL,
    chu_ky_khach_hang   NVARCHAR(500) NULL,
    ngay_tao            DATETIME2(0)  NOT NULL CONSTRAINT DF_lh_ngay DEFAULT SYSDATETIME(),
    trang_thai          VARCHAR(20)   NOT NULL CONSTRAINT DF_lh_tt DEFAULT 'PENDING',
    ghi_chu             NVARCHAR(500) NULL,
    da_gui_nhac_lich    BIT           NOT NULL CONSTRAINT DF_lh_nhac DEFAULT 0,
    thoi_gian_gui_nhac  DATETIME2(0)  NULL,
    bien_ban_danh_gia   NVARCHAR(MAX) NULL,
    CONSTRAINT PK_lich_hen_lai_thu PRIMARY KEY (id),
    CONSTRAINT FK_lh_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_lh_phien_ban  FOREIGN KEY (phien_ban_id)  REFERENCES dbo.phien_ban_xe(id),
    CONSTRAINT FK_lh_xe_demo    FOREIGN KEY (xe_demo_id)    REFERENCES dbo.xe_demo(id),
    CONSTRAINT FK_lh_showroom   FOREIGN KEY (showroom_id)   REFERENCES dbo.showroom(id),
    CONSTRAINT CK_lh_tt   CHECK (trang_thai IN ('PENDING','CONFIRMED','COMPLETED','CANCELLED','EXPIRED')),
    CONSTRAINT CK_lh_gplx CHECK (cam_ket_gplx = 1),
    CONSTRAINT CK_lh_24h  CHECK (thoi_gian_hen >= DATEADD(HOUR, 24, ngay_tao)),
    CONSTRAINT CK_lh_sdt  CHECK (so_dien_thoai_khach LIKE '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);
CREATE UNIQUE INDEX UX_lh_pending ON dbo.lich_hen_lai_thu(nguoi_dung_id) WHERE trang_thai = 'PENDING';

-- 20. phieu_dat_coc
CREATE TABLE dbo.phieu_dat_coc (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    ma_phieu_coc         VARCHAR(30)   NOT NULL,
    nguoi_dung_id        BIGINT        NOT NULL,
    ton_kho_id           BIGINT        NOT NULL,
    xe_dinh_danh_id      BIGINT        NULL,
    so_cccd              CHAR(12)      NOT NULL,
    so_tien_coc          DECIMAL(18,0) NOT NULL,
    ngay_dat_coc         DATETIME2(0)  NOT NULL CONSTRAINT DF_pdc_ngay DEFAULT SYSDATETIME(),
    han_thanh_toan       DATETIME2(0)  NOT NULL,
    thoi_gian_thanh_toan DATETIME2(0)  NULL,
    han_giu_xe           DATETIME2(0)  NULL,
    trang_thai           VARCHAR(30)   NOT NULL CONSTRAINT DF_pdc_tt DEFAULT 'PENDING_PAYMENT',
    thoi_gian_hoan_tat   DATETIME2(0)  NULL,
    CONSTRAINT PK_phieu_dat_coc PRIMARY KEY (id),
    CONSTRAINT UQ_pdc_ma UNIQUE (ma_phieu_coc),
    CONSTRAINT FK_pdc_nguoi_dung FOREIGN KEY (nguoi_dung_id)   REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_pdc_ton_kho    FOREIGN KEY (ton_kho_id)      REFERENCES dbo.ton_kho_xe(id),
    CONSTRAINT FK_pdc_xe_dd      FOREIGN KEY (xe_dinh_danh_id) REFERENCES dbo.xe_dinh_danh(id),
    CONSTRAINT CK_pdc_tt CHECK (trang_thai IN ('PENDING_PAYMENT','PAID','EXPIRED','REFUND_REQUESTED',
                                               'REFUNDED','COMPLETED','CANCELLED','REFUND_REQUIRED')),
    CONSTRAINT CK_pdc_cccd CHECK (LEN(so_cccd) = 12 AND so_cccd NOT LIKE '%[^0-9]%'),
    CONSTRAINT CK_pdc_coc  CHECK (so_tien_coc > 0),
    CONSTRAINT CK_pdc_han  CHECK (han_thanh_toan > ngay_dat_coc)
);
CREATE UNIQUE INDEX UX_pdc_vin_active ON dbo.phieu_dat_coc(xe_dinh_danh_id)
    WHERE xe_dinh_danh_id IS NOT NULL AND trang_thai IN ('PAID','REFUND_REQUESTED','REFUND_REQUIRED');

-- 21. bien_ban_ban_giao_xe
CREATE TABLE dbo.bien_ban_ban_giao_xe (
    id                     BIGINT IDENTITY(1,1) NOT NULL,
    phieu_dat_coc_id       BIGINT        NOT NULL,
    xe_dinh_danh_id        BIGINT        NOT NULL,
    nhan_vien_ban_giao_id  BIGINT        NOT NULL,
    ma_bien_ban            VARCHAR(50)   NOT NULL,
    ngay_ban_giao          DATETIME2(0)  NOT NULL CONSTRAINT DF_bbbg_ngay DEFAULT SYSDATETIME(),
    so_odo_ban_giao        INT           NOT NULL,
    ket_qua_pdi_json       NVARCHAR(MAX) NOT NULL,
    file_bien_ban_url      NVARCHAR(500) NULL,
    chu_ky_khach           NVARCHAR(500) NULL,
    chu_ky_nhan_vien       NVARCHAR(500) NULL,
    CONSTRAINT PK_bien_ban_ban_giao_xe PRIMARY KEY (id),
    CONSTRAINT UQ_bbbg_phieu UNIQUE (phieu_dat_coc_id),
    CONSTRAINT UQ_bbbg_ma UNIQUE (ma_bien_ban),
    CONSTRAINT FK_bbbg_phieu FOREIGN KEY (phieu_dat_coc_id) REFERENCES dbo.phieu_dat_coc(id),
    CONSTRAINT FK_bbbg_vin   FOREIGN KEY (xe_dinh_danh_id)  REFERENCES dbo.xe_dinh_danh(id),
    CONSTRAINT FK_bbbg_staff FOREIGN KEY (nhan_vien_ban_giao_id) REFERENCES dbo.nguoi_dung(id)
);

-- 22. yeu_cau_hoan_coc
CREATE TABLE dbo.yeu_cau_hoan_coc (
    id                    BIGINT IDENTITY(1,1) NOT NULL,
    phieu_dat_coc_id      BIGINT         NOT NULL,
    nhan_vien_doi_soat_id BIGINT         NULL,
    quan_tri_phe_duyet_id BIGINT         NULL,
    loai_ly_do            VARCHAR(40)    NOT NULL,
    ly_do                 NVARCHAR(1000) NOT NULL,
    minh_chung            NVARCHAR(500)  NULL,
    ngay_gui              DATETIME2(0)   NOT NULL CONSTRAINT DF_ychc_ngay DEFAULT SYSDATETIME(),
    trang_thai            VARCHAR(20)    NOT NULL CONSTRAINT DF_ychc_tt DEFAULT 'PENDING',
    ly_do_tu_choi         NVARCHAR(500)  NULL,
    ngay_xu_ly            DATETIME2(0)   NULL,
    CONSTRAINT PK_yeu_cau_hoan_coc PRIMARY KEY (id),
    CONSTRAINT FK_ychc_phieu FOREIGN KEY (phieu_dat_coc_id)      REFERENCES dbo.phieu_dat_coc(id),
    CONSTRAINT FK_ychc_staff FOREIGN KEY (nhan_vien_doi_soat_id) REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_ychc_admin FOREIGN KEY (quan_tri_phe_duyet_id) REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT CK_ychc_loai CHECK (loai_ly_do IN ('NGAN_HANG_TU_CHOI_TIN_DUNG','NGOAI_LE_ADMIN')),
    CONSTRAINT CK_ychc_tt   CHECK (trang_thai IN ('PENDING','VERIFIED','APPROVED','REFUNDED','REJECTED','CANCELLED')),
    CONSTRAINT CK_ychc_tu_choi CHECK (trang_thai <> 'REJECTED' OR ly_do_tu_choi IS NOT NULL)
);

-- 23. danh_muc_phu_kien
CREATE TABLE dbo.danh_muc_phu_kien (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    ten_danh_muc   NVARCHAR(100) NOT NULL,
    dang_hoat_dong BIT NOT NULL CONSTRAINT DF_dm_hd DEFAULT 1,
    CONSTRAINT PK_danh_muc PRIMARY KEY (id),
    CONSTRAINT UQ_danh_muc_ten UNIQUE (ten_danh_muc)
);

-- 24. phu_kien
CREATE TABLE dbo.phu_kien (
    id               BIGINT IDENTITY(1,1) NOT NULL,
    danh_muc_id      BIGINT        NOT NULL,
    ten_phu_kien     NVARCHAR(200) NOT NULL,
    thuong_hieu      NVARCHAR(100) NOT NULL,
    gia_ban          DECIMAL(18,0) NOT NULL,
    so_luong_ton     INT           NOT NULL CONSTRAINT DF_pk_ton DEFAULT 0,
    quy_cach_lap_dat NVARCHAR(500) NULL,
    hinh_anh         NVARCHAR(500) NULL,
    dung_chung       BIT           NOT NULL CONSTRAINT DF_pk_dc DEFAULT 0,
    dang_hoat_dong   BIT           NOT NULL CONSTRAINT DF_pk_hd DEFAULT 1,
    CONSTRAINT PK_phu_kien PRIMARY KEY (id),
    CONSTRAINT FK_pk_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES dbo.danh_muc_phu_kien(id),
    CONSTRAINT CK_pk_gia CHECK (gia_ban > 0),
    CONSTRAINT CK_pk_ton CHECK (so_luong_ton >= 0)
);

-- 25. phu_kien_dong_xe_tuong_thich (N-N)
CREATE TABLE dbo.phu_kien_dong_xe_tuong_thich (
    phu_kien_id  BIGINT NOT NULL,
    dong_xe_id   BIGINT NOT NULL,
    nam_bat_dau  INT    NULL,
    nam_ket_thuc INT    NULL,
    CONSTRAINT PK_pkdx PRIMARY KEY (phu_kien_id, dong_xe_id),
    CONSTRAINT FK_pkdx_pk FOREIGN KEY (phu_kien_id) REFERENCES dbo.phu_kien(id) ON DELETE CASCADE,
    CONSTRAINT FK_pkdx_dx FOREIGN KEY (dong_xe_id)  REFERENCES dbo.dong_xe(id),
    CONSTRAINT CK_pkdx_nam CHECK (nam_bat_dau IS NULL OR nam_ket_thuc IS NULL OR nam_ket_thuc >= nam_bat_dau)
);

-- 26. gio_hang
CREATE TABLE dbo.gio_hang (
    id            BIGINT IDENTITY(1,1) NOT NULL,
    nguoi_dung_id BIGINT       NOT NULL,
    ngay_cap_nhat DATETIME2(0) NOT NULL CONSTRAINT DF_gh_ngay DEFAULT SYSDATETIME(),
    CONSTRAINT PK_gio_hang PRIMARY KEY (id),
    CONSTRAINT UQ_gh_nguoi_dung UNIQUE (nguoi_dung_id),
    CONSTRAINT FK_gh_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES dbo.nguoi_dung(id) ON DELETE CASCADE
);

-- 27. chi_tiet_gio_hang
CREATE TABLE dbo.chi_tiet_gio_hang (
    gio_hang_id      BIGINT        NOT NULL,
    phu_kien_id      BIGINT        NOT NULL,
    so_luong         INT           NOT NULL,
    don_gia_tam_tinh DECIMAL(18,0) NOT NULL,
    CONSTRAINT PK_ctgh PRIMARY KEY (gio_hang_id, phu_kien_id),
    CONSTRAINT FK_ctgh_gh FOREIGN KEY (gio_hang_id) REFERENCES dbo.gio_hang(id) ON DELETE CASCADE,
    CONSTRAINT FK_ctgh_pk FOREIGN KEY (phu_kien_id) REFERENCES dbo.phu_kien(id),
    CONSTRAINT CK_ctgh_sl  CHECK (so_luong >= 1),
    CONSTRAINT CK_ctgh_gia CHECK (don_gia_tam_tinh >= 0)
);

-- 28. don_hang_phu_kien
CREATE TABLE dbo.don_hang_phu_kien (
    id                     BIGINT IDENTITY(1,1) NOT NULL,
    ma_don_hang            VARCHAR(30)   NOT NULL,
    nguoi_dung_id          BIGINT        NOT NULL,
    voucher_id             BIGINT        NULL,
    ho_ten_nguoi_nhan      NVARCHAR(100) NOT NULL,
    so_dien_thoai_nhan     CHAR(10)      NOT NULL,
    dia_chi_giao_hang      NVARCHAR(500) NOT NULL,
    ngay_dat               DATETIME2(0)  NOT NULL CONSTRAINT DF_dh_ngay DEFAULT SYSDATETIME(),
    phuong_thuc_thanh_toan VARCHAR(10)   NOT NULL,
    phi_van_chuyen         DECIMAL(18,0) NOT NULL CONSTRAINT DF_dh_pvc DEFAULT 0,
    so_tien_giam_voucher   DECIMAL(18,0) NOT NULL CONSTRAINT DF_dh_gv DEFAULT 0,
    don_vi_van_chuyen      NVARCHAR(100) NULL,
    ma_van_don             VARCHAR(50)   NULL,
    ngay_giao_hang         DATETIME2(0)  NULL,
    tong_tien              DECIMAL(18,0) NOT NULL,
    han_thanh_toan         DATETIME2(0)  NULL,
    thoi_gian_thanh_toan   DATETIME2(0)  NULL,
    trang_thai             VARCHAR(30)   NOT NULL CONSTRAINT DF_dh_tt DEFAULT 'PENDING',
    CONSTRAINT PK_don_hang PRIMARY KEY (id),
    CONSTRAINT UQ_dh_ma UNIQUE (ma_don_hang),
    CONSTRAINT FK_dh_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_dh_voucher    FOREIGN KEY (voucher_id)    REFERENCES dbo.voucher(id),
    CONSTRAINT CK_dh_pttt CHECK (phuong_thuc_thanh_toan IN ('COD','VNPAY')),
    CONSTRAINT CK_dh_tt   CHECK (trang_thai IN ('PENDING_PAYMENT','PENDING','PAID','PROCESSING',
                                                'SHIPPING','DELIVERED','CANCELLED','RETURNED','REFUND_REQUIRED')),
    CONSTRAINT CK_dh_tien CHECK (phi_van_chuyen >= 0 AND so_tien_giam_voucher >= 0 AND tong_tien >= 0),
    CONSTRAINT CK_dh_sdt  CHECK (so_dien_thoai_nhan LIKE '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    CONSTRAINT CK_dh_han_vnpay CHECK (phuong_thuc_thanh_toan = 'VNPAY' OR han_thanh_toan IS NULL)
);

-- 29. chi_tiet_don_hang
CREATE TABLE dbo.chi_tiet_don_hang (
    id          BIGINT IDENTITY(1,1) NOT NULL,
    don_hang_id BIGINT        NOT NULL,
    phu_kien_id BIGINT        NOT NULL,
    so_luong    INT           NOT NULL,
    don_gia     DECIMAL(18,0) NOT NULL,
    thanh_tien  AS (CONVERT(DECIMAL(18,0), so_luong * don_gia)) PERSISTED,
    CONSTRAINT PK_ctdh PRIMARY KEY (id),
    CONSTRAINT UQ_ctdh_don_pk UNIQUE (don_hang_id, phu_kien_id),
    CONSTRAINT FK_ctdh_dh FOREIGN KEY (don_hang_id) REFERENCES dbo.don_hang_phu_kien(id) ON DELETE CASCADE,
    CONSTRAINT FK_ctdh_pk FOREIGN KEY (phu_kien_id) REFERENCES dbo.phu_kien(id),
    CONSTRAINT CK_ctdh_sl  CHECK (so_luong > 0),
    CONSTRAINT CK_ctdh_gia CHECK (don_gia >= 0)
);

-- 30. yeu_cau_doi_tra
CREATE TABLE dbo.yeu_cau_doi_tra (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    don_hang_id          BIGINT         NOT NULL,
    chi_tiet_don_hang_id BIGINT         NOT NULL,
    so_luong_doi_tra     INT            NOT NULL,
    ly_do                NVARCHAR(1000) NOT NULL,
    phuong_an_mong_muon  VARCHAR(20)    NOT NULL,
    minh_chung           NVARCHAR(1000) NULL,
    phuong_an_giai_quyet VARCHAR(20)    NULL,
    ma_van_don_moi       VARCHAR(50)    NULL,
    ngay_gui             DATETIME2(0)   NOT NULL CONSTRAINT DF_ycdt_ngay DEFAULT SYSDATETIME(),
    trang_thai           VARCHAR(20)    NOT NULL CONSTRAINT DF_ycdt_tt DEFAULT 'PENDING',
    ghi_chu_xu_ly        NVARCHAR(1000) NULL,
    CONSTRAINT PK_yeu_cau_doi_tra PRIMARY KEY (id),
    CONSTRAINT FK_ycdt_dh   FOREIGN KEY (don_hang_id)          REFERENCES dbo.don_hang_phu_kien(id),
    CONSTRAINT FK_ycdt_ctdh FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES dbo.chi_tiet_don_hang(id),
    CONSTRAINT CK_ycdt_sl   CHECK (so_luong_doi_tra > 0),
    CONSTRAINT CK_ycdt_mm   CHECK (phuong_an_mong_muon IN ('DOI_HANG','HOAN_TIEN')),
    CONSTRAINT CK_ycdt_gq   CHECK (phuong_an_giai_quyet IS NULL OR phuong_an_giai_quyet IN ('DOI_HANG','HOAN_TIEN')),
    CONSTRAINT CK_ycdt_tt   CHECK (trang_thai IN ('PENDING','APPROVED','REJECTED','COMPLETED'))
);

-- 31. danh_gia
CREATE TABLE dbo.danh_gia (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    nguoi_dung_id        BIGINT         NOT NULL,
    phu_kien_id          BIGINT         NOT NULL,
    chi_tiet_don_hang_id BIGINT         NOT NULL,
    so_sao               TINYINT        NOT NULL,
    noi_dung             NVARCHAR(2000) NULL,
    hinh_anh_danh_gia    NVARCHAR(MAX)  NULL,
    ngay_danh_gia        DATETIME2(0)   NOT NULL CONSTRAINT DF_dg_ngay DEFAULT SYSDATETIME(),
    trang_thai_duyet     VARCHAR(20)    NOT NULL CONSTRAINT DF_dg_tt DEFAULT 'PENDING',
    CONSTRAINT PK_danh_gia PRIMARY KEY (id),
    CONSTRAINT UQ_dg_ctdh UNIQUE (chi_tiet_don_hang_id),
    CONSTRAINT FK_dg_nguoi_dung FOREIGN KEY (nguoi_dung_id)        REFERENCES dbo.nguoi_dung(id),
    CONSTRAINT FK_dg_phu_kien   FOREIGN KEY (phu_kien_id)          REFERENCES dbo.phu_kien(id),
    CONSTRAINT FK_dg_ctdh       FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES dbo.chi_tiet_don_hang(id),
    CONSTRAINT CK_dg_sao CHECK (so_sao BETWEEN 1 AND 5),
    CONSTRAINT CK_dg_tt  CHECK (trang_thai_duyet IN ('PENDING','APPROVED','REJECTED')),
    CONSTRAINT CK_dg_json CHECK (hinh_anh_danh_gia IS NULL OR ISJSON(hinh_anh_danh_gia) = 1)
);

-- 32. giao_dich_thanh_toan
CREATE TABLE dbo.giao_dich_thanh_toan (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    phieu_dat_coc_id     BIGINT        NULL,
    don_hang_id          BIGINT        NULL,
    ma_tham_chieu        VARCHAR(64)   NOT NULL,
    ma_giao_dich_vnpay   VARCHAR(64)   NULL,
    loai_giao_dich       VARCHAR(20)   NOT NULL CONSTRAINT DF_gd_loai DEFAULT 'THANH_TOAN',
    phuong_thuc          VARCHAR(10)   NOT NULL CONSTRAINT DF_gd_pt DEFAULT 'VNPAY',
    so_tien              DECIMAL(18,0) NOT NULL,
    thoi_gian_khoi_tao   DATETIME2(0)  NOT NULL CONSTRAINT DF_gd_tgkt DEFAULT SYSDATETIME(),
    thoi_gian_thanh_toan DATETIME2(0)  NULL,
    ma_ket_qua           VARCHAR(10)   NULL,
    trang_thai           VARCHAR(20)   NOT NULL CONSTRAINT DF_gd_tt DEFAULT 'PENDING',
    CONSTRAINT PK_giao_dich PRIMARY KEY (id),
    CONSTRAINT UQ_gd_tham_chieu UNIQUE (ma_tham_chieu),
    CONSTRAINT FK_gd_phieu FOREIGN KEY (phieu_dat_coc_id) REFERENCES dbo.phieu_dat_coc(id),
    CONSTRAINT FK_gd_don   FOREIGN KEY (don_hang_id)      REFERENCES dbo.don_hang_phu_kien(id),
    CONSTRAINT CK_gd_loai CHECK (loai_giao_dich IN ('THANH_TOAN','HOAN_TIEN')),
    CONSTRAINT CK_gd_pt   CHECK (phuong_thuc IN ('COD','VNPAY')),
    CONSTRAINT CK_gd_tt   CHECK (trang_thai IN ('PENDING','SUCCESS','FAILED')),
    CONSTRAINT CK_gd_tien CHECK (so_tien > 0),
    CONSTRAINT CK_gd_xor  CHECK ((phieu_dat_coc_id IS NOT NULL AND don_hang_id IS NULL)
                                OR (phieu_dat_coc_id IS NULL AND don_hang_id IS NOT NULL))
);
CREATE UNIQUE INDEX UX_gd_vnpay ON dbo.giao_dich_thanh_toan(ma_giao_dich_vnpay) WHERE ma_giao_dich_vnpay IS NOT NULL;
GO

-- ====================================================================================================
-- PHẦN 2: NẠP DỮ LIỆU MẪU MOCKUP FRONTEND VÀO DATABASE (SEED DATA)
-- ====================================================================================================

-- 1. NẠP TỈNH THÀNH (63 tỉnh hoặc các tỉnh trọng điểm từ biểu phí)
INSERT INTO dbo.tinh_thanh (ten_tinh, phan_vung_bien_so) VALUES 
(N'Hà Nội', N'Vùng 1'),
(N'TP. Hồ Chí Minh', N'Vùng 1'),
(N'Đà Nẵng', N'Vùng 2'),
(N'Hải Phòng', N'Vùng 2'),
(N'Cần Thơ', N'Vùng 2'),
(N'Bình Dương', N'Vùng 2'),
(N'Đồng Nai', N'Vùng 2'),
(N'Quảng Ninh', N'Vùng 3');
GO

-- 2. NẠP SHOWROOM (Mỹ Đình, Tân Bình, Cẩm Lệ)
INSERT INTO dbo.showroom (tinh_thanh_id, ten_showroom, dia_chi, so_dien_thoai, gio_mo_cua, gio_dong_cua, dang_hoat_dong) VALUES
(1, N'AutoHub Flagship Mỹ Đình - Hà Nội', N'Số 8 Lê Quang Đạo, Nam Từ Liêm, Hà Nội', '02438889999', '08:00:00', '18:00:00', 1),
(2, N'AutoHub Quận 7 - TP. Hồ Chí Minh', N'Số 104 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM', '02839998888', '08:00:00', '19:00:00', 1),
(3, N'AutoHub Cẩm Lệ - Đà Nẵng', N'Số 356 Điện Biên Phủ, Thanh Khê, Đà Nẵng', '02363777888', '08:00:00', '18:00:00', 1);
GO

-- 3. NẠP NGƯỜI DÙNG (Admin, Staff từ staff.mock.ts, Khách hàng từ orders.mock.ts)
-- Mật khẩu chung: Password123@ (đã băm BCrypt chuẩn)
INSERT INTO dbo.nguoi_dung (showroom_id, ho_ten, email, mat_khau_bam, so_dien_thoai, anh_dai_dien, so_cccd, vai_tro, trang_thai_tai_khoan, ngay_tao) VALUES
-- Admin điều hành toàn hệ thống
(NULL, N'Trần Đức Nam (Admin)', 'admin@autohub.vn', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0988888888', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', '001099001234', 'ROLE_ADMIN', 'HOAT_DONG', SYSDATETIME()),
-- Các nhân sự trong staff.mock.ts
(1, N'Nguyễn Văn Tuấn', 'tuan.nguyen@autohub.vn', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0977112233', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', '001098005678', 'ROLE_STAFF', 'HOAT_DONG', SYSDATETIME()),
(2, N'Lê Quốc Bảo', 'bao.le@autohub.vn', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0977334455', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', '079097008899', 'ROLE_STAFF', 'HOAT_DONG', SYSDATETIME()),
(1, N'Trần Thu Hà', 'ha.tran@autohub.vn', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0988445566', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', '001095007788', 'ROLE_STAFF', 'HOAT_DONG', SYSDATETIME()),
-- Khách hàng VIP trong orders.mock.ts và staff.mock.ts
(NULL, N'Nguyễn Văn A', 'vana@gmail.com', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0912345678', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200', '079201009988', 'ROLE_CUSTOMER', 'HOAT_DONG', SYSDATETIME()),
(NULL, N'Trần Hoàng Nam', 'nam.tran@gmail.com', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0988123456', NULL, '079198008819', 'ROLE_CUSTOMER', 'HOAT_DONG', SYSDATETIME()),
(NULL, N'Nguyễn Bích Thủy', 'thuy.nguyen@company.vn', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0903882119', NULL, '079092004561', 'ROLE_CUSTOMER', 'HOAT_DONG', SYSDATETIME()),
(NULL, N'Lê Hoàng Long', 'long.le@fpt.com', '$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', '0977441223', NULL, '001201009988', 'ROLE_CUSTOMER', 'HOAT_DONG', SYSDATETIME());
GO

-- 4. SỔ ĐỊA CHỈ KHÁCH HÀNG
INSERT INTO dbo.so_dia_chi (nguoi_dung_id, ho_ten_nguoi_nhan, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, mac_dinh) VALUES
(5, N'Nguyễn Văn A', '0912345678', N'TP. Hồ Chí Minh', N'Bình Thạnh', N'Phường 22', N'Tòa Landmark 81, 720A Điện Biên Phủ', 1),
(6, N'Trần Hoàng Nam', '0988123456', N'TP. Hồ Chí Minh', N'Quận 7', N'Tân Phú', N'Khu đô thị Phú Mỹ Hưng, Đường Nguyễn Lương Bằng', 1),
(8, N'Lê Hoàng Long', '0977441223', N'Hà Nội', N'Cầu Giấy', N'Dịch Vọng Hậu', N'Tòa nhà Keangnam Landmark 72', 1);
GO

-- 5. HÃNG XE & DÒNG XE (Khớp car.mock.ts & accessory.mock.ts)
INSERT INTO dbo.hang_xe (ten_hang_xe, dang_hoat_dong) VALUES 
(N'AutoHub EV', 1),
(N'VinFast', 1),
(N'Hyundai', 1),
(N'Ford', 1);
GO

INSERT INTO dbo.dong_xe (hang_xe_id, ten_dong_xe, phan_khuc, xuat_xu, mo_ta, dang_hoat_dong) VALUES
(1, N'AutoHub GT-e', N'Sedan', N'Nhập khẩu nguyên chiếc Đức', N'Sedan thể thao điện cao cấp kiến trúc 800V SiC sạc siêu nhanh.', 1),
(1, N'AutoHub SUV-e', N'SUV', N'Nhập khẩu nguyên chiếc Đức', N'SUV điện đầu bảng 5 chỗ dẫn động 4 bánh Dual-Motor AWD.', 1),
(1, N'AutoHub Aero Sedan', N'Sedan', N'Nhập khẩu nguyên chiếc', N'Dòng sedan khí động học hiệu năng cao tầm chạy 700km.', 1),
(2, N'VinFast VF8', N'SUV', N'Sản xuất tại Việt Nam', N'SUV điện thông minh phân khúc D trang bị trợ lý ảo và ADAS cấp độ 2.', 1),
(2, N'VinFast VF9', N'SUV', N'Sản xuất tại Việt Nam', N'SUV điện cỡ lớn phân khúc E với tùy chọn ghế cơ trưởng thương gia.', 1),
(3, N'Hyundai SantaFe', N'SUV', N'Lắp ráp trong nước', N'Dòng SUV thế hệ mới thiết kế vuông vức cơ bắp động cơ Turbo Hybrid.', 1),
(4, N'Ford Everest', N'SUV', N'Nhập khẩu Thái Lan', N'SUV 7 chỗ cơ bắp dẫn động 2 cầu thông minh.', 1);
GO

-- 6. MÀU SẮC (Khớp availableColors trong car.mock.ts)
INSERT INTO dbo.mau_sac (ten_mau, ma_hex) VALUES
(N'Xanh Riviera', '#0284C7'),
(N'Trắng Ceramic', '#F8FAFC'),
(N'Xám Liquid', '#94A3B8'),
(N'Đen Obsidian', '#0F172A'),
(N'Đỏ Crimson', '#DC2626'),
(N'Xanh Phantom', '#1E293B'),
(N'Xanh Deep Ocean', '#0A3B52');
GO

-- 7. PHIÊN BẢN XE (Khớp 100% danh mục MOCK_CARS trong car.mock.ts)
INSERT INTO dbo.phien_ban_xe (dong_xe_id, ten_phien_ban, nam_san_xuat, hop_so, loai_nhien_lieu, so_cho_ngoi, gia_niem_yet, muc_tien_coc, thong_so_ky_thuat, dang_hoat_dong) VALUES
-- 1. GT-e Grand Touring
(1, N'AutoHub GT-e Grand Touring', 2026, N'Tự động điện tử Dual-Motor', N'Thuần điện EV 800V', 5, 2890000000, 20000000, N'{"cong_suat": "680 HP", "tam_chay": "680 km (WLTP)", "tang_toc": "3.2s", "sac": "10-80% trong 15 phút (350kW)", "adas": "HubPilot 2+ tự hành"}', 1),
-- 2. GT-e Track Edition
(1, N'AutoHub GT-e Track Edition', 2026, N'Tri-Motor Vectoring AWD', N'Thuần điện EV 800V SiC', 4, 3490000000, 20000000, N'{"cong_suat": "1.020 HP", "tam_chay": "600 km", "tang_toc": "2.8s Hyper", "phanh": "Gốm Carbon Track"}', 1),
-- 3. GT-e Standard
(1, N'AutoHub GT-e Standard', 2026, N'Đơn Motor RWD', N'Thuần điện EV 800V SiC', 5, 2490000000, 20000000, N'{"cong_suat": "450 HP", "tam_chay": "620 km", "tang_toc": "3.8s", "pin": "LFP 92 kWh"}', 1),
-- 4. SUV-e Cross Touring
(2, N'AutoHub SUV-e Cross Touring', 2026, N'Dual-Motor AWD', N'Thuần điện EV 800V', 5, 2990000000, 20000000, N'{"cong_suat": "580 HP", "tam_chay": "650 km", "treo": "Khí nén 3 cấp nâng hạ gầm", "cop": "1.450 Lít"}', 1),
-- 5. GT-e Executive
(1, N'AutoHub GT-e Executive', 2026, N'Dual-Motor AWD', N'Thuần điện EV 800V', 4, 2690000000, 20000000, N'{"cong_suat": "520 HP", "tam_chay": "700 km", "ghe": "Ghế Ottoman massage đá nóng 4 ghế", "am_thanh": "Burmester 23 loa"}', 1),
-- 6. GT-e Sport Tourer
(1, N'AutoHub GT-e Sport Tourer', 2026, N'AWD SiC Gen 3', N'Thuần điện EV 800V', 5, 3120000000, 20000000, N'{"cong_suat": "680 HP", "tam_chay": "660 km", "tang_toc": "3.3s", "cop": "650 Lít", "gioi_han": "50 xe tại VN"}', 1),
-- 7. Các phiên bản đối tác trong staff.mock.ts
(4, N'VinFast VF8 Plus AWD', 2026, N'Tự động điện tử', N'Thuần điện', 5, 1259000000, 10000000, N'{"cong_suat": "402 HP", "pin": "87.7 kWh"}', 1),
(5, N'VinFast VF9 Plus 6 Chỗ', 2026, N'Tự động điện tử', N'Thuần điện', 6, 1699000000, 20000000, N'{"ghe": "Ghế cơ trưởng massage", "pin": "123 kWh"}', 1),
(6, N'Hyundai SantaFe Calligraphy Hybrid', 2026, N'Tự động 6 cấp', N'Xăng Hybrid', 6, 1369000000, 10000000, N'{"dong_co": "1.6L Turbo Hybrid", "ghe": "Ghế cơ trưởng 6 chỗ"}', 1),
(7, N'Ford Everest Titanium+ 4x4', 2026, N'Tự động 10 cấp', N'Dầu Bi-Turbo', 7, 1468000000, 20000000, N'{"cong_suat": "210 PS", "dan_dong": "4WD"}', 1);
GO

-- 8. HÌNH ẢNH XE (Ảnh thật từ car.mock.ts)
INSERT INTO dbo.hinh_anh_xe (phien_ban_id, mau_sac_id, duong_dan, loai_anh, thu_tu_hien_thi) VALUES
(1, 1, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', 'NGOAI_THAT', 1),
(1, 2, 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', 'NGOAI_THAT', 2),
(1, NULL, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', 'NOI_THAT', 3),
(2, 4, 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', 'NGOAI_THAT', 1),
(3, 2, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', 'NGOAI_THAT', 1),
(4, 5, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', 'NGOAI_THAT', 1);
GO

-- 9. TỒN KHO SUẤT XE & XE ĐỊNH DANH (VIN) & XE DEMO LÁI THỬ (Từ staff.mock.ts)
INSERT INTO dbo.ton_kho_xe (phien_ban_id, mau_sac_id, showroom_id, so_luong_kha_dung, so_luong_dang_giu_cho) VALUES
(1, 1, 2, 4, 1),
(1, 2, 1, 3, 0),
(2, 4, 2, 2, 1),
(4, 5, 2, 5, 0),
(7, 7, 2, 3, 1),
(8, 4, 2, 2, 0);

-- Số khung VIN thực tế
INSERT INTO dbo.xe_dinh_danh (ton_kho_id, so_khung_vin, trang_thai) VALUES
(1, '1FA6P8CF5H5123456', 'CO_SAN'),
(1, '1FA6P8CF5H5789012', 'CO_SAN'),
(1, '1FA6P8CF5H5345678', 'DA_GIU_CHO'), -- Đã gán cho phiếu cọc DEP-GTE-2026-8812
(3, '1FA6P8CF5H5999888', 'DA_GIU_CHO'),
(5, 'VF8AWD20260012991', 'DA_GIU_CHO');

-- Đội xe Demo lái thử từ staff.mock.ts
INSERT INTO dbo.xe_demo (showroom_id, phien_ban_id, bien_so, so_odo_hien_tai, ngay_bao_duong_gan_nhat, ngay_bao_duong_tiep_theo, trang_thai, dang_hoat_dong) VALUES
(2, 7, '51K-992.14', 4200, '2026-09-10', '2026-12-10', 'SAN_SANG', 1),
(2, 9, '51K-881.23', 6800, '2026-08-20', '2026-11-20', 'SAN_SANG', 1),
(2, 8, '51K-773.09', 2900, '2026-10-01', '2027-01-01', 'SAN_SANG', 1),
(1, 1, '30H-889.99', 3150, '2026-09-15', '2026-12-15', 'SAN_SANG', 1);
GO

-- 10. BIỂU PHÍ LĂN BÁNH & KHUYẾN MẠI & VOUCHER
INSERT INTO dbo.bieu_phi_lan_banh (tinh_thanh_id, ty_le_phi_truoc_ba, phi_cap_bien_so, phi_dang_kiem, phi_bao_tri_duong_bo, phi_bao_hiem_tnds, ngay_ap_dung, ngay_het_hieu_luc) VALUES
(1, 12.00, 20000000, 340000, 1560000, 873400, '2026-01-01', NULL),
(2, 10.00, 20000000, 340000, 1560000, 873400, '2026-01-01', NULL),
(3, 10.00, 1000000, 340000, 1560000, 873400, '2026-01-01', NULL);

INSERT INTO dbo.chuong_trinh_khuyen_mai (ten_chuong_trinh, loai_uu_dai, gia_tri, ngay_bat_dau, ngay_ket_thuc, dang_hoat_dong) VALUES
(N'Ưu đãi miễn phí 1 năm sạc trạm & Tặng Wallbox 22kW', 'GIAM_TIEN_MAT', 30000000.00, '2026-01-01', '2026-12-31', 1),
(N'Hỗ trợ 50% Lệ phí trước bạ khi đặt cọc online', 'HO_TRO_LE_PHI_TRUOC_BA', 50.00, '2026-06-01', '2026-12-31', 1);

INSERT INTO dbo.khuyen_mai_phien_ban (chuong_trinh_id, phien_ban_id) VALUES 
(1, 1),
(2, 1),
(2, 4);

INSERT INTO dbo.voucher (ma_voucher, phan_tram_giam, giam_toi_da, ngay_het_han, dang_hoat_dong) VALUES
('AUTOHUB10', 10.00, 500000, '2026-12-31', 1),
('AH-VOUCHER-500K', 10.00, 500000, '2026-12-31', 1),
('VIPCAR20', 20.00, 2000000, '2026-12-31', 1);
GO

-- 11. DANH MỤC PHỤ KIỆN & SẢN PHẨM PHỤ KIỆN (Khớp 100% accessory.mock.ts)
INSERT INTO dbo.danh_muc_phu_kien (ten_danh_muc, dang_hoat_dong) VALUES
(N'Sạc & Năng lượng', 1),
(N'Camera & Cảm biến', 1),
(N'Phim cách nhiệt', 1),
(N'Thảm sàn cao cấp', 1);
GO

INSERT INTO dbo.phu_kien (danh_muc_id, ten_phu_kien, thuong_hieu, gia_ban, so_luong_ton, quy_cach_lap_dat, hinh_anh, dung_chung, dang_hoat_dong) VALUES
-- ID 1 (Khớp mock ID 101) - Giá test: 99.000 đ
(1, N'Bộ sạc treo tường thông minh Wallbox 22kW', N'AutoHub Power', 99000, 15, N'Trạm sạc AC 3 pha công suất 22kW chuẩn Type-2 chống nước IP65', 'https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768', 1, 1),
-- ID 2 (Khớp mock ID 102) - Giá test: 85.000 đ
(2, N'Camera hành trình 4K tích hợp LiDAR AutoHub Eye', N'AutoHub Vision', 85000, 28, N'Camera ghi hình 4K Sony Starvis 2 tích hợp LiDAR cảnh báo sớm va chạm', 'https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768', 1, 1),
-- ID 3 (Khớp mock ID 103) - Giá test: 65.000 đ
(4, N'Bộ thảm lót sàn đúc nguyên khối chống nước GT-e', N'AutoHub Craft', 65000, 42, N'Scan 3D Laser nhựa TPE sinh học nguyên khối viền cao 5cm không mùi', 'https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768', 0, 1),
-- ID 4 (Khớp mock ID 104) - Giá test: 95.000 đ
(3, N'Gói phim cách nhiệt Nano Ceramic AutoHub Shield', N'AutoHub Shield', 95000, 10, N'Cản nhiệt cabin 99% tia UV/IR, không cản sóng 5G/GPS, bảo hành 10 năm', 'https://api.builder.io/api/v1/image/assets/TEMP/18b57253ac2342092e966b261e1b3751c6617d08?width=768', 1, 1),
-- ID 5 (Khớp mock ID 105) - Giá test: 79.000 đ
(1, N'Bộ sạc di động khẩn cấp 3.5kW Portable Booster', N'AutoHub Power', 79000, 20, N'Cắm điện 220V Schuko 16A dài 5m màn hình OLED hiển thị công suất', 'https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768', 1, 1),
-- ID 6 (Khớp mock ID 106) - Giá test: 70.000 đ
(1, N'Bộ chuyển nguồn cắm điện 2 chiều V2L 3.3kW', N'AutoHub Power', 70000, 35, N'Cổng chuyển đổi lấy điện từ pin xe ra ổ cắm 220V cho thiết bị dã ngoại', 'https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768', 1, 1),
-- ID 7 - Giá test: 55.000 đ
(2, N'Bơm lốp điện tử tự ngắt không dây AutoHub Air Pro', N'AutoHub Vision', 55000, 35, N'Động cơ đồng nguyên chất 150 PSI tự ngắt khi đủ áp suất kèm đèn LED cứu hộ', 'https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768', 1, 1),
-- ID 8 - Giá test: 60.000 đ
(4, N'Máy lọc không khí ion âm PureAir 360', N'AutoHub Craft', 60000, 22, N'Màng lọc HEPA H13 khử mùi xe mới và bụi mịn PM2.5 khuếch tán tinh dầu tự nhiên', 'https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768', 1, 1),
-- ID 9 - Giá test: 50.000 đ
(2, N'Cảm biến áp suất lốp van trong TPMS Solar', N'AutoHub Vision', 50000, 40, N'Màn hình năng lượng mặt trời cảm biến van trong siêu nhạy chống nước IP67', 'https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768', 1, 1),
-- ID 10 - Giá test: 50.000 đ
(4, N'Bộ gối tựa đầu cao su non công thái học Ergonomic', N'AutoHub Craft', 50000, 60, N'Cao su non đúc chậm nguyên khối nâng đỡ đốt sống cổ vải sợi dệt thoáng khí', 'https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768', 1, 1);
GO

-- Liên kết tương thích đời xe
INSERT INTO dbo.phu_kien_dong_xe_tuong_thich (phu_kien_id, dong_xe_id, nam_bat_dau, nam_ket_thuc) VALUES
(3, 1, 2024, 2026),
(3, 2, 2025, 2026);
GO

-- 12. YÊU CẦU TƯ VẤN (Khớp MOCK_CONSULTATION_LEADS trong staff.mock.ts)
INSERT INTO dbo.yeu_cau_tu_van (nguoi_dung_id, phien_ban_id, nhan_vien_id, ho_ten, so_dien_thoai, email, noi_dung_can_tu_van, khung_gio_tiep_nhan, ngay_gui, trang_thai, ghi_chu_cskh) VALUES
-- LEAD-001
(6, 7, 2, N'Trần Hoàng Nam', '0988123456', 'nam.tran@gmail.com', N'Quan tâm màu Xanh Deep Ocean nội thất da Nâu, dự toán vay 70% 5 năm Vietcombank.', N'09:00 - 11:30 sáng', DATEADD(HOUR, -12, SYSDATETIME()), 'PENDING', N'Khách hẹn gọi trước 10h sáng, giọng điệu thân thiện chu đáo.'),
-- LEAD-002
(7, 9, 3, N'Nguyễn Bích Thủy', '0903882119', 'thuy.nguyen@company.vn', N'Tìm hiểu SantaFe Hybrid nội thất 6 chỗ ghế cơ trưởng, cần giao xe sớm.', N'14:00 - 16:00 chiều', DATEADD(DAY, -1, SYSDATETIME()), 'CONTACTED', N'Đã gọi lần 1, chị hẹn chiều mai ghé showroom xem màu đen thực tế.'),
-- LEAD-003
(8, 8, 2, N'Lê Hoàng Long', '0977441223', 'long.le@fpt.com', N'Tìm hiểu bản VF9 Ghế cơ trưởng massage, xuất hóa đơn công ty.', N'Sau 17:00 chiều', DATEADD(HOUR, -6, SYSDATETIME()), 'PENDING', N'Khách là lãnh đạo doanh nghiệp, quan tâm khấu trừ thuế và bảo hành pin 10 năm.');
GO

-- 13. NHẬT KÝ TƯ VẤN CRM (UC20b & Timeline)
INSERT INTO dbo.nhat_ky_tu_van (yeu_cau_tu_van_id, nhan_vien_id, loai_tuong_tac, noi_dung_trao_doi, ngan_sach_du_kien, ket_qua_cuoc_goi, thoi_gian_tuong_tac) VALUES
(1, 2, 'GOI_DIEN', N'Đã gọi điện tư vấn chính sách vay ngân hàng Vietcombank 70% và mời lái thử.', 1300000000, N'Khách hẹn sáng nay 09:30 ghé Showroom lái thử', DATEADD(HOUR, -4, SYSDATETIME())),
(2, 3, 'GAP_MAT', N'Khách ghé showroom xem màu xe thực tế và trải nghiệm hàng ghế thứ hai.', 1400000000, N'Khách rất ưng ý, đang chốt thời gian ký hợp đồng', DATEADD(HOUR, -2, SYSDATETIME()));
GO

-- 14. LỊCH HẸN LÁI THỬ (Khớp MOCK_STAFF_TEST_DRIVES & MOCK_TODAY_TIMELINE trong staff.mock.ts)
INSERT INTO dbo.lich_hen_lai_thu (nguoi_dung_id, phien_ban_id, xe_demo_id, showroom_id, thoi_gian_hen, thoi_luong_phut, dia_diem_lai_thu, ho_ten_khach, so_dien_thoai_khach, cam_ket_gplx, so_gplx_kiem_tra, odo_bat_dau, odo_ket_thuc, thoi_gian_checkin, thoi_gian_checkout, chu_ky_khach_hang, ngay_tao, trang_thai, ghi_chu, da_gui_nhac_lich) VALUES
-- TD-001 (slot 09:00 - 10:00)
(6, 7, 1, 2, DATEADD(HOUR, 25, SYSDATETIME()), 60, N'AutoHub Quận 7 - TP. Hồ Chí Minh', N'Trần Hoàng Nam', '0988123456', 1, '079198008819', 4200, NULL, NULL, NULL, NULL, SYSDATETIME(), 'PENDING', N'Khách muốn thử tính năng ADAS trên cao tốc Long Thành', 0),
-- TD-002 (slot 10:30 - 11:30)
(7, 9, 2, 2, DATEADD(HOUR, 27, SYSDATETIME()), 60, N'AutoHub Quận 7 - TP. Hồ Chí Minh', N'Phạm Thị Lan', '0912445678', 1, '001092004561', 6800, 6818, SYSDATETIME(), NULL, 'https://autohub.vn/signatures/cust_lan.png', SYSDATETIME(), 'CONFIRMED', N'Đã chuẩn bị xe Demo SantaFe sạch sẽ thơm tho', 1);
GO

-- 15. PHIẾU ĐẶT CỌC XE 72H & THANH TOÁN CỌC (Khớp StaffDepositRecord #DEP-GTE-2026-8812 & Mock Refund Dockets)
INSERT INTO dbo.phieu_dat_coc (ma_phieu_coc, nguoi_dung_id, ton_kho_id, xe_dinh_danh_id, so_cccd, so_tien_coc, ngay_dat_coc, han_thanh_toan, thoi_gian_thanh_toan, han_giu_xe, trang_thai, thoi_gian_hoan_tat) VALUES
-- Cọc 1: Khách VIP Lê Hoàng Long đặt cọc xe GT-e, đã thanh toán đủ 100% và hoàn tất bàn giao xe PDI
('DEP-GTE-2026-8812', 8, 1, 3, '001201009988', 50000, DATEADD(DAY, -2, SYSDATETIME()), DATEADD(MINUTE, -1425, SYSDATETIME()), DATEADD(DAY, -2, SYSDATETIME()), DATEADD(DAY, 1, SYSDATETIME()), 'COMPLETED', DATEADD(HOUR, -2, SYSDATETIME())),
-- Cọc 2: Khách Trần Hoàng Nam đặt cọc VinFast VF8 (#DEP-8841), ngân hàng từ chối tín dụng, gửi yêu cầu hoàn cọc
('DEP-VF8-2026-8841', 6, 5, 5, '001202008819', 50000, DATEADD(DAY, -1, SYSDATETIME()), DATEADD(MINUTE, -1400, SYSDATETIME()), DATEADD(DAY, -1, SYSDATETIME()), DATEADD(DAY, 2, SYSDATETIME()), 'REFUND_REQUESTED', NULL),
-- Cọc 3: Khách Nguyễn Bích Thủy đặt cọc Hyundai SantaFe (#DEP-8832), xin rút cọc ngoại lệ gia đình, đã được Admin duyệt và hoàn tiền
('DEP-STF-2026-8832', 7, 3, 4, '079195004321', 30000, DATEADD(DAY, -3, SYSDATETIME()), DATEADD(MINUTE, -4000, SYSDATETIME()), DATEADD(DAY, -3, SYSDATETIME()), DATEADD(DAY, -1, SYSDATETIME()), 'REFUNDED', DATEADD(HOUR, -6, SYSDATETIME()));
GO

-- Giao dịch thanh toán cọc & hoàn tiền qua VNPay
INSERT INTO dbo.giao_dich_thanh_toan (phieu_dat_coc_id, don_hang_id, ma_tham_chieu, ma_giao_dich_vnpay, loai_giao_dich, phuong_thuc, so_tien, thoi_gian_khoi_tao, thoi_gian_thanh_toan, ma_ket_qua, trang_thai) VALUES
-- Thanh toán cọc thành công cho Cọc 1
(1, NULL, 'TXN_DEP_8812_01', '14238812', 'THANH_TOAN', 'VNPAY', 50000, DATEADD(DAY, -2, SYSDATETIME()), DATEADD(DAY, -2, SYSDATETIME()), '00', 'SUCCESS'),
-- Thanh toán cọc thành công cho Cọc 2
(2, NULL, 'TXN_DEP_8841_01', '14238841', 'THANH_TOAN', 'VNPAY', 50000, DATEADD(DAY, -1, SYSDATETIME()), DATEADD(DAY, -1, SYSDATETIME()), '00', 'SUCCESS'),
-- Thanh toán cọc ban đầu cho Cọc 3
(3, NULL, 'TXN_DEP_8832_01', '14238832', 'THANH_TOAN', 'VNPAY', 30000, DATEADD(DAY, -3, SYSDATETIME()), DATEADD(DAY, -3, SYSDATETIME()), '00', 'SUCCESS'),
-- Giao dịch hoàn tiền cọc cho Cọc 3 sau khi Admin phê duyệt
(3, NULL, 'TXN_REFUND_8832_01', 'REF99883210', 'HOAN_TIEN', 'VNPAY', 30000, DATEADD(HOUR, -7, SYSDATETIME()), DATEADD(HOUR, -6, SYSDATETIME()), '00', 'SUCCESS');
GO

-- 16. BIÊN BẢN BÀN GIAO XE & PDI CHECKLIST (UC22b: Hoàn tất bàn giao xe ô tô)
INSERT INTO dbo.bien_ban_ban_giao_xe (phieu_dat_coc_id, xe_dinh_danh_id, nhan_vien_ban_giao_id, ma_bien_ban, ngay_ban_giao, so_odo_ban_giao, ket_qua_pdi_json, file_bien_ban_url, chu_ky_khach, chu_ky_nhan_vien) VALUES
(1, 3, 2, 'BBBG-2026-GTE-001', DATEADD(HOUR, -2, SYSDATETIME()), 15,
N'{"tieu_chuan": "Quy trình PDI 30 điểm tiêu chuẩn AutoHub", "ngoai_that": {"nuoc_son": "ĐẠT - Không trầy xước", "den_chieu_sang": "ĐẠT - Hoạt động tốt", "kinh_chan_gio": "ĐẠT - Trong suốt, không tì vết", "ap_suat_lop": "ĐẠT - 2.5 bar đủ 4 bánh"}, "noi_that": {"ghe_da_nappa": "ĐẠT - Sạch sẽ nguyên seal bọc", "man_hinh_trung_tam": "ĐẠT - Cảm ứng mượt mà", "dieu_hoa": "ĐẠT - Mát sâu 2 vùng độc lập"}, "khoang_pin_dong_co": {"muc_pin_giao_xe": "100%", "dien_ap_pin": "400V ổn định", "dong_co_dien": "ĐẠT - Không tiếng ồn lạ"}, "phu_kien_kem_theo": {"bo_sac_di_dong": "ĐẠT - Đủ bộ kèm túi", "bo_va_lop_khan_cap": "ĐẠT", "so_chia_khoa": "2 chìa Smartkey", "so_bao_hanh": "ĐẠT - Kích hoạt bảo hành điện tử 10 năm"}, "tong_diem": "30/30 ĐẠT", "ket_luan": "ĐỦ ĐIỀU KIỆN XUẤT XƯỞNG BÀN GIAO KHÁCH HÀNG"}',
'https://autohub.vn/documents/pdi/BBBG-2026-GTE-001.pdf',
'https://autohub.vn/signatures/cust_le_hoang_long.png',
'https://autohub.vn/signatures/staff_nguyen_van_tuan.png');
GO

-- 17. YÊU CẦU HOÀN CỌC XE (UC40 & Khớp MOCK_STAFF_REFUND_DOCKETS trong staff.mock.ts)
INSERT INTO dbo.yeu_cau_hoan_coc (phieu_dat_coc_id, nhan_vien_doi_soat_id, quan_tri_phe_duyet_id, loai_ly_do, ly_do, minh_chung, ngay_gui, trang_thai, ly_do_tu_choi, ngay_xu_ly) VALUES
-- Hồ sơ 1: #DEP-8841 - Ngân hàng từ chối tín dụng, Staff Tuấn đã thẩm tra hồ sơ và chuyển Admin duyệt
(2, 2, NULL, 'NGAN_HANG_TU_CHOI_TIN_DUNG', N'Ngân hàng từ chối cấp hạn mức cho vay 70% giá trị xe theo đơn thẩm định tín dụng cá nhân.', 'https://autohub.vn/docs/refund/thu_tu_choi_tin_dung_vcb.pdf', DATEADD(HOUR, -10, SYSDATETIME()), 'VERIFIED', NULL, DATEADD(HOUR, -2, SYSDATETIME())),
-- Hồ sơ 2: #DEP-8832 - Ngoại lệ bất khả kháng gia đình, Staff Bảo đối soát, Admin duyệt hoàn tất
(3, 3, 1, 'NGOAI_LE_ADMIN', N'Khách hàng có việc gia đình đột xuất chuyển công tác định cư nước ngoài, xin rút cọc bảo đảm theo điều khoản thỏa thuận bất khả kháng.', 'https://autohub.vn/docs/refund/don_xin_rut_coc_ngoai_le.pdf', DATEADD(DAY, -2, SYSDATETIME()), 'REFUNDED', NULL, DATEADD(HOUR, -6, SYSDATETIME()));
GO

-- 18. GIỎ HÀNG KHÁCH HÀNG & CHI TIẾT GIỎ HÀNG (Khớp Cart Drawer & Giỏ hàng lưu trữ)
INSERT INTO dbo.gio_hang (nguoi_dung_id, ngay_cap_nhat) VALUES
(5, SYSDATETIME()), -- Giỏ hàng khách Nguyễn Văn A
(6, SYSDATETIME()), -- Giỏ hàng khách Trần Hoàng Nam
(8, SYSDATETIME()); -- Giỏ hàng khách Lê Hoàng Long
GO

INSERT INTO dbo.chi_tiet_gio_hang (gio_hang_id, phu_kien_id, so_luong, don_gia_tam_tinh) VALUES
(1, 2, 1, 6500000),  -- Giỏ hàng 1: Camera hành trình 4K LiDAR
(1, 3, 1, 2800000),  -- Giỏ hàng 1: Bộ thảm lót sàn đúc nguyên khối
(2, 5, 2, 5200000),  -- Giỏ hàng 2: 2 Bộ sạc di động khẩn cấp 3.5kW
(3, 6, 1, 3800000);  -- Giỏ hàng 3: Bộ chuyển nguồn 2 chiều V2L
GO

-- 19. ĐƠN HÀNG PHỤ KIỆN (Khớp MOCK_CUSTOMER_ORDERS & MOCK_STAFF_RETURN_ITEMS)
-- Đơn hàng 1: #AH-ACC-2026-9952 (PAID)
INSERT INTO dbo.don_hang_phu_kien (ma_don_hang, nguoi_dung_id, voucher_id, ho_ten_nguoi_nhan, so_dien_thoai_nhan, dia_chi_giao_hang, ngay_dat, phuong_thuc_thanh_toan, phi_van_chuyen, so_tien_giam_voucher, don_vi_van_chuyen, ma_van_don, ngay_giao_hang, tong_tien, han_thanh_toan, thoi_gian_thanh_toan, trang_thai) VALUES
('#AH-ACC-2026-9952', 5, 2, N'Nguyễn Văn A', '0912345678', N'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh', DATEADD(DAY, -3, SYSDATETIME()), 'VNPAY', 0, 500000, N'AutoHub Express Delivery', 'AH-VNP-EXPRESS-9952', NULL, 24400000, DATEADD(DAY, -3, SYSDATETIME()), DATEADD(DAY, -3, SYSDATETIME()), 'PAID'),
-- Đơn hàng 2: #AH-ACC-2026-7810 (DELIVERED)
('#AH-ACC-2026-7810', 5, NULL, N'Nguyễn Văn A', '0912345678', N'Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh', DATEADD(DAY, -10, SYSDATETIME()), 'VNPAY', 0, 0, N'VNPost Nhanh', 'VNP-VNPOST-781044', DATEADD(DAY, -7, SYSDATETIME()), 12200000, DATEADD(DAY, -10, SYSDATETIME()), DATEADD(DAY, -10, SYSDATETIME()), 'DELIVERED'),
-- Đơn hàng 3: #ORD-10892 (DELIVERED - Có yêu cầu đổi trả thảm sàn do nhầm form xe)
('#ORD-10892', 7, NULL, N'Nguyễn Thị Hương', '0912334556', N'158 Đường số 7, KDC Trung Sơn, Bình Chánh, TP. Hồ Chí Minh', DATEADD(DAY, -2, SYSDATETIME()), 'VNPAY', 30000, 0, N'GHTK Express', 'GHTK-ORD-10892', DATEADD(DAY, -1, SYSDATETIME()), 2830000, DATEADD(DAY, -2, SYSDATETIME()), DATEADD(DAY, -2, SYSDATETIME()), 'DELIVERED'),
-- Đơn hàng 4: #ORD-10775 (DELIVERED - Có yêu cầu bảo hành đổi mới camera 4K do lỗi nguồn)
('#ORD-10775', 6, NULL, N'Phan Văn Hậu', '0988665443', N'88 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', DATEADD(DAY, -5, SYSDATETIME()), 'VNPAY', 0, 0, N'Viettel Post', 'VTP-ORD-10775', DATEADD(DAY, -4, SYSDATETIME()), 6500000, DATEADD(DAY, -5, SYSDATETIME()), DATEADD(DAY, -5, SYSDATETIME()), 'DELIVERED');
GO

-- Chi tiết đơn hàng
INSERT INTO dbo.chi_tiet_don_hang (don_hang_id, phu_kien_id, so_luong, don_gia) VALUES
(1, 1, 1, 25000000), -- Đơn 1: Wallbox 22kW
(2, 4, 1, 14500000), -- Đơn 2: Phim cách nhiệt Nano Ceramic
(3, 3, 1, 2800000),  -- Đơn 3: Bộ thảm lót sàn đúc nguyên khối
(4, 2, 1, 6500000);  -- Đơn 4: Camera hành trình 4K LiDAR
GO

-- 20. YÊU CẦU ĐỔI TRẢ PHỤ KIỆN (UC24 & Khớp MOCK_STAFF_RETURN_ITEMS trong staff.mock.ts)
INSERT INTO dbo.yeu_cau_doi_tra (don_hang_id, chi_tiet_don_hang_id, so_luong_doi_tra, ly_do, phuong_an_mong_muon, minh_chung, phuong_an_giai_quyet, ma_van_don_moi, ngay_gui, trang_thai, ghi_chu_xu_ly) VALUES
-- Yêu cầu 1: RMA-01 (#RMA-402) - Đổi hàng do nhầm form xe
(3, 3, 1, N'Giao nhầm phiên bản form xe (khách đi VF9 nhưng nhận thảm VF8)', 'DOI_HANG', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80', 'DOI_HANG', 'AH-EXCHANGE-RMA402', DATEADD(DAY, -1, SYSDATETIME()), 'APPROVED', N'Kiện hàng đã gửi về kho Showroom, thảm còn nguyên bọc nilon và tem niêm phong, chưa qua sử dụng. Đã duyệt xuất kho gửi đổi bản form chuẩn.'),
-- Yêu cầu 2: RMA-02 (#RMA-398) - Bảo hành đổi mới thiết bị lỗi kỹ thuật
(4, 4, 1, N'Màn hình camera chập chờn khi khởi động xe buổi sáng, không lưu thẻ nhớ', 'DOI_HANG', 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=400&q=80', 'DOI_HANG', 'AH-EXCHANGE-RMA398', DATEADD(DAY, -3, SYSDATETIME()), 'COMPLETED', N'Đã kiểm tra kỹ thuật tại phòng bảo hành: Lỗi IC nguồn bo mạch chính. Đã giao camera mới 100% đến khách hàng ngày hôm qua.');
GO

-- 21. ĐÁNH GIÁ SẢN PHẨM PHỤ KIỆN TỪ KHÁCH HÀNG
INSERT INTO dbo.danh_gia (nguoi_dung_id, phu_kien_id, chi_tiet_don_hang_id, so_sao, noi_dung, hinh_anh_danh_gia, ngay_danh_gia, trang_thai_duyet) VALUES
(5, 4, 2, 5, N'Phim cách nhiệt dán xong cabin mát hơn hẳn khi đậu xe ngoài trời nắng. Nhân viên kỹ thuật AutoHub dán kính rất tỉ mỉ không một bọt khí!', '["https://api.builder.io/api/v1/image/assets/TEMP/18b57253ac2342092e966b261e1b3751c6617d08?width=768"]', DATEADD(DAY, -5, SYSDATETIME()), 'APPROVED'),
(5, 1, 1, 5, N'Trạm sạc treo tường Wallbox 22kW sạc xe cực nhanh, thợ AutoHub đến nhà lắp đặt rất gọn gàng và chu đáo.', '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600"]', DATEADD(DAY, -2, SYSDATETIME()), 'APPROVED'),
(7, 3, 3, 5, N'Thảm đúc GT-e vừa khít từng mép sàn xe, nhựa TPE cao cấp không mùi độc hại, rửa xịt nước cực dễ.', '["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600"]', DATEADD(HOUR, -12, SYSDATETIME()), 'APPROVED'),
(8, 4, 4, 5, N'Phim cách nhiệt Nano Ceramic dán xong đi trời trưa nắng gắt cabin mát hẳn, tầm nhìn trong suốt không cản sóng GPS.', '["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600"]', DATEADD(HOUR, -6, SYSDATETIME()), 'APPROVED');
GO

-- 22. BIÊN BẢN BÀN GIAO XE BỔ SUNG
INSERT INTO dbo.bien_ban_ban_giao_xe (phieu_dat_coc_id, xe_dinh_danh_id, nhan_vien_ban_giao_id, ma_bien_ban, ngay_ban_giao, so_odo_ban_giao, ket_qua_pdi_json, file_bien_ban_url, chu_ky_khach, chu_ky_nhan_vien) VALUES
(2, 2, 3, 'BBBG-2026-STF-002', DATEADD(HOUR, -8, SYSDATETIME()), 22, N'{"ngoai_that": "ĐẠT", "noi_that": "ĐẠT", "dong_co": "ĐẠT"}', 'https://autohub.vn/docs/bbbg_02.pdf', 'https://autohub.vn/sig_02.png', 'https://autohub.vn/sig_staff_02.png');
GO

-- 23. VOUCHER KHUYẾN MẠI BỔ SUNG
INSERT INTO dbo.voucher (ma_voucher, phan_tram_giam, giam_toi_da, ngay_het_han, dang_hoat_dong) VALUES
('AUTOHUB_VIP_2026', 10.00, 3000000, '2026-12-31', 1),
('CHARGER_POWER_50', 15.00, 2000000, '2026-12-31', 1),
('SUMMER_DRIVE_15', 5.00, 1000000, '2026-09-30', 1);
GO

-- 24. NHẬT KÝ TƯ VẤN CSKH BỔ SUNG
INSERT INTO dbo.nhat_ky_tu_van (yeu_cau_tu_van_id, nhan_vien_id, loai_tuong_tac, noi_dung_trao_doi, ngan_sach_du_kien, ket_qua_cuoc_goi, thoi_gian_tuong_tac) VALUES
(1, 2, 'CUOC_GOI', N'Đã liên hệ anh Nam tư vấn gói trả góp ngân hàng Vietcombank 70% giá trị xe, lãi suất ưu đãi cố định 2 năm đầu 6.5%.', 1200000000, N'Khách đề xuất gửi bảng tính qua Zalo.', DATEADD(HOUR, -8, SYSDATETIME())),
(2, 3, 'CUOC_GOI', N'Tư vấn chị Thủy phiên bản SantaFe Calligraphy Hybrid màu Đen, tặng kèm gói bảo dưỡng 3 năm và dán phim cách nhiệt.', 1400000000, N'Hẹn chiều mai ghé Showroom Q.7 xem xe thực tế.', DATEADD(HOUR, -5, SYSDATETIME())),
(3, 2, 'ZALO_CHAT', N'Liên hệ anh Long giải đáp thủ tục xuất hóa đơn VAT tên Công ty TNHH và khấu trừ thuế theo biểu thông tư mới.', 2200000000, N'Khách hài lòng và đã tiến hành nạp cọc giữ xe.', DATEADD(HOUR, -2, SYSDATETIME()));
GO

-- 25. NHẬT KÝ HÀNH VI NGƯỜI DÙNG (TRACKING)
IF OBJECT_ID('dbo.nhat_ky_hanh_vi', 'U') IS NOT NULL
BEGIN
    INSERT INTO dbo.nhat_ky_hanh_vi (nguoi_dung_id, ma_phien, loai_hanh_vi, loai_thuc_the, ma_thuc_the, thoi_gian_dung_xem, thoi_gian_tao, du_lieu_bo_sung) VALUES
    (6, 'SESSION_CUST_6_01', 'VIEW_PRODUCT', 'CAR', 7, 180, DATEADD(HOUR, -5, SYSDATETIME()), N'{"referrer": "/cars", "model": "VinFast VF8 Plus"}'),
    (6, 'SESSION_CUST_6_01', 'INTERACT_360', 'CAR', 7, 95, DATEADD(HOUR, -4, SYSDATETIME()), N'{"color": "Xanh Deep Ocean", "rotationAngle": 180}'),
    (7, 'SESSION_CUST_7_02', 'GALLERY_SLIDE', 'CAR', 9, 240, DATEADD(HOUR, -3, SYSDATETIME()), N'{"model": "SantaFe Calligraphy", "slideIndex": 3}'),
    (5, 'SESSION_CUST_5_03', 'VIEW_PRODUCT', 'ACCESSORY', 1, 45, DATEADD(HOUR, -2, SYSDATETIME()), N'{"item": "Bộ sạc Wallbox 22kW"}'),
    (8, 'SESSION_CUST_8_04', 'DWELL_TIME', 'CAR', 10, 310, DATEADD(HOUR, -1, SYSDATETIME()), N'{"model": "VF9 Plus 6 Chỗ"}');
END;
GO

PRINT N'====================================================================================================';
PRINT N'>>> ĐÃ TẠO MỚI TOÀN BỘ CƠ SỞ DỮ LIỆU AutoHubDB VÀ NẠP ĐẦY ĐỦ DỮ LIỆU 32/32 BẢNG THÀNH CÔNG! <<<';
PRINT N'====================================================================================================';
GO
