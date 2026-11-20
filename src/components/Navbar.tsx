import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkModal } from './WorkModal';
import { ResumeModal } from './ResumeModal';

interface NavbarProps {
  onReplayIntro?: () => void;
  onOpenResume?: () => void;
  isResumeOpen?: boolean;
}

type NavSection = 'about' | 'work';

export const Navbar: React.FC<NavbarProps> = ({
  onReplayIntro,
  onOpenResume,
  isResumeOpen: externalResumeOpen,
}) => {
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [internalResumeOpen, setInternalResumeOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('about');
  const scrollLockRef = useRef<{ target: NavSection; expiresAt: number } | null>(null);

  const resumeActive = Boolean(externalResumeOpen ?? internalResumeOpen);

  const computeActiveSection = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    setHasScrolled(scrollY > 24);

    const lock = scrollLockRef.current;
    if (lock && performance.now() < lock.expiresAt) {
      const workEl = document.getElementById('work');
      if (workEl) {
        const workTop = workEl.getBoundingClientRect().top;
        const reachedTarget =
          (lock.target === 'work' && workTop <= 140) ||
          (lock.target === 'about' && workTop > 140);
        if (!reachedTarget) return;
      }
      scrollLockRef.current = null;
    }

    const workEl = document.getElementById('work');
    if (workEl) {
      const rect = workEl.getBoundingClientRect();
      // Switch to Work once the Work section enters the upper viewport below the sticky header
      setActiveSection(rect.top <= 140 ? 'work' : 'about');
    } else {
      setActiveSection('about');
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        computeActiveSection();
      });
    };

    computeActiveSection();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [computeActiveSection]);

  const handleBrandClick = () => {
    scrollLockRef.current = { target: 'about', expiresAt: performance.now() + 800 };
    setActiveSection('about');
    window.scrollTo({ top: 0, behavior: 'auto' });
    onReplayIntro?.();
  };

  const handleAboutClick = () => {
    scrollLockRef.current = { target: 'about', expiresAt: performance.now() + 900 };
    setActiveSection('about');
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWorkClick = () => {
    scrollLockRef.current = { target: 'work', expiresAt: performance.now() + 900 };
    setActiveSection('work');
    const workEl = document.getElementById('work');
    if (workEl) {
      workEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsWorkOpen(true);
    }
  };

  const isAboutActive = !resumeActive && activeSection === 'about';
  const isWorkActive = !resumeActive && activeSection === 'work';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full bg-[#FFFFFD]/95 text-black backdrop-blur-sm transition-colors duration-200 ${
          hasScrolled ? 'border-b border-black/10' : ''
        }`}
      >
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-4 sm:py-5">
          {/* Left Brand Identifier with blue dot - clicking replays intro */}
          <button
            type="button"
            onClick={handleBrandClick}
            className="inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left hover:opacity-80 transition-opacity focus:outline-none whitespace-nowrap shrink-0"
            title="Replay intro"
          >
            <span
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#003CD7] inline-block shrink-0"
              aria-hidden="true"
            />
            <span className="font-bubbly font-bold text-lg sm:text-xl md:text-[24px] tracking-[0.035em] uppercase leading-none">
              YASHASVI BHATT
            </span>
          </button>

          {/* Right Navigation Links: About, Work, Resume */}
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-6 sm:gap-9 md:gap-12 font-body-clean text-sm sm:text-base md:text-[18px]"
          >
            <button
              type="button"
              onClick={handleAboutClick}
              aria-current={isAboutActive ? 'page' : undefined}
              className={`py-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100 cursor-pointer whitespace-nowrap shrink-0 ${
                isAboutActive
                  ? 'text-[#003CD7] font-medium'
                  : 'text-black font-normal hover:text-[#003CD7]'
              }`}
            >
              About
            </button>

            <button
              type="button"
              onClick={handleWorkClick}
              aria-current={isWorkActive ? 'page' : undefined}
              className={`py-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100 cursor-pointer whitespace-nowrap shrink-0 ${
                isWorkActive
                  ? 'text-[#003CD7] font-medium'
                  : 'text-black font-normal hover:text-[#003CD7]'
              }`}
            >
              Work
            </button>

            <button
              type="button"
              onClick={() => (onOpenResume ? onOpenResume() : setInternalResumeOpen(true))}
              aria-current={resumeActive ? 'page' : undefined}
              className={`py-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100 cursor-pointer whitespace-nowrap shrink-0 ${
                resumeActive
                  ? 'text-[#003CD7] font-medium'
                  : 'text-black font-normal hover:text-[#003CD7]'
              }`}
            >
              Resume
            </button>
          </nav>
        </div>
      </header>

      {/* Modals for functional navigation */}
      <WorkModal isOpen={isWorkOpen} onClose={() => setIsWorkOpen(false)} />
      <ResumeModal isOpen={internalResumeOpen} onClose={() => setInternalResumeOpen(false)} />
    </>
  );
};
