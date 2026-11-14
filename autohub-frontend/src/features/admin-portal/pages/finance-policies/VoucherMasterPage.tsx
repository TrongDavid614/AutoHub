import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Ticket,
  AlertCircle,
  Inbox,
  Check,
  X,
  Power,
  Trash2,
  Search,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  adminVoucherService,
  type AdminVoucher,
  type CreateVoucherPayload,
} from '../../services/admin-voucher.service';

export const VoucherMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'EXPIRED'>('ALL');

  // Modal create
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<CreateVoucherPayload>({
    code: '',
    discountPercent: 10,
    maxDiscountAmount: 500000,
    expiryDate: '',
    active: true,
  });

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminVoucherService.getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
      setError('Không thể kết nối đến máy chủ để tải danh sách mã voucher. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.code.trim()) {
      alert('Vui lòng nhập mã voucher!');
      return;
    }

    setSubmitting(true);
    try {
      const created = await adminVoucherService.createVoucher({
        ...createForm,
        code: createForm.code.trim().toUpperCase(),
        expiryDate: createForm.expiryDate || undefined,
      });
      setVouchers((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        code: '',
        discountPercent: 10,
        maxDiscountAmount: 500000,
        expiryDate: '',
        active: true,
      });
      showNotification(`Đã tạo thành công voucher "${created.code}"!`);
    } catch (err) {
      console.error('Create voucher failed:', err);
      alert('Tạo mã voucher thất bại. Có thể mã này đã tồn tại trong hệ thống!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: AdminVoucher) => {
    try {
      const updated = await adminVoucherService.toggleStatus(item.id, !item.active);
      setVouchers((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      showNotification(`Đã ${updated.active ? 'kích hoạt' : 'tạm dừng'} mã voucher ${item.code}!`);
    } catch (err) {
      console.error('Toggle voucher status failed:', err);
      alert('Không thể cập nhật trạng thái voucher!');
    }
  };

  const handleDelete = async (item: AdminVoucher) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mã voucher "${item.code}" không?`)) {
      return;
    }

    try {
      await adminVoucherService.deleteVoucher(item.id);
      setVouchers((prev) => prev.filter((v) => v.id !== item.id));
      showNotification(`Đã xóa voucher ${item.code} thành công!`);
    } catch (err) {
      console.error('Delete voucher failed:', err);
      alert('Xóa voucher thất bại. Vui lòng thử lại!');
    }
  };

  const filteredVouchers = (vouchers ?? []).filter((v) => {
    const matchSearch = (v.code ?? '').toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return v.active && !v.expired;
    if (statusFilter === 'PAUSED') return !v.active;
    if (statusFilter === 'EXPIRED') return v.expired;
    return true;
  });

  const activeCount = (vouchers ?? []).filter((v) => v.active && !v.expired).length;
  const expiredCount = (vouchers ?? []).filter((v) => v.expired).length;
  const pausedCount = (vouchers ?? []).filter((v) => !v.active).length;

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Ticket className="w-6 h-6 text-purple-500" />
            Chương Trình Khuyến Mại & Quản Lý Mã Giảm Giá (Vouchers)
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Cấu hình mã giảm giá, mức giảm tối đa, thời hạn hiệu lực và trạng thái kích hoạt áp dụng tại giỏ hàng khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchVouchers}
            disabled={loading}
            title="Làm mới danh sách"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B] hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Mã Voucher Mới</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Real Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Tổng Số Chiến Dịch</div>
          <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {(vouchers ?? []).length} Mã
          </div>
          <div className={`text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
            Đã đồng bộ từ Database sản xuất
          </div>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Voucher Đang Kích Hoạt</div>
          <div className="text-2xl font-bold font-mono text-emerald-500">
            {activeCount} Chiến Dịch
          </div>
          <div className={`text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
            Khách hàng có thể nhập mã giảm giá khi thanh toán
          </div>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Đã Hết Hạn / Tạm Dừng</div>
          <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            {expiredCount + pausedCount} Mã
          </div>
          <div className={`text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
            {expiredCount} hết hạn • {pausedCount} tạm dừng
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
        isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã voucher (VD: AUTOHUB, ACC)..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-md text-xs border outline-none uppercase font-mono transition-colors ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-purple-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-600'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-md font-semibold border transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : isDarkMode
                ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40 hover:text-white'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Tất cả ({(vouchers ?? []).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-md font-semibold border transition-colors cursor-pointer ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : isDarkMode
                ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40 hover:text-white'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Đang chạy ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PAUSED')}
            className={`px-3 py-1.5 rounded-md font-semibold border transition-colors cursor-pointer ${
              statusFilter === 'PAUSED'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : isDarkMode
                ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40 hover:text-white'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Tạm dừng ({pausedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-md font-semibold border transition-colors cursor-pointer ${
              statusFilter === 'EXPIRED'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : isDarkMode
                ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40 hover:text-white'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Đã hết hạn ({expiredCount})
          </button>
        </div>
      </div>

      {/* 3 Trạng thái cốt lõi: Loading / Error / Empty */}
      {loading ? (
        <div className={`p-8 rounded-xl border space-y-4 ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={`p-8 rounded-xl border text-center space-y-4 ${
          isDarkMode ? 'bg-[#0B1326] border-red-900/40' : 'bg-white border-red-200'
        }`}>
          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400">Không thể tải dữ liệu voucher</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchVouchers}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : (filteredVouchers ?? []).length === 0 ? (
        <div className={`p-12 rounded-xl border text-center space-y-3 ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Không có mã voucher nào phù hợp
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Không tìm thấy chương trình ưu đãi nào với bộ lọc hiện tại. Nhấn "Tạo Mã Voucher Mới" để bắt đầu chiến dịch khuyến mãi mới!
          </p>
        </div>
      ) : (
        /* Vouchers Table */
        <div className={`rounded-xl border overflow-hidden transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`font-mono uppercase text-[11px] border-b ${
                isDarkMode ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40' : 'bg-slate-50/80 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3 px-4">Mã Voucher</th>
                  <th className="py-3 px-4">Mức Giảm</th>
                  <th className="py-3 px-4 text-right">Giảm Tối Đa</th>
                  <th className="py-3 px-4 font-mono">Hạn Sử Dụng</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Kích Hoạt</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-sans ${isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'}`}>
                {(filteredVouchers ?? []).map((v) => (
                  <tr
                    key={v.id}
                    className={`transition-colors ${isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-sm text-purple-600 dark:text-purple-400">
                      {v.code}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {v.discountPercent ? `Giảm ${v.discountPercent}%` : 'Giảm trực tiếp'}
                    </td>
                    <td className={`py-3 px-4 font-mono font-bold text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {v.maxDiscountAmount ? `${Number(v.maxDiscountAmount).toLocaleString('vi-VN')} ₫` : 'Không giới hạn'}
                    </td>
                    <td className={`py-3 px-4 font-mono text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
                      {v.expiryDate || 'Vô thời hạn'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold inline-block ${
                        v.statusText === 'Đang chạy'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : v.statusText === 'Tạm dừng'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                      }`}>
                        {v.statusText}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(v)}
                        title={v.active ? 'Nhấn để tạm dừng' : 'Nhấn để kích hoạt'}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                          v.active
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{v.active ? 'Bật' : 'Tắt'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(v)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                          isDarkMode
                            ? 'bg-red-950/20 hover:bg-red-950/40 text-red-400 border-red-800/40'
                            : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                        }`}
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tạo Mã Voucher Mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-xl border p-6 shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#0B1326] text-white border-[#3E4850]/50' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-500" />
                Tạo Mã Giảm Giá (Voucher) Mới
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Mã Voucher (In hoa, không dấu) (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: AUTOHUB2026, ACC500K..."
                  value={createForm.code}
                  onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                  className={`w-full p-2.5 rounded-lg border outline-none font-mono uppercase ${
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phần trăm giảm (%) (*)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={createForm.discountPercent || ''}
                    onChange={(e) => setCreateForm({ ...createForm, discountPercent: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={createForm.maxDiscountAmount || ''}
                    onChange={(e) => setCreateForm({ ...createForm, maxDiscountAmount: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ngày hết hạn</label>
                <input
                  type="date"
                  value={createForm.expiryDate || ''}
                  onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Tạo Voucher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
