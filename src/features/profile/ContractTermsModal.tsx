import React from 'react';
import { X, FileText, ShieldCheck } from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE } from '@/mock/mockData';

interface ContractTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContractTermsModal: React.FC<ContractTermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const deposit = MOCK_CUSTOMER_PROFILE.activeDeposit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Hợp Đồng Nguyên Tắc Đặt Cọc Xe Số
              </h3>
              <p className="text-xs text-slate-400">{deposit.contractCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Hợp đồng điện tử đã được ký số mã hóa và bảo đảm quyền lợi người tiêu dùng theo Luật Giao dịch điện tử.</span>
          </div>

          <h4 className="text-sm font-bold text-white uppercase">Điều 1: Mục Đích & Số Tiền Giữ Chỗ</h4>
          <p>
            Bên B (Khách hàng {MOCK_CUSTOMER_PROFILE.fullName}) đồng ý thanh toán số tiền đặt cọc <strong>20.000.000 VNĐ</strong> để bên A (AutoHub Việt Nam) thực hiện khóa độc quyền số khung xe <strong>{deposit.vinNumber}</strong> trong kho xuất xưởng.
          </p>

          <h4 className="text-sm font-bold text-white uppercase">Điều 2: Thời Hạn Hiệu Lực Khóa Xe</h4>
          <p>
            Khoản đặt cọc giữ xe có hiệu lực chính xác trong vòng <strong>72 Giờ</strong> kể từ thời điểm giao dịch VNPay thành công ({deposit.depositTimestamp}). Trong thời gian này, chiếc xe không thể bị bán hay phân bổ cho bất kỳ khách hàng nào khác trên toàn hệ thống đại lý.
          </p>

          <h4 className="text-sm font-bold text-white uppercase">Điều 3: Chính Sách Hoàn Cọc & Chuyển Đổi</h4>
          <p>
            Khách hàng được quyền hủy cọc trực tuyến và nhận lại <strong>100% số tiền đặt cọc (20.000.000 VNĐ)</strong> vào tài khoản ban đầu nếu gửi yêu cầu hoàn trước khi thời hạn 72 giờ kết thúc, không phát sinh bất kỳ khoản phí phạt nào.
          </p>

          <h4 className="text-sm font-bold text-white uppercase">Điều 4: Ký Kết Mua Bán Chính Thức</h4>
          <p>
            Khách hàng và Chuyên viên tư vấn {deposit.consultantName} sẽ tiến hành thủ tục ký kết hợp đồng mua bán xe, đăng ký biển số và bàn giao xe tại Showroom AutoHub Flagship Quận 7.
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
