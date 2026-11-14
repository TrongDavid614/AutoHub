import React from 'react';
import {
  Building2,
  Phone,
  MapPin,
  Car,
  Users,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
  Edit,
  Clock,
  Box,
  Compass,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { useAdminShowrooms } from '../../hooks/useAdminShowrooms';
import { CreateOrEditShowroomModal } from '../../components/CreateOrEditShowroomModal';
import { ShowroomDetailModal } from '../../components/ShowroomDetailModal';

export const ShowroomNetworkPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const {
    showrooms,
    filteredShowrooms,
    stats,
    provinces,
    isLoading,
    isStatsLoading,
    error,
    search,
    setSearch,
    selectedRegion,
    setSelectedRegion,
    selectedStatus,
    setSelectedStatus,
    isCreateOrEditModalOpen,
    editingShowroom,
    isDetailModalOpen,
    selectedShowroomDetail,
    isLoadingDetail,
    isSubmitting,
    toastMessage,
    toastType,
    fetchShowrooms,
    fetchStats,
    openDetail,
    closeDetail,
    openCreateModal,
    openEditModal,
    closeCreateOrEditModal,
    handleSaveShowroom,
    handleToggleStatus,
    handleDeleteShowroom,
    handleAddDemoCar,
    handleUpdateDemoCarStatus,
  } = useAdminShowrooms();

  const handleRefresh = async () => {
    await fetchShowrooms();
    await fetchStats();
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-5 right-5 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 text-xs max-w-md animate-fade-in transition-all',
            toastType === 'success'
              ? isDarkMode
                ? 'bg-[#0D2818] border-emerald-500/50 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : isDarkMode
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          )}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          )}
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
              Mạng Lưới Showroom & Phân Bổ Tồn Kho Khu Vực
            </h1>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-full font-bold',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-blue-100 text-blue-700'
              )}
            >
              UC22 OPERATIONS
            </span>
          </div>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Quản lý chi nhánh showroom toàn quốc, điều phối đội xe Demo trải nghiệm và phân bổ tồn kho xe vật lý.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Refresh button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || isStatsLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-sm',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50 hover:bg-[#1E293B]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', (isLoading || isStatsLoading) && 'animate-spin')} />
            <span>Làm Mới</span>
          </button>

          {/* Add Showroom button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Showroom Mới</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Showrooms */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Mạng Lưới Showroom
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono">{stats.totalShowrooms} Chi Nhánh</div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-emerald-500 font-semibold">{stats.activeShowrooms} Đang phục vụ</span>
              {stats.inactiveShowrooms > 0 && (
                <span className="text-slate-400">({stats.inactiveShowrooms} tạm dừng)</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Demo Fleet */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Đội Xe Demo Trải Nghiệm
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-sky-500">{stats.totalDemoFleet} Xe Lái Thử</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.readyDemoFleet} xe sẵn sàng đón khách</span>
            </div>
          </div>
        </div>

        {/* Card 3: Physical Inventory */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Tồn Kho Xe Vật Lý
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-[#10B981]">
              {stats.totalPhysicalInventory} Xe Tại Kho
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-500 font-medium">
              <span>{stats.totalReservedInventory} xe đang giữ cọc 72h</span>
            </div>
          </div>
        </div>

        {/* Card 4: Staff Roster */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Nhân Lực Vận Hành
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono">{stats.totalStaff} Nhân Viên</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              <span>Trực tiếp tại showroom toàn quốc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search
            className={cn('w-4 h-4 absolute left-3 top-2.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, địa chỉ, hotline, mã SR..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            )}
          />
        </div>

        {/* Filter selectors */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* Region selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Compass className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={cn(
                'px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none cursor-pointer',
                isDarkMode
                  ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
              )}
            >
              <option value="ALL">Toàn Quốc (Tất Cả Khu Vực)</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
            </select>
          </div>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={cn(
              'px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none cursor-pointer',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
            )}
          >
            <option value="ALL">Tất Cả Trạng Thái</option>
            <option value="ACTIVE">Đang Hoạt Động</option>
            <option value="INACTIVE">Tạm Ngừng</option>
          </select>

          {/* Counter Badge */}
          <span
            className={cn(
              'text-[11px] font-mono px-2 py-1 rounded-md border',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/40'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            )}
          >
            {filteredShowrooms.length}/{showrooms.length} Chi Nhánh
          </span>
        </div>
      </div>

      {/* Error notification if any */}
      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Showroom Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <p className={cn('text-xs font-medium', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Đang tải dữ liệu mạng lưới showroom từ hệ thống...
          </p>
        </div>
      ) : filteredShowrooms.length === 0 ? (
        <div
          className={cn(
            'p-12 text-center rounded-2xl border space-y-3',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold">Không tìm thấy chi nhánh showroom phù hợp</h3>
          <p className={cn('text-xs max-w-md mx-auto', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc khu vực để xem toàn bộ chi nhánh.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedRegion('ALL');
              setSelectedStatus('ALL');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Xóa Bộ Lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShowrooms.map((sr) => (
            <div
              key={sr.id}
              className={cn(
                'p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-lg',
                isDarkMode
                  ? 'bg-[#0B1326] border-[#3E4850]/40 hover:border-[#89CEFF]/50 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
              )}
            >
              <div className="space-y-3">
                {/* Card Header: Code & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[11px] font-mono px-2 py-0.5 rounded border font-bold',
                        isDarkMode
                          ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      )}
                    >
                      {sr.code}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-semibold',
                        sr.region === 'Miền Bắc'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : sr.region === 'Miền Trung'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      )}
                    >
                      {sr.region}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(sr.id, sr.active)}
                    title={sr.active ? 'Đang hoạt động (Nhấn để tạm dừng)' : 'Tạm dừng (Nhấn để kích hoạt)'}
                    className="flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                  >
                    {sr.active ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                        <span>Hoạt động</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                        <span>Tạm ngừng</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Showroom Title */}
                <div>
                  <h2 className={cn('text-base font-bold line-clamp-1', isDarkMode ? 'text-white' : 'text-slate-900')}>
                    {sr.name}
                  </h2>
                  <span className={cn('text-[11px] font-medium', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                    Tỉnh/Thành: {sr.provinceName}
                  </span>
                </div>

                {/* Address & Hotline */}
                <div className={cn('space-y-1.5 text-xs', isDarkMode ? 'text-[#88929B]' : 'text-slate-600')}>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{sr.address}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{sr.hotline}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>
                        {sr.openTime ? sr.openTime.substring(0, 5) : '08:00'} -{' '}
                        {sr.closeTime ? sr.closeTime.substring(0, 5) : '19:00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Block */}
              <div
                className={cn(
                  'pt-3 border-t grid grid-cols-3 gap-2 text-center text-xs font-mono',
                  isDarkMode ? 'border-[#3E4850]/30' : 'border-slate-100'
                )}
              >
                {/* Staff Metric */}
                <div className={cn('p-2 rounded-lg', isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-50')}>
                  <div
                    className={cn(
                      'text-[10px] flex items-center justify-center gap-1',
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                    )}
                  >
                    <Users className="w-3 h-3 text-purple-500" />
                    <span>Nhân Sự</span>
                  </div>
                  <div className={cn('font-bold mt-0.5', isDarkMode ? 'text-white' : 'text-slate-900')}>
                    {sr.staffCount}
                  </div>
                </div>

                {/* Demo Fleet Metric */}
                <div className={cn('p-2 rounded-lg', isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-50')}>
                  <div
                    className={cn(
                      'text-[10px] flex items-center justify-center gap-1',
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                    )}
                  >
                    <Car className="w-3 h-3 text-sky-500" />
                    <span>Xe Demo</span>
                  </div>
                  <div className="font-bold text-sky-500 mt-0.5">
                    {sr.demoFleetReady}/{sr.demoFleet}
                  </div>
                </div>

                {/* Warehouse Stock Metric */}
                <div className={cn('p-2 rounded-lg', isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-50')}>
                  <div
                    className={cn(
                      'text-[10px] flex items-center justify-center gap-1',
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                    )}
                  >
                    <Box className="w-3 h-3 text-emerald-500" />
                    <span>Xe Kho</span>
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-[#10B981] mt-0.5">
                    {sr.inventoryPhysical}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div
                className={cn(
                  'pt-3 border-t flex items-center justify-between gap-2',
                  isDarkMode ? 'border-[#3E4850]/30' : 'border-slate-100'
                )}
              >
                <button
                  type="button"
                  onClick={() => openDetail(sr.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50 hover:bg-[#1E293B]'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  )}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Chi Tiết & Xe Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(sr)}
                  title="Chỉnh sửa showroom"
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteShowroom(sr.id, sr.name)}
                  title="Xóa showroom"
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors cursor-pointer',
                    isDarkMode
                      ? 'bg-[#171F33] border-[#3E4850]/50 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50'
                      : 'bg-rose-50 border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-100'
                  )}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateOrEditShowroomModal
        isOpen={isCreateOrEditModalOpen}
        onClose={closeCreateOrEditModal}
        onSave={handleSaveShowroom}
        editingShowroom={editingShowroom}
        provinces={provinces}
        isSubmitting={isSubmitting}
      />

      <ShowroomDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetail}
        detail={selectedShowroomDetail}
        isLoading={isLoadingDetail}
        onAddDemoCar={handleAddDemoCar}
        onUpdateDemoCarStatus={handleUpdateDemoCarStatus}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
