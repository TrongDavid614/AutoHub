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
    <div className="w-full bg-[var(--bg)] text-[var(--text)] min-h-screen">
      {/* 0. BREADCRUMB BAR */}
      <div className="w-full border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)] flex-wrap">
            <Link
              to="/"
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--line-strong)] shrink-0" />
            <Link
              to="/accessories"
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Phụ kiện
            </Link>
            {selectedCarModel && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--line-strong)] shrink-0" />
                <span className="text-[var(--accent)] font-medium truncate">
                  {selectedCarModel.name}
                </span>
              </>
            )}
            {selectedCategoryId !== undefined && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--line-strong)] shrink-0" />
                <span className="text-[var(--text)] font-medium">
                  {categories.find((c) => c.id === selectedCategoryId)?.categoryName}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 1. VEHICLE COMPATIBILITY BAR */}
      <VehicleCompatibilityBar
        carModel={selectedCarModel}
        accessoryCount={totalCount}
        onChangeCarClick={() => setIsCarModalOpen(true)}
        onClearCarClick={() => setSelectedCarModel(null)}
      />

      {/* 2. MAIN 2-COLUMN CATALOG LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
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
          <main className="flex-1 w-full space-y-5">
            {/* Filter Toolbar (Search + Counter + Sort) */}
            <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sạc, thảm, camera, phim cách nhiệt..."
                  className="w-full pl-9 pr-4 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-colors"
                />
              </div>

              {/* Counter & Sort Select */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-xs text-[var(--text-secondary)] tabular-nums">
                  Hiển thị <strong className="text-[var(--text)]">{accessories.length} / {totalCount}</strong> phụ kiện
                </div>

                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-asc' | 'price-desc' | 'newest')}
                    aria-label="Sắp xếp phụ kiện"
                    className="appearance-none bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg pl-3 pr-8 py-2 text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-96 rounded-lg bg-[var(--surface)] border border-[var(--line)]" />
                ))}
              </div>
            ) : accessories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {accessories.map((item) => (
                  <AccessoryProductCard key={item.id} accessory={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-12 text-center space-y-3">
                <p className="text-base text-[var(--text)] font-semibold">Không tìm thấy phụ kiện phù hợp</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="text-xs text-[var(--text-secondary)] tabular-nums">
                  Hiển thị {accessories.length} / {totalCount} phụ kiện {selectedCarModel ? `tương thích ${selectedCarModel.name}` : ''}
                </div>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium tabular-nums transition-colors cursor-pointer border ${currentPage === pageNum
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] border-[var(--line)]'
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
