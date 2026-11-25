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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-lg bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 shadow-xs text-center space-y-5">
        {/* Icon status */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
            : 'bg-red-50 border-red-200 text-red-600'
            }`}
        >
          {isSuccess ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
        </div>

        <div className="space-y-1.5">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${isSuccess
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
              }`}
          >
            {isSuccess ? 'Thanh toán thành công' : 'Giao dịch không thành công'}
          </span>

          <h1 className="text-2xl font-bold text-[var(--text)] pt-1">
            {isSuccess ? 'Xác nhận thanh toán hoàn tất' : 'Giao dịch thất bại hoặc đã hủy'}
          </h1>

          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            {isSuccess
              ? isDeposit
                ? 'Suất xe của bạn đã được giữ chỗ trong 72 giờ trên hệ thống AutoHub.'
                : 'Đơn hàng phụ kiện đã được xác nhận thanh toán và đang chuẩn bị giao.'
              : 'Giao dịch qua VNPay chưa hoàn tất hoặc bạn đã hủy phiên thanh toán.'}
          </p>
        </div>

        {/* Detail Rows */}
        <div className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--line)] space-y-2 text-xs text-left tabular-nums">
          <div className="flex justify-between items-center text-[var(--text-secondary)]">
            <span>Mã tham chiếu:</span>
            <span className="font-mono font-semibold text-[var(--text)]">{txnRef || 'N/A'}</span>
          </div>

          {transactionNo && (
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Mã giao dịch VNPay:</span>
              <span className="font-mono font-semibold text-[var(--accent)]">{transactionNo}</span>
            </div>
          )}

          {bankCode && (
            <div className="flex justify-between items-center text-[var(--text-secondary)]">
              <span>Ngân hàng:</span>
              <span className="font-semibold text-[var(--text)]">{bankCode}</span>
            </div>
          )}

          {amount > 0 && (
            <div className="flex justify-between items-center text-[var(--text-secondary)] pt-2 border-t border-[var(--line)]">
              <span>Số tiền thanh toán:</span>
              <span className="text-base font-bold text-[var(--accent)]">
                {amount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          )}
        </div>

        {isSuccess && (
          <div className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-1.5 tabular-nums">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Tự động chuyển hướng sau <strong>{countdown}s</strong>...
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <Link
            to="/"
            className="w-full sm:flex-1 h-10 px-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-xs font-medium text-[var(--text)] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>

          <Link
            to={isDeposit ? '/customer/deposits' : '/customer/orders'}
            className="w-full sm:flex-1 h-10 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{isDeposit ? 'Xem phiếu cọc' : 'Xem đơn hàng'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

