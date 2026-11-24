import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Search,
  History,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { DemoFleetCar } from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const FleetMaintenancePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [fleet, setFleet] = useState<DemoFleetCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SAN_SANG' | 'DANG_CHAY_THU' | 'BAO_DUONG'>('ALL');

  const [selectedCarForMaintenance, setSelectedCarForMaintenance] = useState<DemoFleetCar | null>(null);
  const [selectedCarForOdo, setSelectedCarForOdo] = useState<DemoFleetCar | null>(null);
  const [selectedCarForHistory, setSelectedCarForHistory] = useState<DemoFleetCar | null>(null);

  // Maintenance form sheet state
  const [maintenanceReason, setMaintenanceReason] = useState('Bảo dưỡng mốc 10.000 km & Kiểm tra hệ thống phanh');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  // Odo update modal state
  const [newOdo, setNewOdo] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completingCarId, setCompletingCarId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchFleet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await staffService.getDemoFleet();
      setFleet(data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách xe demo từ database:', err);
      setError('Không thể tải danh sách xe demo từ cơ sở dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleet();
  }, [fetchFleet]);

  const filteredFleet = useMemo(() => {
    return (fleet ?? []).filter((car) => {
      const matchStatus = statusFilter === 'ALL' || car.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        car.licensePlate.toLowerCase().includes(q) ||
        car.carModel.toLowerCase().includes(q) ||
        (car.showroomName || '').toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [fleet, searchQuery, statusFilter]);

  const handleConfirmMaintenance = async () => {
    if (!selectedCarForMaintenance || isSubmitting) return;
    if (!maintenanceReason.trim()) {
      showToast('Vui lòng nhập hạng mục bảo dưỡng kỹ thuật.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await staffService.scheduleDemoMaintenance(
        selectedCarForMaintenance.id,
        maintenanceReason.trim(),
        expectedReturnDate.trim()
      );
      const plate = selectedCarForMaintenance.licensePlate;
      setSelectedCarForMaintenance(null);
      await fetchFleet();
      showToast(`Đã lập phiếu bảo dưỡng và chuyển xe ${plate} sang trạng thái BẢO DƯỠNG`);
    } catch (err) {
      console.error('Lỗi lập phiếu bảo dưỡng:', err);
      const msg = err instanceof Error ? err.message : 'Không thể lập phiếu bảo dưỡng.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteMaintenance = async (car: DemoFleetCar) => {
    if (completingCarId) return;
    setCompletingCarId(car.id);
    try {
      await staffService.completeDemoMaintenance(car.id);
      await fetchFleet();
      showToast(`Đã hoàn tất bảo dưỡng, xe ${car.licensePlate} đã sẵn sàng lái thử!`);
    } catch (err) {
      console.error('Lỗi hoàn tất bảo dưỡng:', err);
      const msg = err instanceof Error ? err.message : 'Không thể hoàn tất bảo dưỡng.';
      showToast(msg, 'error');
    } finally {
      setCompletingCarId(null);
    }
  };

  const handleUpdateOdo = async () => {
    if (!selectedCarForOdo || newOdo < 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await staffService.updateDemoOdo(selectedCarForOdo.id, newOdo);
      const plate = selectedCarForOdo.licensePlate;
      setSelectedCarForOdo(null);
      await fetchFleet();
      showToast(`Đã cập nhật chỉ số ODO mới: ${newOdo.toLocaleString()} km cho xe ${plate}`);
    } catch (err) {
      console.error('Lỗi cập nhật ODO:', err);
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật chỉ số ODO.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusLabel = (status: DemoFleetCar['status']) => {
    if (status === 'SAN_SANG') return 'SẴN SÀNG';
    if (status === 'DANG_CHAY_THU') return 'ĐANG CHẠY THỬ';
    return 'ĐANG BẢO DƯỠNG';
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-4',
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          )}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Toolbar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Quản Lý Đội Xe Lái Thử & Xe Trưng Bày Showroom (UC41)
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Theo dõi chỉ số ODO thực tế, lịch bảo dưỡng kỹ thuật và trạng thái sẵn sàng xuất xe.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchFleet}
          className={cn(
            'px-3.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
            isDarkMode
              ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          )}
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
          Làm mới
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo biển số, mẫu xe hoặc showroom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]' : 'bg-white border-slate-200'
            )}
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40 text-xs">
          {(['ALL', 'SAN_SANG', 'DANG_CHAY_THU', 'BAO_DUONG'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer',
                statusFilter === st ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              )}
            >
              {st === 'ALL' && 'Tất Cả'}
              {st === 'SAN_SANG' && 'Sẵn Sàng'}
              {st === 'DANG_CHAY_THU' && 'Đang Chạy Thử'}
              {st === 'BAO_DUONG' && 'Bảo Dưỡng'}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải danh sách đội xe Demo từ cơ sở dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={cn('p-10 text-center rounded-xl border space-y-3', isDarkMode ? 'bg-[#0B1326] border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700')}>
          <p className="text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchFleet}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Thử lại
          </button>
        </div>
      ) : filteredFleet.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          {statusFilter === 'SAN_SANG'
            ? 'Không tìm thấy xe Demo trạng thái sẵn sàng.'
            : statusFilter === 'DANG_CHAY_THU'
            ? 'Không tìm thấy xe Demo trạng thái đang chạy thử.'
            : statusFilter === 'BAO_DUONG'
            ? 'Không tìm thấy xe Demo trạng thái bảo dưỡng.'
            : 'Không tìm thấy xe Demo nào phù hợp.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFleet.map((car) => (
            <div
              key={car.id}
              className={cn(
                'p-5 rounded-xl border space-y-3 transition-all hover:shadow-md flex flex-col justify-between',
                isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
              )}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#3E4850]/30">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#89CEFF]">
                    {car.licensePlate}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border',
                      car.status === 'SAN_SANG' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200',
                      car.status === 'DANG_CHAY_THU' && 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200',
                      car.status === 'BAO_DUONG' && 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200'
                    )}
                  >
                    {renderStatusLabel(car.status)}
                  </span>
                </div>

                <h3 className={cn('text-base font-bold mt-2', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {car.carModel}
                </h3>
                {car.showroomName && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{car.showroomName}</p>
                )}

                <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/30 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ODO hiện tại:</span>
                    <strong className="font-mono text-blue-500">{(car.currentOdo || 0).toLocaleString()} km</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bảo dưỡng gần nhất:</span>
                    <span className="font-mono">{car.lastMaintenanceDate || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bảo dưỡng lần tới:</span>
                    <span className="font-mono">{car.nextMaintenanceDate || '-'}</span>
                  </div>
                  {car.maintenanceReason && (
                    <div className="pt-1 mt-1 border-t border-slate-200 dark:border-[#3E4850]/40 text-[11px] text-amber-600 dark:text-amber-400">
                      Hạng mục: {car.maintenanceReason}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3E4850]/30 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCarForHistory(car)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-[#3E4850] hover:bg-slate-50 dark:hover:bg-[#131B2E] cursor-pointer inline-flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  Lịch sử ({car.maintenanceHistory?.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCarForOdo(car);
                    setNewOdo(car.currentOdo || 0);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-[#3E4850] hover:bg-slate-50 dark:hover:bg-[#131B2E] cursor-pointer"
                >
                  Cập Nhật ODO
                </button>
                {car.status === 'BAO_DUONG' ? (
                  <button
                    type="button"
                    disabled={completingCarId === car.id}
                    onClick={() => handleCompleteMaintenance(car)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white cursor-pointer"
                  >
                    {completingCarId === car.id ? 'Đang xử lý...' : 'Hoàn Tất Bảo Dưỡng'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCarForMaintenance(car);
                      setExpectedReturnDate('');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                  >
                    Phiếu Bảo Dưỡng
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal cập nhật ODO */}
      {selectedCarForOdo && (
        <div
          onClick={() => setSelectedCarForOdo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full max-w-sm p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Cập Nhật ODO Xe {selectedCarForOdo.licensePlate}
              </h3>
              <button type="button" onClick={() => setSelectedCarForOdo(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Chỉ số ODO thực tế sau ca lái:</label>
                <input
                  type="number"
                  min={0}
                  value={newOdo}
                  onChange={(e) => setNewOdo(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleUpdateOdo}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Chỉ Số ODO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal bảo dưỡng */}
      {selectedCarForMaintenance && (
        <div
          onClick={() => setSelectedCarForMaintenance(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Lập Phiếu Bảo Dưỡng Cho {selectedCarForMaintenance.licensePlate}
              </h3>
              <button type="button" onClick={() => setSelectedCarForMaintenance(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Hạng mục bảo dưỡng kỹ thuật:</label>
                <input
                  type="text"
                  value={maintenanceReason}
                  onChange={(e) => setMaintenanceReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Ngày dự kiến hoàn tất trả xe (dd/MM/yyyy):</label>
                <input
                  type="text"
                  placeholder="VD: 30/11/2026"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmMaintenance}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Xác Nhận Xuất Xưởng Bảo Dưỡng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal lịch sử bảo dưỡng */}
      {selectedCarForHistory && (
        <div
          onClick={() => setSelectedCarForHistory(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Lịch Sử Bảo Dưỡng Xe {selectedCarForHistory.licensePlate}
              </h3>
              <button type="button" onClick={() => setSelectedCarForHistory(null)} className="p-1.5 rounded-lg border cursor-pointer border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto text-xs">
              {(selectedCarForHistory.maintenanceHistory ?? []).length === 0 ? (
                <p className="text-center text-slate-400 py-6">Chưa có lịch sử bảo dưỡng nào được ghi nhận.</p>
              ) : (
                (selectedCarForHistory.maintenanceHistory ?? []).map((rec) => (
                  <div
                    key={rec.id}
                    className={cn(
                      'p-3 rounded-xl border space-y-1',
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-500">{rec.ticketCode}</span>
                      <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-[#0B1326]">
                        {rec.status}
                      </span>
                    </div>
                    <div className="font-semibold">{rec.maintenanceItem}</div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap gap-3">
                      <span>ODO: {rec.odoAtMaintenance.toLocaleString()} km</span>
                      <span>Bắt đầu: {rec.startDate}</span>
                      <span>Dự kiến: {rec.expectedReturnDate}</span>
                      {rec.actualReturnDate && <span>Hoàn tất: {rec.actualReturnDate}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
