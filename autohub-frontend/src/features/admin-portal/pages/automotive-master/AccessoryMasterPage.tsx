import React, { useState } from 'react';
import { Search, AlertTriangle, PackageCheck, Plus } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const AccessoryMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [search, setSearch] = useState('');

  const accessories = [
    {
      sku: 'ACC-FLR-082',
      name: 'Thảm Lót Sàn Ô Tô Tràn Viền 5D Kháng Nước',
      category: 'Nội Thất Ô Tô',
      price: '2.450.000 ₫',
      stock: 48,
      minThreshold: 10,
      status: 'Còn hàng',
    },
    {
      sku: 'ACC-CAM-4K',
      name: 'Camera Hành Trình 4K Trước & Sau GPS Wi-Fi',
      category: 'Đồ Điện Tử',
      price: '3.890.000 ₫',
      stock: 3,
      minThreshold: 5,
      status: 'Sắp hết hàng',
    },
    {
      sku: 'ACC-FILM-CR',
      name: 'Phim Cách Nhiệt Ceramic Chống Tia UV 99%',
      category: 'Ngoại Thất',
      price: '6.500.000 ₫',
      stock: 2,
      minThreshold: 5,
      status: 'Sắp hết hàng',
    },
    {
      sku: 'ACC-CHG-EV7',
      name: 'Bộ Sạc Treo Tường Xe Điện Di Động 7.4kW',
      category: 'Phụ Kiện Xe Điện',
      price: '8.900.000 ₫',
      stock: 15,
      minThreshold: 4,
      status: 'Còn hàng',
    },
  ];

  const lowStockCount = accessories.filter((a) => a.stock <= a.minThreshold).length;

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
            Theo dõi mã SKU, đơn giá, kiểm soát tồn an toàn và điều chuyển tồn kho giữa các chi nhánh showroom.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Phụ Kiện Mới</span>
        </button>
      </div>

      {/* Safety Alert Banner */}
      {lowStockCount > 0 && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          isDarkMode
            ? 'bg-[#2C1810] border-amber-500/50 text-amber-200'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-600 uppercase tracking-wide">Cảnh Báo Tồn Kho Khả Dụng:</div>
            <p className="mt-0.5 text-xs">
              Có <strong>{lowStockCount} sản phẩm phụ kiện</strong> đã chạm hoặc dưới ngưỡng an toàn (&lt; 5 chiếc). Vui lòng kiểm tra và lập kế hoạch nhập kho bổ sung để tránh gián đoạn đơn hàng!
            </p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên phụ kiện, SKU..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            }`}
          />
        </div>
        <div className={`text-xs font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
          Tổng mặt hàng: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{accessories.length}</strong>
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
                <th className="py-3 px-4 font-semibold text-center">Ngưỡng An Toàn</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {accessories.map((acc) => (
                <tr key={acc.sku} className={`transition-colors ${
                  isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                }`}>
                  <td className={`py-3 px-4 font-mono font-bold ${
                    isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                  }`}>
                    {acc.sku}
                  </td>
                  <td className={`py-3 px-4 font-medium flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    <PackageCheck className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`} />
                    <span>{acc.name}</span>
                  </td>
                  <td className={`py-3 px-4 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{acc.category}</td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{acc.price}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                        acc.stock <= acc.minThreshold
                          ? isDarkMode
                            ? 'bg-red-950/70 text-red-300 border-red-800/50'
                            : 'bg-red-50 text-red-700 border-red-200'
                          : isDarkMode
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {acc.stock} cái
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-center font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                    {acc.minThreshold} cái
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                        acc.stock <= acc.minThreshold
                          ? isDarkMode
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          : isDarkMode
                            ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
