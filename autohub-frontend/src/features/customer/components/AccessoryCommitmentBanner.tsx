import React from 'react';
import { Truck, ShieldCheck, Zap } from 'lucide-react';

export const AccessoryCommitmentBanner: React.FC = () => {
  const commitments = [
    {
      id: 1,
      icon: Truck,
      title: 'Lắp đặt tận nhà miễn phí',
      description:
        'Đội ngũ kỹ thuật viên cơ động Mobile Service trực tiếp đến tư gia hoặc văn phòng hoàn thiện lắp ráp trong vòng 24 giờ.',
      tag: 'ÁP DỤNG TOÀN QUỐC',
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: 'Bảo hành chính hãng 1 đổi 1 trong 3 năm',
      description:
        'Cam kết thay mới tức thì linh kiện phần cứng hoặc phụ kiện gặp bất kỳ lỗi kỹ thuật nào từ nhà máy sản xuất.',
      tag: 'OEM SPEC WARRANTY',
    },
    {
      id: 3,
      icon: Zap,
      title: 'Miễn phí kiểm tra hệ thống điện an toàn',
      description:
        'Đo đạc trở kháng đường dây, kiểm tra rò rỉ dòng điện cao áp và cân bằng tải điện lưới trước khi kích hoạt thiết bị sạc.',
      tag: 'TIÊU CHUẨN IEC-61851 EV',
    },
  ];

  return (
    <section className="w-full bg-[var(--surface-subtle)] border-t border-[var(--line)] py-12 px-4 md:px-8 mt-14">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-1 max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text)] tracking-tight">
            Cam kết dịch vụ chính hãng AutoHub
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Hỗ trợ lắp đặt tại nhà, bảo hành đổi mới và đảm bảo điều kiện bảo hành xe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commitments.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-[var(--text)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] text-xs font-medium text-[var(--text-muted)]">
                  {item.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
