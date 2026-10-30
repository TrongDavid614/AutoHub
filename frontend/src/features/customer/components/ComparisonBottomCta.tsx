import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, Bot, Calendar } from 'lucide-react';

interface ComparisonBottomCtaProps {
  onOpenTestDriveModal: () => void;
}

export const ComparisonBottomCta: React.FC<ComparisonBottomCtaProps> = ({
  onOpenTestDriveModal,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-surface-container via-surface-elevated to-surface-container border border-surface-highlight shadow-xl space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Vẫn Còn Phân Vân Giữa Các Phiên Bản?
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Mỗi cấu hình AutoHub GT-e đều mang DNA thuần điện đỉnh cao. Hãy để chuyên viên kỹ thuật của chúng tôi đồng hành cùng bạn trên cung đường trải nghiệm thực tế.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href="tel:19008888"
          className="w-full sm:w-auto py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-accent-primary" />
          <span>Hotline VIP: 1900 8888</span>
        </a>

        <button
          type="button"
          onClick={() => navigate('/cars')}
          className="w-full sm:w-auto py-3 px-5 rounded-lg bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Bot className="w-4 h-4 text-accent-primary" />
          <span>Chat với Trợ lý AI AutoHub</span>
        </button>

        <button
          type="button"
          onClick={onOpenTestDriveModal}
          className="w-full sm:w-auto py-3 px-6 rounded-lg bg-accent-action hover:bg-accent-primary text-accent-contrast font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_30px_rgba(137,206,255,0.5)] transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-accent-contrast" />
          <span>Đăng ký lái thử cả 3 bản xe</span>
        </button>
      </div>
    </div>
  );
};
