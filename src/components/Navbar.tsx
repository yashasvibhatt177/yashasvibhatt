import React, { useState, useEffect } from 'react';
import { WorkModal } from './WorkModal';
import { ResumeModal } from './ResumeModal';

interface NavbarProps {
  onReplayIntro?: () => void;
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro, onOpenResume }) => {
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    onReplayIntro?.();
  };

  const handleAboutClick = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWorkClick = () => {
    const workEl = document.getElementById('work');
    if (workEl) {
      workEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsWorkOpen(true);
    }
  };

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
          <nav className="flex items-center gap-6 sm:gap-9 md:gap-12 font-body-clean text-sm sm:text-base md:text-[18px]">
            <button
              type="button"
              onClick={handleAboutClick}
              className="font-normal hover:opacity-60 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              About
            </button>
            <button
              type="button"
              onClick={handleWorkClick}
              className="font-normal hover:opacity-60 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              Work
            </button>
            <button
              type="button"
              onClick={() => (onOpenResume ? onOpenResume() : setIsResumeOpen(true))}
              className="font-normal hover:opacity-60 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              Resume
            </button>
          </nav>
        </div>
      </header>

      {/* Modals for functional navigation */}
      <WorkModal isOpen={isWorkOpen} onClose={() => setIsWorkOpen(false)} />
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};
