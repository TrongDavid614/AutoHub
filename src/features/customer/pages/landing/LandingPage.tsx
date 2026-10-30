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
import { MOCK_CARS } from '@/features/customer/mocks/car.mock';
import { formatCurrencyVND } from '@/lib/utils';
import { Footer } from '@/components/Footer';

export function Scene() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [clickedFeatureId, setClickedFeatureId] = useState<string | null>(null);

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

  // 4 Core Functions (gently displayed with animations, including "Vào Showroom")
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

  // Animated Click Handler (tạo độ trễ ~500ms để hiệu ứng animation bùng sáng và sóng lan tỏa hiển thị rõ ràng, trọn vẹn)
  const handleFeatureClick = (e: React.MouseEvent, to: string, id: string) => {
    e.preventDefault();
    setClickedFeatureId(id);

    // Kích hoạt hiệu ứng animation phản hồi rõ ràng trong 500ms trước khi điều hướng mượt mà
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      navigate(to);
    }, 500);
  };

  const handleGeneralNavigate = (to: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate(to);
  };

  return (
    <div className="relative w-full min-h-screen text-[#DAE2FD] overflow-x-hidden selection:bg-[#0EA5E9] selection:text-white bg-[#05070a]">
      {/* =========================================================================
          NÚT "VÀO SHOWROOM" NGAY PHÍA TRÊN BÊN PHẢI MÀN HÌNH (TOP-RIGHT FLOATING CTA)
      ========================================================================== */}
      <div className="fixed top-6 right-6 lg:right-10 z-40 animate-fade-in">
        <button
          onClick={(e) => handleFeatureClick(e, '/cars', 'top-right-showroom')}
          className={`group relative overflow-hidden flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white text-xs font-bold shadow-[0_0_28px_rgba(14,165,233,0.45)] hover:shadow-[0_0_42px_rgba(14,165,233,0.75)] hover:border-[#89CEFF] border border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            clickedFeatureId === 'top-right-showroom'
              ? 'scale-95 ring-2 ring-[#89CEFF] shadow-[0_0_60px_rgba(137,206,255,0.9)] bg-[#171F33]'
              : ''
          }`}
        >
          {/* Light-sweep effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Shockwave ping when clicked */}
          {clickedFeatureId === 'top-right-showroom' && (
            <div className="absolute inset-0 rounded-full border-2 border-[#89CEFF] animate-ping pointer-events-none" />
          )}

          <span className="w-2 h-2 rounded-full bg-[#89CEFF] animate-pulse" />
          <Car className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className="tracking-wide">Vào Showroom</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/90 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* =========================================================================
          FIXED FULL-PAGE VIDEO BACKGROUND (KÉO DÀI XUYÊN SUỐT TOÀN TRANG)
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
            videoReady ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <source src="/videos/car.mp4" type="video/mp4" />
          <source src="/videos/hero-car.mp4" type="video/mp4" />
          <source src="/car.mp4" type="video/mp4" />
        </video>

        {/* Global Cinematic Dark Vignette & Mesh Gradient (Tông xanh đậm đồng bộ hệ thống) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(to bottom, rgba(5,7,14,0.75) 0%, rgba(5,7,14,0.40) 25%, rgba(11,19,38,0.65) 65%, rgba(5,7,14,0.92) 100%)',
              'radial-gradient(circle at 50% 45%, transparent 25%, rgba(5,7,14,0.70) 100%)',
            ].join(', '),
          }}
        />

        {/* Ambient Cyan / Sky Blue Glow Accent (Thay thế hoàn toàn màu đỏ) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#0EA5E9]/10 rounded-full blur-[170px] pointer-events-none" />
      </div>

      {/* =========================================================================
          HERO SECTION (ĐÃ BỎ HEADER, HIỂN THỊ TINH TẾ & NHẸ NHÀNG)
      ========================================================================== */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center px-6 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center">
          
          {/* Logo Brand Center Badge */}
          <div className="mb-6 flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <Logo size="lg" />
          </div>

          {/* Subtitle Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131B2E]/70 border border-[#3E4850]/50 backdrop-blur-md mb-6 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-[#89CEFF] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#89CEFF] uppercase">
              HỆ SINH THÁI THƯƠNG MẠI Ô TÔ ĐẲNG CẤP
            </span>
          </div>

          {/* Main Title with AutoHub Theme Colors */}
          <h1 className="text-white font-extrabold tracking-tight leading-[1.08] mb-6 text-4xl sm:text-6xl lg:text-7xl max-w-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            Kỷ Nguyên Di Chuyển{' '}
            <span className="bg-gradient-to-r from-white via-[#DAE2FD] to-[#BEC8D2] bg-clip-text text-transparent">
              Thuần Điện
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#89CEFF] via-[#0EA5E9] to-[#0284C7] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(14,165,233,0.4)]">
              Đỉnh Cao Công Nghệ
            </span>
          </h1>

          {/* Clean Description */}
          <p className="text-[#BEC8D2] font-light text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Nền tảng giao dịch và trải nghiệm xe thế hệ mới. Minh bạch chi phí lăn bánh tại 63 tỉnh thành,
            cam kết bảo hộ đặt cọc khóa số VIN 72 giờ và hỗ trợ trực tuyến với AI.
          </p>

          {/* =========================================================================
              4 CHỨC NĂNG HIỂN THỊ NHẸ NHÀNG (KÈM HIỆU ỨNG ANIMATION ĐẬM NÉT, RÕ RÀNG TRONG 500MS)
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
                  className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-500 backdrop-blur-xl border cursor-pointer flex flex-col justify-between ${
                    isClicked
                      ? 'scale-95 border-[#89CEFF] bg-[#171F33] ring-2 ring-[#89CEFF] shadow-[0_0_65px_rgba(137,206,255,0.85)] z-20'
                      : hasAnyClicked
                      ? 'opacity-35 scale-95 blur-[1px] border-white/5 transition-all duration-500'
                      : feat.isPrimary
                      ? 'bg-gradient-to-b from-[#131B2E]/90 to-[#0B1326]/90 border-[#0EA5E9]/60 shadow-[0_8px_30px_rgba(14,165,233,0.25)] hover:border-[#89CEFF] hover:shadow-[0_16px_40px_rgba(14,165,233,0.45)] hover:-translate-y-2 active:scale-95'
                      : 'bg-[#0B1326]/60 hover:bg-[#131B2E]/80 border-white/10 hover:border-[#89CEFF]/60 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_rgba(14,165,233,0.2)] hover:-translate-y-2 active:scale-95'
                  }`}
                >
                  {/* Subtle Light-Sweep Animation Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Expanding Click Wave Ring on Active (Kéo dài và rõ ràng hơn) */}
                  {isClicked && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-[#89CEFF] animate-ping pointer-events-none duration-700" />
                  )}

                  <div>
                    {/* Tag & Icon Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full transition-colors duration-300 ${
                          feat.isPrimary || isClicked
                            ? 'bg-[#0EA5E9]/20 text-[#89CEFF] border border-[#0EA5E9]/30'
                            : 'bg-white/5 text-[#88929B] border border-white/10 group-hover:text-[#89CEFF]'
                        }`}
                      >
                        {feat.tag}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          isClicked
                            ? 'scale-125 bg-[#89CEFF] text-[#00344D] rotate-12 shadow-lg shadow-[#89CEFF]/50'
                            : feat.isPrimary
                            ? 'bg-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/40 group-hover:scale-110'
                            : 'bg-[#171F33] text-[#89CEFF] border border-[#3E4850]/50 group-hover:bg-[#0EA5E9] group-hover:text-white group-hover:scale-110'
                        }`}
                      >
                        <IconComp className="w-4 h-4 transition-transform duration-500 group-hover:rotate-6" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-base font-bold mb-1.5 transition-colors duration-300 ${
                      isClicked ? 'text-[#89CEFF]' : 'text-white group-hover:text-[#89CEFF]'
                    }`}>
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#BEC8D2] leading-relaxed line-clamp-2">
                      {feat.subtitle}
                    </p>
                  </div>

                  {/* Action Link Arrow with Bounce Transition */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold w-full">
                    <span
                      className={
                        feat.isPrimary || isClicked
                          ? 'text-[#89CEFF]'
                          : 'text-[#88929B] group-hover:text-[#89CEFF]'
                      }
                    >
                      {feat.isPrimary ? 'Khám phá ngay' : 'Truy cập'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-[#89CEFF] transition-transform duration-300 ${
                      isClicked ? 'translate-x-2 scale-125' : 'group-hover:translate-x-1.5'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Indicator Below 4 Functions */}
          <div className="mt-8 flex items-center gap-6 text-xs text-[#88929B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#89CEFF]" />
              <span>Bảo hộ cọc số VIN 72H</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#89CEFF]" />
              <span>Hạ tầng SiC 800V siêu nạp</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Xe giao tận cửa toàn quốc</span>
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BỘ 3 TRỤ CỘT ĐỘT PHÁ CỦA AUTOHUB (CHỈ MÔ TẢ, KHÔNG GẮN LINK SAI)
      ========================================================================== */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-[#89CEFF] text-xs font-semibold mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#89CEFF]" />
            <span>KỸ NGHỆ THƯƠNG MẠI SỐ 4.0</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Đột Phá Trải Nghiệm Mua Xe Trực Tuyến
          </h2>
          <p className="text-[#BEC8D2] text-sm sm:text-base leading-relaxed">
            AutoHub giải quyết triệt để sự mập mờ về giá thành và quy trình mua bán truyền thống bằng các công cụ tính toán tự động và bảo chứng số.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trụ cột 1: Dự toán chi phí lăn bánh (Chỉ mô tả công nghệ tính toán) */}
          <div className="p-8 rounded-2xl bg-[#0B1326]/60 backdrop-blur-xl border border-white/10 hover:border-[#89CEFF]/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 flex items-center justify-center text-[#89CEFF] mb-6 group-hover:scale-110 transition-transform">
              <Calculator className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#89CEFF] transition-colors">
              Dự Toán Lăn Bánh 63 Tỉnh Thành
            </h3>
            <p className="text-[#BEC8D2] text-sm leading-relaxed mb-4">
              Hệ thống thuật toán cập nhật theo biểu thuế trước bạ, phí cấp biển số, phí bảo trì đường bộ và bảo hiểm dân sự của từng địa phương, chuẩn xác từng đồng.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#89CEFF] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tích hợp trực tiếp trong từng dòng xe</span>
            </div>
          </div>

          {/* Trụ cột 2: Bàn Cân So Sánh */}
          <div className="p-8 rounded-2xl bg-[#0B1326]/60 backdrop-blur-xl border border-white/10 hover:border-[#89CEFF]/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 flex items-center justify-center text-[#89CEFF] mb-6 group-hover:scale-110 transition-transform">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#89CEFF] transition-colors">
              Bàn Cân So Sánh Showdown Matrix
            </h3>
            <p className="text-[#BEC8D2] text-sm leading-relaxed mb-4">
              Đặt tối đa 3 xe lên bàn cân để so sánh hơn 40 thông số kỹ thuật, gia tốc, pin, công nghệ lái tự động HubPilot và trang bị tiện nghi.
            </p>
            <button
              onClick={() => handleGeneralNavigate('/car-comparison')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#89CEFF] hover:text-white transition-colors cursor-pointer"
            >
              <span>Vào bàn cân so sánh</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trụ cột 3: AI Consultant */}
          <div className="p-8 rounded-2xl bg-[#0B1326]/60 backdrop-blur-xl border border-white/10 hover:border-[#89CEFF]/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 flex items-center justify-center text-[#89CEFF] mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#89CEFF] transition-colors">
              Trợ Lý Ảo AI Độc Bản
            </h3>
            <p className="text-[#BEC8D2] text-sm leading-relaxed mb-4">
              AI am hiểu sâu sắc hệ sinh thái ô tô, gợi ý phiên bản xe phù hợp với ngân sách gia đình, phong thủy bản mệnh và tư vấn phụ kiện đồng bộ.
            </p>
            <button
              onClick={() => handleGeneralNavigate('/ai-consultant')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#89CEFF] hover:text-white transition-colors cursor-pointer"
            >
              <span>Trò chuyện cùng AI ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BỘ SƯU TẬP XE TIÊU BIỂU (SHOWROOM SHOWCASE - CYAN THEME)
      ========================================================================== */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-[#89CEFF] text-xs font-semibold mb-2 backdrop-blur-md">
              <Car className="w-3.5 h-3.5" />
              <span>BỘ SƯU TẬP SỐ 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Dòng Xe Nổi Bật Tại AutoHub
            </h2>
          </div>
          <button
            onClick={() => handleGeneralNavigate('/cars')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-all group shadow-lg shadow-[#0EA5E9]/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Xem tất cả danh mục xe</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CARS.slice(0, 3).map((car) => (
            <div
              key={car.id}
              className="group bg-[#0B1326]/65 backdrop-blur-xl border border-white/10 hover:border-[#89CEFF]/60 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Vehicle Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-bold text-[#89CEFF]">
                    {car.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                    {car.acceleration} (0-100)
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  <div className="text-xs text-[#88929B] font-semibold mb-1 uppercase tracking-wider">
                    {car.segment}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#89CEFF] transition-colors">
                    {car.name}
                  </h3>

                  {/* Specs Quick Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-white/10 mb-4 text-[#DAE2FD]">
                    <div>
                      <span className="text-[#88929B] block text-[10px]">CÔNG SUẤT:</span>
                      <span className="font-semibold text-white">{car.power.split('(')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[#88929B] block text-[10px]">TẦM VẬN HÀNH:</span>
                      <span className="font-semibold text-white">{car.range.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-[#88929B] text-[11px] block">Giá niêm yết chính hãng:</span>
                    <span className="text-xl font-extrabold text-white font-mono">
                      {formatCurrencyVND(car.listedPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleGeneralNavigate(`/cars/${car.id}`)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-[#89CEFF] text-xs font-semibold text-center text-[#DAE2FD] hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() => handleGeneralNavigate(`/deposit/${car.id}`)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold text-center shadow-lg shadow-[#0EA5E9]/30 hover:shadow-[#0EA5E9]/50 transition-all active:scale-95 cursor-pointer"
                >
                  Đặt Cọc 72H
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: QUY TRÌNH 4 BƯỚC SỞ HỮU XE KHÉP KÍN (CHỈ MÔ TẢ)
      ========================================================================== */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>QUY TRÌNH THUẦN TIỆN & MINH BẠCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Sở Hữu Xe Trong 4 Bước Số Hóa
          </h2>
          <p className="text-[#BEC8D2] text-sm sm:text-base">
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
              className="p-6 rounded-2xl bg-[#0B1326]/60 backdrop-blur-xl border border-white/10 relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all"
            >
              <span className="text-4xl font-black text-white/10 font-mono absolute top-4 right-4 select-none">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#171F33] border border-[#3E4850]/50 flex items-center justify-center text-[#89CEFF] mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-[#BEC8D2] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BANNER KÊU GỌI HÀNH ĐỘNG (FINAL CALL TO ACTION - CYAN THEME)
      ========================================================================== */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-black/75 via-[#0B1326]/85 to-black/75 backdrop-blur-2xl border border-white/15 p-8 sm:p-14 text-center shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Sẵn Sàng Trải Nghiệm Khác Biệt Cùng AutoHub?
            </h2>
            <p className="text-[#BEC8D2] text-sm sm:text-base leading-relaxed mb-8">
              Khám phá hàng loạt mẫu siêu xe, sedan thể thao và SUV sang trọng đã sẵn sàng tại kho showroom toàn quốc.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleGeneralNavigate('/cars')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white text-sm font-bold shadow-xl shadow-[#0EA5E9]/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Khám Phá Showroom Ngay
              </button>
              <button
                onClick={() => handleGeneralNavigate('/ai-consultant')}
                className="px-8 py-3.5 rounded-xl bg-[#171F33] hover:bg-[#222A3D] text-[#89CEFF] text-sm font-semibold border border-[#3E4850]/60 transition-all backdrop-blur-md active:scale-95 hover:border-[#89CEFF] cursor-pointer"
              >
                Trò Chuyện Cùng AI Tư Vấn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FOOTER (GLASSMORPHISM OVER VIDEO)
      ========================================================================== */}
      <div className="relative z-10">
        <Footer className="bg-black/75 backdrop-blur-2xl border-t border-white/10" />
      </div>
    </div>
  );
}

export const LandingPage = Scene;
export default Scene;
