import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  KeyRound,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  Building2,
  Phone,
  Mail,
  BadgeCheck,
  FileSignature,
  FileText,
  X,
  History,
  RefreshCw,
  Loader2,
  Search,
  Calendar,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type {
  ShiftHandoverRecord,
  StaffColleague,
  StaffProfile,
  StaffScheduleItem,
} from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const ShiftHandoverPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [colleagues, setColleagues] = useState<StaffColleague[]>([]);
  const [schedules, setSchedules] = useState<StaffScheduleItem[]>([]);
  const [history, setHistory] = useState<ShiftHandoverRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Live clock
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString('vi-VN', { hour12: false })
  );

  // Form states
  const [shiftCode, setShiftCode] = useState<'CA_SANG' | 'CA_CHIEU' | 'CA_TOI' | 'CA_HANH_CHINH'>('CA_SANG');
  const [receiverId, setReceiverId] = useState<number>(0);
  const [pendingLeadsCount, setPendingLeadsCount] = useState<number>(0);
  const [packedOrdersHandedOver, setPackedOrdersHandedOver] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Asset checklist items
  const [assetsChecklist, setAssetsChecklist] = useState({
    keysInSafe: true,
    ordersHanded: true,
    posReconciled: true,
    showroomClean: true,
  });

  // Password modal states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<ShiftHandoverRecord | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('vi-VN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, colleaguesData, schedulesData, handoversData] = await Promise.all([
        staffService.getStaffProfile(),
        staffService.getStaffColleagues(),
        staffService.getStaffSchedules(),
        staffService.getShiftHandovers(),
      ]);
      setProfile(profileData);
      setColleagues(colleaguesData || []);
      setSchedules(schedulesData || []);
      setHistory(handoversData || []);
      if (colleaguesData && colleaguesData.length > 0) {
        setReceiverId((prev) => (prev > 0 ? prev : colleaguesData[0].id));
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu hồ sơ & bàn giao ca từ SQL Server:', err);
      setError('Không thể tải dữ liệu hồ sơ nhân sự và biên bản bàn giao ca từ SQL Server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (rec) =>
        rec.id.toLowerCase().includes(q) ||
        rec.handedOverBy.toLowerCase().includes(q) ||
        rec.receivedBy.toLowerCase().includes(q) ||
        rec.shiftType.toLowerCase().includes(q) ||
        rec.notes.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const initials = useMemo(() => {
    if (!profile?.fullName) return 'NV';
    return profile.fullName
      .trim()
      .split(/\s+/)
      .slice(-3)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
  }, [profile]);

  const handleSubmitHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!assetsChecklist.keysInSafe) {
      showToast('Chưa thu hồi đủ chìa khóa xe Demo vào tủ an toàn!', 'error');
      return;
    }
    if (!receiverId) {
      showToast('Vui lòng chọn nhân viên tiếp nhận ca!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await staffService.createShiftHandover({
        shiftCode,
        shiftType: shiftCode,
        receiverId,
        pendingLeadsCount,
        demoKeysVerified: assetsChecklist.keysInSafe,
        packedOrdersHandedOver,
        notes: notes.trim(),
      });
      setNotes('');
      await fetchAllData();
      showToast(`Đã ký điện tử và lưu biên bản ${created.id} bàn giao cho ${created.receivedBy}!`);
    } catch (err) {
      console.error('Lỗi lưu biên bản bàn giao ca:', err);
      const msg = err instanceof Error ? err.message : 'Không thể lưu biên bản bàn giao ca.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPassword) return;
    if (!currentPassword || !newPassword) {
      showToast('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await staffService.changeStaffPassword(currentPassword, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Đã đổi mật khẩu nhân viên thành công!');
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      const msg = err instanceof Error ? err.message : 'Không thể đổi mật khẩu. Kiểm tra lại mật khẩu hiện tại.';
      showToast(msg, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={cn('space-y-6 transition-colors duration-300', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 text-white text-sm font-medium rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300',
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
          )}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors shadow-sm',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Hồ Sơ Nhân Sự & Biên Bản Bàn Giao Ca Vận Hành
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu trực tiếp từ SQL Server: Quản lý hồ sơ công tác, lịch trực showroom và biên bản bàn giao ca.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-xl border transition-colors',
              isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50 text-[#89CEFF]' : 'bg-slate-100 border-slate-200 text-slate-700'
            )}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Thời gian hệ thống: {currentTime}</span>
          </div>

          <button
            type="button"
            onClick={fetchAllData}
            className={cn(
              'px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            Làm mới
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải hồ sơ nhân sự và nhật ký bàn giao ca từ SQL Server...</p>
        </div>
      ) : error ? (
        <div className={cn('p-10 text-center rounded-2xl border space-y-3', isDarkMode ? 'bg-[#0B1326] border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700')}>
          <p className="text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchAllData}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Thử lại
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: STAFF PROFILE CARD (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              <div
                className={cn(
                  'p-6 rounded-2xl border shadow-sm relative overflow-hidden transition-colors',
                  isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
                )}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg">
                      <div
                        className={cn(
                          'w-full h-full rounded-full flex items-center justify-center font-bold text-3xl',
                          isDarkMode ? 'bg-[#0B1326] text-indigo-400' : 'bg-white text-indigo-600'
                        )}
                      >
                        {initials}
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B1326] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    </span>
                  </div>

                  <h2 className={cn('text-lg font-bold mt-3', isDarkMode ? 'text-white' : 'text-slate-900')}>
                    {profile?.fullName || '-'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={cn(
                        'text-xs font-mono font-semibold px-2 py-0.5 rounded border',
                        isDarkMode
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      )}
                    >
                      {profile?.staffCode || '-'}
                    </span>
                    <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {profile?.roleLabel || 'Nhân Viên Showroom'}
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    'mt-6 pt-5 border-t space-y-3 text-xs transition-colors',
                    isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'
                  )}
                >
                  <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                    <span className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Showroom:
                    </span>
                    <span className={cn('font-semibold text-right', isDarkMode ? 'text-white' : 'text-slate-900')}>
                      {profile?.showroomName || '-'}
                    </span>
                  </div>
                  <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email:
                    </span>
                    <span className={cn('font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                      {profile?.email || '-'}
                    </span>
                  </div>
                  <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Số điện thoại:
                    </span>
                    <span className={cn('font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                      {profile?.phone || '-'}
                    </span>
                  </div>
                  <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                    <span className="flex items-center gap-2">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Trạng thái tài khoản:
                    </span>
                    <span className="font-semibold text-emerald-500">
                      {profile?.accountStatus === 'HOAT_DONG' ? 'Đang hoạt động' : profile?.accountStatus || '-'}
                    </span>
                  </div>
                </div>

                <div className={cn('mt-6 pt-4 border-t', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer',
                      isDarkMode
                        ? 'bg-[#171F33] text-[#DAE2FD] border-[#3E4850]/60 hover:bg-[#222A3D]'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    )}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Đổi Mật Khẩu Đăng Nhập</span>
                  </button>
                </div>
              </div>

              {/* Shift Schedule Box (Real DB lich_truc_nhan_vien) */}
              <div
                className={cn(
                  'p-4 rounded-2xl border text-xs space-y-2.5 transition-colors',
                  isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
                )}
              >
                <div className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-500">
                  <Calendar className="w-4 h-4" />
                  Lịch Phân Công Ca Trực Showroom ({schedules.length})
                </div>
                {schedules.length === 0 ? (
                  <p className="text-slate-400 text-[11px]">Chưa có lịch trực được phân công.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {schedules.slice(0, 6).map((sc, idx) => (
                      <div
                        key={`${sc.staffCode}-${idx}`}
                        className={cn(
                          'p-2 rounded-lg border flex items-center justify-between text-[11px]',
                          isDarkMode ? 'bg-[#171F33] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                        )}
                      >
                        <span className="font-mono font-bold text-indigo-500">{sc.staffCode}</span>
                        <span className="truncate ml-2">{sc.shift}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: HANDOVER FORM (8 COLS) */}
            <div className="lg:col-span-8">
              <form
                onSubmit={handleSubmitHandover}
                className={cn(
                  'p-6 rounded-2xl border shadow-sm space-y-5 transition-colors',
                  isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
                )}
              >
                <div className={cn('flex items-center justify-between pb-3 border-b', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                  <div className="flex items-center gap-2">
                    <FileSignature className="w-5 h-5 text-indigo-500" />
                    <h3 className={cn('font-bold text-base', isDarkMode ? 'text-white' : 'text-slate-900')}>
                      Lập Biên Bản Bàn Giao Ca Vận Hành Hôm Nay
                    </h3>
                  </div>
                  <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                    Mẫu chuẩn AutoHub Retail
                  </span>
                </div>

                {/* Shift & Receiver */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                      Ca trực bàn giao:
                    </label>
                    <select
                      value={shiftCode}
                      onChange={(e) => setShiftCode(e.target.value as 'CA_SANG' | 'CA_CHIEU' | 'CA_TOI' | 'CA_HANH_CHINH')}
                      className={cn(
                        'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                        isDarkMode
                          ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/40'
                      )}
                    >
                      <option value="CA_SANG">Ca Sáng (08:00 - 12:00) bàn giao cho Ca Chiều</option>
                      <option value="CA_CHIEU">Ca Chiều (13:30 - 17:30) bàn giao cho Ca Tối / Sáng hôm sau</option>
                      <option value="CA_TOI">Ca Tối (17:30 - 21:00) bàn giao cho Ca Sáng hôm sau</option>
                      <option value="CA_HANH_CHINH">Ca Hành Chính (08:00 - 17:30)</option>
                    </select>
                  </div>

                  <div>
                    <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                      Nhân viên nhận bàn giao ca tiếp theo:
                    </label>
                    <select
                      value={receiverId}
                      onChange={(e) => setReceiverId(Number(e.target.value))}
                      className={cn(
                        'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                        isDarkMode
                          ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/40'
                      )}
                    >
                      {colleagues.length === 0 ? (
                        <option value={0}>-- Không có nhân sự tiếp nhận khả dụng --</option>
                      ) : (
                        colleagues.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.fullName} ({c.staffCode} - {c.showroomName})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Metrics Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={cn(
                      'p-3.5 rounded-xl border transition-colors',
                      isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                    )}
                  >
                    <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                      Số lượng khách cần tiếp tục chăm sóc (Follow-up):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={pendingLeadsCount}
                        onChange={(e) => setPendingLeadsCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={cn(
                          'w-24 px-3 py-1.5 text-sm font-mono font-bold rounded-lg border',
                          isDarkMode
                            ? 'bg-[#0B1326] border-[#3E4850]/60 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        )}
                      />
                      <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>khách hàng tiềm năng</span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'p-3.5 rounded-xl border transition-colors',
                      isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                    )}
                  >
                    <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                      Đơn kiện / hợp đồng bàn giao trong ca:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={packedOrdersHandedOver}
                        onChange={(e) => setPackedOrdersHandedOver(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={cn(
                          'w-24 px-3 py-1.5 text-sm font-mono font-bold rounded-lg border',
                          isDarkMode
                            ? 'bg-[#0B1326] border-[#3E4850]/60 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        )}
                      />
                      <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>hồ sơ / kiện hàng</span>
                    </div>
                  </div>
                </div>

                {/* Asset checklist */}
                <div
                  className={cn(
                    'p-4 rounded-xl border space-y-2.5 transition-colors',
                    isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className={cn('text-xs font-bold uppercase tracking-wider flex items-center gap-1.5', isDarkMode ? 'text-[#89CEFF]' : 'text-slate-700')}>
                    <KeyRound className="w-4 h-4 text-indigo-500" />
                    Kiểm đếm an toàn & Tài sản Showroom trước khi rời ca:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                      <input
                        type="checkbox"
                        checked={assetsChecklist.keysInSafe}
                        onChange={(e) =>
                          setAssetsChecklist({ ...assetsChecklist, keysInSafe: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Đã thu hồi đủ chìa khóa xe Demo vào tủ an toàn</span>
                    </label>

                    <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                      <input
                        type="checkbox"
                        checked={assetsChecklist.ordersHanded}
                        onChange={(e) =>
                          setAssetsChecklist({ ...assetsChecklist, ordersHanded: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Đã bàn giao các đơn phụ kiện đóng gói cho bưu tá</span>
                    </label>

                    <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                      <input
                        type="checkbox"
                        checked={assetsChecklist.posReconciled}
                        onChange={(e) =>
                          setAssetsChecklist({ ...assetsChecklist, posReconciled: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Đã in đối soát cuộn hóa đơn máy POS quẹt thẻ cọc</span>
                    </label>

                    <label className={cn('flex items-center gap-2 cursor-pointer', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                      <input
                        type="checkbox"
                        checked={assetsChecklist.showroomClean}
                        onChange={(e) =>
                          setAssetsChecklist({ ...assetsChecklist, showroomClean: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Khoang xe demo sạch sẽ, sàn trưng bày đạt chuẩn 5S</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                    Ghi chú tồn đọng / Dặn dò nhân viên ca sau tiếp quản:
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập thông tin khách cần gọi lại, vấn đề xe lái thử phát sinh..."
                    className={cn(
                      'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                      isDarkMode
                        ? 'bg-[#171F33] border-[#3E4850]/50 text-white placeholder:text-[#88929B] focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/40'
                    )}
                  />
                </div>

                {/* Submit */}
                <div className={cn('flex items-center justify-end pt-3 border-t', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
                  <button
                    type="submit"
                    disabled={isSubmitting || colleagues.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 shadow-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang lưu...' : 'Ký Điện Tử & Gửi Biên Bản Bàn Giao Ca'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SECTION: HANDOVER LOG HISTORY */}
          <div
            className={cn(
              'rounded-2xl border overflow-hidden shadow-sm transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
            )}
          >
            <div className={cn('p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                <h3 className={cn('font-bold text-base', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Nhật Ký Biên Bản Bàn Giao Ca Vận Hành ({filteredHistory.length})
                </h3>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm mã biên bản, nhân viên, ghi chú..."
                  className={cn(
                    'w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none',
                    isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-200'
                  )}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead
                  className={cn(
                    'text-xs uppercase tracking-wider border-b font-semibold transition-colors',
                    isDarkMode
                      ? 'bg-[#131B2E] text-[#BEC8D2] border-[#3E4850]/40'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  )}
                >
                  <tr>
                    <th className="py-3 px-4">Mã Biên Bản</th>
                    <th className="py-3 px-4">Ca Trực & Ngày</th>
                    <th className="py-3 px-4">Người Bàn Giao</th>
                    <th className="py-3 px-4">Người Tiếp Nhận</th>
                    <th className="py-3 px-4 text-center">Khách Tồn</th>
                    <th className="py-3 px-4 text-center">Chìa Khóa Demo</th>
                    <th className="py-3 px-4 text-center">Đơn Kiện</th>
                    <th className="py-3 px-4 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody
                  className={cn(
                    'divide-y transition-colors',
                    isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200'
                  )}
                >
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={cn('py-10 text-center text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                        Chưa có biên bản bàn giao ca nào phù hợp trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((rec) => (
                      <tr
                        key={rec.id}
                        className={cn(
                          'transition-colors',
                          isDarkMode ? 'hover:bg-[#171F33]' : 'hover:bg-slate-50'
                        )}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-500">
                          {rec.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>{rec.shiftType}</div>
                          <div className={cn('text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>{rec.createdAt}</div>
                        </td>
                        <td className={cn('py-3.5 px-4 text-xs font-medium', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                          {rec.handedOverBy}
                        </td>
                        <td className={cn('py-3.5 px-4 text-xs font-medium', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
                          {rec.receivedBy}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-500">
                          {rec.pendingLeadsCount}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-xs font-semibold',
                              rec.demoKeysVerified ? 'text-emerald-500' : 'text-amber-500'
                            )}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {rec.demoKeysVerified ? 'Đủ chìa khóa' : 'Cần đối soát'}
                          </span>
                        </td>
                        <td className={cn('py-3.5 px-4 text-center font-mono font-bold', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700')}>
                          {rec.packedOrdersHandedOver}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRecordForDetail(rec)}
                            className={cn(
                              'px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer',
                              isDarkMode
                                ? 'bg-[#171F33] text-[#DAE2FD] border-[#3E4850]/60 hover:bg-[#222A3D]'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            )}
                          >
                            Xem ghi chú
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DETAIL MODAL */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'rounded-2xl max-w-lg w-full p-6 shadow-2xl border transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            <div className={cn('flex items-center justify-between pb-3 border-b', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Chi Tiết Biên Bản Bàn Giao {selectedRecordForDetail.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecordForDetail(null)}
                className={cn('p-1 rounded-lg transition-colors cursor-pointer', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-100 text-slate-500')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div
                className={cn(
                  'p-3 rounded-xl border space-y-1',
                  isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div><strong>Ca trực:</strong> {selectedRecordForDetail.shiftType}</div>
                <div><strong>Người bàn giao:</strong> {selectedRecordForDetail.handedOverBy}</div>
                <div><strong>Người tiếp nhận:</strong> {selectedRecordForDetail.receivedBy}</div>
                <div><strong>Thời điểm:</strong> {selectedRecordForDetail.createdAt}</div>
              </div>

              <div>
                <strong className={cn('block mb-1', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Nội dung ghi chú & Dặn dò tồn đọng:
                </strong>
                <div
                  className={cn(
                    'p-3 rounded-xl border',
                    isDarkMode
                      ? 'bg-indigo-950/20 border-indigo-500/30 text-[#DAE2FD]'
                      : 'bg-indigo-50/50 border-indigo-200 text-slate-800'
                  )}
                >
                  {selectedRecordForDetail.notes || 'Không có ghi chú bổ sung.'}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'rounded-2xl max-w-sm w-full p-6 shadow-2xl border transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            <h3 className="font-bold text-base mb-1">Đổi Mật Khẩu Nội Bộ</h3>
            <p className={cn('text-xs mb-4', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Cập nhật mật khẩu tài khoản nhân viên {profile?.staffCode || ''}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full px-3 py-2 rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Mật khẩu mới:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full px-3 py-2 rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nhập lại mật khẩu mới:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full px-3 py-2 rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-xl border transition-colors cursor-pointer',
                  isDarkMode ? 'border-[#3E4850]/50 text-[#88929B] hover:bg-[#171F33]' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isChangingPassword}
                onClick={handleChangePassword}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isChangingPassword ? 'Đang lưu...' : 'Lưu Mật Khẩu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
