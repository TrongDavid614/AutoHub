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
    <section className="w-full bg-[#131B2E] border-t border-[#2D3449] py-12 px-4 md:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="space-y-1.5 max-w-xl">
          <div className="text-[10px] font-mono font-bold tracking-[1.5px] text-[#89CEFF] uppercase">
            ĐẶC QUYỀN HẬU MÃI VIP
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#DAE2FD] tracking-tight">
            Cam kết dịch vụ chính hãng AutoHub
          </h2>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commitments.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-[2px] bg-[#171F33] border border-[#2D3449] p-6 shadow-xl space-y-4 hover:border-[#89CEFF]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-[2px] bg-[#2D3449] flex items-center justify-center text-[#89CEFF]">
                    <Icon className="w-6 h-6 text-[#89CEFF]" />
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[#DAE2FD] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#88929B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                <div className="pt-4 border-t border-[#2D3449]/60">
                  <span className="inline-block px-2.5 py-1 rounded-[2px] bg-[#222A3D] text-[#89CEFF] font-mono text-[9px] font-bold tracking-wider uppercase border border-[#2D3449]">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
