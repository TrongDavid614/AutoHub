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

  const handleAddToCart = () => {
    if (!accessory) return;
    void addToCart(accessory, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!accessory) return;
    void addToCart(accessory, quantity);
    navigate('/cart');
  };

  const formatPrice = (val?: number) => {
    return (val ?? 0).toLocaleString('vi-VN');
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen py-16 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#89CEFF] border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs text-[#88929B] uppercase tracking-wider">
          Đang tải dữ liệu chi tiết phụ kiện AutoHub...
        </p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (hasError) {
    return (
      <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-[4px] bg-[#171F33] border border-rose-500/30 text-center space-y-5 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <div>
            <h2 className="text-xl font-bold text-white">Lỗi Tải Dữ Liệu Phụ Kiện</h2>
            <p className="text-xs text-[#88929B] mt-2">
              {errorMessage || 'Đã có sự cố khi kết nối tới hệ thống phụ kiện. Vui lòng thử lại.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => void fetchAccessoryDetail()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
            <Link
              to="/accessories"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
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
      <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl mx-auto p-8 rounded-[4px] bg-[#171F33] border border-[#2D3449] text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Không Tìm Thấy Phụ Kiện</h2>
          <p className="text-xs text-[#88929B]">
            Món phụ kiện này không tồn tại hoặc đã được chuyển khỏi hệ thống danh mục AutoHub.
          </p>
          <Link
            to="/accessories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
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
    <div className="w-full bg-[#060E20] text-[#DAE2FD] min-h-screen pb-16 antialiased">
      {/* 1. BREADCRUMB BAR */}
      <div className="w-full border-b border-[#2D3449]/60 bg-[#060E20]/90 sticky top-0 z-20 backdrop-blur-md">
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
            <ChevronRight className="w-3.5 h-3.5 text-[#3E4850] shrink-0" />
            <span className="text-[#89CEFF] font-medium uppercase tracking-wider">
              {accessory.categoryName || 'Danh mục phụ kiện'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#3E4850] shrink-0" />
            <span className="text-white font-semibold truncate max-w-[280px] sm:max-w-md">
              {accessory.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. MAIN PRODUCT DETAIL SHOWCASE (12-Col Desktop Grid) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* CỘT TRÁI: GALLERY & MEDIA SHOWCASE (6 Cột) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Ảnh lớn chính */}
            <div className="relative aspect-[4/3] w-full bg-[#131B2E] border border-[#2D3449] rounded-[4px] overflow-hidden shadow-2xl flex items-center justify-center p-4">
              {currentMainImage ? (
                <img
                  src={currentMainImage}
                  alt={accessory.name}
                  className="w-full h-full object-contain transition-all duration-300"
                />
              ) : (
                <div className="text-center text-[#88929B] text-xs">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Hình ảnh đang được cập nhật</span>
                </div>
              )}

              {/* Tag chuẩn hóa OEM góc trên */}
              <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-[2px] bg-[#0EA5E9] text-[#003751] font-mono text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>XÁC THỰC OEM 100%</span>
                </span>
                {accessory.warrantyYears && (
                  <span className="px-2.5 py-1 rounded-[2px] bg-[#222A3D] text-[#89CEFF] border border-[#2D3449] font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
                    BẢO HÀNH {accessory.warrantyYears} NĂM
                  </span>
                )}
              </div>

              {/* Badge tình trạng tồn kho */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#060E20]/90 backdrop-blur-md border border-[#2D3449] shadow-lg">
                <span className={`w-2 h-2 rounded-full ${stockCount > 0 ? 'bg-[#34D399] animate-pulse' : 'bg-rose-400'}`} />
                <span className="font-mono text-xs text-[#DAE2FD] tracking-wider uppercase font-semibold">
                  {stockCount > 0 ? `TỒN KHO: ${stockCount} BỘ` : 'TẠM HẾT HÀNG'}
                </span>
              </div>
            </div>

            {/* Dải ảnh thumbnails (nếu có nhiều hơn 1 ảnh) */}
            {(allImages ?? []).length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {(allImages ?? []).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-[2px] overflow-hidden bg-[#131B2E] border transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#89CEFF] ring-2 ring-[#89CEFF]/30'
                        : 'border-[#2D3449] hover:border-[#89CEFF]/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Cam kết kỹ thuật an toàn */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-[4px] bg-[#171F33] border border-[#2D3449] text-center text-xs">
              <div className="space-y-1">
                <Zap className="w-4 h-4 text-[#89CEFF] mx-auto" />
                <div className="font-bold text-white text-[11px]">Điện Áp 800V SiC</div>
                <div className="text-[10px] text-[#88929B]">Không suy hao pin</div>
              </div>
              <div className="space-y-1 border-x border-[#2D3449]">
                <Truck className="w-4 h-4 text-[#34D399] mx-auto" />
                <div className="font-bold text-white text-[11px]">Giao Hỏa Tốc 2H</div>
                <div className="text-[10px] text-[#88929B]">Hà Nội & TP.HCM</div>
              </div>
              <div className="space-y-1">
                <Wrench className="w-4 h-4 text-[#FFB86E] mx-auto" />
                <div className="font-bold text-white text-[11px]">Lắp Đặt Tại Nhà</div>
                <div className="text-[10px] text-[#88929B]">Kỹ thuật viên chính hãng</div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT & ĐẶT MUA (6 Cột) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Phân loại & Thương hiệu */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono font-bold tracking-wider">
                <span className="text-[#89CEFF] uppercase">
                  {accessory.categoryBadge || (accessory.categoryName ? accessory.categoryName.toUpperCase() : 'PHỤ KIỆN')}
                </span>
                <span className="text-[#3E4850]">•</span>
                <span className="text-[#88929B] uppercase">THƯƠNG HIỆU: {accessory.brand || 'AutoHub OEM'}</span>
                <span className="text-[#3E4850]">•</span>
                <span className="text-[#BEC8D2] font-mono">MÃ SKU: {accessory.sku || `AH-ACC-${accessory.id}`}</span>
              </div>

              {/* Tên sản phẩm */}
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">
                {accessory.name}
              </h1>

              {/* Rating & Review summary */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-mono text-sm font-bold text-white">
                    {accessory.rating ? accessory.rating.toFixed(1) : '5.0'}
                  </span>
                </div>
                <span className="text-[#3E4850]">•</span>
                <span className="text-xs text-[#88929B] font-mono">
                  {reviewsList.length} đánh giá đã xác thực
                </span>
                <span className="text-[#3E4850]">•</span>
                <span className="text-xs text-emerald-400 font-mono">
                  Đã kiểm định tương thích 100%
                </span>
              </div>
            </div>

            {/* Khối Giá & Thuế VAT */}
            <div className="p-4 rounded-[4px] bg-[#171F33] border border-[#2D3449] space-y-2">
              <div className="text-[10px] font-mono uppercase text-[#88929B] tracking-wider">
                GIÁ NIÊM YẾT CHÍNH HÃNG (ĐÃ BAO GỒM VAT 10%)
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#89CEFF] tracking-tight">
                  {formatPrice(accessory.price)}
                </span>
                <span className="font-mono text-base font-bold text-white">VNĐ</span>
                {accessory.discountPrice && accessory.discountPrice < accessory.price && (
                  <span className="font-mono text-sm text-[#88929B] line-through ml-2">
                    {formatPrice(accessory.discountPrice)} VNĐ
                  </span>
                )}
              </div>
            </div>

            {/* Mô tả ngắn */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#88929B]">
                TỔNG QUAN PHỤ KIỆN
              </h3>
              <p className="text-sm text-[#DAE2FD] leading-relaxed">
                {accessory.description || 'Phụ kiện ô tô chính hãng được kiểm định tiêu chuẩn an toàn kỹ thuật AutoHub.'}
              </p>
            </div>

            {/* Điểm nổi bật (Spec Pills) */}
            {specPillsList.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#88929B]">
                  ĐẶC TÍNH KỸ THUẬT NỔI BẬT
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {specPillsList.map((pill, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-[2px] bg-[#222A3D] border border-[#2D3449] text-xs text-[#DAE2FD] flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#89CEFF] shrink-0" />
                      <span className="truncate">{pill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bộ chọn số lượng & Cụm nút Đặt mua */}
            <div className="pt-2 space-y-4 border-t border-[#2D3449]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold uppercase text-[#88929B] tracking-wider">
                  SỐ LƯỢNG:
                </span>
                <div className="flex items-center border border-[#2D3449] bg-[#171F33] rounded-[2px]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-[#DAE2FD] hover:text-[#89CEFF] hover:bg-[#222A3D] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(Math.max(stockCount, 1), q + 1))}
                    disabled={quantity >= stockCount && stockCount > 0}
                    className="w-9 h-9 flex items-center justify-center text-[#DAE2FD] hover:text-[#89CEFF] hover:bg-[#222A3D] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-[#88929B] font-mono">
                  {stockCount > 0 ? `(Còn ${stockCount} bộ trong kho)` : '(Hết hàng)'}
                </span>
              </div>

              {/* 2 Nút Mua: Thêm Giỏ Hàng & Mua Ngay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stockCount <= 0}
                  className={`py-3.5 px-4 rounded-[2px] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAdded
                      ? 'bg-[#34D399] text-[#060E20]'
                      : 'bg-[#222A3D] hover:bg-[#2D3449] border border-[#89CEFF]/60 text-[#89CEFF] active:scale-[0.98]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ĐÃ THÊM VÀO GIỎ ({quantity})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>THÊM VÀO GIỎ HÀNG</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={stockCount <= 0}
                  className="py-3.5 px-4 rounded-[2px] bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] hover:text-[#002738] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>MUA NGAY (THANH TOÁN)</span>
                </button>
              </div>
            </div>

            {/* Cam kết hỗ trợ */}
            <div className="p-4 rounded-[2px] bg-[#131B2E] border border-[#2D3449]/70 space-y-2 text-xs text-[#BEC8D2]">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Đổi trả miễn phí trong 7 ngày nếu lỗi nhà sản xuất hoặc không tương thích khung gầm</span>
              </div>
              <div className="text-[11px] text-[#88929B]">
                Bảo hành điện tử chính hãng thông qua số điện thoại hoặc mã đơn hàng trên hệ thống AutoHub.
              </div>
            </div>
          </div>
        </div>

        {/* 3. TABS CHI TIẾT: THÔNG SỐ, ĐỘ TƯƠNG THÍCH, LẮP ĐẶT & ĐÁNH GIÁ */}
        <div className="rounded-[4px] bg-[#171F33] border border-[#2D3449] overflow-hidden shadow-xl">
          {/* Tabs Navigation Header */}
          <div className="flex border-b border-[#2D3449] bg-[#131B2E] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'specs'
                  ? 'border-[#89CEFF] text-[#89CEFF] bg-[#171F33]'
                  : 'border-transparent text-[#88929B] hover:text-white'
              }`}
            >
              Thông số kỹ thuật đầy đủ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compatibility')}
              className={`px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'compatibility'
                  ? 'border-[#89CEFF] text-[#89CEFF] bg-[#171F33]'
                  : 'border-transparent text-[#88929B] hover:text-white'
              }`}
            >
              Dòng xe tương thích ({compatibilitiesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('installation')}
              className={`px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'installation'
                  ? 'border-[#89CEFF] text-[#89CEFF] bg-[#171F33]'
                  : 'border-transparent text-[#88929B] hover:text-white'
              }`}
            >
              Dịch vụ lắp đặt & Bảo hành
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-[#89CEFF] text-[#89CEFF] bg-[#171F33]'
                  : 'border-transparent text-[#88929B] hover:text-white'
              }`}
            >
              Đánh giá khách hàng ({reviewsList.length})
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="p-6 md:p-8">
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Bảng chi tiết thông số cấu hình OEM
                </h4>
                {specificationsEntries.length > 0 ? (
                  <div className="border border-[#2D3449] rounded-[2px] overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <tbody>
                        {specificationsEntries.map(([key, val], idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-[#2D3449] ${
                              idx % 2 === 0 ? 'bg-[#171F33]' : 'bg-[#131B2E]'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-semibold text-[#88929B] w-1/3">
                              {key}
                            </td>
                            <td className="py-3 px-4 text-[#DAE2FD] font-mono font-medium">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-[#88929B]">Chưa có thông số chi tiết cho sản phẩm này.</p>
                )}
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Danh sách kiến trúc khung gầm và dòng xe AutoHub hỗ trợ
                </h4>
                {compatibilitiesList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {compatibilitiesList.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-[2px] bg-[#131B2E] border border-[#2D3449] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Car className="w-5 h-5 text-[#89CEFF] shrink-0" />
                          <div>
                            <div className="font-bold text-white text-sm">{comp.carModelName}</div>
                            <div className="text-xs text-[#88929B] font-mono mt-0.5">
                              Đời xe: {comp.manufactureYearStart ?? 2022} – {comp.manufactureYearEnd ?? 2026}
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-[2px] bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold tracking-wider">
                          TƯƠNG THÍCH 100%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-[2px] bg-[#131B2E] border border-[#2D3449] text-center text-xs text-[#88929B]">
                    Phụ kiện đạt chuẩn đa năng (Universal), tương thích với toàn bộ các mẫu xe điện và động cơ đốt trong trên nền tảng AutoHub.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'installation' && (
              <div className="space-y-4 text-xs text-[#DAE2FD] leading-relaxed">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Chính sách giao nhận & Hỗ trợ lắp đặt chuyên nghiệp
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-[2px] bg-[#131B2E] border border-[#2D3449] space-y-2">
                    <div className="font-bold text-[#89CEFF] flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4" />
                      <span>Nhận tại Showroom hoặc Giao tận nhà</span>
                    </div>
                    <p className="text-[#BEC8D2]">
                      Quý khách có thể lựa chọn nhận hàng trực tiếp tại hệ thống Showroom AutoHub toàn quốc
                      hoặc đặt giao hàng hỏa tốc trong 2 giờ. Sản phẩm được bọc màng chống sốc đạt chuẩn vận chuyển linh kiện điện tử.
                    </p>
                  </div>
                  <div className="p-4 rounded-[2px] bg-[#131B2E] border border-[#2D3449] space-y-2">
                    <div className="font-bold text-[#34D399] flex items-center gap-2 text-sm">
                      <Wrench className="w-4 h-4" />
                      <span>Dịch vụ Kỹ thuật viên AutoHub Care</span>
                    </div>
                    <p className="text-[#BEC8D2]">
                      Đối với các thiết bị công suất cao như Trạm sạc Wallbox 22kW, Camera LiDAR hay Nâng cấp thân vỏ,
                      kỹ thuật viên AutoHub được chứng nhận an toàn điện SiC sẽ hỗ trợ khảo sát và lắp đặt chuẩn xác tại nhà.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Nhận xét & Đánh giá từ Khách hàng đã mua
                    </h4>
                    <p className="text-xs text-[#88929B] mt-1">
                      100% đánh giá được ghi nhận từ các đơn hàng thực tế đã giao thành công.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#131B2E] px-4 py-2 rounded-[2px] border border-[#2D3449]">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-mono text-lg font-black text-white">
                      {accessory.rating ? accessory.rating.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-[#88929B] font-mono">/ 5.0</span>
                  </div>
                </div>

                {reviewsList.length > 0 ? (
                  <div className="space-y-4">
                    {reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-[2px] bg-[#131B2E] border border-[#2D3449] space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#222A3D] border border-[#89CEFF]/30 flex items-center justify-center text-xs font-bold text-[#89CEFF]">
                              {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{rev.userName}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Đã mua hàng
                                </span>
                              </div>
                              <div className="text-[10px] text-[#88929B] font-mono">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Đã mua gần đây'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating ?? 5 }).map((_, sIdx) => (
                              <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[#DAE2FD] leading-relaxed pl-10">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#131B2E] border border-[#2D3449] rounded-[2px] space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#88929B] mx-auto opacity-40" />
                    <p className="text-xs text-[#88929B]">
                      Chưa có đánh giá nào cho phụ kiện này. Hãy là người đầu tiên trải nghiệm!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. PHỤ KIỆN CÙNG DANH MỤC LIÊN QUAN */}
        {(relatedAccessories ?? []).length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#2D3449]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Phụ Kiện Cùng Danh Mục Khuyến Nghị
              </h3>
              <Link
                to="/accessories"
                className="text-xs font-mono text-[#89CEFF] hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả phụ kiện</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(relatedAccessories ?? []).map((rel) => (
                <Link
                  key={rel.id}
                  to={`/accessories/${rel.id}`}
                  className="group rounded-[2px] bg-[#171F33] border border-[#2D3449] hover:border-[#89CEFF]/60 p-4 transition-all hover:-translate-y-0.5 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] rounded-[2px] bg-[#060E20] overflow-hidden">
                      <img
                        src={rel.thumbnailUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#89CEFF] uppercase tracking-wider font-bold">
                        {rel.categoryName}
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#89CEFF] transition-colors line-clamp-2 mt-1">
                        {rel.name}
                      </h4>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#2D3449] mt-3 flex items-baseline justify-between">
                    <span className="font-mono text-base font-bold text-[#89CEFF]">
                      {formatPrice(rel.price)} VNĐ
                    </span>
                    <span className="text-[11px] text-[#88929B] group-hover:text-white transition-colors">
                      Xem ngay →
                    </span>
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
