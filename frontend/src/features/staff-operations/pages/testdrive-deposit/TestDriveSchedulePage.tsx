import React, { useState } from 'react';
import {
  Search,
  Star,
  MapPin,
  ShieldCheck,
  X,
  List,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  MOCK_STAFF_TEST_DRIVES,
  MOCK_DEMO_FLEET,
  type StaffTestDriveBooking,
} from '@/features/staff-operations/mocks/staff.mock';
import { cn } from '@/lib/utils';

export const TestDriveSchedulePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');
  const [bookings, setBookings] = useState<StaffTestDriveBooking[]>(MOCK_STAFF_TEST_DRIVES);

  // Modals state
  const [dispatchItem, setDispatchItem] = useState<StaffTestDriveBooking | null>(null);
  const [evaluationItem, setEvaluationItem] = useState<StaffTestDriveBooking | null>(null);
  const [selectedDemoPlate, setSelectedDemoPlate] = useState('51K-992.14');
  const [evalRating, setEvalRating] = useState(5);
  const [evalIntent, setEvalIntent] = useState('Rất cao (Dự kiến đặt cọc trong tuần)');

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.carModel.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleConfirmDispatch = () => {
    if (!dispatchItem) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === dispatchItem.id
          ? { ...b, status: 'CONFIRMED' as const, assignedDemoCar: selectedDemoPlate }
          : b
      )
    );
    setDispatchItem(null);
  };

  const handleCompleteEvaluation = () => {
    if (!evaluationItem) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === evaluationItem.id
          ? {
              ...b,
              status: 'COMPLETED' as const,
              satisfactionRating: evalRating,
              customerPurchaseIntent: evalIntent,
            }
          : b
      )
    );
    setEvaluationItem(null);
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
            Điều Phối Xe Demo & Quản Lý Lịch Hẹn Lái Thử Xe
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Xác minh cam kết Giấy phép lái xe (GPLX), phân bổ xe Demo khả dụng và ghi nhận biên bản đánh giá trải nghiệm thực tế.
          </p>
        </div>

        {/* View mode toggle switch */}
        <div
          className={cn(
            'flex p-1 rounded-lg border w-fit gap-1',
            isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50' : 'bg-slate-100 border-slate-200'
          )}
        >
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              viewMode === 'table'
                ? isDarkMode
                  ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                  : 'bg-white text-blue-600 shadow-2xs'
                : isDarkMode
                ? 'text-[#88929B] hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span>Chế độ Bảng</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5',
              viewMode === 'timeline'
                ? isDarkMode
                  ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                  : 'bg-white text-blue-600 shadow-2xs'
                : isDarkMode
                ? 'text-[#88929B] hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Chế độ Lịch Biểu</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div
        className={cn(
          'p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
            : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                statusFilter === status
                  ? isDarkMode
                    ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
                  : isDarkMode
                  ? 'text-[#88929B] hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {status === 'ALL'
                ? 'Tất Cả Lịch Hẹn'
                : status === 'PENDING'
                ? 'Chờ Phê Duyệt'
                : status === 'CONFIRMED'
                ? 'Đã Gán Xe'
                : 'Đã Hoàn Tất'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className={cn(
              'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2',
              isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
            )}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo khách, mã hẹn, dòng xe..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
            )}
          />
        </div>
      </div>

      {/* 3. Table or Timeline View */}
      {viewMode === 'table' ? (
        <div
          className={cn(
            'rounded-xl border overflow-hidden transition-colors',
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
              : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={cn(
                  'font-mono uppercase text-[11px] border-b',
                  isDarkMode ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200'
                )}
              >
                <tr>
                  <th className="py-3 px-4">Mã Hẹn</th>
                  <th className="py-3 px-4">Khách Hàng & SĐT</th>
                  <th className="py-3 px-4">Mẫu Xe Yêu Cầu</th>
                  <th className="py-3 px-4">Thời Gian Hẹn</th>
                  <th className="py-3 px-4">Địa Điểm</th>
                  <th className="py-3 px-4 text-center">Cam Kết GPLX</th>
                  <th className="py-3 px-4 text-center">Xe Demo Gán</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className={cn('divide-y font-sans', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50'
                    )}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                      {b.bookingCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {b.customerName}
                      </div>
                      <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        {b.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-800')}>
                        {b.carModel}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">{b.preferredTime}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span>{b.locationType === 'SHOWROOM' ? 'Tại Showroom' : 'Tận Nhà Khách'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>GPLX Hợp Lệ</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {b.assignedDemoCar ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 font-bold">
                          {b.assignedDemoCar}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                          Chưa gán xe
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {b.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => setDispatchItem(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
                        >
                          Gán Xe Demo
                        </button>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={() => setEvaluationItem(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm"
                        >
                          Ghi Biên Bản
                        </button>
                      )}
                      {b.status === 'COMPLETED' && (
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ Đã Hoàn Tất
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div
          className={cn(
            'p-5 rounded-xl border space-y-4 transition-colors',
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
              : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
            <span className="text-xs font-mono font-bold text-blue-500 uppercase">
              Bàn Cờ Phân Làn 3 Xe Demo Tại Showroom (08:00 - 18:00)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_DEMO_FLEET.filter((c) => c.status === 'SAN_SANG').map((car) => (
              <div
                key={car.id}
                className={cn(
                  'p-4 rounded-xl border space-y-3',
                  isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-[#89CEFF] px-2 py-0.5 rounded bg-blue-50 dark:bg-[#171F33] border border-blue-200 dark:border-[#3E4850]/60">
                    {car.licensePlate}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">SẴN SÀNG</span>
                </div>
                <div>
                  <div className={cn('font-bold text-sm', isDarkMode ? 'text-white' : 'text-slate-900')}>{car.carModel}</div>
                  <div className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>{car.variant} • {car.color}</div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-[#3E4850]/40 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>09:30 - 11:00:</span>
                    <span className="text-emerald-500 font-bold">Khách: Trần Hoàng Nam</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>14:30 - 16:00:</span>
                    <span className="text-blue-500 font-bold">Khách: Đặng Quốc Huy</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Gán xe Demo (<DispatchModal>) */}
      {dispatchItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={cn(
              'w-full max-w-lg rounded-xl border p-6 space-y-5 shadow-2xl transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850] text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-500 uppercase font-bold">Điều Phối Xe Demo Lái Thử</span>
                <h3 className={cn('text-sm font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Phê Duyệt Lịch Hẹn {dispatchItem.bookingCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDispatchItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className={cn('p-3 rounded-lg border', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
                <div>Khách hàng: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{dispatchItem.customerName}</strong> ({dispatchItem.customerPhone})</div>
                <div>Mẫu xe đăng ký: <strong className="text-blue-500">{dispatchItem.carModel}</strong></div>
                <div>Khung giờ: <strong className="font-mono">{dispatchItem.preferredTime}</strong></div>
              </div>

              <div className="space-y-2">
                <label className={cn('block font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Chọn xe Demo khả dụng tại Showroom:
                </label>
                <div className="space-y-2">
                  {MOCK_DEMO_FLEET.filter((c) => c.status === 'SAN_SANG').map((car) => (
                    <label
                      key={car.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
                        selectedDemoPlate === car.licensePlate
                          ? isDarkMode
                            ? 'bg-[#171F33] border-blue-500 text-white'
                            : 'bg-blue-50 border-blue-400 text-blue-900'
                          : isDarkMode
                          ? 'bg-[#131B2E] border-[#3E4850]/40'
                          : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="demoCar"
                          checked={selectedDemoPlate === car.licensePlate}
                          onChange={() => setSelectedDemoPlate(car.licensePlate)}
                        />
                        <div>
                          <div className="font-bold">{car.carModel} • {car.variant}</div>
                          <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                            Biển số: {car.licensePlate} • Odo: {car.currentOdoKm.toLocaleString()} km
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold">SAN_SANG</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#3E4850]/40">
              <button
                type="button"
                onClick={() => setDispatchItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-slate-300 dark:border-[#3E4850]/60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Xác Nhận & Gửi Email Khách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Ghi nhận biên bản đánh giá (<EvaluationModal>) */}
      {evaluationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={cn(
              'w-full max-w-lg rounded-xl border p-6 space-y-5 shadow-2xl transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850] text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Biên Bản Kết Thúc Lái Thử</span>
                <h3 className={cn('text-sm font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Ghi Nhận Đánh Giá Khách Hàng ({evaluationItem.customerName})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEvaluationItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Mức độ hài lòng của khách (1 - 5 sao):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEvalRating(star)}
                      className={cn(
                        'p-2 rounded-lg border flex items-center gap-1 font-bold cursor-pointer',
                        evalRating >= star
                          ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                          : 'bg-slate-100 dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]/40 text-slate-400'
                      )}
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Ý định mua xe / Đặt cọc giữ chỗ:</label>
                <select
                  value={evalIntent}
                  onChange={(e) => setEvalIntent(e.target.value)}
                  className={cn(
                    'w-full p-2 text-xs rounded-lg border outline-none',
                    isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                >
                  <option value="Rất cao (Dự kiến đặt cọc trong tuần)">Rất cao (Dự kiến đặt cọc trong tuần)</option>
                  <option value="Trung bình (Cần bàn thêm với gia đình)">Trung bình (Cần bàn thêm với gia đình)</option>
                  <option value="Thấp (Chưa ưng ý cảm giác lái)">Thấp (Chưa ưng ý cảm giác lái)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#3E4850]/40">
              <button
                type="button"
                onClick={() => setEvaluationItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-slate-300 dark:border-[#3E4850]/60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCompleteEvaluation}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Hoàn Tất & Trả Xe Demo Về Kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
