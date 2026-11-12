import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Home } from 'lucide-react';

export const VNPayReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const txnRef = searchParams.get('vnp_TxnRef') || '';
  const amountStr = searchParams.get('vnp_Amount');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const bankCode = searchParams.get('vnp_BankCode');

  const isSuccess = responseCode === '00';
  const amount = amountStr ? parseInt(amountStr, 10) / 100 : 0;
  const isDeposit = txnRef.startsWith('DEP_');

  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(isDeposit ? '/customer/deposits' : '/customer/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, isDeposit, navigate]);

  return (
    <div className="min-h-screen bg-[#060E20] text-[#DAE2FD] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div
          className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] ${
            isSuccess ? 'bg-[#0EA5E9]/30' : 'bg-rose-500/30'
          }`}
        />

        {/* Icon status */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl ${
            isSuccess
              ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400'
              : 'bg-rose-500/20 border-2 border-rose-400 text-rose-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          ) : (
            <XCircle className="w-10 h-10 animate-pulse" />
          )}
        </div>

        <div className="space-y-2">
          <div
            className={`inline-block px-3 py-1 rounded font-mono text-xs font-bold uppercase tracking-wider ${
              isSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {isSuccess ? 'THANH TOÁN VNPAY THÀNH CÔNG' : 'GIAO DỊCH THẤT BẠI HOẶC BỊ HỦY'}
          </div>

          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            {isSuccess ? 'Xác Nhận Thanh Toán Hoàn Tất' : 'Giao Dịch Không Thành Công'}
          </h1>

          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
            {isSuccess
              ? isDeposit
                ? 'Suất xe của bạn đã được tạm khóa 72 giờ trên hệ thống kho xe AutoHub.'
                : 'Đơn hàng phụ kiện đã được xác nhận thanh toán và đang đóng gói chuyển phát.'
              : 'Giao dịch qua cổng VNPay chưa hoàn tất hoặc bạn đã hủy phiên thanh toán.'}
          </p>
        </div>

        {/* Detail Box */}
        <div className="p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155] space-y-2.5 text-xs text-left font-mono">
          <div className="flex justify-between items-center text-[#94A3B8]">
            <span>Mã tham chiếu:</span>
            <span className="font-bold text-[#F8FAFC]">{txnRef || 'N/A'}</span>
          </div>

          {transactionNo && (
            <div className="flex justify-between items-center text-[#94A3B8]">
              <span>Mã giao dịch VNPay:</span>
              <span className="font-bold text-[#38BDF8]">{transactionNo}</span>
            </div>
          )}

          {bankCode && (
            <div className="flex justify-between items-center text-[#94A3B8]">
              <span>Ngân hàng:</span>
              <span className="font-bold text-[#F8FAFC]">{bankCode}</span>
            </div>
          )}

          {amount > 0 && (
            <div className="flex justify-between items-center text-[#94A3B8] pt-1.5 border-t border-[#334155]">
              <span>Số tiền thanh toán:</span>
              <span className="text-base font-black text-[#38BDF8]">
                {amount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          )}
        </div>

        {isSuccess && (
          <div className="text-xs text-[#94A3B8] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tự động chuyển hướng sau <strong>{countdown}s</strong>...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-[#E2E8F0] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <Link
            to={isDeposit ? '/customer/deposits' : '/customer/orders'}
            className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-[#0EA5E9] hover:bg-[#89CEFF] text-[#003751] font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-lg transition-all"
          >
            <span>{isDeposit ? 'Xem Phiếu Cọc' : 'Xem Đơn Hàng'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

