import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  AlertTriangle,
  Plus,
  RefreshCw,
  Inbox,
  Package,
  Edit2,
  Check,
  X,
  Power,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  adminAccessoryService,
  type AdminAccessory,
  type AccessoryCategory,
  type CreateAccessoryPayload,
} from '../../services/admin-accessory.service';

export const AccessoryMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [accessories, setAccessories] = useState<AdminAccessory[]>([]);
  const [categories, setCategories] = useState<AccessoryCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingAccessory, setEditingAccessory] = useState<AdminAccessory | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state for creating
  const [createForm, setCreateForm] = useState<CreateAccessoryPayload>({
    name: '',
    categoryId: 0,
    brand: 'AutoHub Genuine',
    price: 0,
    stock: 0,
    installationSpec: '',
    universal: true,
  });

  // Edit stock/price form state
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accList, catList] = await Promise.all([
        adminAccessoryService.getAccessories(),
        adminAccessoryService.getCategories(),
      ]);
      setAccessories(accList);
      setCategories(catList);
      if (catList.length > 0 && createForm.categoryId === 0) {
        setCreateForm((prev) => ({ ...prev, categoryId: catList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load accessories:', err);
      setError('Không thể kết nối đến máy chủ để tải danh mục phụ kiện. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  }, [createForm.categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || createForm.price <= 0 || createForm.categoryId === 0) {
      alert('Vui lòng điền đầy đủ Tên phụ kiện, Danh mục và Giá bán hợp lệ!');
      return;
    }

    setSubmitting(true);
    try {
      const created = await adminAccessoryService.createAccessory(createForm);
      setAccessories((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        categoryId: categories.length > 0 ? categories[0].id : 0,
        brand: 'AutoHub Genuine',
        price: 0,
        stock: 0,
        installationSpec: '',
        universal: true,
      });
      showNotification(`Đã thêm phụ kiện "${created.name}" thành công!`);
    } catch (err) {
      console.error('Create accessory failed:', err);
      alert('Thao tác thêm phụ kiện mới thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item: AdminAccessory) => {
    setEditingAccessory(item);
    setEditPrice(item.price);
    setEditStock(item.stock);
  };

  const handleUpdateStockAndPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccessory) return;

    if (editPrice <= 0 || editStock < 0) {
      alert('Đơn giá phải lớn hơn 0 và tồn kho không được âm!');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await adminAccessoryService.updateAccessory(editingAccessory.id, {
        price: editPrice,
        stock: editStock,
      });
      setAccessories((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setEditingAccessory(null);
      showNotification(`Đã cập nhật giá bán và tồn kho cho ${updated.name}!`);
    } catch (err) {
      console.error('Update accessory failed:', err);
      alert('Cập nhật thất bại. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: AdminAccessory) => {
    try {
      const updated = await adminAccessoryService.toggleStatus(item.id, !item.active);
      setAccessories((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showNotification(`Đã ${updated.active ? 'kích hoạt' : 'tạm dừng'} kinh doanh ${item.name}!`);
    } catch (err) {
      console.error('Toggle status failed:', err);
      alert('Không thể cập nhật trạng thái phụ kiện!');
    }
  };

  const filteredAccessories = (accessories ?? []).filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sku.toLowerCase().includes(search.toLowerCase()) ||
      a.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || a.categoryId === selectedCategory;
    return matchSearch && matchCat;
  });

  const lowStockCount = (accessories ?? []).filter((a) => a.stock <= a.minThreshold).length;

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
            <Package className="w-6 h-6 text-blue-500" />
            Quản Trị Master Data Phụ Kiện & Tồn Kho Khả Dụng
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Theo dõi mã SKU, cập nhật giá bán, kiểm soát tồn an toàn và trạng thái kinh doanh trên giỏ hàng khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
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
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Phụ Kiện Mới</span>
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

      {/* Safety Alert Banner */}
      {!loading && lowStockCount > 0 && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          isDarkMode
            ? 'bg-[#2C1810] border-amber-500/50 text-amber-200'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-600 uppercase tracking-wide">Cảnh Báo Tồn Kho Khả Dụng:</div>
            <p className="mt-0.5 text-xs">
              Có <strong>{lowStockCount} sản phẩm phụ kiện</strong> đã chạm hoặc dưới ngưỡng an toàn (&le; 5 chiếc). Vui lòng cập nhật số lượng tồn kho để khách hàng có thể tiếp tục đặt đơn!
            </p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã SKU hoặc thương hiệu..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-md text-xs border outline-none transition-colors ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-blue-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Danh mục:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className={`px-3 py-1.5 rounded-md text-xs border outline-none cursor-pointer ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">Tất Cả Danh Mục ({(accessories ?? []).length})</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.tenDanhMuc}</option>
            ))}
          </select>
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50">
              <div className="space-y-2 w-1/4">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
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
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400">Không thể tải dữ liệu phụ kiện</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : (filteredAccessories ?? []).length === 0 ? (
        <div className={`p-12 rounded-xl border text-center space-y-3 ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Không có phụ kiện nào phù hợp
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Không tìm thấy sản phẩm phụ kiện nào với từ khóa hoặc bộ lọc đã chọn. Hãy thử tìm kiếm từ khóa khác hoặc nhấn "Thêm Phụ Kiện Mới".
          </p>
        </div>
      ) : (
        /* Table */
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
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-4">Tên Phụ Kiện & Hãng</th>
                  <th className="py-3 px-4">Danh Mục</th>
                  <th className="py-3 px-4 text-right">Đơn Giá Bán</th>
                  <th className="py-3 px-4 text-center">Tồn Kho</th>
                  <th className="py-3 px-4 text-center">Trạng Thái Tồn</th>
                  <th className="py-3 px-4 text-center">Kinh Doanh</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-sans ${
                isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
              }`}>
                {(filteredAccessories ?? []).map((a) => (
                  <tr
                    key={a.id}
                    className={`transition-colors ${
                      isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-500">{a.sku}</td>
                    <td className="py-3 px-4">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{a.name}</div>
                      <div className={`text-[10px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
                        Thương hiệu: {a.brand} {a.universal ? '• Dùng chung' : ''}
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>
                      {a.categoryName}
                    </td>
                    <td className={`py-3 px-4 font-mono text-right font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {Number(a.price).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`font-bold ${a.stock <= a.minThreshold ? 'text-amber-500' : ''}`}>
                        {a.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold inline-block ${
                        a.stock === 0
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : a.stock <= a.minThreshold
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      }`}>
                        {a.stockStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(a)}
                        title={a.active ? 'Nhấn để tạm dừng' : 'Nhấn để kích hoạt'}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                          a.active
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{a.active ? 'Hoạt động' : 'Tạm dừng'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(a)}
                        className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                          isDarkMode
                            ? 'bg-[#171F33] hover:bg-[#1E293B] text-[#89CEFF] border-[#3E4850]/50'
                            : 'bg-slate-50 hover:bg-slate-100 text-blue-600 border-slate-300'
                        }`}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Sửa giá/kho</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Thêm Phụ Kiện Mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-xl border p-6 shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#0B1326] text-white border-[#3E4850]/50' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                Thêm Phụ Kiện Mới Vào Hệ Thống
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
                <label className="block font-semibold mb-1">Tên phụ kiện (*)</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Ví dụ: Thảm lót sàn da 5D tràn viền..."
                  className={`w-full p-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Danh mục (*)</label>
                  <select
                    value={createForm.categoryId}
                    onChange={(e) => setCreateForm({ ...createForm, categoryId: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    {(categories ?? []).map((c) => (
                      <option key={c.id} value={c.id}>{c.tenDanhMuc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Thương hiệu</label>
                  <input
                    type="text"
                    value={createForm.brand}
                    onChange={(e) => setCreateForm({ ...createForm, brand: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Đơn giá bán (VNĐ) (*)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={createForm.price}
                    onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Số lượng tồn kho ban đầu (*)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={createForm.stock}
                    onChange={(e) => setCreateForm({ ...createForm, stock: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quy cách lắp đặt</label>
                <input
                  type="text"
                  value={createForm.installationSpec || ''}
                  onChange={(e) => setCreateForm({ ...createForm, installationSpec: e.target.value })}
                  placeholder="Ví dụ: Kỹ thuật viên hỗ trợ lắp đặt tại showroom..."
                  className={`w-full p-2.5 rounded-lg border outline-none ${
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
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu phụ kiện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Sửa Giá Bán & Tồn Kho */}
      {editingAccessory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-xl border p-6 shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#0B1326] text-white border-[#3E4850]/50' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-500" />
                Cập Nhật Giá & Tồn Kho ({editingAccessory.sku})
              </h3>
              <button
                type="button"
                onClick={() => setEditingAccessory(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 text-xs">
              <div className="font-bold">{editingAccessory.name}</div>
              <div className="text-slate-400">Danh mục: {editingAccessory.categoryName}</div>
            </div>

            <form onSubmit={handleUpdateStockAndPrice} className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block font-semibold mb-1">Đơn giá bán mới (VNĐ)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Số lượng tồn kho khả dụng mới</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-lg border outline-none font-mono ${
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAccessory(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
