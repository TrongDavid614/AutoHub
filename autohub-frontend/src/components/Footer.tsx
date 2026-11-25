import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'bg-[var(--surface-subtle)] border-t border-[var(--line)] text-[var(--text-secondary)] pt-12 pb-8',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-3">
            <Logo size="md" />
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Sàn giao dịch ô tô điện, xe hybrid và phụ kiện chính hãng. Minh bạch chi phí lăn bánh và chính sách giữ chỗ 72 giờ.
            </p>
          </div>

          {/* Column 2: Showroom Network */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text)]">Hệ thống showroom</h4>
            <ul className="space-y-2.5 text-[13px] text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[var(--text)] block">TP. Hồ Chí Minh</span>
                  <span className="text-[var(--text-muted)]">Tầng G, Tháp Thủ Thiêm, TP. Thủ Đức</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[var(--text)] block">Hà Nội</span>
                  <span className="text-[var(--text-muted)]">29 Liễu Giai, Ba Đình</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[var(--text)] block">Đà Nẵng</span>
                  <span className="text-[var(--text-muted)]">88 Bạch Đằng, Hải Châu</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text)]">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link to="/cars" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Danh mục xe sẵn sàng giao
                </Link>
              </li>
              <li>
                <Link to="/car-estimator" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Dự toán chi phí lăn bánh
                </Link>
              </li>
              <li>
                <Link to="/test-drive" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Đăng ký lái thử tại showroom
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Phụ kiện & trạm sạc gia đình
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text)]">Liên hệ tư vấn</h4>
            <div className="space-y-2.5 text-[13px]">
              <p className="text-[var(--text-muted)]">Tổng đài hỗ trợ (08:00 – 21:00 hằng ngày)</p>
              <a
                href="tel:19008888"
                className="flex items-center gap-2 text-base font-semibold text-[var(--text)] hover:text-[var(--accent)] tabular-nums transition-colors"
              >
                <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                <span>1900 8888</span>
              </a>
              <a
                href="mailto:hotro@autohub.vn"
                className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                <span>hotro@autohub.vn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[var(--text-muted)]">
          <p>© 2026 AutoHub Vietnam. Nhóm 7 – DHKTPM19ATT – IUH.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/cars" className="hover:text-[var(--text)] transition-colors">
              Điều khoản đặt cọc 72 giờ
            </Link>
            <Link to="/accessories" className="hover:text-[var(--text)] transition-colors">
              Chính sách bảo hành
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
