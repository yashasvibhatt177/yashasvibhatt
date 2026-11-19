import React, { useState } from 'react';
import { Mail, Phone, FileDown, ArrowUp } from 'lucide-react';
import { Project, PROJECTS } from '../data/projects';
import { downloadResumePdf } from '../utils/downloadResume';

interface FooterProps {
  onSelectProject: (project: Project) => void;
  onOpenResume: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectProject,
  onOpenResume,
  onReplayIntro,
}) => {
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    onReplayIntro?.();
  };

  const handleDownloadResume = async () => {
    if (isDownloadingResume) return;
    setIsDownloadingResume(true);
    try {
      await downloadResumePdf();
    } catch {
      onOpenResume();
    } finally {
      setIsDownloadingResume(false);
    }
  };

  return (
    <footer className="relative w-full pt-8 sm:pt-10 md:pt-12 bg-[#FFFFFD] overflow-visible">
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pb-0 font-bubbly -translate-y-3 sm:-translate-y-4">
        <p className="font-bubbly font-bold text-[28px] min-[420px]:text-[32px] sm:text-[56px] lg:text-[68px] leading-[1.05] tracking-[0.015em] max-w-6xl select-none -mb-[0.20em]">
          <span className="block text-[28px] min-[420px]:text-[32px] sm:text-[56px] lg:text-[68px]">
            <span className="text-black">Made With</span>{' '}
            <span className="text-[#003CD7]">Curiosity</span>
          </span>
          <span className="block text-[28px] min-[420px]:text-[32px] sm:text-[56px] lg:text-[68px]">
            <span className="text-black">And</span>{' '}
            <span className="text-[#FEBC00]">A Little Bit Of Chaos.</span>
          </span>
        </p>
      </div>

      <div className="relative w-full bg-[#003CD7] text-[#FFFFFD] rounded-t-[28px] sm:rounded-t-[36px] lg:rounded-t-[44px]">
        <div className="relative w-full max-w-[1920px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-11 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 min-h-[340px] sm:min-h-[340px] md:min-h-[380px] lg:min-h-[430px] flex flex-col justify-between gap-14 sm:gap-20">
          {/* Top Left: Intro Line + Email & Phone */}
          <div className="relative z-10 max-w-2xl flex flex-col items-start">
            <p className="font-body-clean text-sm sm:text-base text-[#FFFFFD]/85 tracking-wide mb-2.5 sm:mb-3">
              Let&apos;s create something together.
            </p>
            <a
              href="mailto:bhtyashasvi@gmail.com"
              className="group inline-block font-poppins font-medium text-[19px] sm:text-[26px] md:text-[32px] lg:text-[36px] tracking-[-0.02em] leading-[1.12] text-[#FFFFFD] hover:text-[#FEBC00] transition-colors break-all sm:break-normal"
            >
              <span className="text-[19px] sm:text-[26px] md:text-[32px] lg:text-[36px]">bhtyashasvi@gmail.com</span>
              <span
                className="block h-[2px] w-0 group-hover:w-full bg-[#FEBC00] transition-all duration-300 mt-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="tel:+917874182660"
              className="group inline-block mt-2 sm:mt-2.5 font-poppins font-medium text-[17px] sm:text-[22px] md:text-[26px] lg:text-[30px] tracking-[-0.02em] leading-[1.12] text-[#FFFFFD]/95 hover:text-[#FEBC00] transition-colors"
            >
              <span>+91 7874182660</span>
              <span
                className="block h-[2px] w-0 group-hover:w-full bg-[#FEBC00] transition-all duration-300 mt-1"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Bottom Left: 3-Column Navigation, Action Icons, Copyright */}
          <div className="relative z-10 max-w-[65%] sm:max-w-xl space-y-6 sm:space-y-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-8 lg:gap-x-12 font-body-clean text-[13px] sm:text-sm leading-relaxed">
              {/* Column 1: Portfolio */}
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="text-[#FFFFFD]/90 hover:text-[#FEBC00] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('work')}
                    className="text-[#FFFFFD]/90 hover:text-[#FEBC00] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Work
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenResume}
                    className="text-[#FFFFFD]/90 hover:text-[#FEBC00] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Resume
                  </button>
                </li>
              </ul>

              {/* Column 2: Selected Work */}
              <ul className="space-y-1.5">
                {PROJECTS.slice(0, 3).map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="text-left text-[#FFFFFD]/90 hover:text-[#FEBC00] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {project.title.replace(' - Stop Motion Film', '')}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Column 3: More Work & Intro */}
              <ul className="space-y-1.5">
                {PROJECTS.slice(3).map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="text-left text-[#FFFFFD]/90 hover:text-[#FEBC00] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {project.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={handleReplayIntro}
                    className="text-[#FFFFFD]/90 hover:text-[#FEBC00] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Replay Intro
                  </button>
                </li>
              </ul>
            </div>

            {/* Action Icon Row */}
            <div className="flex items-center gap-4 text-[#FFFFFD]">
              <a
                href="mailto:bhtyashasvi@gmail.com"
                aria-label="Email Yashasvi Bhatt"
                title="Email bhtyashasvi@gmail.com"
                className="p-1.5 -ml-1.5 rounded-lg text-[#FFFFFD]/90 hover:text-[#FEBC00] hover:bg-white/10 transition-colors"
              >
                <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.9} />
              </a>
              <a
                href="tel:+917874182660"
                aria-label="Call +91 7874182660"
                title="Call +91 7874182660"
                className="p-1.5 rounded-lg text-[#FFFFFD]/90 hover:text-[#FEBC00] hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.9} />
              </a>
              <button
                type="button"
                onClick={handleDownloadResume}
                aria-label="Download Resume PDF"
                title="Download Resume PDF"
                className="p-1.5 rounded-lg text-[#FFFFFD]/90 hover:text-[#FEBC00] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.9} />
              </button>
              <button
                type="button"
                onClick={handleBackToTop}
                aria-label="Back to Top"
                title="Back to Top"
                className="p-1.5 rounded-lg text-[#FFFFFD]/90 hover:text-[#FEBC00] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.9} />
              </button>
            </div>

            {/* Quiet Bottom Credit Line */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-body-clean text-[11px] sm:text-xs text-[#FFFFFD]/70">
              <span>&copy; 2026 Yashasvi Bhatt</span>
              <span>Communication Designer</span>
              <span>Ahmedabad, India</span>
            </div>
          </div>

          {/* Oversized Monoline Cursive "Y" Monogram overlapping top edge on right */}
          <svg
            viewBox="0 0 320 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="pointer-events-none select-none absolute bottom-0 right-1 sm:right-6 md:right-12 lg:right-16 w-[135px] sm:w-[270px] md:w-[315px] lg:w-[360px] h-auto z-0 origin-bottom rotate-[8deg] translate-x-1 sm:translate-x-2"
          >
            <path
              d="M 42 74 C 54 36, 86 28, 98 62 C 110 96, 104 198, 156 200 C 208 202, 236 114, 256 42 C 242 128, 214 246, 184 342 C 160 418, 114 434, 80 412 C 46 390, 56 336, 118 300 C 172 268, 234 242, 286 208"
              stroke="#FEBC00"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
};
