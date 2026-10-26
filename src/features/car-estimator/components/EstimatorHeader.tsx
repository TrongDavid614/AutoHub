import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const EstimatorHeader: React.FC = () => {
  return (
    <div className="space-y-4 pb-2 border-b border-surface-highlight/40">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-text-muted">
        <Link
          to="/"
          className="text-text-secondary hover:text-accent-primary transition-colors font-medium uppercase tracking-wider"
        >
          TRANG CHỦ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
        <Link
          to="/cars"
          className="text-text-secondary hover:text-accent-primary transition-colors font-medium uppercase tracking-wider"
        >
          DÒNG XE GT-E
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
        <span className="text-accent-primary font-bold uppercase tracking-wider">
          DỰ TOÁN CHI PHÍ LĂN BÁNH
        </span>
      </nav>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-text-primary tracking-tight leading-tight">
          Dự Toán Chi Phí Lăn Bánh Ô Tô Điện
          <br className="hidden sm:inline" /> AutoHub
        </h1>
        <p className="text-sm sm:text-[15px] text-text-secondary max-w-3xl leading-relaxed">
          Minh bạch mọi khoản thuế, phí trước bạ, bảo hiểm bắt buộc và các chương trình ưu đãi độc quyền dành cho khách hàng AutoHub.
        </p>
      </div>
    </div>
  );
};
