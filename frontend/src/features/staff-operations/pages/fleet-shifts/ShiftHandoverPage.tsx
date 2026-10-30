import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_HANDOVER_HISTORY, type ShiftHandoverRecord } from '@/features/staff-operations/mocks/staff.mock';
import { cn } from '@/lib/utils';

export const ShiftHandoverPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [history, setHistory] = useState<ShiftHandoverRecord[]>(MOCK_HANDOVER_HISTORY);

  // Form states
  const [shiftType, setShiftType] = useState('Ca Sáng (08:00 - 15:00) bàn giao cho Ca Chiều (15:00 - 21:00)');
  const [receivedBy, setReceivedBy] = useState('Trần Thu Hà (STF-006)');
  const [pendingLeadsCount, setPendingLeadsCount] = useState<number>(3);
  const [packedOrdersHandedOver, setPackedOrdersHandedOver] = useState<number>(8);
  const [notes, setNotes] = useState(
    'Khách Nguyễn Văn An (#L-9921) hẹn gọi lại lúc 16:00 tư vấn gói vay 70%. Đã nạp đầy pin 100% cho 2 xe VF8 lái thử ngày mai.'
  );

  // Asset checklist items
  const [assetsChecklist, setAssetsChecklist] = useState({
    keysInSafe: true,
    ordersHanded: true,
    posReconciled: true,
    showroomClean: true,
  });

  const demoKeysVerified = assetsChecklist.keysInSafe;

  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<ShiftHandoverRecord | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetsChecklist.keysInSafe) {
      alert('Chưa thu hồi đủ chìa khóa xe Demo vào tủ an toàn!');
      return;
    }

    const newRecord: ShiftHandoverRecord = {
      id: `HND-${Math.floor(1000 + Math.random() * 9000)}`,
      shiftType: shiftType.includes('Ca Sáng') ? 'Ca Sáng -> Chiều' : 'Ca Chiều -> Tối',
      date: new Date().toLocaleDateString('vi-VN'),
      handedOverBy: 'Nguyễn Văn Tuấn (STF-004)',
      receivedBy,
      pendingLeadsCount,
      demoKeysVerified,
      packedOrdersHandedOver,
      notes: notes.trim(),
      createdAt: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    };

    setHistory([newRecord, ...history]);
    showToast(`Đã ký điện tử biên bản bàn giao ca trực thành công cho ${receivedBy}!`);
  };

  return (
    <div className={cn('space-y-6 transition-colors duration-300', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successToast}</span>
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
            Quản lý hồ sơ công tác cá nhân, ký kết bàn giao tài sản showroom và chuyển giao tác vụ giữa các ca trực
          </p>
        </div>

        <div
          className={cn(
            'flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-xl border transition-colors',
            isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50 text-[#89CEFF]' : 'bg-slate-100 border-slate-200 text-slate-700'
          )}
        >
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Thời gian hệ thống: Hôm nay, 14:45:00</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: STAFF PROFILE CARD (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className={cn(
              'p-6 rounded-2xl border shadow-sm relative overflow-hidden transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
            )}
          >
            {/* Background decoration */}
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
                    NVT
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B1326] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                </span>
              </div>

              <h2 className={cn('text-lg font-bold mt-3', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Nguyễn Văn Tuấn
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
                  STF-004
                </span>
                <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  Chuyên Viên Tư Vấn Xe Cao Cấp
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
                <span className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  AutoHub TP.HCM - Q.7
                </span>
              </div>
              <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email:
                </span>
                <span className={cn('font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  tuan.nguyen@autohub.vn
                </span>
              </div>
              <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Hotline chi nhánh:
                </span>
                <span className={cn('font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  0903.888.777
                </span>
              </div>
              <div className={cn('flex items-center justify-between', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600')}>
                <span className="flex items-center gap-2">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Trạng thái tài khoản:
                </span>
                <span className="font-semibold text-emerald-500">Đang hoạt động (Active)</span>
              </div>
            </div>

            <div className={cn('mt-6 pt-4 border-t', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors',
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

          {/* Quick Shift Rules Box */}
          <div
            className={cn(
              'p-4 rounded-2xl border text-xs space-y-2 transition-colors',
              isDarkMode
                ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
                : 'bg-indigo-50/50 border-indigo-200 text-indigo-900'
            )}
          >
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileSignature className="w-4 h-4 text-indigo-500" />
              Quy chuẩn bàn giao ca trực Showroom:
            </div>
            <p className={cn('text-[11px] leading-relaxed', isDarkMode ? 'text-indigo-300/80' : 'text-indigo-800/90')}>
              Nhân viên bắt buộc kiểm đếm đủ 100% chìa khóa xe demo vật lý và các đơn phụ kiện chưa bàn giao trước khi rời ca. Biên bản được ký điện tử và lưu trữ tự động vào hệ thống phục vụ đánh giá KPI tháng.
            </p>
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
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/40'
                  )}
                >
                  <option value="Ca Sáng (08:00 - 15:00) bàn giao cho Ca Chiều (15:00 - 21:00)">
                    Ca Sáng (08:00 - 15:00) bàn giao cho Ca Chiều (15:00 - 21:00)
                  </option>
                  <option value="Ca Chiều (15:00 - 21:00) bàn giao cho Bảo vệ & Ca Sáng hôm sau">
                    Ca Chiều (15:00 - 21:00) bàn giao cho Bảo vệ & Ca Sáng hôm sau
                  </option>
                </select>
              </div>

              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Nhân viên nhận bàn giao ca tiếp theo:
                </label>
                <select
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/40'
                  )}
                >
                  <option value="Trần Thu Hà (STF-006)">Trần Thu Hà (STF-006 - Tư vấn)</option>
                  <option value="Lê Quốc Cường (STF-009)">Lê Quốc Cường (STF-009 - Tư vấn)</option>
                  <option value="Hoàng Minh Thắng (STF-002)">Hoàng Minh Thắng (STF-002 - Quản lý ca)</option>
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
                    onChange={(e) => setPendingLeadsCount(parseInt(e.target.value) || 0)}
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
                  Đơn phụ kiện đóng gói bàn giao bưu tá chiều:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={packedOrdersHandedOver}
                    onChange={(e) => setPackedOrdersHandedOver(parseInt(e.target.value) || 0)}
                    className={cn(
                      'w-24 px-3 py-1.5 text-sm font-mono font-bold rounded-lg border',
                      isDarkMode
                        ? 'bg-[#0B1326] border-[#3E4850]/60 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    )}
                  />
                  <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>kiện hàng xuất kho</span>
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
                  <span>Đã thu hồi đủ 6 chìa khóa xe Demo vào tủ an toàn</span>
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
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Ký Điện Tử & Gửi Biên Bản Bàn Giao Ca</span>
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
        <div className={cn('p-4 border-b flex items-center justify-between', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className={cn('font-bold text-base', isDarkMode ? 'text-white' : 'text-slate-900')}>
              Nhật Ký Biên Bản Bàn Giao Ca Vận Hành Gần Đây
            </h3>
          </div>
          <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            {history.length} biên bản đã ghi nhận
          </span>
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
              {history.map((rec) => (
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
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đủ 6 chìa
                    </span>
                  </td>
                  <td className={cn('py-3.5 px-4 text-center font-mono font-bold', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700')}>
                    {rec.packedOrdersHandedOver}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRecordForDetail(rec)}
                      className={cn(
                        'px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors',
                        isDarkMode
                          ? 'bg-[#171F33] text-[#DAE2FD] border-[#3E4850]/60 hover:bg-[#222A3D]'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      )}
                    >
                      Xem ghi chú
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                onClick={() => setSelectedRecordForDetail(null)}
                className={cn('p-1 rounded-lg transition-colors', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-100 text-slate-500')}
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
                  {selectedRecordForDetail.notes}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
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
              Cập nhật mật khẩu tài khoản nhân viên STF-004
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Mật khẩu hiện tại:</label>
                <input
                  type="password"
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
                onClick={() => setShowPasswordModal(false)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-xl border transition-colors',
                  isDarkMode ? 'border-[#3E4850]/50 text-[#88929B] hover:bg-[#171F33]' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  showToast('Đã đổi mật khẩu nhân viên thành công!');
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Lưu Mật Khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
