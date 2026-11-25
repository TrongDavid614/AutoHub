import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  ChevronRight,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Package,
  Calculator,
  Compass,
  FileCheck2,
  MessageSquare,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { carService } from '@/features/customer/services/car.service';
import type { MockCar } from '@/features/customer/mocks/car.mock';
import { formatCurrencyVND } from '@/lib/utils';
import { Footer } from '@/components/Footer';

export function Scene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
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

  const quickTools = [
    {
      id: 'showroom',
      title: 'Showroom xe sẵn giao',
      subtitle: 'Thông số kỹ thuật, giá niêm yết và đặt cọc giữ xe 72 giờ.',
      to: '/cars',
      icon: Car,
    },
    {
      id: 'estimator',
      title: 'Dự toán lăn bánh',
      subtitle: 'Tính thuế trước bạ, biển số và chi phí theo từng tỉnh thành.',
      to: '/car-estimator',
      icon: Calculator,
    },
    {
      id: 'comparison',
      title: 'So sánh đối đầu',
      subtitle: 'Đặt tối đa 3 phiên bản lên bàn cân để xem khác biệt thông số.',
      to: '/car-comparison',
      icon: Scale,
    },
    {
      id: 'accessories',
      title: 'Phụ kiện chính hãng',
      subtitle: 'Bộ sạc, camera, thảm sàn tương thích theo từng dòng xe.',
      to: '/accessories',
      icon: Package,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Chọn phiên bản & dự toán',
      desc: 'Xem giá niêm yết, chọn màu ngoại thất và tính chi phí lăn bánh theo địa phương.',
      icon: Calculator,
    },
    {
      step: '02',
      title: 'Đặt cọc giữ xe 72 giờ',
      desc: 'Thanh toán đặt cọc trực tuyến minh bạch, hoàn 100% nếu thay đổi quyết định trong 72h.',
      icon: FileCheck2,
    },
    {
      step: '03',
      title: 'Lái thử tận nơi',
      desc: 'Đặt lịch trải nghiệm xe tại showroom hoặc tại địa chỉ nhà theo khung giờ chọn trước.',
      icon: Compass,
    },
    {
      step: '04',
      title: 'Bàn giao & bảo hành',
      desc: 'Gán số khung VIN, hoàn tất hợp đồng mua bán và bàn giao kèm chế độ bảo hành hãng.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      {/* Top Navigation Overlay inside Hero */}
      <header className="relative bg-[#111318] text-white overflow-hidden">
        {/* Background Media Stage (fallback clean photo + optional video) */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/cars/gte-grand-touring.jpg"
            alt="AutoHub Showroom"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoReady ? 'opacity-65' : 'opacity-0'
            }`}
          >
            <source src="/videos/car.mp4" type="video/mp4" />
            <source src="/videos/hero-car.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
        </div>

        {/* Clean Top Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-white/15">
          <Link to="/" className="shrink-0">
            <Logo size="md" tone="inverse" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/85">
            <Link to="/cars" className="hover:text-white transition-colors">
              Dòng xe
            </Link>
            <Link to="/accessories" className="hover:text-white transition-colors">
              Phụ kiện
            </Link>
            <Link to="/car-comparison" className="hover:text-white transition-colors">
              So sánh xe
            </Link>
            <Link to="/ai-consultant" className="hover:text-white transition-colors">
              Tư vấn chọn xe
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="text-xs font-medium text-white/85 hover:text-white transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/cars"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium transition-colors"
            >
              <span>Vào Showroom</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm font-medium text-white/80">
              Nền tảng mua xe và phụ kiện chính hãng AutoHub
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-white">
              Chọn đúng mẫu xe, rõ từng khoản chi phí lăn bánh
            </h1>
            <p className="text-base text-white/80 leading-relaxed max-w-xl">
              Tra cứu thông số thực tế, dự toán thuế phí tại 63 tỉnh thành và đặt cọc giữ xe 72 giờ trực tuyến với hoàn cọc minh bạch.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
              >
                <span>Xem xe sẵn sàng giao</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/car-estimator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/30 bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>Dự toán lăn bánh</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Giá niêm yết công khai
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Đặt cọc giữ xe 72 giờ
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Lái thử tại showroom hoặc tận nơi
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Section 1: 4 Quick Entry Blocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool) => {
            const IconComp = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.to}
                className="group rounded-lg bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {tool.subtitle}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                  <span>Mở tính năng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 2: Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[var(--line)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Các mẫu xe nổi bật
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Lựa chọn phổ biến tại hệ thống showroom với thông số kỹ thuật và giá niêm yết rõ ràng.
            </p>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline shrink-0"
          >
            <span>Xem toàn bộ showroom</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.slice(0, 3).map((car) => (
            <article
              key={car.id}
              className="group bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-lg overflow-hidden transition-colors flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/cars/${car.id}`}
                  className="block aspect-[16/10] bg-[var(--surface-subtle)] overflow-hidden"
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </Link>

                <div className="p-5 space-y-3">
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{car.segment}</p>
                    <Link to={`/cars/${car.id}`} className="block mt-0.5">
                      <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {car.name}
                      </h3>
                    </Link>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-xs py-2.5 border-y border-[var(--line)]">
                    <div>
                      <dt className="text-[var(--text-muted)]">Công suất</dt>
                      <dd className="font-semibold text-[var(--text)] tabular-nums mt-0.5">
                        {car.power.split('(')[0].trim()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)]">Tầm hoạt động</dt>
                      <dd className="font-semibold text-[var(--text)] tabular-nums mt-0.5">
                        {car.range.split('(')[0].trim()}
                      </dd>
                    </div>
                  </dl>

                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Giá niêm yết</p>
                    <p className="text-xl font-bold text-[var(--text)] tabular-nums mt-0.5">
                      {formatCurrencyVND(car.listedPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between gap-3">
                <Link
                  to={`/cars/${car.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/deposit/${car.id}`}
                  className="py-2 px-3 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                >
                  Đặt cọc 72h
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: 4 Transparent Purchase Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[var(--line)]">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            Quy trình mua xe trực tuyến 4 bước
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Theo dõi từng trạng thái từ khi dự toán, đặt cọc giữ suất đến lúc nhận bàn giao xe.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
          {steps.map((item) => {
            const StepIcon = item.icon;
            return (
              <div key={item.step} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--accent)]">
                    <StepIcon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-muted)] tabular-nums">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Bottom CTA Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Cần tư vấn chọn xe theo nhu cầu gia đình và ngân sách?
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              So sánh trực tiếp các phiên bản hoặc trò chuyện với trợ lý tư vấn để tìm lựa chọn phù hợp nhất.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/cars"
              className="px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Khám phá showroom
            </Link>
            <Link
              to="/ai-consultant"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line-strong)] text-[var(--text)] text-sm font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <span>Hỏi tư vấn xe</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export const LandingPage = Scene;
export default Scene;
