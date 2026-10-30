import React, { useState, useMemo } from 'react';
import {
  Car,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  Gauge,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_DEMO_FLEET, type DemoFleetCar } from '@/features/staff-operations/mocks/staff.mock';
import { cn } from '@/lib/utils';

export const FleetMaintenancePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [fleet, setFleet] = useState<DemoFleetCar[]>(MOCK_DEMO_FLEET);
  const [selectedCarForMaintenance, setSelectedCarForMaintenance] = useState<DemoFleetCar | null>(null);
  const [selectedCarForOdo, setSelectedCarForOdo] = useState<DemoFleetCar | null>(null);

  // Maintenance form sheet state
  const [maintenanceReason, setMaintenanceReason] = useState('Bảo dưỡng mốc 10.000 km & Kiểm tra hệ thống phanh');
  const [expectedReturnDate, setExpectedReturnDate] = useState('31/10/2026');
  const [technicalNotes, setTechnicalNotes] = useState('Gửi xe sang Xưởng Dịch Vụ AutoHub Quận 7 - KTV phụ trách: Lê Minh Tâm');

  // Odo update modal state
  const [newOdo, setNewOdo] = useState<number>(0);

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const stats = useMemo(() => {
    return {
      SAN_SANG: fleet.filter((c) => c.status === 'SAN_SANG').length,
      DANG_CHAY_THU: fleet.filter((c) => c.status === 'DANG_CHAY_THU').length,
      BAO_DUONG: fleet.filter((c) => c.status === 'BAO_DUONG').length,
    };
  }, [fleet]);

  const handleConfirmMaintenance = () => {
    if (!selectedCarForMaintenance) return;

    setFleet((prev) =>
      prev.map((c) =>
        c.id === selectedCarForMaintenance.id
          ? {
              ...c,
              status: 'BAO_DUONG',
              maintenanceReason,
              expectedReturnDate,
            }
          : c
      )
    );

    const plate = selectedCarForMaintenance.licensePlate;
    setSelectedCarForMaintenance(null);
    showToast(`Đã chuyển xe ${plate} sang trạng thái BẢO DƯỠNG (Chặn xếp lịch lái thử mới)!`);
  };

  const handleCompleteMaintenance = (carId: string) => {
    const car = fleet.find((c) => c.id === carId);
    if (!car) return;

    setFleet((prev) =>
      prev.map((c) =>
        c.id === carId
          ? {
              ...c,
              status: 'SAN_SANG',
              maintenanceReason: undefined,
              expectedReturnDate: undefined,
              lastServiceDate: new Date().toLocaleDateString('vi-VN'),
              nextServiceKm: c.currentOdoKm + 10000,
            }
          : c
      )
    );
    showToast(`Xe ${car.licensePlate} đã hoàn tất bảo dưỡng và sẵn sàng đón khách lái thử!`);
  };

  const handleUpdateOdo = () => {
    if (!selectedCarForOdo || newOdo <= 0) return;

    setFleet((prev) =>
      prev.map((c) =>
        c.id === selectedCarForOdo.id
          ? {
              ...c,
              currentOdoKm: newOdo,
            }
          : c
      )
    );

    const plate = selectedCarForOdo.licensePlate;
    setSelectedCarForOdo(null);
    showToast(`Đã cập nhật số ODO xe ${plate} lên ${newOdo.toLocaleString('vi-VN')} km!`);
  };

  return (
    <div className={cn('space-y-6 transition-colors duration-300', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800')}>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors shadow-sm',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Quản Lý Kỹ Thuật & Bảo Dưỡng Đội Xe Demo
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Theo dõi chỉ số ODO, lịch sử bảo dưỡng định kỳ và quản lý trạng thái an toàn phương tiện lái thử
          </p>
        </div>

        <button
          onClick={() => {
            const readyCar = fleet.find((c) => c.status === 'SAN_SANG');
            if (readyCar) setSelectedCarForMaintenance(readyCar);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-500 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Khai Báo Xe Đi Xưởng Dịch Vụ</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ready */}
        <div
          className={cn(
            'p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div>
            <div className={cn('text-xs font-semibold uppercase tracking-wider', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Xe Demo Sẵn Sàng Đón Khách
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-500 mt-1">
              {stats.SAN_SANG} Xe
            </div>
            <div className={cn('text-xs mt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Đủ điều kiện an toàn & sạch sẽ
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div
          className={cn(
            'p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div>
            <div className={cn('text-xs font-semibold uppercase tracking-wider', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Xe Đang Chạy Thử
            </div>
            <div className="text-2xl font-mono font-bold text-blue-500 mt-1">
              {stats.DANG_CHAY_THU} Xe
            </div>
            <div className={cn('text-xs mt-1', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Đang cùng khách trên lộ trình
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Under Maintenance */}
        <div
          className={cn(
            'p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
          )}
        >
          <div>
            <div className={cn('text-xs font-semibold uppercase tracking-wider', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Xe Đang Bảo Dưỡng / Sửa Chữa
            </div>
            <div className="text-2xl font-mono font-bold text-amber-500 mt-1">
              {stats.BAO_DUONG} Xe
            </div>
            <div className="text-xs text-amber-500 mt-1 font-medium">
              Chặn đặt lịch lái thử mới
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Wrench className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Datagrid */}
      <div
        className={cn(
          'rounded-2xl border overflow-hidden shadow-sm transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className={cn(
                'text-xs uppercase tracking-wider border-b font-semibold transition-colors',
                isDarkMode
                  ? 'bg-[#131B2E] text-[#BEC8D2] border-[#3E4850]/40'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-3.5 px-4">Biển Số Xe</th>
                <th className="py-3.5 px-4">Dòng Xe & Phiên Bản</th>
                <th className="py-3.5 px-4">Màu Sơn & Nội Thất</th>
                <th className="py-3.5 px-4">Số Km (ODO)</th>
                <th className="py-3.5 px-4">Bảo Dưỡng Tiếp Theo</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                'divide-y transition-colors',
                isDarkMode ? 'divide-[#3E4850]/20' : 'divide-slate-200'
              )}
            >
              {fleet.map((car) => {
                const isNearService = car.nextServiceKm - car.currentOdoKm <= 500;

                return (
                  <tr
                    key={car.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#171F33]' : 'hover:bg-slate-50'
                    )}
                  >
                    {/* License Plate */}
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-lg font-mono font-bold text-xs border tracking-wider',
                          isDarkMode
                            ? 'bg-[#171F33] text-white border-[#3E4850]/70'
                            : 'bg-slate-900 text-white border-slate-800'
                        )}
                      >
                        {car.licensePlate}
                      </span>
                    </td>

                    {/* Model */}
                    <td className="py-4 px-4">
                      <div className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {car.carModel}
                      </div>
                      <div className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        {car.variant}
                      </div>
                    </td>

                    {/* Color */}
                    <td className={cn('py-4 px-4 text-xs', isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700')}>
                      {car.color}
                    </td>

                    {/* Current Odo */}
                    <td className="py-4 px-4">
                      <div className={cn('flex items-center gap-1.5 font-mono font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        <Gauge className="w-3.5 h-3.5 text-slate-400" />
                        <span>{car.currentOdoKm.toLocaleString('vi-VN')} km</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCarForOdo(car);
                          setNewOdo(car.currentOdoKm);
                        }}
                        className="text-[11px] text-blue-600 dark:text-[#89CEFF] hover:underline mt-0.5 block"
                      >
                        Cập nhật ODO
                      </button>
                    </td>

                    {/* Next Service */}
                    <td className="py-4 px-4">
                      <div className={cn('font-mono text-xs', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                        {car.nextServiceKm.toLocaleString('vi-VN')} km
                      </div>
                      {isNearService && car.status !== 'BAO_DUONG' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 mt-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          Sắp tới hạn (&lt; 500km)
                        </span>
                      )}
                      <div className={cn('text-[11px] mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                        Lần cuối: {car.lastServiceDate}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {car.status === 'SAN_SANG' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
                            isDarkMode
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          )}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          SẴN SÀNG
                        </span>
                      )}
                      {car.status === 'DANG_CHAY_THU' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
                            isDarkMode
                              ? 'bg-blue-950/40 text-blue-400 border-blue-500/30'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          )}
                        >
                          <Car className="w-3 h-3" />
                          ĐANG CHẠY THỬ
                        </span>
                      )}
                      {car.status === 'BAO_DUONG' && (
                        <div>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
                              isDarkMode
                                ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            )}
                          >
                            <Wrench className="w-3 h-3" />
                            BẢO DƯỠNG
                          </span>
                          {car.expectedReturnDate && (
                            <div className="text-[11px] text-amber-500 font-mono mt-1">
                              Dự kiến: {car.expectedReturnDate}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      {car.status === 'BAO_DUONG' ? (
                        <button
                          onClick={() => handleCompleteMaintenance(car.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Hoàn tất bảo dưỡng</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCarForMaintenance(car);
                            setMaintenanceReason(
                              isNearService
                                ? `Bảo dưỡng định kỳ mốc ${car.nextServiceKm.toLocaleString('vi-VN')} km`
                                : 'Kiểm tra kỹ thuật & Vệ sinh khoang lái chuyên sâu'
                            );
                          }}
                          disabled={car.status === 'DANG_CHAY_THU'}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors border',
                            isDarkMode
                              ? 'bg-[#171F33] text-[#DAE2FD] border-[#3E4850]/60 hover:bg-[#222A3D] disabled:opacity-40'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 disabled:opacity-40'
                          )}
                        >
                          <Wrench className="w-3.5 h-3.5 text-amber-500" />
                          <span>Khai báo xưởng</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER: Maintenance Declaration Sheet (<MaintenanceFormSheet>) */}
      {selectedCarForMaintenance && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'w-full max-w-[540px] h-full shadow-2xl flex flex-col border-l overflow-hidden transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            {/* Header */}
            <div
              className={cn(
                'p-5 border-b flex items-center justify-between transition-colors',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg">Khai Báo Xe Demo Đi Xưởng Dịch Vụ</h3>
              </div>
              <button
                onClick={() => setSelectedCarForMaintenance(null)}
                className={cn('p-1.5 rounded-lg transition-colors', isDarkMode ? 'hover:bg-[#171F33] text-[#88929B]' : 'hover:bg-slate-200 text-slate-500')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
              <div
                className={cn(
                  'p-4 rounded-xl border transition-colors',
                  isDarkMode ? 'bg-[#171F33] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-sm px-2.5 py-1 bg-slate-900 text-white rounded">
                    {selectedCarForMaintenance.licensePlate}
                  </span>
                  <span className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                    ODO: <strong>{selectedCarForMaintenance.currentOdoKm.toLocaleString('vi-VN')} km</strong>
                  </span>
                </div>
                <div className={cn('mt-2 font-bold text-base', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {selectedCarForMaintenance.carModel} - {selectedCarForMaintenance.variant}
                </div>
                <div className={cn('text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  {selectedCarForMaintenance.color}
                </div>
              </div>

              {/* Maintenance Reason */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Hạng mục sửa chữa / bảo dưỡng:
                </label>
                <select
                  value={maintenanceReason}
                  onChange={(e) => setMaintenanceReason(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-amber-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500/40'
                  )}
                >
                  <option value="Bảo dưỡng định kỳ mốc 10.000 km">Bảo dưỡng định kỳ mốc 10.000 km</option>
                  <option value="Thay thế lốp xe & Cân bằng động bánh xe">Thay thế lốp xe & Cân bằng động bánh xe</option>
                  <option value="Kiểm tra hệ thống phanh, má phanh và thước lái">Kiểm tra hệ thống phanh, má phanh và thước lái</option>
                  <option value="Xử lý trầy xước sơn ngoại thất & Đánh bóng">Xử lý trầy xước sơn ngoại thất & Đánh bóng</option>
                  <option value="Vệ sinh khoang lái & Khử mùi chuyên sâu">Vệ sinh khoang lái & Khử mùi chuyên sâu</option>
                </select>
              </div>

              {/* Expected return date */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Ngày dự kiến bàn giao xe trở lại showroom:
                </label>
                <div className="relative">
                  <Calendar className={cn('w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')} />
                  <input
                    type="text"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    placeholder="DD/MM/YYYY (ví dụ: 31/10/2026)"
                    className={cn(
                      'w-full pl-10 pr-4 py-2 text-sm font-mono rounded-xl border focus:outline-none transition-colors',
                      isDarkMode
                        ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-amber-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500/40'
                    )}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={cn('block text-xs font-semibold mb-1.5', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Ghi chú xưởng dịch vụ / Kỹ thuật viên tiếp nhận:
                </label>
                <textarea
                  rows={3}
                  value={technicalNotes}
                  onChange={(e) => setTechnicalNotes(e.target.value)}
                  placeholder="Ghi rõ tên xưởng, kỹ thuật viên tiếp nhận và các yêu cầu kỹ thuật phát sinh..."
                  className={cn(
                    'w-full px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-white placeholder:text-[#88929B] focus:border-amber-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/40'
                  )}
                />
              </div>

              <div
                className={cn(
                  'p-3.5 rounded-xl border text-xs flex items-start gap-2',
                  isDarkMode
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                )}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                <span>
                  <strong>Cảnh báo an toàn hệ thống:</strong> Sau khi xác nhận đưa xe vào bảo dưỡng, hệ thống sẽ tự động chuyển xe sang trạng thái <strong>BAO_DUONG</strong> và khóa không cho phép xếp bất kỳ lịch lái thử nào cho xe này cho đến khi bấm "Hoàn tất bảo dưỡng".
                </span>
              </div>
            </div>

            {/* Actions */}
            <div
              className={cn(
                'p-4 border-t flex items-center justify-end gap-3 transition-colors',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
              )}
            >
              <button
                onClick={() => setSelectedCarForMaintenance(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-xl border transition-colors',
                  isDarkMode
                    ? 'border-[#3E4850]/60 text-[#DAE2FD] hover:bg-[#171F33]'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                )}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmMaintenance}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-500 shadow-md transition-colors"
              >
                <Wrench className="w-4 h-4" />
                <span>Xác Nhận Đưa Xe Đi Xưởng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Update ODO */}
      {selectedCarForOdo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={cn(
              'rounded-2xl max-w-sm w-full p-6 shadow-2xl border transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-900'
            )}
          >
            <h3 className="font-bold text-base mb-1">Cập Nhật Số ODO Đồng Hồ</h3>
            <p className={cn('text-xs mb-4', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Xe {selectedCarForOdo.licensePlate} ({selectedCarForOdo.carModel})
            </p>

            <div className="space-y-3">
              <div>
                <label className={cn('block text-xs font-semibold mb-1', isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-700')}>
                  Số km hiện tại trên đồng hồ xe:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newOdo}
                    onChange={(e) => setNewOdo(parseInt(e.target.value) || 0)}
                    className={cn(
                      'w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border focus:outline-none transition-colors',
                      isDarkMode
                        ? 'bg-[#171F33] border-[#3E4850]/50 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500/40'
                    )}
                  />
                  <span className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>km</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setSelectedCarForOdo(null)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  isDarkMode ? 'border-[#3E4850]/50 text-[#88929B] hover:bg-[#171F33]' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateOdo}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
