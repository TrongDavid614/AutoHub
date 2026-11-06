import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  X,
  List,
  Calendar as CalendarIcon,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { StaffTestDriveBooking } from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const TestDriveSchedulePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');
  const [bookings, setBookings] = useState<StaffTestDriveBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [dispatchItem, setDispatchItem] = useState<StaffTestDriveBooking | null>(null);
  const [evaluationItem, setEvaluationItem] = useState<StaffTestDriveBooking | null>(null);
  const [selectedDemoPlate, setSelectedDemoPlate] = useState('51K-992.14');
  const [evalRating, setEvalRating] = useState(5);
  const [evalIntent, setEvalIntent] = useState('Rất cao (Dự kiến đặt cọc trong tuần)');

  const fetchBookings = async () => {
    try {
      const data = await staffService.getTestDriveBookings();
      setBookings(data);
    } catch (err) {
      console.error('Lỗi tải lịch hẹn lái thử từ database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.carModel.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleConfirmDispatch = async () => {
    if (!dispatchItem) return;
    try {
      await staffService.dispatchTestDrive(dispatchItem.id, selectedDemoPlate);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === dispatchItem.id
            ? { ...b, status: 'CONFIRMED' as const, assignedDemoPlate: selectedDemoPlate }
            : b
        )
      );
      setDispatchItem(null);
    } catch (err) {
      console.error('Lỗi điều phối xe lái thử:', err);
    }
  };

  const handleCompleteEvaluation = async () => {
    if (!evaluationItem) return;
    try {
      await staffService.completeTestDrive(evaluationItem.id, {
        rating: evalRating,
        intent: evalIntent,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === evaluationItem.id
            ? { ...b, status: 'COMPLETED' as const }
            : b
        )
      );
      setEvaluationItem(null);
    } catch (err) {
      console.error('Lỗi hoàn tất đánh giá lái thử:', err);
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header Toolbar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Điều Phối & Đánh Giá Ca Lái Thử Showroom (UC21)
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu trực tiếp từ SQL Server: Kiểm tra cam kết GPLX, gán biển số xe demo và ghi nhận mức độ hài lòng khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchBookings}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            Làm mới
          </button>
          <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all',
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              )}
            >
              <List className="w-3.5 h-3.5" /> Dạng Bảng
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all',
                viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Timeline
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã lịch hẹn, tên khách hoặc mẫu xe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]' : 'bg-white border-slate-200'
            )}
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40 text-xs">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer',
                statusFilter === tab ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              )}
            >
              {tab === 'ALL' && 'Tất Cả'}
              {tab === 'PENDING' && 'Chờ Duyệt'}
              {tab === 'CONFIRMED' && 'Đã Lên Lịch'}
              {tab === 'COMPLETED' && 'Đã Hoàn Tất'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bookings Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải lịch hẹn lái thử từ cơ sở dữ liệu...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không tìm thấy ca lái thử nào trong cơ sở dữ liệu.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className={cn('font-mono uppercase text-[11px] border-b', isDarkMode ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200')}>
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã Ca Lái Thử</th>
                <th className="py-3.5 px-4 font-semibold">Khách Hàng</th>
                <th className="py-3.5 px-4 font-semibold">Mẫu Xe</th>
                <th className="py-3.5 px-4 font-semibold">Thời Gian Hẹn</th>
                <th className="py-3.5 px-4 font-semibold">Xe Demo Gán</th>
                <th className="py-3.5 px-4 font-semibold">Trạng Thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#3E4850]/30">
              {filteredBookings.map((b) => (
                <tr key={b.id} className={cn('hover:bg-slate-50/50 dark:hover:bg-[#131B2E]/50 transition-colors', isDarkMode ? 'bg-[#0B1326]' : 'bg-white')}>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                    {b.bookingCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{b.customerName}</div>
                    <div className="text-[11px] text-slate-400">{b.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{b.carModel}</td>
                  <td className="py-3.5 px-4 font-mono">{b.scheduledTime}</td>
                  <td className="py-3.5 px-4 font-mono">
                    {b.assignedDemoPlate ? (
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                        {b.assignedDemoPlate}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Chưa gán xe</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded font-bold uppercase border',
                        b.status === 'PENDING' && 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200',
                        b.status === 'CONFIRMED' && 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200',
                        b.status === 'COMPLETED' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200'
                      )}
                    >
                      {b.status === 'PENDING' ? 'CHỜ DUYỆT' : b.status === 'CONFIRMED' ? 'ĐÃ LÊN LỊCH' : 'HOÀN TẤT'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => setDispatchItem(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
                          Điều Phối Xe
                        </button>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={() => setEvaluationItem(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          Đánh Giá Sau Lái
                        </button>
                      )}
                      {b.status === 'COMPLETED' && (
                        <span className="text-[11px] font-mono text-emerald-500 font-bold">Đã lưu PDI & ODO</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal điều phối xe */}
      {dispatchItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Gán Xe Lái Thử Cho {dispatchItem.bookingCode}
              </h3>
              <button type="button" onClick={() => setDispatchItem(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Chọn biển số xe Demo sẵn sàng:</label>
                <select
                  value={selectedDemoPlate}
                  onChange={(e) => setSelectedDemoPlate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                >
                  <option value="51K-992.14">51K-992.14 (GT-e Grand Touring 2026)</option>
                  <option value="51K-881.23">51K-881.23 (Hyundai SantaFe 2026)</option>
                  <option value="51K-773.09">51K-773.09 (VinFast VF9 Plus)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmDispatch}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Xác Nhận Xuất Xe Lái Thử
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal đánh giá sau lái thử */}
      {evaluationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Ghi Nhận Kết Quả Ca Lái Thử {evaluationItem.bookingCode}
              </h3>
              <button type="button" onClick={() => setEvaluationItem(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Mức độ hài lòng của khách (1 - 5 sao):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEvalRating(s)}
                      className={cn(
                        'p-2 rounded-lg border font-bold flex items-center gap-1 cursor-pointer',
                        evalRating >= s ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200'
                      )}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" /> {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Ý định chốt cọc:</label>
                <select
                  value={evalIntent}
                  onChange={(e) => setEvalIntent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                >
                  <option value="Rất cao (Dự kiến đặt cọc trong tuần)">Rất cao (Dự kiến đặt cọc trong tuần)</option>
                  <option value="Trung bình (Đang cân nhắc thêm mẫu xe đối thủ)">Trung bình (Đang cân nhắc thêm mẫu xe đối thủ)</option>
                  <option value="Thấp (Chưa hài lòng cảm giác lái)">Thấp (Chưa hài lòng cảm giác lái)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCompleteEvaluation}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Hoàn Tất & Lưu Biên Bản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
