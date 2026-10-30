import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useAccessoryFilter } from '@/features/customer/hooks/useAccessoryFilter';
import { VehicleCompatibilityBar } from '@/features/customer/components/VehicleCompatibilityBar';
import { AccessoryFilterSidebar } from '@/features/customer/components/AccessoryFilterSidebar';
import { AccessoryProductCard } from '@/features/customer/components/AccessoryProductCard';
import { AccessoryCommitmentBanner } from '@/features/customer/components/AccessoryCommitmentBanner';
import { ChangeCarModelModal } from '@/features/customer/components/ChangeCarModelModal';

export const AccessoryListPage: React.FC = () => {
  const {
    selectedCarModel,
    setSelectedCarModel,
    isCarModalOpen,
    setIsCarModalOpen,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    selectedPriceRange,
    setSelectedPriceRange,
    readyInShowroom,
    setReadyInShowroom,
    homeInstallation,
    setHomeInstallation,
    isGenuine,
    setIsGenuine,
    warrantyYears,
    setWarrantyYears,
    sortBy,
    setSortBy,
    accessories,
    totalCount,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    clearAllFilters,
  } = useAccessoryFilter();

  return (
    <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen">
      {/* 0. BREADCRUMB BAR */}
      <div className="w-full border-b border-[#2D3449]/60 bg-[#060E20]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#88929B] flex-wrap">
            <Link
              to="/"
              className="text-[#88929B] hover:text-[#89CEFF] transition-colors font-medium uppercase tracking-wider"
            >
              TRANG CHỦ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#3E4850] shrink-0" />
            <Link
              to="/accessories"
              className="text-[#88929B] hover:text-[#89CEFF] transition-colors font-medium uppercase tracking-wider"
            >
              PHỤ KIỆN
            </Link>
            {selectedCarModel && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#3E4850] shrink-0" />
                <span className="text-[#89CEFF] font-bold uppercase tracking-wider truncate">
                  {selectedCarModel.name}
                </span>
              </>
            )}
            {selectedCategoryId !== undefined && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#3E4850] shrink-0" />
                <span className="text-[#DAE2FD] font-semibold text-xs tracking-normal">
                  {categories.find((c) => c.id === selectedCategoryId)?.categoryName}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 1. VEHICLE COMPATIBILITY HUD BAR */}
      <VehicleCompatibilityBar
        carModel={selectedCarModel}
        accessoryCount={totalCount}
        onChangeCarClick={() => setIsCarModalOpen(true)}
      />

      {/* 2. MAIN 2-COLUMN CATALOG LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Sidebar Filters */}
          <AccessoryFilterSidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
            readyInShowroom={readyInShowroom}
            onToggleReadyInShowroom={() => setReadyInShowroom(!readyInShowroom)}
            homeInstallation={homeInstallation}
            onToggleHomeInstallation={() => setHomeInstallation(!homeInstallation)}
            isGenuine={isGenuine}
            onToggleIsGenuine={() => setIsGenuine(!isGenuine)}
            warrantyYears={warrantyYears}
            onToggleWarrantyYears={setWarrantyYears}
            onClearAll={clearAllFilters}
          />

          {/* Right Column: Product Catalog Grid & Toolbar */}
          <main className="flex-1 w-full space-y-6">
            {/* Filter Toolbar (Search + Counter + Sort) */}
            <div className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-md">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#88929B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sạc, thảm, camera, phim cách nhiệt..."
                  className="w-full pl-10 pr-4 py-2 bg-[#060E20] border border-[#2D3449] rounded-[2px] text-xs text-[#DAE2FD] placeholder-[#88929B] focus:outline-none focus:border-[#89CEFF] focus:ring-1 focus:ring-[#89CEFF] transition-all"
                />
              </div>

              {/* Counter & Sort Select */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-xs text-[#88929B]">
                  Hiển thị <span className="font-mono text-[#DAE2FD] font-bold">{accessories.length} / {totalCount}</span> phụ kiện
                </div>

                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-asc' | 'price-desc' | 'newest')}
                    className="appearance-none bg-[#222A3D] border border-[#2D3449] rounded-[2px] pl-3 pr-8 py-2 text-xs text-[#DAE2FD] font-medium focus:outline-none focus:border-[#89CEFF] cursor-pointer"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#88929B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-96 rounded-[2px] bg-[#171F33] border border-[#2D3449]" />
                ))}
              </div>
            ) : accessories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accessories.map((item) => (
                  <AccessoryProductCard key={item.id} accessory={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-12 text-center space-y-4">
                <p className="text-base text-[#DAE2FD] font-medium">Không tìm thấy phụ kiện phù hợp</p>
                <p className="text-xs text-[#88929B]">
                  Thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-[2px] bg-[#0EA5E9] text-[#003751] font-bold text-xs uppercase cursor-pointer hover:bg-[#89CEFF] transition-colors"
                >
                  Xóa tất cả lọc
                </button>
              </div>
            )}

            {/* Pagination / Load More Bar */}
            {totalPages > 1 && (
              <div className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="text-xs text-[#88929B]">
                  Hiển thị {accessories.length} trong tổng số {totalCount} trang bị chuẩn hóa cho {selectedCarModel.name}
                </div>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-[2px] font-mono text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#0EA5E9] text-[#003751] shadow-md'
                          : 'bg-[#222A3D] text-[#DAE2FD] hover:bg-[#2D3449] border border-[#2D3449]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. SERVICE COMMITMENT BANNER */}
      <AccessoryCommitmentBanner />

      {/* 4. MODAL: CHANGE CAR MODEL */}
      <ChangeCarModelModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        selectedModel={selectedCarModel}
        onSelectModel={setSelectedCarModel}
      />
    </div>
  );
};

export default AccessoryListPage;
