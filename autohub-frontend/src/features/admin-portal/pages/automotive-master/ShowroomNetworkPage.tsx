import React from 'react';
import { Building2, Phone, MapPin, Car, Users, Plus } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const ShowroomNetworkPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const showrooms = [
    {
      id: 'SR-HCM-01',
      name: 'AutoHub Sài Gòn Central',
      region: 'Miền Nam',
      address: '123 Nguyễn Hữu Thọ, Tân Hưng, Quận 7, TP.HCM',
      hotline: '028.7777.8888',
      staffCount: 12,
      demoFleet: 8,
      inventoryPhysical: 45,
    },
    {
      id: 'SR-HN-01',
      name: 'AutoHub Cầu Giấy Hà Nội',
      region: 'Miền Bắc',
      address: '68 Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội',
      hotline: '024.6666.9999',
      staffCount: 10,
      demoFleet: 6,
      inventoryPhysical: 38,
    },
    {
      id: 'SR-DN-01',
      name: 'AutoHub Đà Nẵng Riverside',
      region: 'Miền Trung',
      address: '456 Bạch Đằng, Hải Châu 1, Hải Châu, Đà Nẵng',
      hotline: '0236.3888.999',
      staffCount: 8,
      demoFleet: 5,
      inventoryPhysical: 24,
    },
  ];

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
            Mạng Lưới Showroom & Phân Bổ Tồn Kho Khu Vực
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Quản lý chi nhánh showroom toàn quốc, điều phối đội xe Demo trải nghiệm và phân bổ tồn kho xe vật lý.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Showroom Mới</span>
        </button>
      </div>

      {/* Showroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {showrooms.map((sr) => (
          <div
            key={sr.id}
            className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 hover:border-[#89CEFF]/50 shadow-lg'
                : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-bold ${
                  isDarkMode
                    ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {sr.id}
                </span>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{sr.region}</span>
              </div>
              <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sr.name}</h2>
              <div className={`space-y-1 text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-600'}`}>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{sr.address}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{sr.hotline}</span>
                </div>
              </div>
            </div>

            <div className={`pt-3 border-t grid grid-cols-3 gap-2 text-center text-xs font-mono ${
              isDarkMode ? 'border-[#3E4850]/30' : 'border-slate-100'
            }`}>
              <div className={`p-2 rounded ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-50'}`}>
                <div className={`text-[10px] flex items-center justify-center gap-1 ${
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                }`}>
                  <Users className="w-3 h-3" />
                  <span>Nhân Sự</span>
                </div>
                <div className={`font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sr.staffCount}</div>
              </div>
              <div className={`p-2 rounded ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-50'}`}>
                <div className={`text-[10px] flex items-center justify-center gap-1 ${
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                }`}>
                  <Car className="w-3 h-3 text-blue-500" />
                  <span>Xe Demo</span>
                </div>
                <div className="font-bold text-blue-600 dark:text-[#89CEFF] mt-0.5">{sr.demoFleet}</div>
              </div>
              <div className={`p-2 rounded ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-50'}`}>
                <div className={`text-[10px] flex items-center justify-center gap-1 ${
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                }`}>
                  <Building2 className="w-3 h-3 text-emerald-500" />
                  <span>Xe Kho</span>
                </div>
                <div className="font-bold text-emerald-600 dark:text-[#10B981] mt-0.5">{sr.inventoryPhysical}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
