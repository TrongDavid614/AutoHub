import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Copy,
  Check,
  Eye,
  Repeat,
  CreditCard,
  Truck,
  Star,
  RefreshCcw,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Phone,
  Sparkles,
  ShoppingBag,
  X,
} from 'lucide-react';
import type { AccessoryOrder, AccessoryOrderStatus } from '@/types/order.types';
import { MOCK_CUSTOMER_ORDERS } from '../mocks/orders.mock';
import { useCartStore } from '@/store/useCartStore';

type FilterTab = 'ALL' | AccessoryOrderStatus;

export const CustomerOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);

  // Danh sách đơn hàng trong state để người dùng có thể tương tác (Hủy, Xác nhận nhận hàng...)
  const [orders, setOrders] = useState<AccessoryOrder[]>(MOCK_CUSTOMER_ORDERS);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<AccessoryOrder | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Review form state (UC14)
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Return form state (UC25)
  const [returnReason, setReturnReason] = useState('Lỗi kỹ thuật phần cứng nhà sản xuất');
  const [returnNote, setReturnNote] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Countdown timer cho đơn PENDING_PAYMENT (giả lập 15 phút theo UC34)
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 45); // 12m 45s

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 1. Chức năng Mua Lại (Reorder): Thêm sản phẩm vào giỏ hàng
  const handleReorder = (order: AccessoryOrder) => {
    order.orderItems.forEach((item) => {
      addToCart(item.accessory, item.quantity);
    });
    showToast(`Đã thêm ${order.orderItems.length} sản phẩm của đơn ${order.orderCode} vào giỏ hàng!`);
  };

  // 2. Chức năng Xác nhận đã nhận hàng (Chuyển sang DELIVERED)
  const handleConfirmDelivered = (orderId: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' as AccessoryOrderStatus } : o))
    );
    showToast('Xác nhận đã nhận hàng thành công! Đơn hàng đã chuyển sang trạng thái ĐÃ GIAO HÀNG.');
  };

  // 3. Chức năng Hủy đơn hàng (Hoàn tồn kho theo UC34)
  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: 'CANCELLED' as AccessoryOrderStatus } : o
      )
    );
    setShowCancelModal(false);
    showToast(`Đã hủy đơn hàng ${selectedOrder.orderCode}. Tồn kho linh kiện đã được tự động hoàn lại.`);
    setSelectedOrder(null);
  };

  // 4. Chức năng Gửi đánh giá sản phẩm (UC14)
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewModal(false);
      setReviewComment('');
      showToast('Đã gửi đánh giá thành công! Đánh giá đang được kiểm duyệt trước khi hiển thị.');
      setSelectedOrder(null);
    }, 1500);
  };

  // 5. Chức năng Gửi yêu cầu đổi trả (UC25)
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
    setTimeout(() => {
      setReturnSubmitted(false);
      setShowReturnModal(false);
      if (selectedOrder) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id ? { ...o, status: 'RETURNED' as AccessoryOrderStatus } : o
          )
        );
      }
      setReturnNote('');
      showToast('Đã gửi hồ sơ yêu cầu đổi trả thành công. Chuyên viên kỹ thuật sẽ liên hệ trong 24h.');
      setSelectedOrder(null);
    }, 1500);
  };

  // Lọc đơn hàng theo tab enum
  const filteredOrders =
    activeTab === 'ALL' ? orders : orders.filter((order) => order.status === activeTab);

  // Đếm số lượng đơn cho từng trạng thái
  const getOrderCount = (status: FilterTab) => {
    if (status === 'ALL') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  // Badge màu sắc và icon theo enum trạng thái
  const renderStatusBadge = (status: AccessoryOrderStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ĐÃ THANH TOÁN (PAID)</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-mono text-[11px] font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÃ GIAO HÀNG (DELIVERED)</span>
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 animate-bounce" />
            <span>ĐANG GIAO HÀNG (SHIPPING)</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>ĐANG XỬ LÝ (PROCESSING)</span>
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>CHỜ THANH TOÁN ({formatCountdown(timeLeft)})</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-sky-500/15 border border-sky-500/40 text-sky-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>CHỜ XỬ LÝ (PENDING COD)</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            <span>ĐÃ HỦY (CANCELLED)</span>
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-orange-500/15 border border-orange-500/40 text-orange-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>ĐỔI TRẢ (RETURNED)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-slate-500/15 border border-slate-500/40 text-slate-300 font-mono text-[11px] font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D3449]">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#89CEFF]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#DAE2FD]">Đơn Hàng Phụ Kiện Của Tôi</h1>
          </div>
          <p className="text-xs text-[#88929B] mt-1">
            Theo dõi tình trạng đơn hàng linh kiện điện giải, xem hóa đơn điện tử E-Receipt và quản lý bảo hành.
          </p>
        </div>

        <Link
          to="/accessories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#89CEFF]/50 text-xs font-semibold text-[#89CEFF] transition-all cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Khám phá thêm phụ kiện</span>
        </Link>
      </div>

      {/* 2. Menu Bộ lọc ngang hiển thị các chức năng theo Enum TrangThaiDonHang */}
      <div className="bg-[#171F33]/60 p-1.5 rounded-[6px] border border-[#2D3449] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {(
            [
              { key: 'ALL', label: 'TẤT CẢ' },
              { key: 'PENDING_PAYMENT', label: 'CHỜ THANH TOÁN' },
              { key: 'PENDING', label: 'CHỜ DUYỆT (COD)' },
              { key: 'PAID', label: 'ĐÃ THANH TOÁN' },
              { key: 'PROCESSING', label: 'ĐANG XỬ LÝ' },
              { key: 'SHIPPING', label: 'ĐANG GIAO HÀNG' },
              { key: 'DELIVERED', label: 'ĐÃ GIAO HÀNG' },
              { key: 'CANCELLED', label: 'ĐÃ HỦY' },
              { key: 'RETURNED', label: 'ĐỔI TRẢ' },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => {
            const count = getOrderCount(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[4px] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0EA5E9] text-[#00344D] shadow-[0_0_15px_rgba(14,165,233,0.35)]'
                    : 'text-[#BEC8D2] hover:text-[#DAE2FD] hover:bg-[#131B2E]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-[#00344D] text-[#89CEFF]' : 'bg-[#222A3D] text-[#88929B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Notification khi thao tác Mua lại / Hủy đơn... */}
      {toastMessage && (
        <div className="p-3.5 rounded-[4px] bg-[#00A6E0]/15 border border-[#00A6E0] text-[#DAE2FD] text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#89CEFF] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <Link
            to="/cart"
            className="px-2.5 py-1 rounded bg-[#00A6E0] text-[#060E20] font-bold text-[11px] hover:bg-[#89CEFF] transition-colors shrink-0"
          >
            Vào Giỏ Hàng Ngay →
          </Link>
        </div>
      )}

      {/* 3. Danh sách đơn hàng dạng ROW (Row-based list) */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center rounded-[4px] bg-[#171F33]/30 border border-[#2D3449] space-y-3">
            <Package className="w-12 h-12 text-[#88929B] mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-[#DAE2FD]">Không có đơn hàng nào trong mục này</h3>
            <p className="text-xs text-[#88929B] max-w-sm mx-auto">
              Chưa phát sinh đơn hàng phụ kiện thuộc trạng thái được chọn. Hãy khám phá bộ sưu tập phụ kiện AutoHub
              để trang bị cho chiếc EV của bạn.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className="mt-2 px-4 py-2 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-xs text-[#89CEFF] font-semibold"
            >
              Xem tất cả đơn hàng
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSuccessOrder = order.status === 'PAID' || order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="rounded-[6px] bg-[#171F33]/80 border border-[#2D3449] hover:border-[#89CEFF]/40 shadow-xl overflow-hidden transition-all duration-200"
              >
                {/* 3.1. Header của Row: Mã đơn, Thời gian, Trạng thái */}
                <div className="p-4 bg-[#131B2E] border-b border-[#2D3449] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Mã đơn hàng + nút copy */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#88929B] font-mono">MÃ ĐƠN:</span>
                      <span className="font-mono text-sm font-bold text-[#89CEFF]">{order.orderCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(order.orderCode)}
                        className="p-1 rounded hover:bg-[#222A3D] text-[#88929B] hover:text-[#89CEFF] transition-colors cursor-pointer"
                        title="Sao chép mã đơn"
                      >
                        {copiedCode === order.orderCode ? (
                          <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span className="text-[#3E4850]">•</span>

                    {/* Ngày đặt */}
                    <div className="text-xs text-[#BEC8D2]">
                      Đặt ngày:{' '}
                      <span className="font-mono text-[#DAE2FD]">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <span className="text-[#3E4850]">•</span>

                    {/* Phương thức thanh toán */}
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#222A3D] text-[10px] font-mono text-[#BEC8D2]">
                      {order.paymentMethod === 'VNPAY' ? 'VNPay Secured' : 'Thanh toán COD'}
                    </span>
                  </div>

                  {/* Badge trạng thái */}
                  <div>{renderStatusBadge(order.status)}</div>
                </div>

                {/* 3.2. Body của Row: Danh sách các mặt hàng linh kiện */}
                <div className="p-4 sm:p-5 divide-y divide-[#2D3449]/50">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <img
                          src={item.accessory.thumbnailUrl}
                          alt={item.accessory.name}
                          className="w-14 h-14 rounded-[4px] bg-[#060E20] border border-[#2D3449] object-cover shrink-0"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-sm font-semibold text-[#DAE2FD] truncate">{item.accessory.name}</h4>
                          <div className="flex items-center gap-2 flex-wrap text-xs text-[#88929B]">
                            <span className="font-mono text-[11px] text-[#89CEFF]">{item.accessory.sku}</span>
                            <span>•</span>
                            <span>Số lượng: {item.quantity}</span>
                            {(item.accessory.categoryBadge || item.accessory.specPills?.[0]) && (
                              <>
                                <span>•</span>
                                <span className="px-1.5 py-0.2 rounded-[2px] bg-[#222A3D] text-[10px] text-[#7BD0FF] font-mono">
                                  {item.accessory.categoryBadge || item.accessory.specPills?.[0]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-[#88929B] font-mono">
                          {item.unitPrice.toLocaleString('vi-VN')} ₫ × {item.quantity}
                        </div>
                        <div className="text-sm font-mono font-bold text-[#DAE2FD]">
                          {item.totalPrice.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3.3. Footer của Row: Địa chỉ, Tổng tiền & Hàng nút chức năng nghiệp vụ */}
                <div className="p-4 bg-[#131B2E]/90 border-t border-[#2D3449] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Thông tin phụ trợ bên trái */}
                  <div className="space-y-1 text-xs text-[#88929B] max-w-md">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#89CEFF] shrink-0 mt-0.5" />
                      <span className="truncate">{order.shippingAddress}</span>
                    </div>

                    {order.trackingNumber && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#89CEFF]">
                        <Truck className="w-3 h-3" />
                        <span>Mã vận đơn: {order.trackingNumber}</span>
                      </div>
                    )}

                    {order.status === 'PENDING_PAYMENT' && (
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Hạn thanh toán còn lại: {formatCountdown(timeLeft)} (tự động hoàn kho sau 15p)</span>
                      </div>
                    )}
                  </div>

                  {/* Tổng tiền & Cụm Action Buttons bên phải */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 self-end md:self-auto">
                    {/* Tổng tiền */}
                    <div className="text-right sm:pr-2">
                      <div className="text-[11px] text-[#88929B] uppercase font-mono">Tổng thanh toán:</div>
                      <div className="font-mono text-lg font-bold text-[#89CEFF]">
                        {order.finalTotalAmount.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>

                    {/* HÀNG NÚT CHỨC NĂNG THEO YÊU CẦU NGHIỆP VỤ FILE WORD */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 1. Nếu là đơn hàng thành công (PAID hoặc DELIVERED) -> có 2 chức năng theo yêu cầu: Mua lại & Xem chi tiết */}
                      {isSuccessOrder && (
                        <>
                          {/* Nút Mua Lại */}
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-3.5 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] hover:border-[#89CEFF]/50 text-xs font-semibold text-[#DAE2FD] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Repeat className="w-3.5 h-3.5 text-[#89CEFF]" />
                            <span>Mua lại</span>
                          </button>

                          {/* Nút Xem Chi Tiết (Hiển thị trang Page Success / E-Receipt) */}
                          <button
                            type="button"
                            onClick={() => navigate(`/checkout/success?orderId=${encodeURIComponent(order.orderCode)}`)}
                            className="px-3.5 py-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#00344D]" />
                            <span>Xem chi tiết</span>
                          </button>
                        </>
                      )}

                      {/* 2. Nếu là đơn DELIVERED -> bổ sung nghiệp vụ Đánh giá (UC14) & Đổi trả 30 ngày (UC25) */}
                      {order.status === 'DELIVERED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReviewModal(true);
                            }}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Đánh giá</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReturnModal(true);
                            }}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-orange-400 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            <span>Yêu cầu đổi trả</span>
                          </button>
                        </>
                      )}

                      {/* 3. Nếu là đơn PENDING_PAYMENT -> Thanh toán ngay hoặc Hủy đơn */}
                      {order.status === 'PENDING_PAYMENT' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-rose-950/40 border border-[#2D3449] hover:border-rose-500/50 text-xs font-semibold text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hủy đơn</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate(`/checkout/success?orderId=${encodeURIComponent(order.orderCode)}`)}
                            className="px-4 py-2 rounded-[2px] bg-amber-500 hover:bg-amber-400 text-xs font-bold text-[#060E20] flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Thanh toán ngay</span>
                          </button>
                        </>
                      )}

                      {/* 4. Nếu là đơn PENDING (COD) -> Cho phép Hủy hoặc Xem tóm tắt */}
                      {order.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-rose-950/40 border border-[#2D3449] text-xs font-semibold text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hủy đơn</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate(`/checkout/success?orderId=${encodeURIComponent(order.orderCode)}`)}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-[#89CEFF] flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem chi tiết</span>
                          </button>
                        </>
                      )}

                      {/* 5. Nếu là đơn PROCESSING -> Xem tiến độ kho vận SiC & Hotline hỗ trợ */}
                      {order.status === 'PROCESSING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowProgressModal(true);
                            }}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-indigo-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Tiến độ đóng gói</span>
                          </button>

                          <a
                            href="tel:19008888"
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-[#89CEFF] flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Hỗ trợ 24/7</span>
                          </a>
                        </>
                      )}

                      {/* 6. Nếu là đơn SHIPPING -> Theo dõi vận đơn hoặc Xác nhận đã nhận hàng */}
                      {order.status === 'SHIPPING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowTrackingModal(true);
                            }}
                            className="px-3 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-purple-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Theo dõi vận đơn</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConfirmDelivered(order.id)}
                            className="px-3.5 py-2 rounded-[2px] bg-[#34D399] hover:bg-[#10B981] text-xs font-bold text-[#060E20] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Đã nhận được hàng</span>
                          </button>
                        </>
                      )}

                      {/* 7. Nếu là đơn CANCELLED -> Mua lại và xem thông báo lý do */}
                      {order.status === 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-3.5 py-2 rounded-[2px] bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Đặt mua lại đơn này</span>
                        </button>
                      )}

                      {/* 8. Nếu là đơn RETURNED -> Xem biên bản & Mua lại */}
                      {order.status === 'RETURNED' && (
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-3.5 py-2 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] border border-[#2D3449] text-xs font-semibold text-[#89CEFF] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Mua lại phụ kiện</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* CÁC MODAL NGHIỆP VỤ TƯƠNG TÁC (ĐÁNH GIÁ, ĐỔI TRẢ, THEO DÕI VẬN ĐƠN, HỦY ĐƠN) */}
      {/* ========================================================================= */}

      {/* 1. Modal Đánh giá sản phẩm đã mua (UC14) */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Đánh giá chất lượng phụ kiện (UC14)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <Check className="w-12 h-12 text-[#34D399] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#DAE2FD]">Cảm ơn bạn đã gửi đánh giá!</h4>
                <p className="text-xs text-[#88929B]">
                  Nhận xét của bạn đang được hệ thống tiếp nhận và chuyển sang Admin kiểm duyệt (UC32).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="pt-4 space-y-4">
                <div>
                  <label className="block text-xs text-[#88929B] mb-1">Sản phẩm trong đơn hàng:</label>
                  <div className="p-2.5 rounded bg-[#060E20] border border-[#2D3449] text-xs font-semibold text-[#DAE2FD]">
                    {selectedOrder.orderItems.map((i) => i.accessory.name).join(' + ')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#88929B] mb-2">Đánh giá mức độ hài lòng (Sao):</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-[#3E4850]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                      {reviewRating}/5 Sao ({reviewRating === 5 ? 'Cực kỳ hài lòng' : reviewRating >= 4 ? 'Hài lòng' : 'Tạm ổn'})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#88929B] mb-1">Nội dung nhận xét chi tiết:</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Chất lượng lắp ráp, độ tương thích xe, đóng gói cách âm..."
                    className="w-full p-2.5 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded text-xs text-[#DAE2FD] placeholder:text-[#88929B]/60 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D3449]">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#BEC8D2] hover:text-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-bold text-[#00344D]"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Modal Yêu cầu đổi trả linh kiện 1 đổi 1 trong 30 ngày (UC25) */}
      {showReturnModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Yêu cầu đổi trả phụ kiện (UC25)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {returnSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <Check className="w-12 h-12 text-[#34D399] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#DAE2FD]">Đã tiếp nhận yêu cầu đổi trả!</h4>
                <p className="text-xs text-[#88929B]">
                  Hồ sơ đổi trả đã được chuyển sang bộ phận kho vận & kinh doanh (Staff) thẩm định theo quy chế.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} className="pt-4 space-y-4">
                <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] space-y-1">
                  <div className="text-xs text-[#88929B]">Chính sách AutoHub:</div>
                  <div className="text-xs font-semibold text-[#89CEFF]">
                    ✓ 1 Đổi 1 trong 30 ngày đối với lỗi phần cứng hoặc không tương thích dòng xe.
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#88929B] mb-1">Lý do yêu cầu đổi trả:</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full p-2.5 bg-[#060E20] border border-[#2D3449] text-xs text-[#DAE2FD] rounded focus:outline-none"
                  >
                    <option value="Lỗi kỹ thuật phần cứng nhà sản xuất">Lỗi kỹ thuật phần cứng nhà sản xuất</option>
                    <option value="Không tương thích giắc cắm/đời xe thực tế">Không tương thích giắc cắm/đời xe thực tế</option>
                    <option value="Móp méo/hư hỏng trong quá trình vận chuyển">Móp méo/hư hỏng trong quá trình vận chuyển</option>
                    <option value="Khác">Khác (Nêu rõ bên dưới)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#88929B] mb-1">Mô tả chi tiết tình trạng sản phẩm:</label>
                  <textarea
                    rows={3}
                    required
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    placeholder="Mô tả cụ thể hiện tượng lỗi, đèn báo trên bộ sạc hoặc vấn đề lắp đặt..."
                    className="w-full p-2.5 bg-[#060E20] border border-[#2D3449] focus:border-[#89CEFF] rounded text-xs text-[#DAE2FD] placeholder:text-[#88929B]/60 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D3449]">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#BEC8D2] hover:text-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-400 text-xs font-bold text-[#060E20]"
                  >
                    Xác nhận gửi hồ sơ đổi trả
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Modal Theo dõi vận đơn giao hàng (Tracking Modal) */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Hành trình vận chuyển (Bưu chính VIP)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTrackingModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#88929B]">Mã vận đơn: </span>
                  <span className="font-mono font-bold text-[#89CEFF]">{selectedOrder.trackingNumber}</span>
                </div>
                <div className="text-[#34D399] font-bold">AutoHub Logistics VIP</div>
              </div>

              {/* Lộ trình bưu cục */}
              <div className="space-y-4 pl-4 border-l-2 border-[#0EA5E9] ml-2 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#0EA5E9] ring-4 ring-[#0EA5E9]/20" />
                  <div className="font-mono text-[#89CEFF]">14:30 • Hôm nay</div>
                  <div className="font-bold text-[#DAE2FD]">Đang giao hàng tới người nhận</div>
                  <div className="text-[#88929B]">Bưu tá chuyên trách xe điện đang di chuyển tới Landmark 81</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#2D3449]" />
                  <div className="font-mono text-[#88929B]">08:15 • Hôm nay</div>
                  <div className="font-bold text-[#DAE2FD]">Đã đến bưu cục phát Quận Bình Thạnh</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#2D3449]" />
                  <div className="font-mono text-[#88929B]">19:00 • Hôm qua</div>
                  <div className="font-bold text-[#DAE2FD]">Xuất kho trung tâm linh kiện TP. Thủ Đức</div>
                  <div className="text-[#88929B]">Đóng gói bọc đệm SiC chống sốc hoàn tất</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#2D3449]">
              <button
                type="button"
                onClick={() => setShowTrackingModal(false)}
                className="px-4 py-2 rounded bg-[#171F33] hover:bg-[#222A3D] text-xs text-[#DAE2FD]"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Tiến độ đóng gói & kiểm định SiC (PROCESSING) */}
      {showProgressModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3449]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-[#DAE2FD]">Tiến độ đóng gói tại kho (UC24)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="w-7 h-7 rounded bg-[#171F33] text-[#BEC8D2] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded bg-[#060E20] border border-[#2D3449] space-y-1">
                <div className="text-[#88929B]">Kho phụ trách:</div>
                <div className="font-bold text-[#89CEFF]">Trung tâm kho vận linh kiện điện giải TP. Thủ Đức</div>
              </div>
              <div className="space-y-2 text-[#BEC8D2]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Xác thực tồn kho khả dụng (@Transactional)</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Đang gắn chip định danh RFID & kiểm tra thông mạch SiC</span>
                </div>
                <div className="flex items-center gap-2 text-[#88929B]">
                  <Truck className="w-4 h-4" />
                  <span>Dự kiến bàn giao xe chuyên dụng trong 2 - 4 giờ tới</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#2D3449]">
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#DAE2FD]"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Xác nhận Hủy đơn hàng (UC34) */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-xl bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-400 pb-3 border-b border-[#2D3449]">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#DAE2FD]">Xác nhận hủy đơn hàng</h3>
            </div>

            <div className="py-4 space-y-2 text-xs text-[#BEC8D2]">
              <p>
                Bạn có chắc chắn muốn hủy đơn hàng <strong className="text-[#89CEFF]">{selectedOrder.orderCode}</strong> không?
              </p>
              <p className="text-[#88929B]">
                Hệ thống sẽ giải phóng suất giữ hàng và hoàn lại số lượng tồn kho theo quy tắc nghiệp vụ BR04 & UC34.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D3449]">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded bg-[#171F33] text-xs text-[#BEC8D2] hover:text-white"
              >
                Không, giữ đơn
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md"
              >
                Xác nhận hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
