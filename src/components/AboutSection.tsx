import React, { useEffect, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadResumePdf } from '../utils/downloadResume';

function attachTightSpringMotion(
  el: HTMLElement,
  maxX = 8,
  maxY = 6
): () => void {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) {
    return () => {};
  }

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let velX = 0;
  let velY = 0;
  let rafId: number | null = null;
  let lastTime = performance.now();

  const step = (now: number) => {
    const dt = Math.min((now - lastTime) / 16.667, 2);
    lastTime = now;

    const stiffness = 0.055;
    const retention = Math.pow(0.74, dt);

    velX = (velX + (targetX - curX) * stiffness * dt) * retention;
    velY = (velY + (targetY - curY) * stiffness * dt) * retention;
    curX += velX * dt;
    curY += velY * dt;

    el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;

    const isSettled =
      Math.abs(targetX - curX) < 0.02 &&
      Math.abs(targetY - curY) < 0.02 &&
      Math.abs(velX) < 0.02 &&
      Math.abs(velY) < 0.02;

    if (isSettled) {
      curX = targetX;
      curY = targetY;
      velX = 0;
      velY = 0;
      el.style.transform =
        targetX === 0 && targetY === 0
          ? ''
          : `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0)`;
      rafId = null;
      return;
    }

    rafId = window.requestAnimationFrame(step);
  };

  const startSpring = () => {
    if (rafId === null) {
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(step);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    targetX = nx * maxX;
    targetY = ny * maxY;
    startSpring();
  };

  const onPointerLeave = () => {
    targetX = 0;
    targetY = 0;
    startSpring();
  };

  el.addEventListener('pointermove', onPointerMove, { passive: true });
  el.addEventListener('pointerleave', onPointerLeave, { passive: true });

  return () => {
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerleave', onPointerLeave);
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    el.style.transform = '';
  };
}

