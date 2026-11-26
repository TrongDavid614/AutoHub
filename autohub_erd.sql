USE master;
GO
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
/****** Object:  Table [dbo].[bien_ban_ban_giao_ca]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bien_ban_ban_giao_ca](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ma_ban_giao] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[showroom_id] [bigint] NOT NULL,
	[nguoi_ban_giao_id] [bigint] NOT NULL,
	[nguoi_nhan_ca_id] [bigint] NOT NULL,
	[thoi_gian_ban_giao] [datetime2](0) NOT NULL,
	[ca_ban_giao] [nvarchar](30) COLLATE Vietnamese_CI_AS NULL,
	[tien_mat_dau_ca] [decimal](18, 0) NOT NULL,
	[tien_mat_cuoi_ca] [decimal](18, 0) NOT NULL,
	[so_hop_dong_phat_sinh] [int] NOT NULL,
	[ghi_chu_cong_viec] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[chu_ky_nguoi_giao] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[chu_ky_nguoi_nhan] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
 CONSTRAINT [PK_bien_ban_ban_giao_ca] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[bien_ban_ban_giao_xe]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bien_ban_ban_giao_xe](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[phieu_dat_coc_id] [bigint] NOT NULL,
	[xe_dinh_danh_id] [bigint] NOT NULL,
	[nhan_vien_ban_giao_id] [bigint] NOT NULL,
	[ma_bien_ban] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[ngay_ban_giao] [datetime2](0) NOT NULL,
	[so_odo_ban_giao] [int] NOT NULL,
	[ket_qua_pdi_json] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[file_bien_ban_url] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[chu_ky_khach] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[chu_ky_nhan_vien] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
 CONSTRAINT [PK_bien_ban_ban_giao_xe] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[bieu_phi_lan_banh]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bieu_phi_lan_banh](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tinh_thanh_id] [bigint] NOT NULL,
	[ty_le_phi_truoc_ba] [decimal](5, 2) NOT NULL,
	[phi_cap_bien_so] [decimal](18, 0) NOT NULL,
	[phi_dang_kiem] [decimal](18, 0) NOT NULL,
	[phi_bao_tri_duong_bo] [decimal](18, 0) NOT NULL,
	[phi_bao_hiem_tnds] [decimal](18, 0) NOT NULL,
	[ngay_ap_dung] [date] NOT NULL,
	[ngay_het_hieu_luc] [date] NULL,
 CONSTRAINT [PK_bieu_phi] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[chi_tiet_don_hang]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[chi_tiet_don_hang](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[don_hang_id] [bigint] NOT NULL,
	[phu_kien_id] [bigint] NOT NULL,
	[so_luong] [int] NOT NULL,
	[don_gia] [decimal](18, 0) NOT NULL,
	[thanh_tien]  AS (CONVERT([decimal](18,0),[so_luong]*[don_gia])) PERSISTED,
 CONSTRAINT [PK_ctdh] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[chi_tiet_gio_hang]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[chi_tiet_gio_hang](
	[gio_hang_id] [bigint] NOT NULL,
	[phu_kien_id] [bigint] NOT NULL,
	[so_luong] [int] NOT NULL,
	[don_gia_tam_tinh] [decimal](18, 0) NOT NULL,
 CONSTRAINT [PK_ctgh] PRIMARY KEY CLUSTERED 
(
	[gio_hang_id] ASC,
	[phu_kien_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[chuong_trinh_khuyen_mai]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[chuong_trinh_khuyen_mai](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ten_chuong_trinh] [nvarchar](150) COLLATE Vietnamese_CI_AS NOT NULL,
	[loai_uu_dai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[gia_tri] [decimal](18, 2) NOT NULL,
	[ngay_bat_dau] [date] NOT NULL,
	[ngay_ket_thuc] [date] NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_ctkm] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[danh_gia]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[danh_gia](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nguoi_dung_id] [bigint] NOT NULL,
	[phu_kien_id] [bigint] NOT NULL,
	[chi_tiet_don_hang_id] [bigint] NOT NULL,
	[so_sao] [tinyint] NOT NULL,
	[noi_dung] [nvarchar](1000) COLLATE Vietnamese_CI_AS NULL,
	[hinh_anh_danh_gia] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[ngay_danh_gia] [datetime2](0) NOT NULL,
	[trang_thai_duyet] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
 CONSTRAINT [PK_danh_gia] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[danh_muc_phu_kien]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[danh_muc_phu_kien](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ten_danh_muc] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_danh_muc] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[don_hang_phu_kien]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[don_hang_phu_kien](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ma_don_hang] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[nguoi_dung_id] [bigint] NOT NULL,
	[voucher_id] [bigint] NULL,
	[ho_ten_nguoi_nhan] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_dien_thoai_nhan] [char](10) COLLATE Vietnamese_CI_AS NOT NULL,
	[dia_chi_giao_hang] [nvarchar](255) COLLATE Vietnamese_CI_AS NOT NULL,
	[ghi_chu_khach_hang] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[ngay_dat] [datetime2](0) NOT NULL,
	[phuong_thuc_thanh_toan] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[phi_van_chuyen] [decimal](18, 0) NOT NULL,
	[so_tien_giam_voucher] [decimal](18, 0) NOT NULL,
	[don_vi_van_chuyen] [nvarchar](100) COLLATE Vietnamese_CI_AS NULL,
	[ma_van_don] [nvarchar](50) COLLATE Vietnamese_CI_AS NULL,
	[ngay_giao_hang] [datetime2](0) NULL,
	[tong_tien] [decimal](18, 0) NOT NULL,
	[han_thanh_toan] [datetime2](0) NULL,
	[thoi_gian_thanh_toan] [datetime2](0) NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
 CONSTRAINT [PK_don_hang] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[dong_xe]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[dong_xe](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[hang_xe_id] [bigint] NOT NULL,
	[ten_dong_xe] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[phan_khuc] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[xuat_xu] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[mo_ta] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_dong_xe] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[goi_vay_ngan_hang]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[goi_vay_ngan_hang](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ten_ngan_hang] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[ma_ngan_hang] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[logo_url] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[lai_suat_nam] [decimal](5, 2) NOT NULL,
	[ty_le_vay_toi_da] [decimal](5, 2) NOT NULL,
	[thoi_han_toi_da_thang] [int] NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
	[ghi_chu] [nvarchar](255) COLLATE Vietnamese_CI_AS NULL,
	[created_at] [datetime2](0) NOT NULL,
	[updated_at] [datetime2](0) NULL,
 CONSTRAINT [PK_goi_vay_ngan_hang] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[giao_dich_thanh_toan]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[giao_dich_thanh_toan](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[phieu_dat_coc_id] [bigint] NULL,
	[don_hang_id] [bigint] NULL,
	[ma_tham_chieu] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[ma_giao_dich_vnpay] [nvarchar](64) COLLATE Vietnamese_CI_AS NULL,
	[ma_giao_dich_sepay] [nvarchar](100) COLLATE Vietnamese_CI_AS NULL,
	[loai_giao_dich] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[phuong_thuc] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_tien] [decimal](18, 0) NOT NULL,
	[thoi_gian_khoi_tao] [datetime2](0) NOT NULL,
	[thoi_gian_thanh_toan] [datetime2](0) NULL,
	[ma_ket_qua] [nvarchar](50) COLLATE Vietnamese_CI_AS NULL,
	[du_lieu_webhook] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
 CONSTRAINT [PK_giao_dich] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[gio_hang]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gio_hang](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nguoi_dung_id] [bigint] NOT NULL,
	[ngay_cap_nhat] [datetime2](0) NOT NULL,
 CONSTRAINT [PK_gio_hang] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[hang_xe]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hang_xe](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ten_hang_xe] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_hang_xe] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[hinh_anh_xe]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hinh_anh_xe](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[phien_ban_id] [bigint] NOT NULL,
	[mau_sac_id] [bigint] NULL,
	[duong_dan] [nvarchar](500) COLLATE Vietnamese_CI_AS NOT NULL,
	[loai_anh] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[goc_quay] [int] NULL,
	[thu_tu_hien_thi] [int] NOT NULL,
 CONSTRAINT [PK_hinh_anh_xe] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[khuyen_mai_phien_ban]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[khuyen_mai_phien_ban](
	[chuong_trinh_id] [bigint] NOT NULL,
	[phien_ban_id] [bigint] NOT NULL,
 CONSTRAINT [PK_kmpb] PRIMARY KEY CLUSTERED 
(
	[chuong_trinh_id] ASC,
	[phien_ban_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[lich_hen_lai_thu]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[lich_hen_lai_thu](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nguoi_dung_id] [bigint] NOT NULL,
	[phien_ban_id] [bigint] NOT NULL,
	[xe_demo_id] [bigint] NULL,
	[showroom_id] [bigint] NULL,
	[thoi_gian_hen] [datetime2](0) NOT NULL,
	[thoi_luong_phut] [int] NOT NULL,
	[dia_diem_lai_thu] [nvarchar](255) COLLATE Vietnamese_CI_AS NOT NULL,
	[ho_ten_khach] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_dien_thoai_khach] [char](10) COLLATE Vietnamese_CI_AS NOT NULL,
	[cam_ket_gplx] [bit] NOT NULL,
	[so_gplx_kiem_tra] [nvarchar](20) COLLATE Vietnamese_CI_AS NULL,
	[odo_bat_dau] [int] NULL,
	[odo_ket_thuc] [int] NULL,
	[thoi_gian_checkin] [datetime2](0) NULL,
	[thoi_gian_checkout] [datetime2](0) NULL,
	[chu_ky_khach_hang] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[ngay_tao] [datetime2](0) NOT NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ghi_chu] [nvarchar](255) COLLATE Vietnamese_CI_AS NULL,
	[da_gui_nhac_lich] [bit] NOT NULL,
	[thoi_gian_gui_nhac] [datetime2](0) NULL,
	[bien_ban_danh_gia] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
 CONSTRAINT [PK_lich_hen_lai_thu] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[lich_truc_nhan_vien]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lich_truc_nhan_vien](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nhan_vien_id] [bigint] NOT NULL,
	[showroom_id] [bigint] NOT NULL,
	[ngay_truc] [date] NOT NULL,
	[ca_truc] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ghi_chu] [nvarchar](255) COLLATE Vietnamese_CI_AS NULL,
	[ngay_tao] [datetime2](0) NOT NULL,
 CONSTRAINT [PK_lich_truc] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[mau_sac]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[mau_sac](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ten_mau] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[ma_hex] [char](7) COLLATE Vietnamese_CI_AS NOT NULL,
 CONSTRAINT [PK_mau_sac] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[nguoi_dung]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[nguoi_dung](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[showroom_id] [bigint] NULL,
	[ho_ten] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[email] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[mat_khau_bam] [nvarchar](255) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_dien_thoai] [char](10) COLLATE Vietnamese_CI_AS NULL,
	[anh_dai_dien] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[so_cccd] [char](12) COLLATE Vietnamese_CI_AS NULL,
	[ngay_sinh] [date] NULL,
	[gioi_tinh] [nvarchar](10) COLLATE Vietnamese_CI_AS NULL,
	[vai_tro] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[trang_thai_tai_khoan] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ngay_tao] [datetime2](0) NOT NULL,
	[updated_at] [datetime2](0) NULL,
	[is_deleted] [bit] NOT NULL,
 CONSTRAINT [PK_nguoi_dung] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[nhat_ky_hanh_vi]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nhat_ky_hanh_vi](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nguoi_dung_id] [bigint] NULL,
	[ma_phien] [nvarchar](100) COLLATE Vietnamese_CI_AS NULL,
	[loai_hanh_vi] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[loai_thuc_the] [nvarchar](50) COLLATE Vietnamese_CI_AS NULL,
	[ma_thuc_the] [bigint] NULL,
	[thoi_gian_dung_xem] [int] NOT NULL,
	[du_lieu_bo_sung] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[thoi_gian_tao] [datetime2](0) NOT NULL,
 CONSTRAINT [PK_nhat_ky_hanh_vi] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[nhat_ky_tu_van]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nhat_ky_tu_van](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[yeu_cau_tu_van_id] [bigint] NOT NULL,
	[nhan_vien_id] [bigint] NOT NULL,
	[loai_tuong_tac] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[noi_dung_trao_doi] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[ngan_sach_du_kien] [decimal](18, 2) NULL,
	[ket_qua_cuoc_goi] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[thoi_gian_tuong_tac] [datetime2](0) NOT NULL,
	[thoi_gian_phan_hoi_ms] [int] NULL,
 CONSTRAINT [PK_nhat_ky_tu_van] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[phien_ban_xe]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phien_ban_xe](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[dong_xe_id] [bigint] NOT NULL,
	[ten_phien_ban] [nvarchar](150) COLLATE Vietnamese_CI_AS NOT NULL,
	[nam_san_xuat] [int] NOT NULL,
	[hop_so] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[loai_nhien_lieu] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_cho_ngoi] [int] NOT NULL,
	[gia_niem_yet] [decimal](18, 0) NOT NULL,
	[muc_tien_coc] [decimal](18, 0) NOT NULL,
	[tam_hoat_dong_km] [int] NULL,
	[dung_luong_pin_kwh] [numeric](6, 2) NULL,
	[thong_so_ky_thuat] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[dang_hoat_dong] [bit] NOT NULL,
	[is_deleted] [bit] NOT NULL,
 CONSTRAINT [PK_phien_ban_xe] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[phieu_dat_coc]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[phieu_dat_coc](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ma_phieu_coc] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[nguoi_dung_id] [bigint] NOT NULL,
	[ton_kho_id] [bigint] NOT NULL,
	[xe_dinh_danh_id] [bigint] NULL,
	[so_cccd] [char](12) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_tien_coc] [decimal](18, 0) NOT NULL,
	[ngay_dat_coc] [datetime2](0) NOT NULL,
	[han_thanh_toan] [datetime2](0) NOT NULL,
	[thoi_gian_thanh_toan] [datetime2](0) NULL,
	[han_giu_xe] [datetime2](0) NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[thoi_gian_hoan_tat] [datetime2](0) NULL,
 CONSTRAINT [PK_phieu_dat_coc] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[phieu_dieu_chuyen_kho]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phieu_dieu_chuyen_kho](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ma_phieu_chuyen] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[showroom_xuat_id] [bigint] NOT NULL,
	[showroom_nhap_id] [bigint] NOT NULL,
	[xe_dinh_danh_id] [bigint] NOT NULL,
	[nguoi_tao_id] [bigint] NOT NULL,
	[ngay_tao] [datetime2](0) NOT NULL,
	[ngay_hoan_tat] [datetime2](0) NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ghi_chu] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
 CONSTRAINT [PK_phieu_dieu_chuyen] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[phu_kien]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phu_kien](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[danh_muc_id] [bigint] NOT NULL,
	[ten_phu_kien] [nvarchar](200) COLLATE Vietnamese_CI_AS NULL,
	[thuong_hieu] [nvarchar](100) COLLATE Vietnamese_CI_AS NULL,
	[gia_ban] [decimal](18, 0) NOT NULL,
	[so_luong_ton] [int] NOT NULL,
	[quy_cach_lap_dat] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[hinh_anh] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[dung_chung] [bit] NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_phu_kien] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[phu_kien_dong_xe_tuong_thich]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phu_kien_dong_xe_tuong_thich](
	[phu_kien_id] [bigint] NOT NULL,
	[dong_xe_id] [bigint] NOT NULL,
	[nam_bat_dau] [int] NULL,
	[nam_ket_thuc] [int] NULL,
 CONSTRAINT [PK_pkdx] PRIMARY KEY CLUSTERED 
(
	[phu_kien_id] ASC,
	[dong_xe_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[phuong_thuc_van_chuyen]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[phuong_thuc_van_chuyen](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ma_phuong_thuc] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[ten_phuong_thuc] [nvarchar](150) COLLATE Vietnamese_CI_AS NOT NULL,
	[mo_ta] [nvarchar](255) COLLATE Vietnamese_CI_AS NULL,
	[sub_mo_ta] [nvarchar](255) COLLATE Vietnamese_CI_AS NULL,
	[tag] [nvarchar](50) COLLATE Vietnamese_CI_AS NULL,
	[thoi_gian_du_kien] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[chi_phi] [decimal](18, 0) NOT NULL,
	[dieu_kien_mien_phi] [decimal](18, 0) NULL,
	[thu_tu] [int] NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[updated_at] [datetime2](7) NULL,
	[is_deleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[showroom]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[showroom](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[tinh_thanh_id] [bigint] NOT NULL,
	[ten_showroom] [nvarchar](150) COLLATE Vietnamese_CI_AS NOT NULL,
	[dia_chi] [nvarchar](255) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_dien_thoai] [nvarchar](20) COLLATE Vietnamese_CI_AS NOT NULL,
	[gio_mo_cua] [time](0) NOT NULL,
	[gio_dong_cua] [time](0) NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_showroom] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[so_dia_chi]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[so_dia_chi](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nguoi_dung_id] [bigint] NOT NULL,
	[ho_ten_nguoi_nhan] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_dien_thoai] [char](10) COLLATE Vietnamese_CI_AS NOT NULL,
	[tinh_thanh] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[quan_huyen] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[phuong_xa] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[dia_chi_chi_tiet] [nvarchar](255) COLLATE Vietnamese_CI_AS NOT NULL,
	[mac_dinh] [bit] NOT NULL,
 CONSTRAINT [PK_so_dia_chi] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tinh_thanh]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tinh_thanh](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ten_tinh] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[phan_vung_bien_so] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
 CONSTRAINT [PK_tinh_thanh] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ton_kho_xe]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ton_kho_xe](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[phien_ban_id] [bigint] NOT NULL,
	[mau_sac_id] [bigint] NOT NULL,
	[showroom_id] [bigint] NOT NULL,
	[so_luong_kha_dung] [int] NOT NULL,
	[so_luong_dang_giu_cho] [int] NOT NULL,
	[row_version] [timestamp] NOT NULL,
 CONSTRAINT [PK_ton_kho_xe] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[voucher]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ma_voucher] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[phan_tram_giam] [decimal](5, 2) NOT NULL,
	[giam_toi_da] [decimal](18, 0) NOT NULL,
	[ngay_het_han] [date] NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_voucher] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[xe_demo]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[xe_demo](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[showroom_id] [bigint] NOT NULL,
	[phien_ban_id] [bigint] NOT NULL,
	[bien_so] [nvarchar](20) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_odo_hien_tai] [int] NOT NULL,
	[ngay_bao_duong_gan_nhat] [date] NULL,
	[ngay_bao_duong_tiep_theo] [date] NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[dang_hoat_dong] [bit] NOT NULL,
 CONSTRAINT [PK_xe_demo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[xe_dinh_danh]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[xe_dinh_danh](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[ton_kho_id] [bigint] NOT NULL,
	[so_khung_vin] [char](17) COLLATE Vietnamese_CI_AS NOT NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
 CONSTRAINT [PK_xe_dinh_danh] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[yeu_cau_doi_tra]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[yeu_cau_doi_tra](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[don_hang_id] [bigint] NOT NULL,
	[chi_tiet_don_hang_id] [bigint] NOT NULL,
	[so_luong_doi_tra] [int] NOT NULL,
	[ly_do] [nvarchar](500) COLLATE Vietnamese_CI_AS NOT NULL,
	[phuong_an_mong_muon] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[minh_chung] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[phuong_an_giai_quyet] [nvarchar](50) COLLATE Vietnamese_CI_AS NULL,
	[ma_van_don_moi] [nvarchar](50) COLLATE Vietnamese_CI_AS NULL,
	[ngay_gui] [datetime2](0) NOT NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ghi_chu_xu_ly] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
 CONSTRAINT [PK_yeu_cau_doi_tra] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[yeu_cau_hoan_coc]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[yeu_cau_hoan_coc](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[phieu_dat_coc_id] [bigint] NOT NULL,
	[nhan_vien_doi_soat_id] [bigint] NULL,
	[quan_tri_phe_duyet_id] [bigint] NULL,
	[loai_ly_do] [nvarchar](50) COLLATE Vietnamese_CI_AS NOT NULL,
	[ly_do] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[minh_chung] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[ngay_gui] [datetime2](0) NOT NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ly_do_tu_choi] [nvarchar](500) COLLATE Vietnamese_CI_AS NULL,
	[ngay_xu_ly] [datetime2](0) NULL,
 CONSTRAINT [PK_yeu_cau_hoan_coc] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[yeu_cau_tu_van]    Script Date: 11/25/2026 3:00:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[yeu_cau_tu_van](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nguoi_dung_id] [bigint] NULL,
	[phien_ban_id] [bigint] NULL,
	[nhan_vien_id] [bigint] NULL,
	[ho_ten] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[so_dien_thoai] [char](10) COLLATE Vietnamese_CI_AS NOT NULL,
	[email] [nvarchar](100) COLLATE Vietnamese_CI_AS NOT NULL,
	[noi_dung_can_tu_van] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
	[khung_gio_tiep_nhan] [nvarchar](100) COLLATE Vietnamese_CI_AS NULL,
	[ngay_gui] [datetime2](0) NOT NULL,
	[trang_thai] [nvarchar](30) COLLATE Vietnamese_CI_AS NOT NULL,
	[ghi_chu_cskh] [nvarchar](max) COLLATE Vietnamese_CI_AS NULL,
 CONSTRAINT [PK_yeu_cau_tu_van] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[bien_ban_ban_giao_ca] ON 

GO
INSERT [dbo].[bien_ban_ban_giao_ca] ([id], [ma_ban_giao], [showroom_id], [nguoi_ban_giao_id], [nguoi_nhan_ca_id], [thoi_gian_ban_giao], [ca_ban_giao], [tien_mat_dau_ca], [tien_mat_cuoi_ca], [so_hop_dong_phat_sinh], [ghi_chu_cong_viec], [chu_ky_nguoi_giao], [chu_ky_nguoi_nhan]) VALUES (1, N'BGCA-SR01-20261110-01', 1, 2, 4, CAST(N'2026-11-10T18:58:58.0000000' AS DateTime2), N'CA_SANG', CAST(5000000 AS Decimal(18, 0)), CAST(5000000 AS Decimal(18, 0)), 2, N'Đã hoàn tất bàn giao xe GT-e cho khách Lê Hoàng Long; 2 lịch hẹn lái thử chiều nay lúc 14h và 16h đã chuẩn bị xe demo sạch sẽ.', N'https://autohub.vn/sig_staff_02.png', N'https://autohub.vn/sig_staff_04.png')
GO
SET IDENTITY_INSERT [dbo].[bien_ban_ban_giao_ca] OFF
GO
SET IDENTITY_INSERT [dbo].[bien_ban_ban_giao_xe] ON 

GO
INSERT [dbo].[bien_ban_ban_giao_xe] ([id], [phieu_dat_coc_id], [xe_dinh_danh_id], [nhan_vien_ban_giao_id], [ma_bien_ban], [ngay_ban_giao], [so_odo_ban_giao], [ket_qua_pdi_json], [file_bien_ban_url], [chu_ky_khach], [chu_ky_nhan_vien]) VALUES (1, 1, 3, 2, N'BBBG-2026-GTE-001', CAST(N'2026-11-10T20:58:58.0000000' AS DateTime2), 15, N'{"tieu_chuan": "Quy trình PDI 30 điểm tiêu chuẩn AutoHub", "ngoai_that": {"nuoc_son": "ĐẠT - Không trầy xước", "den_chieu_sang": "ĐẠT - Hoạt động tốt", "kinh_chan_gio": "ĐẠT - Trong suốt, không tì vết", "ap_suat_lop": "ĐẠT - 2.5 bar đủ 4 bánh"}, "noi_that": {"ghe_da_nappa": "ĐẠT - Sạch sẽ nguyên seal bọc", "man_hinh_trung_tam": "ĐẠT - Cảm ứng mượt mà", "dieu_hoa": "ĐẠT - Mát sâu 2 vùng độc lập"}, "khoang_pin_dong_co": {"muc_pin_giao_xe": "100%", "dien_ap_pin": "400V ổn định", "dong_co_dien": "ĐẠT - Không tiếng ồn lạ"}, "phu_kien_kem_theo": {"bo_sac_di_dong": "ĐẠT - Đủ bộ kèm túi", "bo_va_lop_khan_cap": "ĐẠT", "so_chia_khoa": "2 chìa Smartkey", "so_bao_hanh": "ĐẠT - Kích hoạt bảo hành điện tử 10 năm"}, "tong_diem": "30/30 ĐẠT", "ket_luan": "ĐỦ ĐIỀU KIỆN XUẤT XƯỞNG BÀN GIAO KHÁCH HÀNG"}', N'https://autohub.vn/documents/pdi/BBBG-2026-GTE-001.pdf', N'https://autohub.vn/signatures/cust_le_hoang_long.png', N'https://autohub.vn/signatures/staff_nguyen_van_tuan.png')
GO
INSERT [dbo].[bien_ban_ban_giao_xe] ([id], [phieu_dat_coc_id], [xe_dinh_danh_id], [nhan_vien_ban_giao_id], [ma_bien_ban], [ngay_ban_giao], [so_odo_ban_giao], [ket_qua_pdi_json], [file_bien_ban_url], [chu_ky_khach], [chu_ky_nhan_vien]) VALUES (2, 2, 2, 3, N'BBBG-2026-STF-002', CAST(N'2026-11-10T14:58:58.0000000' AS DateTime2), 22, N'{"ngoai_that": "ĐẠT", "noi_that": "ĐẠT", "dong_co": "ĐẠT"}', N'https://autohub.vn/docs/bbbg_02.pdf', N'https://autohub.vn/sig_02.png', N'https://autohub.vn/sig_staff_02.png')
GO
SET IDENTITY_INSERT [dbo].[bien_ban_ban_giao_xe] OFF
GO
SET IDENTITY_INSERT [dbo].[bieu_phi_lan_banh] ON 

GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (1, 1, CAST(12.00 AS Decimal(5, 2)), CAST(20000000 AS Decimal(18, 0)), CAST(340000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(873400 AS Decimal(18, 0)), CAST(N'2026-01-01' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (2, 2, CAST(10.00 AS Decimal(5, 2)), CAST(20000000 AS Decimal(18, 0)), CAST(340000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(873400 AS Decimal(18, 0)), CAST(N'2026-01-01' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (3, 3, CAST(10.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(340000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(873400 AS Decimal(18, 0)), CAST(N'2026-01-01' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (4, 4, CAST(10.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(90000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(480700 AS Decimal(18, 0)), CAST(N'2026-11-14' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (5, 5, CAST(10.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(90000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(480700 AS Decimal(18, 0)), CAST(N'2026-11-14' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (6, 6, CAST(10.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(90000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(480700 AS Decimal(18, 0)), CAST(N'2026-11-14' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (7, 7, CAST(10.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(90000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(480700 AS Decimal(18, 0)), CAST(N'2026-11-14' AS Date), NULL)
GO
INSERT [dbo].[bieu_phi_lan_banh] ([id], [tinh_thanh_id], [ty_le_phi_truoc_ba], [phi_cap_bien_so], [phi_dang_kiem], [phi_bao_tri_duong_bo], [phi_bao_hiem_tnds], [ngay_ap_dung], [ngay_het_hieu_luc]) VALUES (8, 8, CAST(10.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(90000 AS Decimal(18, 0)), CAST(1560000 AS Decimal(18, 0)), CAST(480700 AS Decimal(18, 0)), CAST(N'2026-11-14' AS Date), NULL)
GO
SET IDENTITY_INSERT [dbo].[bieu_phi_lan_banh] OFF
GO
SET ANSI_PADDING ON
GO
SET IDENTITY_INSERT [dbo].[chi_tiet_don_hang] ON 

GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (1, 1, 1, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (2, 2, 4, 1, CAST(14500000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (3, 3, 3, 1, CAST(2800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (4, 4, 2, 1, CAST(6500000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (5, 5, 2, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (6, 6, 3, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (7, 7, 4, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (8, 8, 5, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (9, 9, 1, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (10, 10, 2, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (11, 11, 3, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (12, 12, 4, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (13, 13, 5, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (14, 14, 1, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (15, 15, 2, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (16, 16, 3, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (17, 17, 4, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (18, 18, 5, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (19, 19, 1, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (20, 20, 2, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (21, 21, 3, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (22, 22, 4, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (23, 23, 5, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (24, 24, 1, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (25, 25, 2, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (26, 26, 3, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (27, 27, 4, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (28, 28, 5, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (29, 29, 1, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (30, 30, 2, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (31, 31, 3, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (32, 32, 4, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (33, 33, 5, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (34, 34, 1, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (35, 35, 2, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (36, 36, 3, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (37, 37, 4, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (38, 38, 5, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (39, 39, 1, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (40, 40, 2, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (41, 41, 3, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (42, 42, 4, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (43, 43, 5, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (44, 44, 1, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (45, 45, 2, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (46, 46, 3, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (47, 47, 4, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (48, 48, 5, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (49, 49, 1, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (50, 50, 2, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (51, 51, 3, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (52, 52, 4, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (53, 53, 5, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (54, 54, 1, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (55, 55, 2, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (56, 56, 3, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (57, 57, 4, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (58, 58, 5, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (59, 59, 1, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (60, 60, 2, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (61, 61, 3, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (62, 62, 4, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (63, 63, 5, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (64, 64, 1, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (65, 65, 2, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (66, 66, 3, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (67, 67, 4, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (68, 68, 5, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (69, 69, 1, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (70, 70, 2, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (71, 71, 3, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (72, 72, 4, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (73, 73, 5, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (74, 74, 1, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (75, 75, 2, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (76, 76, 3, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (77, 77, 4, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (78, 78, 5, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (79, 79, 1, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (80, 80, 2, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (81, 81, 3, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (82, 82, 4, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (83, 83, 5, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (84, 84, 1, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (85, 85, 2, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (86, 86, 3, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (87, 87, 4, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (88, 88, 5, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (89, 89, 1, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (90, 90, 2, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (91, 91, 3, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (92, 92, 4, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (93, 93, 5, 1, CAST(85000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (94, 94, 1, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (95, 95, 2, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (96, 96, 3, 1, CAST(48000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (97, 97, 4, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (98, 98, 5, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (99, 99, 1, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (100, 100, 2, 1, CAST(35000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (101, 101, 3, 1, CAST(25000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (102, 102, 4, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (103, 103, 5, 1, CAST(65000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (104, 104, 1, 1, CAST(110000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (105, 108, 2, 1, CAST(8500000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (106, 109, 1, 1, CAST(24400000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (107, 109, 2, 1, CAST(8000000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (108, 110, 1, 1, CAST(24900000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (109, 1, 10, 2, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (110, 2, 10, 1, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (111, 111, 3, 3, CAST(2800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (112, 111, 10, 2, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (113, 112, 1, 1, CAST(28500000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (114, 113, 1, 2, CAST(28500000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (115, 114, 1, 10, CAST(24400000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (116, 114, 9, 35, CAST(1450000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (117, 114, 10, 35, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (118, 115, 3, 2, CAST(2800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (119, 116, 10, 1, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (120, 117, 9, 1, CAST(1450000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_don_hang] ([id], [don_hang_id], [phu_kien_id], [so_luong], [don_gia]) VALUES (121, 118, 3, 4, CAST(2800000 AS Decimal(18, 0)))
GO
SET IDENTITY_INSERT [dbo].[chi_tiet_don_hang] OFF
GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (1, 1, 1, CAST(24900000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (1, 3, 2, CAST(2800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (1, 9, 1, CAST(1450000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (1, 10, 1, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (2, 5, 2, CAST(5200000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (3, 6, 1, CAST(3800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (4, 1, 6, CAST(24900000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (4, 3, 12, CAST(2800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (4, 9, 6, CAST(1450000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (4, 10, 6, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (7, 1, 11, CAST(24900000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (7, 3, 2, CAST(2800000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (7, 9, 1, CAST(1450000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (7, 10, 1, CAST(950000 AS Decimal(18, 0)))
GO
INSERT [dbo].[chi_tiet_gio_hang] ([gio_hang_id], [phu_kien_id], [so_luong], [don_gia_tam_tinh]) VALUES (8, 1, 2, CAST(24900000 AS Decimal(18, 0)))
GO
SET IDENTITY_INSERT [dbo].[chuong_trinh_khuyen_mai] ON 

GO
INSERT [dbo].[chuong_trinh_khuyen_mai] ([id], [ten_chuong_trinh], [loai_uu_dai], [gia_tri], [ngay_bat_dau], [ngay_ket_thuc], [dang_hoat_dong]) VALUES (1, N'Ưu đãi miễn phí 1 năm sạc trạm & Tặng Wallbox 22kW', N'GIAM_TIEN_MAT', CAST(30000000.00 AS Decimal(18, 2)), CAST(N'2026-01-01' AS Date), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[chuong_trinh_khuyen_mai] ([id], [ten_chuong_trinh], [loai_uu_dai], [gia_tri], [ngay_bat_dau], [ngay_ket_thuc], [dang_hoat_dong]) VALUES (2, N'Hỗ trợ 50% Lệ phí trước bạ khi đặt cọc online', N'HO_TRO_LE_PHI_TRUOC_BA', CAST(50.00 AS Decimal(18, 2)), CAST(N'2026-06-01' AS Date), CAST(N'2026-12-31' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[chuong_trinh_khuyen_mai] OFF
GO
SET IDENTITY_INSERT [dbo].[danh_gia] ON 

GO
INSERT [dbo].[danh_gia] ([id], [nguoi_dung_id], [phu_kien_id], [chi_tiet_don_hang_id], [so_sao], [noi_dung], [hinh_anh_danh_gia], [ngay_danh_gia], [trang_thai_duyet]) VALUES (1, 5, 4, 2, 5, N'Phim cách nhiệt dán xong cabin mát hơn hẳn khi đậu xe ngoài trời nắng. Nhân viên kỹ thuật AutoHub dán kính rất tỉ mỉ không một bọt khí!', N'["https://api.builder.io/api/v1/image/assets/TEMP/18b57253ac2342092e966b261e1b3751c6617d08?width=768"]', CAST(N'2026-11-05T22:58:58.0000000' AS DateTime2), N'APPROVED')
GO
INSERT [dbo].[danh_gia] ([id], [nguoi_dung_id], [phu_kien_id], [chi_tiet_don_hang_id], [so_sao], [noi_dung], [hinh_anh_danh_gia], [ngay_danh_gia], [trang_thai_duyet]) VALUES (2, 5, 1, 1, 5, N'Trạm sạc treo tường Wallbox 22kW sạc xe cực nhanh, thợ AutoHub đến nhà lắp đặt rất gọn gàng và chu đáo.', N'["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600"]', CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), N'APPROVED')
GO
INSERT [dbo].[danh_gia] ([id], [nguoi_dung_id], [phu_kien_id], [chi_tiet_don_hang_id], [so_sao], [noi_dung], [hinh_anh_danh_gia], [ngay_danh_gia], [trang_thai_duyet]) VALUES (3, 7, 3, 3, 5, N'Thảm đúc GT-e vừa khít từng mép sàn xe, nhựa TPE cao cấp không mùi độc hại, rửa xịt nước cực dễ.', N'["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600"]', CAST(N'2026-11-10T10:58:58.0000000' AS DateTime2), N'APPROVED')
GO
INSERT [dbo].[danh_gia] ([id], [nguoi_dung_id], [phu_kien_id], [chi_tiet_don_hang_id], [so_sao], [noi_dung], [hinh_anh_danh_gia], [ngay_danh_gia], [trang_thai_duyet]) VALUES (4, 8, 4, 4, 5, N'Phim cách nhiệt Nano Ceramic dán xong đi trời trưa nắng gắt cabin mát hơn, tầm nhìn trong suốt không cản sóng GPS.', N'["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600"]', CAST(N'2026-11-10T16:58:58.0000000' AS DateTime2), N'APPROVED')
GO
INSERT [dbo].[danh_gia] ([id], [nguoi_dung_id], [phu_kien_id], [chi_tiet_don_hang_id], [so_sao], [noi_dung], [hinh_anh_danh_gia], [ngay_danh_gia], [trang_thai_duyet]) VALUES (5, 5, 10, 109, 5, N'Gối tựa đầu cao su non cực êm, đi đường dài không còn mỏi cổ, chất liệu vải thoáng khí không bị bí mồ hôi. Rất hài lòng!', NULL, CAST(N'2026-11-14T07:24:00.0000000' AS DateTime2), N'APPROVED')
GO
INSERT [dbo].[danh_gia] ([id], [nguoi_dung_id], [phu_kien_id], [chi_tiet_don_hang_id], [so_sao], [noi_dung], [hinh_anh_danh_gia], [ngay_danh_gia], [trang_thai_duyet]) VALUES (6, 6, 10, 110, 5, N'Form công thái học ôm sát gáy, lắp vừa khít ghế xe GT-e và SUV-e. Đóng gói cẩn thận, giao hàng siêu nhanh.', NULL, CAST(N'2026-11-14T07:24:00.0000000' AS DateTime2), N'APPROVED')
GO
SET IDENTITY_INSERT [dbo].[danh_gia] OFF
GO
SET IDENTITY_INSERT [dbo].[danh_muc_phu_kien] ON 

GO
INSERT [dbo].[danh_muc_phu_kien] ([id], [ten_danh_muc], [dang_hoat_dong]) VALUES (1, N'Sạc & Năng lượng', 1)
GO
INSERT [dbo].[danh_muc_phu_kien] ([id], [ten_danh_muc], [dang_hoat_dong]) VALUES (2, N'Camera & Cảm biến', 1)
GO
INSERT [dbo].[danh_muc_phu_kien] ([id], [ten_danh_muc], [dang_hoat_dong]) VALUES (3, N'Phim cách nhiệt', 1)
GO
INSERT [dbo].[danh_muc_phu_kien] ([id], [ten_danh_muc], [dang_hoat_dong]) VALUES (4, N'Thảm sàn cao cấp', 1)
GO
SET IDENTITY_INSERT [dbo].[danh_muc_phu_kien] OFF
GO
SET IDENTITY_INSERT [dbo].[don_hang_phu_kien] ON 

GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (1, N'#AH-ACC-2026-9952', 5, 2, N'Nguyễn Văn A', N'0912345678', N'Hà Nội - Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh', N'Giao giờ hành chính lên tầng 20 Landmark 81', CAST(N'2026-11-07T22:58:58.0000000' AS DateTime2), N'VNPAY', CAST(0 AS Decimal(18, 0)), CAST(500000 AS Decimal(18, 0)), N'AutoHub Express Delivery', N'AH-VNP-EXPRESS-9952', NULL, CAST(24400000 AS Decimal(18, 0)), CAST(N'2026-11-07T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-07T22:58:58.0000000' AS DateTime2), N'PAID')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (2, N'#AH-ACC-2026-7810', 5, NULL, N'Nguyễn Văn A', N'0912345678', N'TP.HCM - Tòa Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh', N'Gọi trước 15 phút khi giao hàng', CAST(N'2026-10-31T22:58:58.0000000' AS DateTime2), N'VNPAY', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'VNPost Nhanh', N'VNP-VNPOST-781044', CAST(N'2026-11-03T22:58:58.0000000' AS DateTime2), CAST(12200000 AS Decimal(18, 0)), CAST(N'2026-10-31T22:58:58.0000000' AS DateTime2), CAST(N'2026-10-31T22:58:58.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (3, N'#ORD-10892', 7, NULL, N'Nguyễn Thị Hương', N'0912334556', N'Đà Nẵng - 158 Đường số 7, KDC Trung Sơn, Bình Chánh, TP. Hồ Chí Minh', N'Kiểm tra đúng đời xe trước khi bàn giao', CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), N'VNPAY', CAST(30000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Express', N'GHTK-ORD-10892', CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), CAST(2830000 AS Decimal(18, 0)), CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (4, N'#ORD-10775', 6, NULL, N'Phan Văn Hậu', N'0988665443', N'Hà Nội - 88 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', N'Hàng điện tử xin vui lòng vận chuyển cẩn thận', CAST(N'2026-11-05T22:58:58.0000000' AS DateTime2), N'VNPAY', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VTP-ORD-10775', CAST(N'2026-11-06T22:58:58.0000000' AS DateTime2), CAST(6500000 AS Decimal(18, 0)), CAST(N'2026-11-05T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-05T22:58:58.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (5, N'#AH-ACC-2026-1001', 6, NULL, N'Khách Hàng VIP 1', N'0919090126', N'TP.HCM - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-11-13T13:51:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN85010164', NULL, CAST(25250000 AS Decimal(18, 0)), CAST(N'2026-11-13T13:56:00.0000000' AS DateTime2), CAST(N'2026-11-13T13:56:00.0000000' AS DateTime2), N'PAID')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (6, N'#AH-ACC-2026-1002', 7, NULL, N'Khách Hàng VIP 2', N'0914971598', N'Đà Nẵng - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-11-12T10:20:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN37968785', NULL, CAST(108250000 AS Decimal(18, 0)), CAST(N'2026-11-12T10:25:00.0000000' AS DateTime2), CAST(N'2026-11-12T10:25:00.0000000' AS DateTime2), N'SHIPPING')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (7, N'#AH-ACC-2026-1003', 8, NULL, N'Khách Hàng VIP 3', N'0915651810', N'Hà Nội - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-11-11T20:49:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN59674756', NULL, CAST(47250000 AS Decimal(18, 0)), CAST(N'2026-11-11T20:54:00.0000000' AS DateTime2), CAST(N'2026-11-11T20:54:00.0000000' AS DateTime2), N'SHIPPING')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (8, N'#AH-ACC-2026-1004', 9, NULL, N'Khách Hàng VIP 4', N'0919572418', N'TP.HCM - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-11-10T13:55:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN11038966', NULL, CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-11-10T14:00:00.0000000' AS DateTime2), CAST(N'2026-11-10T14:00:00.0000000' AS DateTime2), N'SHIPPING')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (9, N'#AH-ACC-2026-1005', 5, NULL, N'Khách Hàng VIP 5', N'0913935236', N'Đà Nẵng - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-11-09T08:35:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN19602188', CAST(N'2026-11-13T08:35:00.0000000' AS DateTime2), CAST(34250000 AS Decimal(18, 0)), CAST(N'2026-11-09T08:40:00.0000000' AS DateTime2), CAST(N'2026-11-09T08:40:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (10, N'#AH-ACC-2026-1006', 6, NULL, N'Khách Hàng VIP 6', N'0915788241', N'Hà Nội - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-11-08T17:42:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN37127288', CAST(N'2026-11-10T17:42:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-11-08T17:47:00.0000000' AS DateTime2), CAST(N'2026-11-08T17:47:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (11, N'#AH-ACC-2026-1007', 7, NULL, N'Khách Hàng VIP 7', N'0918458346', N'TP.HCM - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-11-07T20:56:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN83286066', CAST(N'2026-11-11T20:56:00.0000000' AS DateTime2), CAST(33250000 AS Decimal(18, 0)), CAST(N'2026-11-07T21:01:00.0000000' AS DateTime2), CAST(N'2026-11-07T21:01:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (12, N'#AH-ACC-2026-1008', 8, NULL, N'Khách Hàng VIP 8', N'0912198036', N'Đà Nẵng - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-11-06T19:14:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN26473695', CAST(N'2026-11-09T19:14:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-11-06T19:19:00.0000000' AS DateTime2), CAST(N'2026-11-06T19:19:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (13, N'#AH-ACC-2026-1009', 9, NULL, N'Khách Hàng VIP 9', N'0914946400', N'Hà Nội - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-11-05T18:00:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN50119921', CAST(N'2026-11-08T18:00:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-11-05T18:05:00.0000000' AS DateTime2), CAST(N'2026-11-05T18:05:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (14, N'#AH-ACC-2026-1010', 5, NULL, N'Khách Hàng VIP 10', N'0916341708', N'TP.HCM - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-11-05T12:39:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN10047962', CAST(N'2026-11-08T12:39:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-11-05T12:44:00.0000000' AS DateTime2), CAST(N'2026-11-05T12:44:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (15, N'#AH-ACC-2026-1011', 6, NULL, N'Khách Hàng VIP 11', N'0915707814', N'Đà Nẵng - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-11-04T20:29:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN92516480', CAST(N'2026-11-06T20:29:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-11-04T20:34:00.0000000' AS DateTime2), CAST(N'2026-11-04T20:34:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (16, N'#AH-ACC-2026-1012', 7, NULL, N'Khách Hàng VIP 12', N'0919378742', N'Hà Nội - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-11-03T09:52:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN60430157', CAST(N'2026-11-07T09:52:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-11-03T09:57:00.0000000' AS DateTime2), CAST(N'2026-11-03T09:57:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (17, N'#AH-ACC-2026-1013', 8, NULL, N'Khách Hàng VIP 13', N'0912429142', N'TP.HCM - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-11-02T16:36:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN38631869', CAST(N'2026-11-04T16:36:00.0000000' AS DateTime2), CAST(84250000 AS Decimal(18, 0)), CAST(N'2026-11-02T16:41:00.0000000' AS DateTime2), CAST(N'2026-11-02T16:41:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (18, N'#AH-ACC-2026-1014', 9, NULL, N'Khách Hàng VIP 14', N'0913574977', N'Đà Nẵng - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-11-01T17:40:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN97431518', CAST(N'2026-11-05T17:40:00.0000000' AS DateTime2), CAST(23250000 AS Decimal(18, 0)), CAST(N'2026-11-01T17:45:00.0000000' AS DateTime2), CAST(N'2026-11-01T17:45:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (19, N'#AH-ACC-2026-1015', 5, NULL, N'Khách Hàng VIP 15', N'0919383330', N'Hà Nội - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-31T19:57:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN30413354', CAST(N'2026-11-02T19:57:00.0000000' AS DateTime2), CAST(65250000 AS Decimal(18, 0)), CAST(N'2026-10-31T20:02:00.0000000' AS DateTime2), CAST(N'2026-10-31T20:02:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (20, N'#AH-ACC-2026-1016', 6, NULL, N'Khách Hàng VIP 16', N'0913191367', N'TP.HCM - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-30T17:23:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN45191951', CAST(N'2026-11-02T17:23:00.0000000' AS DateTime2), CAST(47250000 AS Decimal(18, 0)), CAST(N'2026-10-30T17:28:00.0000000' AS DateTime2), CAST(N'2026-10-30T17:28:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (21, N'#AH-ACC-2026-1017', 7, NULL, N'Khách Hàng VIP 17', N'0916102640', N'Đà Nẵng - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-29T15:22:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN73874040', CAST(N'2026-11-02T15:22:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-10-29T15:27:00.0000000' AS DateTime2), CAST(N'2026-10-29T15:27:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (22, N'#AH-ACC-2026-1018', 8, NULL, N'Khách Hàng VIP 18', N'0915744662', N'Hà Nội - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-28T08:51:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN38615580', CAST(N'2026-10-31T08:51:00.0000000' AS DateTime2), CAST(84250000 AS Decimal(18, 0)), CAST(N'2026-10-28T08:56:00.0000000' AS DateTime2), CAST(N'2026-10-28T08:56:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (23, N'#AH-ACC-2026-1019', 9, NULL, N'Khách Hàng VIP 19', N'0918807673', N'TP.HCM - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-28T09:25:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN72024204', CAST(N'2026-11-01T09:25:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-10-28T09:30:00.0000000' AS DateTime2), CAST(N'2026-10-28T09:30:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (24, N'#AH-ACC-2026-1020', 5, NULL, N'Khách Hàng VIP 20', N'0916186914', N'Đà Nẵng - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-27T16:58:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN37091393', CAST(N'2026-10-31T16:58:00.0000000' AS DateTime2), CAST(108250000 AS Decimal(18, 0)), CAST(N'2026-10-27T17:03:00.0000000' AS DateTime2), CAST(N'2026-10-27T17:03:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (25, N'#AH-ACC-2026-1021', 6, NULL, N'Khách Hàng VIP 21', N'0911538523', N'Hà Nội - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-26T11:00:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN60535194', CAST(N'2026-10-30T11:00:00.0000000' AS DateTime2), CAST(48250000 AS Decimal(18, 0)), CAST(N'2026-10-26T11:05:00.0000000' AS DateTime2), CAST(N'2026-10-26T11:05:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (26, N'#AH-ACC-2026-1022', 7, NULL, N'Khách Hàng VIP 22', N'0915430181', N'TP.HCM - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-25T14:44:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN40195652', CAST(N'2026-10-29T14:44:00.0000000' AS DateTime2), CAST(108250000 AS Decimal(18, 0)), CAST(N'2026-10-25T14:49:00.0000000' AS DateTime2), CAST(N'2026-10-25T14:49:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (27, N'#AH-ACC-2026-1023', 8, NULL, N'Khách Hàng VIP 23', N'0911128843', N'Đà Nẵng - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-24T20:22:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN44353430', CAST(N'2026-10-27T20:22:00.0000000' AS DateTime2), CAST(85250000 AS Decimal(18, 0)), CAST(N'2026-10-24T20:27:00.0000000' AS DateTime2), CAST(N'2026-10-24T20:27:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (28, N'#AH-ACC-2026-1024', 9, NULL, N'Khách Hàng VIP 24', N'0916457214', N'Hà Nội - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-23T07:29:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN63228555', CAST(N'2026-10-25T07:29:00.0000000' AS DateTime2), CAST(48250000 AS Decimal(18, 0)), CAST(N'2026-10-23T07:34:00.0000000' AS DateTime2), CAST(N'2026-10-23T07:34:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (29, N'#AH-ACC-2026-1025', 5, NULL, N'Khách Hàng VIP 25', N'0919566390', N'TP.HCM - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-22T10:38:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN18660222', CAST(N'2026-10-25T10:38:00.0000000' AS DateTime2), CAST(65250000 AS Decimal(18, 0)), CAST(N'2026-10-22T10:43:00.0000000' AS DateTime2), CAST(N'2026-10-22T10:43:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (30, N'#AH-ACC-2026-1026', 6, NULL, N'Khách Hàng VIP 26', N'0912584703', N'Đà Nẵng - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-21T14:18:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN38716241', CAST(N'2026-10-23T14:18:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-10-21T14:23:00.0000000' AS DateTime2), CAST(N'2026-10-21T14:23:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (31, N'#AH-ACC-2026-1027', 7, NULL, N'Khách Hàng VIP 27', N'0919945997', N'Hà Nội - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-20T07:40:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN96803445', CAST(N'2026-10-22T07:40:00.0000000' AS DateTime2), CAST(47250000 AS Decimal(18, 0)), CAST(N'2026-10-20T07:45:00.0000000' AS DateTime2), CAST(N'2026-10-20T07:45:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (32, N'#AH-ACC-2026-1028', 8, NULL, N'Khách Hàng VIP 28', N'0911091153', N'TP.HCM - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-20T15:47:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN61645734', CAST(N'2026-10-22T15:47:00.0000000' AS DateTime2), CAST(33250000 AS Decimal(18, 0)), CAST(N'2026-10-20T15:52:00.0000000' AS DateTime2), CAST(N'2026-10-20T15:52:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (33, N'#AH-ACC-2026-1029', 9, NULL, N'Khách Hàng VIP 29', N'0911521545', N'Đà Nẵng - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-19T09:49:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN96248440', CAST(N'2026-10-23T09:49:00.0000000' AS DateTime2), CAST(25250000 AS Decimal(18, 0)), CAST(N'2026-10-19T09:54:00.0000000' AS DateTime2), CAST(N'2026-10-19T09:54:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (34, N'#AH-ACC-2026-1030', 5, NULL, N'Khách Hàng VIP 30', N'0915761276', N'Hà Nội - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-18T18:18:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN97521450', CAST(N'2026-10-22T18:18:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-10-18T18:23:00.0000000' AS DateTime2), CAST(N'2026-10-18T18:23:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (35, N'#AH-ACC-2026-1031', 6, NULL, N'Khách Hàng VIP 31', N'0918726673', N'TP.HCM - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-17T20:22:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN73346657', CAST(N'2026-10-19T20:22:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-10-17T20:27:00.0000000' AS DateTime2), CAST(N'2026-10-17T20:27:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (36, N'#AH-ACC-2026-1032', 7, NULL, N'Khách Hàng VIP 32', N'0919099568', N'Đà Nẵng - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-16T09:23:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN55238715', CAST(N'2026-10-19T09:23:00.0000000' AS DateTime2), CAST(25250000 AS Decimal(18, 0)), CAST(N'2026-10-16T09:28:00.0000000' AS DateTime2), CAST(N'2026-10-16T09:28:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (37, N'#AH-ACC-2026-1033', 8, NULL, N'Khách Hàng VIP 33', N'0917239240', N'Hà Nội - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-15T14:23:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN97695628', CAST(N'2026-10-17T14:23:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-10-15T14:28:00.0000000' AS DateTime2), CAST(N'2026-10-15T14:28:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (38, N'#AH-ACC-2026-1034', 9, NULL, N'Khách Hàng VIP 34', N'0918321519', N'TP.HCM - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-14T18:37:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN35040039', CAST(N'2026-10-18T18:37:00.0000000' AS DateTime2), CAST(35250000 AS Decimal(18, 0)), CAST(N'2026-10-14T18:42:00.0000000' AS DateTime2), CAST(N'2026-10-14T18:42:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (39, N'#AH-ACC-2026-1035', 5, NULL, N'Khách Hàng VIP 35', N'0912901326', N'Đà Nẵng - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-13T15:31:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN50684713', CAST(N'2026-10-16T15:31:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-10-13T15:36:00.0000000' AS DateTime2), CAST(N'2026-10-13T15:36:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (40, N'#AH-ACC-2026-1036', 6, NULL, N'Khách Hàng VIP 36', N'0918542188', N'Hà Nội - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-12T15:32:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN75328485', CAST(N'2026-10-15T15:32:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-10-12T15:37:00.0000000' AS DateTime2), CAST(N'2026-10-12T15:37:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (41, N'#AH-ACC-2026-1037', 7, NULL, N'Khách Hàng VIP 37', N'0911418957', N'TP.HCM - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-12T19:32:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN35759083', CAST(N'2026-10-14T19:32:00.0000000' AS DateTime2), CAST(85250000 AS Decimal(18, 0)), CAST(N'2026-10-12T19:37:00.0000000' AS DateTime2), CAST(N'2026-10-12T19:37:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (42, N'#AH-ACC-2026-1038', 8, NULL, N'Khách Hàng VIP 38', N'0917693982', N'Đà Nẵng - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-11T10:17:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN85873029', CAST(N'2026-10-13T10:17:00.0000000' AS DateTime2), CAST(108250000 AS Decimal(18, 0)), CAST(N'2026-10-11T10:22:00.0000000' AS DateTime2), CAST(N'2026-10-11T10:22:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (43, N'#AH-ACC-2026-1039', 9, NULL, N'Khách Hàng VIP 39', N'0918275719', N'Hà Nội - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-10T19:29:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN17599059', CAST(N'2026-10-13T19:29:00.0000000' AS DateTime2), CAST(83250000 AS Decimal(18, 0)), CAST(N'2026-10-10T19:34:00.0000000' AS DateTime2), CAST(N'2026-10-10T19:34:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (44, N'#AH-ACC-2026-1040', 5, NULL, N'Khách Hàng VIP 40', N'0919660657', N'TP.HCM - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-09T12:42:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN56536847', CAST(N'2026-10-12T12:42:00.0000000' AS DateTime2), CAST(34250000 AS Decimal(18, 0)), CAST(N'2026-10-09T12:47:00.0000000' AS DateTime2), CAST(N'2026-10-09T12:47:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (45, N'#AH-ACC-2026-1041', 6, NULL, N'Khách Hàng VIP 41', N'0918309879', N'Đà Nẵng - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-08T11:32:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN48728924', CAST(N'2026-10-12T11:32:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-10-08T11:37:00.0000000' AS DateTime2), CAST(N'2026-10-08T11:37:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (46, N'#AH-ACC-2026-1042', 7, NULL, N'Khách Hàng VIP 42', N'0918625979', N'Hà Nội - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-07T09:11:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN37711443', CAST(N'2026-10-11T09:11:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-10-07T09:16:00.0000000' AS DateTime2), CAST(N'2026-10-07T09:16:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (47, N'#AH-ACC-2026-1043', 8, NULL, N'Khách Hàng VIP 43', N'0911135066', N'TP.HCM - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-06T14:34:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN10643960', CAST(N'2026-10-09T14:34:00.0000000' AS DateTime2), CAST(35250000 AS Decimal(18, 0)), CAST(N'2026-10-06T14:39:00.0000000' AS DateTime2), CAST(N'2026-10-06T14:39:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (48, N'#AH-ACC-2026-1044', 9, NULL, N'Khách Hàng VIP 44', N'0915153669', N'Đà Nẵng - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-05T08:11:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN38143913', CAST(N'2026-10-07T08:11:00.0000000' AS DateTime2), CAST(47250000 AS Decimal(18, 0)), CAST(N'2026-10-05T08:16:00.0000000' AS DateTime2), CAST(N'2026-10-05T08:16:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (49, N'#AH-ACC-2026-1045', 5, NULL, N'Khách Hàng VIP 45', N'0919049503', N'Hà Nội - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-10-04T12:19:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN98402466', CAST(N'2026-10-07T12:19:00.0000000' AS DateTime2), CAST(46250000 AS Decimal(18, 0)), CAST(N'2026-10-04T12:24:00.0000000' AS DateTime2), CAST(N'2026-10-04T12:24:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (50, N'#AH-ACC-2026-1046', 6, NULL, N'Khách Hàng VIP 46', N'0916956130', N'TP.HCM - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-04T12:11:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN67029519', CAST(N'2026-10-08T12:11:00.0000000' AS DateTime2), CAST(47250000 AS Decimal(18, 0)), CAST(N'2026-10-04T12:16:00.0000000' AS DateTime2), CAST(N'2026-10-04T12:16:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (51, N'#AH-ACC-2026-1047', 7, NULL, N'Khách Hàng VIP 47', N'0914020359', N'Đà Nẵng - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-10-03T13:37:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN12967343', CAST(N'2026-10-07T13:37:00.0000000' AS DateTime2), CAST(46250000 AS Decimal(18, 0)), CAST(N'2026-10-03T13:42:00.0000000' AS DateTime2), CAST(N'2026-10-03T13:42:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (52, N'#AH-ACC-2026-1048', 8, NULL, N'Khách Hàng VIP 48', N'0912239104', N'Hà Nội - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-02T11:22:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN10490134', CAST(N'2026-10-04T11:22:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-10-02T11:27:00.0000000' AS DateTime2), CAST(N'2026-10-02T11:27:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (53, N'#AH-ACC-2026-1049', 9, NULL, N'Khách Hàng VIP 49', N'0916565855', N'TP.HCM - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-10-01T18:25:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN85423776', CAST(N'2026-10-04T18:25:00.0000000' AS DateTime2), CAST(85250000 AS Decimal(18, 0)), CAST(N'2026-10-01T18:30:00.0000000' AS DateTime2), CAST(N'2026-10-01T18:30:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (54, N'#AH-ACC-2026-1050', 5, NULL, N'Khách Hàng VIP 50', N'0917969784', N'Đà Nẵng - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-30T13:10:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN51124319', CAST(N'2026-10-04T13:10:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-09-30T13:15:00.0000000' AS DateTime2), CAST(N'2026-09-30T13:15:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (55, N'#AH-ACC-2026-1051', 6, NULL, N'Khách Hàng VIP 51', N'0913294309', N'Hà Nội - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-29T09:42:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN17567072', CAST(N'2026-10-03T09:42:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-09-29T09:47:00.0000000' AS DateTime2), CAST(N'2026-09-29T09:47:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (56, N'#AH-ACC-2026-1052', 7, NULL, N'Khách Hàng VIP 52', N'0916526322', N'TP.HCM - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-28T12:42:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN64767684', CAST(N'2026-09-30T12:42:00.0000000' AS DateTime2), CAST(83250000 AS Decimal(18, 0)), CAST(N'2026-09-28T12:47:00.0000000' AS DateTime2), CAST(N'2026-09-28T12:47:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (57, N'#AH-ACC-2026-1053', 8, NULL, N'Khách Hàng VIP 53', N'0919942798', N'Đà Nẵng - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-27T20:30:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN73028177', CAST(N'2026-10-01T20:30:00.0000000' AS DateTime2), CAST(46250000 AS Decimal(18, 0)), CAST(N'2026-09-27T20:35:00.0000000' AS DateTime2), CAST(N'2026-09-27T20:35:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (58, N'#AH-ACC-2026-1054', 9, NULL, N'Khách Hàng VIP 54', N'0919300178', N'Hà Nội - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-26T13:25:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN75667469', CAST(N'2026-09-29T13:25:00.0000000' AS DateTime2), CAST(108250000 AS Decimal(18, 0)), CAST(N'2026-09-26T13:30:00.0000000' AS DateTime2), CAST(N'2026-09-26T13:30:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (59, N'#AH-ACC-2026-1055', 5, NULL, N'Khách Hàng VIP 55', N'0916784358', N'TP.HCM - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-26T10:52:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN14175781', CAST(N'2026-09-30T10:52:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-09-26T10:57:00.0000000' AS DateTime2), CAST(N'2026-09-26T10:57:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (60, N'#AH-ACC-2026-1056', 6, NULL, N'Khách Hàng VIP 56', N'0918288953', N'Đà Nẵng - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-25T16:52:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN82675391', CAST(N'2026-09-29T16:52:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-09-25T16:57:00.0000000' AS DateTime2), CAST(N'2026-09-25T16:57:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (61, N'#AH-ACC-2026-1057', 7, NULL, N'Khách Hàng VIP 57', N'0912258037', N'Hà Nội - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-24T13:53:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN69650460', CAST(N'2026-09-26T13:53:00.0000000' AS DateTime2), CAST(65250000 AS Decimal(18, 0)), CAST(N'2026-09-24T13:58:00.0000000' AS DateTime2), CAST(N'2026-09-24T13:58:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (62, N'#AH-ACC-2026-1058', 8, NULL, N'Khách Hàng VIP 58', N'0914410579', N'TP.HCM - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-23T12:38:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN96076327', CAST(N'2026-09-26T12:38:00.0000000' AS DateTime2), CAST(83250000 AS Decimal(18, 0)), CAST(N'2026-09-23T12:43:00.0000000' AS DateTime2), CAST(N'2026-09-23T12:43:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (63, N'#AH-ACC-2026-1059', 9, NULL, N'Khách Hàng VIP 59', N'0912585698', N'Đà Nẵng - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-22T08:50:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN10411529', CAST(N'2026-09-25T08:50:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-09-22T08:55:00.0000000' AS DateTime2), CAST(N'2026-09-22T08:55:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (64, N'#AH-ACC-2026-1060', 5, NULL, N'Khách Hàng VIP 60', N'0913328342', N'Hà Nội - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-21T20:18:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN73515774', CAST(N'2026-09-25T20:18:00.0000000' AS DateTime2), CAST(47250000 AS Decimal(18, 0)), CAST(N'2026-09-21T20:23:00.0000000' AS DateTime2), CAST(N'2026-09-21T20:23:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (65, N'#AH-ACC-2026-1061', 6, NULL, N'Khách Hàng VIP 61', N'0914086673', N'TP.HCM - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-20T10:37:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN29175768', CAST(N'2026-09-23T10:37:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-09-20T10:42:00.0000000' AS DateTime2), CAST(N'2026-09-20T10:42:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (66, N'#AH-ACC-2026-1062', 7, NULL, N'Khách Hàng VIP 62', N'0918787972', N'Đà Nẵng - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-19T15:30:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN87133794', CAST(N'2026-09-23T15:30:00.0000000' AS DateTime2), CAST(108250000 AS Decimal(18, 0)), CAST(N'2026-09-19T15:35:00.0000000' AS DateTime2), CAST(N'2026-09-19T15:35:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (67, N'#AH-ACC-2026-1063', 8, NULL, N'Khách Hàng VIP 63', N'0912752761', N'Hà Nội - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-18T19:27:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN98816560', CAST(N'2026-09-20T19:27:00.0000000' AS DateTime2), CAST(65250000 AS Decimal(18, 0)), CAST(N'2026-09-18T19:32:00.0000000' AS DateTime2), CAST(N'2026-09-18T19:32:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (68, N'#AH-ACC-2026-1064', 9, NULL, N'Khách Hàng VIP 64', N'0913007393', N'TP.HCM - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-18T10:34:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN33119421', CAST(N'2026-09-20T10:34:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-09-18T10:39:00.0000000' AS DateTime2), CAST(N'2026-09-18T10:39:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (69, N'#AH-ACC-2026-1065', 5, NULL, N'Khách Hàng VIP 65', N'0912451534', N'Đà Nẵng - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-17T12:27:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN91053883', CAST(N'2026-09-20T12:27:00.0000000' AS DateTime2), CAST(33250000 AS Decimal(18, 0)), CAST(N'2026-09-17T12:32:00.0000000' AS DateTime2), CAST(N'2026-09-17T12:32:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (70, N'#AH-ACC-2026-1066', 6, NULL, N'Khách Hàng VIP 66', N'0915997778', N'Hà Nội - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-16T17:22:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN97345981', CAST(N'2026-09-18T17:22:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-09-16T17:27:00.0000000' AS DateTime2), CAST(N'2026-09-16T17:27:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (71, N'#AH-ACC-2026-1067', 7, NULL, N'Khách Hàng VIP 67', N'0912503324', N'TP.HCM - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-15T12:23:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN48751211', CAST(N'2026-09-19T12:23:00.0000000' AS DateTime2), CAST(33250000 AS Decimal(18, 0)), CAST(N'2026-09-15T12:28:00.0000000' AS DateTime2), CAST(N'2026-09-15T12:28:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (72, N'#AH-ACC-2026-1068', 8, NULL, N'Khách Hàng VIP 68', N'0916257610', N'Đà Nẵng - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-14T09:43:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN44737663', CAST(N'2026-09-18T09:43:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-09-14T09:48:00.0000000' AS DateTime2), CAST(N'2026-09-14T09:48:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (73, N'#AH-ACC-2026-1069', 9, NULL, N'Khách Hàng VIP 69', N'0911338087', N'Hà Nội - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-13T13:34:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN94895148', CAST(N'2026-09-15T13:34:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-09-13T13:39:00.0000000' AS DateTime2), CAST(N'2026-09-13T13:39:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (74, N'#AH-ACC-2026-1070', 5, NULL, N'Khách Hàng VIP 70', N'0915612561', N'TP.HCM - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-12T12:16:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN70390602', CAST(N'2026-09-14T12:16:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-09-12T12:21:00.0000000' AS DateTime2), CAST(N'2026-09-12T12:21:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (75, N'#AH-ACC-2026-1071', 6, NULL, N'Khách Hàng VIP 71', N'0916263451', N'Đà Nẵng - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-11T12:59:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN54722992', CAST(N'2026-09-13T12:59:00.0000000' AS DateTime2), CAST(109250000 AS Decimal(18, 0)), CAST(N'2026-09-11T13:04:00.0000000' AS DateTime2), CAST(N'2026-09-11T13:04:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (76, N'#AH-ACC-2026-1072', 7, NULL, N'Khách Hàng VIP 72', N'0911168306', N'Hà Nội - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-10T19:14:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN48211207', CAST(N'2026-09-12T19:14:00.0000000' AS DateTime2), CAST(25250000 AS Decimal(18, 0)), CAST(N'2026-09-10T19:19:00.0000000' AS DateTime2), CAST(N'2026-09-10T19:19:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (77, N'#AH-ACC-2026-1073', 8, NULL, N'Khách Hàng VIP 73', N'0912706830', N'TP.HCM - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-10T10:24:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'Viettel Post', N'VN78489669', CAST(N'2026-09-13T10:24:00.0000000' AS DateTime2), CAST(34250000 AS Decimal(18, 0)), CAST(N'2026-09-10T10:29:00.0000000' AS DateTime2), CAST(N'2026-09-10T10:29:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (78, N'#AH-ACC-2026-1074', 9, NULL, N'Khách Hàng VIP 74', N'0912843298', N'Đà Nẵng - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-09T15:47:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN13519313', CAST(N'2026-09-12T15:47:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-09-09T15:52:00.0000000' AS DateTime2), CAST(N'2026-09-09T15:52:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (79, N'#AH-ACC-2026-1075', 5, NULL, N'Khách Hàng VIP 75', N'0918500711', N'Hà Nội - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-08T10:50:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN42977787', CAST(N'2026-09-11T10:50:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-09-08T10:55:00.0000000' AS DateTime2), CAST(N'2026-09-08T10:55:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (80, N'#AH-ACC-2026-1076', 6, NULL, N'Khách Hàng VIP 76', N'0918092168', N'TP.HCM - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-07T16:37:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN39519364', CAST(N'2026-09-10T16:37:00.0000000' AS DateTime2), CAST(46250000 AS Decimal(18, 0)), CAST(N'2026-09-07T16:42:00.0000000' AS DateTime2), CAST(N'2026-09-07T16:42:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (81, N'#AH-ACC-2026-1077', 7, NULL, N'Khách Hàng VIP 77', N'0917844026', N'Đà Nẵng - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-06T12:35:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN45524439', CAST(N'2026-09-09T12:35:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-09-06T12:40:00.0000000' AS DateTime2), CAST(N'2026-09-06T12:40:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (82, N'#AH-ACC-2026-1078', 8, NULL, N'Khách Hàng VIP 78', N'0913713659', N'Hà Nội - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-05T12:46:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN88410328', CAST(N'2026-09-09T12:46:00.0000000' AS DateTime2), CAST(24250000 AS Decimal(18, 0)), CAST(N'2026-09-05T12:51:00.0000000' AS DateTime2), CAST(N'2026-09-05T12:51:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (83, N'#AH-ACC-2026-1079', 9, NULL, N'Khách Hàng VIP 79', N'0912569270', N'TP.HCM - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-09-04T18:23:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN31005445', CAST(N'2026-09-06T18:23:00.0000000' AS DateTime2), CAST(35250000 AS Decimal(18, 0)), CAST(N'2026-09-04T18:28:00.0000000' AS DateTime2), CAST(N'2026-09-04T18:28:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (84, N'#AH-ACC-2026-1080', 5, NULL, N'Khách Hàng VIP 80', N'0919636292', N'Đà Nẵng - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-03T10:40:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN99674396', CAST(N'2026-09-06T10:40:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-09-03T10:45:00.0000000' AS DateTime2), CAST(N'2026-09-03T10:45:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (85, N'#AH-ACC-2026-1081', 6, NULL, N'Khách Hàng VIP 81', N'0916517321', N'Hà Nội - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-02T10:53:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN17501054', CAST(N'2026-09-05T10:53:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-09-02T10:58:00.0000000' AS DateTime2), CAST(N'2026-09-02T10:58:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (86, N'#AH-ACC-2026-1082', 7, NULL, N'Khách Hàng VIP 82', N'0911121540', N'TP.HCM - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-09-02T17:52:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN48297737', CAST(N'2026-09-04T17:52:00.0000000' AS DateTime2), CAST(48250000 AS Decimal(18, 0)), CAST(N'2026-09-02T17:57:00.0000000' AS DateTime2), CAST(N'2026-09-02T17:57:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (87, N'#AH-ACC-2026-1083', 8, NULL, N'Khách Hàng VIP 83', N'0914526891', N'Đà Nẵng - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-09-01T09:29:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN62612611', CAST(N'2026-09-04T09:29:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-09-01T09:34:00.0000000' AS DateTime2), CAST(N'2026-09-01T09:34:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (88, N'#AH-ACC-2026-1084', 9, NULL, N'Khách Hàng VIP 84', N'0918039293', N'Hà Nội - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-31T18:34:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN26094979', CAST(N'2026-09-02T18:34:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-08-31T18:39:00.0000000' AS DateTime2), CAST(N'2026-08-31T18:39:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (89, N'#AH-ACC-2026-1085', 5, NULL, N'Khách Hàng VIP 85', N'0919326871', N'TP.HCM - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-30T14:40:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN70846779', CAST(N'2026-09-03T14:40:00.0000000' AS DateTime2), CAST(65250000 AS Decimal(18, 0)), CAST(N'2026-08-30T14:45:00.0000000' AS DateTime2), CAST(N'2026-08-30T14:45:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (90, N'#AH-ACC-2026-1086', 6, NULL, N'Khách Hàng VIP 86', N'0918622259', N'Đà Nẵng - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-08-29T13:00:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN67464311', CAST(N'2026-08-31T13:00:00.0000000' AS DateTime2), CAST(46250000 AS Decimal(18, 0)), CAST(N'2026-08-29T13:05:00.0000000' AS DateTime2), CAST(N'2026-08-29T13:05:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (91, N'#AH-ACC-2026-1087', 7, NULL, N'Khách Hàng VIP 87', N'0912739730', N'Hà Nội - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-08-28T14:21:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHN Express', N'VN51425594', CAST(N'2026-09-01T14:21:00.0000000' AS DateTime2), CAST(65250000 AS Decimal(18, 0)), CAST(N'2026-08-28T14:26:00.0000000' AS DateTime2), CAST(N'2026-08-28T14:26:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (92, N'#AH-ACC-2026-1088', 8, NULL, N'Khách Hàng VIP 88', N'0911650848', N'TP.HCM - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-08-27T19:32:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN59624599', CAST(N'2026-08-29T19:32:00.0000000' AS DateTime2), CAST(83250000 AS Decimal(18, 0)), CAST(N'2026-08-27T19:37:00.0000000' AS DateTime2), CAST(N'2026-08-27T19:37:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (93, N'#AH-ACC-2026-1089', 9, NULL, N'Khách Hàng VIP 89', N'0911620811', N'Đà Nẵng - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-08-26T08:44:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN94254752', CAST(N'2026-08-29T08:44:00.0000000' AS DateTime2), CAST(84250000 AS Decimal(18, 0)), CAST(N'2026-08-26T08:49:00.0000000' AS DateTime2), CAST(N'2026-08-26T08:49:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (94, N'#AH-ACC-2026-1090', 5, NULL, N'Khách Hàng VIP 90', N'0914923537', N'Hà Nội - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-08-25T07:59:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN91059076', CAST(N'2026-08-29T07:59:00.0000000' AS DateTime2), CAST(33250000 AS Decimal(18, 0)), CAST(N'2026-08-25T08:04:00.0000000' AS DateTime2), CAST(N'2026-08-25T08:04:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (95, N'#AH-ACC-2026-1091', 6, NULL, N'Khách Hàng VIP 91', N'0916050571', N'TP.HCM - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-25T14:15:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN99121841', CAST(N'2026-08-27T14:15:00.0000000' AS DateTime2), CAST(23250000 AS Decimal(18, 0)), CAST(N'2026-08-25T14:20:00.0000000' AS DateTime2), CAST(N'2026-08-25T14:20:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (96, N'#AH-ACC-2026-1092', 7, NULL, N'Khách Hàng VIP 92', N'0917971650', N'Đà Nẵng - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-24T08:49:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN20637326', CAST(N'2026-08-28T08:49:00.0000000' AS DateTime2), CAST(48250000 AS Decimal(18, 0)), CAST(N'2026-08-24T08:54:00.0000000' AS DateTime2), CAST(N'2026-08-24T08:54:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (97, N'#AH-ACC-2026-1093', 8, NULL, N'Khách Hàng VIP 93', N'0914052745', N'Hà Nội - Khu đô thị Phú Mỹ Hưng, Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-23T08:59:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN40621425', CAST(N'2026-08-26T08:59:00.0000000' AS DateTime2), CAST(64250000 AS Decimal(18, 0)), CAST(N'2026-08-23T09:04:00.0000000' AS DateTime2), CAST(N'2026-08-23T09:04:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (98, N'#AH-ACC-2026-1094', 9, NULL, N'Khách Hàng VIP 94', N'0915003754', N'TP.HCM - Số 120 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-08-22T19:14:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN91096644', CAST(N'2026-08-25T19:14:00.0000000' AS DateTime2), CAST(25250000 AS Decimal(18, 0)), CAST(N'2026-08-22T19:19:00.0000000' AS DateTime2), CAST(N'2026-08-22T19:19:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (99, N'#AH-ACC-2026-1095', 5, NULL, N'Khách Hàng VIP 95', N'0913064075', N'Đà Nẵng - Khu Euro Village 1, Trần Hưng Đạo, Sơn Trà, Đà Nẵng', N'Giao hàng giờ hành chính', CAST(N'2026-08-21T12:18:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHTK Fast', N'VN54292265', CAST(N'2026-08-23T12:18:00.0000000' AS DateTime2), CAST(34250000 AS Decimal(18, 0)), CAST(N'2026-08-21T12:23:00.0000000' AS DateTime2), CAST(N'2026-08-21T12:23:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (100, N'#AH-ACC-2026-1096', 6, NULL, N'Khách Hàng VIP 96', N'0914357490', N'Hà Nội - Số 18 Hoàng Đạo Thúy, Trung Hòa, Cầu Giấy, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-08-20T15:56:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(1000000 AS Decimal(18, 0)), N'GHN Express', N'VN25773170', CAST(N'2026-08-23T15:56:00.0000000' AS DateTime2), CAST(34250000 AS Decimal(18, 0)), CAST(N'2026-08-20T16:01:00.0000000' AS DateTime2), CAST(N'2026-08-20T16:01:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (101, N'#AH-ACC-2026-1097', 7, NULL, N'Khách Hàng VIP 97', N'0915154777', N'TP.HCM - Tòa Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-08-19T10:55:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'Viettel Post', N'VN75249850', CAST(N'2026-08-21T10:55:00.0000000' AS DateTime2), CAST(23250000 AS Decimal(18, 0)), CAST(N'2026-08-19T11:00:00.0000000' AS DateTime2), CAST(N'2026-08-19T11:00:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (102, N'#AH-ACC-2026-1098', 8, NULL, N'Khách Hàng VIP 98', N'0916182062', N'Đà Nẵng - Biệt thự Vinhomes Riverside, Long Biên, Hà Nội', N'Giao hàng giờ hành chính', CAST(N'2026-08-18T14:24:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'GHTK Fast', N'VN72204211', CAST(N'2026-08-20T14:24:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-08-18T14:29:00.0000000' AS DateTime2), CAST(N'2026-08-18T14:29:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (103, N'#AH-ACC-2026-1099', 9, NULL, N'Khách Hàng VIP 99', N'0912647679', N'Hà Nội - Tòa Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-17T19:26:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(2000000 AS Decimal(18, 0)), N'GHN Express', N'VN56351505', CAST(N'2026-08-19T19:26:00.0000000' AS DateTime2), CAST(63250000 AS Decimal(18, 0)), CAST(N'2026-08-17T19:31:00.0000000' AS DateTime2), CAST(N'2026-08-17T19:31:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (104, N'#AH-ACC-2026-1100', 5, NULL, N'Khách Hàng VIP 100', N'0914996696', N'TP.HCM - Khu đô thị Sala, Mai Chí Thọ, An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh', N'Giao hàng giờ hành chính', CAST(N'2026-08-16T16:12:00.0000000' AS DateTime2), N'SEPAY', CAST(250000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Viettel Post', N'VN42419888', CAST(N'2026-08-19T16:12:00.0000000' AS DateTime2), CAST(110250000 AS Decimal(18, 0)), CAST(N'2026-08-16T16:17:00.0000000' AS DateTime2), CAST(N'2026-08-16T16:17:00.0000000' AS DateTime2), N'DELIVERED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (108, N'AH-ACC-2026-9202', 5, 7, N'Nguyen Van A', N'0912345678', N'Toa Landmark 81, TP. Ho Chi Minh', N'[Hệ thống tự động hủy: Quá hạn thanh toán 15 phút]', CAST(N'2026-11-14T02:45:41.0000000' AS DateTime2), N'SEPAY', CAST(0 AS Decimal(18, 0)), CAST(500000 AS Decimal(18, 0)), NULL, NULL, NULL, CAST(8000000 AS Decimal(18, 0)), CAST(N'2026-11-14T03:00:41.0000000' AS DateTime2), NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (109, N'AH-ACC-2026-2294', 5, 7, N'Nguyễn Văn A', N'0912345678', N'Tòa nhà Landmark 81, P. 22, Q. Bình Thạnh, TP. Hồ Chí Minh', N'[Hệ thống tự động hủy: Quá hạn thanh toán 15 phút]', CAST(N'2026-11-14T04:00:17.0000000' AS DateTime2), N'SEPAY', CAST(0 AS Decimal(18, 0)), CAST(500000 AS Decimal(18, 0)), NULL, NULL, NULL, CAST(31900000 AS Decimal(18, 0)), CAST(N'2026-11-14T04:15:17.0000000' AS DateTime2), NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (110, N'AH-ACC-2026-7699', 96, NULL, N'Le Hoang Long', N'0911333444', N'72 Le Thanh Ton, Quan 1, TP HCM', N'Giao gio hanh chinh', CAST(N'2026-11-14T07:20:49.0000000' AS DateTime2), N'COD', CAST(35000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), NULL, NULL, NULL, CAST(24935000 AS Decimal(18, 0)), NULL, NULL, N'PENDING')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (111, N'AH-ACC-2026-5318', 9, NULL, N'Nguyễn Văn Trọng', N'0912345679', N'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', NULL, CAST(N'2026-11-14T07:38:11.0000000' AS DateTime2), N'SEPAY', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, NULL, CAST(10300000 AS Decimal(18, 0)), CAST(N'2026-11-14T07:53:11.0000000' AS DateTime2), NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (112, N'AH-ACC-2026-2993', 5, NULL, N'Nguyễn Văn A', N'0912345678', N'Showroom AutoHub TP.HCM', NULL, CAST(N'2026-11-14T07:38:23.0000000' AS DateTime2), N'COD', CAST(150000 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ', NULL, NULL, CAST(28650000 AS Decimal(18, 0)), NULL, NULL, N'PENDING')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (113, N'AH-ACC-2026-8714', 5, NULL, N'Nguyễn Văn A', N'0912345678', N'Showroom AutoHub TP.HCM', NULL, CAST(N'2026-11-14T07:38:29.0000000' AS DateTime2), N'COD', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ', NULL, NULL, CAST(57000000 AS Decimal(18, 0)), NULL, NULL, N'PENDING')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (114, N'AH-ACC-2026-8038', 9, NULL, N'Nguyễn Văn Trọng', N'0912345679', N'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', N'[Hệ thống tự động hủy: Quá hạn thanh toán 15 phút]', CAST(N'2026-11-16T00:02:55.0000000' AS DateTime2), N'SEPAY', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, NULL, CAST(328000000 AS Decimal(18, 0)), CAST(N'2026-11-16T00:17:55.0000000' AS DateTime2), NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (115, N'AH-ACC-2026-1120', 101, NULL, N'Trọng Nguyễn', N'0912345678', N'Chưa có địa chỉ nhận hàng', NULL, CAST(N'2026-11-16T22:28:27.0000000' AS DateTime2), N'SEPAY', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, NULL, CAST(5600000 AS Decimal(18, 0)), CAST(N'2026-11-16T22:43:27.0000000' AS DateTime2), NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (116, N'AH-ACC-2026-3682', 9, NULL, N'Nguyễn Văn Trọng', N'0912345679', N'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', N'[Hệ thống tự động hủy: Quá hạn thanh toán 15 phút]', CAST(N'2026-11-25T07:41:44.0000000' AS DateTime2), N'SEPAY', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, NULL, CAST(950000 AS Decimal(18, 0)), CAST(N'2026-11-25T07:56:44.0000000' AS DateTime2), NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (117, N'AH-ACC-2026-9608', 9, NULL, N'Nguyễn Văn Trọng', N'0912345679', N'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', NULL, CAST(N'2026-11-25T07:43:11.0000000' AS DateTime2), N'COD', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, NULL, CAST(1450000 AS Decimal(18, 0)), NULL, NULL, N'CANCELLED')
GO
INSERT [dbo].[don_hang_phu_kien] ([id], [ma_don_hang], [nguoi_dung_id], [voucher_id], [ho_ten_nguoi_nhan], [so_dien_thoai_nhan], [dia_chi_giao_hang], [ghi_chu_khach_hang], [ngay_dat], [phuong_thuc_thanh_toan], [phi_van_chuyen], [so_tien_giam_voucher], [don_vi_van_chuyen], [ma_van_don], [ngay_giao_hang], [tong_tien], [han_thanh_toan], [thoi_gian_thanh_toan], [trang_thai]) VALUES (118, N'AH-ACC-2026-5614', 9, NULL, N'Nguyễn Văn Trọng', N'0912345679', N'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', NULL, CAST(N'2026-11-25T07:44:02.0000000' AS DateTime2), N'COD', CAST(0 AS Decimal(18, 0)), CAST(0 AS Decimal(18, 0)), N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, NULL, CAST(11200000 AS Decimal(18, 0)), NULL, NULL, N'PENDING')
GO
SET IDENTITY_INSERT [dbo].[don_hang_phu_kien] OFF
GO
SET IDENTITY_INSERT [dbo].[dong_xe] ON 

GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (1, 1, N'AutoHub GT-e', N'E-Sedan', N'Nhập khẩu nguyên chiếc Đức', N'Sedan thể thao điện cao cấp kiến trúc 800V SiC sạc siêu nhanh.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (2, 1, N'AutoHub SUV-e', N'E-SUV', N'Nhập khẩu nguyên chiếc Đức', N'SUV điện đầu bảng 5 chỗ dẫn động 4 bánh Dual-Motor AWD.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (3, 1, N'AutoHub Aero Sedan', N'D-Sedan', N'Nhập khẩu nguyên chiếc', N'Dòng sedan khí động học hiệu năng cao tầm chạy 700km.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (4, 2, N'VinFast VF8', N'D-SUV', N'Sản xuất tại Việt Nam', N'SUV điện thông minh phân khúc D trang bị trợ lý ảo và ADAS cấp độ 2.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (5, 2, N'VinFast VF9', N'E-SUV', N'Sản xuất tại Việt Nam', N'SUV điện cỡ lớn phân khúc E với tùy chọn ghế cơ trưởng thương gia.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (6, 3, N'Hyundai SantaFe', N'D-SUV', N'Lắp ráp trong nước', N'Dòng SUV thế hệ mới thiết kế vuông vức cơ bắp động cơ Turbo Hybrid.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (7, 4, N'Ford Everest', N'D-SUV', N'Nhập khẩu Thái Lan', N'SUV 7 chỗ cơ bắp dẫn động 2 cầu thông minh.', 1)
GO
INSERT [dbo].[dong_xe] ([id], [hang_xe_id], [ten_dong_xe], [phan_khuc], [xuat_xu], [mo_ta], [dang_hoat_dong]) VALUES (9, 5, N'Honda CR-V', N'C-SUV', N'Lắp ráp trong nước', N'Mẫu C-SUV thể thao vận hành hybrid mạnh mẽ, an toàn Honda SENSING', 1)
GO
SET IDENTITY_INSERT [dbo].[dong_xe] OFF
GO
SET IDENTITY_INSERT [dbo].[goi_vay_ngan_hang] ON 

GO
INSERT [dbo].[goi_vay_ngan_hang] ([id], [ten_ngan_hang], [ma_ngan_hang], [logo_url], [lai_suat_nam], [ty_le_vay_toi_da], [thoi_han_toi_da_thang], [dang_hoat_dong], [ghi_chu], [created_at], [updated_at]) VALUES (1, N'Vietcombank', N'VCB', N'https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo_Vietcombank.svg', CAST(6.99 AS Decimal(5, 2)), CAST(80.00 AS Decimal(5, 2)), 96, 1, N'Lãi suất ưu đãi cố định 12 tháng đầu cho khách hàng mua xe AutoHub', CAST(N'2026-11-16T17:56:04.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[goi_vay_ngan_hang] ([id], [ten_ngan_hang], [ma_ngan_hang], [logo_url], [lai_suat_nam], [ty_le_vay_toi_da], [thoi_han_toi_da_thang], [dang_hoat_dong], [ghi_chu], [created_at], [updated_at]) VALUES (2, N'Techcombank', N'TCB', N'https://upload.wikimedia.org/wikipedia/commons/7/7c/Techcombank_logo.png', CAST(7.49 AS Decimal(5, 2)), CAST(85.00 AS Decimal(5, 2)), 96, 1, N'Phê duyệt hồ sơ online siêu tốc trong 30 phút, hạn mức vay cao', CAST(N'2026-11-16T17:56:04.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[goi_vay_ngan_hang] ([id], [ten_ngan_hang], [ma_ngan_hang], [logo_url], [lai_suat_nam], [ty_le_vay_toi_da], [thoi_han_toi_da_thang], [dang_hoat_dong], [ghi_chu], [created_at], [updated_at]) VALUES (3, N'VPBank', N'VPB', N'https://upload.wikimedia.org/wikipedia/commons/e/e4/VPBank_logo.svg', CAST(7.99 AS Decimal(5, 2)), CAST(85.00 AS Decimal(5, 2)), 96, 1, N'Gói vay AutoHub FastTrack giải ngân trong ngày, thủ tục đơn giản', CAST(N'2026-11-16T17:56:04.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[goi_vay_ngan_hang] ([id], [ten_ngan_hang], [ma_ngan_hang], [logo_url], [lai_suat_nam], [ty_le_vay_toi_da], [thoi_han_toi_da_thang], [dang_hoat_dong], [ghi_chu], [created_at], [updated_at]) VALUES (4, N'Shinhan Bank', N'SHB_VN', N'https://upload.wikimedia.org/wikipedia/commons/4/4b/Shinhan_Bank_logo.svg', CAST(6.50 AS Decimal(5, 2)), CAST(80.00 AS Decimal(5, 2)), 84, 1, N'Lãi suất cạnh tranh nhất phân khúc xe điện, biên độ thấp', CAST(N'2026-11-16T17:56:04.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[goi_vay_ngan_hang] ([id], [ten_ngan_hang], [ma_ngan_hang], [logo_url], [lai_suat_nam], [ty_le_vay_toi_da], [thoi_han_toi_da_thang], [dang_hoat_dong], [ghi_chu], [created_at], [updated_at]) VALUES (5, N'BIDV', N'BIDV', N'https://upload.wikimedia.org/wikipedia/vi/6/69/BIDV_logo.svg', CAST(7.20 AS Decimal(5, 2)), CAST(80.00 AS Decimal(5, 2)), 96, 1, N'Gói tín dụng xanh tài trợ dòng xe điện và hybrid bảo vệ môi trường', CAST(N'2026-11-16T17:56:04.0000000' AS DateTime2), NULL)
GO
SET IDENTITY_INSERT [dbo].[goi_vay_ngan_hang] OFF
GO
SET IDENTITY_INSERT [dbo].[giao_dich_thanh_toan] ON 

GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (8, 31, NULL, N'TXN-DEP-2026-CMP001', NULL, N'SEP-DEP-2026-CMP001', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-09T17:00:00.0000000' AS DateTime2), CAST(N'2026-11-09T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (9, 32, NULL, N'TXN-DEP-2026-CMP002', NULL, N'SEP-DEP-2026-CMP002', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-08T15:00:00.0000000' AS DateTime2), CAST(N'2026-11-08T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (10, 33, NULL, N'TXN-DEP-2026-CMP003', NULL, N'SEP-DEP-2026-CMP003', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-07T12:00:00.0000000' AS DateTime2), CAST(N'2026-11-07T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (11, 34, NULL, N'TXN-DEP-2026-CMP004', NULL, N'SEP-DEP-2026-CMP004', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-06T16:00:00.0000000' AS DateTime2), CAST(N'2026-11-06T16:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (12, 35, NULL, N'TXN-DEP-2026-CMP005', NULL, N'SEP-DEP-2026-CMP005', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-05T18:00:00.0000000' AS DateTime2), CAST(N'2026-11-05T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (13, 36, NULL, N'TXN-DEP-2026-CMP006', NULL, N'SEP-DEP-2026-CMP006', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-04T19:00:00.0000000' AS DateTime2), CAST(N'2026-11-04T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (14, 37, NULL, N'TXN-DEP-2026-CMP007', NULL, N'SEP-DEP-2026-CMP007', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-11-03T15:00:00.0000000' AS DateTime2), CAST(N'2026-11-03T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (15, 38, NULL, N'TXN-DEP-2026-CMP008', NULL, N'SEP-DEP-2026-CMP008', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-02T13:00:00.0000000' AS DateTime2), CAST(N'2026-11-02T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (16, 39, NULL, N'TXN-DEP-2026-CMP009', NULL, N'SEP-DEP-2026-CMP009', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-02T12:00:00.0000000' AS DateTime2), CAST(N'2026-11-02T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (17, 40, NULL, N'TXN-DEP-2026-CMP010', NULL, N'SEP-DEP-2026-CMP010', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-01T21:00:00.0000000' AS DateTime2), CAST(N'2026-11-01T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (18, 41, NULL, N'TXN-DEP-2026-CMP011', NULL, N'SEP-DEP-2026-CMP011', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-31T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-31T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (19, 42, NULL, N'TXN-DEP-2026-CMP012', NULL, N'SEP-DEP-2026-CMP012', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-30T21:00:00.0000000' AS DateTime2), CAST(N'2026-10-30T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (20, 43, NULL, N'TXN-DEP-2026-CMP013', NULL, N'SEP-DEP-2026-CMP013', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-29T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-29T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (21, 44, NULL, N'TXN-DEP-2026-CMP014', NULL, N'SEP-DEP-2026-CMP014', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-28T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-28T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (22, 45, NULL, N'TXN-DEP-2026-CMP015', NULL, N'SEP-DEP-2026-CMP015', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-27T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-27T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (23, 46, NULL, N'TXN-DEP-2026-CMP016', NULL, N'SEP-DEP-2026-CMP016', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-26T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-26T20:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (24, 47, NULL, N'TXN-DEP-2026-CMP017', NULL, N'SEP-DEP-2026-CMP017', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-25T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-25T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (25, 48, NULL, N'TXN-DEP-2026-CMP018', NULL, N'SEP-DEP-2026-CMP018', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-25T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-25T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (26, 49, NULL, N'TXN-DEP-2026-CMP019', NULL, N'SEP-DEP-2026-CMP019', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-24T14:00:00.0000000' AS DateTime2), CAST(N'2026-10-24T14:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (27, 50, NULL, N'TXN-DEP-2026-CMP020', NULL, N'SEP-DEP-2026-CMP020', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-23T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-23T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (28, 51, NULL, N'TXN-DEP-2026-CMP021', NULL, N'SEP-DEP-2026-CMP021', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-22T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-22T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (29, 52, NULL, N'TXN-DEP-2026-CMP022', NULL, N'SEP-DEP-2026-CMP022', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-21T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-21T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (30, 53, NULL, N'TXN-DEP-2026-CMP023', NULL, N'SEP-DEP-2026-CMP023', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-20T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-20T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (31, 54, NULL, N'TXN-DEP-2026-CMP024', NULL, N'SEP-DEP-2026-CMP024', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-19T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-19T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (32, 55, NULL, N'TXN-DEP-2026-CMP025', NULL, N'SEP-DEP-2026-CMP025', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-18T21:00:00.0000000' AS DateTime2), CAST(N'2026-10-18T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (33, 56, NULL, N'TXN-DEP-2026-CMP026', NULL, N'SEP-DEP-2026-CMP026', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-18T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-18T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (34, 57, NULL, N'TXN-DEP-2026-CMP027', NULL, N'SEP-DEP-2026-CMP027', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-17T14:00:00.0000000' AS DateTime2), CAST(N'2026-10-17T14:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (35, 58, NULL, N'TXN-DEP-2026-CMP028', NULL, N'SEP-DEP-2026-CMP028', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-16T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-16T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (36, 59, NULL, N'TXN-DEP-2026-CMP029', NULL, N'SEP-DEP-2026-CMP029', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-15T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-15T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (37, 60, NULL, N'TXN-DEP-2026-CMP030', NULL, N'SEP-DEP-2026-CMP030', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-14T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-14T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (38, 61, NULL, N'TXN-DEP-2026-CMP031', NULL, N'SEP-DEP-2026-CMP031', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-13T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-13T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (39, 62, NULL, N'TXN-DEP-2026-CMP032', NULL, N'SEP-DEP-2026-CMP032', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-12T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-12T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (40, 63, NULL, N'TXN-DEP-2026-CMP033', NULL, N'SEP-DEP-2026-CMP033', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-11T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-11T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (41, 64, NULL, N'TXN-DEP-2026-CMP034', NULL, N'SEP-DEP-2026-CMP034', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-10T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-10T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (42, 65, NULL, N'TXN-DEP-2026-CMP035', NULL, N'SEP-DEP-2026-CMP035', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-10T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-10T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (43, 66, NULL, N'TXN-DEP-2026-CMP036', NULL, N'SEP-DEP-2026-CMP036', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-09T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-09T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (44, 67, NULL, N'TXN-DEP-2026-CMP037', NULL, N'SEP-DEP-2026-CMP037', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-08T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-08T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (45, 68, NULL, N'TXN-DEP-2026-CMP038', NULL, N'SEP-DEP-2026-CMP038', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-07T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-07T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (46, 69, NULL, N'TXN-DEP-2026-CMP039', NULL, N'SEP-DEP-2026-CMP039', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-06T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-06T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (47, 70, NULL, N'TXN-DEP-2026-CMP040', NULL, N'SEP-DEP-2026-CMP040', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-05T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-05T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (48, 71, NULL, N'TXN-DEP-2026-CMP041', NULL, N'SEP-DEP-2026-CMP041', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-04T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-04T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (49, 72, NULL, N'TXN-DEP-2026-CMP042', NULL, N'SEP-DEP-2026-CMP042', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-03T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-03T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (50, 73, NULL, N'TXN-DEP-2026-CMP043', NULL, N'SEP-DEP-2026-CMP043', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-02T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-02T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (51, 74, NULL, N'TXN-DEP-2026-CMP044', NULL, N'SEP-DEP-2026-CMP044', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-02T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-02T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (52, 75, NULL, N'TXN-DEP-2026-CMP045', NULL, N'SEP-DEP-2026-CMP045', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-01T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-01T20:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (53, 76, NULL, N'TXN-DEP-2026-CMP046', NULL, N'SEP-DEP-2026-CMP046', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-30T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-30T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (54, 77, NULL, N'TXN-DEP-2026-CMP047', NULL, N'SEP-DEP-2026-CMP047', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-29T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-29T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (55, 78, NULL, N'TXN-DEP-2026-CMP048', NULL, N'SEP-DEP-2026-CMP048', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-28T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-28T16:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (56, 79, NULL, N'TXN-DEP-2026-CMP049', NULL, N'SEP-DEP-2026-CMP049', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-27T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-27T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (57, 80, NULL, N'TXN-DEP-2026-CMP050', NULL, N'SEP-DEP-2026-CMP050', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-26T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-26T14:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (58, 81, NULL, N'TXN-DEP-2026-CMP051', NULL, N'SEP-DEP-2026-CMP051', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-25T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (59, 82, NULL, N'TXN-DEP-2026-CMP052', NULL, N'SEP-DEP-2026-CMP052', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-25T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (60, 83, NULL, N'TXN-DEP-2026-CMP053', NULL, N'SEP-DEP-2026-CMP053', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-24T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-24T14:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (61, 84, NULL, N'TXN-DEP-2026-CMP054', NULL, N'SEP-DEP-2026-CMP054', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-23T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-23T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (62, 85, NULL, N'TXN-DEP-2026-CMP055', NULL, N'SEP-DEP-2026-CMP055', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-22T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-22T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (63, 86, NULL, N'TXN-DEP-2026-CMP056', NULL, N'SEP-DEP-2026-CMP056', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-21T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-21T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (64, 87, NULL, N'TXN-DEP-2026-CMP057', NULL, N'SEP-DEP-2026-CMP057', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-20T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-20T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (65, 88, NULL, N'TXN-DEP-2026-CMP058', NULL, N'SEP-DEP-2026-CMP058', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-19T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-19T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (66, 89, NULL, N'TXN-DEP-2026-CMP059', NULL, N'SEP-DEP-2026-CMP059', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-18T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-18T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (67, 90, NULL, N'TXN-DEP-2026-CMP060', NULL, N'SEP-DEP-2026-CMP060', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-17T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-17T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (68, 91, NULL, N'TXN-DEP-2026-CMP061', NULL, N'SEP-DEP-2026-CMP061', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-17T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-17T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (69, 92, NULL, N'TXN-DEP-2026-CMP062', NULL, N'SEP-DEP-2026-CMP062', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-16T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-16T14:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (70, 93, NULL, N'TXN-DEP-2026-CMP063', NULL, N'SEP-DEP-2026-CMP063', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-15T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-15T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (71, 94, NULL, N'TXN-DEP-2026-CMP064', NULL, N'SEP-DEP-2026-CMP064', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-14T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-14T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (72, 95, NULL, N'TXN-DEP-2026-CMP065', NULL, N'SEP-DEP-2026-CMP065', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-13T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-13T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (73, 96, NULL, N'TXN-DEP-2026-CMP066', NULL, N'SEP-DEP-2026-CMP066', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-12T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-12T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (74, 97, NULL, N'TXN-DEP-2026-CMP067', NULL, N'SEP-DEP-2026-CMP067', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-11T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-11T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (75, 98, NULL, N'TXN-DEP-2026-CMP068', NULL, N'SEP-DEP-2026-CMP068', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-10T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-10T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (76, 99, NULL, N'TXN-DEP-2026-CMP069', NULL, N'SEP-DEP-2026-CMP069', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-09T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-09T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (77, 100, NULL, N'TXN-DEP-2026-CMP070', NULL, N'SEP-DEP-2026-CMP070', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-09T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-09T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (78, 101, NULL, N'TXN-DEP-2026-CMP071', NULL, N'SEP-DEP-2026-CMP071', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-08T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-08T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (79, 102, NULL, N'TXN-DEP-2026-CMP072', NULL, N'SEP-DEP-2026-CMP072', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-07T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-07T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (80, 103, NULL, N'TXN-DEP-2026-CMP073', NULL, N'SEP-DEP-2026-CMP073', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-06T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-06T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (81, 104, NULL, N'TXN-DEP-2026-CMP074', NULL, N'SEP-DEP-2026-CMP074', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-05T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-05T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (82, 105, NULL, N'TXN-DEP-2026-CMP075', NULL, N'SEP-DEP-2026-CMP075', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-04T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-04T16:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (83, 106, NULL, N'TXN-DEP-2026-CMP076', NULL, N'SEP-DEP-2026-CMP076', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-03T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-03T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (84, 107, NULL, N'TXN-DEP-2026-CMP077', NULL, N'SEP-DEP-2026-CMP077', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-02T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-02T19:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (85, 108, NULL, N'TXN-DEP-2026-CMP078', NULL, N'SEP-DEP-2026-CMP078', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-02T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-02T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (86, 109, NULL, N'TXN-DEP-2026-CMP079', NULL, N'SEP-DEP-2026-CMP079', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-01T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-01T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (87, 110, NULL, N'TXN-DEP-2026-CMP080', NULL, N'SEP-DEP-2026-CMP080', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-31T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-31T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (88, 111, NULL, N'TXN-DEP-2026-CMP081', NULL, N'SEP-DEP-2026-CMP081', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-30T16:00:00.0000000' AS DateTime2), CAST(N'2026-08-30T16:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (89, 112, NULL, N'TXN-DEP-2026-CMP082', NULL, N'SEP-DEP-2026-CMP082', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-08-29T17:00:00.0000000' AS DateTime2), CAST(N'2026-08-29T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (90, 113, NULL, N'TXN-DEP-2026-CMP083', NULL, N'SEP-DEP-2026-CMP083', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-08-28T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-28T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (91, 114, NULL, N'TXN-DEP-2026-CMP084', NULL, N'SEP-DEP-2026-CMP084', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-27T13:00:00.0000000' AS DateTime2), CAST(N'2026-08-27T13:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (92, 115, NULL, N'TXN-DEP-2026-CMP085', NULL, N'SEP-DEP-2026-CMP085', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-26T20:00:00.0000000' AS DateTime2), CAST(N'2026-08-26T20:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (93, 116, NULL, N'TXN-DEP-2026-CMP086', NULL, N'SEP-DEP-2026-CMP086', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-25T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-25T12:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (94, 117, NULL, N'TXN-DEP-2026-CMP087', NULL, N'SEP-DEP-2026-CMP087', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-25T20:00:00.0000000' AS DateTime2), CAST(N'2026-08-25T20:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (95, 118, NULL, N'TXN-DEP-2026-CMP088', NULL, N'SEP-DEP-2026-CMP088', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-24T18:00:00.0000000' AS DateTime2), CAST(N'2026-08-24T18:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (96, 119, NULL, N'TXN-DEP-2026-CMP089', NULL, N'SEP-DEP-2026-CMP089', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-23T17:00:00.0000000' AS DateTime2), CAST(N'2026-08-23T17:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (97, 120, NULL, N'TXN-DEP-2026-CMP090', NULL, N'SEP-DEP-2026-CMP090', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-22T16:00:00.0000000' AS DateTime2), CAST(N'2026-08-22T16:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (98, 121, NULL, N'TXN-DEP-2026-CMP091', NULL, N'SEP-DEP-2026-CMP091', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-21T14:00:00.0000000' AS DateTime2), CAST(N'2026-08-21T14:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (99, 122, NULL, N'TXN-DEP-2026-CMP092', NULL, N'SEP-DEP-2026-CMP092', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-20T15:00:00.0000000' AS DateTime2), CAST(N'2026-08-20T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (100, 123, NULL, N'TXN-DEP-2026-CMP093', NULL, N'SEP-DEP-2026-CMP093', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-19T21:00:00.0000000' AS DateTime2), CAST(N'2026-08-19T21:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (101, 124, NULL, N'TXN-DEP-2026-CMP094', NULL, N'SEP-DEP-2026-CMP094', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-18T15:00:00.0000000' AS DateTime2), CAST(N'2026-08-18T15:08:00.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (126, 193, NULL, N'TXN-#DEP-8841', NULL, N'SEP-#DEP-8841', N'THANH_TOAN', N'SEPAY', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-11T01:19:06.0000000' AS DateTime2), CAST(N'2026-11-11T01:24:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (127, 194, NULL, N'TXN-#DEP-8842', NULL, N'SEP-#DEP-8842', N'THANH_TOAN', N'SEPAY', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-11-11T02:34:06.0000000' AS DateTime2), CAST(N'2026-11-11T02:39:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (128, 195, NULL, N'TXN-#DEP-8844', NULL, N'SEP-#DEP-8844', N'THANH_TOAN', N'SEPAY', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-11-11T04:12:06.0000000' AS DateTime2), CAST(N'2026-11-11T04:17:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (129, 196, NULL, N'TXN-#DEP-8847', NULL, N'SEP-#DEP-8847', N'THANH_TOAN', N'SEPAY', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-11T05:06:06.0000000' AS DateTime2), CAST(N'2026-11-11T05:11:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (130, 197, NULL, N'TXN-#DEP-2026-ACT01', NULL, N'SEP-#DEP-2026-ACT01', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T11:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T11:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (131, 198, NULL, N'TXN-#DEP-2026-ACT02', NULL, N'SEP-#DEP-2026-ACT02', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T13:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T13:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (132, 199, NULL, N'TXN-#DEP-2026-ACT03', NULL, N'SEP-#DEP-2026-ACT03', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T15:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T15:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (133, 200, NULL, N'TXN-#DEP-2026-ACT04', NULL, N'SEP-#DEP-2026-ACT04', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T17:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T17:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (134, 201, NULL, N'TXN-#DEP-2026-ACT05', NULL, N'SEP-#DEP-2026-ACT05', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T19:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T19:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (135, 202, NULL, N'TXN-#DEP-2026-ACT06', NULL, N'SEP-#DEP-2026-ACT06', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T21:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T21:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (136, 203, NULL, N'TXN-#DEP-2026-ACT07', NULL, N'SEP-#DEP-2026-ACT07', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T23:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T23:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (137, 204, NULL, N'TXN-#DEP-2026-ACT08', NULL, N'SEP-#DEP-2026-ACT08', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T01:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T01:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (138, 205, NULL, N'TXN-#DEP-2026-ACT09', NULL, N'SEP-#DEP-2026-ACT09', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T03:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T03:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (139, 206, NULL, N'TXN-#DEP-2026-ACT10', NULL, N'SEP-#DEP-2026-ACT10', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T05:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T05:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (140, 207, NULL, N'TXN-#DEP-2026-ACT11', NULL, N'SEP-#DEP-2026-ACT11', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T07:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T07:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (141, 208, NULL, N'TXN-#DEP-2026-ACT12', NULL, N'SEP-#DEP-2026-ACT12', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T09:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T09:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (142, 209, NULL, N'TXN-#DEP-2026-ACT13', NULL, N'SEP-#DEP-2026-ACT13', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T11:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T11:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (143, 210, NULL, N'TXN-#DEP-2026-ACT14', NULL, N'SEP-#DEP-2026-ACT14', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T13:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T13:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (144, 211, NULL, N'TXN-#DEP-2026-ACT15', NULL, N'SEP-#DEP-2026-ACT15', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T15:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T15:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (145, 212, NULL, N'TXN-#DEP-2026-ACT16', NULL, N'SEP-#DEP-2026-ACT16', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T17:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T17:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (146, 213, NULL, N'TXN-#DEP-2026-ACT17', NULL, N'SEP-#DEP-2026-ACT17', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T19:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T19:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (147, 214, NULL, N'TXN-#DEP-2026-ACT18', NULL, N'SEP-#DEP-2026-ACT18', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T21:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T21:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (148, 215, NULL, N'TXN-#DEP-2026-ACT19', NULL, N'SEP-#DEP-2026-ACT19', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T23:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T23:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
INSERT [dbo].[giao_dich_thanh_toan] ([id], [phieu_dat_coc_id], [don_hang_id], [ma_tham_chieu], [ma_giao_dich_vnpay], [ma_giao_dich_sepay], [loai_giao_dich], [phuong_thuc], [so_tien], [thoi_gian_khoi_tao], [thoi_gian_thanh_toan], [ma_ket_qua], [du_lieu_webhook], [trang_thai]) VALUES (149, 216, NULL, N'TXN-#DEP-2026-ACT20', NULL, N'SEP-#DEP-2026-ACT20', N'THANH_TOAN', N'SEPAY', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-13T01:09:06.0000000' AS DateTime2), CAST(N'2026-11-13T01:14:06.0000000' AS DateTime2), N'SUCCESS', NULL, N'SUCCESS')
GO
SET IDENTITY_INSERT [dbo].[giao_dich_thanh_toan] OFF
GO
SET IDENTITY_INSERT [dbo].[gio_hang] ON 

GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (1, 5, CAST(N'2026-11-25T07:43:48.0000000' AS DateTime2))
GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (2, 6, CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (3, 8, CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (4, 9, CAST(N'2026-11-25T07:51:18.0000000' AS DateTime2))
GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (7, 94, CAST(N'2026-11-25T07:50:01.0000000' AS DateTime2))
GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (8, 98, CAST(N'2026-11-15T17:14:49.0000000' AS DateTime2))
GO
INSERT [dbo].[gio_hang] ([id], [nguoi_dung_id], [ngay_cap_nhat]) VALUES (9, 101, CAST(N'2026-11-16T22:29:03.0000000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[gio_hang] OFF
GO
SET IDENTITY_INSERT [dbo].[hang_xe] ON 

GO
INSERT [dbo].[hang_xe] ([id], [ten_hang_xe], [dang_hoat_dong]) VALUES (1, N'AutoHub EV', 1)
GO
INSERT [dbo].[hang_xe] ([id], [ten_hang_xe], [dang_hoat_dong]) VALUES (2, N'VinFast', 1)
GO
INSERT [dbo].[hang_xe] ([id], [ten_hang_xe], [dang_hoat_dong]) VALUES (3, N'Hyundai', 1)
GO
INSERT [dbo].[hang_xe] ([id], [ten_hang_xe], [dang_hoat_dong]) VALUES (4, N'Ford', 1)
GO
INSERT [dbo].[hang_xe] ([id], [ten_hang_xe], [dang_hoat_dong]) VALUES (5, N'Honda', 1)
GO
SET IDENTITY_INSERT [dbo].[hang_xe] OFF
GO
SET IDENTITY_INSERT [dbo].[hinh_anh_xe] ON 

GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (1, 1, 1, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (2, 1, 2, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (3, 1, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (4, 2, 4, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (5, 3, 2, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (6, 4, 5, N'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (7, 1, 1, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', 0, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (8, 1, 1, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'XOAY_360', 90, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (9, 1, 1, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'XOAY_360', 180, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (10, 1, 1, N'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', N'XOAY_360', 270, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (44, 11, 2, N'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (45, 11, 4, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (46, 11, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (47, 12, 2, N'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (48, 12, 4, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (49, 12, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (50, 2, 3, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (51, 2, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (52, 2, NULL, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (53, 3, 1, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (54, 3, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (55, 3, NULL, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (56, 4, 3, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (57, 4, NULL, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (58, 4, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (59, 5, 6, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (60, 5, 2, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (61, 5, NULL, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (62, 5, NULL, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (63, 6, 3, N'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (64, 6, 4, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (65, 6, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (66, 6, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (67, 7, 7, N'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (68, 7, 2, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (69, 7, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (70, 7, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (71, 8, 4, N'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (72, 8, 5, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (73, 8, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (74, 8, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (75, 9, 4, N'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (76, 9, 2, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (77, 9, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (78, 9, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (79, 10, 4, N'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (80, 10, 3, N'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (81, 10, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (82, 10, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 4)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (83, 17, 1, N'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', N'NGOAI_THAT', NULL, 1)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (84, 17, 4, N'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', N'NGOAI_THAT', NULL, 2)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (85, 17, NULL, N'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', N'NOI_THAT', NULL, 3)
GO
INSERT [dbo].[hinh_anh_xe] ([id], [phien_ban_id], [mau_sac_id], [duong_dan], [loai_anh], [goc_quay], [thu_tu_hien_thi]) VALUES (86, 17, NULL, N'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200', N'XOAY_360', NULL, 1)
GO
SET IDENTITY_INSERT [dbo].[hinh_anh_xe] OFF
GO
INSERT [dbo].[khuyen_mai_phien_ban] ([chuong_trinh_id], [phien_ban_id]) VALUES (1, 1)
GO
INSERT [dbo].[khuyen_mai_phien_ban] ([chuong_trinh_id], [phien_ban_id]) VALUES (2, 1)
GO
INSERT [dbo].[khuyen_mai_phien_ban] ([chuong_trinh_id], [phien_ban_id]) VALUES (2, 4)
GO
SET IDENTITY_INSERT [dbo].[lich_hen_lai_thu] ON 

GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (2, 7, 9, 2, 2, CAST(N'2026-11-12T01:58:58.0000000' AS DateTime2), 60, N'AutoHub Quận 7 - TP. Hồ Chí Minh', N'Phạm Thị Lan', N'0912445678', 1, N'001092004561', 6800, 6818, CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2), NULL, N'https://autohub.vn/signatures/cust_lan.png', CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2), N'COMPLETED', N'Đã chuẩn bị xe Demo SantaFe sạch sẽ thơm tho', 1, NULL, N'{rating=4, intent=Rất cao (Dự kiến đặt cọc trong tuần)}')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (45, 6, 2, 1, 2, CAST(N'2026-11-10T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 1', N'0978147120', 1, N'GPLX-795854', 1200, 1225, CAST(N'2026-11-10T18:00:00.0000000' AS DateTime2), CAST(N'2026-11-10T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-11-08T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (46, 7, 3, 6, 3, CAST(N'2026-11-07T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 2', N'0972124460', 1, N'GPLX-307305', 1200, 1225, CAST(N'2026-11-07T17:00:00.0000000' AS DateTime2), CAST(N'2026-11-07T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-11-05T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (47, 8, 4, 4, 1, CAST(N'2026-11-04T16:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 3', N'0974387104', 1, N'GPLX-702405', 1200, 1225, CAST(N'2026-11-04T16:00:00.0000000' AS DateTime2), CAST(N'2026-11-04T16:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-11-02T16:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (48, 9, 5, 1, 2, CAST(N'2026-11-02T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 4', N'0975491351', 1, N'GPLX-524547', 1200, 1225, CAST(N'2026-11-02T17:00:00.0000000' AS DateTime2), CAST(N'2026-11-02T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-31T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (49, 5, 6, 6, 3, CAST(N'2026-10-30T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 5', N'0975586157', 1, N'GPLX-899882', 1200, 1225, CAST(N'2026-10-30T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-30T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-28T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (50, 6, 7, 4, 1, CAST(N'2026-10-27T20:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 6', N'0977564869', 1, N'GPLX-218005', 1200, 1225, CAST(N'2026-10-27T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-27T20:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-25T20:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (51, 7, 8, 1, 2, CAST(N'2026-10-25T16:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 7', N'0972990367', 1, N'GPLX-857470', 1200, 1225, CAST(N'2026-10-25T16:00:00.0000000' AS DateTime2), CAST(N'2026-10-25T16:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-23T16:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (52, 8, 9, 6, 3, CAST(N'2026-10-22T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 8', N'0972104282', 1, N'GPLX-209340', 1200, 1225, CAST(N'2026-10-22T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-22T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-20T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (53, 9, 10, 4, 1, CAST(N'2026-10-19T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 9', N'0971849235', 1, N'GPLX-600934', 1200, 1225, CAST(N'2026-10-19T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-19T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-17T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (54, 5, 1, 1, 2, CAST(N'2026-10-17T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 10', N'0973852063', 1, N'GPLX-619962', 1200, 1225, CAST(N'2026-10-17T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-17T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-15T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (55, 6, 2, 6, 3, CAST(N'2026-10-14T16:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 11', N'0972449089', 1, N'GPLX-479699', 1200, 1225, CAST(N'2026-10-14T16:00:00.0000000' AS DateTime2), CAST(N'2026-10-14T16:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-12T16:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (56, 7, 3, 4, 1, CAST(N'2026-10-11T16:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 12', N'0974455085', 1, N'GPLX-231841', 1200, 1225, CAST(N'2026-10-11T16:00:00.0000000' AS DateTime2), CAST(N'2026-10-11T16:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-09T16:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (57, 8, 4, 1, 2, CAST(N'2026-10-09T20:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 13', N'0977878184', 1, N'GPLX-918673', 1200, 1225, CAST(N'2026-10-09T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-09T20:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-07T20:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (58, 9, 5, 6, 3, CAST(N'2026-10-06T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 14', N'0971065531', 1, N'GPLX-519607', 1200, 1225, CAST(N'2026-10-06T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-06T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-04T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (59, 5, 6, 4, 1, CAST(N'2026-10-03T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 15', N'0975535248', 1, N'GPLX-251562', 1200, 1225, CAST(N'2026-10-03T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-03T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-10-01T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (60, 6, 7, 1, 2, CAST(N'2026-10-01T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 16', N'0979941881', 1, N'GPLX-911922', 1200, 1225, CAST(N'2026-10-01T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-01T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-29T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (61, 7, 8, 6, 3, CAST(N'2026-09-28T19:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 17', N'0972863536', 1, N'GPLX-625283', 1200, 1225, CAST(N'2026-09-28T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-28T19:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-26T19:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (62, 8, 9, 4, 1, CAST(N'2026-09-25T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 18', N'0976235875', 1, N'GPLX-267200', 1200, 1225, CAST(N'2026-09-25T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-25T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-23T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (63, 9, 10, 1, 2, CAST(N'2026-09-23T16:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 19', N'0978743588', 1, N'GPLX-890137', 1200, 1225, CAST(N'2026-09-23T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-23T16:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-21T16:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (64, 5, 1, 6, 3, CAST(N'2026-09-20T19:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 20', N'0975140497', 1, N'GPLX-432796', 1200, 1225, CAST(N'2026-09-20T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-20T19:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-18T19:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (65, 6, 2, 4, 1, CAST(N'2026-09-17T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 21', N'0974089675', 1, N'GPLX-483283', 1200, 1225, CAST(N'2026-09-17T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-17T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-15T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (66, 7, 3, 1, 2, CAST(N'2026-09-15T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 22', N'0974203089', 1, N'GPLX-422422', 1200, 1225, CAST(N'2026-09-15T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-15T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-13T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (67, 8, 4, 6, 3, CAST(N'2026-09-12T20:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 23', N'0974585768', 1, N'GPLX-678471', 1200, 1225, CAST(N'2026-09-12T20:00:00.0000000' AS DateTime2), CAST(N'2026-09-12T20:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-10T20:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (68, 9, 5, 4, 1, CAST(N'2026-09-09T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 24', N'0971720265', 1, N'GPLX-296807', 1200, 1225, CAST(N'2026-09-09T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-09T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-07T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (69, 5, 6, 1, 2, CAST(N'2026-09-07T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 25', N'0971265314', 1, N'GPLX-150388', 1200, 1225, CAST(N'2026-09-07T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-07T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-05T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (70, 6, 7, 6, 3, CAST(N'2026-09-04T17:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 26', N'0975783572', 1, N'GPLX-731353', 1200, 1225, CAST(N'2026-09-04T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-04T17:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-09-02T17:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (71, 7, 8, 4, 1, CAST(N'2026-09-01T16:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 27', N'0979073409', 1, N'GPLX-364771', 1200, 1225, CAST(N'2026-09-01T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-01T16:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-08-30T16:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (72, 8, 9, 1, 2, CAST(N'2026-08-30T18:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 2', N'Nguyễn Khách Hoàn Tất 28', N'0979371344', 1, N'GPLX-103223', 1200, 1225, CAST(N'2026-08-30T18:00:00.0000000' AS DateTime2), CAST(N'2026-08-30T18:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-08-28T18:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (73, 9, 10, 6, 3, CAST(N'2026-08-27T20:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 3', N'Nguyễn Khách Hoàn Tất 29', N'0978111601', 1, N'GPLX-185737', 1200, 1225, CAST(N'2026-08-27T20:00:00.0000000' AS DateTime2), CAST(N'2026-08-27T20:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-08-25T20:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (74, 5, 1, 4, 1, CAST(N'2026-08-24T19:00:00.0000000' AS DateTime2), 45, N'AutoHub Showroom Chi Nhánh 1', N'Nguyễn Khách Hoàn Tất 30', N'0978211329', 1, N'GPLX-358461', 1200, 1225, CAST(N'2026-08-24T19:00:00.0000000' AS DateTime2), CAST(N'2026-08-24T19:45:00.0000000' AS DateTime2), NULL, CAST(N'2026-08-22T19:00:00.0000000' AS DateTime2), N'COMPLETED', NULL, 1, NULL, N'Khách hàng đánh giá xe tăng tốc êm, khả năng cách âm vượt trội.')
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (159, 52, 2, 12, NULL, CAST(N'2026-11-15T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Vinhomes Central Park (TP.HCM)', N'Khách Hàng Đặt Lịch 1', N'0987654322', 1, N'GPLX-888001', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T21:09:06.0000000' AS DateTime2), N'CONFIRMED', NULL, 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (160, 53, 3, NULL, NULL, CAST(N'2026-11-16T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Euro Village (Đà Nẵng)', N'Khách Hàng Đặt Lịch 2', N'0987654323', 1, N'GPLX-888002', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T19:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (161, 54, 4, NULL, NULL, CAST(N'2026-11-17T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Ciputra (Hà Nội)', N'Khách Hàng Đặt Lịch 3', N'0987654324', 1, N'GPLX-888003', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T17:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (162, 55, 5, NULL, NULL, CAST(N'2026-11-18T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Vinhomes Central Park (TP.HCM)', N'Khách Hàng Đặt Lịch 4', N'0987654325', 1, N'GPLX-888004', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T15:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (163, 56, 6, NULL, NULL, CAST(N'2026-11-19T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Euro Village (Đà Nẵng)', N'Khách Hàng Đặt Lịch 5', N'0987654326', 1, N'GPLX-888005', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T13:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (164, 57, 7, NULL, NULL, CAST(N'2026-11-20T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Ciputra (Hà Nội)', N'Khách Hàng Đặt Lịch 6', N'0987654327', 1, N'GPLX-888006', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T11:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (165, 58, 8, NULL, NULL, CAST(N'2026-11-14T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Vinhomes Central Park (TP.HCM)', N'Khách Hàng Đặt Lịch 7', N'0987654328', 1, N'GPLX-888007', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T09:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (166, 59, 9, NULL, NULL, CAST(N'2026-11-15T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Euro Village (Đà Nẵng)', N'Khách Hàng Đặt Lịch 8', N'0987654329', 1, N'GPLX-888008', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T07:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (167, 60, 10, NULL, NULL, CAST(N'2026-11-16T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Ciputra (Hà Nội)', N'Khách Hàng Đặt Lịch 9', N'0987654330', 1, N'GPLX-888009', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T05:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (168, 61, 1, NULL, NULL, CAST(N'2026-11-17T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Vinhomes Central Park (TP.HCM)', N'Khách Hàng Đặt Lịch 10', N'0987654331', 1, N'GPLX-888010', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T03:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (169, 62, 2, NULL, NULL, CAST(N'2026-11-18T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Euro Village (Đà Nẵng)', N'Khách Hàng Đặt Lịch 11', N'0987654332', 1, N'GPLX-888011', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-13T01:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (170, 63, 3, NULL, NULL, CAST(N'2026-11-19T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Ciputra (Hà Nội)', N'Khách Hàng Đặt Lịch 12', N'0987654333', 1, N'GPLX-888012', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T23:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (171, 64, 4, NULL, NULL, CAST(N'2026-11-20T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Vinhomes Central Park (TP.HCM)', N'Khách Hàng Đặt Lịch 13', N'0987654334', 1, N'GPLX-888013', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T21:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (172, 65, 5, NULL, NULL, CAST(N'2026-11-14T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Euro Village (Đà Nẵng)', N'Khách Hàng Đặt Lịch 14', N'0987654335', 1, N'GPLX-888014', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T19:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (173, 66, 6, NULL, NULL, CAST(N'2026-11-15T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Ciputra (Hà Nội)', N'Khách Hàng Đặt Lịch 15', N'0987654336', 1, N'GPLX-888015', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T17:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (174, 67, 7, NULL, NULL, CAST(N'2026-11-16T23:09:06.0000000' AS DateTime2), 45, N'Lái thử tại nhà riêng khách hàng - Khu đô thị Vinhomes Central Park (TP.HCM)', N'Khách Hàng Đặt Lịch 16', N'0987654337', 1, N'GPLX-888016', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T15:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (175, 68, 8, NULL, 3, CAST(N'2026-11-17T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 17', N'0987654338', 1, N'GPLX-888017', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T13:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (176, 69, 9, NULL, 1, CAST(N'2026-11-18T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 18', N'0987654339', 1, N'GPLX-888018', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T11:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (177, 70, 10, NULL, 2, CAST(N'2026-11-19T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 19', N'0987654340', 1, N'GPLX-888019', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T09:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (178, 71, 1, NULL, 3, CAST(N'2026-11-20T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 20', N'0987654341', 1, N'GPLX-888020', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T07:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (179, 72, 2, NULL, 1, CAST(N'2026-11-14T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 21', N'0987654342', 1, N'GPLX-888021', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T05:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (180, 73, 3, NULL, 2, CAST(N'2026-11-15T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 22', N'0987654343', 1, N'GPLX-888022', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T03:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (181, 74, 4, NULL, 3, CAST(N'2026-11-16T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 23', N'0987654344', 1, N'GPLX-888023', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-12T01:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (182, 75, 5, NULL, 1, CAST(N'2026-11-17T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 24', N'0987654345', 1, N'GPLX-888024', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T23:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (183, 76, 6, NULL, 2, CAST(N'2026-11-18T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 25', N'0987654346', 1, N'GPLX-888025', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T21:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (184, 77, 7, NULL, 3, CAST(N'2026-11-19T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 26', N'0987654347', 1, N'GPLX-888026', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T19:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (185, 78, 8, NULL, 1, CAST(N'2026-11-20T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 27', N'0987654348', 1, N'GPLX-888027', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T17:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (186, 79, 9, NULL, 2, CAST(N'2026-11-14T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 28', N'0987654349', 1, N'GPLX-888028', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T15:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (187, 80, 10, NULL, 3, CAST(N'2026-11-15T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 29', N'0987654350', 1, N'GPLX-888029', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T13:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (188, 81, 1, NULL, 1, CAST(N'2026-11-16T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 30', N'0987654351', 1, N'GPLX-888030', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T11:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (189, 82, 2, NULL, 2, CAST(N'2026-11-17T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 31', N'0987654352', 1, N'GPLX-888031', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T09:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (190, 83, 3, NULL, 3, CAST(N'2026-11-18T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 32', N'0987654353', 1, N'GPLX-888032', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T07:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (191, 84, 4, NULL, 1, CAST(N'2026-11-19T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 33', N'0987654354', 1, N'GPLX-888033', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T05:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (192, 85, 5, NULL, 2, CAST(N'2026-11-20T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 34', N'0987654355', 1, N'GPLX-888034', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T03:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (193, 86, 6, NULL, 3, CAST(N'2026-11-14T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 35', N'0987654356', 1, N'GPLX-888035', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-11T01:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (194, 87, 7, NULL, 1, CAST(N'2026-11-15T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 36', N'0987654357', 1, N'GPLX-888036', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T23:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (195, 88, 8, NULL, 2, CAST(N'2026-11-16T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 37', N'0987654358', 1, N'GPLX-888037', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T21:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (196, 89, 9, NULL, 3, CAST(N'2026-11-17T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 38', N'0987654359', 1, N'GPLX-888038', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T19:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (197, 90, 10, NULL, 1, CAST(N'2026-11-18T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 39', N'0987654360', 1, N'GPLX-888039', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T17:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (198, 91, 1, NULL, 2, CAST(N'2026-11-19T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Quận 7 (TP.HCM)', N'Khách Hàng Đặt Lịch 40', N'0987654361', 1, N'GPLX-888040', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T15:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (199, 92, 2, NULL, 3, CAST(N'2026-11-20T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Cẩm Lệ (Đà Nẵng)', N'Khách Hàng Đặt Lịch 41', N'0987654362', 1, N'GPLX-888041', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T13:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
INSERT [dbo].[lich_hen_lai_thu] ([id], [nguoi_dung_id], [phien_ban_id], [xe_demo_id], [showroom_id], [thoi_gian_hen], [thoi_luong_phut], [dia_diem_lai_thu], [ho_ten_khach], [so_dien_thoai_khach], [cam_ket_gplx], [so_gplx_kiem_tra], [odo_bat_dau], [odo_ket_thuc], [thoi_gian_checkin], [thoi_gian_checkout], [chu_ky_khach_hang], [ngay_tao], [trang_thai], [ghi_chu], [da_gui_nhac_lich], [thoi_gian_gui_nhac], [bien_ban_danh_gia]) VALUES (200, 93, 3, NULL, 1, CAST(N'2026-11-14T23:09:06.0000000' AS DateTime2), 45, N'Showroom AutoHub Chi Nhánh Mỹ Đình (Hà Nội)', N'Khách Hàng Đặt Lịch 42', N'0987654363', 1, N'GPLX-888042', NULL, NULL, NULL, NULL, NULL, CAST(N'2026-11-10T11:09:06.0000000' AS DateTime2), N'EXPIRED', N'[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.', 0, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[lich_hen_lai_thu] OFF
GO
SET IDENTITY_INSERT [dbo].[lich_truc_nhan_vien] ON 

GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (1, 2, 1, CAST(N'2026-11-10' AS Date), N'CA_SANG', N'Phụ trách bàn giao xe mới và kiểm tra PDI', CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (2, 4, 1, CAST(N'2026-11-10' AS Date), N'CA_CHIEU', N'Tư vấn trực tiếp khách hàng tại Showroom Mỹ Đình', CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (3, 3, 2, CAST(N'2026-11-10' AS Date), N'CA_HANH_CHINH', N'Điều phối lái thử xe demo và tiếp nhận hồ sơ cọc', CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (4, 2, 1, CAST(N'2026-11-11' AS Date), N'CA_CHIEU', N'Ca trực tư vấn tài chính trả góp ngân hàng', CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (5, 4, 1, CAST(N'2026-11-11' AS Date), N'CA_SANG', N'Tiếp nhận xe mới vận chuyển từ nhà máy', CAST(N'2026-11-10T22:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (6, 3, 1, CAST(N'2026-11-13' AS Date), N'CA_SANG', N'Trực bàn giao xe & tư vấn showroom 1', CAST(N'2026-11-13T08:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (7, 4, 1, CAST(N'2026-11-13' AS Date), N'CA_SANG', N'Trực bàn giao xe & tư vấn showroom 1', CAST(N'2026-11-13T08:00:00.0000000' AS DateTime2))
GO
INSERT [dbo].[lich_truc_nhan_vien] ([id], [nhan_vien_id], [showroom_id], [ngay_truc], [ca_truc], [ghi_chu], [ngay_tao]) VALUES (8, 2, 1, CAST(N'2026-11-13' AS Date), N'CA_SANG', N'Trực bàn giao xe & tư vấn showroom 1', CAST(N'2026-11-13T08:00:00.0000000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[lich_truc_nhan_vien] OFF
GO
SET IDENTITY_INSERT [dbo].[mau_sac] ON 

GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (1, N'Xanh Riviera', N'#0284C7')
GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (2, N'Trắng Ceramic', N'#F8FAFC')
GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (3, N'Xám Liquid', N'#94A3B8')
GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (4, N'Đen Obsidian', N'#0F172A')
GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (5, N'Đỏ Crimson', N'#DC2626')
GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (6, N'Xanh Phantom', N'#1E293B')
GO
INSERT [dbo].[mau_sac] ([id], [ten_mau], [ma_hex]) VALUES (7, N'Xanh Deep Ocean', N'#0A3B52')
GO
SET IDENTITY_INSERT [dbo].[mau_sac] OFF
GO
SET IDENTITY_INSERT [dbo].[nguoi_dung] ON 

GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (1, NULL, N'Trần Đức Nam (Admin)', N'admin@autohub.vn', N'$2a$10$Px4Y6n0uXXsm/LDiqPaV8eYvZ9iHOKBSM9BTdeDeOyAiWwQ6l64F6', N'0988888888', N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', N'001099001234', CAST(N'1995-08-20' AS Date), N'Nam', N'ROLE_ADMIN', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), CAST(N'2026-11-25T08:15:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (2, 1, N'Nguyễn Văn Tuấn', N'tuan.nguyen@autohub.vn', N'$2a$10$Px4Y6n0uXXsm/LDiqPaV8eYvZ9iHOKBSM9BTdeDeOyAiWwQ6l64F6', N'0977112233', N'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', N'001098005678', CAST(N'1998-03-15' AS Date), N'Nam', N'ROLE_STAFF', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), CAST(N'2026-11-25T08:15:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (3, 2, N'Lê Quốc Bảo', N'bao.le@autohub.vn', N'$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', N'0977334455', N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', N'079097008899', CAST(N'1997-11-04' AS Date), N'Nam', N'ROLE_STAFF', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (4, 1, N'Trần Thu Hà', N'ha.tran@autohub.vn', N'$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', N'0988445566', N'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', N'001095007788', CAST(N'1999-06-25' AS Date), N'Nữ', N'ROLE_STAFF', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (5, NULL, N'Nguyễn Văn A', N'vana@gmail.com', N'.mAX976bSQJMkUOZjZh7McF0HfMgdJKe', N'0912345678', N'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200', N'079201009988', CAST(N'1990-12-10' AS Date), N'Nam', N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (6, NULL, N'Trần Hoàng Nam', N'nam.tran@gmail.com', N'$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', N'0988123456', NULL, N'079198008819', CAST(N'1992-05-18' AS Date), N'Nam', N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (7, NULL, N'Nguyễn Bích Thủy', N'thuy.nguyen@company.vn', N'$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', N'0903882119', NULL, N'079092004561', CAST(N'1994-09-02' AS Date), N'Nữ', N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (8, NULL, N'Lê Hoàng Long', N'long.le@fpt.com', N'$2a$10$E8783h59h9oY6z3i/oPj0uY1b8/bE5eC7N9nFzEa.7X6cZpM4D8nS', N'0977441223', NULL, N'001201009988', CAST(N'1988-04-12' AS Date), N'Nam', N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-10T22:58:57.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (9, NULL, N'Nguyễn Văn Trọng', N'trong@gmail.com', N'$2a$10$86ZuQlnD3M4Xjk.Grij5Xut1O9w2dPMEOnfieuTNO8tqwLxqzqr8O', N'0912345679', N'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', N'079201009999', CAST(N'1996-01-01' AS Date), N'Nam', N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-13T18:24:58.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (52, NULL, N'Khách Hàng Lái Thử 1', N'khach.laithu.1@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550001', NULL, N'079204001001', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-07T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (53, NULL, N'Khách Hàng Lái Thử 2', N'khach.laithu.2@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550002', NULL, N'079204001002', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-06T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (54, NULL, N'Khách Hàng Lái Thử 3', N'khach.laithu.3@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550003', NULL, N'079204001003', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-05T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (55, NULL, N'Khách Hàng Lái Thử 4', N'khach.laithu.4@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550004', NULL, N'079204001004', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-04T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (56, NULL, N'Khách Hàng Lái Thử 5', N'khach.laithu.5@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550005', NULL, N'079204001005', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-03T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (57, NULL, N'Khách Hàng Lái Thử 6', N'khach.laithu.6@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550006', NULL, N'079204001006', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-02T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (58, NULL, N'Khách Hàng Lái Thử 7', N'khach.laithu.7@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550007', NULL, N'079204001007', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-01T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (59, NULL, N'Khách Hàng Lái Thử 8', N'khach.laithu.8@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550008', NULL, N'079204001008', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-31T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (60, NULL, N'Khách Hàng Lái Thử 9', N'khach.laithu.9@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550009', NULL, N'079204001009', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-30T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (61, NULL, N'Khách Hàng Lái Thử 10', N'khach.laithu.10@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550010', NULL, N'079204001010', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-29T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (62, NULL, N'Khách Hàng Lái Thử 11', N'khach.laithu.11@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550011', NULL, N'079204001011', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-28T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (63, NULL, N'Khách Hàng Lái Thử 12', N'khach.laithu.12@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550012', NULL, N'079204001012', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-27T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (64, NULL, N'Khách Hàng Lái Thử 13', N'khach.laithu.13@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550013', NULL, N'079204001013', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-26T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (65, NULL, N'Khách Hàng Lái Thử 14', N'khach.laithu.14@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550014', NULL, N'079204001014', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-25T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (66, NULL, N'Khách Hàng Lái Thử 15', N'khach.laithu.15@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550015', NULL, N'079204001015', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-24T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (67, NULL, N'Khách Hàng Lái Thử 16', N'khach.laithu.16@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550016', NULL, N'079204001016', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-23T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (68, NULL, N'Khách Hàng Lái Thử 17', N'khach.laithu.17@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550017', NULL, N'079204001017', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-22T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (69, NULL, N'Khách Hàng Lái Thử 18', N'khach.laithu.18@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550018', NULL, N'079204001018', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-21T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (70, NULL, N'Khách Hàng Lái Thử 19', N'khach.laithu.19@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550019', NULL, N'079204001019', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-20T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (71, NULL, N'Khách Hàng Lái Thử 20', N'khach.laithu.20@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550020', NULL, N'079204001020', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-19T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (72, NULL, N'Khách Hàng Lái Thử 21', N'khach.laithu.21@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550021', NULL, N'079204001021', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-18T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (73, NULL, N'Khách Hàng Lái Thử 22', N'khach.laithu.22@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550022', NULL, N'079204001022', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-17T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (74, NULL, N'Khách Hàng Lái Thử 23', N'khach.laithu.23@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550023', NULL, N'079204001023', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-16T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (75, NULL, N'Khách Hàng Lái Thử 24', N'khach.laithu.24@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550024', NULL, N'079204001024', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-15T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (76, NULL, N'Khách Hàng Lái Thử 25', N'khach.laithu.25@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550025', NULL, N'079204001025', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-14T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (77, NULL, N'Khách Hàng Lái Thử 26', N'khach.laithu.26@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550026', NULL, N'079204001026', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-13T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (78, NULL, N'Khách Hàng Lái Thử 27', N'khach.laithu.27@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550027', NULL, N'079204001027', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-12T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (79, NULL, N'Khách Hàng Lái Thử 28', N'khach.laithu.28@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550028', NULL, N'079204001028', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-11T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (80, NULL, N'Khách Hàng Lái Thử 29', N'khach.laithu.29@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550029', NULL, N'079204001029', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-10T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (81, NULL, N'Khách Hàng Lái Thử 30', N'khach.laithu.30@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550030', NULL, N'079204001030', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-09T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (82, NULL, N'Khách Hàng Lái Thử 31', N'khach.laithu.31@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550031', NULL, N'079204001031', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-08T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (83, NULL, N'Khách Hàng Lái Thử 32', N'khach.laithu.32@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550032', NULL, N'079204001032', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-07T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (84, NULL, N'Khách Hàng Lái Thử 33', N'khach.laithu.33@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550033', NULL, N'079204001033', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-06T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (85, NULL, N'Khách Hàng Lái Thử 34', N'khach.laithu.34@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550034', NULL, N'079204001034', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-05T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (86, NULL, N'Khách Hàng Lái Thử 35', N'khach.laithu.35@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550035', NULL, N'079204001035', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-04T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (87, NULL, N'Khách Hàng Lái Thử 36', N'khach.laithu.36@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550036', NULL, N'079204001036', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-03T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (88, NULL, N'Khách Hàng Lái Thử 37', N'khach.laithu.37@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550037', NULL, N'079204001037', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-02T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (89, NULL, N'Khách Hàng Lái Thử 38', N'khach.laithu.38@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550038', NULL, N'079204001038', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-10-01T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (90, NULL, N'Khách Hàng Lái Thử 39', N'khach.laithu.39@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550039', NULL, N'079204001039', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-09-30T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (91, NULL, N'Khách Hàng Lái Thử 40', N'khach.laithu.40@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550040', NULL, N'079204001040', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-09-29T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (92, NULL, N'Khách Hàng Lái Thử 41', N'khach.laithu.41@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550041', NULL, N'079204001041', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-09-28T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (93, NULL, N'Khách Hàng Lái Thử 42', N'khach.laithu.42@gmail.com', N'$2a$10$wE9qfS63aQ9jZqF.Q58vYe6Jj13t5aB2i3kUq6jQ7f4aF4j.wH5yS', N'0985550042', NULL, N'079204001042', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-09-27T23:09:06.0000000' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (94, 1, N'Trần Đức Nam (Admin Test)', N'admin.test@autohub.vn', N'$2a$10$Px4Y6n0uXXsm/LDiqPaV8eYvZ9iHOKBSM9BTdeDeOyAiWwQ6l64F6', N'0988111222', NULL, N'001099001122', NULL, NULL, N'ROLE_ADMIN', N'HOAT_DONG', CAST(N'2026-11-14T01:40:14.0000000' AS DateTime2), CAST(N'2026-11-25T08:15:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (95, 1, N'Nguyễn Văn Tuấn (Staff Test)', N'staff.test@autohub.vn', N'$2a$10$Px4Y6n0uXXsm/LDiqPaV8eYvZ9iHOKBSM9BTdeDeOyAiWwQ6l64F6', N'0977222333', NULL, N'001099002233', NULL, NULL, N'ROLE_STAFF', N'HOAT_DONG', CAST(N'2026-11-14T01:40:14.0000000' AS DateTime2), CAST(N'2026-11-25T08:15:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (96, NULL, N'Lê Hoàng Long (Customer Test)', N'customer.test@autohub.vn', N'$2a$10$Px4Y6n0uXXsm/LDiqPaV8eYvZ9iHOKBSM9BTdeDeOyAiWwQ6l64F6', N'0911333444', NULL, N'001099003344', NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-14T01:40:14.0000000' AS DateTime2), CAST(N'2026-11-25T08:15:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (97, NULL, N'Tài Khoản Bị Khóa (Test)', N'locked.test@autohub.vn', N'$2a$10$Px4Y6n0uXXsm/LDiqPaV8eYvZ9iHOKBSM9BTdeDeOyAiWwQ6l64F6', N'0911555666', NULL, N'001099004455', NULL, NULL, N'ROLE_CUSTOMER', N'BI_KHOA', CAST(N'2026-11-14T01:40:14.0000000' AS DateTime2), CAST(N'2026-11-25T08:15:00.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (98, NULL, N'Nguyễn Văn Trọng', N'trongtan123tan@gmail.com', N'$2a$10$2W9apiHz38esEY61IcDyxu.Qx.dZngRPM/gId87AMeUGjmnkOP1z6', N'0372816614', NULL, NULL, NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-15T17:14:24.0000000' AS DateTime2), CAST(N'2026-11-15T17:14:24.0000000' AS DateTime2), 0)
GO
INSERT [dbo].[nguoi_dung] ([id], [showroom_id], [ho_ten], [email], [mat_khau_bam], [so_dien_thoai], [anh_dai_dien], [so_cccd], [ngay_sinh], [gioi_tinh], [vai_tro], [trang_thai_tai_khoan], [ngay_tao], [updated_at], [is_deleted]) VALUES (101, NULL, N'Trọng Nguyễn', N'trong209a2@gmail.com', N'$2a$10$CMB4i8MnesJHtd0cxg0xFuICyNZGR7gTblfufh7rjyJzTSvT.6yRu', NULL, N'https://lh3.googleusercontent.com/a/ACg8ocKewulYptsb5oOl2rqM6waf1zg9QHtsWB7ih_wGefiQ3z18=s96-c', NULL, NULL, NULL, N'ROLE_CUSTOMER', N'HOAT_DONG', CAST(N'2026-11-16T21:56:04.0000000' AS DateTime2), CAST(N'2026-11-16T21:56:04.0000000' AS DateTime2), 0)
GO
SET IDENTITY_INSERT [dbo].[nguoi_dung] OFF
GO
SET IDENTITY_INSERT [dbo].[nhat_ky_hanh_vi] ON 

GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (1, 6, N'SESSION_CUST_6_01', N'VIEW_PRODUCT', N'CAR', 7, 180, N'{"referrer": "/cars", "model": "VinFast VF8 Plus"}', CAST(N'2026-11-10T17:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (2, 6, N'SESSION_CUST_6_01', N'INTERACT_360', N'CAR', 7, 95, N'{"color": "Xanh Deep Ocean", "rotationAngle": 180}', CAST(N'2026-11-10T18:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (3, 7, N'SESSION_CUST_7_02', N'GALLERY_SLIDE', N'CAR', 9, 240, N'{"model": "SantaFe Calligraphy", "slideIndex": 3}', CAST(N'2026-11-10T19:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (4, 5, N'SESSION_CUST_5_03', N'VIEW_PRODUCT', N'ACCESSORY', 1, 45, N'{"item": "Bộ sạc Wallbox 22kW"}', CAST(N'2026-11-10T20:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (5, 8, N'SESSION_CUST_8_04', N'DWELL_TIME', N'CAR', 10, 310, N'{"model": "VF9 Plus 6 Chỗ"}', CAST(N'2026-11-10T21:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (6, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-16T09:48:46.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (7, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-16T09:48:46.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (8, 9, N'sess_v3bpgygf_1794797325958', N'DWELL_TIME', N'CAR', 1, 40, N'{"model":"AutoHub GT-e Grand Touring","dwellSeconds":40}', CAST(N'2026-11-16T09:49:26.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (9, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 2, 0, N'{"model":"AutoHub GT-e Track Edition","referrer":"/cars/2"}', CAST(N'2026-11-16T09:49:26.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (10, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 2, 0, N'{"model":"AutoHub GT-e Track Edition","referrer":"/cars/2"}', CAST(N'2026-11-16T09:49:26.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (11, 9, N'sess_v3bpgygf_1794797325958', N'DWELL_TIME', N'CAR', 2, 4, N'{"model":"AutoHub GT-e Track Edition","dwellSeconds":4}', CAST(N'2026-11-16T09:49:30.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (12, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 3, 0, N'{"model":"AutoHub GT-e Standard","referrer":"/cars/3"}', CAST(N'2026-11-16T09:49:30.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (13, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 3, 0, N'{"model":"AutoHub GT-e Standard","referrer":"/cars/3"}', CAST(N'2026-11-16T09:49:30.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (14, 9, N'sess_v3bpgygf_1794797325958', N'DWELL_TIME', N'CAR', 3, 3, N'{"model":"AutoHub GT-e Standard","dwellSeconds":3}', CAST(N'2026-11-16T09:49:33.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (15, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 5, 0, N'{"model":"AutoHub GT-e Executive","referrer":"/cars/5"}', CAST(N'2026-11-16T09:49:33.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (16, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 5, 0, N'{"model":"AutoHub GT-e Executive","referrer":"/cars/5"}', CAST(N'2026-11-16T09:49:33.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (17, 9, N'sess_v3bpgygf_1794797325958', N'DWELL_TIME', N'CAR', 5, 7, N'{"model":"AutoHub GT-e Executive","dwellSeconds":7}', CAST(N'2026-11-16T09:49:40.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (18, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 6, 0, N'{"model":"AutoHub GT-e Sport Tourer","referrer":"/cars/6"}', CAST(N'2026-11-16T09:49:40.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (19, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 6, 0, N'{"model":"AutoHub GT-e Sport Tourer","referrer":"/cars/6"}', CAST(N'2026-11-16T09:49:40.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (20, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 6, 0, N'{"model":"AutoHub GT-e Sport Tourer","referrer":"/cars/6"}', CAST(N'2026-11-16T10:04:13.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (21, 9, N'sess_v3bpgygf_1794797325958', N'VIEW_PRODUCT', N'CAR', 6, 0, N'{"model":"AutoHub GT-e Sport Tourer","referrer":"/cars/6"}', CAST(N'2026-11-16T10:04:13.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (22, 9, N'sess_v3bpgygf_1794797325958', N'DWELL_TIME', N'CAR', 6, 2, N'{"model":"AutoHub GT-e Sport Tourer","dwellSeconds":2}', CAST(N'2026-11-16T10:04:14.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (23, 101, N'sess_4gkrohhz_1794842806528', N'VIEW_PRODUCT', N'CAR', 2, 0, N'{"model":"AutoHub GT-e Track Edition","referrer":"/cars/2"}', CAST(N'2026-11-16T22:26:47.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (24, 101, N'sess_4gkrohhz_1794842806528', N'VIEW_PRODUCT', N'CAR', 2, 0, N'{"model":"AutoHub GT-e Track Edition","referrer":"/cars/2"}', CAST(N'2026-11-16T22:26:47.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (25, 101, N'sess_4gkrohhz_1794842806528', N'DWELL_TIME', N'CAR', 2, 13, N'{"model":"AutoHub GT-e Track Edition","dwellSeconds":13}', CAST(N'2026-11-16T22:27:00.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (26, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:43:51.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (27, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:43:51.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (28, 9, N'sess_ha5zuskw_1795178630695', N'DWELL_TIME', N'CAR', 1, 4, N'{"model":"AutoHub GT-e Grand Touring","dwellSeconds":4}', CAST(N'2026-11-20T19:43:55.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (29, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:44:34.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (30, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:44:34.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (31, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:45:16.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (32, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:45:16.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (33, 9, N'sess_ha5zuskw_1795178630695', N'DWELL_TIME', N'CAR', 1, 3, N'{"model":"AutoHub GT-e Grand Touring","dwellSeconds":3}', CAST(N'2026-11-20T19:45:19.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (34, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:46:57.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (35, 9, N'sess_ha5zuskw_1795178630695', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-20T19:46:58.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (36, 9, N'sess_ha5zuskw_1795178630695', N'DWELL_TIME', N'CAR', 1, 2, N'{"model":"AutoHub GT-e Grand Touring","dwellSeconds":2}', CAST(N'2026-11-20T19:46:59.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (37, NULL, N'test_sess_studio_1795403089266', N'INTERACT_360', N'CAR', 1, 0, N'{"tabId":"exterior","tabLabel":"Ngoại thất 360°"}', CAST(N'2026-11-23T10:04:49.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (38, NULL, N'test_sess_studio_1795403089266', N'INITIATE_DEPOSIT', N'CAR', 1, 0, N'{"carName":"AutoHub GT-e","depositAmount":20000000}', CAST(N'2026-11-23T10:04:50.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (39, NULL, N'test_sess_estimator_1795403089650', N'CALCULATE_ESTIMATOR', N'ESTIMATOR', 1, 15, N'{"cityName":"Hà Nội","trimName":"Standard GT","totalRolloutCost":2700000000}', CAST(N'2026-11-23T10:04:50.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (40, NULL, N'test_sess_studio_1795431983733', N'INTERACT_360', N'CAR', 1, 0, N'{"tabId":"exterior","tabLabel":"Ngoại thất 360°"}', CAST(N'2026-11-23T18:06:24.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (41, NULL, N'test_sess_studio_1795431983733', N'INITIATE_DEPOSIT', N'CAR', 1, 0, N'{"carName":"AutoHub GT-e","depositAmount":20000000}', CAST(N'2026-11-23T18:06:24.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (42, NULL, N'test_sess_estimator_1795431983899', N'CALCULATE_ESTIMATOR', N'ESTIMATOR', 1, 15, N'{"cityName":"Hà Nội","trimName":"Standard GT","totalRolloutCost":2700000000}', CAST(N'2026-11-23T18:06:24.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (43, NULL, N'test_sess_studio_1795517626070', N'INTERACT_360', N'CAR', 1, 0, N'{"tabId":"exterior","tabLabel":"Ngoại thất 360°"}', CAST(N'2026-11-24T17:53:46.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (44, NULL, N'test_sess_studio_1795517626070', N'INITIATE_DEPOSIT', N'CAR', 1, 0, N'{"carName":"AutoHub GT-e","depositAmount":20000000}', CAST(N'2026-11-24T17:53:46.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (45, NULL, N'test_sess_estimator_1795517626185', N'CALCULATE_ESTIMATOR', N'ESTIMATOR', 1, 15, N'{"cityName":"Hà Nội","trimName":"Standard GT","totalRolloutCost":2700000000}', CAST(N'2026-11-24T17:53:46.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (46, NULL, N'sess_ks7lsalw_1795567423219', N'VIEW_PRODUCT', N'ACCESSORY', 3, 0, N'{"name":"Bộ thảm lót sàn đúc nguyên khối chống nước GT-e","category":"Thảm sàn cao cấp","price":2800000,"referrer":"/accessories/3"}', CAST(N'2026-11-25T07:43:43.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (47, NULL, N'sess_ks7lsalw_1795567423219', N'BEGIN_CHECKOUT', N'ACCESSORY', 3, 0, N'{"name":"Bộ thảm lót sàn đúc nguyên khối chống nước GT-e","category":"Thảm sàn cao cấp","price":2800000,"accessoryId":3,"accessoryName":"Bộ thảm lót sàn đúc nguyên khối chống nước GT-e","quantity":1}', CAST(N'2026-11-25T07:43:48.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (48, NULL, N'sess_ks7lsalw_1795567423219', N'DWELL_TIME', N'ACCESSORY', 3, 5, N'{"name":"Bộ thảm lót sàn đúc nguyên khối chống nước GT-e","category":"Thảm sàn cao cấp","price":2800000,"dwellSeconds":5}', CAST(N'2026-11-25T07:43:48.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (49, NULL, N'sess_ks7lsalw_1795567423219', N'VIEW_PRODUCT', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":0,"referrer":"/ai-consultant"}', CAST(N'2026-11-25T07:45:53.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (50, NULL, N'sess_ks7lsalw_1795567423219', N'VIEW_PRODUCT', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":0,"referrer":"/ai-consultant"}', CAST(N'2026-11-25T07:45:53.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (51, NULL, N'sess_ks7lsalw_1795567423219', N'AI_CONSULTANT_QUERY', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":1,"queryLength":40,"carId":1,"carName":"AutoHub EV AutoHub GT-e Grand Touring"}', CAST(N'2026-11-25T07:46:02.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (52, NULL, N'sess_ks7lsalw_1795567423219', N'AI_CONSULTANT_QUERY', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":3,"queryLength":20}', CAST(N'2026-11-25T07:46:30.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (53, NULL, N'sess_ks7lsalw_1795567423219', N'AI_CONSULTANT_QUERY', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":5,"queryLength":53}', CAST(N'2026-11-25T07:47:08.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (54, NULL, N'sess_ks7lsalw_1795567423219', N'AI_CONSULTANT_QUERY', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":7,"queryLength":48}', CAST(N'2026-11-25T07:47:37.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (55, NULL, N'sess_ks7lsalw_1795567423219', N'AI_CONSULTANT_QUERY', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":9,"queryLength":24}', CAST(N'2026-11-25T07:48:02.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (56, NULL, N'sess_ks7lsalw_1795567423219', N'DWELL_TIME', N'AI_CONSULTANT', NULL, 141, N'{"initialMessageCount":11,"dwellSeconds":141}', CAST(N'2026-11-25T07:48:14.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (57, 9, N'sess_9b3vvbec_1795567864882', N'VIEW_PRODUCT', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":0,"referrer":"/ai-consultant"}', CAST(N'2026-11-25T07:51:05.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (58, 9, N'sess_9b3vvbec_1795567864882', N'VIEW_PRODUCT', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":0,"referrer":"/ai-consultant"}', CAST(N'2026-11-25T07:51:05.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (59, 9, N'sess_9b3vvbec_1795567864882', N'AI_CONSULTANT_QUERY', N'AI_CONSULTANT', NULL, 0, N'{"initialMessageCount":1,"queryLength":2}', CAST(N'2026-11-25T07:51:08.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (60, 9, N'sess_9b3vvbec_1795567864882', N'DWELL_TIME', N'AI_CONSULTANT', NULL, 11, N'{"initialMessageCount":3,"dwellSeconds":11}', CAST(N'2026-11-25T07:52:34.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (61, 9, N'sess_9b3vvbec_1795567864882', N'VIEW_PRODUCT', N'CAR', 1, 0, N'{"model":"AutoHub GT-e Grand Touring","referrer":"/cars/1"}', CAST(N'2026-11-25T07:52:39.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (62, 9, N'sess_9b3vvbec_1795567864882', N'DWELL_TIME', N'CAR', 1, 39, N'{"model":"AutoHub GT-e Grand Touring","dwellSeconds":39}', CAST(N'2026-11-25T07:53:53.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (63, 9, N'sess_9b3vvbec_1795567864882', N'VIEW_PRODUCT', N'CAR', 2, 0, N'{"model":"AutoHub GT-e Track Edition","referrer":"/cars/2"}', CAST(N'2026-11-25T07:53:55.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (64, 9, N'sess_9b3vvbec_1795567864882', N'INTERACT_360', N'CAR', 2, 0, N'{"tabId":"interior","tabLabel":"Nội thất sang trọng","carName":"AutoHub GT-e Track Edition","activeTrim":"performance"}', CAST(N'2026-11-25T07:54:01.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (65, 9, N'sess_9b3vvbec_1795567864882', N'INTERACT_360', N'CAR', 2, 0, N'{"tabId":"detail","tabLabel":"Góc nhìn chi tiết","carName":"AutoHub GT-e Track Edition","activeTrim":"performance"}', CAST(N'2026-11-25T07:54:02.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (66, 9, N'sess_9b3vvbec_1795567864882', N'INTERACT_360', N'CAR', 2, 0, N'{"tabId":"studio","tabLabel":"STUDIO 4K HDR","carName":"AutoHub GT-e Track Edition","activeTrim":"performance"}', CAST(N'2026-11-25T07:54:03.0000000' AS DateTime2))
GO
INSERT [dbo].[nhat_ky_hanh_vi] ([id], [nguoi_dung_id], [ma_phien], [loai_hanh_vi], [loai_thuc_the], [ma_thuc_the], [thoi_gian_dung_xem], [du_lieu_bo_sung], [thoi_gian_tao]) VALUES (67, 9, N'sess_9b3vvbec_1795567864882', N'INTERACT_360', N'CAR', 2, 0, N'{"tabId":"exterior","tabLabel":"Ngoại thất 360°","carName":"AutoHub GT-e Track Edition","activeTrim":"performance"}', CAST(N'2026-11-25T07:54:04.0000000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[nhat_ky_hanh_vi] OFF
GO
SET IDENTITY_INSERT [dbo].[nhat_ky_tu_van] ON 

GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (1, 1, 2, N'GOI_DIEN', N'Đã gọi điện tư vấn chính sách vay ngân hàng Vietcombank 70% và mời lái thử.', CAST(1300000000.00 AS Decimal(18, 2)), N'Khách hẹn sáng nay 09:30 ghé Showroom lái thử', CAST(N'2026-11-10T18:58:58.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (2, 2, 3, N'GAP_MAT', N'Khách ghé showroom xem màu xe thực tế và trải nghiệm hàng ghế thứ hai.', CAST(1400000000.00 AS Decimal(18, 2)), N'Khách rất ưng ý, đang chốt thời gian ký hợp đồng', CAST(N'2026-11-10T20:58:58.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (3, 1, 2, N'CUOC_GOI', N'Đã liên hệ anh Nam tư vấn gói trả góp ngân hàng Vietcombank 70% giá trị xe, lãi suất ưu đãi cố định 2 năm đầu 6.5%.', CAST(1200000000.00 AS Decimal(18, 2)), N'Khách đề xuất gửi bảng tính qua Zalo.', CAST(N'2026-11-10T14:58:58.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (4, 2, 3, N'CUOC_GOI', N'Tư vấn chị Thủy phiên bản SantaFe Calligraphy Hybrid màu Đen, tặng kèm gói bảo dưỡng 3 năm và dán phim cách nhiệt.', CAST(1400000000.00 AS Decimal(18, 2)), N'Hẹn chiều mai ghé Showroom Q.7 xem xe thực tế.', CAST(N'2026-11-10T17:58:58.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (5, 3, 2, N'ZALO_CHAT', N'Liên hệ anh Long giải đáp thủ tục xuất hóa đơn VAT tên Công ty TNHH và khấu trừ thuế theo biểu thông tư mới.', CAST(2200000000.00 AS Decimal(18, 2)), N'Khách hài lòng và đặt tiền hành nộp cọc giữ xe.', CAST(N'2026-11-10T20:58:58.0000000' AS DateTime2), NULL)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (6, 1, 1, N'AI_CHAT', N'[Khách]: Tư vấn phiên bản AutoHub GT-e Track Edition
[AutoHub AI]: Cảm ơn quý khách đã gửi câu hỏi: "Tư vấn phiên bản AutoHub GT-e Track Edition". Hệ thống AutoHub Spring AI đã truy vấn dữ liệu từ CSDL Microsoft SQL Server AutoHubDB. Quý khách vui lòng cung cấp thêm thông tin về dòng xe, ngân sách dự kiến hoặc tỉnh thành nhận xe để tôi có thể hỗ trợ chi tiết nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T22:45:07.0000000' AS DateTime2), 571)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (7, 1, 1, N'AI_CHAT', N'[Khách]: Đặt cọc giữ xe 72h ngay bây giờ
[AutoHub AI]: Cảm ơn quý khách đã gửi câu hỏi: "Đặt cọc giữ xe 72h ngay bây giờ". Hệ thống AutoHub Spring AI đã truy vấn dữ liệu từ CSDL Microsoft SQL Server AutoHubDB. Quý khách vui lòng cung cấp thêm thông tin về dòng xe, ngân sách dự kiến hoặc tỉnh thành nhận xe để tôi có thể hỗ trợ chi tiết nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T22:45:55.0000000' AS DateTime2), 501)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (8, 1, 1, N'AI_CHAT', N'[Khách]: Tính chi phí lăn bánh tại Hà Nội & TP.HCM
[AutoHub AI]: Dựa trên biểu phí thực tế từ hệ thống AutoHubDB tại TP. Hồ Chí Minh:

• **Phiên bản:** AutoHub GT-e Grand Touring
• **Giá niêm yết:** 2.890.000.000 VNĐ
• **Lệ phí trước bạ (0.0%):** 0 VNĐ
• **Phí cấp biển số:** 20.000.000 VNĐ
• **Phí đăng kiểm + đường bộ + TNDS:** 2.773.400 VNĐ
👉 **TỔNG CHI PHÍ LĂN BÁNH TỔNG DỰ KIẾN:** 2.912.773.400 VNĐ

*Lưu ý:* Xe thuần điện được MIỄN 100% lệ phí trước bạ theo Nghị định 10/2022/NĐ-CP (tiết kiệm hàng trăm triệu đồng).', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T22:46:54.0000000' AS DateTime2), 291)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (9, 1, 1, N'AI_CHAT', N'[Khách]: hi
[AutoHub AI]: Cảm ơn quý khách đã gửi câu hỏi: "hi". Hệ thống AutoHub Spring AI đã truy vấn dữ liệu từ CSDL Microsoft SQL Server AutoHubDB. Quý khách vui lòng cung cấp thêm thông tin về dòng xe, ngân sách dự kiến hoặc tỉnh thành nhận xe để tôi có thể hỗ trợ chi tiết nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T22:47:42.0000000' AS DateTime2), 244)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (10, 1, 1, N'AI_CHAT', N'[Khách]: tôi có thể biết được xe nào đắt nhất trong hệ thống của bạn được không
[AutoHub AI]: Cảm ơn quý khách đã gửi câu hỏi: "tôi có thể biết được xe nào đắt nhất trong hệ thống của bạn được không". Hệ thống AutoHub Spring AI đã truy vấn dữ liệu từ CSDL Microsoft SQL Server AutoHubDB. Quý khách vui lòng cung cấp thêm thông tin về dòng xe, ngân sách dự kiến hoặc tỉnh thành nhận xe để tôi có thể hỗ trợ chi tiết nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T22:48:21.0000000' AS DateTime2), 287)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (11, 1, 1, N'AI_CHAT', N'[Khách]: hi
[AutoHub AI]: Xin chào quý khách! Tôi là Trợ lý Thông minh của AutoHub, rất hân hạnh được hỗ trợ quý khách.

Quý khách đang quan tâm đến thông tin gì về xe hơi hoặc phụ kiện ô tô ạ? Tôi có thể giúp quý khách:

1. Tư vấn các dòng xe phù hợp với nhu cầu
2. So sánh thông số kỹ thuật giữa các phiên bản xe
3. Kiểm tra tồn kho và xe sẵn sàng giao ngay
4. Tính toán chi phí lăn bánh chính xác
5. Tìm kiếm phụ kiện chính hãng tương thích

Quý khách vui lòng cho biết nhu cầu cụ thể để tôi hỗ trợ tốt nhất ạ!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:01:41.0000000' AS DateTime2), 9722)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (12, 1, 1, N'AI_CHAT', N'[Khách]: tôi muốn biết xe có giá trị cao nhất trong này
[AutoHub AI]: Trong danh sách các xe hiện có, phiên bản có giá trị cao nhất là **AutoHub GT-e Track Edition** với giá niêm yết là **3.490.000.000 VND**. Đây là một phiên bản thuần điện (EV) với hiệu suất cao, phù hợp cho các tay đua và người đam mê tốc độ.

### Thông số nổi bật:
- **Động cơ**: Tri-Motor (3 motor hiệu năng cao)
- **Công suất**: 1.020 HP (750 kW)
- **Mô-men xoắn**: 1.300 Nm
- **Tăng tốc**: 0-100 km/h chỉ trong 2.8 giây
- **Tốc độ tối đa**: 305 km/h (chế độ Track Mode)
- **Dung lượng pin**: 105 kWh
- **Tầm hoạt động**: 600 km
- **Số chỗ ngồi**: 4

Nếu bạn quan tâm đến chi tiết hoặc muốn kiểm tra tồn kho, vui lòng cho tôi biết để hỗ trợ thêm!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:02:28.0000000' AS DateTime2), 9732)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (13, 1, 1, N'AI_CHAT', N'[Khách]: xe nào mắt nhất ở dây''
[AutoHub AI]: Hiện tại, tôi chưa rõ bạn đang tìm kiếm dòng xe nào cụ thể hoặc tiêu chí "mắt nhất" của bạn là gì (ví dụ: thiết kế nổi bật, hiệu suất cao, công nghệ tiên tiến, hay giá cả hấp dẫn). Để hỗ trợ bạn tốt hơn, tôi có thể gợi ý một số dòng xe đang được ưa chuộng hoặc có thiết kế ấn tượng. Bạn có thể cho tôi biết thêm chi tiết về nhu cầu của bạn không?

Nếu bạn muốn, tôi có thể liệt kê một số mẫu xe nổi bật hiện có trên hệ thống để bạn tham khảo. Bạn có quan tâm đến dòng xe nào cụ thể không (ví dụ: SUV, sedan, xe điện, xe thể thao)?', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:07:35.0000000' AS DateTime2), 4588)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (14, 1, 1, N'AI_CHAT', N'[Khách]: xe nào đắt nhất ở đây
[AutoHub AI]: Hiện tại, dòng xe có giá cao nhất tại AutoHub là **AutoHub GT-e Track Edition** với giá niêm yết **3.490.000.000 VNĐ**. Đây là phiên bản đặc biệt thuộc dòng xe điện cao cấp, sở hữu hiệu năng vượt trội với động cơ Tri-Motor, công suất 1.020 HP và khả năng tăng tốc từ 0-100 km/h chỉ trong 2.8 giây.

### Thông số nổi bật:
- **Phân khúc**: E-Sedan (Sedan điện cao cấp).
- **Số chỗ ngồi**: 4.
- **Tầm hoạt động**: 600 km.
- **Dung lượng pin**: 105 kWh.
- **Hộp số**: Tri-Motor Vectoring AWD.
- **Tốc độ tối đa**: 305 km/h (chế độ Track Mode).

Nếu bạn quan tâm đến chi tiết tồn kho hoặc chi phí lăn bánh, tôi có thể hỗ trợ tra cứu thêm thông tin. Bạn có nhu cầu tìm hiểu thêm không?', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:07:58.0000000' AS DateTime2), 10593)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (15, 1, 1, N'AI_CHAT', N'[Khách]: xe nào đắt nhất ở đây
[AutoHub AI]: Trong hệ thống AutoHub hiện tại, dòng xe có giá cao nhất là **AutoHub GT-e Track Edition** với giá niêm yết **3.490.000.000 VNĐ**. Đây là phiên bản đặc biệt thuộc dòng xe điện cao cấp, sở hữu hiệu năng vượt trội với động cơ Tri-Motor, công suất 1.020 HP và khả năng tăng tốc từ 0-100 km/h chỉ trong 2.8 giây.

### Thông số nổi bật:
- **Tầm hoạt động**: 600 km.
- **Dung lượng pin**: 105 kWh.
- **Số chỗ ngồi**: 4.
- **Hộp số**: Tri-Motor Vectoring AWD.
- **Tốc độ tối đa**: 305 km/h (chế độ Track Mode).

Nếu bạn quan tâm đến chi tiết tồn kho hoặc chi phí lăn bánh, tôi có thể hỗ trợ tra cứu thêm thông tin. Bạn vui lòng cho biết tỉnh/thành phố nơi bạn đăng ký xe nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:15:44.0000000' AS DateTime2), 11019)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (16, 1, 1, N'AI_CHAT', N'[Khách]: Đặt cọc giữ xe 72h ngay bây giờ
[AutoHub AI]: Hiện tại, AutoHub chưa hỗ trợ tính năng đặt cọc giữ xe trực tuyến trong 72 giờ. Tuy nhiên, bạn có thể thực hiện các bước sau để đặt cọc giữ xe:

1. **Liên hệ trực tiếp với showroom**: Bạn có thể gọi điện hoặc đến trực tiếp showroom gần nhất để được hỗ trợ đặt cọc giữ xe.

2. **Kiểm tra tồn kho**: Nếu bạn đã chọn được mẫu xe cụ thể, tôi có thể kiểm tra tồn kho và tình trạng sẵn sàng giao hàng cho bạn.

3. **Hỗ trợ từ chuyên viên**: Nếu cần, tôi có thể kết nối bạn với chuyên viên tư vấn của AutoHub để hỗ trợ thêm.

Bạn có thể cho tôi biết:
- Mẫu xe bạn quan tâm.
- Showroom hoặc khu vực bạn muốn mua xe.

Tôi sẽ hỗ trợ bạn ngay lập tức!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:16:28.0000000' AS DateTime2), 3397)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (17, 1, 1, N'AI_CHAT', N'[Khách]: xe nào đắt nhất ở đây
[AutoHub AI]: 🎯 **KẾT QUẢ TƯ VẤN XE PHÙ HỢP TỪ CSDL AUTOHUB**

Dựa trên yêu cầu của quý khách, hệ thống xin trân trọng giới thiệu các phiên bản tối ưu nhất:

🚗 **AutoHub GT-e Grand Touring**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.890.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V (Tầm hoạt động: 680 km, Pin: 100.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Được hoàn lại 100% trong 72h nếu đổi ý)

🚗 **AutoHub GT-e Track Edition**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **3.490.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V SiC (Tầm hoạt động: 600 km, Pin: 105.00 kWh)
   • Số chỗ ngồi: 4 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Được hoàn lại 100% trong 72h nếu đổi ý)

🚗 **AutoHub GT-e Standard**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.490.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V SiC (Tầm hoạt động: 620 km, Pin: 92.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Được hoàn lại 100% trong 72h nếu đổi ý)

Quý khách có thể yêu cầu: *''Tính chi phí lăn bánh tại Hà Nội''* hoặc *''Kiểm tra tồn kho xe sẵn giao''* để được báo cáo chi tiết nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:29:29.0000000' AS DateTime2), 2611)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (18, 1, 1, N'AI_CHAT', N'[Khách]: hi
[AutoHub AI]: Chào bạn! Tôi là Chuyên gia Tư vấn Cấp cao kiêm Trợ lý Thông minh của **AutoHub** - Nền tảng Thương mại Điện tử Ô tô & Phụ kiện hàng đầu.

Tôi có thể hỗ trợ bạn:
1. **Tra cứu thông số kỹ thuật & so sánh xe** (động cơ, dung lượng pin, tính năng an toàn, giá niêm yết...)
2. **Kiểm tra tồn kho xe** thực tế tại các showroom trên toàn quốc
3. **Tính chi phí lăn bánh dự toán** chính xác theo từng tỉnh/thành phố
4. **Tìm kiếm phụ kiện chính hãng** tương thích cho từng dòng xe

Bạn đang quan tâm đến mẫu xe hoặc dịch vụ nào của AutoHub hôm nay?', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:29:58.0000000' AS DateTime2), 1902)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (19, 1, 1, N'AI_CHAT', N'[Khách]: xe nào đắt nhất mà
[AutoHub AI]: 🎯 **KẾT QUẢ TƯ VẤN XE PHÙ HỢP TỪ CSDL AUTOHUB**

Dựa trên yêu cầu của quý khách, hệ thống xin trân trọng giới thiệu các phiên bản tối ưu nhất:

🚗 **AutoHub GT-e Grand Touring**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.890.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V (Tầm hoạt động: 680 km, Pin: 100.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Được hoàn lại 100% trong 72h nếu đổi ý)

🚗 **AutoHub GT-e Track Edition**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **3.490.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V SiC (Tầm hoạt động: 600 km, Pin: 105.00 kWh)
   • Số chỗ ngồi: 4 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Được hoàn lại 100% trong 72h nếu đổi ý)

🚗 **AutoHub GT-e Standard**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.490.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V SiC (Tầm hoạt động: 620 km, Pin: 92.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Được hoàn lại 100% trong 72h nếu đổi ý)

Quý khách có thể yêu cầu: *''Tính chi phí lăn bánh tại Hà Nội''* hoặc *''Kiểm tra tồn kho xe sẵn giao''* để được báo cáo chi tiết nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:30:40.0000000' AS DateTime2), 2371)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (20, 1, 1, N'AI_CHAT', N'[Khách]: hi
[AutoHub AI Router-Executor]: 👋 **Xin chào quý khách!** Tôi là Trợ lý AI Chuyên gia Ô tô AutoHub.

Rất hân hạnh được đồng hành cùng quý khách tìm kiếm chiếc xe ưng ý nhất. Hệ sinh thái AutoHub hiện đang phân phối và có sẵn giao ngay các dòng xe cao cấp tiêu biểu:

🚗 **AutoHub GT-e Grand Touring**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V - 680 km
   • Giá niêm yết: **2.890.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Track Edition**
   • Phân khúc: E-Sedan (4 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 600 km
   • Giá niêm yết: **3.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Standard**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 620 km
   • Giá niêm yết: **2.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

👉 **Quý khách có thể cho tôi biết:**
1. Nhu cầu sử dụng (xe gia đình 5/7 chỗ hay xe thể thao cá nhân)?
2. Ngân sách dự kiến (ví dụ: dưới 1 tỷ, 1 - 2 tỷ hay trên 2 tỷ)?
3. Tỉnh thành quý khách muốn nhận xe và tính phí lăn bánh?', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:57:39.0000000' AS DateTime2), 2409)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (21, 1, 1, N'AI_CHAT', N'[Khách]: Chính sách bảo hành pin xe điện 800V SiC
[AutoHub AI Router-Executor]: 🎯 **KẾT QUẢ TƯ VẤN XE TỐI ƯU TỪ CSDL AUTOHUB**

Dựa trên tiêu chí tìm kiếm của quý khách, mẫu xe phù hợp hàng đầu là:

🚗 **AutoHub GT-e Grand Touring**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.890.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V (Tầm hoạt động: 680 km, Pin: 100.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Hoàn tiền 100% trong 72h)

Ngoài ra, quý khách có thể tham khảo thêm: **AutoHub GT-e Track Edition**, **AutoHub GT-e Standard**.

Quý khách có thể yêu cầu: *''Tính chi phí lăn bánh tại Hà Nội''* hoặc *''Kiểm tra tồn kho xe sẵn giao''*!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:58:00.0000000' AS DateTime2), 2840)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (22, 1, 1, N'AI_CHAT', N'[Khách]: các loại xe 5 chỗ
[AutoHub AI Router-Executor]: 🎯 **KẾT QUẢ TƯ VẤN XE TỐI ƯU TỪ CSDL AUTOHUB**

Dựa trên tiêu chí tìm kiếm của quý khách, mẫu xe phù hợp hàng đầu là:

🚗 **AutoHub GT-e Grand Touring**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.890.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V (Tầm hoạt động: 680 km, Pin: 100.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Hoàn tiền 100% trong 72h)

Ngoài ra, quý khách có thể tham khảo thêm: **AutoHub GT-e Standard**, **AutoHub SUV-e Cross Touring**.

Quý khách có thể yêu cầu: *''Tính chi phí lăn bánh tại Hà Nội''* hoặc *''Kiểm tra tồn kho xe sẵn giao''*!', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:58:52.0000000' AS DateTime2), 1954)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (23, 1, 1, N'AI_CHAT', N'[Khách]: hello
[AutoHub AI Router-Executor]: 👋 **Xin chào quý khách!** Tôi là Trợ lý AI Chuyên gia Ô tô AutoHub.

Rất hân hạnh được đồng hành cùng quý khách tìm kiếm chiếc xe ưng ý nhất. Hệ sinh thái AutoHub hiện đang phân phối và có sẵn giao ngay các dòng xe cao cấp tiêu biểu:

🚗 **AutoHub GT-e Grand Touring**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V - 680 km
   • Giá niêm yết: **2.890.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Track Edition**
   • Phân khúc: E-Sedan (4 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 600 km
   • Giá niêm yết: **3.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Standard**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 620 km
   • Giá niêm yết: **2.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

👉 **Quý khách có thể cho tôi biết:**
1. Nhu cầu sử dụng (xe gia đình 5/7 chỗ hay xe thể thao cá nhân)?
2. Ngân sách dự kiến (ví dụ: dưới 1 tỷ, 1 - 2 tỷ hay trên 2 tỷ)?
3. Tỉnh thành quý khách muốn nhận xe và tính phí lăn bánh?', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:59:42.0000000' AS DateTime2), 2766)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (24, 1, 1, N'AI_CHAT', N'[Khách]: bạn là ai
[AutoHub AI Router-Executor]: 👋 **Xin chào quý khách!** Tôi là Trợ lý AI Chuyên gia Ô tô AutoHub.

Rất hân hạnh được đồng hành cùng quý khách tìm kiếm chiếc xe ưng ý nhất. Hệ sinh thái AutoHub hiện đang phân phối và có sẵn giao ngay các dòng xe cao cấp tiêu biểu:

🚗 **AutoHub GT-e Grand Touring**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V - 680 km
   • Giá niêm yết: **2.890.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Track Edition**
   • Phân khúc: E-Sedan (4 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 600 km
   • Giá niêm yết: **3.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Standard**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 620 km
   • Giá niêm yết: **2.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

👉 **Quý khách có thể cho tôi biết:**
1. Nhu cầu sử dụng (xe gia đình 5/7 chỗ hay xe thể thao cá nhân)?
2. Ngân sách dự kiến (ví dụ: dưới 1 tỷ, 1 - 2 tỷ hay trên 2 tỷ)?
3. Tỉnh thành quý khách muốn nhận xe và tính phí lăn bánh?', NULL, N'AI_RESOLVED', CAST(N'2026-11-15T23:59:55.0000000' AS DateTime2), 2641)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (25, 1, 1, N'AI_CHAT', N'[Khách]: bạn có thể xóa csdl không
[AutoHub AI Router-Executor]: 👋 **Xin chào quý khách!** Tôi là Trợ lý AI Chuyên gia Ô tô AutoHub.

Rất hân hạnh được đồng hành cùng quý khách tìm kiếm chiếc xe ưng ý nhất. Hệ sinh thái AutoHub hiện đang phân phối và có sẵn giao ngay các dòng xe cao cấp tiêu biểu:

🚗 **AutoHub GT-e Grand Touring**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V - 680 km
   • Giá niêm yết: **2.890.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Track Edition**
   • Phân khúc: E-Sedan (4 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 600 km
   • Giá niêm yết: **3.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

🚗 **AutoHub GT-e Standard**
   • Phân khúc: E-Sedan (5 chỗ)
   • Động cơ / Tầm hoạt động: Thuần điện EV 800V SiC - 620 km
   • Giá niêm yết: **2.490.000.000 VNĐ** (Cọc 72h: 20.000.000 VNĐ)

👉 **Quý khách có thể cho tôi biết:**
1. Nhu cầu sử dụng (xe gia đình 5/7 chỗ hay xe thể thao cá nhân)?
2. Ngân sách dự kiến (ví dụ: dưới 1 tỷ, 1 - 2 tỷ hay trên 2 tỷ)?
3. Tỉnh thành quý khách muốn nhận xe và tính phí lăn bánh?', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:00:14.0000000' AS DateTime2), 2852)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (26, 1, 1, N'AI_CHAT', N'[Khách]: xe 100 chỗ
[AutoHub AI Router-Executor]: 🎯 **KẾT QUẢ TƯ VẤN XE TỐI ƯU TỪ CSDL AUTOHUB**

Dựa trên tiêu chí tìm kiếm của quý khách, mẫu xe phù hợp hàng đầu là:

🚗 **AutoHub GT-e Grand Touring**
   • Dòng xe: **AutoHub GT-e** (E-Sedan)
   • Giá niêm yết: **2.890.000.000 VNĐ**
   • Vận hành: Thuần điện EV 800V (Tầm hoạt động: 680 km, Pin: 100.00 kWh)
   • Số chỗ ngồi: 5 chỗ VIP
   • Tiền cọc giữ xe 72h: **20.000.000 VNĐ** (Hoàn tiền 100% trong 72h)

Ngoài ra, quý khách có thể tham khảo thêm: **AutoHub GT-e Track Edition**, **AutoHub GT-e Standard**.

Quý khách có thể yêu cầu: *''Tính chi phí lăn bánh tại Hà Nội''* hoặc *''Kiểm tra tồn kho xe sẵn giao''*!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:01:24.0000000' AS DateTime2), 2397)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (27, 1, 1, N'AI_CHAT', N'[Khách]: Tính chi phí lăn bánh tại Hà Nội
[AutoHub AI Router-Executor]: 📊 **DỰ TOÁN CHI PHÍ LĂN BÁNH TẠI HÀ NỘI**

• **Dòng xe / Phiên bản:** **AutoHub GT-e Grand Touring**
• **Giá niêm yết (đã gồm VAT):** 2.890.000.000 VNĐ
• **Lệ phí trước bạ (0.0%):** 0 VNĐ
• **Phí cấp biển số:** 20.000.000 VNĐ
• **Phí đăng kiểm + Bảo trì đường bộ + BH TNDS:** 2.773.400 VNĐ
─────────────────────────────────────
👉 **TỔNG CHI PHÍ LĂN BÁNH DỰ KIẾN:** **2.912.773.400 VNĐ**

💡 *Chính sách ưu đãi:* Xe thuần điện được MIỄN 100% lệ phí trước bạ theo Nghị định 10/2022/NĐ-CP (tiết kiệm hàng trăm triệu đồng).
Quý khách có thể xem bảng chi tiết bên dưới hoặc nộp cọc 72h trực tuyến để khóa ưu đãi này.', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:01:48.0000000' AS DateTime2), 315)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (28, 1, 1, N'AI_CHAT', N'[Khách]: Chính sách bảo hành pin xe điện 800V SiC
[AutoHub AI Router-Executor]: Chào Quý khách, **AutoHub** xin gửi tới Quý khách thông tin chi tiết về **Chính sách bảo hành và Đặc tính kỹ thuật của Pin xe điện kiến trúc 800V SiC** thế hệ mới:

### 1. Chính Sách Bảo Hành Tiêu Chuẩn
* **Thời hạn bảo hành:** **10 NĂM hoặc 200.000 KM** (tùy điều kiện nào đến trước).
* **Phạm vi áp dụng:** Toàn bộ cell pin, pack pin và hệ thống quản lý pin thông minh (**BMS**).

### 2. Cam Kết Dung Lượng Khả Dụng (SOH - State of Health)
* AutoHub cam kết **ĐỔI MỚI BỘ PIN HOÀN TOÀN MIỄN PHÍ** nếu dung lượng khả dụng (SOH) của pin tụt xuống dưới **70%** trong thời gian bảo hành.

### 3. Ưu Thế Công Nghệ Pin 800V Silicon Carbide (SiC)
* **Tối ưu nhiệt độ & hiệu suất:** Công nghệ bán dẫn Silicon Carbide (SiC) trên kiến trúc điện áp cao 800V giúp giảm nhiệt lượng tỏa ra **40%**, tăng đáng kể hiệu suất sạc và vận hành.
* **Sạc siêu nhanh:** Hỗ trợ công suất sạc tối đa lên tới **350kW**, cho phép sạc từ **10% lên 80% chỉ trong 18 PHÚT**.
* **Độ bền vượt trội:** Hệ thống làm mát bằng chất lỏng tuần hoàn đa kênh giúp duy trì nhiệt độ tối ưu, chống quá nhiệt và ngăn ngừa suy giảm tuổi thọ pin.

### 4. Dịch Vụ Hỗ Trợ & Cứu Hộ Đặc Quyền
* **Cứu hộ sạc khẩn cấp lưu động 24/7:** Phục vụ trên toàn quốc thông qua Hotline **1900 8888**.
* **Kiểm tra sức khỏe pin (SOH):** Miễn phí định kỳ tại tất cả các đại lý và xưởng dịch vụ ủy quyền của AutoHub.

Nếu Quý khách cần tư vấn chi tiết hơn về các dòng xe điện 800V SiC hoặc muốn trải nghiệm lái thử, xin vui lòng liên hệ với AutoHub để được hỗ trợ chu đáo nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:08:00.0000000' AS DateTime2), 6419)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (29, 1, 1, N'AI_CHAT', N'[Khách]: Kiểm tra xe có sẵn tại showroom
[AutoHub AI Router-Executor]: Xin chào Quý khách! Cảm ơn Quý khách đã quan tâm đến các dòng xe điện cao cấp tại **AutoHub**.

Hiện tại, hệ thống AutoHub đang phân phối dòng xe sedan điện hiệu suất cao **AutoHub GT-e** với 3 phiên bản chính:

* **AutoHub GT-e Standard**: Giá niêm yết **2.290.000.000 VNĐ**
* **AutoHub GT-e Grand Touring**: Giá niêm yết **2.890.000.000 VNĐ**
* **AutoHub GT-e Track Edition**: Giá niêm yết **3.490.000.000 VNĐ** *(Phiên bản cao cấp nhất)*

---

Để em có thể tra cứu chính xác **tồn kho thực tế (màu sắc, số lượng xe giao ngay)** qua hệ thống dữ liệu thời gian thực, Quý khách vui lòng hỗ trợ cung cấp thêm thông tin:

1. **Phiên bản xe** Quý khách đang quan tâm (*Standard, Grand Touring* hay *Track Edition*)?
2. **Khu vực/Showroom** Quý khách muốn đến xem xe (*Hà Nội, TP. Hồ Chí Minh, Đà Nẵng...*)?

---

💡 **Thông tin thêm đến Quý khách:**
* Tất cả các phiên bản **AutoHub GT-e** đều sở hữu công nghệ pin **800V SiC** sạc siêu nhanh (10 - 80% chỉ trong 18 phút), chính sách **bảo hành pin 10 năm hoặc 200.000 km** (cam kết đổi mới miễn phí nếu SOH < 70%).
* AutoHub áp dụng chính sách **đặt cọc giữ xe 72 giờ hoàn tiền 100% không mất phí** giúp Quý khách hoàn toàn yên tâm trải nghiệm.

Rất hân hạnh được hỗ trợ Quý khách!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:08:39.0000000' AS DateTime2), 7977)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (30, 1, 1, N'AI_CHAT', N'[Khách]: Đăng ký lịch lái thử khi xe về
[AutoHub AI Router-Executor]: Hệ thống ghi nhận phiên bản quý khách tìm kiếm hiện đang hoàn tất thủ tục xuất xưởng từ nhà máy. Quý khách có thể nộp cọc giữ chỗ 72h trên AutoHub để nhận xe trong đợt bàn giao đầu tiên.', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:09:14.0000000' AS DateTime2), 609)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (31, 1, 1, N'AI_CHAT', N'[Khách]: bạn có thể xóa csdl khong
[AutoHub AI Router-Executor]: 🛡️ **Thông báo an toàn & Bảo mật hệ thống AutoHub:**

Tôi là **Trợ lý AI Tư vấn Chuyên môn của AutoHub**. Về mặt kỹ thuật và phân quyền bảo mật:

• **Quyền hạn của AI:** Tôi chỉ được cấp quyền đọc (Read-only) để tra cứu thông số xe, bảng giá và tồn kho phục vụ quý khách.
• **Tuyệt đối không thể xóa hay can thiệp CSDL:** Hệ thống cơ sở dữ liệu AutoHubDB được bảo mật đa tầng bởi Spring Security RBAC và các chính sách an toàn nghiêm ngặt của doanh nghiệp. Tôi hoàn toàn không có quyền hạn hay khả năng thực hiện bất kỳ thao tác xóa hoặc thay đổi dữ liệu nào.

Tôi luôn sẵn sàng đồng hành hỗ trợ quý khách tìm hiểu các dòng xe cao cấp, tính chi phí lăn bánh hoặc kiểm tra xe có sẵn giao ngay. Quý khách đang quan tâm đến dòng xe nào hôm nay?', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:09:28.0000000' AS DateTime2), 507)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (32, 1, 1, N'AI_CHAT', N'[Khách]: Tính chi phí lăn bánh tại Hà Nội
[AutoHub AI Router-Executor]: 📊 **DỰ TOÁN CHI PHÍ LĂN BÁNH TẠI HÀ NỘI**

• **Dòng xe / Phiên bản:** **AutoHub GT-e Grand Touring**
• **Giá niêm yết (đã gồm VAT):** 2.890.000.000 VNĐ
• **Lệ phí trước bạ (0.0%):** 0 VNĐ
• **Phí cấp biển số:** 20.000.000 VNĐ
• **Phí đăng kiểm + Bảo trì đường bộ + BH TNDS:** 2.773.400 VNĐ
─────────────────────────────────────
👉 **TỔNG CHI PHÍ LĂN BÁNH DỰ KIẾN:** **2.912.773.400 VNĐ**

💡 *Chính sách ưu đãi:* Xe thuần điện được MIỄN 100% lệ phí trước bạ theo Nghị định 10/2022/NĐ-CP (tiết kiệm hàng trăm triệu đồng).
Quý khách có thể xem bảng chi tiết bên dưới hoặc nộp cọc 72h trực tuyến để khóa ưu đãi này.', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:09:41.0000000' AS DateTime2), 698)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (33, 1, 1, N'AI_CHAT', N'[Khách]: xe nào rẻ nhất ở đây
[AutoHub AI Router-Executor]: 💰 **PHIÊN BẢN XE CÓ MỨC GIÁ TIẾT KIỆM & HẤP DẪN NHẤT**

Hiện tại, mẫu xe có mức giá dễ tiếp cận nhất trong hệ thống AutoHub là **VinFast VF8 Eco AWD** với giá niêm yết chỉ từ **1.099.000.000 VNĐ**.

🌟 **Thông số cơ bản:**
• **Dòng xe:** VinFast VF8 (Phân khúc D-SUV)
• **Vận hành:** Thuần điện EV 400V
• **Số chỗ ngồi:** 5 chỗ
• **Tiền cọc giữ xe 72h:** **20.000.000 VNĐ** (Hoàn 100% trong 72h nếu đổi ý)

Quý khách có thể xem thông số xe ở thẻ bên dưới hoặc yêu cầu tính phí lăn bánh.', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:09:54.0000000' AS DateTime2), 3078)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (34, 1, 1, N'AI_CHAT', N'[Khách]: Tính chi phí lăn bánh tại Hà Nội
[AutoHub AI Router-Executor]: 📊 **DỰ TOÁN CHI PHÍ LĂN BÁNH TẠI HÀ NỘI**

• **Dòng xe / Phiên bản:** **AutoHub GT-e Grand Touring**
• **Giá niêm yết (đã gồm VAT):** 2.890.000.000 VNĐ
• **Lệ phí trước bạ (0.0%):** 0 VNĐ
• **Phí cấp biển số:** 20.000.000 VNĐ
• **Phí đăng kiểm + Bảo trì đường bộ + BH TNDS:** 2.773.400 VNĐ
─────────────────────────────────────
👉 **TỔNG CHI PHÍ LĂN BÁNH DỰ KIẾN:** **2.912.773.400 VNĐ**

💡 *Chính sách ưu đãi:* Xe thuần điện được MIỄN 100% lệ phí trước bạ theo Nghị định 10/2022/NĐ-CP (tiết kiệm hàng trăm triệu đồng).
Quý khách có thể xem bảng chi tiết bên dưới hoặc nộp cọc 72h trực tuyến để khóa ưu đãi này.', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:10:16.0000000' AS DateTime2), 1309)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (35, 1, 1, N'AI_CHAT', N'[Khách]: xe nào rẻ nhất ở đây
[AutoHub AI Router-Executor]: Chào Quý khách,

Trong danh sách hệ thống cơ sở dữ liệu của **AutoHub**, mẫu xe có giá niêm yết **thấp nhất (rẻ nhất)** hiện tại là **VinFast VF8 Eco AWD**.

Dưới đây là thông tin chi tiết về mẫu xe này:

* **Tên phiên bản:** VinFast VF8 Eco AWD
* **Giá niêm yết:** **1.099.000.000 VNĐ**
* **Phân khúc:** D-SUV (5 chỗ ngồi)
* **Động cơ/Nhiên liệu:** Thuần điện EV (Hệ thống điện 400V, Dẫn động 4 bánh toàn thời gian AWD)
* **Tầm hoạt động:** **420 km** sau mỗi lần sạc đầy
* **Mức đặt cọc giữ xe (72h):** 20.000.000 VNĐ

---

### **Top 3 mẫu xe có mức giá tiếp cận dễ nhất tại AutoHub:**
1. **VinFast VF8 Eco AWD** (Điện): **1.099.000.000 VNĐ**
2. **Honda CR-V 1.5L Turbo L AWD** (Xăng Turbo): **1.159.000.000 VNĐ**
3. **Ford Everest Sport 4x2** (Dầu Diesel): **1.178.000.000 VNĐ**

Nếu Quý khách cần **tính toán dự toán chi phí lăn bánh** chi tiết tại tỉnh/thành phố của mình hoặc **kiểm tra số lượng xe còn trong kho**, xin vui lòng phản hồi để em hỗ trợ tra cứu ngay lập tức!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:41:50.0000000' AS DateTime2), 8686)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (36, 1, 1, N'AI_CHAT', N'[Khách]: Tính chi phí lăn bánh tại Hà Nội
[AutoHub AI Router-Executor]: Chào Quý khách,

AutoHub xin gửi đến Quý khách dự toán chi phí lăn bánh chi tiết cho mẫu xe thuần điện **AutoHub GT-e Grand Touring** tại thị trường **Hà Nội** dựa trên dữ liệu cập nhật mới nhất từ hệ thống:

### **DỰ TOÁN CHI PHÍ LĂN BÁNH AUTOHUB GT-E GRAND TOURING (HÀ NỘI)**

* **Giá niêm yết:** **2.890.000.000 VNĐ**
* **Lệ phí trước bạ (0%):** **0 VNĐ** *(Được miễn 100% theo Nghị định 10/2022/NĐ-CP dành cho xe ô tô điện chạy pin)*
* **Phí cấp biển số (Khu vực I - Hà Nội):** **20.000.000 VNĐ**
* **Phí đăng kiểm, bảo trì đường bộ & Bảo hiểm TNDS bắt buộc:** (Đã bao gồm trong dự toán)

➡️ **TỔNG CHI PHÍ LĂN BÁNH DỰ KIẾN:** **2.912.773.400 VNĐ**

---

💡 **Đặc quyền & Ưu đãi vượt trội:**
* **Tiết kiệm chi phí khủng:** Nhờ chính sách ưu đãi 0% lệ phí trước bạ dành cho xe điện thuần túy, Quý khách đã tiết kiệm được gần **350.000.000 VNĐ** so với các dòng xe xăng cùng phân phối giá trị.
* **Chính sách bảo hành Pin & Xe:** Bảo hành **10 năm hoặc 200.000 km**, cam kết đổi mới bộ pin hoàn toàn miễn phí khi dung lượng (SOH) xuống dưới 70%. Xe trang bị công nghệ sạc nhanh 800V SiC (sạc từ 10% - 80% chỉ trong 18 phút).

Nếu Quý khách cần tính toán chi phí lăn bánh cho phiên bản khác (như bản *Track Edition*) hoặc cần tư vấn về thủ tục trả góp/lái thử, xin vui lòng phản hồi để em hỗ trợ kịp thời nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T00:42:09.0000000' AS DateTime2), 6474)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (37, 1, 1, N'AI_CHAT', N'[Khách]: hi
[AutoHub AI Router-Executor]: Xin chào quý khách! Tôi là Trợ lý Thông minh và Chuyên gia Tư vấn Cấp cao của **AutoHub** - Nền tảng Thương mại Điện tử Ô tô & Phụ kiện Hàng đầu.

Tôi có thể hỗ trợ quý khách giải đáp và tư vấn các thông tin sau:

* **Tư vấn & So sánh xe:** Thông số kỹ thuật, khả năng vận hành, dung lượng pin và tính năng an toàn (bao gồm dòng xe điện cao cấp **AutoHub GT-e**).
* **Báo giá & Chi phí:** Tra cứu giá niêm yết, dự toán chi phí lăn bánh chi tiết theo từng tỉnh thành.
* **Tồn kho real-time:** Kiểm tra số lượng xe thực tế đang có sẵn tại hệ thống kho.
* **Chính sách & Phụ kiện:** Thông tin bảo hành pin/xe, quy trình đặt cọc giữ xe, hoặc tìm kiếm phụ kiện chính hãng tương thích.

Quý khách đang quan tâm đến dòng xe nào hoặc cần hỗ trợ thông tin gì hôm nay ạ?', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T09:39:44.0000000' AS DateTime2), 6840)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (38, 1, 1, N'AI_CHAT', N'[Khách]: xe nào rẻ nhất ở đây
[AutoHub AI Router-Executor]: Chào Quý khách,

Hiện tại trên hệ thống AutoHub, phiên bản xe điện cao cấp có mức giá niêm yết khởi điểm dễ tiếp cận nhất là **AutoHub GT-e Grand Touring** với giá niêm yết **2.890.000.000 VNĐ**.

Dưới đây là một số thông tin kỹ thuật nổi bật của mẫu xe này để Quý khách tham khảo:

*   **Phân khúc:** E-Sedan sang trọng
*   **Số chỗ ngồi:** 05 chỗ
*   **Động cơ & Công nghệ:** Thuần điện EV kiến trúc 800V SiC (hỗ trợ sạc siêu nhanh từ 10% - 80% chỉ trong 18 phút)
*   **Tầm hoạt động:** 680 km cho một lần sạc đầy
*   **Chính sách bảo hành:** 10 năm hoặc 200.000 km cho toàn bộ xe và pin (cam kết đổi mới bộ pin miễn phí nếu dung lượng pin SOH < 70%)
*   **Mức cọc ưu đãi 72h:** 20.000.000 VNĐ

So với phiên bản cao cấp nhất là **AutoHub GT-e Track Edition** (giá 3.490.000.000 VNĐ), bản **Grand Touring** là lựa chọn vô cùng tối ưu cho những khách hàng yêu thích sự êm ái, tiện nghi sang trọng và phạm vi di chuyển dài với chi phí đầu tư hợp lý nhất trong dải sản phẩm.

Nếu Quý khách muốn nhận **dự toán chi phí lăn bánh chính xác tại tỉnh/thành phố của mình** hoặc tư vấn chi tiết hơn về chính sách ưu đãi hiện hành, xin vui lòng cho tôi biết địa phương Quý khách dự định đăng ký xe nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T09:40:22.0000000' AS DateTime2), 12528)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (39, 1, 1, N'AI_CHAT', N'[Khách]: xe nào rẻ nhất ở đây
[AutoHub AI Router-Executor]: Xin chào Quý khách! Cảm ơn Quý khách đã liên hệ với **AutoHub** - Nền tảng Thương mại Điện tử Ô tô & Phụ kiện Hàng đầu.

Để giúp Quý khách dễ dàng tham khảo và lựa chọn mẫu xe phù hợp nhất với ngân sách của mình, AutoHub xin phân tách rõ các phân khúc giá hiện có trên hệ thống:

### 1. Mẫu xe có mức giá dễ tiếp cận nhất (Rẻ nhất)
* **Dòng xe:** Chi phí sở hữu khởi điểm tối ưu nhất trên AutoHub thuộc về các phiên bản **Xe đô thị / EV tiêu chuẩn** (entry-level).
* **Ưu điểm:** Chi phí vận hành cực kỳ tiết kiệm, chi phí bảo dưỡng thấp, đầy đủ các tính năng an toàn cơ bản và công nghệ kết nối thông minh.

---

### 2. Bảng giá tham khảo hệ sinh thái xe AutoHub:
* **Phiên bản Tiêu chuẩn (Standard / Base):** Mức giá niêm yết khởi điểm tốt nhất hệ thống, phù hợp nhu cầu di chuyển hàng ngày.
* **AutoHub GT-e Grand Touring:** **2.890.000.000 VNĐ** *(Dòng E-Sedan thuần điện 800V, tầm hoạt động 680 km/lần sạc, công suất mạnh mẽ).*
* **AutoHub GT-e Track Edition:** **3.490.000.000 VNĐ** *(Phiên bản cao cấp nhất / đắt nhất dành cho tín đồ tốc độ).*

---

### 💡 Lời khuyên từ Chuyên gia AutoHub:
Nếu Quý khách đang tìm kiếm giải pháp tối ưu chi phí mua xe:
1. **Dự toán chi phí lăn bánh:** Chi phí thực tế sẽ phụ thuộc vào **tỉnh/thành phố đăng ký** (lệ phí trước bạ, phí biển số,...). Đặc biệt, các dòng xe thuần điện hiện đang được hưởng chính sách **ưu đãi 0% lệ phí trước bạ** từ Chính phủ.
2. **Chính sách hỗ trợ:** AutoHub hỗ trợ trả góp lên tới 80% giá trị xe với lãi suất ưu đãi.

Quý khách có thể chia sẻ thêm về **ngân sách dự kiến** hoặc **tỉnh/thành phố đăng ký xe**, em sẽ chạy công cụ dự toán chi tiết chi phí lăn bánh và kiểm tra tồn kho ưu đãi mới nhất cho Quý khách nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T09:43:26.0000000' AS DateTime2), 12773)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (40, 1, 1, N'AI_CHAT', N'[Khách]: xe nào rẻ nhất ở đây
[AutoHub AI Router-Executor]: Xin chào quý khách! Trong hệ thống dữ liệu của AutoHub hiện tại, mẫu xe có giá niêm yết **rẻ nhất** (mức giá thấp nhất) là **VinFast VF8 Eco AWD**.

Dưới đây là thông tin chi tiết của mẫu xe này:

* **Mẫu xe:** VinFast VF8 Eco AWD
* **Giá niêm yết:** **1.099.000.000 VNĐ**
* **Phân khúc:** D-SUV (5 chỗ)
* **Nhiên liệu:** Thuần điện EV (Hệ dẫn động 2 cầu toàn thời gian AWD)
* **Mức cọc giữ xe (72h):** 20.000.000 VNĐ

---

Để quý khách tiện so sánh, xin gửi tới quý khách **Top 3 mẫu xe có giá tốt nhất** tại AutoHub hiện tại:
1. **VinFast VF8 Eco AWD** – **1.099.000.000 VNĐ** *(Rẻ nhất)*
2. **Honda CR-V 1.5L Turbo L AWD** – **1.159.000.000 VNĐ**
3. **Ford Everest Sport 4x2** – **1.178.000.000 VNĐ**

Nếu quý khách cần **tính chi phí lăn bánh chi tiết** theo tỉnh/thành phố hoặc **kiểm tra số lượng xe còn trong kho**, hãy phản hồi lại để tôi hỗ trợ tra cứu ngay nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T10:04:46.0000000' AS DateTime2), 10313)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (41, 1, 1, N'AI_CHAT', N'[Khách]: Tính chi phí lăn bánh VinFast VF8 Eco AWD tại Hà Nội
[AutoHub AI Router-Executor]: Chào bạn, AutoHub xin gửi đến bạn dự toán chi phí lăn bánh chi tiết cho xe **VinFast VF8 Eco AWD** tại **Hà Nội** dựa trên dữ liệu cập nhật mới nhất từ hệ thống:

### **Dự toán chi phí lăn bánh VinFast VF8 Eco AWD (Hà Nội)**

* **Giá niêm yết:** **1.099.000.000 VNĐ**
* **Lệ phí trước bạ (0%):** **0 VNĐ** *(Miễn 100% lệ phí trước bạ theo Nghị định 10/2022/NĐ-CP dành cho xe thuần điện, giúp bạn tiết kiệm hàng trăm triệu đồng)*
* **Phí cấp biển số (Hà Nội):** **20.000.000 VNĐ**
* **Các chi phí bắt buộc khác (Phí đăng kiểm, bảo trì đường bộ, bảo hiểm TNDS,...):** Đã bao gồm trong dự toán hệ thống.

👉 **TỔNG CHI PHÍ LĂN BÁNH DỰ KIẾN:** **1.121.773.400 VNĐ**

---

💡 **Thông tin bổ sung:**
- **Chính sách bảo hành:** Xe VinFast VF8 được bảo hành chính hãng **10 năm hoặc 200.000 km**.
- **Chính sách pin:** Cam kết đổi mới bộ pin miễn phí khi dung lượng pin tối đa (SOH) giảm dưới 70%.

Nếu bạn cần tư vấn thêm về phương án trả góp, chương trình ưu đãi mới nhất hoặc đặt lịch lái thử, xin vui lòng liên hệ lại với AutoHub nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T10:05:11.0000000' AS DateTime2), 8737)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (42, 1, 1, N'AI_CHAT', N'[Khách]: Chính sách bảo hành pin 800V SiC
[AutoHub AI Router-Executor]: Chào bạn, **AutoHub** xin gửi đến bạn chi tiết **Chính sách bảo hành Pin và Hệ truyền động điện 800V SiC** tiên tiến nhất hiện nay:

### 1. Thời hạn bảo hành tiêu chuẩn
* **Thời gian / Quãng đường**: Bảo hành **10 NĂM** hoặc **200.000 KM** (tùy điều kiện nào đến trước).
* **Phạm vi áp dụng**: Mọi thành phần bao gồm toàn bộ cell pin, pack pin và Hệ thống quản lý pin (BMS).

### 2. Cam kết dung lượng khả dụng (SOH - State of Health)
* AutoHub cam kết **đổi mới hoàn toàn MIỄN PHÍ** bộ pin nếu dung lượng khả dụng (SOH) của pin bị suy giảm **dưới 70%** trong thời hạn bảo hành.

### 3. Đặc tính Công nghệ Pin 800V SiC thế hệ mới
* **Kiến trúc điện áp cao 800V Silicon Carbide (SiC)**: Giúp giảm **40% nhiệt lượng tỏa ra**, tối ưu hóa hiệu suất năng lượng.
* **Tốc độ sạc siêu nhanh**: Hỗ trợ công suất sạc tối đa lên tới **350kW**, cho phép sạc từ **10% đến 80% chỉ trong 18 PHÚT**.
* **Hệ thống tản nhiệt tiên tiến**: Làm mát bằng chất lỏng tuần hoàn đa kênh giúp chống quá nhiệt và kéo dài tối đa tuổi thọ pin.

### 4. Dịch vụ Hỗ trợ & Cứu hộ độc quyền
* **Cứu hộ sạc khẩn cấp lưu động 24/7**: Phục vụ trên toàn quốc qua hotline **1900 8888**.
* **Kiểm tra SOH miễn phí**: Miễn phí kiểm tra sức khỏe pin định kỳ tại toàn bộ hệ thống xưởng dịch vụ ủy quyền của AutoHub.

Nếu bạn cần tư vấn thêm về các dòng xe điện ứng dụng công nghệ pin 800V SiC hoặc đăng ký trải nghiệm thực tế, vui lòng liên hệ ngay với tôi để được hỗ trợ tốt nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T10:05:33.0000000' AS DateTime2), 9589)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (43, 1, 1, N'AI_CHAT', N'[Khách]: Kiểm tra tồn kho VinFast VF8 Eco AWD sẵn giao
[AutoHub AI Router-Executor]: Hệ thống ghi nhận phiên bản **VinFast VF8 Eco AWD** hiện đang hoàn tất thủ tục xuất xưởng từ nhà máy. Quý khách có thể nộp cọc giữ chỗ 72h trên AutoHub để nhận xe trong đợt bàn giao đầu tiên.', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T10:06:03.0000000' AS DateTime2), 7371)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (44, 1, 1, N'AI_CHAT', N'[Khách]: Đặt cọc giữ chỗ VinFast VF8 Eco AWD 72h đợt đầu tiên
[AutoHub AI Router-Executor]: 🛡️ **CHÍNH SÁCH ĐẶT CỌC GIỮ XE 72 GIỜ TẠI AUTOHUB**

Nhằm mang lại sự an tâm tuyệt đối cho quý khách hàng trong quá trình cân nhắc và ra quyết định, AutoHub áp dụng chính sách đặt cọc giữ chỗ minh bạch và bảo vệ tối đa quyền lợi người tiêu dùng:

1. **Mức tiền cọc giữ xe chuẩn:**
   • **20.000.000 VNĐ / xe** cho tất cả các phiên bản xe điện và xe xăng cao cấp.
   • Khi nộp cọc thành công, hệ thống tự động khóa số khung **VIN độc quyền** và cố định mức giá ưu đãi trong 72 giờ.

2. **Cam kết hoàn tiền 100% không mất phí trong 72h:**
   • Quý khách có quyền thay đổi quyết định hoặc hủy cọc bất kỳ lúc nào trong vòng **72 giờ** kể từ thời điểm giao dịch.
   • AutoHub cam kết **hoàn lại đúng 100% số tiền cọc** về tài khoản ngân hàng của quý khách mà không trừ bất kỳ khoản phí phạt hay phụ phí nào.

3. **Thời gian xử lý hoàn tiền:**
   • Yêu cầu hoàn cọc được tiếp nhận tự động trên cổng Portal và xử lý hoàn tất trong vòng 24 - 48 giờ làm việc.

Quý khách có thể tự tin đặt cọc giữ xe ngay hôm nay để không bỏ lỡ đợt bàn giao xe sớm nhất!', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T10:06:22.0000000' AS DateTime2), 3590)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (45, 1, 1, N'AI_CHAT', N'[Khách]: xe gầm cao đi gia đình 7 người tiết kiệm điện
[AutoHub AI Router-Executor]: Chào bạn, 

Đối với nhu cầu tìm kiếm một chiếc **xe gầm cao 7 chỗ rộng rãi cho gia đình** và **tối ưu chi phí năng lượng/tiết kiệm điện**, AutoHub xin đề xuất lựa chọn hoàn hảo nhất trong phân khúc hiện nay:

### 🚘 **VinFast VF9 Eco 7 Chỗ** (Lựa chọn tối ưu nhất)
* **Giá niêm yết:** **1.499.000.000 VNĐ**
* **Phân khúc:** E-SUV gầm cao cỡ lớn, không gian nội thất 7 chỗ cực kỳ rộng rãi, thoải mái cho cả 3 hàng ghế khi di chuyển gia đình đông người.
* **Động cơ & Nhiên liệu:** Thuần điện EV (hệ thống 400V), vận hành êm ái, không mùi khí thải và tiết kiệm chi phí nhiên liệu tối đa so với xe xăng truyền thống.
* **Chính sách bảo hành & Pin vượt trội:** 
  * Bảo hành chính hãng **10 năm hoặc 200.000 km**.
  * Cam kết **đổi mới bộ pin miễn phí** khi dung lượng tối đa (SOH) xuống dưới 70%.
  * Hỗ trợ công nghệ sạc nhanh giúp chuyến đi gia đình luôn thuận tiện.

---

📌 *Lựa chọn bổ sung (Dòng xe Hybrid):*
Nếu gia đình bạn muốn một mẫu xe kết hợp xăng - điện tự sạc không cần cắm sạc ngoài, bạn có thể tham khảo thêm **Hyundai SantaFe Exclusive Hybrid** (**1.199.000.000 VNĐ** - D-SUV 7 chỗ).

Tuy nhiên, để tối ưu về **chi phí vận hành tiết kiệm điện**, không gian gầm cao rộng rãi vượt trội cho 7 người thì **VinFast VF9 Eco 7 Chỗ** là sự lựa chọn số 1. Mẫu xe này đã được hệ thống đính kèm ngay bên dưới để bạn tiện tham khảo chi tiết.

Bạn có muốn tra cứu thêm về **dự toán chi phí lăn bánh** tại tỉnh/thành phố của mình hoặc kiểm tra **tồn kho xe sẵn giao** không ạ?', NULL, N'AI_RESOLVED', CAST(N'2026-11-16T10:10:08.0000000' AS DateTime2), 12860)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (46, 1, 1, N'AI_CHAT', N'[Khách]: Chính sách bảo hành pin xe điện 800V SiC
[AutoHub AI Router-Executor]: Chào bạn, AutoHub xin thông tin chi tiết đến bạn **Chính sách bảo hành và Công nghệ Pin 800V SiC** dành cho các dòng xe điện như sau:

---

### 1. Thời Hạn Bảo Hành Tiêu Chuẩn
* **Thời gian / Quãng đường:** Bảo hành **10 NĂM** hoặc **200.000 KM** (tùy điều kiện nào đến trước).
* **Phạm vi áp dụng:** Toàn bộ cell pin, pack pin và hệ thống quản lý pin (BMS).

---

### 2. Cam Kết Dung Lượng Khả Dụng (SOH - State of Health)
* AutoHub cam kết **đổi mới bộ pin hoàn toàn MIỄN PHÍ** nếu dung lượng khả dụng của pin bị suy giảm xuống dưới **70%** trong thời gian bảo hành.

---

### 3. Công Nghệ Pin 800V SiC Thế Hệ Mới
* **Kiến trúc điện áp cao 800V SiC (Silicon Carbide):** Giảm **40%** nhiệt lượng tỏa ra, nâng cao tối đa hiệu suất vận hành và độ bền của pin.
* **Sạc siêu nhanh 350kW:** Hỗ trợ sạc từ **10% lên 80% chỉ trong 18 PHÚT**.
* **Hệ thống làm mát đa kênh:** Làm mát bằng chất lỏng tuần hoàn giúp chống quá nhiệt và ngăn ngừa suy giảm tuổi thọ pin.

---

### 4. Dịch Vụ Hỗ Trợ & Cứu Hộ Dành Cho Khách Hàng
* **Cứu hộ sạc khẩn cấp 24/7:** Hỗ trợ sạc lưu động trên toàn quốc qua Hotline **1900 8888**.
* **Kiểm tra định kỳ:** Miễn phí kiểm tra dung lượng SOH định kỳ tại tất cả các xưởng dịch vụ ủy quyền của AutoHub trên toàn quốc.

Nếu bạn cần tư vấn chi tiết hơn hoặc muốn trải nghiệm lái thử mẫu xe điện sử dụng công nghệ pin 800V SiC, xin vui lòng cho AutoHub biết nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-25T07:46:14.0000000' AS DateTime2), 11954)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (47, 1, 1, N'AI_CHAT', N'[Khách]: giá xe rẻ nhất ở đây
[AutoHub AI Router-Executor]: Chào quý khách, 

Mẫu xe có giá niêm yết **rẻ nhất (thấp nhất)** hiện đang có tại hệ thống AutoHub là **VinFast VF8 Eco AWD** với giá **1.099.000.000 VNĐ**.

Dưới đây là chi tiết mẫu xe rẻ nhất cùng top các dòng xe có mức giá ưu đãi nhất tại AutoHub:

1. **VinFast VF8 Eco AWD** *(Mẫu xe có giá tốt nhất)*
   - **Giá niêm yết:** **1.099.000.000 VNĐ**
   - **Phân khúc:** D-SUV (5 chỗ)
   - **Nhiên liệu/Động cơ:** Thuần điện EV 400V (Dẫn động 2 cầu AWD)
   - **Mức cọc giữ xe 72h:** 20.000.000 VNĐ

2. **Honda CR-V 1.5L Turbo L AWD**
   - **Giá niêm yết:** **1.159.000.000 VNĐ**
   - **Phân khúc:** C-SUV (7 chỗ) | Xăng 1.5L VTEC Turbo

3. **Ford Everest Sport 4x2**
   - **Giá niêm yết:** **1.178.000.000 VNĐ**
   - **Phân khúc:** D-SUV (7 chỗ) | Động cơ Diesel Single-Turbo

Mẫu xe **VinFast VF8 Eco AWD** đã được hệ thống đính kèm ngay bên dưới. Quý khách có thể xem chi tiết thông số, tính dự toán chi phí lăn bánh, đặt lịch lái thử hoặc đặt cọc giữ xe ngay!', NULL, N'AI_RESOLVED', CAST(N'2026-11-25T07:46:39.0000000' AS DateTime2), 8780)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (48, 1, 1, N'AI_CHAT', N'[Khách]: tôi muốn đăng ký lái thử thì làm các bước như thế nào
[AutoHub AI Router-Executor]: Dạ vâng! Tôi đã ghi nhận quý khách muốn đăng ký trải nghiệm mẫu xe **VinFast VF8 Eco AWD**.

Để Showroom AutoHub chuẩn bị sẵn xe lái thử và sắp xếp chuyên viên đón tiếp chu đáo nhất, quý khách vui lòng cung cấp giúp tôi các thông tin sau nhé:
1. 👤 **Họ và tên** của quý khách
2. 📱 **Số điện thoại** liên hệ (10 chữ số)
3. 🏢 **Showroom / Tỉnh thành** quý khách muốn trải nghiệm (ví dụ: Showroom Hà Nội, TP.HCM, Đà Nẵng...)
4. ⏰ **Thời gian dự kiến** (ví dụ: 09:00 sáng mai hoặc thứ 7 tuần này)

*(Quý khách có thể nhắn liền một câu, ví dụ: ''Nguyễn Văn A, 0912345678, Showroom Hà Nội, 9h sáng mai'' nhé!)*', NULL, N'AI_RESOLVED', CAST(N'2026-11-25T07:47:11.0000000' AS DateTime2), 2349)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (49, 1, 1, N'AI_CHAT', N'[Khách]: tôi muốn thay đổi mật khẩu cho tài khoản của tôi
[AutoHub AI Router-Executor]: Chào bạn, tôi là trợ lý AI tư vấn và chỉ có quyền truy cập tra cứu (Read-only) nên không thể trực tiếp thao tác đổi mật khẩu trên hệ thống giúp bạn vì lý do bảo mật.

Để tự thay đổi mật khẩu cho tài khoản AutoHub của mình, bạn có thể thực hiện theo các bước sau:

1. **Đăng nhập** vào tài khoản của bạn trên hệ thống AutoHub.
2. Truy cập vào mục **Tài khoản của tôi** (hoặc **Cài đặt cá nhân**).
3. Chọn phần **Bảo mật** / **Đổi mật khẩu**.
4. Nhập mật khẩu hiện tại, nhập mật khẩu mới và xác nhận để hoàn tất.

*(Trường hợp bạn quên mật khẩu cũ, hãy chọn nút **"Quên mật khẩu"** tại màn hình Đăng nhập để hệ thống gửi liên kết xác minh qua Email/SĐT đã đăng ký).*

Nếu bạn cần tư vấn thêm về các dòng xe, tính chi phí lăn bánh hay đăng ký lái thử tại AutoHub, tôi luôn sẵn sàng hỗ trợ nhé!', NULL, N'AI_RESOLVED', CAST(N'2026-11-25T07:47:48.0000000' AS DateTime2), 10440)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (50, 1, 1, N'AI_CHAT', N'[Khách]: bạn xóa cơ sở dữ liệu đi
[AutoHub AI Router-Executor]: 🛡️ **Thông báo an toàn & Bảo mật hệ thống AutoHub:**

Tôi là **Trợ lý AI Tư vấn Chuyên môn của AutoHub**. Về mặt kỹ thuật và phân quyền bảo mật:
• **Quyền hạn của AI:** Tôi chỉ được cấp quyền đọc (Read-only) để tra cứu thông số xe, bảng giá và tồn kho phục vụ quý khách.
• **Tuyệt đối không thể xóa hay can thiệp CSDL:** Hệ thống CSDL AutoHubDB được bảo mật đa tầng bởi Spring Security RBAC. Tôi hoàn toàn không có khả năng thực hiện bất kỳ thao tác xóa hoặc thay đổi dữ liệu nào.

Tôi luôn sẵn sàng đồng hành hỗ trợ quý khách tìm hiểu xe, tính chi phí lăn bánh hoặc lái thử. Quý khách đang quan tâm đến nội dung nào ạ?', NULL, N'AI_RESOLVED', CAST(N'2026-11-25T07:48:02.0000000' AS DateTime2), 679)
GO
INSERT [dbo].[nhat_ky_tu_van] ([id], [yeu_cau_tu_van_id], [nhan_vien_id], [loai_tuong_tac], [noi_dung_trao_doi], [ngan_sach_du_kien], [ket_qua_cuoc_goi], [thoi_gian_tuong_tac], [thoi_gian_phan_hoi_ms]) VALUES (51, 1, 1, N'AI_CHAT', N'[Khách]: hi
[AutoHub AI Router-Executor]: 👋 **Xin chào quý khách!** Tôi là **Trợ lý AI Chuyên gia Ô tô của AutoHub**.

Rất hân hạnh được hỗ trợ quý khách! Tôi có thể giúp quý khách:
• 🚗 **Tư vấn xe & Thông số kỹ thuật:** Tra cứu bảng giá, dung lượng pin, tầm hoạt động và so sánh các phiên bản.
• 💰 **Dự toán chi phí lăn bánh:** Tính chính xác lệ phí trước bạ, biển số và tổng chi phí ra biển theo từng tỉnh thành.
• 🏢 **Kiểm tra tồn kho & Đặt lịch lái thử:** Tra cứu xe sẵn có tại các showroom AutoHub trên toàn quốc.
• 🛡️ **Chính sách & Phụ kiện:** Quy chế cọc giữ xe 72h hoàn tiền 100%, bảo hành pin 10 năm hoặc mua phụ kiện chính hãng.

Hôm nay quý khách đang quan tâm đến dòng xe nào hoặc cần hỗ trợ thông tin gì ạ?', NULL, N'AI_RESOLVED', CAST(N'2026-11-25T07:51:09.0000000' AS DateTime2), 676)
GO
SET IDENTITY_INSERT [dbo].[nhat_ky_tu_van] OFF
GO
SET IDENTITY_INSERT [dbo].[phien_ban_xe] ON 

GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (1, 1, N'AutoHub GT-e Grand Touring', 2026, N'Tự động điện tử Dual-Motor', N'Thuần điện EV 800V', 5, CAST(2890000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 680, CAST(100.00 AS Numeric(6, 2)), N'{"dong_co": "AWD Dual-Motor kép SiC", "tang_toc": "3.2", "tang_toc_sub": "Gia tốc dính ghế tức thì", "cong_suat": "680 HP (500 kW)", "mo_men_xoan": "850", "toc_do_toi_da": "260", "tam_chay": "680", "tam_chay_sub": "Cao nhất toàn series GT-e", "sac": "10 - 80% trong 15 phút", "sac_sub": "Công suất tối đa 320 kW (Siêu tốc)", "kich_thuoc": "4.965 x 1.960 x 1.410", "chieu_dai_co_so": "2.990", "khoang_hanh_ly": "Tổng 565 Lít (Cốp sau 480L + Cốp trước 85L)", "trong_luong": "2.280 kg", "trong_luong_sub": "Tỷ lệ phân bổ vàng 50:50", "he_thong_treo": "Treo khí nén 3 buồng thích ứng", "he_thong_treo_sub": "Nâng hạ gầm 5 cấp độ thích ứng", "adas": "LiDAR kép 128 tia + HubPilot L3", "adas_sub": "Gói lái tự hành Level 3 chuẩn quốc tế", "am_thanh": "21 loa Dolby Atmos 1.200W", "am_thanh_sub": "Loa tích hợp tựa đầu tài xế cao cấp", "mui_xe": "Kính đổi màu Electrochromic 9 cấp", "mui_xe_sub": "9 cấp độ mờ quang học tự động", "mam_xe": "21 inch Forged thể thao", "mam_xe_sub": "Lốp Pirelli P-Zero Elect cao cấp", "chat_lieu_ghe": "Da Nappa kết hợp Alcantara", "chat_lieu_ghe_sub": "Chỉnh điện 18 hướng, nhớ vị trí, massage", "score_acceleration": 87, "score_range": 98, "score_safety": 95, "score_luxury": 92, "score_handling": 90, "tag": "Hiệu Năng Toàn Diện", "badge": "KHUYÊN DÙNG"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (2, 1, N'AutoHub GT-e Track Edition', 2026, N'Tri-Motor Vectoring AWD', N'Thuần điện EV 800V SiC', 4, CAST(3490000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 600, CAST(105.00 AS Numeric(6, 2)), N'{"dong_co": "Tri-Motor (3 motor hiệu năng cao)", "tang_toc": "2.8", "tang_toc_sub": "Đẳng cấp Hypercar quốc tế", "cong_suat": "1.020 HP (750 kW)", "mo_men_xoan": "1.300", "toc_do_toi_da": "305", "toc_do_toi_da_sub": "Track Mode điện tử", "tam_chay": "600", "tam_chay_sub": "Tối ưu cho lực kéo trường đua", "sac": "10 - 80% trong 15 phút", "sac_sub": "Làm mát pin chủ động chất lỏng đua", "kich_thuoc": "4.980 x 1.980 x 1.395", "kich_thuoc_sub": "Rộng hơn 20mm & Hạ trọng tâm 15mm", "chieu_dai_co_so": "2.990", "khoang_hanh_ly": "Tổng 565 Lít (Cốp sau 480L + Cốp trước 85L)", "trong_luong": "2.190 kg (Carbon)", "trong_luong_sub": "Giảm 90kg nhờ sợi Carbon cao cấp", "he_thong_treo": "Treo từ tính MagneRide", "he_thong_treo_sub": "Thanh cân bằng chống lật chủ động", "adas": "Full Sensor Array Telemetry FIA", "adas_sub": "Phân tích dữ liệu vòng chạy Telemetry FIA", "am_thanh": "21 loa Titanium siêu nhẹ", "am_thanh_sub": "Mô phỏng âm thanh động cơ đua thể thao", "mui_xe": "Mui xe sợi Carbon nguyên khối", "mui_xe_sub": "Giảm trọng lượng đỉnh xe hạ trọng tâm", "mam_xe": "22 inch hợp kim Magie đúc", "mam_xe_sub": "Lốp đua Pirelli P-Zero Corsa Semi-slick", "chat_lieu_ghe": "Ghế đua Bucket Carbon ôm sát", "chat_lieu_ghe_sub": "Dây đai an toàn 6 điểm chuẩn trường đua", "score_acceleration": 100, "score_range": 85, "score_safety": 92, "score_luxury": 85, "score_handling": 100, "tag": "Đua Track RS", "badge": "TRACK EDITION"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (3, 1, N'AutoHub GT-e Standard', 2026, N'Đơn Motor RWD', N'Thuần điện EV 800V SiC', 5, CAST(2490000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 620, CAST(92.00 AS Numeric(6, 2)), N'{"dong_co": "RWD Đơn motor sau SiC", "tang_toc": "3.8", "tang_toc_sub": "Chuẩn mực sedan thể thao", "cong_suat": "450 HP (330 kW)", "mo_men_xoan": "550", "toc_do_toi_da": "230", "tam_chay": "620", "tam_chay_sub": "Tiêu chuẩn đô thị & liên tỉnh", "sac": "10 - 80% trong 18 phút", "sac_sub": "Công suất nạp tối đa 270 kW", "kich_thuoc": "4.965 x 1.960 x 1.410", "chieu_dai_co_so": "2.990", "khoang_hanh_ly": "Tổng 565 Lít (Cốp sau 480L + Cốp trước 85L)", "trong_luong": "2.150 kg", "trong_luong_sub": "Tỷ lệ phân bổ 49:51", "he_thong_treo": "Treo lò xo đa liên kết", "he_thong_treo_sub": "Van điều tiết thích ứng FSD", "adas": "Camera 360° + Radar 4D", "adas_sub": "Gói hỗ trợ lái xe bán tự động Level 2", "am_thanh": "14 loa Hi-Fi 710W", "am_thanh_sub": "Công nghệ chống ồn chủ động ANC", "mui_xe": "Kính toàn cảnh Low-E", "mui_xe_sub": "Chặn 99.9% tia UV và cách nhiệt", "mam_xe": "20 inch khí động học", "mam_xe_sub": "Lốp Michelin Pilot Sport EV", "chat_lieu_ghe": "Da tổng hợp thuần chay cao cấp", "chat_lieu_ghe_sub": "Chỉnh điện 12 hướng hàng ghế trước", "score_acceleration": 75, "score_range": 88, "score_safety": 90, "score_luxury": 80, "score_handling": 82, "tag": "Tiêu Chuẩn Đô Thị", "badge": "TIÊU CHUẨN"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (4, 2, N'AutoHub SUV-e Cross Touring', 2026, N'Dual-Motor AWD', N'Thuần điện EV 800V', 5, CAST(2990000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 650, CAST(110.00 AS Numeric(6, 2)), N'{"dong_co": "AWD Dual-Motor kép SiC 800V", "tang_toc": "3.9", "cong_suat": "580 HP (426 kW)", "mo_men_xoan": "750", "toc_do_toi_da": "220", "tam_chay": "650", "tam_chay_sub": "Cụm pin dung lượng 110 kWh", "sac": "10 - 80% trong 16 phút", "kich_thuoc": "5.020 x 2.000 x 1.680", "chieu_dai_co_so": "3.050", "khoang_hanh_ly": "680 Lít (Mở rộng 1.850L)", "trong_luong": "2.420 kg", "he_thong_treo": "Khí nén 2 van thích ứng chủ động", "adas": "HubPilot 2+ tự hành & Camera 360", "am_thanh": "18 loa Meridian Sound System", "mui_xe": "Cửa sổ trời toàn cảnh Panorama", "mam_xe": "22 inch hợp kim đa chấu phay kim cương", "chat_lieu_ghe": "Da Nappa cao cấp", "score_acceleration": 80, "score_range": 92, "score_safety": 96, "score_luxury": 90, "score_handling": 85, "tag": "SUV Điện Cao Cấp", "badge": "SUV FLAGSHIP"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (5, 1, N'AutoHub GT-e Executive', 2026, N'Dual-Motor AWD', N'Thuần điện EV 800V', 4, CAST(2690000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 700, CAST(100.00 AS Numeric(6, 2)), N'{"dong_co": "Dual-Motor AWD SiC 800V", "tang_toc": "3.5", "cong_suat": "620 HP (455 kW)", "mo_men_xoan": "800", "toc_do_toi_da": "250", "tam_chay": "710", "tam_chay_sub": "Tầm chạy lớn nhất phân khúc", "sac": "10 - 80% trong 15 phút (350kW)", "kich_thuoc": "5.150 x 1.960 x 1.420", "chieu_dai_co_so": "3.150", "khoang_hanh_ly": "600 Lít", "trong_luong": "2.350 kg", "he_thong_treo": "Khí nén 3 buồng chủ động Magic Body Control", "adas": "HubPilot Level 3 & LiDAR 128 tia", "am_thanh": "Burmester High-End 23 loa 1.450W", "mui_xe": "Kính cách âm cách nhiệt 3 lớp", "mam_xe": "21 inch mạ Chrome sang trọng", "chat_lieu_ghe": "Ghế Ottoman massage đá nóng 4 ghế", "score_acceleration": 84, "score_range": 99, "score_safety": 98, "score_luxury": 98, "score_handling": 88, "tag": "Doanh Nhân Đẳng Cấp", "badge": "EXECUTIVE VIP"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (6, 1, N'AutoHub GT-e Sport Tourer', 2026, N'AWD SiC Gen 3', N'Thuần điện EV 800V', 5, CAST(3120000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 660, CAST(100.00 AS Numeric(6, 2)), N'{"dong_co": "AWD SiC Gen 3 Dual-Motor", "tang_toc": "3.3", "cong_suat": "650 HP (478 kW)", "mo_men_xoan": "820", "toc_do_toi_da": "260", "tam_chay": "660", "sac": "10 - 80% trong 15 phút", "kich_thuoc": "4.970 x 1.970 x 1.425", "chieu_dai_co_so": "2.990", "khoang_hanh_ly": "820 Lít (Gập ghế 1.650L)", "trong_luong": "2.290 kg", "he_thong_treo": "Treo thể thao chủ động thích ứng", "adas": "HubPilot 2+ & Radar 4D", "am_thanh": "Dolby Atmos 18 loa", "mui_xe": "Kính toàn cảnh Low-E", "mam_xe": "21 inch thể thao đa chấu", "chat_lieu_ghe": "Da Semi-Aniline kết hợp da lộn", "score_acceleration": 86, "score_range": 94, "score_safety": 94, "score_luxury": 91, "score_handling": 92, "tag": "Shooting Brake Độc Bản", "badge": "GIỚI HẠN 50 XE"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (7, 4, N'Plus AWD (402 HP)', 2026, N'Tự động điện tử', N'Thuần Điện', 5, CAST(1499000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 447, CAST(87.70 AS Numeric(6, 2)), N'{"dong_co": "2 Motor Điện (AWD 2 cầu)", "tang_toc": "5.5", "cong_suat": "402 HP (300 kW)", "mo_men_xoan": "620", "toc_do_toi_da": "200", "tam_chay": "471", "tam_chay_sub": "Pin CATL 87.7 kWh đạt chuẩn WLTP", "sac": "10 - 70% trong 24 phút (250kW)", "kich_thuoc": "4.750 x 1.934 x 1.667", "chieu_dai_co_so": "2.950", "khoang_hanh_ly": "500 Lít", "trong_luong": "2.600 kg", "he_thong_treo": "Độc lập trước sau đa liên kết", "adas": "VinFast ADAS Level 2 & 11 túi khí", "am_thanh": "10 loa cao cấp tích hợp trợ lý ViVi", "mui_xe": "Cửa sổ trời toàn cảnh mở điện", "mam_xe": "20 inch hợp kim đa chấu", "chat_lieu_ghe": "Da nhân tạo cao cấp chỉnh điện 12 hướng", "score_acceleration": 74, "score_range": 78, "score_safety": 92, "score_luxury": 82, "score_handling": 75, "tag": "SUV Điện Thông Minh", "badge": "BÁN CHẠY NHẤT"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (8, 5, N'Plus 6 Chỗ Ghế Cơ Trưởng', 2026, N'Tự động điện tử', N'Thuần Điện', 6, CAST(2199000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 602, CAST(123.00 AS Numeric(6, 2)), N'{"dong_co": "2 Motor Điện AWD", "tang_toc": "6.5", "cong_suat": "402 HP (300 kW)", "mo_men_xoan": "620", "toc_do_toi_da": "200", "tam_chay": "602", "tam_chay_sub": "Pin 123 kWh SDI thế hệ mới", "sac": "10 - 70% trong 26 phút (250kW)", "kich_thuoc": "5.118 x 2.254 x 1.696", "chieu_dai_co_so": "3.150", "khoang_hanh_ly": "500 Lít", "trong_luong": "2.830 kg", "he_thong_treo": "Khí nén thích ứng chủ động", "adas": "VinFast ADAS Level 2 & Trợ lý ViVi", "am_thanh": "13 loa cao cấp vòm 3D", "mui_xe": "Kính trần toàn cảnh Panoramic", "mam_xe": "21 inch hợp kim 2 tông màu", "chat_lieu_ghe": "Ghế cơ trưởng Captain Seats massage & thông gió", "score_acceleration": 72, "score_range": 88, "score_safety": 95, "score_luxury": 89, "score_handling": 78, "tag": "SUV Full-Size Hạng E", "badge": "GHẾ CƠ TRƯỞNG"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (9, 6, N'1.6T Hybrid AWD Calligraphy', 2026, N'Tự động 6 cấp', N'Hybrid Xăng-Điện', 6, CAST(1369000000 AS Decimal(18, 0)), CAST(10000000 AS Decimal(18, 0)), NULL, NULL, N'{"dong_co": "Smartstream 1.6T-GDi HEV + HTRAC AWD", "tang_toc": "8.2", "cong_suat": "230 HP (169 kW)", "mo_men_xoan": "350", "toc_do_toi_da": "190", "tam_chay": "850", "tam_chay_sub": "Đầy bình 67 Lít xăng + Hybrid", "sac": "Xăng 5.5L/100km (Tự sạc khi phanh)", "kich_thuoc": "4.830 x 1.900 x 1.770", "chieu_dai_co_so": "2.815", "khoang_hanh_ly": "725 Lít", "trong_luong": "1.920 kg", "he_thong_treo": "McPherson / Đa liên kết", "adas": "Hyundai SmartSense ADAS đầy đủ", "am_thanh": "Bose 12 loa cao cấp", "mui_xe": "Cửa sổ trời đôi Dual Sunroof", "mam_xe": "20 inch hợp kim đa chấu phay bóng", "chat_lieu_ghe": "Da Nappa cao cấp ghế cơ trưởng 6 chỗ", "score_acceleration": 68, "score_range": 92, "score_safety": 90, "score_luxury": 86, "score_handling": 76, "tag": "Hybrid Tiết Kiệm Xăng", "badge": "BẢN CALLIGRAPHY"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (10, 7, N'Ford Everest Titanium+ 4x4', 2026, N'Tự động 10 cấp', N'Dầu Bi-Turbo', 7, CAST(1468000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), NULL, NULL, N'{"dong_co": "2.0L Bi-Turbo Diesel + 4WD 2 Cầu", "tang_toc": "9.5", "cong_suat": "210 PS (154 kW)", "mo_men_xoan": "500", "toc_do_toi_da": "180", "tam_chay": "820", "tam_chay_sub": "Bình nhiên liệu dầu 80 Lít đường trường", "sac": "Dầu 8.0L/100km (Bình 80 Lít)", "kich_thuoc": "4.914 x 1.923 x 1.842", "chieu_dai_co_so": "2.900", "khoang_hanh_ly": "586 Lít (Mở rộng 1.796L)", "trong_luong": "2.450 kg", "he_thong_treo": "Độc lập trước / Lò xo trụ sau liên kết Watt", "adas": "Ford Co-Pilot360 hỗ trợ đỗ xe tự động", "am_thanh": "Bang & Olufsen 12 loa siêu trầm", "mui_xe": "Cửa sổ trời toàn cảnh Panorama", "mam_xe": "20 inch hợp kim đa chấu", "chat_lieu_ghe": "Da cao cấp đen Ebony chỉnh điện 10 hướng", "score_acceleration": 65, "score_range": 90, "score_safety": 93, "score_luxury": 85, "score_handling": 84, "tag": "SUV 7 Chỗ Địa Hình", "badge": "TITANIUM+ 4WD"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (11, 4, N'VinFast VF8 Eco AWD', 2026, N'Tự động 2 cầu điện tử', N'Thuần điện EV 400V', 5, CAST(1099000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 420, CAST(87.70 AS Numeric(6, 2)), N'{"dong_co": "2 Motor Điện (AWD 2 cầu)", "tang_toc": "5.9", "cong_suat": "349 HP (260 kW)", "mo_men_xoan": "500", "toc_do_toi_da": "200", "tam_chay": "420", "sac": "10 - 70% trong 24 phút (250kW)", "kich_thuoc": "4.750 x 1.934 x 1.667", "chieu_dai_co_so": "2.950", "khoang_hanh_ly": "500 Lít", "trong_luong": "2.540 kg", "he_thong_treo": "Độc lập trước sau đa liên kết", "adas": "Trợ lý ảo ViVi & ADAS Lv2", "am_thanh": "8 loa tiêu chuẩn", "mui_xe": "Mui cứng cách âm", "mam_xe": "19 inch hợp kim", "chat_lieu_ghe": "Da công nghiệp chỉnh điện 8 hướng", "score_acceleration": 70, "score_range": 72, "score_safety": 88, "score_luxury": 78, "score_handling": 72, "tag": "SUV Tiêu Chuẩn Thông Minh", "badge": "BẢN ECO"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (12, 5, N'VinFast VF9 Eco 7 Chỗ', 2026, N'Tự động 2 cầu điện tử', N'Thuần điện EV 400V', 7, CAST(1499000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 438, CAST(123.00 AS Numeric(6, 2)), N'{"dong_co": "2 Motor Điện AWD", "tang_toc": "6.8", "cong_suat": "402 HP (300 kW)", "mo_men_xoan": "620", "toc_do_toi_da": "200", "tam_chay": "438", "sac": "10 - 70% trong 26 phút (250kW)", "kich_thuoc": "5.118 x 2.254 x 1.696", "chieu_dai_co_so": "3.150", "khoang_hanh_ly": "500 Lít", "trong_luong": "2.790 kg", "he_thong_treo": "Khí nén thích ứng", "adas": "Trợ lý ảo ViVi & HUD kính lái", "am_thanh": "11 loa cao cấp", "mui_xe": "Mui kính Panorama", "mam_xe": "20 inch hợp kim", "chat_lieu_ghe": "Da công nghiệp 7 chỗ ngồi tiện nghi", "score_acceleration": 69, "score_range": 75, "score_safety": 92, "score_luxury": 84, "score_handling": 75, "tag": "SUV 7 Chỗ Cỡ Lớn", "badge": "7 CHỖ GIA ĐÌNH"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (13, 6, N'Hyundai SantaFe Exclusive Hybrid', 2026, N'Tự động 6 cấp điện tử', N'Hybrid Xăng-Điện Tự Sạc', 7, CAST(1199000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 820, NULL, N'{"dong_co": "1.6T SmartStream HEV Hybrid", "tang_toc": "8.5", "cong_suat": "230 HP (169 kW)", "mo_men_xoan": "350", "toc_do_toi_da": "190", "tam_chay": "820", "sac": "Xăng 5.7L/100km", "kich_thuoc": "4.830 x 1.900 x 1.770", "chieu_dai_co_so": "2.815", "khoang_hanh_ly": "725 Lít", "trong_luong": "1.890 kg", "he_thong_treo": "McPherson / Đa liên kết", "adas": "Gói an toàn Hyundai SmartSense", "am_thanh": "6 loa tiêu chuẩn âm thanh chân thực", "mui_xe": "Mui kín cách âm", "mam_xe": "18 inch hợp kim", "chat_lieu_ghe": "Da cao cấp 7 chỗ ngồi", "score_acceleration": 66, "score_range": 90, "score_safety": 88, "score_luxury": 82, "score_handling": 74, "tag": "SUV 7 Chỗ Hybrid", "badge": "EXCLUSIVE"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (14, 7, N'Ford Everest Sport 4x2', 2026, N'Tự động 6 cấp', N'Động cơ Diesel Single-Turbo', 7, CAST(1178000000 AS Decimal(18, 0)), CAST(20000000 AS Decimal(18, 0)), 780, NULL, N'{"dong_co": "2.0L Single Turbo Diesel 4x2", "tang_toc": "9.8", "cong_suat": "170 PS (125 kW)", "mo_men_xoan": "405", "toc_do_toi_da": "175", "tam_chay": "780", "sac": "Dầu 7.6L/100km", "kich_thuoc": "4.914 x 1.923 x 1.842", "chieu_dai_co_so": "2.900", "khoang_hanh_ly": "586 Lít", "trong_luong": "2.310 kg", "he_thong_treo": "Độc lập trước / Lò xo trụ sau", "adas": "Camera lùi & Cảnh báo điểm mù", "am_thanh": "8 loa âm thanh vòm", "mui_xe": "Mui sơn đen thể thao", "mam_xe": "20 inch sơn đen bóng Sport", "chat_lieu_ghe": "Da kết hợp nỉ thể thao dập nổi Sport", "score_acceleration": 60, "score_range": 85, "score_safety": 89, "score_luxury": 80, "score_handling": 78, "tag": "SUV Thể Thao Đô Thị", "badge": "BẢN SPORT"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (17, 9, N'e:HEV RS Hybrid', 2026, N'e-CVT điện tử', N'Hybrid', 5, CAST(1259000000 AS Decimal(18, 0)), CAST(10000000 AS Decimal(18, 0)), 920, CAST(1.06 AS Numeric(6, 2)), N'{"dong_co": "2.0L DOHC i-VTEC + 2 Motor Điện", "tang_toc": "7.9", "tang_toc_sub": "Đề pa tức thì với motor điện", "cong_suat": "204 HP (150 kW)", "mo_men_xoan": "335", "toc_do_toi_da": "190", "tam_chay": "920", "tam_chay_sub": "Tiết kiệm nhiên liệu hàng đầu", "sac": "Xăng 3.4L/100km (Nội đô)", "sac_sub": "Chu trình Atkinson hiệu suất cao", "kich_thuoc": "4.691 x 1.866 x 1.681", "chieu_dai_co_so": "2.700", "khoang_hanh_ly": "574 Lít (Rộng rãi nhất C-SUV)", "trong_luong": "1.765 kg", "he_thong_treo": "Độc lập MacPherson / Đa liên kết", "adas": "Honda SENSING & Camera LaneWatch", "am_thanh": "Bose 12 loa cao cấp Subwoofer", "mui_xe": "Cửa sổ trời toàn cảnh Panorama", "mam_xe": "18 inch hợp kim đen thể thao RS", "chat_lieu_ghe": "Da cao cấp khâu chỉ đỏ phong cách RS", "score_acceleration": 75, "score_range": 95, "score_safety": 92, "score_luxury": 88, "score_handling": 85, "tag": "C-SUV Tiết Kiệm Xăng", "badge": "BẢN RS HYBRID"}', 1, 0)
GO
INSERT [dbo].[phien_ban_xe] ([id], [dong_xe_id], [ten_phien_ban], [nam_san_xuat], [hop_so], [loai_nhien_lieu], [so_cho_ngoi], [gia_niem_yet], [muc_tien_coc], [tam_hoat_dong_km], [dung_luong_pin_kwh], [thong_so_ky_thuat], [dang_hoat_dong], [is_deleted]) VALUES (18, 9, N'1.5L Turbo L AWD', 2026, N'CVT vô cấp', N'Xăng 1.5L VTEC Turbo', 7, CAST(1159000000 AS Decimal(18, 0)), CAST(10000000 AS Decimal(18, 0)), 750, NULL, N'{"dong_co": "1.5L DOHC VTEC Turbo + Real Time AWD", "tang_toc": "8.8", "cong_suat": "188 HP (138 kW)", "mo_men_xoan": "240", "toc_do_toi_da": "200", "tam_chay": "750", "sac": "Xăng 7.8L/100km", "kich_thuoc": "4.691 x 1.866 x 1.681", "chieu_dai_co_so": "2.700", "khoang_hanh_ly": "574 Lít (Cấu hình 7 chỗ)", "trong_luong": "1.720 kg", "he_thong_treo": "Độc lập MacPherson / Đa liên kết", "adas": "Honda SENSING & 8 túi khí an toàn", "am_thanh": "8 loa công suất cao", "mui_xe": "Cửa sổ trời Panorama chỉnh điện", "mam_xe": "18 inch hợp kim đa chấu phay bóng", "chat_lieu_ghe": "Da cao cấp đen chỉnh điện 8 hướng", "score_acceleration": 68, "score_range": 85, "score_safety": 90, "score_luxury": 83, "score_handling": 80, "tag": "C-SUV 7 Chỗ AWD", "badge": "BẢN TURBO L"}', 1, 0)
GO
SET IDENTITY_INSERT [dbo].[phien_ban_xe] OFF
GO
SET IDENTITY_INSERT [dbo].[phieu_dat_coc] ON 

GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (1, N'DEP-GTE-2026-8812', 8, 1, 3, N'001201009988', CAST(50000 AS Decimal(18, 0)), CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-09T23:13:58.0000000' AS DateTime2), CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-11T22:58:58.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-10T20:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (2, N'DEP-VF8-2026-8841', 6, 5, 5, N'001202008819', CAST(50000 AS Decimal(18, 0)), CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-09T23:38:58.0000000' AS DateTime2), CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-12T22:58:58.0000000' AS DateTime2), N'REFUND_REQUESTED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (3, N'DEP-STF-2026-8832', 7, 3, 4, N'079195004321', CAST(30000 AS Decimal(18, 0)), CAST(N'2026-11-07T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-08T04:18:58.0000000' AS DateTime2), CAST(N'2026-11-07T22:58:58.0000000' AS DateTime2), CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), N'REFUNDED', CAST(N'2026-11-10T16:58:58.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (4, N'DEP-973728', 9, 1, NULL, N'079201009988', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-13T20:02:54.0000000' AS DateTime2), CAST(N'2026-11-13T20:17:54.0000000' AS DateTime2), CAST(N'2026-11-14T00:53:16.0000000' AS DateTime2), CAST(N'2026-11-17T00:53:16.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (31, N'DEP-2026-CMP001', 6, 15, 1, N'079204005511', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-09T17:00:00.0000000' AS DateTime2), CAST(N'2026-11-09T17:15:00.0000000' AS DateTime2), CAST(N'2026-11-09T17:08:00.0000000' AS DateTime2), CAST(N'2026-11-12T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-12T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (32, N'DEP-2026-CMP002', 7, 15, 1, N'079204008094', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-08T15:00:00.0000000' AS DateTime2), CAST(N'2026-11-08T15:15:00.0000000' AS DateTime2), CAST(N'2026-11-08T15:08:00.0000000' AS DateTime2), CAST(N'2026-11-11T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-11T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (33, N'DEP-2026-CMP003', 8, 15, 1, N'079204006785', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-07T12:00:00.0000000' AS DateTime2), CAST(N'2026-11-07T12:15:00.0000000' AS DateTime2), CAST(N'2026-11-07T12:08:00.0000000' AS DateTime2), CAST(N'2026-11-10T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-09T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (34, N'DEP-2026-CMP004', 9, 15, 1, N'079204007205', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-06T16:00:00.0000000' AS DateTime2), CAST(N'2026-11-06T16:15:00.0000000' AS DateTime2), CAST(N'2026-11-06T16:08:00.0000000' AS DateTime2), CAST(N'2026-11-09T16:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-08T16:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (35, N'DEP-2026-CMP005', 5, 16, 1, N'079204002706', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-05T18:00:00.0000000' AS DateTime2), CAST(N'2026-11-05T18:15:00.0000000' AS DateTime2), CAST(N'2026-11-05T18:08:00.0000000' AS DateTime2), CAST(N'2026-11-08T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-08T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (36, N'DEP-2026-CMP006', 6, 16, 1, N'079204009414', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-04T19:00:00.0000000' AS DateTime2), CAST(N'2026-11-04T19:15:00.0000000' AS DateTime2), CAST(N'2026-11-04T19:08:00.0000000' AS DateTime2), CAST(N'2026-11-07T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-07T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (37, N'DEP-2026-CMP007', 7, 16, 1, N'079204008403', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-11-03T15:00:00.0000000' AS DateTime2), CAST(N'2026-11-03T15:15:00.0000000' AS DateTime2), CAST(N'2026-11-03T15:08:00.0000000' AS DateTime2), CAST(N'2026-11-06T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-06T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (38, N'DEP-2026-CMP008', 8, 16, 1, N'079204009819', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-02T13:00:00.0000000' AS DateTime2), CAST(N'2026-11-02T13:15:00.0000000' AS DateTime2), CAST(N'2026-11-02T13:08:00.0000000' AS DateTime2), CAST(N'2026-11-05T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-05T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (39, N'DEP-2026-CMP009', 9, 16, 1, N'079204004473', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-02T12:00:00.0000000' AS DateTime2), CAST(N'2026-11-02T12:15:00.0000000' AS DateTime2), CAST(N'2026-11-02T12:08:00.0000000' AS DateTime2), CAST(N'2026-11-05T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-03T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (40, N'DEP-2026-CMP010', 5, 17, 1, N'079204005230', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-01T21:00:00.0000000' AS DateTime2), CAST(N'2026-11-01T21:15:00.0000000' AS DateTime2), CAST(N'2026-11-01T21:08:00.0000000' AS DateTime2), CAST(N'2026-11-04T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-02T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (41, N'DEP-2026-CMP011', 6, 17, 1, N'079204004293', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-31T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-31T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-31T18:08:00.0000000' AS DateTime2), CAST(N'2026-11-03T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-11-02T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (42, N'DEP-2026-CMP012', 7, 17, 1, N'079204006607', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-30T21:00:00.0000000' AS DateTime2), CAST(N'2026-10-30T21:15:00.0000000' AS DateTime2), CAST(N'2026-10-30T21:08:00.0000000' AS DateTime2), CAST(N'2026-11-02T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-31T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (43, N'DEP-2026-CMP013', 8, 17, 1, N'079204006586', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-29T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-29T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-29T18:08:00.0000000' AS DateTime2), CAST(N'2026-11-01T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-30T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (44, N'DEP-2026-CMP014', 9, 17, 1, N'079204002432', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-28T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-28T12:15:00.0000000' AS DateTime2), CAST(N'2026-10-28T12:08:00.0000000' AS DateTime2), CAST(N'2026-10-31T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-30T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (45, N'DEP-2026-CMP015', 5, 18, 1, N'079204009593', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-27T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-27T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-27T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-30T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-29T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (46, N'DEP-2026-CMP016', 6, 18, 1, N'079204008243', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-26T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-26T20:15:00.0000000' AS DateTime2), CAST(N'2026-10-26T20:08:00.0000000' AS DateTime2), CAST(N'2026-10-29T20:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-28T20:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (47, N'DEP-2026-CMP017', 7, 18, 1, N'079204006055', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-25T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-25T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-25T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-28T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-27T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (48, N'DEP-2026-CMP018', 8, 18, 1, N'079204007792', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-25T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-25T19:15:00.0000000' AS DateTime2), CAST(N'2026-10-25T19:08:00.0000000' AS DateTime2), CAST(N'2026-10-28T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-26T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (49, N'DEP-2026-CMP019', 9, 18, 1, N'079204007096', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-24T14:00:00.0000000' AS DateTime2), CAST(N'2026-10-24T14:15:00.0000000' AS DateTime2), CAST(N'2026-10-24T14:08:00.0000000' AS DateTime2), CAST(N'2026-10-27T14:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-26T14:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (50, N'DEP-2026-CMP020', 5, 3, 1, N'079204003520', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-23T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-23T13:15:00.0000000' AS DateTime2), CAST(N'2026-10-23T13:08:00.0000000' AS DateTime2), CAST(N'2026-10-26T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-24T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (51, N'DEP-2026-CMP021', 6, 4, 1, N'079204008777', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-22T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-22T13:15:00.0000000' AS DateTime2), CAST(N'2026-10-22T13:08:00.0000000' AS DateTime2), CAST(N'2026-10-25T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-24T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (52, N'DEP-2026-CMP022', 7, 5, 1, N'079204009693', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-21T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-21T13:15:00.0000000' AS DateTime2), CAST(N'2026-10-21T13:08:00.0000000' AS DateTime2), CAST(N'2026-10-24T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-24T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (53, N'DEP-2026-CMP023', 8, 6, 1, N'079204004979', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-20T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-20T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-20T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-23T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-21T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (54, N'DEP-2026-CMP024', 9, 1, 1, N'079204002147', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-19T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-19T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-19T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-22T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-22T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (55, N'DEP-2026-CMP025', 5, 2, 1, N'079204004432', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-18T21:00:00.0000000' AS DateTime2), CAST(N'2026-10-18T21:15:00.0000000' AS DateTime2), CAST(N'2026-10-18T21:08:00.0000000' AS DateTime2), CAST(N'2026-10-21T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-20T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (56, N'DEP-2026-CMP026', 6, 3, 1, N'079204004092', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-18T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-18T15:15:00.0000000' AS DateTime2), CAST(N'2026-10-18T15:08:00.0000000' AS DateTime2), CAST(N'2026-10-21T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-19T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (57, N'DEP-2026-CMP027', 7, 4, 1, N'079204009112', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-17T14:00:00.0000000' AS DateTime2), CAST(N'2026-10-17T14:15:00.0000000' AS DateTime2), CAST(N'2026-10-17T14:08:00.0000000' AS DateTime2), CAST(N'2026-10-20T14:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-20T14:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (58, N'DEP-2026-CMP028', 8, 5, 1, N'079204009755', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-16T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-16T17:15:00.0000000' AS DateTime2), CAST(N'2026-10-16T17:08:00.0000000' AS DateTime2), CAST(N'2026-10-19T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-18T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (59, N'DEP-2026-CMP029', 9, 6, 1, N'079204005517', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-15T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-15T17:15:00.0000000' AS DateTime2), CAST(N'2026-10-15T17:08:00.0000000' AS DateTime2), CAST(N'2026-10-18T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-17T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (60, N'DEP-2026-CMP030', 5, 1, 1, N'079204008113', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-14T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-14T17:15:00.0000000' AS DateTime2), CAST(N'2026-10-14T17:08:00.0000000' AS DateTime2), CAST(N'2026-10-17T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-17T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (61, N'DEP-2026-CMP031', 6, 2, 1, N'079204007921', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-13T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-13T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-13T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-16T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-15T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (62, N'DEP-2026-CMP032', 7, 3, 1, N'079204001723', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-12T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-12T19:15:00.0000000' AS DateTime2), CAST(N'2026-10-12T19:08:00.0000000' AS DateTime2), CAST(N'2026-10-15T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-15T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (63, N'DEP-2026-CMP033', 8, 4, 1, N'079204005925', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-11T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-11T12:15:00.0000000' AS DateTime2), CAST(N'2026-10-11T12:08:00.0000000' AS DateTime2), CAST(N'2026-10-14T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-14T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (64, N'DEP-2026-CMP034', 9, 5, 1, N'079204009937', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-10T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-10T13:15:00.0000000' AS DateTime2), CAST(N'2026-10-10T13:08:00.0000000' AS DateTime2), CAST(N'2026-10-13T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-12T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (65, N'DEP-2026-CMP035', 5, 6, 1, N'079204002276', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-10T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-10T15:15:00.0000000' AS DateTime2), CAST(N'2026-10-10T15:08:00.0000000' AS DateTime2), CAST(N'2026-10-13T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-13T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (66, N'DEP-2026-CMP036', 6, 1, 1, N'079204007875', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-09T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-09T19:15:00.0000000' AS DateTime2), CAST(N'2026-10-09T19:08:00.0000000' AS DateTime2), CAST(N'2026-10-12T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-11T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (67, N'DEP-2026-CMP037', 7, 2, 1, N'079204001396', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-08T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-08T17:15:00.0000000' AS DateTime2), CAST(N'2026-10-08T17:08:00.0000000' AS DateTime2), CAST(N'2026-10-11T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-11T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (68, N'DEP-2026-CMP038', 8, 3, 1, N'079204002952', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-07T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-07T15:15:00.0000000' AS DateTime2), CAST(N'2026-10-07T15:08:00.0000000' AS DateTime2), CAST(N'2026-10-10T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-08T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (69, N'DEP-2026-CMP039', 9, 4, 1, N'079204004981', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-06T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-06T12:15:00.0000000' AS DateTime2), CAST(N'2026-10-06T12:08:00.0000000' AS DateTime2), CAST(N'2026-10-09T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-09T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (70, N'DEP-2026-CMP040', 5, 5, 1, N'079204007704', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-10-05T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-05T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-05T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-08T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-06T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (71, N'DEP-2026-CMP041', 6, 6, 1, N'079204001055', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-04T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-04T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-04T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-07T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-07T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (72, N'DEP-2026-CMP042', 7, 1, 1, N'079204003029', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-03T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-03T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-03T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-06T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-05T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (73, N'DEP-2026-CMP043', 8, 2, 1, N'079204002627', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-10-02T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-02T12:15:00.0000000' AS DateTime2), CAST(N'2026-10-02T12:08:00.0000000' AS DateTime2), CAST(N'2026-10-05T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-04T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (74, N'DEP-2026-CMP044', 9, 3, 1, N'079204008093', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-02T13:00:00.0000000' AS DateTime2), CAST(N'2026-10-02T13:15:00.0000000' AS DateTime2), CAST(N'2026-10-02T13:08:00.0000000' AS DateTime2), CAST(N'2026-10-05T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-05T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (75, N'DEP-2026-CMP045', 5, 4, 1, N'079204007979', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-01T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-01T20:15:00.0000000' AS DateTime2), CAST(N'2026-10-01T20:08:00.0000000' AS DateTime2), CAST(N'2026-10-04T20:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-02T20:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (76, N'DEP-2026-CMP046', 6, 5, 1, N'079204007987', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-30T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-30T18:15:00.0000000' AS DateTime2), CAST(N'2026-09-30T18:08:00.0000000' AS DateTime2), CAST(N'2026-10-03T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-01T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (77, N'DEP-2026-CMP047', 7, 6, 1, N'079204008531', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-29T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-29T19:15:00.0000000' AS DateTime2), CAST(N'2026-09-29T19:08:00.0000000' AS DateTime2), CAST(N'2026-10-02T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-30T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (78, N'DEP-2026-CMP048', 8, 1, 1, N'079204008298', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-28T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-28T16:15:00.0000000' AS DateTime2), CAST(N'2026-09-28T16:08:00.0000000' AS DateTime2), CAST(N'2026-10-01T16:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-10-01T16:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (79, N'DEP-2026-CMP049', 9, 2, 1, N'079204009288', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-27T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-27T17:15:00.0000000' AS DateTime2), CAST(N'2026-09-27T17:08:00.0000000' AS DateTime2), CAST(N'2026-09-30T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-29T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (80, N'DEP-2026-CMP050', 5, 3, 1, N'079204004644', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-26T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-26T14:15:00.0000000' AS DateTime2), CAST(N'2026-09-26T14:08:00.0000000' AS DateTime2), CAST(N'2026-09-29T14:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-28T14:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (81, N'DEP-2026-CMP051', 6, 4, 1, N'079204006224', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-25T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-28T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-28T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (82, N'DEP-2026-CMP052', 7, 5, 1, N'079204003564', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-25T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-28T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-26T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (83, N'DEP-2026-CMP053', 8, 6, 1, N'079204009181', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-24T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-24T14:15:00.0000000' AS DateTime2), CAST(N'2026-09-24T14:08:00.0000000' AS DateTime2), CAST(N'2026-09-27T14:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-26T14:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (84, N'DEP-2026-CMP054', 9, 1, 1, N'079204007139', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-23T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-23T17:15:00.0000000' AS DateTime2), CAST(N'2026-09-23T17:08:00.0000000' AS DateTime2), CAST(N'2026-09-26T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-24T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (85, N'DEP-2026-CMP055', 5, 2, 1, N'079204008158', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-22T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-22T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-22T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-25T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-23T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (86, N'DEP-2026-CMP056', 6, 3, 1, N'079204005467', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-21T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-21T21:15:00.0000000' AS DateTime2), CAST(N'2026-09-21T21:08:00.0000000' AS DateTime2), CAST(N'2026-09-24T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-22T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (87, N'DEP-2026-CMP057', 7, 4, 1, N'079204007760', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-20T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-20T13:15:00.0000000' AS DateTime2), CAST(N'2026-09-20T13:08:00.0000000' AS DateTime2), CAST(N'2026-09-23T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-23T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (88, N'DEP-2026-CMP058', 8, 5, 1, N'079204009593', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-19T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-19T12:15:00.0000000' AS DateTime2), CAST(N'2026-09-19T12:08:00.0000000' AS DateTime2), CAST(N'2026-09-22T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-20T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (89, N'DEP-2026-CMP059', 9, 6, 1, N'079204008584', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-18T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-18T19:15:00.0000000' AS DateTime2), CAST(N'2026-09-18T19:08:00.0000000' AS DateTime2), CAST(N'2026-09-21T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-21T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (90, N'DEP-2026-CMP060', 5, 1, 1, N'079204002745', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-17T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-17T13:15:00.0000000' AS DateTime2), CAST(N'2026-09-17T13:08:00.0000000' AS DateTime2), CAST(N'2026-09-20T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-19T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (91, N'DEP-2026-CMP061', 6, 2, 1, N'079204008556', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-17T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-17T18:15:00.0000000' AS DateTime2), CAST(N'2026-09-17T18:08:00.0000000' AS DateTime2), CAST(N'2026-09-20T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-20T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (92, N'DEP-2026-CMP062', 7, 3, 1, N'079204008826', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-16T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-16T14:15:00.0000000' AS DateTime2), CAST(N'2026-09-16T14:08:00.0000000' AS DateTime2), CAST(N'2026-09-19T14:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-18T14:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (93, N'DEP-2026-CMP063', 8, 4, 1, N'079204005239', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-15T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-15T19:15:00.0000000' AS DateTime2), CAST(N'2026-09-15T19:08:00.0000000' AS DateTime2), CAST(N'2026-09-18T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-18T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (94, N'DEP-2026-CMP064', 9, 5, 1, N'079204003969', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-14T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-14T21:15:00.0000000' AS DateTime2), CAST(N'2026-09-14T21:08:00.0000000' AS DateTime2), CAST(N'2026-09-17T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-15T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (95, N'DEP-2026-CMP065', 5, 6, 1, N'079204004789', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-13T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-13T12:15:00.0000000' AS DateTime2), CAST(N'2026-09-13T12:08:00.0000000' AS DateTime2), CAST(N'2026-09-16T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-16T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (96, N'DEP-2026-CMP066', 6, 1, 1, N'079204002937', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-12T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-12T13:15:00.0000000' AS DateTime2), CAST(N'2026-09-12T13:08:00.0000000' AS DateTime2), CAST(N'2026-09-15T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-15T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (97, N'DEP-2026-CMP067', 7, 2, 1, N'079204003189', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-11T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-11T19:15:00.0000000' AS DateTime2), CAST(N'2026-09-11T19:08:00.0000000' AS DateTime2), CAST(N'2026-09-14T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-12T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (98, N'DEP-2026-CMP068', 8, 3, 1, N'079204007509', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-10T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-10T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-10T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-13T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-11T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (99, N'DEP-2026-CMP069', 9, 4, 1, N'079204003399', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-09T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-09T19:15:00.0000000' AS DateTime2), CAST(N'2026-09-09T19:08:00.0000000' AS DateTime2), CAST(N'2026-09-12T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-11T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (100, N'DEP-2026-CMP070', 5, 5, 1, N'079204005657', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-09T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-09T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-09T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-12T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-12T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (101, N'DEP-2026-CMP071', 6, 6, 1, N'079204007746', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-08T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-08T13:15:00.0000000' AS DateTime2), CAST(N'2026-09-08T13:08:00.0000000' AS DateTime2), CAST(N'2026-09-11T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-11T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (102, N'DEP-2026-CMP072', 7, 1, 1, N'079204008567', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-07T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-07T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-07T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-10T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-09T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (103, N'DEP-2026-CMP073', 8, 2, 1, N'079204007185', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-06T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-06T21:15:00.0000000' AS DateTime2), CAST(N'2026-09-06T21:08:00.0000000' AS DateTime2), CAST(N'2026-09-09T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-08T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (104, N'DEP-2026-CMP074', 9, 3, 1, N'079204006273', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-09-05T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-05T12:15:00.0000000' AS DateTime2), CAST(N'2026-09-05T12:08:00.0000000' AS DateTime2), CAST(N'2026-09-08T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-06T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (105, N'DEP-2026-CMP075', 5, 4, 1, N'079204005702', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-04T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-04T16:15:00.0000000' AS DateTime2), CAST(N'2026-09-04T16:08:00.0000000' AS DateTime2), CAST(N'2026-09-07T16:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-05T16:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (106, N'DEP-2026-CMP076', 6, 5, 1, N'079204008711', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-03T15:00:00.0000000' AS DateTime2), CAST(N'2026-09-03T15:15:00.0000000' AS DateTime2), CAST(N'2026-09-03T15:08:00.0000000' AS DateTime2), CAST(N'2026-09-06T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-05T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (107, N'DEP-2026-CMP077', 7, 6, 1, N'079204009768', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-02T19:00:00.0000000' AS DateTime2), CAST(N'2026-09-02T19:15:00.0000000' AS DateTime2), CAST(N'2026-09-02T19:08:00.0000000' AS DateTime2), CAST(N'2026-09-05T19:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-04T19:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (108, N'DEP-2026-CMP078', 8, 1, 1, N'079204009366', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-09-02T21:00:00.0000000' AS DateTime2), CAST(N'2026-09-02T21:15:00.0000000' AS DateTime2), CAST(N'2026-09-02T21:08:00.0000000' AS DateTime2), CAST(N'2026-09-05T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-04T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (109, N'DEP-2026-CMP079', 9, 2, 1, N'079204006863', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-01T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-01T17:15:00.0000000' AS DateTime2), CAST(N'2026-09-01T17:08:00.0000000' AS DateTime2), CAST(N'2026-09-04T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-02T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (110, N'DEP-2026-CMP080', 5, 3, 1, N'079204002202', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-31T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-31T12:15:00.0000000' AS DateTime2), CAST(N'2026-08-31T12:08:00.0000000' AS DateTime2), CAST(N'2026-09-03T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-01T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (111, N'DEP-2026-CMP081', 6, 4, 1, N'079204009345', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-30T16:00:00.0000000' AS DateTime2), CAST(N'2026-08-30T16:15:00.0000000' AS DateTime2), CAST(N'2026-08-30T16:08:00.0000000' AS DateTime2), CAST(N'2026-09-02T16:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-01T16:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (112, N'DEP-2026-CMP082', 7, 5, 1, N'079204001543', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-08-29T17:00:00.0000000' AS DateTime2), CAST(N'2026-08-29T17:15:00.0000000' AS DateTime2), CAST(N'2026-08-29T17:08:00.0000000' AS DateTime2), CAST(N'2026-09-01T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-09-01T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (113, N'DEP-2026-CMP083', 8, 6, 1, N'079204007668', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-08-28T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-28T12:15:00.0000000' AS DateTime2), CAST(N'2026-08-28T12:08:00.0000000' AS DateTime2), CAST(N'2026-08-31T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-29T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (114, N'DEP-2026-CMP084', 9, 1, 1, N'079204009222', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-27T13:00:00.0000000' AS DateTime2), CAST(N'2026-08-27T13:15:00.0000000' AS DateTime2), CAST(N'2026-08-27T13:08:00.0000000' AS DateTime2), CAST(N'2026-08-30T13:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-30T13:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (115, N'DEP-2026-CMP085', 5, 2, 1, N'079204007186', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-26T20:00:00.0000000' AS DateTime2), CAST(N'2026-08-26T20:15:00.0000000' AS DateTime2), CAST(N'2026-08-26T20:08:00.0000000' AS DateTime2), CAST(N'2026-08-29T20:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-29T20:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (116, N'DEP-2026-CMP086', 6, 3, 1, N'079204002037', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-25T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-25T12:15:00.0000000' AS DateTime2), CAST(N'2026-08-25T12:08:00.0000000' AS DateTime2), CAST(N'2026-08-28T12:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-26T12:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (117, N'DEP-2026-CMP087', 7, 4, 1, N'079204007474', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-25T20:00:00.0000000' AS DateTime2), CAST(N'2026-08-25T20:15:00.0000000' AS DateTime2), CAST(N'2026-08-25T20:08:00.0000000' AS DateTime2), CAST(N'2026-08-28T20:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-26T20:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (118, N'DEP-2026-CMP088', 8, 5, 1, N'079204006201', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-24T18:00:00.0000000' AS DateTime2), CAST(N'2026-08-24T18:15:00.0000000' AS DateTime2), CAST(N'2026-08-24T18:08:00.0000000' AS DateTime2), CAST(N'2026-08-27T18:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-27T18:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (119, N'DEP-2026-CMP089', 9, 6, 1, N'079204003620', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-23T17:00:00.0000000' AS DateTime2), CAST(N'2026-08-23T17:15:00.0000000' AS DateTime2), CAST(N'2026-08-23T17:08:00.0000000' AS DateTime2), CAST(N'2026-08-26T17:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-24T17:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (120, N'DEP-2026-CMP090', 5, 1, 1, N'079204003021', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-22T16:00:00.0000000' AS DateTime2), CAST(N'2026-08-22T16:15:00.0000000' AS DateTime2), CAST(N'2026-08-22T16:08:00.0000000' AS DateTime2), CAST(N'2026-08-25T16:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-24T16:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (121, N'DEP-2026-CMP091', 6, 2, 1, N'079204004195', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-21T14:00:00.0000000' AS DateTime2), CAST(N'2026-08-21T14:15:00.0000000' AS DateTime2), CAST(N'2026-08-21T14:08:00.0000000' AS DateTime2), CAST(N'2026-08-24T14:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-22T14:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (122, N'DEP-2026-CMP092', 7, 3, 1, N'079204004210', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-20T15:00:00.0000000' AS DateTime2), CAST(N'2026-08-20T15:15:00.0000000' AS DateTime2), CAST(N'2026-08-20T15:08:00.0000000' AS DateTime2), CAST(N'2026-08-23T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-23T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (123, N'DEP-2026-CMP093', 8, 4, 1, N'079204006985', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-08-19T21:00:00.0000000' AS DateTime2), CAST(N'2026-08-19T21:15:00.0000000' AS DateTime2), CAST(N'2026-08-19T21:08:00.0000000' AS DateTime2), CAST(N'2026-08-22T21:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-21T21:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (124, N'DEP-2026-CMP094', 9, 5, 1, N'079204005027', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-08-18T15:00:00.0000000' AS DateTime2), CAST(N'2026-08-18T15:15:00.0000000' AS DateTime2), CAST(N'2026-08-18T15:08:00.0000000' AS DateTime2), CAST(N'2026-08-21T15:08:00.0000000' AS DateTime2), N'COMPLETED', CAST(N'2026-08-19T15:08:00.0000000' AS DateTime2))
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (125, N'DEP-2026-LOS01', 6, 2, NULL, N'079204007783', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-11-05T13:00:00.0000000' AS DateTime2), CAST(N'2026-11-05T13:15:00.0000000' AS DateTime2), CAST(N'2026-11-05T13:10:00.0000000' AS DateTime2), CAST(N'2026-11-08T13:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (126, N'DEP-2026-LOS02', 7, 3, NULL, N'079204005768', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-11-02T17:00:00.0000000' AS DateTime2), CAST(N'2026-11-02T17:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (127, N'DEP-2026-LOS03', 8, 4, NULL, N'079204003028', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-30T11:00:00.0000000' AS DateTime2), CAST(N'2026-10-30T11:15:00.0000000' AS DateTime2), CAST(N'2026-10-30T11:10:00.0000000' AS DateTime2), CAST(N'2026-11-02T11:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (128, N'DEP-2026-LOS04', 9, 5, NULL, N'079204007921', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-27T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-27T17:15:00.0000000' AS DateTime2), CAST(N'2026-10-27T17:10:00.0000000' AS DateTime2), CAST(N'2026-10-30T17:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (129, N'DEP-2026-LOS05', 5, 6, NULL, N'079204003850', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-24T20:00:00.0000000' AS DateTime2), CAST(N'2026-10-24T20:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (130, N'DEP-2026-LOS06', 6, 1, NULL, N'079204003132', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-21T12:00:00.0000000' AS DateTime2), CAST(N'2026-10-21T12:15:00.0000000' AS DateTime2), CAST(N'2026-10-21T12:10:00.0000000' AS DateTime2), CAST(N'2026-10-24T12:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (131, N'DEP-2026-LOS07', 7, 2, NULL, N'079204003169', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-18T18:00:00.0000000' AS DateTime2), CAST(N'2026-10-18T18:15:00.0000000' AS DateTime2), CAST(N'2026-10-18T18:10:00.0000000' AS DateTime2), CAST(N'2026-10-21T18:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (132, N'DEP-2026-LOS08', 8, 3, NULL, N'079204006852', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-15T19:00:00.0000000' AS DateTime2), CAST(N'2026-10-15T19:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (133, N'DEP-2026-LOS09', 9, 4, NULL, N'079204006973', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-12T11:00:00.0000000' AS DateTime2), CAST(N'2026-10-12T11:15:00.0000000' AS DateTime2), CAST(N'2026-10-12T11:10:00.0000000' AS DateTime2), CAST(N'2026-10-15T11:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (134, N'DEP-2026-LOS10', 5, 5, NULL, N'079204005911', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-09T15:00:00.0000000' AS DateTime2), CAST(N'2026-10-09T15:15:00.0000000' AS DateTime2), CAST(N'2026-10-09T15:10:00.0000000' AS DateTime2), CAST(N'2026-10-12T15:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (135, N'DEP-2026-LOS11', 6, 6, NULL, N'079204008926', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-10-06T14:00:00.0000000' AS DateTime2), CAST(N'2026-10-06T14:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (136, N'DEP-2026-LOS12', 7, 1, NULL, N'079204005702', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-10-03T17:00:00.0000000' AS DateTime2), CAST(N'2026-10-03T17:15:00.0000000' AS DateTime2), CAST(N'2026-10-03T17:10:00.0000000' AS DateTime2), CAST(N'2026-10-06T17:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (137, N'DEP-2026-LOS13', 8, 2, NULL, N'079204005941', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-29T12:00:00.0000000' AS DateTime2), CAST(N'2026-09-29T12:15:00.0000000' AS DateTime2), CAST(N'2026-09-29T12:10:00.0000000' AS DateTime2), CAST(N'2026-10-02T12:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (138, N'DEP-2026-LOS14', 9, 3, NULL, N'079204003610', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-26T14:00:00.0000000' AS DateTime2), CAST(N'2026-09-26T14:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (139, N'DEP-2026-LOS15', 5, 4, NULL, N'079204007874', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-23T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-23T16:15:00.0000000' AS DateTime2), CAST(N'2026-09-23T16:10:00.0000000' AS DateTime2), CAST(N'2026-09-26T16:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (140, N'DEP-2026-LOS16', 6, 5, NULL, N'079204004628', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-20T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-20T18:15:00.0000000' AS DateTime2), CAST(N'2026-09-20T18:10:00.0000000' AS DateTime2), CAST(N'2026-09-23T18:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (141, N'DEP-2026-LOS17', 7, 6, NULL, N'079204007446', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-17T17:00:00.0000000' AS DateTime2), CAST(N'2026-09-17T17:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (142, N'DEP-2026-LOS18', 8, 1, NULL, N'079204009674', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-14T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-14T16:15:00.0000000' AS DateTime2), CAST(N'2026-09-14T16:10:00.0000000' AS DateTime2), CAST(N'2026-09-17T16:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (143, N'DEP-2026-LOS19', 9, 2, NULL, N'079204002023', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-11T13:00:00.0000000' AS DateTime2), CAST(N'2026-09-11T13:15:00.0000000' AS DateTime2), CAST(N'2026-09-11T13:10:00.0000000' AS DateTime2), CAST(N'2026-09-14T13:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (144, N'DEP-2026-LOS20', 5, 3, NULL, N'079204002133', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-09-08T20:00:00.0000000' AS DateTime2), CAST(N'2026-09-08T20:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (145, N'DEP-2026-LOS21', 6, 4, NULL, N'079204008992', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-05T16:00:00.0000000' AS DateTime2), CAST(N'2026-09-05T16:15:00.0000000' AS DateTime2), CAST(N'2026-09-05T16:10:00.0000000' AS DateTime2), CAST(N'2026-09-08T16:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (146, N'DEP-2026-LOS22', 7, 5, NULL, N'079204004297', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-09-02T18:00:00.0000000' AS DateTime2), CAST(N'2026-09-02T18:15:00.0000000' AS DateTime2), CAST(N'2026-09-02T18:10:00.0000000' AS DateTime2), CAST(N'2026-09-05T18:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (147, N'DEP-2026-LOS23', 8, 6, NULL, N'079204002926', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-08-30T12:00:00.0000000' AS DateTime2), CAST(N'2026-08-30T12:15:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (148, N'DEP-2026-LOS24', 9, 1, NULL, N'079204009776', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-08-27T14:00:00.0000000' AS DateTime2), CAST(N'2026-08-27T14:15:00.0000000' AS DateTime2), CAST(N'2026-08-27T14:10:00.0000000' AS DateTime2), CAST(N'2026-08-30T14:10:00.0000000' AS DateTime2), N'CANCELLED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (149, N'DEP-2026-LOS25', 5, 2, NULL, N'079204002590', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-08-24T19:00:00.0000000' AS DateTime2), CAST(N'2026-08-24T19:15:00.0000000' AS DateTime2), CAST(N'2026-08-24T19:10:00.0000000' AS DateTime2), CAST(N'2026-08-27T19:10:00.0000000' AS DateTime2), N'REFUNDED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (193, N'#DEP-8841', 5, 1, 22, N'079204001234', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-11T01:19:06.0000000' AS DateTime2), CAST(N'2026-11-11T01:34:06.0000000' AS DateTime2), CAST(N'2026-11-11T01:24:06.0000000' AS DateTime2), CAST(N'2026-11-14T01:19:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (194, N'#DEP-88423', 6, 2, NULL, N'079204005678', CAST(50000000 AS Decimal(18, 0)), CAST(N'2026-11-11T02:34:06.0000000' AS DateTime2), CAST(N'2026-11-11T02:49:06.0000000' AS DateTime2), CAST(N'2026-11-11T02:39:06.0000000' AS DateTime2), CAST(N'2026-11-14T02:34:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (195, N'#DEP-8844', 7, 3, NULL, N'079204009012', CAST(30000000 AS Decimal(18, 0)), CAST(N'2026-11-11T04:12:06.0000000' AS DateTime2), CAST(N'2026-11-11T04:27:06.0000000' AS DateTime2), CAST(N'2026-11-11T04:17:06.0000000' AS DateTime2), CAST(N'2026-11-14T04:12:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (196, N'#DEP-8847', 8, 1, 23, N'079204003456', CAST(40000000 AS Decimal(18, 0)), CAST(N'2026-11-11T05:06:06.0000000' AS DateTime2), CAST(N'2026-11-11T05:21:06.0000000' AS DateTime2), CAST(N'2026-11-11T05:11:06.0000000' AS DateTime2), CAST(N'2026-11-14T05:06:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (197, N'#DEP-2026-ACT01', 6, 2, 24, N'079204006001', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T11:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T11:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T11:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T11:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (198, N'#DEP-2026-ACT02', 7, 3, 25, N'079204006002', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T13:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T13:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T13:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T13:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (199, N'#DEP-2026-ACT03', 8, 4, 26, N'079204006003', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T15:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T15:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T15:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T15:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (200, N'#DEP-2026-ACT04', 9, 5, 27, N'079204006004', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T17:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T17:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T17:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T17:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (201, N'#DEP-2026-ACT05', 5, 6, 28, N'079204006005', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T19:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T19:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T19:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T19:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (202, N'#DEP-2026-ACT06', 6, 1, 29, N'079204006006', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T21:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T21:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T21:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T21:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (203, N'#DEP-2026-ACT07', 7, 2, 30, N'079204006007', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-11T23:09:06.0000000' AS DateTime2), CAST(N'2026-11-11T23:24:06.0000000' AS DateTime2), CAST(N'2026-11-11T23:14:06.0000000' AS DateTime2), CAST(N'2026-11-14T23:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (204, N'#DEP-2026-ACT08', 8, 3, 31, N'079204006008', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T01:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T01:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T01:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T01:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (205, N'#DEP-2026-ACT09', 9, 4, 32, N'079204006009', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T03:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T03:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T03:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T03:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (206, N'#DEP-2026-ACT10', 5, 5, 33, N'079204006010', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T05:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T05:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T05:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T05:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (207, N'#DEP-2026-ACT11', 6, 6, 34, N'079204006011', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T07:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T07:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T07:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T07:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (208, N'#DEP-2026-ACT12', 7, 1, 35, N'079204006012', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T09:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T09:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T09:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T09:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (209, N'#DEP-2026-ACT13', 8, 2, 36, N'079204006013', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T11:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T11:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T11:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T11:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (210, N'#DEP-2026-ACT14', 9, 3, 37, N'079204006014', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T13:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T13:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T13:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T13:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (211, N'#DEP-2026-ACT15', 5, 4, 38, N'079204006015', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T15:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T15:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T15:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T15:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (212, N'#DEP-2026-ACT16', 6, 5, 39, N'079204006016', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T17:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T17:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T17:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T17:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (213, N'#DEP-2026-ACT17', 7, 6, NULL, N'079204006017', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T19:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T19:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T19:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T19:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (214, N'#DEP-2026-ACT18', 8, 1, NULL, N'079204006018', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T21:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T21:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T21:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T21:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (215, N'#DEP-2026-ACT19', 9, 2, NULL, N'079204006019', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-12T23:09:06.0000000' AS DateTime2), CAST(N'2026-11-12T23:24:06.0000000' AS DateTime2), CAST(N'2026-11-12T23:14:06.0000000' AS DateTime2), CAST(N'2026-11-15T23:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (216, N'#DEP-2026-ACT20', 5, 3, NULL, N'079204006020', CAST(12000000 AS Decimal(18, 0)), CAST(N'2026-11-13T01:09:06.0000000' AS DateTime2), CAST(N'2026-11-13T01:24:06.0000000' AS DateTime2), CAST(N'2026-11-13T01:14:06.0000000' AS DateTime2), CAST(N'2026-11-16T01:14:06.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (217, N'DEP-222853', 9, 1, NULL, N'079201009988', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-13T23:10:23.0000000' AS DateTime2), CAST(N'2026-11-13T23:25:23.0000000' AS DateTime2), CAST(N'2026-11-13T23:11:22.0000000' AS DateTime2), CAST(N'2026-11-16T23:11:22.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (218, N'DEP-497942', 9, 1, NULL, N'079201009988', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-13T23:14:58.0000000' AS DateTime2), CAST(N'2026-11-13T23:29:58.0000000' AS DateTime2), CAST(N'2026-11-13T23:15:48.0000000' AS DateTime2), CAST(N'2026-11-16T23:15:48.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (219, N'DEP-655512', 9, 1, NULL, N'079201009988', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-13T23:17:36.0000000' AS DateTime2), CAST(N'2026-11-13T23:32:36.0000000' AS DateTime2), CAST(N'2026-11-13T23:18:05.0000000' AS DateTime2), CAST(N'2026-11-16T23:18:05.0000000' AS DateTime2), N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (220, N'DEP-800130', 9, 1, NULL, N'079201009988', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-13T23:20:00.0000000' AS DateTime2), CAST(N'2026-11-13T23:35:00.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (221, N'DEP-961287', 9, 1, NULL, N'079201009988', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-13T23:22:41.0000000' AS DateTime2), CAST(N'2026-11-13T23:37:41.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (222, N'DEP-639079', 9, 1, NULL, N'079201009999', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-20T19:43:59.0000000' AS DateTime2), CAST(N'2026-11-20T19:58:59.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
INSERT [dbo].[phieu_dat_coc] ([id], [ma_phieu_coc], [nguoi_dung_id], [ton_kho_id], [xe_dinh_danh_id], [so_cccd], [so_tien_coc], [ngay_dat_coc], [han_thanh_toan], [thoi_gian_thanh_toan], [han_giu_xe], [trang_thai], [thoi_gian_hoan_tat]) VALUES (223, N'DEP-720835', 9, 1, NULL, N'079201009999', CAST(20000000 AS Decimal(18, 0)), CAST(N'2026-11-20T19:45:21.0000000' AS DateTime2), CAST(N'2026-11-20T20:00:21.0000000' AS DateTime2), NULL, NULL, N'EXPIRED', NULL)
GO
SET IDENTITY_INSERT [dbo].[phieu_dat_coc] OFF
GO
SET IDENTITY_INSERT [dbo].[phieu_dieu_chuyen_kho] ON 

GO
INSERT [dbo].[phieu_dieu_chuyen_kho] ([id], [ma_phieu_chuyen], [showroom_xuat_id], [showroom_nhap_id], [xe_dinh_danh_id], [nguoi_tao_id], [ngay_tao], [ngay_hoan_tat], [trang_thai], [ghi_chu]) VALUES (1, N'TRF-2026-SR01-SR02-01', 1, 2, 2, 2, CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), NULL, N'DANG_VAN_CHUYEN', N'Điều chuyển xe AutoHub GT-e (VIN: 1FA6P8CF5H5789012) từ Mỹ Đình vào Showroom Q.7 phục vụ khách VIP xem xe thực tế')
GO
SET IDENTITY_INSERT [dbo].[phieu_dieu_chuyen_kho] OFF
GO
SET IDENTITY_INSERT [dbo].[phu_kien] ON 

GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (1, 1, N'Bộ sạc treo tường thông minh Wallbox 22kW', N'AutoHub Power', CAST(24900000 AS Decimal(18, 0)), 11, N'Trạm sạc AC 3 pha công suất 22kW chuẩn Type-2 chống nước IP65', N'https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (2, 2, N'Camera hành trình 4K tích hợp LiDAR AutoHub Eye', N'AutoHub Vision', CAST(8500000 AS Decimal(18, 0)), 28, N'Camera ghi hình 4K Sony Starvis 2 tích hợp LiDAR cảnh báo sớm va chạm', N'https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (3, 4, N'Bộ thảm lót sàn đúc nguyên khối chống nước GT-e', N'AutoHub Craft', CAST(2800000 AS Decimal(18, 0)), 33, N'Scan 3D Laser nhựa TPE sinh học nguyên khối viền cao 5cm không mùi', N'https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768', 0, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (4, 3, N'Gói phim cách nhiệt Nano Ceramic AutoHub Shield', N'AutoHub Shield', CAST(14500000 AS Decimal(18, 0)), 10, N'Cản nhiệt cabin 99% tia UV/IR, không cản sóng 5G/GPS, bảo hành 10 năm', N'https://api.builder.io/api/v1/image/assets/TEMP/18b57253ac2342092e966b261e1b3751c6617d08?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (5, 1, N'Bộ sạc di động khẩn cấp 3.5kW Portable Booster', N'AutoHub Power', CAST(5200000 AS Decimal(18, 0)), 20, N'Cắm điện 220V Schuko 16A dài 5m màn hình OLED hiển thị công suất', N'https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (6, 1, N'Bộ chuyển nguồn cắm điện 2 chiều V2L 3.3kW', N'AutoHub Power', CAST(3800000 AS Decimal(18, 0)), 35, N'Cổng chuyển đổi lấy điện từ pin xe ra ổ cắm 220V cho thiết bị dã ngoại', N'https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (7, 2, N'Bơm lốp điện tử tự ngắt không dây AutoHub Air Pro', N'AutoHub Vision', CAST(1850000 AS Decimal(18, 0)), 35, N'Động cơ đồng nguyên chất 150 PSI tự ngắt khi đủ áp suất kèm đèn LED cứu hộ', N'https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (8, 4, N'Máy lọc không khí ion âm PureAir 360', N'AutoHub Craft', CAST(2200000 AS Decimal(18, 0)), 22, N'Màng lọc HEPA H13 khử mùi xe mới và bụi mịn PM2.5 khuếch tán tinh dầu tự nhiên', N'https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (9, 2, N'Cảm biến áp suất lốp van trong TPMS Solar', N'AutoHub Vision', CAST(1450000 AS Decimal(18, 0)), 39, N'Màn hình năng lượng mặt trời cảm biến van trong siêu nhạy chống nước IP67', N'https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768', 1, 1)
GO
INSERT [dbo].[phu_kien] ([id], [danh_muc_id], [ten_phu_kien], [thuong_hieu], [gia_ban], [so_luong_ton], [quy_cach_lap_dat], [hinh_anh], [dung_chung], [dang_hoat_dong]) VALUES (10, 4, N'Bộ gối tựa đầu cao su non công thái học Ergonomic', N'AutoHub Craft', CAST(950000 AS Decimal(18, 0)), 58, N'Cao su non đúc chậm nguyên khối nâng đỡ đốt sống cổ vải sợi dệt thoáng khí', N'https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768', 1, 1)
GO
SET IDENTITY_INSERT [dbo].[phu_kien] OFF
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (1, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (1, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (1, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (2, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (2, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (2, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (3, 1, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (3, 2, 2025, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (4, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (4, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (4, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (5, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (5, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (5, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (6, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (6, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (6, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (7, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (7, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (7, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (8, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (8, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (8, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (9, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (9, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (9, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (10, 1, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (10, 2, 2023, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (10, 3, 2024, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (10, 4, 2022, 2026)
GO
INSERT [dbo].[phu_kien_dong_xe_tuong_thich] ([phu_kien_id], [dong_xe_id], [nam_bat_dau], [nam_ket_thuc]) VALUES (10, 5, 2023, 2026)
GO
SET IDENTITY_INSERT [dbo].[phuong_thuc_van_chuyen] ON 

GO
INSERT [dbo].[phuong_thuc_van_chuyen] ([id], [ma_phuong_thuc], [ten_phuong_thuc], [mo_ta], [sub_mo_ta], [tag], [thoi_gian_du_kien], [chi_phi], [dieu_kien_mien_phi], [thu_tu], [dang_hoat_dong], [created_at], [updated_at], [is_deleted]) VALUES (1, N'STANDARD', N'Giao hàng tiêu chuẩn AutoHub Logistics', NULL, N'Bàn giao niêm phong thùng chuyên dụng, kiểm tra hàng trước khi nhận', N'BẢO HIỂM HÀNG HÓA 100%', N'1 - 2 ngày làm việc', CAST(0 AS Decimal(18, 0)), NULL, 1, 1, CAST(N'2026-11-14T07:28:02.3085720' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[phuong_thuc_van_chuyen] ([id], [ma_phuong_thuc], [ten_phuong_thuc], [mo_ta], [sub_mo_ta], [tag], [thoi_gian_du_kien], [chi_phi], [dieu_kien_mien_phi], [thu_tu], [dang_hoat_dong], [created_at], [updated_at], [is_deleted]) VALUES (2, N'EXPRESS_TECHNICIAN', N'Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ', NULL, N'Bao gồm khảo sát đường dây điện, kích hoạt sạc thông minh và kiểm tra an toàn tải điện', N'VIP ON-SITE TECH', N'Trong ngày (2 - 4h)', CAST(150000 AS Decimal(18, 0)), CAST(50000000 AS Decimal(18, 0)), 2, 1, CAST(N'2026-11-14T07:28:02.3085720' AS DateTime2), NULL, 0)
GO
INSERT [dbo].[phuong_thuc_van_chuyen] ([id], [ma_phuong_thuc], [ten_phuong_thuc], [mo_ta], [sub_mo_ta], [tag], [thoi_gian_du_kien], [chi_phi], [dieu_kien_mien_phi], [thu_tu], [dang_hoat_dong], [created_at], [updated_at], [is_deleted]) VALUES (3, N'SHOWROOM_PICKUP', N'Nhận trực tiếp tại Hệ thống Showroom AutoHub', NULL, N'Hỗ trợ kỹ thuật viên hướng dẫn lắp đặt trực tiếp và thử nghiệm thiết bị tại Showroom', N'TRẢI NGHIỆM SHOWROOM', N'Sẵn sàng trong 2 giờ', CAST(0 AS Decimal(18, 0)), NULL, 3, 1, CAST(N'2026-11-14T07:28:02.3085720' AS DateTime2), NULL, 0)
GO
SET IDENTITY_INSERT [dbo].[phuong_thuc_van_chuyen] OFF
GO
SET IDENTITY_INSERT [dbo].[showroom] ON 

GO
INSERT [dbo].[showroom] ([id], [tinh_thanh_id], [ten_showroom], [dia_chi], [so_dien_thoai], [gio_mo_cua], [gio_dong_cua], [dang_hoat_dong]) VALUES (1, 1, N'AutoHub Flagship Mỹ Đình - Hà Nội', N'Số 8 Lê Quang Đạo, Nam Từ Liêm, Hà Nội', N'02438889999', CAST(N'08:00:00' AS Time), CAST(N'18:00:00' AS Time), 1)
GO
INSERT [dbo].[showroom] ([id], [tinh_thanh_id], [ten_showroom], [dia_chi], [so_dien_thoai], [gio_mo_cua], [gio_dong_cua], [dang_hoat_dong]) VALUES (2, 2, N'AutoHub Quận 7 - TP. Hồ Chí Minh', N'Số 104 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM', N'02839998888', CAST(N'08:00:00' AS Time), CAST(N'19:00:00' AS Time), 1)
GO
INSERT [dbo].[showroom] ([id], [tinh_thanh_id], [ten_showroom], [dia_chi], [so_dien_thoai], [gio_mo_cua], [gio_dong_cua], [dang_hoat_dong]) VALUES (3, 3, N'AutoHub Cẩm Lệ - Đà Nẵng', N'Số 356 Điện Biên Phủ, Thanh Khê, Đà Nẵng', N'02363777888', CAST(N'08:00:00' AS Time), CAST(N'18:00:00' AS Time), 1)
GO
SET IDENTITY_INSERT [dbo].[showroom] OFF
GO
SET IDENTITY_INSERT [dbo].[so_dia_chi] ON 

GO
INSERT [dbo].[so_dia_chi] ([id], [nguoi_dung_id], [ho_ten_nguoi_nhan], [so_dien_thoai], [tinh_thanh], [quan_huyen], [phuong_xa], [dia_chi_chi_tiet], [mac_dinh]) VALUES (1, 5, N'Nguyễn Văn A', N'0912345678', N'TP. Hồ Chí Minh', N'Bình Thạnh', N'Phường 22', N'Tòa Landmark 81, 720A Điện Biên Phủ', 1)
GO
INSERT [dbo].[so_dia_chi] ([id], [nguoi_dung_id], [ho_ten_nguoi_nhan], [so_dien_thoai], [tinh_thanh], [quan_huyen], [phuong_xa], [dia_chi_chi_tiet], [mac_dinh]) VALUES (2, 6, N'Trần Hoàng Nam', N'0988123456', N'TP. Hồ Chí Minh', N'Quận 7', N'Tân Phú', N'Khu đô thị Phú Mỹ Hưng, Đường Nguyễn Lương Bằng', 1)
GO
INSERT [dbo].[so_dia_chi] ([id], [nguoi_dung_id], [ho_ten_nguoi_nhan], [so_dien_thoai], [tinh_thanh], [quan_huyen], [phuong_xa], [dia_chi_chi_tiet], [mac_dinh]) VALUES (3, 8, N'Lê Hoàng Long', N'0977441223', N'Hà Nội', N'Cầu Giấy', N'Dịch Vọng Hậu', N'Tòa nhà Keangnam Landmark 72', 1)
GO
INSERT [dbo].[so_dia_chi] ([id], [nguoi_dung_id], [ho_ten_nguoi_nhan], [so_dien_thoai], [tinh_thanh], [quan_huyen], [phuong_xa], [dia_chi_chi_tiet], [mac_dinh]) VALUES (4, 9, N'Nguyễn Văn Trọng', N'0912345679', N'TP. Hồ Chí Minh', N'Quận 1', N'Phường Bến Nghé', N'Số 123 Đường Lê Lợi', 1)
GO
SET IDENTITY_INSERT [dbo].[so_dia_chi] OFF
GO
SET IDENTITY_INSERT [dbo].[tinh_thanh] ON 

GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (1, N'Hà Nội', N'Vùng 1')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (2, N'TP. Hồ Chí Minh', N'Vùng 1')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (3, N'Đà Nẵng', N'Vùng 2')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (4, N'Hải Phòng', N'Vùng 2')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (5, N'Cần Thơ', N'Vùng 2')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (6, N'Bình Dương', N'Vùng 2')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (7, N'Đồng Nai', N'Vùng 2')
GO
INSERT [dbo].[tinh_thanh] ([id], [ten_tinh], [phan_vung_bien_so]) VALUES (8, N'Quảng Ninh', N'Vùng 3')
GO
SET IDENTITY_INSERT [dbo].[tinh_thanh] OFF
GO
SET IDENTITY_INSERT [dbo].[ton_kho_xe] ON 

GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (1, 1, 1, 2, 17, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (2, 1, 2, 1, 8, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (3, 2, 4, 2, 7, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (4, 4, 5, 2, 8, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (5, 7, 7, 2, 6, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (6, 8, 4, 2, 5, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (7, 7, 4, 1, 5, 2)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (8, 7, 6, 1, 4, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (9, 8, 7, 1, 3, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (10, 9, 2, 1, 6, 2)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (11, 10, 3, 1, 4, 0)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (12, 9, 3, 2, 5, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (13, 10, 4, 2, 4, 2)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (14, 2, 5, 2, 3, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (15, 1, 1, 3, 4, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (16, 7, 6, 3, 5, 2)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (17, 8, 4, 3, 3, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (18, 9, 5, 3, 4, 1)
GO
INSERT [dbo].[ton_kho_xe] ([id], [phien_ban_id], [mau_sac_id], [showroom_id], [so_luong_kha_dung], [so_luong_dang_giu_cho]) VALUES (19, 10, 3, 3, 4, 0)
GO
SET IDENTITY_INSERT [dbo].[ton_kho_xe] OFF
GO
SET IDENTITY_INSERT [dbo].[voucher] ON 

GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (1, N'AUTOHUB10', CAST(10.00 AS Decimal(5, 2)), CAST(500000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (2, N'AH-VOUCHER-500K', CAST(10.00 AS Decimal(5, 2)), CAST(500000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (3, N'VIPCAR20', CAST(20.00 AS Decimal(5, 2)), CAST(2000000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (4, N'AUTOHUB_VIP_2026', CAST(10.00 AS Decimal(5, 2)), CAST(3000000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (5, N'CHARGER_POWER_50', CAST(15.00 AS Decimal(5, 2)), CAST(2000000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (6, N'SUMMER_DRIVE_15', CAST(5.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(N'2026-09-30' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (7, N'AUTOHUBGT500', CAST(10.00 AS Decimal(5, 2)), CAST(500000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (8, N'AUTOHUB1000', CAST(15.00 AS Decimal(5, 2)), CAST(1000000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (9, N'AUTOHUBVIP', CAST(10.00 AS Decimal(5, 2)), CAST(500000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
INSERT [dbo].[voucher] ([id], [ma_voucher], [phan_tram_giam], [giam_toi_da], [ngay_het_han], [dang_hoat_dong]) VALUES (10, N'VNPAYAUTOHUB', CAST(10.00 AS Decimal(5, 2)), CAST(500000 AS Decimal(18, 0)), CAST(N'2026-12-31' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[voucher] OFF
GO
SET IDENTITY_INSERT [dbo].[xe_demo] ON 

GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (1, 2, 7, N'51K-992.14', 4200, CAST(N'2026-09-10' AS Date), CAST(N'2026-12-10' AS Date), N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (2, 2, 9, N'51K-881.23', 6800, CAST(N'2026-08-20' AS Date), CAST(N'2026-11-20' AS Date), N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (3, 2, 8, N'51K-773.09', 2900, CAST(N'2026-10-01' AS Date), CAST(N'2027-01-01' AS Date), N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (4, 1, 1, N'30H-889.99', 3150, CAST(N'2026-09-15' AS Date), CAST(N'2026-12-15' AS Date), N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (5, 1, 7, N'30K-882.11', 1250, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (6, 3, 7, N'43A-672.33', 980, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (7, 1, 8, N'30K-991.08', 2100, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (8, 1, 9, N'30K-776.54', 1540, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (9, 3, 9, N'43A-551.22', 820, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (10, 2, 9, N'51K-112.90', 3100, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (11, 1, 17, N'30K-338.45', 1100, NULL, NULL, N'SAN_SANG', 1)
GO
INSERT [dbo].[xe_demo] ([id], [showroom_id], [phien_ban_id], [bien_so], [so_odo_hien_tai], [ngay_bao_duong_gan_nhat], [ngay_bao_duong_tiep_theo], [trang_thai], [dang_hoat_dong]) VALUES (12, 2, 17, N'51K-445.67', 1650, NULL, NULL, N'DANG_CHAY_THU', 1)
GO
SET IDENTITY_INSERT [dbo].[xe_demo] OFF
GO
SET IDENTITY_INSERT [dbo].[xe_dinh_danh] ON 

GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (1, 1, N'1FA6P8CF5H5123456', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (2, 1, N'1FA6P8CF5H5789012', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (3, 1, N'1FA6P8CF5H5345678', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (4, 3, N'1FA6P8CF5H5999888', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (5, 5, N'VF8AWD20260012991', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (22, 2, N'VF8AWD20261199001', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (23, 3, N'VF8AWD20261199002', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (24, 4, N'VF8AWD20261199003', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (25, 5, N'VF8AWD20261199004', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (26, 6, N'VF8AWD20261199005', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (27, 1, N'VF8AWD20261199006', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (28, 2, N'VF8AWD20261199007', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (29, 3, N'VF8AWD20261199008', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (30, 4, N'VF8AWD20261199009', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (31, 5, N'VF8AWD20261199010', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (32, 6, N'VF8AWD20261199011', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (33, 1, N'VF8AWD20261199012', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (34, 2, N'VF8AWD20261199013', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (35, 3, N'VF8AWD20261199014', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (36, 4, N'VF8AWD20261199015', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (37, 5, N'VF8AWD20261199016', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (38, 6, N'VF8AWD20261199017', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (39, 1, N'VF8AWD20261199018', N'CO_SAN')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (40, 2, N'VF8AWD20261199019', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (41, 3, N'VF8AWD20261199020', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (42, 4, N'VF8AWD20261199021', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (43, 5, N'VF8AWD20261199022', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (44, 6, N'VF8AWD20261199023', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (45, 1, N'VF8AWD20261199024', N'DA_GIU_CHO')
GO
INSERT [dbo].[xe_dinh_danh] ([id], [ton_kho_id], [so_khung_vin], [trang_thai]) VALUES (46, 2, N'VF8AWD20261199025', N'DA_GIU_CHO')
GO
SET IDENTITY_INSERT [dbo].[xe_dinh_danh] OFF
GO
SET IDENTITY_INSERT [dbo].[yeu_cau_doi_tra] ON 

GO
INSERT [dbo].[yeu_cau_doi_tra] ([id], [don_hang_id], [chi_tiet_don_hang_id], [so_luong_doi_tra], [ly_do], [phuong_an_mong_muon], [minh_chung], [phuong_an_giai_quyet], [ma_van_don_moi], [ngay_gui], [trang_thai], [ghi_chu_xu_ly]) VALUES (1, 3, 3, 1, N'Giao nhầm phiên bản form xe (khách đi VF9 nhưng nhận thảm VF8)', N'DOI_HANG', N'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80', N'DOI_HANG', N'AH-EXCHANGE-RMA402', CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), N'APPROVED', N'Kiện hàng đã gửi về kho Showroom, thảm còn nguyên bọc nilon và tem niêm phong, chưa qua sử dụng. Đã duyệt xuất kho gửi đổi bản form chuẩn.')
GO
INSERT [dbo].[yeu_cau_doi_tra] ([id], [don_hang_id], [chi_tiet_don_hang_id], [so_luong_doi_tra], [ly_do], [phuong_an_mong_muon], [minh_chung], [phuong_an_giai_quyet], [ma_van_don_moi], [ngay_gui], [trang_thai], [ghi_chu_xu_ly]) VALUES (2, 4, 4, 1, N'Màn hình camera chập chờn khi khởi động xe buổi sáng, không lưu thẻ nhớ', N'DOI_HANG', N'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=400&q=80', N'DOI_HANG', N'AH-EXCHANGE-RMA398', CAST(N'2026-11-07T22:58:58.0000000' AS DateTime2), N'COMPLETED', N'Đã kiểm tra kỹ thuật tại phòng bảo hành: Lỗi IC nguồn bo mạch chính. Đã giao camera mới 100% đến khách hàng ngày hôm qua.')
GO
SET IDENTITY_INSERT [dbo].[yeu_cau_doi_tra] OFF
GO
SET IDENTITY_INSERT [dbo].[yeu_cau_hoan_coc] ON 

GO
INSERT [dbo].[yeu_cau_hoan_coc] ([id], [phieu_dat_coc_id], [nhan_vien_doi_soat_id], [quan_tri_phe_duyet_id], [loai_ly_do], [ly_do], [minh_chung], [ngay_gui], [trang_thai], [ly_do_tu_choi], [ngay_xu_ly]) VALUES (1, 2, 2, 94, N'NGAN_HANG_TU_CHOI_TIN_DUNG', N'Ngân hàng từ chối cấp hạn mức cho vay 70% giá trị xe theo đơn thẩm định tín dụng cá nhân.', N'https://autohub.vn/docs/refund/thu_tu_choi_tin_dung_vcb.pdf', CAST(N'2026-11-10T12:58:58.0000000' AS DateTime2), N'REJECTED', N'Hồ sơ không đáp ứng điều kiện hoàn cọc 72h theo quy định hợp đồng.', CAST(N'2026-11-15T17:26:58.0000000' AS DateTime2))
GO
INSERT [dbo].[yeu_cau_hoan_coc] ([id], [phieu_dat_coc_id], [nhan_vien_doi_soat_id], [quan_tri_phe_duyet_id], [loai_ly_do], [ly_do], [minh_chung], [ngay_gui], [trang_thai], [ly_do_tu_choi], [ngay_xu_ly]) VALUES (2, 3, 3, 1, N'NGOAI_LE_ADMIN', N'Khách hàng có việc gia đình đột xuất chuyển công tác định cư nước ngoài, xin rút cọc bảo đảm theo điều khoản thỏa thuận bất khả kháng.', N'https://autohub.vn/docs/refund/don_xin_rut_coc_ngoai_le.pdf', CAST(N'2026-11-08T22:58:58.0000000' AS DateTime2), N'REFUNDED', NULL, CAST(N'2026-11-10T16:58:58.0000000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[yeu_cau_hoan_coc] OFF
GO
SET IDENTITY_INSERT [dbo].[yeu_cau_tu_van] ON 

GO
INSERT [dbo].[yeu_cau_tu_van] ([id], [nguoi_dung_id], [phien_ban_id], [nhan_vien_id], [ho_ten], [so_dien_thoai], [email], [noi_dung_can_tu_van], [khung_gio_tiep_nhan], [ngay_gui], [trang_thai], [ghi_chu_cskh]) VALUES (1, 6, 7, 2, N'Trần Hoàng Nam', N'0988123456', N'nam.tran@gmail.com', N'Quan tâm màu Xanh Deep Ocean nội thất da Nâu, dự toán vay 70% 5 năm Vietcombank.', N'09:00 - 11:30 sáng', CAST(N'2026-11-10T10:58:58.0000000' AS DateTime2), N'PENDING', N'Khách hẹn gọi trước 10h sáng, giọng điệu thân thiện chu đáo.')
GO
INSERT [dbo].[yeu_cau_tu_van] ([id], [nguoi_dung_id], [phien_ban_id], [nhan_vien_id], [ho_ten], [so_dien_thoai], [email], [noi_dung_can_tu_van], [khung_gio_tiep_nhan], [ngay_gui], [trang_thai], [ghi_chu_cskh]) VALUES (2, 7, 9, 3, N'Nguyễn Bích Thủy', N'0903882119', N'thuy.nguyen@company.vn', N'Tìm hiểu SantaFe Hybrid nội thất 6 chỗ ghế cơ trưởng, cần giao xe sớm.', N'14:00 - 16:00 chiều', CAST(N'2026-11-09T22:58:58.0000000' AS DateTime2), N'CONTACTED', N'Đã gọi lần 1, chị hẹn chiều mai ghé showroom xem màu đen thực tế.')
GO
INSERT [dbo].[yeu_cau_tu_van] ([id], [nguoi_dung_id], [phien_ban_id], [nhan_vien_id], [ho_ten], [so_dien_thoai], [email], [noi_dung_can_tu_van], [khung_gio_tiep_nhan], [ngay_gui], [trang_thai], [ghi_chu_cskh]) VALUES (3, 8, 8, 2, N'Lê Hoàng Long', N'0977441223', N'long.le@fpt.com', N'Tìm hiểu bản VF9 Ghế cơ trưởng massage, xuất hóa đơn công ty.', N'Sau 17:00 chiều', CAST(N'2026-11-10T16:58:58.0000000' AS DateTime2), N'PENDING', N'Khách là lãnh đạo doanh nghiệp, quan tâm khấu trừ thuế và bảo hành pin 10 năm.')
GO
SET IDENTITY_INSERT [dbo].[yeu_cau_tu_van] OFF
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_bbgc_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] ADD  CONSTRAINT [UQ_bbgc_ma] UNIQUE NONCLUSTERED 
(
	[ma_ban_giao] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_bbbg_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[bien_ban_ban_giao_xe] ADD  CONSTRAINT [UQ_bbbg_ma] UNIQUE NONCLUSTERED 
(
	[ma_bien_ban] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_bbbg_phieu]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[bien_ban_ban_giao_xe] ADD  CONSTRAINT [UQ_bbbg_phieu] UNIQUE NONCLUSTERED 
(
	[phieu_dat_coc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UX_bp_hieu_luc]    Script Date: 11/25/2026 3:00:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UX_bp_hieu_luc] ON [dbo].[bieu_phi_lan_banh]
(
	[tinh_thanh_id] ASC
)
WHERE ([ngay_het_hieu_luc] IS NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_ctdh_don_pk]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[chi_tiet_don_hang] ADD  CONSTRAINT [UQ_ctdh_don_pk] UNIQUE NONCLUSTERED 
(
	[don_hang_id] ASC,
	[phu_kien_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_dg_ctdh]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[danh_gia] ADD  CONSTRAINT [UQ_dg_ctdh] UNIQUE NONCLUSTERED 
(
	[chi_tiet_don_hang_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_danh_muc_ten]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[danh_muc_phu_kien] ADD  CONSTRAINT [UQ_danh_muc_ten] UNIQUE NONCLUSTERED 
(
	[ten_danh_muc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_dh_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[don_hang_phu_kien] ADD  CONSTRAINT [UQ_dh_ma] UNIQUE NONCLUSTERED 
(
	[ma_don_hang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_dx_hang_ten]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[dong_xe] ADD  CONSTRAINT [UQ_dx_hang_ten] UNIQUE NONCLUSTERED 
(
	[hang_xe_id] ASC,
	[ten_dong_xe] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_gvnh_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[goi_vay_ngan_hang] ADD  CONSTRAINT [UQ_gvnh_ma] UNIQUE NONCLUSTERED 
(
	[ma_ngan_hang] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_gd_tham_chieu]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[giao_dich_thanh_toan] ADD  CONSTRAINT [UQ_gd_tham_chieu] UNIQUE NONCLUSTERED 
(
	[ma_tham_chieu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UX_gd_sepay]    Script Date: 11/25/2026 3:00:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UX_gd_sepay] ON [dbo].[giao_dich_thanh_toan]
(
	[ma_giao_dich_sepay] ASC
)
WHERE ([ma_giao_dich_sepay] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UX_gd_vnpay]    Script Date: 11/25/2026 3:00:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UX_gd_vnpay] ON [dbo].[giao_dich_thanh_toan]
(
	[ma_giao_dich_vnpay] ASC
)
WHERE ([ma_giao_dich_vnpay] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_gh_nguoi_dung]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[gio_hang] ADD  CONSTRAINT [UQ_gh_nguoi_dung] UNIQUE NONCLUSTERED 
(
	[nguoi_dung_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_hang_xe_ten]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[hang_xe] ADD  CONSTRAINT [UQ_hang_xe_ten] UNIQUE NONCLUSTERED 
(
	[ten_hang_xe] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UX_lh_pending]    Script Date: 11/25/2026 3:00:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UX_lh_pending] ON [dbo].[lich_hen_lai_thu]
(
	[nguoi_dung_id] ASC
)
WHERE ([trang_thai]=N'PENDING')
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_lt_nv_ngay_ca]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[lich_truc_nhan_vien] ADD  CONSTRAINT [UQ_lt_nv_ngay_ca] UNIQUE NONCLUSTERED 
(
	[nhan_vien_id] ASC,
	[ngay_truc] ASC,
	[ca_truc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_mau_sac_ten]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[mau_sac] ADD  CONSTRAINT [UQ_mau_sac_ten] UNIQUE NONCLUSTERED 
(
	[ten_mau] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_nguoi_dung_email]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[nguoi_dung] ADD  CONSTRAINT [UQ_nguoi_dung_email] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_pb_dong_ten]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[phien_ban_xe] ADD  CONSTRAINT [UQ_pb_dong_ten] UNIQUE NONCLUSTERED 
(
	[dong_xe_id] ASC,
	[ten_phien_ban] ASC,
	[nam_san_xuat] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_pdc_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[phieu_dat_coc] ADD  CONSTRAINT [UQ_pdc_ma] UNIQUE NONCLUSTERED 
(
	[ma_phieu_coc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UX_pdc_vin_active]    Script Date: 11/25/2026 3:00:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UX_pdc_vin_active] ON [dbo].[phieu_dat_coc]
(
	[xe_dinh_danh_id] ASC
)
WHERE ([xe_dinh_danh_id] IS NOT NULL AND ([trang_thai] IN (N'PAID', N'REFUND_REQUESTED', N'REFUND_REQUIRED')))
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_pdck_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] ADD  CONSTRAINT [UQ_pdck_ma] UNIQUE NONCLUSTERED 
(
	[ma_phieu_chuyen] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_ptvc_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[phuong_thuc_van_chuyen] ADD  CONSTRAINT [UQ_ptvc_ma] UNIQUE NONCLUSTERED 
(
	[ma_phuong_thuc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UX_sdc_mac_dinh]    Script Date: 11/25/2026 3:00:23 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UX_sdc_mac_dinh] ON [dbo].[so_dia_chi]
(
	[nguoi_dung_id] ASC
)
WHERE ([mac_dinh]=(1))
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_tinh_thanh_ten]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[tinh_thanh] ADD  CONSTRAINT [UQ_tinh_thanh_ten] UNIQUE NONCLUSTERED 
(
	[ten_tinh] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UK2rshx5obld5vrffa1ykgwvapq]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[ton_kho_xe] ADD  CONSTRAINT [UK2rshx5obld5vrffa1ykgwvapq] UNIQUE NONCLUSTERED 
(
	[phien_ban_id] ASC,
	[mau_sac_id] ASC,
	[showroom_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_tk_bo_ba]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[ton_kho_xe] ADD  CONSTRAINT [UQ_tk_bo_ba] UNIQUE NONCLUSTERED 
(
	[phien_ban_id] ASC,
	[mau_sac_id] ASC,
	[showroom_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_voucher_ma]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[voucher] ADD  CONSTRAINT [UQ_voucher_ma] UNIQUE NONCLUSTERED 
(
	[ma_voucher] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_xdm_bien_so]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[xe_demo] ADD  CONSTRAINT [UQ_xdm_bien_so] UNIQUE NONCLUSTERED 
(
	[bien_so] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UQ_xdd_vin]    Script Date: 11/25/2026 3:00:23 PM ******/
ALTER TABLE [dbo].[xe_dinh_danh] ADD  CONSTRAINT [UQ_xdd_vin] UNIQUE NONCLUSTERED 
(
	[so_khung_vin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] ADD  CONSTRAINT [DF_bbgc_tg]  DEFAULT (sysdatetime()) FOR [thoi_gian_ban_giao]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] ADD  CONSTRAINT [DF_bbgc_tmdc]  DEFAULT ((0)) FOR [tien_mat_dau_ca]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] ADD  CONSTRAINT [DF_bbgc_tmcc]  DEFAULT ((0)) FOR [tien_mat_cuoi_ca]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] ADD  CONSTRAINT [DF_bbgc_shd]  DEFAULT ((0)) FOR [so_hop_dong_phat_sinh]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe] ADD  CONSTRAINT [DF_bbbg_ngay]  DEFAULT (sysdatetime()) FOR [ngay_ban_giao]
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai] ADD  CONSTRAINT [DF_ctkm_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[danh_gia] ADD  CONSTRAINT [DF_dg_ngay]  DEFAULT (sysdatetime()) FOR [ngay_danh_gia]
GO
ALTER TABLE [dbo].[danh_gia] ADD  CONSTRAINT [DF_dg_tt]  DEFAULT (N'PENDING') FOR [trang_thai_duyet]
GO
ALTER TABLE [dbo].[danh_muc_phu_kien] ADD  CONSTRAINT [DF_dm_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[don_hang_phu_kien] ADD  CONSTRAINT [DF_dh_ngay]  DEFAULT (sysdatetime()) FOR [ngay_dat]
GO
ALTER TABLE [dbo].[don_hang_phu_kien] ADD  CONSTRAINT [DF_dh_pvc]  DEFAULT ((0)) FOR [phi_van_chuyen]
GO
ALTER TABLE [dbo].[don_hang_phu_kien] ADD  CONSTRAINT [DF_dh_gv]  DEFAULT ((0)) FOR [so_tien_giam_voucher]
GO
ALTER TABLE [dbo].[don_hang_phu_kien] ADD  CONSTRAINT [DF_dh_tt]  DEFAULT (N'PENDING') FOR [trang_thai]
GO
ALTER TABLE [dbo].[dong_xe] ADD  CONSTRAINT [DF_dx_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[goi_vay_ngan_hang] ADD  CONSTRAINT [DF_gvnh_active]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[goi_vay_ngan_hang] ADD  CONSTRAINT [DF_gvnh_created]  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] ADD  CONSTRAINT [DF_gd_loai]  DEFAULT (N'THANH_TOAN') FOR [loai_giao_dich]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] ADD  CONSTRAINT [DF_gd_pt]  DEFAULT (N'VNPAY') FOR [phuong_thuc]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] ADD  CONSTRAINT [DF_gd_tgkt]  DEFAULT (sysdatetime()) FOR [thoi_gian_khoi_tao]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] ADD  CONSTRAINT [DF_gd_tt]  DEFAULT (N'PENDING') FOR [trang_thai]
GO
ALTER TABLE [dbo].[gio_hang] ADD  CONSTRAINT [DF_gh_ngay]  DEFAULT (sysdatetime()) FOR [ngay_cap_nhat]
GO
ALTER TABLE [dbo].[hang_xe] ADD  CONSTRAINT [DF_hx_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[hinh_anh_xe] ADD  CONSTRAINT [DF_ha_tt]  DEFAULT ((0)) FOR [thu_tu_hien_thi]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] ADD  CONSTRAINT [DF_lh_tl]  DEFAULT ((60)) FOR [thoi_luong_phut]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] ADD  CONSTRAINT [DF_lh_ngay]  DEFAULT (sysdatetime()) FOR [ngay_tao]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] ADD  CONSTRAINT [DF_lh_tt]  DEFAULT (N'PENDING') FOR [trang_thai]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] ADD  CONSTRAINT [DF_lh_nhac]  DEFAULT ((0)) FOR [da_gui_nhac_lich]
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien] ADD  CONSTRAINT [DF_lt_ngay]  DEFAULT (sysdatetime()) FOR [ngay_tao]
GO
ALTER TABLE [dbo].[nguoi_dung] ADD  CONSTRAINT [DF_nd_vai_tro]  DEFAULT (N'ROLE_CUSTOMER') FOR [vai_tro]
GO
ALTER TABLE [dbo].[nguoi_dung] ADD  CONSTRAINT [DF_nd_trang_thai]  DEFAULT (N'CHUA_KICH_HOAT') FOR [trang_thai_tai_khoan]
GO
ALTER TABLE [dbo].[nguoi_dung] ADD  CONSTRAINT [DF_nd_ngay_tao]  DEFAULT (sysdatetime()) FOR [ngay_tao]
GO
ALTER TABLE [dbo].[nguoi_dung] ADD  CONSTRAINT [DF_nd_xoa]  DEFAULT ((0)) FOR [is_deleted]
GO
ALTER TABLE [dbo].[nhat_ky_hanh_vi] ADD  CONSTRAINT [DF_nkhv_time]  DEFAULT ((0)) FOR [thoi_gian_dung_xem]
GO
ALTER TABLE [dbo].[nhat_ky_hanh_vi] ADD  CONSTRAINT [DF_nkhv_tg]  DEFAULT (sysdatetime()) FOR [thoi_gian_tao]
GO
ALTER TABLE [dbo].[nhat_ky_tu_van] ADD  CONSTRAINT [DF_nktv_tg]  DEFAULT (sysdatetime()) FOR [thoi_gian_tuong_tac]
GO
ALTER TABLE [dbo].[phien_ban_xe] ADD  CONSTRAINT [DF_pb_coc]  DEFAULT ((20000000)) FOR [muc_tien_coc]
GO
ALTER TABLE [dbo].[phien_ban_xe] ADD  CONSTRAINT [DF_pb_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[phien_ban_xe] ADD  CONSTRAINT [DF_pb_xoa]  DEFAULT ((0)) FOR [is_deleted]
GO
ALTER TABLE [dbo].[phieu_dat_coc] ADD  CONSTRAINT [DF_pdc_ngay]  DEFAULT (sysdatetime()) FOR [ngay_dat_coc]
GO
ALTER TABLE [dbo].[phieu_dat_coc] ADD  CONSTRAINT [DF_pdc_tt]  DEFAULT (N'PENDING_PAYMENT') FOR [trang_thai]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] ADD  CONSTRAINT [DF_pdck_ngay]  DEFAULT (sysdatetime()) FOR [ngay_tao]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] ADD  CONSTRAINT [DF_pdck_tt]  DEFAULT (N'DANG_VAN_CHUYEN') FOR [trang_thai]
GO
ALTER TABLE [dbo].[phu_kien] ADD  CONSTRAINT [DF_pk_ton]  DEFAULT ((0)) FOR [so_luong_ton]
GO
ALTER TABLE [dbo].[phu_kien] ADD  CONSTRAINT [DF_pk_dc]  DEFAULT ((0)) FOR [dung_chung]
GO
ALTER TABLE [dbo].[phu_kien] ADD  CONSTRAINT [DF_pk_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[phuong_thuc_van_chuyen] ADD  DEFAULT ((0)) FOR [chi_phi]
GO
ALTER TABLE [dbo].[phuong_thuc_van_chuyen] ADD  DEFAULT ((1)) FOR [thu_tu]
GO
ALTER TABLE [dbo].[phuong_thuc_van_chuyen] ADD  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[phuong_thuc_van_chuyen] ADD  DEFAULT (sysdatetime()) FOR [created_at]
GO
ALTER TABLE [dbo].[phuong_thuc_van_chuyen] ADD  DEFAULT ((0)) FOR [is_deleted]
GO
ALTER TABLE [dbo].[showroom] ADD  CONSTRAINT [DF_sr_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[so_dia_chi] ADD  CONSTRAINT [DF_sdc_mac_dinh]  DEFAULT ((0)) FOR [mac_dinh]
GO
ALTER TABLE [dbo].[ton_kho_xe] ADD  CONSTRAINT [DF_tk_kd]  DEFAULT ((0)) FOR [so_luong_kha_dung]
GO
ALTER TABLE [dbo].[ton_kho_xe] ADD  CONSTRAINT [DF_tk_gc]  DEFAULT ((0)) FOR [so_luong_dang_giu_cho]
GO
ALTER TABLE [dbo].[voucher] ADD  CONSTRAINT [DF_vc_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[xe_demo] ADD  CONSTRAINT [DF_xdm_odo]  DEFAULT ((0)) FOR [so_odo_hien_tai]
GO
ALTER TABLE [dbo].[xe_demo] ADD  CONSTRAINT [DF_xdm_tt]  DEFAULT (N'SAN_SANG') FOR [trang_thai]
GO
ALTER TABLE [dbo].[xe_demo] ADD  CONSTRAINT [DF_xdm_hd]  DEFAULT ((1)) FOR [dang_hoat_dong]
GO
ALTER TABLE [dbo].[xe_dinh_danh] ADD  CONSTRAINT [DF_xdd_tt]  DEFAULT (N'CO_SAN') FOR [trang_thai]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] ADD  CONSTRAINT [DF_ycdt_ngay]  DEFAULT (sysdatetime()) FOR [ngay_gui]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] ADD  CONSTRAINT [DF_ycdt_tt]  DEFAULT (N'PENDING') FOR [trang_thai]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] ADD  CONSTRAINT [DF_ychc_ngay]  DEFAULT (sysdatetime()) FOR [ngay_gui]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] ADD  CONSTRAINT [DF_ychc_tt]  DEFAULT (N'PENDING') FOR [trang_thai]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] ADD  CONSTRAINT [DF_yctv_ngay]  DEFAULT (sysdatetime()) FOR [ngay_gui]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] ADD  CONSTRAINT [DF_yctv_tt]  DEFAULT (N'PENDING') FOR [trang_thai]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca]  WITH CHECK ADD  CONSTRAINT [FK_bbgc_giao] FOREIGN KEY([nguoi_ban_giao_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] CHECK CONSTRAINT [FK_bbgc_giao]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca]  WITH CHECK ADD  CONSTRAINT [FK_bbgc_nhan] FOREIGN KEY([nguoi_nhan_ca_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] CHECK CONSTRAINT [FK_bbgc_nhan]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca]  WITH CHECK ADD  CONSTRAINT [FK_bbgc_showroom] FOREIGN KEY([showroom_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] CHECK CONSTRAINT [FK_bbgc_showroom]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe]  WITH CHECK ADD  CONSTRAINT [FK_bbbg_phieu] FOREIGN KEY([phieu_dat_coc_id])
REFERENCES [dbo].[phieu_dat_coc] ([id])
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe] CHECK CONSTRAINT [FK_bbbg_phieu]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe]  WITH CHECK ADD  CONSTRAINT [FK_bbbg_staff] FOREIGN KEY([nhan_vien_ban_giao_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe] CHECK CONSTRAINT [FK_bbbg_staff]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe]  WITH CHECK ADD  CONSTRAINT [FK_bbbg_vin] FOREIGN KEY([xe_dinh_danh_id])
REFERENCES [dbo].[xe_dinh_danh] ([id])
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_xe] CHECK CONSTRAINT [FK_bbbg_vin]
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh]  WITH CHECK ADD  CONSTRAINT [FK_bp_tinh] FOREIGN KEY([tinh_thanh_id])
REFERENCES [dbo].[tinh_thanh] ([id])
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh] CHECK CONSTRAINT [FK_bp_tinh]
GO
ALTER TABLE [dbo].[chi_tiet_don_hang]  WITH CHECK ADD  CONSTRAINT [FK_ctdh_dh] FOREIGN KEY([don_hang_id])
REFERENCES [dbo].[don_hang_phu_kien] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[chi_tiet_don_hang] CHECK CONSTRAINT [FK_ctdh_dh]
GO
ALTER TABLE [dbo].[chi_tiet_don_hang]  WITH CHECK ADD  CONSTRAINT [FK_ctdh_pk] FOREIGN KEY([phu_kien_id])
REFERENCES [dbo].[phu_kien] ([id])
GO
ALTER TABLE [dbo].[chi_tiet_don_hang] CHECK CONSTRAINT [FK_ctdh_pk]
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang]  WITH CHECK ADD  CONSTRAINT [FK_ctgh_gh] FOREIGN KEY([gio_hang_id])
REFERENCES [dbo].[gio_hang] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang] CHECK CONSTRAINT [FK_ctgh_gh]
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang]  WITH CHECK ADD  CONSTRAINT [FK_ctgh_pk] FOREIGN KEY([phu_kien_id])
REFERENCES [dbo].[phu_kien] ([id])
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang] CHECK CONSTRAINT [FK_ctgh_pk]
GO
ALTER TABLE [dbo].[danh_gia]  WITH CHECK ADD  CONSTRAINT [FK_dg_ctdh] FOREIGN KEY([chi_tiet_don_hang_id])
REFERENCES [dbo].[chi_tiet_don_hang] ([id])
GO
ALTER TABLE [dbo].[danh_gia] CHECK CONSTRAINT [FK_dg_ctdh]
GO
ALTER TABLE [dbo].[danh_gia]  WITH CHECK ADD  CONSTRAINT [FK_dg_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[danh_gia] CHECK CONSTRAINT [FK_dg_nguoi_dung]
GO
ALTER TABLE [dbo].[danh_gia]  WITH CHECK ADD  CONSTRAINT [FK_dg_phu_kien] FOREIGN KEY([phu_kien_id])
REFERENCES [dbo].[phu_kien] ([id])
GO
ALTER TABLE [dbo].[danh_gia] CHECK CONSTRAINT [FK_dg_phu_kien]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [FK_dh_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [FK_dh_nguoi_dung]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [FK_dh_voucher] FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [FK_dh_voucher]
GO
ALTER TABLE [dbo].[dong_xe]  WITH CHECK ADD  CONSTRAINT [FK_dx_hang_xe] FOREIGN KEY([hang_xe_id])
REFERENCES [dbo].[hang_xe] ([id])
GO
ALTER TABLE [dbo].[dong_xe] CHECK CONSTRAINT [FK_dx_hang_xe]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [FK_gd_don] FOREIGN KEY([don_hang_id])
REFERENCES [dbo].[don_hang_phu_kien] ([id])
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [FK_gd_don]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [FK_gd_phieu] FOREIGN KEY([phieu_dat_coc_id])
REFERENCES [dbo].[phieu_dat_coc] ([id])
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [FK_gd_phieu]
GO
ALTER TABLE [dbo].[gio_hang]  WITH CHECK ADD  CONSTRAINT [FK_gh_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[gio_hang] CHECK CONSTRAINT [FK_gh_nguoi_dung]
GO
ALTER TABLE [dbo].[hinh_anh_xe]  WITH CHECK ADD  CONSTRAINT [FK_ha_mau_sac] FOREIGN KEY([mau_sac_id])
REFERENCES [dbo].[mau_sac] ([id])
GO
ALTER TABLE [dbo].[hinh_anh_xe] CHECK CONSTRAINT [FK_ha_mau_sac]
GO
ALTER TABLE [dbo].[hinh_anh_xe]  WITH CHECK ADD  CONSTRAINT [FK_ha_phien_ban] FOREIGN KEY([phien_ban_id])
REFERENCES [dbo].[phien_ban_xe] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[hinh_anh_xe] CHECK CONSTRAINT [FK_ha_phien_ban]
GO
ALTER TABLE [dbo].[khuyen_mai_phien_ban]  WITH CHECK ADD  CONSTRAINT [FK_kmpb_ct] FOREIGN KEY([chuong_trinh_id])
REFERENCES [dbo].[chuong_trinh_khuyen_mai] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[khuyen_mai_phien_ban] CHECK CONSTRAINT [FK_kmpb_ct]
GO
ALTER TABLE [dbo].[khuyen_mai_phien_ban]  WITH CHECK ADD  CONSTRAINT [FK_kmpb_pb] FOREIGN KEY([phien_ban_id])
REFERENCES [dbo].[phien_ban_xe] ([id])
GO
ALTER TABLE [dbo].[khuyen_mai_phien_ban] CHECK CONSTRAINT [FK_kmpb_pb]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [FK_lh_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [FK_lh_nguoi_dung]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [FK_lh_phien_ban] FOREIGN KEY([phien_ban_id])
REFERENCES [dbo].[phien_ban_xe] ([id])
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [FK_lh_phien_ban]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [FK_lh_showroom] FOREIGN KEY([showroom_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [FK_lh_showroom]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [FK_lh_xe_demo] FOREIGN KEY([xe_demo_id])
REFERENCES [dbo].[xe_demo] ([id])
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [FK_lh_xe_demo]
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien]  WITH CHECK ADD  CONSTRAINT [FK_lt_showroom] FOREIGN KEY([showroom_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien] CHECK CONSTRAINT [FK_lt_showroom]
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien]  WITH CHECK ADD  CONSTRAINT [FK_lt_staff] FOREIGN KEY([nhan_vien_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien] CHECK CONSTRAINT [FK_lt_staff]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [FK_nd_showroom] FOREIGN KEY([showroom_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [FK_nd_showroom]
GO
ALTER TABLE [dbo].[nhat_ky_hanh_vi]  WITH CHECK ADD  CONSTRAINT [FK_nkhv_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[nhat_ky_hanh_vi] CHECK CONSTRAINT [FK_nkhv_nguoi_dung]
GO
ALTER TABLE [dbo].[nhat_ky_tu_van]  WITH CHECK ADD  CONSTRAINT [FK_nktv_staff] FOREIGN KEY([nhan_vien_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[nhat_ky_tu_van] CHECK CONSTRAINT [FK_nktv_staff]
GO
ALTER TABLE [dbo].[nhat_ky_tu_van]  WITH CHECK ADD  CONSTRAINT [FK_nktv_yctv] FOREIGN KEY([yeu_cau_tu_van_id])
REFERENCES [dbo].[yeu_cau_tu_van] ([id])
GO
ALTER TABLE [dbo].[nhat_ky_tu_van] CHECK CONSTRAINT [FK_nktv_yctv]
GO
ALTER TABLE [dbo].[phien_ban_xe]  WITH CHECK ADD  CONSTRAINT [FK_pb_dong_xe] FOREIGN KEY([dong_xe_id])
REFERENCES [dbo].[dong_xe] ([id])
GO
ALTER TABLE [dbo].[phien_ban_xe] CHECK CONSTRAINT [FK_pb_dong_xe]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [FK_pdc_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [FK_pdc_nguoi_dung]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [FK_pdc_ton_kho] FOREIGN KEY([ton_kho_id])
REFERENCES [dbo].[ton_kho_xe] ([id])
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [FK_pdc_ton_kho]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [FK_pdc_xe_dd] FOREIGN KEY([xe_dinh_danh_id])
REFERENCES [dbo].[xe_dinh_danh] ([id])
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [FK_pdc_xe_dd]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho]  WITH CHECK ADD  CONSTRAINT [FK_pdck_creator] FOREIGN KEY([nguoi_tao_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] CHECK CONSTRAINT [FK_pdck_creator]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho]  WITH CHECK ADD  CONSTRAINT [FK_pdck_sr_nhap] FOREIGN KEY([showroom_nhap_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] CHECK CONSTRAINT [FK_pdck_sr_nhap]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho]  WITH CHECK ADD  CONSTRAINT [FK_pdck_sr_xuat] FOREIGN KEY([showroom_xuat_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] CHECK CONSTRAINT [FK_pdck_sr_xuat]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho]  WITH CHECK ADD  CONSTRAINT [FK_pdck_vin] FOREIGN KEY([xe_dinh_danh_id])
REFERENCES [dbo].[xe_dinh_danh] ([id])
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] CHECK CONSTRAINT [FK_pdck_vin]
GO
ALTER TABLE [dbo].[phu_kien]  WITH CHECK ADD  CONSTRAINT [FK_pk_danh_muc] FOREIGN KEY([danh_muc_id])
REFERENCES [dbo].[danh_muc_phu_kien] ([id])
GO
ALTER TABLE [dbo].[phu_kien] CHECK CONSTRAINT [FK_pk_danh_muc]
GO
ALTER TABLE [dbo].[phu_kien_dong_xe_tuong_thich]  WITH CHECK ADD  CONSTRAINT [FK_pkdx_dx] FOREIGN KEY([dong_xe_id])
REFERENCES [dbo].[dong_xe] ([id])
GO
ALTER TABLE [dbo].[phu_kien_dong_xe_tuong_thich] CHECK CONSTRAINT [FK_pkdx_dx]
GO
ALTER TABLE [dbo].[phu_kien_dong_xe_tuong_thich]  WITH CHECK ADD  CONSTRAINT [FK_pkdx_pk] FOREIGN KEY([phu_kien_id])
REFERENCES [dbo].[phu_kien] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[phu_kien_dong_xe_tuong_thich] CHECK CONSTRAINT [FK_pkdx_pk]
GO
ALTER TABLE [dbo].[showroom]  WITH CHECK ADD  CONSTRAINT [FK_sr_tinh_thanh] FOREIGN KEY([tinh_thanh_id])
REFERENCES [dbo].[tinh_thanh] ([id])
GO
ALTER TABLE [dbo].[showroom] CHECK CONSTRAINT [FK_sr_tinh_thanh]
GO
ALTER TABLE [dbo].[so_dia_chi]  WITH CHECK ADD  CONSTRAINT [FK_sdc_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[so_dia_chi] CHECK CONSTRAINT [FK_sdc_nguoi_dung]
GO
ALTER TABLE [dbo].[ton_kho_xe]  WITH CHECK ADD  CONSTRAINT [FK_tk_mau_sac] FOREIGN KEY([mau_sac_id])
REFERENCES [dbo].[mau_sac] ([id])
GO
ALTER TABLE [dbo].[ton_kho_xe] CHECK CONSTRAINT [FK_tk_mau_sac]
GO
ALTER TABLE [dbo].[ton_kho_xe]  WITH CHECK ADD  CONSTRAINT [FK_tk_phien_ban] FOREIGN KEY([phien_ban_id])
REFERENCES [dbo].[phien_ban_xe] ([id])
GO
ALTER TABLE [dbo].[ton_kho_xe] CHECK CONSTRAINT [FK_tk_phien_ban]
GO
ALTER TABLE [dbo].[ton_kho_xe]  WITH CHECK ADD  CONSTRAINT [FK_tk_showroom] FOREIGN KEY([showroom_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[ton_kho_xe] CHECK CONSTRAINT [FK_tk_showroom]
GO
ALTER TABLE [dbo].[xe_demo]  WITH CHECK ADD  CONSTRAINT [FK_xdm_phien_ban] FOREIGN KEY([phien_ban_id])
REFERENCES [dbo].[phien_ban_xe] ([id])
GO
ALTER TABLE [dbo].[xe_demo] CHECK CONSTRAINT [FK_xdm_phien_ban]
GO
ALTER TABLE [dbo].[xe_demo]  WITH CHECK ADD  CONSTRAINT [FK_xdm_showroom] FOREIGN KEY([showroom_id])
REFERENCES [dbo].[showroom] ([id])
GO
ALTER TABLE [dbo].[xe_demo] CHECK CONSTRAINT [FK_xdm_showroom]
GO
ALTER TABLE [dbo].[xe_dinh_danh]  WITH CHECK ADD  CONSTRAINT [FK_xe_dinh_danh_ton_kho] FOREIGN KEY([ton_kho_id])
REFERENCES [dbo].[ton_kho_xe] ([id])
GO
ALTER TABLE [dbo].[xe_dinh_danh] CHECK CONSTRAINT [FK_xe_dinh_danh_ton_kho]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra]  WITH CHECK ADD  CONSTRAINT [FK_ycdt_ctdh] FOREIGN KEY([chi_tiet_don_hang_id])
REFERENCES [dbo].[chi_tiet_don_hang] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] CHECK CONSTRAINT [FK_ycdt_ctdh]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra]  WITH CHECK ADD  CONSTRAINT [FK_ycdt_dh] FOREIGN KEY([don_hang_id])
REFERENCES [dbo].[don_hang_phu_kien] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] CHECK CONSTRAINT [FK_ycdt_dh]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc]  WITH CHECK ADD  CONSTRAINT [FK_ychc_admin] FOREIGN KEY([quan_tri_phe_duyet_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] CHECK CONSTRAINT [FK_ychc_admin]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc]  WITH CHECK ADD  CONSTRAINT [FK_ychc_phieu] FOREIGN KEY([phieu_dat_coc_id])
REFERENCES [dbo].[phieu_dat_coc] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] CHECK CONSTRAINT [FK_ychc_phieu]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc]  WITH CHECK ADD  CONSTRAINT [FK_ychc_staff] FOREIGN KEY([nhan_vien_doi_soat_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] CHECK CONSTRAINT [FK_ychc_staff]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [FK_yctv_nguoi_dung] FOREIGN KEY([nguoi_dung_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [FK_yctv_nguoi_dung]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [FK_yctv_nhan_vien] FOREIGN KEY([nhan_vien_id])
REFERENCES [dbo].[nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [FK_yctv_nhan_vien]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [FK_yctv_phien_ban] FOREIGN KEY([phien_ban_id])
REFERENCES [dbo].[phien_ban_xe] ([id])
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [FK_yctv_phien_ban]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca]  WITH CHECK ADD  CONSTRAINT [CK_bbgc_ca] CHECK  (([ca_ban_giao] IS NULL OR ([ca_ban_giao]=N'Hành chính' OR [ca_ban_giao]=N'Tối' OR [ca_ban_giao]=N'Chiều' OR [ca_ban_giao]=N'Sáng' OR [ca_ban_giao]=N'CA_HANH_CHINH' OR [ca_ban_giao]=N'CA_TOI' OR [ca_ban_giao]=N'CA_CHIEU' OR [ca_ban_giao]=N'CA_SANG')))
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] CHECK CONSTRAINT [CK_bbgc_ca]
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca]  WITH CHECK ADD  CONSTRAINT [CK_bbgc_staff] CHECK  (([nguoi_ban_giao_id]<>[nguoi_nhan_ca_id]))
GO
ALTER TABLE [dbo].[bien_ban_ban_giao_ca] CHECK CONSTRAINT [CK_bbgc_staff]
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh]  WITH CHECK ADD  CONSTRAINT [CK_bp_ngay] CHECK  (([ngay_het_hieu_luc] IS NULL OR [ngay_het_hieu_luc]>=[ngay_ap_dung]))
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh] CHECK CONSTRAINT [CK_bp_ngay]
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh]  WITH CHECK ADD  CONSTRAINT [CK_bp_phi] CHECK  (([phi_cap_bien_so]>=(0) AND [phi_dang_kiem]>=(0) AND [phi_bao_tri_duong_bo]>=(0) AND [phi_bao_hiem_tnds]>=(0)))
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh] CHECK CONSTRAINT [CK_bp_phi]
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh]  WITH CHECK ADD  CONSTRAINT [CK_bp_ty_le] CHECK  (([ty_le_phi_truoc_ba]=(12) OR [ty_le_phi_truoc_ba]=(10)))
GO
ALTER TABLE [dbo].[bieu_phi_lan_banh] CHECK CONSTRAINT [CK_bp_ty_le]
GO
ALTER TABLE [dbo].[chi_tiet_don_hang]  WITH CHECK ADD  CONSTRAINT [CK_ctdh_gia] CHECK  (([don_gia]>=(0)))
GO
ALTER TABLE [dbo].[chi_tiet_don_hang] CHECK CONSTRAINT [CK_ctdh_gia]
GO
ALTER TABLE [dbo].[chi_tiet_don_hang]  WITH CHECK ADD  CONSTRAINT [CK_ctdh_sl] CHECK  (([so_luong]>(0)))
GO
ALTER TABLE [dbo].[chi_tiet_don_hang] CHECK CONSTRAINT [CK_ctdh_sl]
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang]  WITH CHECK ADD  CONSTRAINT [CK_ctgh_gia] CHECK  (([don_gia_tam_tinh]>=(0)))
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang] CHECK CONSTRAINT [CK_ctgh_gia]
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang]  WITH CHECK ADD  CONSTRAINT [CK_ctgh_sl] CHECK  (([so_luong]>=(1)))
GO
ALTER TABLE [dbo].[chi_tiet_gio_hang] CHECK CONSTRAINT [CK_ctgh_sl]
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai]  WITH CHECK ADD  CONSTRAINT [CK_ctkm_gt] CHECK  (([gia_tri]>(0)))
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai] CHECK CONSTRAINT [CK_ctkm_gt]
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai]  WITH CHECK ADD  CONSTRAINT [CK_ctkm_loai] CHECK  (([loai_uu_dai]=N'VOUCHER' OR [loai_uu_dai]=N'HO_TRO_LE_PHI_TRUOC_BA' OR [loai_uu_dai]=N'GIAM_TIEN_MAT'))
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai] CHECK CONSTRAINT [CK_ctkm_loai]
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai]  WITH CHECK ADD  CONSTRAINT [CK_ctkm_ngay] CHECK  (([ngay_ket_thuc]>=[ngay_bat_dau]))
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai] CHECK CONSTRAINT [CK_ctkm_ngay]
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai]  WITH CHECK ADD  CONSTRAINT [CK_ctkm_pt] CHECK  (([loai_uu_dai]<>N'HO_TRO_LE_PHI_TRUOC_BA' OR [gia_tri]<=(100)))
GO
ALTER TABLE [dbo].[chuong_trinh_khuyen_mai] CHECK CONSTRAINT [CK_ctkm_pt]
GO
ALTER TABLE [dbo].[danh_gia]  WITH CHECK ADD  CONSTRAINT [CK_dg_json] CHECK  (([hinh_anh_danh_gia] IS NULL OR isjson([hinh_anh_danh_gia])=(1)))
GO
ALTER TABLE [dbo].[danh_gia] CHECK CONSTRAINT [CK_dg_json]
GO
ALTER TABLE [dbo].[danh_gia]  WITH CHECK ADD  CONSTRAINT [CK_dg_sao] CHECK  (([so_sao]>=(1) AND [so_sao]<=(5)))
GO
ALTER TABLE [dbo].[danh_gia] CHECK CONSTRAINT [CK_dg_sao]
GO
ALTER TABLE [dbo].[danh_gia]  WITH CHECK ADD  CONSTRAINT [CK_dg_tt] CHECK  (([trang_thai_duyet]=N'REJECTED' OR [trang_thai_duyet]=N'APPROVED' OR [trang_thai_duyet]=N'PENDING'))
GO
ALTER TABLE [dbo].[danh_gia] CHECK CONSTRAINT [CK_dg_tt]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_dh_han_pay] CHECK  (([phuong_thuc_thanh_toan]=N'VNPAY' OR [phuong_thuc_thanh_toan]=N'SEPAY' OR [han_thanh_toan] IS NULL))
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [CK_dh_han_pay]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_dh_pttt] CHECK  (([phuong_thuc_thanh_toan]=N'SEPAY' OR [phuong_thuc_thanh_toan]=N'VNPAY' OR [phuong_thuc_thanh_toan]=N'COD'))
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [CK_dh_pttt]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_dh_sdt] CHECK  (([so_dien_thoai_nhan] like '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'))
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [CK_dh_sdt]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_dh_tien] CHECK  (([phi_van_chuyen]>=(0) AND [so_tien_giam_voucher]>=(0) AND [tong_tien]>=(0)))
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [CK_dh_tien]
GO
ALTER TABLE [dbo].[don_hang_phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_dh_tt] CHECK  (([trang_thai]=N'REFUND_REQUIRED' OR [trang_thai]=N'RETURNED' OR [trang_thai]=N'CANCELLED' OR [trang_thai]=N'DELIVERED' OR [trang_thai]=N'SHIPPING' OR [trang_thai]=N'PROCESSING' OR [trang_thai]=N'PAID' OR [trang_thai]=N'PENDING_PAYMENT' OR [trang_thai]=N'PENDING'))
GO
ALTER TABLE [dbo].[don_hang_phu_kien] CHECK CONSTRAINT [CK_dh_tt]
GO
ALTER TABLE [dbo].[dong_xe]  WITH CHECK ADD  CONSTRAINT [CK_dx_phan_khuc] CHECK  (([phan_khuc]=N'Crossover' OR [phan_khuc]=N'MPV' OR [phan_khuc]=N'E-Sedan' OR [phan_khuc]=N'D-Sedan' OR [phan_khuc]=N'C-Sedan' OR [phan_khuc]=N'B-SUV' OR [phan_khuc]=N'A-SUV' OR [phan_khuc]=N'E-SUV' OR [phan_khuc]=N'D-SUV' OR [phan_khuc]=N'C-SUV' OR [phan_khuc]=N'Sedan' OR [phan_khuc]=N'SUV' OR [phan_khuc]=N'Bán tải' OR [phan_khuc]=N'Thương mại' OR [phan_khuc]=N'GT Hypercar' OR [phan_khuc]=N'Shooting Brake'))
GO
ALTER TABLE [dbo].[dong_xe] CHECK CONSTRAINT [CK_dx_phan_khuc]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [CK_gd_loai] CHECK  (([loai_giao_dich]=N'HOAN_TIEN' OR [loai_giao_dich]=N'THANH_TOAN'))
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [CK_gd_loai]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [CK_gd_pt] CHECK  (([phuong_thuc]=N'COD' OR [phuong_thuc]=N'SEPAY' OR [phuong_thuc]=N'VNPAY'))
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [CK_gd_pt]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [CK_gd_tien] CHECK  (([so_tien]>(0)))
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [CK_gd_tien]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [CK_gd_tt] CHECK  (([trang_thai]=N'FAILED' OR [trang_thai]=N'SUCCESS' OR [trang_thai]=N'PENDING'))
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [CK_gd_tt]
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan]  WITH CHECK ADD  CONSTRAINT [CK_gd_xor] CHECK  (([phieu_dat_coc_id] IS NOT NULL AND [don_hang_id] IS NULL OR [phieu_dat_coc_id] IS NULL AND [don_hang_id] IS NOT NULL))
GO
ALTER TABLE [dbo].[giao_dich_thanh_toan] CHECK CONSTRAINT [CK_gd_xor]
GO
ALTER TABLE [dbo].[hinh_anh_xe]  WITH CHECK ADD  CONSTRAINT [CK_ha_goc] CHECK  (([goc_quay] IS NULL OR [goc_quay]>=(0) AND [goc_quay]<=(360)))
GO
ALTER TABLE [dbo].[hinh_anh_xe] CHECK CONSTRAINT [CK_ha_goc]
GO
ALTER TABLE [dbo].[hinh_anh_xe]  WITH CHECK ADD  CONSTRAINT [CK_ha_loai] CHECK  (([loai_anh]=N'XOAY_360' OR [loai_anh]=N'NOI_THAT' OR [loai_anh]=N'NGOAI_THAT'))
GO
ALTER TABLE [dbo].[hinh_anh_xe] CHECK CONSTRAINT [CK_ha_loai]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [CK_lh_24h] CHECK  (([thoi_gian_hen]>=dateadd(hour,(24),[ngay_tao])))
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [CK_lh_24h]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [CK_lh_gplx] CHECK  (([cam_ket_gplx]=(1)))
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [CK_lh_gplx]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [CK_lh_sdt] CHECK  (([so_dien_thoai_khach] like '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'))
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [CK_lh_sdt]
GO
ALTER TABLE [dbo].[lich_hen_lai_thu]  WITH CHECK ADD  CONSTRAINT [CK_lh_tt] CHECK  (([trang_thai]=N'EXPIRED' OR [trang_thai]=N'CANCELLED' OR [trang_thai]=N'COMPLETED' OR [trang_thai]=N'CONFIRMED' OR [trang_thai]=N'PENDING'))
GO
ALTER TABLE [dbo].[lich_hen_lai_thu] CHECK CONSTRAINT [CK_lh_tt]
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien]  WITH CHECK ADD  CONSTRAINT [CK_lt_ca] CHECK  (([ca_truc]=N'Hành chính' OR [ca_truc]=N'Tối' OR [ca_truc]=N'Chiều' OR [ca_truc]=N'Sáng' OR [ca_truc]=N'CA_HANH_CHINH' OR [ca_truc]=N'CA_TOI' OR [ca_truc]=N'CA_CHIEU' OR [ca_truc]=N'CA_SANG'))
GO
ALTER TABLE [dbo].[lich_truc_nhan_vien] CHECK CONSTRAINT [CK_lt_ca]
GO
ALTER TABLE [dbo].[mau_sac]  WITH CHECK ADD  CONSTRAINT [CK_mau_hex] CHECK  (([ma_hex] like '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'))
GO
ALTER TABLE [dbo].[mau_sac] CHECK CONSTRAINT [CK_mau_hex]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [CK_nd_cccd] CHECK  (([so_cccd] IS NULL OR len([so_cccd])=(12) AND NOT [so_cccd] like '%[^0-9]%'))
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [CK_nd_cccd]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [CK_nd_gioi_tinh] CHECK  (([gioi_tinh] IS NULL OR ([gioi_tinh]='KHAC' OR [gioi_tinh]='NU' OR [gioi_tinh]='NAM' OR [gioi_tinh]=N'Khác' OR [gioi_tinh]=N'Nữ' OR [gioi_tinh]=N'Nam')))
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [CK_nd_gioi_tinh]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [CK_nd_ho_ten] CHECK  ((len(ltrim(rtrim([ho_ten])))>(0)))
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [CK_nd_ho_ten]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [CK_nd_sdt] CHECK  (([so_dien_thoai] IS NULL OR [so_dien_thoai] like '0[35789][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'))
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [CK_nd_sdt]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [CK_nd_trang_thai] CHECK  (([trang_thai_tai_khoan]=N'BI_KHOA' OR [trang_thai_tai_khoan]=N'HOAT_DONG' OR [trang_thai_tai_khoan]=N'CHUA_KICH_HOAT'))
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [CK_nd_trang_thai]
GO
ALTER TABLE [dbo].[nguoi_dung]  WITH CHECK ADD  CONSTRAINT [CK_nd_vai_tro] CHECK  (([vai_tro]=N'ROLE_ADMIN' OR [vai_tro]=N'ROLE_STAFF' OR [vai_tro]=N'ROLE_CUSTOMER'))
GO
ALTER TABLE [dbo].[nguoi_dung] CHECK CONSTRAINT [CK_nd_vai_tro]
GO
ALTER TABLE [dbo].[nhat_ky_hanh_vi]  WITH CHECK ADD  CONSTRAINT [CK_nkhv_json] CHECK  (([du_lieu_bo_sung] IS NULL OR isjson([du_lieu_bo_sung])=(1)))
GO
ALTER TABLE [dbo].[nhat_ky_hanh_vi] CHECK CONSTRAINT [CK_nkhv_json]
GO
ALTER TABLE [dbo].[phien_ban_xe]  WITH CHECK ADD  CONSTRAINT [CK_pb_coc] CHECK  (([muc_tien_coc]=(20000000) OR [muc_tien_coc]=(10000000)))
GO
ALTER TABLE [dbo].[phien_ban_xe] CHECK CONSTRAINT [CK_pb_coc]
GO
ALTER TABLE [dbo].[phien_ban_xe]  WITH CHECK ADD  CONSTRAINT [CK_pb_cho] CHECK  (([so_cho_ngoi]>(0)))
GO
ALTER TABLE [dbo].[phien_ban_xe] CHECK CONSTRAINT [CK_pb_cho]
GO
ALTER TABLE [dbo].[phien_ban_xe]  WITH CHECK ADD  CONSTRAINT [CK_pb_gia] CHECK  (([gia_niem_yet]>(0)))
GO
ALTER TABLE [dbo].[phien_ban_xe] CHECK CONSTRAINT [CK_pb_gia]
GO
ALTER TABLE [dbo].[phien_ban_xe]  WITH CHECK ADD  CONSTRAINT [CK_pb_nam] CHECK  (([nam_san_xuat]>=(1990) AND [nam_san_xuat]<=(2100)))
GO
ALTER TABLE [dbo].[phien_ban_xe] CHECK CONSTRAINT [CK_pb_nam]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [CK_pdc_cccd] CHECK  ((len([so_cccd])=(12) AND NOT [so_cccd] like '%[^0-9]%'))
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [CK_pdc_cccd]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [CK_pdc_coc] CHECK  (([so_tien_coc]>(0)))
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [CK_pdc_coc]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [CK_pdc_han] CHECK  (([han_thanh_toan]>[ngay_dat_coc]))
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [CK_pdc_han]
GO
ALTER TABLE [dbo].[phieu_dat_coc]  WITH CHECK ADD  CONSTRAINT [CK_pdc_tt] CHECK  (([trang_thai]=N'REFUND_REQUIRED' OR [trang_thai]=N'CANCELLED' OR [trang_thai]=N'COMPLETED' OR [trang_thai]=N'REFUNDED' OR [trang_thai]=N'REFUND_REQUESTED' OR [trang_thai]=N'EXPIRED' OR [trang_thai]=N'PAID' OR [trang_thai]=N'PENDING_PAYMENT'))
GO
ALTER TABLE [dbo].[phieu_dat_coc] CHECK CONSTRAINT [CK_pdc_tt]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho]  WITH CHECK ADD  CONSTRAINT [CK_pdck_sr] CHECK  (([showroom_xuat_id]<>[showroom_nhap_id]))
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] CHECK CONSTRAINT [CK_pdck_sr]
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho]  WITH CHECK ADD  CONSTRAINT [CK_pdck_tt] CHECK  (([trang_thai]=N'DA_HUY' OR [trang_thai]=N'DA_TIEP_NHAN' OR [trang_thai]=N'DANG_VAN_CHUYEN'))
GO
ALTER TABLE [dbo].[phieu_dieu_chuyen_kho] CHECK CONSTRAINT [CK_pdck_tt]
GO
ALTER TABLE [dbo].[phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_pk_gia] CHECK  (([gia_ban]>(0)))
GO
ALTER TABLE [dbo].[phu_kien] CHECK CONSTRAINT [CK_pk_gia]
GO
ALTER TABLE [dbo].[phu_kien]  WITH CHECK ADD  CONSTRAINT [CK_pk_ton] CHECK  (([so_luong_ton]>=(0)))
GO
ALTER TABLE [dbo].[phu_kien] CHECK CONSTRAINT [CK_pk_ton]
GO
ALTER TABLE [dbo].[phu_kien_dong_xe_tuong_thich]  WITH CHECK ADD  CONSTRAINT [CK_pkdx_nam] CHECK  (([nam_bat_dau] IS NULL OR [nam_ket_thuc] IS NULL OR [nam_ket_thuc]>=[nam_bat_dau]))
GO
ALTER TABLE [dbo].[phu_kien_dong_xe_tuong_thich] CHECK CONSTRAINT [CK_pkdx_nam]
GO
ALTER TABLE [dbo].[showroom]  WITH CHECK ADD  CONSTRAINT [CK_sr_gio] CHECK  (([gio_mo_cua]<[gio_dong_cua]))
GO
ALTER TABLE [dbo].[showroom] CHECK CONSTRAINT [CK_sr_gio]
GO
ALTER TABLE [dbo].[so_dia_chi]  WITH CHECK ADD  CONSTRAINT [CK_sdc_sdt] CHECK  (([so_dien_thoai] like '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'))
GO
ALTER TABLE [dbo].[so_dia_chi] CHECK CONSTRAINT [CK_sdc_sdt]
GO
ALTER TABLE [dbo].[ton_kho_xe]  WITH CHECK ADD  CONSTRAINT [CK_tk_gc] CHECK  (([so_luong_dang_giu_cho]>=(0)))
GO
ALTER TABLE [dbo].[ton_kho_xe] CHECK CONSTRAINT [CK_tk_gc]
GO
ALTER TABLE [dbo].[ton_kho_xe]  WITH CHECK ADD  CONSTRAINT [CK_tk_kd] CHECK  (([so_luong_kha_dung]>=(0)))
GO
ALTER TABLE [dbo].[ton_kho_xe] CHECK CONSTRAINT [CK_tk_kd]
GO
ALTER TABLE [dbo].[voucher]  WITH CHECK ADD  CONSTRAINT [CK_vc_pt] CHECK  (([phan_tram_giam]>=(0) AND [phan_tram_giam]<=(100)))
GO
ALTER TABLE [dbo].[voucher] CHECK CONSTRAINT [CK_vc_pt]
GO
ALTER TABLE [dbo].[voucher]  WITH CHECK ADD  CONSTRAINT [CK_vc_td] CHECK  (([giam_toi_da]>=(0)))
GO
ALTER TABLE [dbo].[voucher] CHECK CONSTRAINT [CK_vc_td]
GO
ALTER TABLE [dbo].[xe_demo]  WITH CHECK ADD  CONSTRAINT [CK_xdm_tt] CHECK  (([trang_thai]=N'BAO_DUONG' OR [trang_thai]=N'DANG_CHAY_THU' OR [trang_thai]=N'SAN_SANG'))
GO
ALTER TABLE [dbo].[xe_demo] CHECK CONSTRAINT [CK_xdm_tt]
GO
ALTER TABLE [dbo].[xe_dinh_danh]  WITH CHECK ADD  CONSTRAINT [CK_xdd_tt] CHECK  (([trang_thai]=N'DA_BAN' OR [trang_thai]=N'DA_GIU_CHO' OR [trang_thai]=N'CO_SAN'))
GO
ALTER TABLE [dbo].[xe_dinh_danh] CHECK CONSTRAINT [CK_xdd_tt]
GO
ALTER TABLE [dbo].[xe_dinh_danh]  WITH CHECK ADD  CONSTRAINT [CK_xdd_vin] CHECK  ((NOT [so_khung_vin] like '%[^A-HJ-NPR-Za-hj-npr-z0-9]%'))
GO
ALTER TABLE [dbo].[xe_dinh_danh] CHECK CONSTRAINT [CK_xdd_vin]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra]  WITH CHECK ADD  CONSTRAINT [CK_ycdt_gq] CHECK  (([phuong_an_giai_quyet] IS NULL OR ([phuong_an_giai_quyet]=N'DOISANPHAMKHAC' OR [phuong_an_giai_quyet]=N'DOIMOI' OR [phuong_an_giai_quyet]=N'DOI_HANG' OR [phuong_an_giai_quyet]=N'HOAN_TIEN')))
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] CHECK CONSTRAINT [CK_ycdt_gq]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra]  WITH CHECK ADD  CONSTRAINT [CK_ycdt_mm] CHECK  (([phuong_an_mong_muon]=N'DOISANPHAMKHAC' OR [phuong_an_mong_muon]=N'DOIMOI' OR [phuong_an_mong_muon]=N'DOI_HANG' OR [phuong_an_mong_muon]=N'HOAN_TIEN'))
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] CHECK CONSTRAINT [CK_ycdt_mm]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra]  WITH CHECK ADD  CONSTRAINT [CK_ycdt_sl] CHECK  (([so_luong_doi_tra]>(0)))
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] CHECK CONSTRAINT [CK_ycdt_sl]
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra]  WITH CHECK ADD  CONSTRAINT [CK_ycdt_tt] CHECK  (([trang_thai]=N'COMPLETED' OR [trang_thai]=N'REJECTED' OR [trang_thai]=N'APPROVED' OR [trang_thai]=N'PENDING'))
GO
ALTER TABLE [dbo].[yeu_cau_doi_tra] CHECK CONSTRAINT [CK_ycdt_tt]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc]  WITH CHECK ADD  CONSTRAINT [CK_ychc_loai] CHECK  (([loai_ly_do]=N'LYDOKHAC' OR [loai_ly_do]=N'DOYYEUCAU' OR [loai_ly_do]=N'QUATHOIHAN72H' OR [loai_ly_do]=N'NGOAI_LE_ADMIN' OR [loai_ly_do]=N'NGAN_HANG_TU_CHOI_TIN_DUNG'))
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] CHECK CONSTRAINT [CK_ychc_loai]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc]  WITH CHECK ADD  CONSTRAINT [CK_ychc_tt] CHECK  (([trang_thai]=N'CANCELLED' OR [trang_thai]=N'REJECTED' OR [trang_thai]=N'REFUNDED' OR [trang_thai]=N'APPROVED' OR [trang_thai]=N'VERIFIED' OR [trang_thai]=N'PENDING'))
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] CHECK CONSTRAINT [CK_ychc_tt]
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc]  WITH CHECK ADD  CONSTRAINT [CK_ychc_tu_choi] CHECK  (([trang_thai]<>N'REJECTED' OR [ly_do_tu_choi] IS NOT NULL))
GO
ALTER TABLE [dbo].[yeu_cau_hoan_coc] CHECK CONSTRAINT [CK_ychc_tu_choi]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [CK_yctv_email] CHECK  (([email] like N'_%@_%._%'))
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [CK_yctv_email]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [CK_yctv_ho_ten] CHECK  ((len(ltrim(rtrim([ho_ten])))>(0)))
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [CK_yctv_ho_ten]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [CK_yctv_sdt] CHECK  (([so_dien_thoai] like '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'))
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [CK_yctv_sdt]
GO
ALTER TABLE [dbo].[yeu_cau_tu_van]  WITH CHECK ADD  CONSTRAINT [CK_yctv_tt] CHECK  (([trang_thai]=N'CLOSED' OR [trang_thai]=N'CONTACTED' OR [trang_thai]=N'PENDING'))
GO
ALTER TABLE [dbo].[yeu_cau_tu_van] CHECK CONSTRAINT [CK_yctv_tt]
GO


-- ============================================================================
-- PHAN HE NHAN VIEN (STAFF OPERATIONS INTEGRATION)
-- 1. Bang ton kho phu kien theo tung showroom
-- 2. Bang phieu dieu chuyen phu kien giua cac showroom
-- 3. Bang lich su & phieu bao duong xe Demo
-- 4. Khoi tao du lieu mau ton kho chi tiet & lich su bao duong
-- ============================================================================

-- 1. Bang ton kho phu kien theo tung showroom
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

-- 2. Bang phieu dieu chuyen phu kien giua cac showroom
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

-- 3. Bang lich su & phieu bao duong xe Demo
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
