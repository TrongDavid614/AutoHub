import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Car,
  Users,
  MapPin,
  Phone,
  Clock,
  Plus,
  RotateCw,
  Gauge,
  Box,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { adminCarService } from '../services/admin-car.service';
import type {
  AdminShowroomDetail,
  CreateDemoCarPayload,
} from '@/types/showroom.types';
import type { AdminCarMasterItem } from '@/types/car.types';

interface ShowroomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: AdminShowroomDetail | null;
  isLoading: boolean;
  onAddDemoCar: (showroomId: number, payload: CreateDemoCarPayload) => Promise<void>;
  onUpdateDemoCarStatus: (
    showroomId: number,
    demoCarId: number,
    status: string,
    odo?: number
  ) => Promise<void>;
  isSubmitting: boolean;
}

export const ShowroomDetailModal: React.FC<ShowroomDetailModalProps> = ({
  isOpen,
  onClose,
  detail,
  isLoading,
  onAddDemoCar,
  onUpdateDemoCarStatus,
  isSubmitting,
}) => {
  const { isDarkMode } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'demoFleet' | 'inventory' | 'staff'>('overview');

  // Sub-form for adding demo car
  const [isAddingDemoCar, setIsAddingDemoCar] = useState(false);
  const [carVersions, setCarVersions] = useState<Array<{ id: number; fullName: string }>>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<number | ''>('');
  const [licensePlate, setLicensePlate] = useState('');
  const [currentOdo, setCurrentOdo] = useState<number>(100);
  const [demoStatus, setDemoStatus] = useState('SAN_SANG');
  const [demoError, setDemoError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setIsAddingDemoCar(false);
      setDemoError(null);
      // Fetch cars for demo car assignment
      adminCarService
        .getCarMasterList()
        .then((cars: AdminCarMasterItem[]) => {
          const list: Array<{ id: number; fullName: string }> = cars.map((c) => ({
            id: c.variantId,
            fullName: `${c.name} - ${c.version}`,
          }));
          setCarVersions(list);
          if (list.length > 0) {
            setSelectedVersionId(list[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveDemoCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError(null);

    if (!selectedVersionId) {
      setDemoError('Vui lòng chọn phiên bản xe');
      return;
    }
    if (!licensePlate.trim()) {
      setDemoError('Vui lòng nhập biển số xe (VD: 30A-999.88, 51K-12345)');
      return;
    }

    if (!detail) return;

    await onAddDemoCar(detail.showroom.id, {
      carVersionId: Number(selectedVersionId),
      licensePlate: licensePlate.trim().toUpperCase(),
      currentOdo: currentOdo || 0,
      status: demoStatus,
    });

    setIsAddingDemoCar(false);
    setLicensePlate('');
  };

  const sr = detail?.showroom;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4 border-b flex-shrink-0',
            isDarkMode ? 'border-[#3E4850]/30 bg-[#131B2E]' : 'border-slate-100 bg-slate-50'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-[#89CEFF]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded border font-bold',
                    isDarkMode
                      ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  )}
                >
                  {sr?.code || 'SR-00'}
                </span>
                <span
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-medium',
                    sr?.active
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                  )}
                >
                  {sr?.active ? 'Đang hoạt động' : 'Tạm ngừng'}
                </span>
                <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                  {sr?.region}
                </span>
              </div>
              <h2 className="text-base font-bold mt-0.5">{sr?.name || 'Đang tải thông tin showroom...'}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors cursor-pointer',
              isDarkMode ? 'hover:bg-slate-800 text-[#88929B]' : 'hover:bg-slate-100 text-slate-400'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className={cn(
            'flex items-center px-6 border-b text-xs font-semibold gap-1 flex-shrink-0',
            isDarkMode ? 'border-[#3E4850]/30 bg-[#0B1326]' : 'border-slate-100 bg-white'
          )}
        >
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-3.5 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:border-[#89CEFF] dark:text-[#89CEFF]'
                : isDarkMode
                ? 'border-transparent text-[#88929B] hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Tổng Quan Chi Nhánh</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('demoFleet')}
            className={cn(
              'px-3.5 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'demoFleet'
                ? 'border-blue-600 text-blue-600 dark:border-[#89CEFF] dark:text-[#89CEFF]'
                : isDarkMode
                ? 'border-transparent text-[#88929B] hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Đội Xe Demo Lái Thử</span>
            <span
              className={cn(
                'ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-blue-100 text-blue-700'
              )}
            >
              {detail?.demoCars.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={cn(
              'px-3.5 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'inventory'
                ? 'border-blue-600 text-blue-600 dark:border-[#89CEFF] dark:text-[#89CEFF]'
                : isDarkMode
                ? 'border-transparent text-[#88929B] hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Tồn Kho Xe Vật Lý</span>
            <span
              className={cn(
                'ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                isDarkMode ? 'bg-[#171F33] text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              )}
            >
              {sr?.inventoryPhysical || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={cn(
              'px-3.5 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'staff'
                ? 'border-blue-600 text-blue-600 dark:border-[#89CEFF] dark:text-[#89CEFF]'
                : isDarkMode
                ? 'border-transparent text-[#88929B] hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Nhân Sự Phụ Trách</span>
            <span
              className={cn(
                'ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                isDarkMode ? 'bg-[#171F33] text-slate-300' : 'bg-slate-100 text-slate-700'
              )}
            >
              {detail?.staffMembers.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-xs">
              <RotateCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>
                Đang tải dữ liệu chi tiết showroom...
              </span>
            </div>
          ) : !detail ? (
            <div className="py-12 text-center text-xs text-rose-500">
              Không thể tải dữ liệu chi tiết của showroom này.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div
                      className={cn(
                        'p-4 rounded-xl border flex flex-col',
                        isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <span className={cn('text-xs flex items-center gap-1.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Nhân sự vận hành</span>
                      </span>
                      <span className="text-xl font-bold font-mono mt-1">{sr?.staffCount}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Nhân viên trực thuộc</span>
                    </div>

                    <div
                      className={cn(
                        'p-4 rounded-xl border flex flex-col',
                        isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <span className={cn('text-xs flex items-center gap-1.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        <Car className="w-4 h-4 text-sky-500" />
                        <span>Đội xe Demo</span>
                      </span>
                      <div className="flex items-baseline gap-1 mt-1 font-mono">
                        <span className="text-xl font-bold text-sky-500">{sr?.demoFleetReady}</span>
                        <span className="text-xs text-slate-400">/ {sr?.demoFleet} xe</span>
                      </div>
                      <span className="text-[11px] text-emerald-500 mt-0.5">Sẵn sàng lái thử</span>
                    </div>

                    <div
                      className={cn(
                        'p-4 rounded-xl border flex flex-col',
                        isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <span className={cn('text-xs flex items-center gap-1.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        <Box className="w-4 h-4 text-emerald-500" />
                        <span>Tồn kho vật lý</span>
                      </span>
                      <span className="text-xl font-bold font-mono text-emerald-600 dark:text-[#10B981] mt-1">
                        {sr?.inventoryPhysical} xe
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {sr?.inventoryReserved || 0} xe đang giữ cọc
                      </span>
                    </div>

                    <div
                      className={cn(
                        'p-4 rounded-xl border flex flex-col',
                        isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <span className={cn('text-xs flex items-center gap-1.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Giờ hoạt động</span>
                      </span>
                      <span className="text-sm font-bold font-mono mt-1.5">
                        {sr?.openTime ? sr.openTime.substring(0, 5) : '08:00'} -{' '}
                        {sr?.closeTime ? sr.closeTime.substring(0, 5) : '19:00'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Mở cửa tất cả các ngày</span>
                    </div>
                  </div>

                  {/* Showroom Details Grid */}
                  <div
                    className={cn(
                      'p-5 rounded-xl border space-y-4',
                      isDarkMode ? 'bg-[#131B2E]/60 border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
                    )}
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Thông Tin Địa Điểm & Vận Hành
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Địa chỉ chi nhánh</span>
                        <div className="flex items-start gap-1.5 font-medium mt-0.5">
                          <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{sr?.address}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Hotline tiếp nhận</span>
                        <div className="flex items-center gap-1.5 font-mono font-medium mt-0.5">
                          <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{sr?.hotline}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Tỉnh / Thành phố</span>
                        <p className="font-medium mt-0.5">
                          {sr?.provinceName} ({sr?.region})
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Mã định danh hệ thống</span>
                        <p className="font-mono font-bold mt-0.5 text-blue-500">{sr?.code}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DEMO FLEET */}
              {activeTab === 'demoFleet' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Đội Xe Lái Thử Trải Nghiệm (Test Drive Fleet)
                      </h3>
                      <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        Quản lý đội xe demo phục vụ khách hàng trải nghiệm thực tế tại chi nhánh
                      </p>
                    </div>

                    {!isAddingDemoCar && (
                      <button
                        type="button"
                        onClick={() => setIsAddingDemoCar(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Gán Xe Demo Mới</span>
                      </button>
                    )}
                  </div>

                  {/* Add Demo Car Subform */}
                  {isAddingDemoCar && (
                    <form
                      onSubmit={handleSaveDemoCar}
                      className={cn(
                        'p-4 rounded-xl border space-y-4 animate-fade-in',
                        isDarkMode ? 'bg-[#171F33] border-blue-500/40' : 'bg-blue-50/50 border-blue-200'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-500 flex items-center gap-1.5">
                          <Car className="w-4 h-4" />
                          <span>Gán Xe Demo Trải Nghiệm Mới</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingDemoCar(false)}
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          Hủy
                        </button>
                      </div>

                      {demoError && (
                        <div className="p-2.5 rounded bg-rose-500/10 text-rose-500 text-xs border border-rose-500/30">
                          {demoError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-semibold">Dòng xe & Phiên bản</label>
                          <select
                            value={selectedVersionId}
                            onChange={(e) => setSelectedVersionId(Number(e.target.value))}
                            className={cn(
                              'w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            )}
                          >
                            {carVersions.map((cv) => (
                              <option key={cv.id} value={cv.id} className={isDarkMode ? 'bg-[#0B1326]' : 'bg-white'}>
                                {cv.fullName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold">Biển số xe</label>
                          <input
                            type="text"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            placeholder="VD: 30A-999.88"
                            className={cn(
                              'w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none font-mono uppercase',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold">Odo hiện tại (km)</label>
                          <input
                            type="number"
                            min="0"
                            value={currentOdo}
                            onChange={(e) => setCurrentOdo(Number(e.target.value))}
                            className={cn(
                              'w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none font-mono',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            )}
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-semibold">Trạng thái ban đầu</label>
                          <select
                            value={demoStatus}
                            onChange={(e) => setDemoStatus(e.target.value)}
                            className={cn(
                              'w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none',
                              isDarkMode
                                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            )}
                          >
                            <option value="SAN_SANG">Sẵn Sàng Lái Thử</option>
                            <option value="DANG_LAI_THU">Đang Lái Thử Khách</option>
                            <option value="BAO_DUONG">Đang Bảo Dưỡng / Sửa</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingDemoCar(false)}
                          className="px-3 py-1.5 text-xs rounded-lg hover:bg-slate-700/50 text-slate-400"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          {isSubmitting ? 'Đang gán...' : 'Xác Nhận Gán Xe'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Table of Demo Cars */}
                  {detail.demoCars.length === 0 ? (
                    <div
                      className={cn(
                        'py-10 text-center text-xs rounded-xl border',
                        isDarkMode ? 'border-[#3E4850]/30 text-[#88929B]' : 'border-slate-200 text-slate-500'
                      )}
                    >
                      Showroom hiện chưa có xe demo nào được gán. Hãy bấm "Gán Xe Demo Mới" để điều phối đội xe lái thử.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40">
                      <table className="w-full text-left text-xs">
                        <thead
                          className={cn(
                            'text-[11px] uppercase font-bold border-b tracking-wider',
                            isDarkMode
                              ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B]'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          )}
                        >
                          <tr>
                            <th className="py-2.5 px-4">Biển Số</th>
                            <th className="py-2.5 px-4">Dòng Xe & Phiên Bản</th>
                            <th className="py-2.5 px-4">Odo (km)</th>
                            <th className="py-2.5 px-4">Trạng Thái Lái Thử</th>
                            <th className="py-2.5 px-4">Bảo Dưỡng Tiếp Theo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#3E4850]/30 font-medium">
                          {detail.demoCars.map((dc) => (
                            <tr
                              key={dc.id}
                              className={cn(
                                'transition-colors',
                                isDarkMode ? 'hover:bg-[#131B2E]/50' : 'hover:bg-slate-50'
                              )}
                            >
                              <td className="py-3 px-4 font-mono font-bold text-blue-500">{dc.licensePlate}</td>
                              <td className="py-3 px-4">
                                <span className="font-semibold">{dc.carModelName}</span>
                                <span className="text-slate-400 ml-1.5 text-[11px]">{dc.carVersionName}</span>
                              </td>
                              <td className="py-3 px-4 font-mono flex items-center gap-1">
                                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                                <span>{dc.currentOdo?.toLocaleString('vi-VN')}</span>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={dc.status}
                                  onChange={(e) =>
                                    onUpdateDemoCarStatus(
                                      detail.showroom.id,
                                      dc.id,
                                      e.target.value,
                                      dc.currentOdo
                                    )
                                  }
                                  className={cn(
                                    'px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer',
                                    dc.status === 'SAN_SANG'
                                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                      : dc.status === 'DANG_LAI_THU'
                                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                      : 'bg-rose-500/10 text-rose-500 border-rose-500/30',
                                    isDarkMode ? 'dark:bg-[#0B1326]' : 'bg-white'
                                  )}
                                >
                                  <option value="SAN_SANG">Sẵn Sàng Lái Thử</option>
                                  <option value="DANG_LAI_THU">Đang Lái Thử Khách</option>
                                  <option value="BAO_DUONG">Đang Bảo Dưỡng / Sửa</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                                {dc.nextMaintenanceDate || 'Chưa định lịch'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INVENTORY */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tồn Kho Xe Vật Lý Theo Phiên Bản & Màu Sắc
                    </h3>
                    <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      Báo cáo số lượng xe thực tế đang nằm tại bãi đỗ và khu vực giao xe của showroom
                    </p>
                  </div>

                  {detail.inventoryItems.length === 0 ? (
                    <div
                      className={cn(
                        'py-10 text-center text-xs rounded-xl border',
                        isDarkMode ? 'border-[#3E4850]/30 text-[#88929B]' : 'border-slate-200 text-slate-500'
                      )}
                    >
                      Hiện chưa có dữ liệu tồn kho xe vật lý tại showroom này.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40">
                      <table className="w-full text-left text-xs">
                        <thead
                          className={cn(
                            'text-[11px] uppercase font-bold border-b tracking-wider',
                            isDarkMode
                              ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B]'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          )}
                        >
                          <tr>
                            <th className="py-2.5 px-4">Dòng Xe & Phiên Bản</th>
                            <th className="py-2.5 px-4">Màu Ngoại Thất</th>
                            <th className="py-2.5 px-4 text-center">Khả Dụng Giao Ngay</th>
                            <th className="py-2.5 px-4 text-center">Đang Giữ Cọc (72h)</th>
                            <th className="py-2.5 px-4 text-right">Tổng Xe Tại Kho</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#3E4850]/30 font-medium">
                          {detail.inventoryItems.map((item) => (
                            <tr
                              key={item.id}
                              className={cn(
                                'transition-colors',
                                isDarkMode ? 'hover:bg-[#131B2E]/50' : 'hover:bg-slate-50'
                              )}
                            >
                              <td className="py-3 px-4">
                                <span className="font-semibold">{item.carModelName}</span>
                                <span className="text-slate-400 ml-1.5 text-[11px]">{item.carVersionName}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                                    style={{ backgroundColor: item.colorHex || '#334155' }}
                                  />
                                  <span>{item.colorName}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-emerald-500">
                                {item.availableStock}
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-amber-500">
                                {item.reservedStock}
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-white">
                                {item.totalStock}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: STAFF */}
              {activeTab === 'staff' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Nhân Sự Vận Hành Thuộc Showroom
                    </h3>
                    <p className={cn('text-xs mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      Danh sách chuyên viên tư vấn bán hàng, nhân viên kỹ thuật và điều phối viên showroom
                    </p>
                  </div>

                  {detail.staffMembers.length === 0 ? (
                    <div
                      className={cn(
                        'py-10 text-center text-xs rounded-xl border',
                        isDarkMode ? 'border-[#3E4850]/30 text-[#88929B]' : 'border-slate-200 text-slate-500'
                      )}
                    >
                      Chưa có nhân viên nào được gán trực thuộc showroom này.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40">
                      <table className="w-full text-left text-xs">
                        <thead
                          className={cn(
                            'text-[11px] uppercase font-bold border-b tracking-wider',
                            isDarkMode
                              ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B]'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          )}
                        >
                          <tr>
                            <th className="py-2.5 px-4">Họ Và Tên</th>
                            <th className="py-2.5 px-4">Email</th>
                            <th className="py-2.5 px-4">Số Điện Thoại</th>
                            <th className="py-2.5 px-4">Vai Trò</th>
                            <th className="py-2.5 px-4 text-right">Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#3E4850]/30 font-medium">
                          {detail.staffMembers.map((st) => (
                            <tr
                              key={st.id}
                              className={cn(
                                'transition-colors',
                                isDarkMode ? 'hover:bg-[#131B2E]/50' : 'hover:bg-slate-50'
                              )}
                            >
                              <td className="py-3 px-4 font-semibold">{st.fullName}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">{st.email}</td>
                              <td className="py-3 px-4 font-mono">{st.phone}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                  {st.role}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span
                                  className={cn(
                                    'px-2 py-0.5 rounded-full text-[11px] font-medium',
                                    st.status === 'HOAT_DONG'
                                      ? 'bg-emerald-500/10 text-emerald-500'
                                      : 'bg-slate-500/10 text-slate-400'
                                  )}
                                >
                                  {st.status === 'HOAT_DONG' ? 'Đang hoạt động' : 'Tạm khóa'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            'px-6 py-3 border-t flex items-center justify-between text-xs flex-shrink-0',
            isDarkMode ? 'border-[#3E4850]/30 bg-[#131B2E]' : 'border-slate-100 bg-slate-50'
          )}
        >
          <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>
            Hệ thống quản trị mạng lưới showroom toàn quốc AutoHub Operations (UC22)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