export const AboutSection: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const portraitImgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const cleanups: Array<() => void> = [];
    if (leftColRef.current) {
      cleanups.push(attachTightSpringMotion(leftColRef.current, 8, 6));
    }
    if (portraitImgRef.current) {
      cleanups.push(attachTightSpringMotion(portraitImgRef.current, 8, 6));
    }
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleDownloadResume = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadResumePdf();
    } catch {
      setDownloadError('Unable to download PDF right now. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <section
      id="about"
      className="relative w-full lg:max-w-[1920px] lg:mx-auto bg-[#FFFFFD] text-black flex flex-col justify-start overflow-x-hidden pt-24 sm:pt-28 lg:pt-[clamp(112px,7.5vw,144px)] pb-10 sm:pb-12 lg:pb-[clamp(32px,2.8vw,56px)]"
    >
      {/* Main Two-Column Hero Content proportioned for 1920x1080 desktop/laptop */}
      <main className="w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-3 sm:pt-4 lg:pt-4 pb-2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8">
          {/* Left Column: Subtitle + Chunky Display Heading + Yellow Underline + Sparkle + Paragraph */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 flex flex-col justify-center will-change-transform"
          >
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-2.5 sm:mb-3 lg:mb-[min(0.8vw,14px)] text-[#003CD7] font-body-clean text-xs sm:text-sm lg:text-[clamp(11px,0.8vw,15px)] tracking-[0.2em] uppercase font-normal select-none">
              <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
              <span>COMMUNICATION DESIGNER</span>
            </div>
            <h1 className="font-bubbly font-bold uppercase text-[40px] sm:text-[54px] md:text-[66px] lg:text-[clamp(48px,4.4vw,84px)] leading-[1.08] tracking-[-0.01em] text-black select-none">
              <span className="block">HELLO, I’M</span>
              <span className="inline-flex flex-wrap items-baseline gap-x-[0.26em] mt-0.5">
                {/* YASHASVI with hand-drawn wavy yellow underline */}
                <span className="relative inline-block text-[#003CD7] pb-2 sm:pb-3 lg:pb-[0.14em]">
                  YASHASVI
                  <svg
                    viewBox="0 0 430 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-0 right-0 -bottom-0.5 sm:bottom-0 w-full h-[12px] sm:h-[16px] lg:h-[0.18em] pointer-events-none"
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

                {/* BHATT + 4-point blue sparkle */}
                <span className="inline-flex items-start text-black">
                  BHATT
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 sm:w-9 sm:h-9 lg:w-[0.52em] lg:h-[0.52em] ml-1 sm:ml-2 -mt-1 sm:-mt-2 text-[#003CD7] shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M24 2C25.2 14.5 33.5 22.8 46 24C33.5 25.2 25.2 33.5 24 46C22.8 33.5 14.5 25.2 2 24C14.5 22.8 22.8 14.5 24 2Z"
                      fill="#003CD7"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            {/* About Paragraph verbatim from uploaded image */}
            <p className="font-poppins text-[15.5px] sm:text-[17px] md:text-[18.5px] lg:text-[clamp(14px,1.06vw,20px)] text-black leading-[1.45] font-normal mt-5 sm:mt-6 lg:mt-[min(1.4vw,26px)] max-w-[660px] lg:max-w-[min(37vw,660px)]">
              I’ve always been{' '}
              <span className="text-[#003CD7] font-medium">drawn to colours.</span>{' '}
              Maybe that’s why I can{' '}
              <span className="text-[#003CD7] font-medium">
                spend hours getting lost in nature, books and ideas.
              </span>{' '}
              I’m naturally curious and tend to{' '}
              <span className="text-[#003CD7] font-medium">
                go a little deeper than I probably need to,
              </span>{' '}
              researching, connecting things, probably overthinking them and
              eventually finding a way to turn those thoughts into something
              visual. I love conceptual work, visual exploration and
              storytelling, and I’m always excited by the process of discovering
              something new. I’m still figuring out where this journey will take
              me, but I know I want to{' '}
              <span className="text-[#003CD7] font-medium">
                keep exploring, learning and making along the way.
              </span>
            </p>

            {/* Direct Download Resume CTA below paragraph */}
            <div className="mt-6 sm:mt-7 lg:mt-[min(1.5vw,28px)] flex flex-col items-start gap-1.5">
              <button
                type="button"
                onClick={handleDownloadResume}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003CD7] hover:bg-[#0030b0] disabled:opacity-75 text-[#FFFFFD] text-xs sm:text-sm font-poppins font-semibold rounded-full origin-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.06] hover:-rotate-[2.5deg] shadow-sm hover:shadow-[0_10px_20px_-6px_rgba(0,48,176,0.35)] active:scale-[1.02] active:rotate-0 active:shadow-sm motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0 cursor-pointer"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? 'Downloading...' : 'Download Resume'}
              </button>
              {downloadError && (
                <p className="text-xs text-[#003CD7] font-poppins">{downloadError}</p>
              )}
            </div>
          </div>

          {/* Right Column: Exact Arch Portrait from uploaded image */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div
              ref={portraitImgRef}
              className="relative inline-block w-[290px] sm:w-[360px] md:w-[420px] lg:w-[clamp(280px,25.5vw,490px)] max-w-full will-change-transform"
            >
              <img
                src="/assets/about-portrait.png"
                alt="Yashasvi Bhatt"
                className="w-full h-auto object-contain select-none block"
              />
              {/* 4-point blue sparkle matching the About heading star */}
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none select-none absolute top-[63%] -left-4 sm:-left-5 lg:-left-6 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] z-10"
                aria-hidden="true"
              >
                <path
                  d="M24 2C25.2 14.5 33.5 22.8 46 24C33.5 25.2 25.2 33.5 24 46C22.8 33.5 14.5 25.2 2 24C14.5 22.8 22.8 14.5 24 2Z"
                  fill="#003CD7"
                />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
