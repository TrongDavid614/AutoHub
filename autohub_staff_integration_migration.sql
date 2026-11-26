-- ============================================================================
-- AUTOHUB - SQL SERVER MIGRATION SCRIPT FOR STAFF OPERATIONS INTEGRATION
-- GHI CHU: Toan bo noi dung migration nay da duoc gop truc tiep vao autohub_erd.sql.
-- Ban chi can chay duy nhat file autohub_erd.sql la da day du 100% cac bang & du lieu.
-- File nay duoc luu lai lam ban tham chieu doc lap (Idempotent).
-- ============================================================================
USE AutoHubDB;
GO

-- 1. Bang ton kho phu kien theo tung showroom (Module 3)
IF OBJECT_ID(N'dbo.ton_kho_phu_kien_showroom', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ton_kho_phu_kien_showroom (
        id              BIGINT IDENTITY(1,1) PRIMARY KEY,
        phu_kien_id     BIGINT NOT NULL REFERENCES dbo.phu_kien(id),
        showroom_id     BIGINT NOT NULL REFERENCES dbo.showroom(id),
        ma_sku          VARCHAR(50) NULL,
        vi_tri_ke       NVARCHAR(100) NULL,
        so_luong_ton    INT NOT NULL DEFAULT 0 CHECK (so_luong_ton >= 0),
        updated_at      DATETIME2 NOT NULL DEFAULT GETDATE(),
        row_version     BIGINT NOT NULL DEFAULT 0,
        CONSTRAINT UQ_tkpk_pk_sr UNIQUE (phu_kien_id, showroom_id)
    );
END
GO

-- 2. Bang phieu dieu chuyen phu kien giua cac showroom (Module 3)
IF OBJECT_ID(N'dbo.phieu_dieu_chuyen_phu_kien', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.phieu_dieu_chuyen_phu_kien (
        id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
        ma_phieu_chuyen     VARCHAR(50) NOT NULL UNIQUE,
        phu_kien_id         BIGINT NOT NULL REFERENCES dbo.phu_kien(id),
        showroom_xuat_id    BIGINT NOT NULL REFERENCES dbo.showroom(id),
        showroom_nhap_id    BIGINT NOT NULL REFERENCES dbo.showroom(id),
        so_luong            INT NOT NULL CHECK (so_luong > 0),
        nguoi_tao_id        BIGINT NOT NULL REFERENCES dbo.nguoi_dung(id),
        nguoi_xac_nhan_id   BIGINT NULL REFERENCES dbo.nguoi_dung(id),
        ly_do               NVARCHAR(500) NULL,
        trang_thai          VARCHAR(30) NOT NULL DEFAULT 'DANG_VAN_CHUYEN'
                            CHECK (trang_thai IN ('DANG_VAN_CHUYEN', 'DA_TIEP_NHAN', 'DA_HUY')),
        ngay_tao            DATETIME2 NOT NULL DEFAULT GETDATE(),
        ngay_hoan_tat       DATETIME2 NULL,
        CONSTRAINT CK_pdcpk_sr CHECK (showroom_xuat_id <> showroom_nhap_id)
    );
END
GO

-- 3. Bang lich su & phieu bao duong xe Demo (Module 4)
IF OBJECT_ID(N'dbo.lich_su_bao_duong_xe_demo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.lich_su_bao_duong_xe_demo (
        id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
        ma_phieu_bao_duong      VARCHAR(50) NOT NULL UNIQUE,
        xe_demo_id              BIGINT NOT NULL REFERENCES dbo.xe_demo(id),
        nguoi_tao_id            BIGINT NULL REFERENCES dbo.nguoi_dung(id),
        hang_muc_bao_duong      NVARCHAR(500) NOT NULL,
        so_odo_luc_bao_duong    INT NOT NULL DEFAULT 0 CHECK (so_odo_luc_bao_duong >= 0),
        ngay_bat_dau            DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
        ngay_du_kien_hoan_tat   DATE NULL,
        ngay_hoan_tat_thuc_te   DATE NULL,
        trang_thai              VARCHAR(30) NOT NULL DEFAULT 'DANG_BAO_DUONG'
                                CHECK (trang_thai IN ('DA_LEN_LICH', 'DANG_BAO_DUONG', 'HOAN_TAT', 'DA_HUY')),
        ghi_chu                 NVARCHAR(500) NULL,
        ngay_tao                DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- 4. Khoi tao du lieu ton kho phu kien theo showroom tu du lieu thuc dbo.phu_kien x dbo.showroom
--    (Chi chen neu chua ton tai cap (phu_kien_id, showroom_id), bao toan tong so_luong_ton)
;WITH ShowroomOrdered AS (
    SELECT
        id AS showroom_id,
        ROW_NUMBER() OVER (ORDER BY id ASC) AS sr_rn,
        COUNT(*) OVER () AS sr_cnt
    FROM dbo.showroom
    WHERE dang_hoat_dong = 1
),
SplitCalc AS (
    SELECT
        p.id AS phu_kien_id,
        s.showroom_id,
        s.sr_rn,
        s.sr_cnt,
        CASE p.id
            WHEN 1 THEN 'ACC-CHARGER-01'
            WHEN 2 THEN 'ACC-CAM-4K'
            WHEN 3 THEN 'ACC-CARPET-5D'
            WHEN 4 THEN 'ACC-FILM-NANO'
            WHEN 5 THEN 'ACC-BOOSTER-35'
            ELSE CONCAT('ACC-', RIGHT('000' + CAST(p.id AS VARCHAR(10)), 3))
        END AS ma_sku,
        CONCAT(N'Kệ A', ((p.id % 4) + 1), N'-Ô0', p.id) AS vi_tri_ke,
        CASE
            WHEN s.sr_rn = 1 THEN (ISNULL(p.so_luong_ton, 0) / s.sr_cnt) + (ISNULL(p.so_luong_ton, 0) % s.sr_cnt)
            ELSE (ISNULL(p.so_luong_ton, 0) / s.sr_cnt)
        END AS qty
    FROM dbo.phu_kien p
    CROSS JOIN ShowroomOrdered s
)
INSERT INTO dbo.ton_kho_phu_kien_showroom (phu_kien_id, showroom_id, ma_sku, vi_tri_ke, so_luong_ton)
SELECT sc.phu_kien_id, sc.showroom_id, sc.ma_sku, sc.vi_tri_ke, sc.qty
FROM SplitCalc sc
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.ton_kho_phu_kien_showroom tk
    WHERE tk.phu_kien_id = sc.phu_kien_id AND tk.showroom_id = sc.showroom_id
);
GO

-- 5. Khoi tao lich su bao duong mau tu du lieu thuc dbo.xe_demo (chi chen neu bang rong)
IF NOT EXISTS (SELECT 1 FROM dbo.lich_su_bao_duong_xe_demo)
BEGIN
    INSERT INTO dbo.lich_su_bao_duong_xe_demo (
        ma_phieu_bao_duong, xe_demo_id, hang_muc_bao_duong, so_odo_luc_bao_duong,
        ngay_bat_dau, ngay_du_kien_hoan_tat, ngay_hoan_tat_thuc_te, trang_thai, ghi_chu
    )
    SELECT
        CONCAT('BD-DEMO-', RIGHT('000' + CAST(d.id AS VARCHAR(10)), 3)),
        d.id,
        CASE
            WHEN d.trang_thai = 'BAO_DUONG' THEN N'Bảo dưỡng định kỳ & kiểm tra hệ thống phanh, lốp'
            ELSE N'Bảo dưỡng định kỳ tiêu chuẩn trước khi đưa vào vận hành lái thử'
        END,
        ISNULL(d.so_odo_hien_tai, 0),
        ISNULL(d.ngay_bao_duong_gan_nhat, CAST(GETDATE() AS DATE)),
        d.ngay_bao_duong_tiep_theo,
        CASE WHEN d.trang_thai = 'BAO_DUONG' THEN NULL ELSE d.ngay_bao_duong_gan_nhat END,
        CASE WHEN d.trang_thai = 'BAO_DUONG' THEN 'DANG_BAO_DUONG' ELSE 'HOAN_TAT' END,
        N'Khởi tạo đồng bộ từ hồ sơ đội xe Demo'
    FROM dbo.xe_demo d;
END
GO
