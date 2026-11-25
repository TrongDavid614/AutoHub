import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Check,
  Truck,
  Wrench,
  Sparkles,
  ArrowLeft,
  Minus,
  Plus,
  AlertCircle,
  RotateCcw,
  Zap,
  Star,
  RefreshCw,
  Car,
  MessageSquare,
} from 'lucide-react';
import { accessoryService } from '@/features/customer/services/accessory.service';
import type { Accessory } from '@/types/accessory.types';
import { useCartStore } from '@/store/useCartStore';
import { usePageTracking } from '@/hooks/usePageTracking';

export const AccessoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [relatedAccessories, setRelatedAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'installation' | 'reviews'>('specs');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const fetchAccessoryDetail = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    setQuantity(1);
    setActiveImageIndex(0);

    try {
      const item = await accessoryService.getAccessoryById(Number(id));
      if (!item) {
        setAccessory(null);
        setIsLoading(false);
        return;
      }

      setAccessory(item);
      setIsLoading(false);

      // Fetch related items in same category
      if (item.categoryId) {
        try {
          const items = await accessoryService.getAccessories({ categoryId: item.categoryId });
          setRelatedAccessories((items ?? []).filter((a) => a.id !== item.id).slice(0, 3));
        } catch {
          setRelatedAccessories([]);
        }
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setHasError(true);
      const errMsg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ phụ kiện AutoHub';
      setErrorMessage(errMsg);
    }
  }, [id]);

  useEffect(() => {
    void fetchAccessoryDetail();
  }, [fetchAccessoryDetail]);

  const { trackAction } = usePageTracking({
    loaiThucThe: 'ACCESSORY',
    maThucThe: accessory ? accessory.id : undefined,
    metadata: {
      name: accessory?.name,
      category: accessory?.categoryName,
      price: accessory?.price,
    },
    enabled: Boolean(accessory),
  });

  const handleAddToCart = () => {
    if (!accessory) return;
    void addToCart(accessory, quantity);
    trackAction('ADD_TO_CART', {
      accessoryId: accessory.id,
      accessoryName: accessory.name,
      quantity,
      price: accessory.price,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!accessory) return;
    void addToCart(accessory, quantity);
    trackAction('BEGIN_CHECKOUT', {
      accessoryId: accessory.id,
      accessoryName: accessory.name,
      quantity,
      price: accessory.price,
    });
    navigate('/cart');
  };

  const formatPrice = (val?: number) => {
    return (val ?? 0).toLocaleString('vi-VN');
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full bg-[var(--bg)] text-[var(--text)] min-h-screen py-16 px-4 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[var(--text-secondary)]">
          Đang tải chi tiết phụ kiện...
        </p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (hasError) {
    return (
      <div className="w-full bg-[var(--bg)] text-[var(--text)] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Lỗi tải dữ liệu phụ kiện</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5">
              {errorMessage || 'Đã có sự cố khi kết nối tới hệ thống. Vui lòng thử lại.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => void fetchAccessoryDetail()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
            <Link
              to="/accessories"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--line)] text-[var(--text)] font-medium text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về danh mục</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. EMPTY STATE (NOT FOUND)
  if (!accessory) {
    return (
      <div className="w-full bg-[var(--bg)] text-[var(--text)] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-lg mx-auto p-8 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-[var(--text)]">Không tìm thấy phụ kiện</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Món phụ kiện này không tồn tại hoặc đã ngừng kinh doanh.
          </p>
          <Link
            to="/accessories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại danh mục phụ kiện</span>
          </Link>
        </div>
      </div>
    );
  }

  // Safe fallback arrays and values
  const allImages =
    (accessory.images && accessory.images.length > 0)
      ? accessory.images
      : (accessory.galleryUrls && accessory.galleryUrls.length > 0)
        ? accessory.galleryUrls
        : (accessory.thumbnailUrl ? [accessory.thumbnailUrl] : []);

  const currentMainImage = allImages[activeImageIndex] || allImages[0] || accessory.thumbnailUrl || '';
  const compatibilitiesList = accessory.compatibilities ?? accessory.compatibility ?? [];
  const reviewsList = accessory.reviews ?? [];
  const specPillsList = accessory.specPills ?? [];
  const specificationsEntries = accessory.specifications ? Object.entries(accessory.specifications) : [];
  const stockCount = accessory.stockQuantity ?? 0;

  return (
    <div className="w-full bg-[var(--bg)] text-[var(--text)] min-h-screen pb-16 antialiased">
      {/* 1. BREADCRUMB BAR */}
      <div className="w-full border-b border-[var(--line)] bg-[var(--surface)] sticky top-0 z-20">
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
            <ChevronRight className="w-3.5 h-3.5 text-[var(--line-strong)] shrink-0" />
            <span className="text-[var(--text-secondary)]">
              {accessory.categoryName || 'Danh mục phụ kiện'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--line-strong)] shrink-0" />
            <span className="text-[var(--text)] font-medium truncate max-w-[280px] sm:max-w-md">
              {accessory.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. MAIN PRODUCT DETAIL SHOWCASE (12-Col Desktop Grid) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* CỘT TRÁI: GALLERY & MEDIA SHOWCASE */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg overflow-hidden flex items-center justify-center p-4">
              {currentMainImage ? (
                <img
                  src={currentMainImage}
                  alt={accessory.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-[var(--text-muted)] text-xs">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Hình ảnh đang được cập nhật</span>
                </div>
              )}

              {/* Subtle Top-Left Tag */}
              {accessory.warrantyYears && (
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[var(--surface)]/95 border border-[var(--line)] text-[11px] font-medium text-[var(--text)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Bảo hành {accessory.warrantyYears} năm</span>
                </span>
              )}
            </div>

            {(allImages ?? []).length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {(allImages ?? []).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--surface)] border transition-colors cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                        : 'border-[var(--line)] hover:border-[var(--line-strong)] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Concise Technical Commitment Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-center text-xs divide-x divide-[var(--line)]">
              <div className="space-y-0.5 px-2">
                <Zap className="w-4 h-4 text-[var(--accent)] mx-auto" />
                <div className="font-semibold text-[var(--text)]">Chuẩn an toàn pin</div>
                <div className="text-[11px] text-[var(--text-muted)]">Giữ nguyên bảo hành</div>
              </div>
              <div className="space-y-0.5 px-2">
                <Truck className="w-4 h-4 text-emerald-600 mx-auto" />
                <div className="font-semibold text-[var(--text)]">Giao hàng nhanh</div>
                <div className="text-[11px] text-[var(--text-muted)]">Hà Nội &amp; TP.HCM</div>
              </div>
              <div className="space-y-0.5 px-2">
                <Wrench className="w-4 h-4 text-amber-600 mx-auto" />
                <div className="font-semibold text-[var(--text)]">Hỗ trợ lắp đặt</div>
                <div className="text-[11px] text-[var(--text-muted)]">Kỹ thuật viên hãng</div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT & ĐẶT MUA */}
          <div className="lg:col-span-6 space-y-5 bg-[var(--surface)] border border-[var(--line)] rounded-lg p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--text-muted)]">
                <span className="font-medium text-[var(--accent)]">
                  {accessory.categoryBadge || accessory.categoryName || 'Phụ kiện'}
                </span>
                <span>·</span>
                <span>{accessory.brand || 'AutoHub'}</span>
                <span>·</span>
                <span className="font-mono">SKU: {accessory.sku || `AH-ACC-${accessory.id}`}</span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-[var(--text)] leading-snug tracking-tight">
                {accessory.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-[var(--text)] tabular-nums">
                    {accessory.rating ? accessory.rating.toFixed(1) : '5.0'}
                  </span>
                </div>
                <span>·</span>
                <span className="tabular-nums">{reviewsList.length} đánh giá</span>
                <span>·</span>
                <span className={stockCount > 0 ? 'text-emerald-700 font-medium tabular-nums' : 'text-red-600 font-medium'}>
                  {stockCount > 0 ? `Còn ${stockCount} bộ` : 'Tạm hết hàng'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-[var(--line)] space-y-1">
              <div className="text-xs text-[var(--text-secondary)]">
                Giá niêm yết (đã bao gồm VAT)
              </div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-3xl font-bold text-[var(--text)] tabular-nums">
                  {formatPrice(accessory.price)} ₫
                </span>
                {accessory.discountPrice && accessory.discountPrice < accessory.price && (
                  <span className="text-sm text-[var(--text-muted)] line-through tabular-nums">
                    {formatPrice(accessory.discountPrice)} ₫
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {accessory.description || 'Phụ kiện ô tô chính hãng được kiểm định tiêu chuẩn kỹ thuật AutoHub.'}
            </p>

            {/* Spec Pills */}
            {specPillsList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specPillsList.map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--line)] text-xs text-[var(--text-secondary)]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Action Buttons */}
            <div className="pt-4 space-y-4 border-t border-[var(--line)]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Số lượng:</span>
                <div className="flex items-center border border-[var(--line-strong)] bg-[var(--surface)] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-11 text-center font-semibold text-sm text-[var(--text)] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(Math.max(stockCount, 1), q + 1))}
                    disabled={quantity >= stockCount && stockCount > 0}
                    className="w-9 h-9 flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface-subtle)] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={stockCount <= 0}
                  className="py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Mua ngay</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stockCount <= 0}
                  className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAdded
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border-[var(--line-strong)] text-[var(--text)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã thêm ({quantity})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Thêm vào giỏ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--line)] space-y-1 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Đổi trả trong 7 ngày nếu lỗi nhà sản xuất hoặc không tương thích</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Bảo hành điện tử theo số điện thoại và mã đơn hàng AutoHub.
              </p>
            </div>
          </div>
        </div>

        {/* 3. TABS CHI TIẾT */}
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] overflow-hidden">
          <div className="flex border-b border-[var(--line)] bg-[var(--surface-subtle)] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'specs'
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Thông số kỹ thuật
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compatibility')}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'compatibility'
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Dòng xe tương thích ({compatibilitiesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('installation')}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'installation'
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Lắp đặt &amp; bảo hành
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Đánh giá ({reviewsList.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'specs' && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[var(--text)]">Bảng thông số chi tiết</h4>
                {specificationsEntries.length > 0 ? (
                  <div className="border border-[var(--line)] rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <tbody>
                        {specificationsEntries.map(([key, val], idx) => (
                          <tr
                            key={idx}
                            className={`border-b last:border-b-0 border-[var(--line)] ${
                              idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-subtle)]'
                            }`}
                          >
                            <td className="py-2.5 px-4 font-medium text-[var(--text-secondary)] w-1/3">
                              {key}
                            </td>
                            <td className="py-2.5 px-4 text-[var(--text)] font-medium">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">Chưa có thông số chi tiết cho sản phẩm này.</p>
                )}
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[var(--text)]">Dòng xe hỗ trợ</h4>
                {compatibilitiesList.length > 0 ? (
                  <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-lg overflow-hidden">
                    {compatibilitiesList.map((comp, idx) => (
                      <div key={idx} className="p-4 bg-[var(--surface)] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Car className="w-4 h-4 text-[var(--accent)] shrink-0" />
                          <div>
                            <div className="font-semibold text-[var(--text)] text-sm">{comp.carModelName}</div>
                            <div className="text-xs text-[var(--text-muted)] tabular-nums">
                              Đời xe: {comp.manufactureYearStart ?? 2022} – {comp.manufactureYearEnd ?? 2026}
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                          Tương thích
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Phụ kiện dùng chung tương thích với hầu hết các mẫu xe trên hệ thống AutoHub.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'installation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--text-secondary)] leading-relaxed">
                <div className="space-y-1.5">
                  <div className="font-semibold text-[var(--text)] flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-[var(--accent)]" />
                    <span>Nhận tại showroom hoặc giao tận nhà</span>
                  </div>
                  <p>
                    Khách hàng có thể nhận trực tiếp tại hệ thống Showroom AutoHub toàn quốc hoặc chọn giao hàng nhanh theo khung giờ hẹn.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-semibold text-[var(--text)] flex items-center gap-2 text-sm">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Hỗ trợ lắp đặt kỹ thuật viên</span>
                  </div>
                  <p>
                    Đối với bộ sạc tại nhà, camera và thiết bị điện tử, kỹ thuật viên AutoHub hỗ trợ kiểm tra tương thích và lắp đặt tận nơi.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)]">Đánh giá từ khách hàng</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Ghi nhận từ đơn hàng thực tế đã giao thành công.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 tabular-nums">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-base font-bold text-[var(--text)]">
                      {accessory.rating ? accessory.rating.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">/ 5.0</span>
                  </div>
                </div>

                {reviewsList.length > 0 ? (
                  <div className="divide-y divide-[var(--line)]">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="py-4 first:pt-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-xs font-semibold text-[var(--accent)]">
                              {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[var(--text)] flex items-center gap-2">
                                <span>{rev.userName}</span>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                                  Đã mua hàng
                                </span>
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)] tabular-nums">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: rev.rating ?? 5 }).map((_, sIdx) => (
                              <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-10">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-1.5 text-[var(--text-muted)]">
                    <MessageSquare className="w-7 h-7 mx-auto opacity-50" />
                    <p className="text-xs">Chưa có đánh giá nào cho phụ kiện này.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. RELATED ACCESSORIES */}
        {(relatedAccessories ?? []).length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[var(--line)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--text)]">Phụ kiện cùng danh mục</h3>
              <Link
                to="/accessories"
                className="text-xs text-[var(--accent)] font-medium hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(relatedAccessories ?? []).map((rel) => (
                <Link
                  key={rel.id}
                  to={`/accessories/${rel.id}`}
                  className="group rounded-lg bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] p-4 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] rounded-md bg-[var(--surface-subtle)] overflow-hidden">
                      <img
                        src={rel.thumbnailUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)]">{rel.categoryName}</div>
                      <h4 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 mt-0.5">
                        {rel.name}
                      </h4>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[var(--line)] mt-3 flex items-baseline justify-between">
                    <span className="text-base font-bold text-[var(--text)] tabular-nums">
                      {formatPrice(rel.price)} ₫
                    </span>
                    <span className="text-xs text-[var(--accent)] font-medium">Xem chi tiết →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
