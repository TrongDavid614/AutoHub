import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Zap, Headphones, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn('bg-[#060E20] border-t border-[#3E4850]/40 text-[#BEC8D2] pt-12 pb-8', className)}>
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Main 4-Column Grid matching Figma Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Vision */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-[13px] text-[#BEC8D2] leading-[22px]">
              Hệ sinh thái di chuyển thuần điện hạng sang bậc nhất. Trải nghiệm dịch vụ cá nhân hóa chuẩn phi hành đoàn và kỹ nghệ kiến trúc tương lai.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#171F33] border border-[#3E4850]/50 text-xs text-[#89CEFF]">
              <Zap className="w-3.5 h-3.5 text-[#89CEFF]" />
              <span>Nền Tảng Giao Dịch Số 4.0</span>
            </div>
          </div>

          {/* Column 2: Showroom Network */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-[#88929B] tracking-[1.5px] uppercase">
              HỆ THỐNG SHOWROOM
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#89CEFF] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Landmark Showroom:</strong>
                  <span className="text-[#88929B]">Tầng G, Tháp Thủ Thiêm, TP. Thủ Đức, TP. HCM</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#89CEFF] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Metropolis Center:</strong>
                  <span className="text-[#88929B]">29 Liễu Giai, Ba Đình, Hà Nội</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#89CEFF] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Riverside Studio:</strong>
                  <span className="text-[#88929B]">88 Bạch Đằng, Hải Châu, Đà Nẵng</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Warranty & Support */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-[#88929B] tracking-[1.5px] uppercase">
              BẢO HÀNH & HỖ TRỢ
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link to="#" className="hover:text-[#89CEFF] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#89CEFF]" />
                  <span>Chính sách bảo hành pin 10 năm</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#89CEFF] transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#89CEFF]" />
                  <span>Mạng lưới trạm sạc siêu tốc Supercharge</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#89CEFF] transition-colors flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-[#89CEFF]" />
                  <span>Dịch vụ cứu hộ cơ động 24/7 Mobile Service</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#89CEFF] transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#89CEFF]" />
                  <span>Cập nhật phần mềm AutoOS từ xa (OTA)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: VIP Concierge Center */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-[#88929B] tracking-[1.5px] uppercase">
              TRUNG TÂM LIÊN HỆ VIP
            </h4>
            <div className="p-4 rounded-[4px] bg-[#171F33] border border-[#3E4850]/60 space-y-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#89CEFF] uppercase tracking-wider block">
                  ĐƯỜNG DÂY NÓNG ƯU TIÊN
                </span>
                <a
                  href="tel:18008899"
                  className="text-xl font-bold font-mono text-white hover:text-[#89CEFF] transition-colors flex items-center gap-2 mt-0.5"
                >
                  <Phone className="w-4 h-4 text-[#89CEFF]" />
                  <span>1800 8899</span>
                </a>
              </div>

              <div className="pt-2 border-t border-[#3E4850]/50">
                <span className="font-mono text-[10px] text-[#88929B] block">EMAIL TIẾP NHẬN:</span>
                <a
                  href="mailto:vip-concierge@autohub.vn"
                  className="text-xs text-[#BEC8D2] hover:text-[#89CEFF] transition-colors flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#89CEFF]" />
                  <span>vip-concierge@autohub.vn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 border-t border-[#3E4850]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#88929B]">
          <p>© 2026 AutoHub Vietnam Co., Ltd. Tất cả quyền được bảo lưu. (Nhóm 7 - DHKTPM19ATT - IUH)</p>
          <div className="flex flex-wrap gap-6">
            <Link to="#" className="hover:text-[#DAE2FD] transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link to="#" className="hover:text-[#DAE2FD] transition-colors">
              Chính sách bảo mật EV
            </Link>
            <Link to="#" className="hover:text-[#DAE2FD] transition-colors">
              Chứng nhận an toàn số
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
