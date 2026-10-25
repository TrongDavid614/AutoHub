import React from 'react';
import { X, Printer, ShieldCheck, Car } from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE } from '@/mock/mockData';

interface DepositReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositReceiptModal: React.FC<DepositReceiptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const deposit = MOCK_CUSTOMER_PROFILE.activeDeposit;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-300 print:border-none print:shadow-none print:m-0 print:w-full">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Biên Lai Đặt Cọc Điện Tử
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300">#BL-2026-VNP8899</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Tải PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="p-8 space-y-6 text-slate-800 print:p-6" id="printable-receipt">
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-950">
                <div className="bg-red-600 p-1.5 rounded-lg text-white">
                  <Car className="w-5 h-5" />
                </div>
                <span>Auto<span className="text-red-600">Hub</span> Corporation</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">CÔNG TY CỔ PHẦN NỀN TẢNG Ô TÔ ĐIỆN AUTOHUB VIỆT NAM</p>
              <p className="text-[11px] text-slate-500">
                Địa chỉ: Flagship Showroom Quận 7, Huỳnh Tấn Phát, Tân Thuận Đông, Q7, TP.HCM
              </p>
              <p className="text-[11px] text-slate-500">Mã số thuế: 0318998899 | Hotline: 1900 8888</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded text-[10px] font-bold uppercase tracking-wider">
                ĐÃ THANH TOÁN (VNPAY)
              </span>
              <p className="text-xs text-slate-500 mt-2">Mã biên lai: <strong className="text-slate-900">BL-2026-8899</strong></p>
              <p className="text-xs text-slate-500">Thời gian: {deposit.depositTimestamp}</p>
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black uppercase text-slate-950 tracking-wide">
              BIÊN LAI THU TIỀN ĐẶT CỌC GIỮ XE 72 GIỜ
            </h2>
            <p className="text-xs text-slate-500 italic">
              (Căn cứ theo Hợp đồng nguyên tắc giữ chỗ số: {deposit.contractCode})
            </p>
          </div>

          {/* Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-500">
                Thông tin khách hàng
              </span>
              <div>Họ và tên: <strong className="text-slate-900">{MOCK_CUSTOMER_PROFILE.fullName}</strong></div>
              <div>Số CCCD: <strong className="text-slate-900">{MOCK_CUSTOMER_PROFILE.identityCardNumber}</strong></div>
              <div>Số điện thoại: <strong className="text-slate-900">{MOCK_CUSTOMER_PROFILE.phoneNumber}</strong></div>
              <div>Email: <strong className="text-slate-900">{MOCK_CUSTOMER_PROFILE.email}</strong></div>
              <div>Hạng hội viên: <strong className="text-amber-700">VIP Diamond Reserve</strong></div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-500">
                Thông tin xe giữ chỗ
              </span>
              <div>Dòng xe: <strong className="text-slate-900">{deposit.carName}</strong></div>
              <div>Cấu hình: <strong className="text-slate-900">{deposit.carVariant}</strong></div>
              <div>Số khung VIN: <strong className="text-blue-700 font-mono">{deposit.vinNumber}</strong></div>
              <div>Chuyên viên tư vấn: <strong className="text-slate-900">{deposit.consultantName}</strong> ({deposit.consultantPhone})</div>
              <div>Địa điểm nhận xe: <strong className="text-slate-900">Showroom Q7 Flagship</strong></div>
            </div>
          </div>

          {/* Payment Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Nội dung thanh toán</th>
                  <th className="p-3">Cổng thanh toán</th>
                  <th className="p-3">Mã giao dịch đối soát</th>
                  <th className="p-3 text-right">Số tiền (VNĐ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium">
                    Đặt cọc online khóa số VIN giữ chỗ xe AutoHub GT-e trong 72 giờ
                  </td>
                  <td className="p-3 text-slate-600">{deposit.paymentGateway}</td>
                  <td className="p-3 font-mono font-semibold text-slate-700">{deposit.paymentRef}</td>
                  <td className="p-3 text-right font-black text-slate-950 text-sm">
                    {deposit.depositAmount.toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount In Words & Terms */}
          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-200">
            <div>
              Số tiền bằng chữ: <strong className="italic text-slate-900">Hai mươi triệu đồng chẵn.</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              * Ghi chú: Khoản đặt cọc có giá trị bảo lưu số khung xe trong vòng 72 giờ kể từ thời điểm phát sinh giao dịch.
              Khách hàng có quyền yêu cầu hoàn cọc 100% trực tuyến hoặc đến trực tiếp Flagship Showroom AutoHub Quận 7 để ký hợp đồng mua bán xe chính thức.
            </p>
          </div>

          {/* Signatures & Red Seal */}
          <div className="grid grid-cols-2 pt-4 items-end text-xs">
            <div className="text-center space-y-2">
              <p className="font-bold text-slate-700 uppercase">Khách hàng đặt cọc</p>
              <p className="text-[11px] text-slate-400 italic">(Đã ký xác nhận điện tử)</p>
              <div className="h-12 flex items-center justify-center font-bold text-slate-800">
                {MOCK_CUSTOMER_PROFILE.fullName}
              </div>
            </div>

            <div className="text-center space-y-2 relative">
              <p className="font-bold text-slate-700 uppercase">Đại diện AutoHub Việt Nam</p>
              <p className="text-[11px] text-slate-400 italic">(Ký, đóng dấu số điện tử)</p>
              
              {/* Simulated Official Red Seal */}
              <div className="w-28 h-28 mx-auto my-1 border-2 border-red-600 rounded-full flex flex-col items-center justify-center text-red-600 p-1 font-bold transform -rotate-12 select-none pointer-events-none">
                <div className="text-[8px] text-center leading-tight">CÔNG TY CP AUTOHUB</div>
                <div className="text-[9px] uppercase font-black my-0.5">★ ĐÃ THU TIỀN ★</div>
                <div className="text-[8px] text-center leading-tight">VNPAY CONFIRMED</div>
              </div>

              <div className="font-bold text-slate-900">{deposit.consultantName}</div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden when printing) */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Biên lai số bảo mật và có giá trị pháp lý trong toàn hệ thống AutoHub.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
