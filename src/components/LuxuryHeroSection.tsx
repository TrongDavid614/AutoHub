import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export interface LuxuryHeroSectionProps {
  brandName?: string;
  headline?: string;
  subHeading?: string;
  description?: string;
  browseText?: string;
  onBrowseClick?: () => void;
}

export const LuxuryHeroSection: React.FC<LuxuryHeroSectionProps> = ({
  brandName = 'VELORA',
  headline = 'REGAL DRIVE',
  subHeading = 'Rent Your Dream Luxury Car Today',
  description = 'Enjoy a premium rental experience with exclusive cars, seamless booking, and honest pricing.',
  browseText = 'Bắt đầu khám phá ngay',
  onBrowseClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // VIDEO CONTINUOUS PLAYBACK WATCHDOG
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Helper to trigger safe play
    const triggerPlay = () => {
      if (video && video.paused) {
        video.play().catch(() => {
          // Swallow play() rejection safely per specification
        });
      }
    };

    // 1. Initial play attempt on mount
    triggerPlay();

    // 2. Continuous playback listeners on video events
    const handleReplay = () => triggerPlay();

    video.addEventListener('pause', handleReplay);
    video.addEventListener('ended', handleReplay);
    video.addEventListener('loadedmetadata', handleReplay);
    video.addEventListener('canplay', handleReplay);

    // 3. Tab refocus listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. 1-second watchdog interval
    const watchdogInterval = setInterval(() => {
      if (video && video.paused) {
        triggerPlay();
      }
    }, 1000);

    // Cleanup
    return () => {
      video.removeEventListener('pause', handleReplay);
      video.removeEventListener('ended', handleReplay);
      video.removeEventListener('loadedmetadata', handleReplay);
      video.removeEventListener('canplay', handleReplay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(watchdogInterval);
    };
  }, []);

  return (
    <section
      className="relative w-full h-screen min-h-[720px] overflow-hidden bg-[#0a0a0b] select-none font-['Archivo',sans-serif]"
      style={{
        fontFamily: "'Archivo', sans-serif",
      }}
    >
      {/* 1. BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        src="https://cdn.sceneai.art/Hero section video file (2)/37091057-3719-4207-815c-745ebf57aeb4.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          objectPosition: 'center 60%',
        }}
      />

      {/* 2. DARK TOP-TO-BOTTOM GRADIENT OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.15) 30%, rgba(8,8,10,0.25) 55%, rgba(8,8,10,0.92) 100%)',
        }}
      />

      {/* 3. NAVBAR */}
      <nav className="relative z-[3] flex items-center justify-between px-6 sm:px-10 lg:px-[56px] py-[34px] w-full">
        {/* Brand Logo (Left) */}
        <div>
          <Link
            to="/"
            className="text-white text-[24px] sm:text-[26px] font-[700] tracking-[0.04em] uppercase hover:opacity-90 transition-opacity"
          >
            {brandName}
          </Link>
        </div>

        {/* Right Action Button -> Bắt đầu khám phá ngay */}
        <div>
          {onBrowseClick ? (
            <button
              type="button"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-[10px] px-[20px] py-[11px] rounded-[10px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] text-[#FAF9F5] text-[14px] font-[600] cursor-pointer hover:bg-[#e9e9ec] hover:text-[#0a0a0b] hover:border-[#e9e9ec] transition-all duration-300 shadow-sm"
            >
              <span>{browseText}</span>
              <span className="text-[15px] leading-none">→</span>
            </button>
          ) : (
            <Link
              to="/cars"
              className="inline-flex items-center gap-[10px] px-[20px] py-[11px] rounded-[10px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] text-[#FAF9F5] text-[14px] font-[600] cursor-pointer hover:bg-[#e9e9ec] hover:text-[#0a0a0b] hover:border-[#e9e9ec] transition-all duration-300 shadow-sm"
            >
              <span>{browseText}</span>
              <span className="text-[15px] leading-none">→</span>
            </Link>
          )}
        </div>
      </nav>

      {/* 4. GIANT HEADLINE */}
      <div className="absolute top-[92px] left-0 w-full text-center z-[2] pointer-events-none">
        <h1
          className="font-[800] leading-[0.9] tracking-[-0.03em] whitespace-nowrap uppercase select-none"
          style={{
            fontSize: '13.3vw',
            background: 'linear-gradient(180deg, #ffffff 55%, #b8b8bd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {headline}
        </h1>
      </div>

      {/* 5. BOTTOM-LEFT HERO COPY */}
      <div className="absolute left-6 sm:left-10 lg:left-[56px] bottom-6 sm:bottom-10 lg:bottom-[56px] z-[3] max-w-[620px]">
        {/* Heading */}
        <h2
          className="text-white font-[600] tracking-[-0.02em] leading-[0.98]"
          style={{
            fontSize: 'clamp(38px, 5.8vw, 66px)',
          }}
        >
          {subHeading}
        </h2>

        {/* Paragraph */}
        <p className="text-[rgba(255,255,255,0.82)] text-[15px] font-[400] leading-[1.5] max-w-[480px] mt-[18px]">
          {description}
        </p>
      </div>
    </section>
  );
};

export default LuxuryHeroSection;
