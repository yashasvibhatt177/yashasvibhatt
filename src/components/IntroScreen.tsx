import React, { useEffect, useState } from 'react';

interface IntroScreenProps {
  isSliding: boolean;
  onSkip?: () => void;
}

const COUNT_DURATION_MS = 3800;

export const IntroScreen: React.FC<IntroScreenProps> = ({ isSliding, onSkip }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isSliding) {
      setProgress(100);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setProgress(100);
      return;
    }

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / COUNT_DURATION_MS);
      // Smooth slight ease-out curve so it decelerates naturally into 100%
      const eased = 1 - Math.pow(1 - t, 1.6);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    setProgress(0);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isSliding]);

  return (
    <div
      onClick={onSkip}
      className={`fixed inset-0 z-50 w-full h-screen overflow-hidden bg-[#003CD7] text-[#FFFFFD] select-none cursor-pointer ${
        isSliding ? 'pointer-events-none' : ''
      }`}
      style={{
        transform: isSliding ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)',
        willChange: 'transform',
      }}
      aria-label="Portfolio Introduction Screen"
    >
      {/* Subtle 4-point sparkle motif on the right echoing the About section */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none select-none hidden md:block absolute top-14 right-12 lg:top-16 lg:right-20 xl:right-24 w-10 h-10 lg:w-12 lg:h-12 text-[#FEBC00]"
        aria-hidden="true"
      >
        <path
          d="M24 2C25.2 14.5 33.5 22.8 46 24C33.5 25.2 25.2 33.5 24 46C22.8 33.5 14.5 25.2 2 24C14.5 22.8 22.8 14.5 24 2Z"
          fill="#FEBC00"
        />
      </svg>

      {/* Subtle monoline "Y" flourish on bottom-right echoing the Footer monogram */}
      <svg
        viewBox="0 0 320 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none select-none hidden lg:block absolute -bottom-10 right-10 xl:right-16 w-[230px] xl:w-[270px] h-auto opacity-20 origin-bottom rotate-[8deg]"
      >
        <path
          d="M 42 74 C 54 36, 86 28, 98 62 C 110 96, 104 198, 156 200 C 208 202, 236 114, 256 42 C 242 128, 214 246, 184 342 C 160 418, 114 434, 80 412 C 46 390, 56 336, 118 300 C 172 268, 234 242, 286 208"
          stroke="#FEBC00"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Main layout container aligned to the portfolio grid */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto h-full flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-8 sm:py-10 md:py-12">
        {/* Top quiet editorial header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 sm:gap-3">
            <span
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FEBC00] inline-block shrink-0"
              aria-hidden="true"
            />
            <span className="font-bubbly font-bold text-base sm:text-lg md:text-xl tracking-[0.035em] uppercase text-[#FFFFFD]">
              YASHASVI BHATT
            </span>
          </div>
        </div>

        {/* Lower-left focal quote */}
        <div className="my-auto pt-8 pb-6 max-w-4xl">
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[#FEBC00] font-body-clean text-xs sm:text-sm tracking-[0.22em] uppercase font-medium">
            <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#FEBC00] shrink-0" aria-hidden="true" />
            <span>Communication Design Portfolio</span>
          </div>

          <h1 className="font-bubbly font-bold text-[30px] min-[420px]:text-[34px] sm:text-[46px] md:text-[54px] lg:text-[62px] leading-[1.18] tracking-[0.01em] text-[#FFFFFD] [text-wrap:balance]">
            I&apos;m a{' '}
            <span className="text-[#FEBC00]">communication designer</span>{' '}
            who enjoys learning through the process of{' '}
            <span className="relative inline-block text-[#FEBC00] pb-2 sm:pb-2.5">
              creating
              <svg
                viewBox="0 0 430 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-0 right-0 -bottom-0.5 sm:bottom-0 w-full h-[10px] sm:h-[14px] pointer-events-none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M4 15.5C96 8.5 186 11.5 278 13.5C338 14.8 390 10.8 426 4.5"
                  stroke="#FEBC00"
                  strokeWidth="9.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block w-6 h-6 sm:w-8 sm:h-8 ml-1.5 -mt-3 sm:-mt-5 align-middle text-[#FEBC00]"
              aria-hidden="true"
            >
              <path
                d="M24 2C25.2 14.5 33.5 22.8 46 24C33.5 25.2 25.2 33.5 24 46C22.8 33.5 14.5 25.2 2 24C14.5 22.8 22.8 14.5 24 2Z"
                fill="#FEBC00"
              />
            </svg>
          </h1>
        </div>

        {/* Bottom bar with percentage count-up replacing Enter Portfolio */}
        <div className="flex items-end justify-between gap-4">
          <span className="font-body-clean text-xs sm:text-sm text-[#FFFFFD]/70 tracking-wide">
            Ahmedabad, India
          </span>

          <span
            aria-live="off"
            className="font-poppins font-semibold text-xl sm:text-2xl md:text-[28px] leading-none tabular-nums tracking-tight text-[#FEBC00]"
          >
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
