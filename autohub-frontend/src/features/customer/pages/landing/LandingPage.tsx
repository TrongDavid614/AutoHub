import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  ChevronRight,
  Sparkles,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Package,
  Cpu,
  Calculator,
  Compass,
  FileCheck2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { carService } from '@/features/customer/services/car.service';
import type { MockCar } from '@/features/customer/mocks/car.mock';
import { formatCurrencyVND } from '@/lib/utils';

export function Scene() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [clickedFeatureId, setClickedFeatureId] = useState<string | null>(null);
  const [featuredCars, setFeaturedCars] = useState<MockCar[]>([]);

  useEffect(() => {
    let isMounted = true;
    carService.getAllCars().then((data) => {
      if (isMounted && data) {
        setFeaturedCars(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Video Autoplay and tab focus watchdog
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    playVideo();
    video.addEventListener('canplay', () => setVideoReady(true));
    video.addEventListener('loadeddata', () => setVideoReady(true));
    window.addEventListener('focus', playVideo);

    return () => {
      window.removeEventListener('focus', playVideo);
    };
  }, []);

  // 4 Core Functions
  const primaryFeatures = [
    {
      id: 'showroom',
      title: 'Vào Showroom',
      subtitle: 'Khám phá hơn 20 mẫu xe thuần điện & siêu sang thế hệ mới',
      tag: 'BỘ SƯU TẬP 2025',
      to: '/cars',
      icon: Car,
      isPrimary: true,
    },
    {
      id: 'comparison',
      title: 'Bàn Cân So Sánh',
      subtitle: 'Đối đầu trực quan thông số, công suất, pin và trang bị xe',
      tag: 'SHOWDOWN MATRIX',
      to: '/car-comparison',
      icon: Scale,
      isPrimary: false,
    },
    {
      id: 'ai-consultant',
      title: 'Trợ Lý Ảo AI',
      subtitle: 'Tư vấn phiên bản xe theo tài chính, nhu cầu và phong thủy',
      tag: 'AI THẾ HỆ MỚI',
      to: '/ai-consultant',
      icon: Sparkles,
      isPrimary: false,
    },
    {
      id: 'accessories',
      title: 'Phụ Kiện Chính Hãng',
      subtitle: 'Trạm sạc tại gia, mâm rèn thể thao và gói nội thất cao cấp',
      tag: 'GENUINE PARTS',
      to: '/accessories',
      icon: Package,
      isPrimary: false,
    },
  ];

  // Animated Click Handler (tạo độ trễ ~400ms để hiệu ứng animation phản hồi rõ ràng trước khi điều hướng)
  const handleFeatureClick = (e: React.MouseEvent, to: string, id: string) => {
    e.preventDefault();
    setClickedFeatureId(id);

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      navigate(to);
    }, 400);
  };

  const handleGeneralNavigate = (to: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate(to);
  };

  return (
    <div className="relative w-full min-h-screen text-[var(--text)] overflow-x-hidden selection:bg-[var(--accent)] selection:text-white bg-[var(--bg)] flex flex-col">
      {/* =========================================================================
          NÚT "VÀO SHOWROOM" GÓC TRÊN BÊN PHẢI (FLOATING TOP-RIGHT CTA)
      ========================================================================== */}
      <div className="fixed top-6 right-6 lg:right-10 z-40 animate-fade-in">
        <button
          onClick={(e) => handleFeatureClick(e, '/cars', 'top-right-showroom')}
          className={`group relative overflow-hidden flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-sky-700 text-white text-xs font-bold shadow-md hover:shadow-lg border border-sky-400/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            clickedFeatureId === 'top-right-showroom'
              ? 'scale-95 ring-2 ring-[var(--accent)] shadow-xl bg-sky-800'
              : ''
          }`}
        >
          {/* Light-sweep effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Shockwave ping when clicked */}
          {clickedFeatureId === 'top-right-showroom' && (
            <div className="absolute inset-0 rounded-full border-2 border-sky-300 animate-ping pointer-events-none" />
          )}

          <span className="w-2 h-2 rounded-full bg-sky-200 animate-pulse" />
          <Car className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className="tracking-wide">Vào Showroom</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/90 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* =========================================================================
          FIXED FULL-PAGE VIDEO BACKGROUND (LUMINOUS LUXURY STUDIO OVERLAY)
      ========================================================================== */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? 'opacity-85 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <source src="/videos/car.mp4" type="video/mp4" />
          <source src="/videos/hero-car.mp4" type="video/mp4" />
          <source src="/car.mp4" type="video/mp4" />
        </video>

        {/* Luminous Studio Gradient (Chuyển sang nền sáng sang trọng, tôn xe) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(to bottom, rgba(248,250,252,0.85) 0%, rgba(248,250,252,0.50) 25%, rgba(241,245,249,0.88) 70%, var(--bg) 100%)',
              'radial-gradient(circle at 50% 40%, transparent 20%, rgba(248,250,252,0.75) 100%)',
            ].join(', '),
          }}
        />

        {/* Subtle Ambient Sky Accent Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-sky-400/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* =========================================================================
          HERO SECTION (TƯƠI SÁNG, TINH TẾ & CAO CẤP)
      ========================================================================== */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center">
          
          {/* Logo Brand Center Badge */}
          <div className="mb-5 flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <Logo size="lg" />
          </div>

          {/* Subtitle Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-sky-200/90 shadow-sm mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase font-mono">
              HỆ SINH THÁI THƯƠNG MẠI Ô TÔ ĐẲNG CẤP
            </span>
          </div>

          {/* Main Title with Clean Dark Typography & Blue Gradients */}
          <h1 className="text-[var(--text)] font-extrabold tracking-tight leading-[1.1] mb-5 text-4xl sm:text-6xl lg:text-7xl max-w-4xl">
            Kỷ Nguyên Di Chuyển{' '}
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              Thuần Điện
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Đỉnh Cao Công Nghệ
            </span>
          </h1>

          {/* Clean Description */}
          <p className="text-[var(--text-secondary)] font-normal text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Nền tảng giao dịch và trải nghiệm xe thế hệ mới. Minh bạch chi phí lăn bánh tại 63 tỉnh thành,
            cam kết bảo hộ đặt cọc khóa số VIN 72 giờ và hỗ trợ tư vấn thông minh cùng AI.
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={() => handleGeneralNavigate('/cars')}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--accent)] hover:bg-sky-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Car className="w-4 h-4" />
              <span>Khám Phá Showroom</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleGeneralNavigate('/car-comparison')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--surface)] hover:bg-slate-50 text-[var(--text)] border border-[var(--line)] text-sm font-semibold shadow-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Scale className="w-4 h-4 text-[var(--accent)]" />
              <span>Bàn Cân So Sánh</span>
            </button>
            <button
              onClick={() => handleGeneralNavigate('/ai-consultant')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[var(--accent)] border border-sky-200/80 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trợ Lý Ảo AI</span>
            </button>
          </div>

          {/* =========================================================================
              4 CHỨC NĂNG CỐT LÕI (CARDS MÀU SÁNG, BO GÓC MỀM MẠI, ĐỒNG BỘ DESIGN SYSTEM)
          ========================================================================== */}
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {primaryFeatures.map((feat) => {
              const IconComp = feat.icon;
              const isClicked = clickedFeatureId === feat.id;
              const hasAnyClicked = clickedFeatureId !== null;

              return (
                <button
                  key={feat.id}
                  onClick={(e) => handleFeatureClick(e, feat.to, feat.id)}
                  className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 backdrop-blur-md cursor-pointer flex flex-col justify-between ${
                    isClicked
                      ? 'scale-95 border-[var(--accent)] bg-sky-50/90 ring-2 ring-[var(--accent)] shadow-md z-20'
                      : hasAnyClicked
                      ? 'opacity-40 scale-98 border-[var(--line)] bg-[var(--surface)]'
                      : feat.isPrimary
                      ? 'bg-gradient-to-b from-sky-50/90 via-white to-white border-2 border-[var(--accent)] shadow-sm hover:shadow-lg hover:border-sky-600 hover:-translate-y-1.5 active:scale-95'
                      : 'bg-[var(--surface)]/95 hover:bg-white border border-[var(--line)] hover:border-sky-300 shadow-sm hover:shadow-lg hover:-translate-y-1.5 active:scale-95'
                  }`}
                >
                  <div>
                    {/* Tag & Icon Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full transition-colors duration-200 ${
                          feat.isPrimary || isClicked
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-sky-50 group-hover:text-sky-700 group-hover:border-sky-200'
                        }`}
                      >
                        {feat.tag}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isClicked
                            ? 'scale-110 bg-[var(--accent)] text-white shadow-sm'
                            : feat.isPrimary
                            ? 'bg-[var(--accent)] text-white shadow-sm group-hover:scale-105'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] group-hover:scale-105'
                        }`}
                      >
                        <IconComp className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-base font-bold mb-1.5 transition-colors duration-200 ${
                      isClicked ? 'text-[var(--accent)]' : 'text-[var(--text)] group-hover:text-[var(--accent)]'
                    }`}>
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {feat.subtitle}
                    </p>
                  </div>

                  {/* Action Link Arrow */}
                  <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-semibold w-full">
                    <span
                      className={
                        feat.isPrimary || isClicked
                          ? 'text-[var(--accent)] font-bold'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--accent)]'
                      }
                    >
                      {feat.isPrimary ? 'Khám phá ngay' : 'Truy cập'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 ${
                      isClicked ? 'translate-x-1.5' : 'group-hover:translate-x-1'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Indicator Below 4 Functions */}
          <div className="mt-8 flex items-center gap-6 text-xs text-[var(--text-secondary)] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
              <span>Bảo hộ cọc số VIN 72H</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[var(--accent)]" />
              <span>Hạ tầng SiC 800V siêu nạp</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Xe giao tận cửa toàn quốc</span>
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BỘ SƯU TẬP XE TIÊU BIỂU (SHOWROOM SHOWCASE - LIGHT CARDS)
      ========================================================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[var(--line)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold mb-2">
              <Car className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>BỘ SƯU TẬP SỐ 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)]">
              Dòng Xe Nổi Bật Tại AutoHub
            </h2>
          </div>
          <button
            onClick={() => handleGeneralNavigate('/cars')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <span>Xem tất cả danh mục xe</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.slice(0, 3).map((car) => (
            <div
              key={car.id}
              className="group bg-[var(--surface)] border border-[var(--line)] hover:border-sky-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Vehicle Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] font-bold text-[var(--text)] shadow-sm">
                    {car.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
                    {car.acceleration} (0-100)
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  <div className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider">
                    {car.segment}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                    {car.name}
                  </h3>

                  {/* Specs Quick Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 px-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)] mb-4 text-[var(--text-secondary)]">
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase font-medium">CÔNG SUẤT:</span>
                      <span className="font-semibold text-[var(--text)]">{car.power.split('(')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase font-medium">TẦM VẬN HÀNH:</span>
                      <span className="font-semibold text-[var(--text)]">{car.range.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-[var(--text-muted)] text-[11px] block">Giá niêm yết chính hãng:</span>
                    <span className="text-xl font-extrabold text-[var(--text)] font-mono">
                      {formatCurrencyVND(car.listedPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleGeneralNavigate(`/cars/${car.id}`)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--surface-subtle)] hover:bg-slate-200 border border-[var(--line)] text-xs font-semibold text-center text-[var(--text)] hover:text-[var(--accent)] transition-all active:scale-95 cursor-pointer"
                >
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() => handleGeneralNavigate(`/deposit/${car.id}`)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--accent)] hover:bg-sky-700 text-white text-xs font-bold text-center shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
                >
                  Đặt Cọc 72H
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: QUY TRÌNH 4 BƯỚC SỞ HỮU XE KHÉP KÍN (LIGHT THEME)
      ========================================================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-[var(--line)]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>QUY TRÌNH THUẦN TIỆN & MINH BẠCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] mb-3">
            Sở Hữu Xe Trong 4 Bước Số Hóa
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            Tiết kiệm tối đa thời gian. Từ khâu tư vấn, chọn xe cho đến lúc nhận bàn giao chìa khóa tại nhà.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Cấu Hình & Dự Toán',
              desc: 'Tùy biến màu xe, mâm xe, nội thất và xem chi tiết dự toán chi phí lăn bánh chính xác theo từng tỉnh thành.',
              icon: Calculator,
            },
            {
              step: '02',
              title: 'Đặt Cọc Khóa Số VIN',
              desc: 'Đặt cọc an toàn trực tuyến qua cổng bảo mật. Cam kết giữ xe và số VIN duy nhất trong 72 giờ.',
              icon: FileCheck2,
            },
            {
              step: '03',
              title: 'Lái Thử Tận Nơi',
              desc: 'Chuyên viên lái xe của AutoHub đưa xe tới tận nhà hoặc đón bạn trải nghiệm tại Showroom tiêu chuẩn.',
              icon: Compass,
            },
            {
              step: '04',
              title: 'Bàn Giao & Bảo Hành',
              desc: 'Ký kết hợp đồng điện tử minh bạch, bàn giao xe tận cửa kèm gói bảo hành và bảo hiểm độc quyền.',
              icon: ShieldCheck,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] relative shadow-sm hover:shadow-md hover:border-sky-300 hover:-translate-y-1 transition-all"
            >
              <span className="text-4xl font-black text-slate-200 font-mono absolute top-4 right-4 select-none">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[var(--accent)] mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text)] mb-2">{item.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BANNER KÊU GỌI HÀNH ĐỘNG (FINAL CALL TO ACTION - LIGHT ELEGANT)
      ========================================================================== */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50/80 border border-sky-200/80 p-8 sm:p-14 text-center shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] mb-4">
              Sẵn Sàng Trải Nghiệm Khác Biệt Cùng AutoHub?
            </h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-8">
              Khám phá hàng loạt mẫu siêu xe, sedan thể thao và SUV sang trọng đã sẵn sàng tại kho showroom toàn quốc.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleGeneralNavigate('/cars')}
                className="px-8 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-sky-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Khám Phá Showroom Ngay
              </button>
              <button
                onClick={() => handleGeneralNavigate('/ai-consultant')}
                className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[var(--accent)] text-sm font-semibold border border-sky-200 shadow-sm hover:border-[var(--accent)] transition-all active:scale-95 cursor-pointer"
              >
                Trò Chuyện Cùng AI Tư Vấn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FOOTER (GIAO DIỆN SÁNG ĐỒNG NHẤT VỚI CÁC TRANG CUSTOMER)
      ========================================================================== */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export const LandingPage = Scene;
export default Scene;
