import React from 'react';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const RefundApprovalPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const dockets = [
    {
      id: '#REF-9021',
      depositId: '#DEP-8841',
      customer: 'Trần Văn Cường (CCCD: 001202008819)',
      car: 'VinFast VF8 Plus AWD',
      amount: '20.000.000 ₫',
      reason: 'Ngân hàng từ chối cấp tín dụng gói vay 70%',
      deadlineStatus: 'Trong hạn 72h (Còn 18h hiệu lực)',
      staffVerifier: 'STF-004 (Nguyễn Văn Tuấn)',
      status: 'VERIFIED',
    },
    {
      id: '#REF-9018',
      depositId: '#DEP-8832',
      customer: 'Lê Thị Mai (CCCD: 079195004321)',
      car: 'Hyundai SantaFe Calligraphy',
      amount: '10.000.000 ₫',
      reason: 'Khách hàng thay đổi kế hoạch tài chính cá nhân',
      deadlineStatus: 'Trong hạn 72h (Còn 32h hiệu lực)',
      staffVerifier: 'STF-002 (Lê Quốc Bảo)',
      status: 'VERIFIED',
    },
    {
      id: '#REF-9005',
      depositId: '#DEP-8790',
      customer: 'Phạm Đức Anh (CCCD: 031088001122)',
      car: 'Honda CR-V e:HEV RS',
      amount: '10.000.000 ₫',
      reason: 'Không đủ điều kiện (Quá hạn 72h giữ chỗ)',
      deadlineStatus: 'Hết hạn hiệu lực',
      staffVerifier: 'STF-001 (Trần Thu Hà)',
      status: 'REJECTED',
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
            Phê Duyệt Giải Ngân Hồ Sơ Hoàn Tiền Cọc Xe 72 Giờ
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Thẩm tra hồ sơ rút cọc đã được nhân viên Showroom xác minh và kích hoạt lệnh hoàn tiền tự động qua cổng thanh toán SePay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
            isDarkMode
              ? 'bg-red-950/70 border-red-800/40 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>2 Hồ sơ chờ Admin giải ngân</span>
          </span>
        </div>
      </div>

      {/* Checklist 3 Điều Kiện Giải Ngân */}
      <div className={`p-4 rounded-xl border space-y-2 text-xs ${
        isDarkMode
          ? 'bg-[#0F172A] border-[#38BDF8]/40'
          : 'bg-sky-50 border-sky-200 shadow-xs'
      }`}>
        <div className={`font-bold uppercase font-mono tracking-wider ${
          isDarkMode ? 'text-[#89CEFF]' : 'text-blue-700'
        }`}>
          Checklist 3 Điều Kiện Bắt Buộc Trước Khi Phê Duyệt Giải Ngân (Căn Cứ Hợp Đồng):
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 ${
          isDarkMode ? 'text-[#BAE6FD]' : 'text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</span>
            <span>(1) Gửi đơn trong thời hạn 72h kể từ lúc cọc</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</span>
            <span>(2) Có văn bản từ chối hợp lệ từ ngân hàng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</span>
            <span>(3) Xe chưa xuất hóa đơn giá trị gia tăng (VAT)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <table className="w-full text-left text-xs">
          <thead className={`font-mono uppercase text-[11px] border-b ${
            isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
              : 'bg-slate-50/80 text-slate-500 border-slate-200'
          }`}>
            <tr>
              <th className="py-3 px-4">Mã Hồ Sơ / Phiếu Cọc</th>
              <th className="py-3 px-4">Khách Hàng & CCCD</th>
              <th className="py-3 px-4">Dòng Xe</th>
              <th className="py-3 px-4 text-right">Số Tiền Hoàn Cọc</th>
              <th className="py-3 px-4">Thời Hạn Hiệu Lực</th>
              <th className="py-3 px-4">Staff Thẩm Định</th>
              <th className="py-3 px-4 text-center">Thao Tác Admin</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {dockets.map((d) => (
              <tr key={d.id} className={`transition-colors ${
                isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
              }`}>
                <td className="py-3 px-4">
                  <div className={`font-mono font-bold ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>{d.id}</div>
                  <div className={`font-mono text-[10px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{d.depositId}</div>
                </td>
                <td className={`py-3 px-4 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.customer}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}`}>{d.car}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-red-600">{d.amount}</td>
                <td className={`py-3 px-4 text-[11px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{d.deadlineStatus}</td>
                <td className={`py-3 px-4 text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{d.staffVerifier}</td>
                <td className="py-3 px-4 text-center">
                  {d.status === 'VERIFIED' ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Giải Ngân</span>
                      </button>
                      <button
                        type="button"
                        className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${
                          isDarkMode
                            ? 'bg-red-950/70 hover:bg-red-900/70 text-red-300 border-red-800/40'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Bác Bỏ</span>
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      isDarkMode
                        ? 'bg-red-950/70 text-red-300 border-red-800/40'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      Đã từ chối
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
