import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Plus,
  Car,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminCarMaster } from '../../hooks/useAdminCarMaster';
import { CreateCarModal } from '../../components/CreateCarModal';
import { cn } from '@/lib/utils';
import type { AdminCarMasterItem } from '@/types/car.types';

export const CarMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    filteredCars,
    isLoading,
    error,
    search,
    setSearch,
    isSyncing,
    syncSuccess,
    syncResult,
    toastMessage,
    toastType,
    isSubmitting,
    fetchCars,
    handleSyncVector,
    handleToggleStatus,
    handleDeleteCar,
    handleCreateCar,
    setToastMessage,
  } = useAdminCarMaster();

  return (
    <div className={cn(
      'space-y-6 antialiased transition-colors',
      isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
    )}>
      {/* Header & Action Toolbar */}
      <div className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      )}>
        <div>
          <h1 className={cn(
            'text-xl md:text-2xl font-bold',
            isDarkMode ? 'text-white' : 'text-slate-900'
          )}>
            Quản Lý Danh Mục Dòng Xe & Phiên Bản Cấu Hình
          </h1>
          <p className={cn(
            'text-sm mt-0.5',
            isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
          )}>
            Quản trị thông số kỹ thuật xe ô tô, đội xe Demo trải nghiệm và nhúng vector vào Vector Database phục vụ Trợ lý AI OpenRouter API.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Vector Embeddings Sync Button */}
          <button
            type="button"
            onClick={handleSyncVector}
            disabled={isSyncing}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 cursor-pointer shadow-sm',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/40 hover:bg-[#1E293B]'
                : 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100'
            )}
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-500" />
            )}
            <span>{isSyncing ? 'Đang băm nhỏ & Vector hóa...' : '⚡ Đồng Bộ Vector DB Cho AI'}</span>
          </button>

          {/* Add New Car Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dòng Xe Mới</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncSuccess && (
        <div className={cn(
          'p-3.5 rounded-lg border text-xs flex items-center justify-between animate-fade-in',
          isDarkMode
            ? 'bg-[#0D2818] border-emerald-500/50 text-emerald-300'
            : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        )}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>
              <strong>Đồng bộ thành công:</strong>{' '}
              {syncResult?.message ||
                'Đã băm nhỏ các phiên bản cấu hình và nhúng vector vào Vector Database trong 18ms. Trợ lý AI OpenRouter đã đồng bộ dữ liệu mới nhất!'}
            </span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className={cn(
          'p-3.5 rounded-lg border text-xs flex items-center justify-between',
          isDarkMode
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        )}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchCars(search)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border transition-colors',
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40'
          : 'bg-white border-slate-200 shadow-xs'
      )}>
        <div className="relative w-full sm:w-80">
          <Search className={cn(
            'w-4 h-4 absolute left-3 top-2.5',
            isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
          )} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên xe, phiên bản, phân khúc..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs border rounded-md focus:outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            )}
          />
        </div>
        <div className={cn(
          'flex items-center gap-2 text-xs font-mono',
          isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
        )}>
          <span>
            Tổng số:{' '}
            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>
              {filteredCars.length}
            </strong>{' '}
            phiên bản
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className={cn(
        'rounded-xl border overflow-hidden transition-colors',
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={cn(
              'font-mono uppercase text-[11px] border-b',
              isDarkMode
                ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                : 'bg-slate-50/80 text-slate-500 border-slate-200'
            )}>
              <tr>
                <th className="py-3 px-4 font-semibold">Mã / Dòng Xe</th>
                <th className="py-3 px-4 font-semibold">Phiên Bản Cấu Hình</th>
                <th className="py-3 px-4 font-semibold">Phân Khúc</th>
                <th className="py-3 px-4 font-semibold text-right">Giá Niêm Yết</th>
                <th className="py-3 px-4 font-semibold text-right">Mức Cọc 72h</th>
                <th className="py-3 px-4 font-semibold text-center">Xe Demo</th>
                <th className="py-3 px-4 font-semibold text-center">Vector AI Status</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
                <th className="py-3 px-4 font-semibold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={cn(
              'divide-y font-sans',
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            )}>
              {/* 1. Loading State */}
              {isLoading && (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'w-8 h-8 rounded',
                            isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                          )} />
                          <div className="space-y-1.5">
                            <div className={cn(
                              'w-24 h-3.5 rounded',
                              isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                            )} />
                            <div className={cn(
                              'w-12 h-2.5 rounded',
                              isDarkMode ? 'bg-[#171F33]' : 'bg-slate-100'
                            )} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={cn(
                          'w-36 h-3.5 rounded',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4">
                        <div className={cn(
                          'w-28 h-3.5 rounded',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={cn(
                          'w-24 h-3.5 rounded ml-auto',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={cn(
                          'w-20 h-3.5 rounded ml-auto',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className={cn(
                          'w-16 h-4 rounded mx-auto',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className={cn(
                          'w-28 h-4 rounded mx-auto',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className={cn(
                          'w-20 h-4 rounded mx-auto',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className={cn(
                          'w-12 h-4 rounded mx-auto',
                          isDarkMode ? 'bg-[#171F33]' : 'bg-slate-200'
                        )} />
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {/* 2. Empty State */}
              {!isLoading && filteredCars.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        isDarkMode ? 'bg-[#171F33] text-[#88929B]' : 'bg-slate-100 text-slate-400'
                      )}>
                        <Car className="w-6 h-6" />
                      </div>
                      <div className={cn(
                        'font-medium text-sm',
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      )}>
                        Không tìm thấy phiên bản xe nào phù hợp
                      </div>
                      <p className={cn(
                        'text-xs max-w-sm',
                        isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                      )}>
                        Thử tìm kiếm với từ khóa khác như "VinFast", "VF8", "Hybrid", "SantaFe", "CR-V" hoặc thêm một dòng xe mới.
                      </p>
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch('')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
                        >
                          Xóa bộ lọc tìm kiếm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* 3. Real Data Rows */}
              {!isLoading &&
                filteredCars.map((car: AdminCarMasterItem) => (
                  <tr
                    key={car.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                    )}
                  >
                    {/* Mã / Dòng Xe */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            'w-8 h-8 rounded border flex items-center justify-center flex-shrink-0',
                            isDarkMode
                              ? 'bg-[#171F33] border-[#3E4850]/50 text-[#89CEFF]'
                              : 'bg-sky-50 border-sky-200 text-sky-600'
                          )}
                        >
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={cn(
                            'font-bold',
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          )}>
                            {car.name}
                          </div>
                          <div className={cn(
                            'text-[10px] font-mono',
                            isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                          )}>
                            {car.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phiên Bản Cấu Hình */}
                    <td className={cn(
                      'py-3 px-4 font-medium',
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    )}>
                      {car.version}
                    </td>

                    {/* Phân Khúc */}
                    <td className={cn(
                      'py-3 px-4',
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                    )}>
                      {car.segment}
                    </td>

                    {/* Giá Niêm Yết */}
                    <td className={cn(
                      'py-3 px-4 text-right font-mono font-bold',
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    )}>
                      {car.price}
                    </td>

                    {/* Mức Cọc 72h */}
                    <td className={cn(
                      'py-3 px-4 text-right font-mono font-semibold',
                      isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                    )}>
                      {car.deposit}
                    </td>

                    {/* Xe Demo */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 rounded text-[11px] font-medium border',
                          isDarkMode
                            ? 'bg-[#131B2E] border-[#3E4850]/60 text-[#89CEFF]'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        )}
                      >
                        {car.demoCount}
                      </span>
                    </td>

                    {/* Vector AI Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border',
                          isDarkMode
                            ? 'bg-[#0D2818] border-emerald-500/40 text-emerald-400'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {car.vectorStatus}
                      </span>
                    </td>

                    {/* Trạng Thái */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(car.variantId)}
                        title="Bấm để chuyển đổi trạng thái mở bán"
                        className={cn(
                          'inline-block px-2 py-0.5 rounded text-[11px] font-medium border transition-transform hover:scale-105 cursor-pointer',
                          car.active
                            ? isDarkMode
                              ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                            : isDarkMode
                              ? 'bg-slate-900 text-slate-400 border-slate-700'
                              : 'bg-slate-100 text-slate-500 border-slate-300'
                        )}
                      >
                        {car.status}
                      </button>
                    </td>

                    {/* Thao Tác */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(car.variantId)}
                          title={car.active ? 'Tạm ngừng kinh doanh' : 'Mở bán lại'}
                          className={cn(
                            'p-1.5 rounded transition-colors cursor-pointer',
                            car.active
                              ? isDarkMode
                                ? 'text-emerald-400 hover:bg-emerald-950/40'
                                : 'text-emerald-600 hover:bg-emerald-50'
                              : isDarkMode
                                ? 'text-slate-500 hover:bg-slate-800'
                                : 'text-slate-400 hover:bg-slate-100'
                          )}
                        >
                          {car.active ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCar(car.variantId, `${car.name} - ${car.version}`)}
                          title="Xóa phiên bản này"
                          className={cn(
                            'p-1.5 rounded transition-colors cursor-pointer',
                            isDarkMode
                              ? 'text-rose-400 hover:bg-rose-950/40'
                              : 'text-rose-500 hover:bg-rose-50'
                          )}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Car Modal */}
      <CreateCarModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCar}
        isSubmitting={isSubmitting}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold animate-slide-up',
            toastType === 'success'
              ? isDarkMode
                ? 'bg-[#0D2818] border-emerald-500/50 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : isDarkMode
                ? 'bg-rose-950 border-rose-500/50 text-rose-300'
                : 'bg-rose-50 border-rose-300 text-rose-800'
          )}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          )}
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 p-0.5 hover:opacity-70 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
