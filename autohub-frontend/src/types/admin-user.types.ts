export type VaiTroNguoiDung = 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
export type TrangThaiTaiKhoan = 'HOAT_DONG' | 'BI_KHOA' | 'CHUA_KICH_HOAT';

export interface AdminUser {
  id: number;
  userCode: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  soCCCD: string;
  anhDaiDien?: string;
  vaiTro: VaiTroNguoiDung;
  vaiTroLabel: string;
  showroomId?: number;
  tenShowroom: string;
  trangThaiTaiKhoan: TrangThaiTaiKhoan;
  dangHoatDong: boolean;
  ngayTao: string;
  updatedAt?: string;
}

export interface AdminUserStats {
  totalUsers: number;
  adminCount: number;
  staffCount: number;
  customerCount: number;
  activeCount: number;
  lockedCount: number;
}

export interface UpdateUserRolePayload {
  vaiTro: VaiTroNguoiDung;
  showroomId?: number;
}

export interface CreateStaffUserPayload {
  hoTen: string;
  email: string;
  password: string;
  soDienThoai?: string;
  soCCCD?: string;
  vaiTro: VaiTroNguoiDung;
  showroomId?: number;
}
