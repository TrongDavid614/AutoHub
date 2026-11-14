import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  PackageCheck,
  Plus,
  RefreshCw,
  Power,
  Edit2,
  X,
  Package,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminAccessory } from '../../hooks/useAdminAccessory';
import type { AdminAccessoryItem } from '../../services/admin-accessory.service';

export const AccessoryMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const {
    accessories,
    categories,
    loading,
    error,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    lowStockOnly,
    setLowStockOnly,
    fetchData,
    toggleStatus,
    createAccessory,
    updateAccessory,
    stats,
  } = useAdminAccessory();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminAccessoryItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for creation
  const [formData, setFormData] = useState({
    tenPhuKien: '',
    danhMucId: 1,
    thuongHieu: 'AutoHub Genuine',
    giaBan: 1000000,
    soLuongTon: 10,
    quyCachLapDat: '',
    hinhAnh: '',
    dungChung: true,
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    giaBan: 0,
    soLuongTon: 0,
  });

  const handleOpenEdit = (item: AdminAccessoryItem) => {
    setEditingItem(item);
    setEditFormData({
      giaBan: item.price,
      soLuongTon: item.stock,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setActionLoading(true);
    try {
      await updateAccessory(editingItem.id, {
        giaBan: editFormData.giaBan,
        soLuongTon: editFormData.soLuongTon,
      });
      setEditingItem(null);
    } catch {
      alert('Cập nhật thất bại. Vui lòng thử lại!');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenPhuKien.trim()) {
      alert('Vui lòng nhập tên phụ kiện!');
      return;
    }
    setActionLoading(true);
    try {
      await createAccessory({
        tenPhuKien: formData.tenPhuKien,
        danhMucId: Number(formData.danhMucId),
        thuongHieu: formData.thuongHieu,
        giaBan: Number(formData.giaBan),
        soLuongTon: Number(formData.soLuongTon),
        quyCachLapDat: formData.quyCachLapDat,
        hinhAnh: formData.hinhAnh,
        dungChung: formData.dungChung,
      });
      setIsCreateOpen(false);
      setFormData({
        tenPhuKien: '',
        danhMucId: 1,
        thuongHieu: 'AutoHub Genuine',
        giaBan: 1000000,
        soLuongTon: 10,
        quyCachLapDat: '',
        hinhAnh: '',
        dungChung: true,
      });
    } catch {
      alert('Thêm mới thất bại. Vui lòng thử lại!');
    } finally {
      setActionLoading(false);
    }
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Quản Trị Master Data Phụ Kiện & Tồn Kho Khả Dụng
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Theo dõi mã SKU, đơn giá, kiểm soát tồn an toàn và điều chỉnh số lượng tồn kho phụ kiện từ cơ sở dữ liệu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            title="Làm mới dữ liệu"
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
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Phụ Kiện Mới</span>
          </button>
        </div>
      </div>

      {/* Safety Alert Banner */}
      {stats.lowStock > 0 && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          isDarkMode
            ? 'bg-[#2C1810] border-amber-500/50 text-amber-200'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-amber-600 uppercase tracking-wide">Cảnh Báo Tồn Kho Khả Dụng:</div>
            <p className="mt-0.5 text-xs">
              Có <strong>{stats.lowStock} sản phẩm phụ kiện</strong> đã chạm hoặc dưới ngưỡng an toàn (≤ 5 chiếc). Vui lòng bổ sung tồn kho để tránh hụt hàng khi khách đặt mua!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className="px-2.5 py-1 text-xs rounded font-medium bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            {lowStockOnly ? 'Hiển thị tất cả' : 'Lọc riêng sản phẩm sắp hết'}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#88929B]">
            <span>Tổng Phụ Kiện</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-slate-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sản phẩm trong danh mục</div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#88929B]">
            <span>Đang Kinh Doanh</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Hiển thị trên sàn</div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#88929B]">
            <span>Sắp Hết Hàng (≤5)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-amber-600 dark:text-amber-400">
            {stats.lowStock}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần nhập kho ngay</div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#88929B]">
            <span>Hết Hàng (0)</span>
            <Layers className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-red-600 dark:text-red-400">
            {stats.outOfStock}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tạm ngưng phục vụ</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên phụ kiện, thương hiệu..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors ${
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
              }`}
            />
          </div>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
            className={`w-full sm:w-48 px-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
            }`}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenDanhMuc}
              </option>
            ))}
          </select>
        </div>

        <div className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
          Đang hiển thị: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{accessories.length}</strong> mặt hàng
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`font-mono uppercase text-[11px] border-b ${
              isDarkMode
                ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                : 'bg-slate-50/80 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4 font-semibold">Mã SKU</th>
                <th className="py-3 px-4 font-semibold">Tên Phụ Kiện</th>
                <th className="py-3 px-4 font-semibold">Danh Mục</th>
                <th className="py-3 px-4 font-semibold text-right">Đơn Giá Niêm Yết</th>
                <th className="py-3 px-4 font-semibold text-center">Tồn Khả Dụng</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
                <th className="py-3 px-4 font-semibold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Đang tải danh sách phụ kiện từ cơ sở dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : accessories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Không tìm thấy phụ kiện nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                accessories.map((acc) => (
                  <tr key={acc.id} className={`transition-colors ${
                    isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                  }`}>
                    <td className={`py-3 px-4 font-mono font-bold ${
                      isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                    }`}>
                      {acc.sku}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {acc.imageUrl ? (
                          <img
                            src={acc.imageUrl}
                            alt={acc.name}
                            className="w-9 h-9 rounded object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <PackageCheck className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {acc.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Hãng: {acc.brand} {acc.isUniversal ? '• Dùng chung' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                      {acc.categoryName}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {formatVND(acc.price)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          acc.stock === 0
                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                            : acc.stock <= acc.minThreshold
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        }`}
                      >
                        {acc.stock} chiếc
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                          !acc.isActive
                            ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                            : acc.stock <= acc.minThreshold
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(acc)}
                          title="Điều chỉnh tồn kho & giá"
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isDarkMode
                              ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                              : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(acc.id)}
                          title={acc.isActive ? 'Tạm ẩn sản phẩm' : 'Kích hoạt lại'}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            acc.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm Phụ Kiện Mới */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-xl border p-6 transition-colors shadow-2xl ${
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <h3 className="text-base font-bold">Thêm Mới Phụ Kiện Vào Master Data</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Tên Phụ Kiện *</label>
                <input
                  type="text"
                  required
                  value={formData.tenPhuKien}
                  onChange={(e) => setFormData({ ...formData, tenPhuKien: e.target.value })}
                  placeholder="Ví dụ: Thảm Lót Sàn Ô Tô Tràn Viền 5D"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Danh Mục *</label>
                  <select
                    value={formData.danhMucId}
                    onChange={(e) => setFormData({ ...formData, danhMucId: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.tenDanhMuc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Thương Hiệu</label>
                  <input
                    type="text"
                    value={formData.thuongHieu}
                    onChange={(e) => setFormData({ ...formData, thuongHieu: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Đơn Giá Niêm Yết (VNĐ) *</label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    required
                    value={formData.giaBan}
                    onChange={(e) => setFormData({ ...formData, giaBan: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Số Lượng Tồn Ban Đầu *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.soLuongTon}
                    onChange={(e) => setFormData({ ...formData, soLuongTon: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">URL Hình Ảnh (Link CDN)</label>
                <input
                  type="text"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Quy Cách Lắp Đặt / Bảo Hành</label>
                <input
                  type="text"
                  value={formData.quyCachLapDat}
                  onChange={(e) => setFormData({ ...formData, quyCachLapDat: e.target.value })}
                  placeholder="Ví dụ: Lắp đặt tận nơi miễn phí 30 phút, bảo hành 2 năm"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="dungChung"
                  checked={formData.dungChung}
                  onChange={(e) => setFormData({ ...formData, dungChung: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <label htmlFor="dungChung" className="font-medium cursor-pointer">
                  Phụ kiện phổ thông dùng chung cho mọi dòng xe
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                >
                  {actionLoading ? 'Đang lưu...' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Điều Chỉnh Tồn Kho & Giá Bán */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-xl border p-6 transition-colors shadow-2xl ${
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <div>
                <h3 className="text-base font-bold">Cập Nhật Kho & Đơn Giá</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{editingItem.sku} - {editingItem.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Giá Bán Niêm Yết (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  required
                  value={editFormData.giaBan}
                  onChange={(e) => setEditFormData({ ...editFormData, giaBan: Number(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Số Lượng Tồn Kho Thực Tế</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editFormData.soLuongTon}
                  onChange={(e) => setEditFormData({ ...editFormData, soLuongTon: Number(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nếu tồn kho ≤ 5 cái, hệ thống sẽ tự động bật cảnh báo thiếu hàng trên bảng điều khiển.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                >
                  {actionLoading ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
