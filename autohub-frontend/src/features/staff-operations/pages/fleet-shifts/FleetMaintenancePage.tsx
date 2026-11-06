import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { DemoFleetCar } from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const FleetMaintenancePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [fleet, setFleet] = useState<DemoFleetCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCarForMaintenance, setSelectedCarForMaintenance] = useState<DemoFleetCar | null>(null);
  const [selectedCarForOdo, setSelectedCarForOdo] = useState<DemoFleetCar | null>(null);

  // Maintenance form sheet state
  const [maintenanceReason, setMaintenanceReason] = useState('Bảo dưỡng mốc 10.000 km & Kiểm tra hệ thống phanh');
  const [expectedReturnDate, setExpectedReturnDate] = useState('31/12/2026');

  // Odo update modal state
  const [newOdo, setNewOdo] = useState<number>(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const fetchFleet = async () => {
    try {
      const data = await staffService.getDemoFleet();
      setFleet(data);
    } catch (err) {
      console.error('Lỗi tải danh sách xe demo từ database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleConfirmMaintenance = async () => {
    if (!selectedCarForMaintenance) return;
    const cleanId = selectedCarForMaintenance.id.replace(/\D/g, '') || '1';
    try {
      await staffService.scheduleDemoMaintenance(cleanId, maintenanceReason, expectedReturnDate);
      setFleet((prev) =>
        prev.map((c) =>
          c.id === selectedCarForMaintenance.id
            ? { ...c, status: 'BAO_DUONG' as const }
            : c
        )
      );
      showToast(`Đã chuyển xe ${selectedCarForMaintenance.licensePlate} sang trạng thái BẢO DƯỠNG`);
      setSelectedCarForMaintenance(null);
    } catch (err) {
      console.error('Lỗi lập phiếu bảo dưỡng:', err);
    }
  };

  const handleUpdateOdo = async () => {
    if (!selectedCarForOdo || newOdo <= 0) return;
    const cleanId = selectedCarForOdo.id.replace(/\D/g, '') || '1';
    try {
      await staffService.updateDemoOdo(cleanId, newOdo);
      setFleet((prev) =>
        prev.map((c) =>
          c.id === selectedCarForOdo.id
            ? { ...c, currentOdo: newOdo }
            : c
        )
      );
      showToast(`Đã cập nhật chỉ số ODO mới: ${newOdo.toLocaleString()} km cho xe ${selectedCarForOdo.licensePlate}`);
      setSelectedCarForOdo(null);
    } catch (err) {
      console.error('Lỗi cập nhật ODO:', err);
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
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
            Dữ liệu trực tiếp từ SQL Server: Theo dõi chỉ số ODO thực tế, hạn bảo dưỡng kỹ thuật và trạng thái sẵn sàng xuất xe.
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

      {/* Fleet Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải danh sách đội xe Demo từ cơ sở dữ liệu...</p>
        </div>
      ) : fleet.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không tìm thấy xe Demo nào trong cơ sở dữ liệu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fleet.map((car) => (
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
                      car.status === 'BAO_DUONG' && 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200'
                    )}
                  >
                    {car.status === 'SAN_SANG' ? 'SẴN SÀNG' : 'ĐANG BẢO DƯỠNG'}
                  </span>
                </div>

                <h3 className={cn('text-base font-bold mt-2', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {car.carModel}
                </h3>

                <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/30 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ODO hiện tại:</span>
                    <strong className="font-mono text-blue-500">{(car.currentOdo || 0).toLocaleString()} km</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bảo dưỡng lần tới:</span>
                    <span className="font-mono">{car.nextMaintenanceDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3E4850]/30 flex items-center justify-end gap-2">
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
                <button
                  type="button"
                  onClick={() => setSelectedCarForMaintenance(car)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                >
                  Phiếu Bảo Dưỡng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal cập nhật ODO */}
      {selectedCarForOdo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-sm p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
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
                  value={newOdo}
                  onChange={(e) => setNewOdo(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleUpdateOdo}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Lưu Chỉ Số ODO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal bảo dưỡng */}
      {selectedCarForMaintenance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
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
                <label className="block text-slate-400 font-bold mb-1">Ngày dự kiến hoàn tất trả xe:</label>
                <input
                  type="text"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#3E4850]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmMaintenance}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                >
                  Xác Nhận Xuất Xưởng Bảo Dưỡng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
