import React, { useState } from 'react';
import { Search, Sparkles, Plus, Car, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const CarMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [search, setSearch] = useState('');

  const handleSyncVector = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  const cars = [
    {
      id: 'VF8-01',
      name: 'VinFast VF8',
      version: 'Plus AWD (402 HP)',
      segment: 'D-SUV • Thuần Điện',
      price: '1.499.000.000 ₫',
      deposit: '20.000.000 ₫',
      demoCount: '3 Xe sẵn sàng',
      vectorStatus: 'Đã Đồng Bộ Vector (18ms)',
      status: 'Đang mở bán',
    },
    {
      id: 'VF9-01',
      name: 'VinFast VF9',
      version: 'Plus 6 Chỗ Ghế Cơ Trưởng',
      segment: 'E-SUV • Thuần Điện',
      price: '2.199.000.000 ₫',
      deposit: '20.000.000 ₫',
      demoCount: '2 Xe sẵn sàng',
      vectorStatus: 'Đã Đồng Bộ Vector (18ms)',
      status: 'Đang mở bán',
    },
    {
      id: 'STF-01',
      name: 'Hyundai SantaFe',
      version: '1.6T Hybrid AWD Calligraphy',
      segment: 'D-SUV • Hybrid Xăng-Điện',
      price: '1.369.000.000 ₫',
      deposit: '10.000.000 ₫',
      demoCount: '4 Xe sẵn sàng',
      vectorStatus: 'Đã Đồng Bộ Vector (22ms)',
      status: 'Đang mở bán',
    },
    {
      id: 'CRV-01',
      name: 'Honda CR-V',
      version: 'e:HEV RS Hybrid',
      segment: 'C-SUV • Hybrid',
      price: '1.259.000.000 ₫',
      deposit: '10.000.000 ₫',
      demoCount: '2 Xe sẵn sàng',
      vectorStatus: 'Đã Đồng Bộ Vector (15ms)',
      status: 'Đang mở bán',
    },
  ];

  const filteredCars = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.version.toLowerCase().includes(search.toLowerCase()) ||
      c.segment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header & Action Toolbar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Quản Lý Danh Mục Dòng Xe & Phiên Bản Cấu Hình
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Quản trị thông số kỹ thuật xe ô tô, đội xe Demo trải nghiệm và nhúng vector vào Vector Database phục vụ Trợ lý AI Gemini API.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Vector Embeddings Sync Button */}
          <button
            type="button"
            onClick={handleSyncVector}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 cursor-pointer shadow-sm ${
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/40 hover:bg-[#1E293B]'
                : 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100'
            }`}
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-500" />
            )}
            <span>{isSyncing ? 'Đang băm nhỏ & Vector hóa...' : '⚡ Đồng Bộ Vector DB Cho AI'}</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dòng Xe Mới</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncSuccess && (
        <div className={`p-3.5 rounded-lg border text-xs flex items-center justify-between animate-fade-in ${
          isDarkMode
            ? 'bg-[#0D2818] border-emerald-500/50 text-emerald-300'
            : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>
              <strong>Đồng bộ thành công:</strong> Đã băm nhỏ 48 phiên bản cấu hình và nhúng vector vào Vector Database trong 18ms. Trợ lý AI Gemini đã đồng bộ dữ liệu mới nhất!
            </span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
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
            placeholder="Tìm theo tên xe, phiên bản, phân khúc..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            }`}
          />
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono ${
          isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
        }`}>
          <span>Tổng số: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{filteredCars.length}</strong> phiên bản</span>
        </div>
      </div>

      {/* Data Table */}
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
                <th className="py-3 px-4 font-semibold">Mã / Dòng Xe</th>
                <th className="py-3 px-4 font-semibold">Phiên Bản Cấu Hình</th>
                <th className="py-3 px-4 font-semibold">Phân Khúc</th>
                <th className="py-3 px-4 font-semibold text-right">Giá Niêm Yết</th>
                <th className="py-3 px-4 font-semibold text-right">Mức Cọc 72h</th>
                <th className="py-3 px-4 font-semibold text-center">Xe Demo</th>
                <th className="py-3 px-4 font-semibold text-center">Vector AI Status</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {filteredCars.map((car) => (
                <tr key={car.id} className={`transition-colors ${
                  isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                }`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 ${
                        isDarkMode
                          ? 'bg-[#171F33] border-[#3E4850]/50 text-[#89CEFF]'
                          : 'bg-sky-50 border-sky-200 text-sky-600'
                      }`}>
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{car.name}</div>
                        <div className={`text-[10px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{car.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{car.version}</td>
                  <td className={`py-3 px-4 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{car.segment}</td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{car.price}</td>
                  <td className={`py-3 px-4 text-right font-mono font-semibold ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>{car.deposit}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                      isDarkMode
                        ? 'bg-[#131B2E] border-[#3E4850]/60 text-[#89CEFF]'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {car.demoCount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                      isDarkMode
                        ? 'bg-[#0D2818] border-emerald-500/40 text-emerald-400'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {car.vectorStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                      isDarkMode
                        ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {car.status}
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
