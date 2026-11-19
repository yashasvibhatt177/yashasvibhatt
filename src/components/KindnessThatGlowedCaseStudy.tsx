import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Project } from '../data/projects';
import { StorybookFlipbook } from './StorybookFlipbook';
import { attachTightSpringMotion } from '../utils/springMotion';

interface KindnessThatGlowedCaseStudyProps {
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  prevProject: Project;
  nextProject: Project;
}

const DEFAULT_HERO_IMAGE =
  '/assets/aistudio/Ghostie_s_Spooky_Forest_Storybook_9b9cb6bf.png';
const DEFAULT_CHARACTER_IMAGE =
  '/assets/aistudio/WhatsApp_Image_2026-11-19_at_2.44.38_PM_980dd334.jpeg';
const DEFAULT_STORYBOARD_IMAGE = '/assets/aistudio/storyboard_d82676fb.png';

const ALL_SLOT_IDS = [
  'ktg-hero',
  'ktg-visual-1',
  'ktg-storyboard',
];

export const KindnessThatGlowedCaseStudy: React.FC<KindnessThatGlowedCaseStudyProps> = ({
  onBack,
  onSelectProject,
  prevProject,
  nextProject,
}) => {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);
  const heroTitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia || !heroTitleRef.current) {
      return;
    }
    return attachTightSpringMotion(heroTitleRef.current, 8, 6);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const loaded: Record<string, string> = {};
    ALL_SLOT_IDS.forEach((id) => {
      try {
        const val = localStorage.getItem(`yashasvi_${id}`);
        if (val) loaded[id] = val;
      } catch {
        // Ignore storage errors
      }
    });
    setAssets(loaded);
  }, []);

  const triggerUpload = (slotId: string) => {
    uploadTargetRef.current = slotId;
    photoInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = uploadTargetRef.current;
    if (file && slotId && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setAssets((prev) => ({ ...prev, [slotId]: result }));
          try {
            localStorage.setItem(`yashasvi_${slotId}`, result);
          } catch {
            // Ignore quota errors
          }
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const resetAsset = (slotId: string, ev: React.MouseEvent) => {
    ev.stopPropagation();
    setAssets((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    try {
      localStorage.removeItem(`yashasvi_${slotId}`);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFD] text-black font-poppins">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFD]/95 backdrop-blur-sm border-b border-black/10">
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-5 sm:py-6">
          <span className="font-poppins text-sm sm:text-base font-medium text-black">
            The Kindness that Glowed
          </span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-poppins text-sm sm:text-base text-black hover:text-[#003CD7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </div>
      </header>

      {/* Hero Section — Full-bleed right artwork aligned with header & metadata dividers */}
      <section className="w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[41%_59%] items-stretch">
          {/* Left: Typography-led Cover Header */}
          <div
            ref={heroTitleRef}
            className="px-6 sm:px-10 md:px-14 lg:pl-16 xl:pl-[max(5rem,calc((100vw-1680px)/2+5rem))] lg:pr-8 xl:pr-10 py-10 sm:py-12 lg:py-12 xl:py-14 flex flex-col justify-center items-start will-change-transform"
          >
            <div className="inline-flex items-center gap-3 sm:gap-4 text-[#003CD7] font-body-clean text-xs sm:text-sm tracking-[0.18em] uppercase mb-6">
              <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
              <span>Individual Project | 2025</span>
            </div>

            <h1 className="font-bubbly font-bold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[50px] xl:text-[64px] 2xl:text-[78px] leading-[1.04] tracking-[-0.01em] text-black -ml-[0.04em]">
              <span className="block font-bubbly">THE KINDNESS</span>
              <span className="block font-bubbly text-[#003CD7]">THAT GLOWED</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-black/80 font-normal leading-relaxed">
              Publication Design / Children’s Storybook
            </p>
          </div>

          {/* Right: Full-bleed Hero Artwork filling space beside Title */}
          <div className="w-full px-6 sm:px-10 md:px-14 lg:px-0 pb-10 lg:pb-0 flex">
            <div
              onClick={() => triggerUpload('ktg-hero')}
              className="w-full h-full aspect-[4/3] lg:aspect-[3/2] rounded-2xl lg:rounded-none border border-black/10 lg:border-0 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-[#eceae2] group"
              title="Click to replace storybook cover artwork"
            >
              <img
                src={assets['ktg-hero'] || DEFAULT_HERO_IMAGE}
                alt="The Kindness that Glowed — Open storybook spread on character sketches"
                className="w-full h-full object-cover object-center block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />

              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px]">
                  Replace
                </span>
                {Boolean(assets['ktg-hero']) && (
                  <button
                    type="button"
                    onClick={(e) => resetAsset('ktg-hero', e)}
                    className="p-2 rounded-lg bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-0 pb-24 space-y-20 sm:space-y-28">
        {/* Ruled Metadata Row */}
        <section className="w-full">
          <div className="border-t border-black/15 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-black/15 py-6 gap-6">
              <div>
                <span className="text-xs text-black/50 block mb-1">Project Type</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Individual Academic Project
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Year</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  2025
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Software</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Procreate &amp; Adobe InDesign
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. PROJECT OVERVIEW */}
        <section className="max-w-4xl space-y-6">
          <span className="text-xs sm:text-sm text-black/55 block">
            Project overview
          </span>
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            Crafting <span className="text-[#003CD7]">a Children’s Storybook.</span>
          </h2>
          <div className="space-y-5 text-base sm:text-lg text-black/85 leading-relaxed">
            <p>
              The Kindness that Glowed is a storybook design project focused on
              creating a visual narrative through character development and
              illustration. The project began with experimenting with random
              shapes and forms, which gradually evolved into characters. These
              characters became the foundation for developing a story, planning
              its scenes through storyboarding, and creating the final
              illustrated book.
            </p>
          </div>
        </section>

        {/* 2. THE BRIEF */}
        <section className="max-w-4xl space-y-10">
          <div>
            <span className="text-xs sm:text-sm text-black/55 block mb-2">
              The Brief
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
              Understanding{' '}
              <span className="relative inline-block text-[#003CD7] pb-2 sm:pb-3 lg:pb-[0.14em]">
                the Project.
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
            </h2>
          </div>

          <div className="space-y-8">
            <div className="border-l-4 border-[#FEBC00] pl-6 py-1 space-y-2">
              <h3 className="font-body-clean font-bold text-lg sm:text-xl text-black">
                Project Context
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                The project was part of the Communication Design curriculum,
                under Publication Design. The brief was to create a children’s
                storybook where, rather than beginning with a fixed story, the
                process started with visual experimentation, allowing characters
                and their forms to guide the development of the narrative.
              </p>
            </div>

            <div className="border-l-4 border-[#003CD7] pl-6 py-1 space-y-2">
              <h3 className="font-body-clean font-bold text-lg sm:text-xl text-black">
                Project Objective
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                The objective was to explore how simple shapes and forms could
                be transformed into expressive characters and used to build a
                visual story. The project aimed to understand the process of
                storytelling, storyboarding and translating a narrative into a
                final illustrated publication.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CHARACTER EXPLORATION */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              Visual development
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#003CD7] tracking-tight">
              Character Exploration.
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              The process began with experimenting with random shapes and forms.
              By adding simple facial features and expressions, these abstract
              forms gradually transformed into unique characters. This
              exploration helped establish the characters that would later
              become the foundation of the story.
            </p>
          </div>

          <div className="w-full max-w-5xl">
            <div
              onClick={() => triggerUpload('ktg-visual-1')}
              className="w-full aspect-[979/745] rounded-2xl cursor-pointer relative overflow-hidden bg-white group"
              title="Click to replace character exploration artwork"
            >
              <img
                src={assets['ktg-visual-1'] || DEFAULT_CHARACTER_IMAGE}
                alt="The Kindness that Glowed — Character exploration sketches"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/75 text-white text-xs">
                  Replace Photo
                </span>
                {Boolean(assets['ktg-visual-1']) && (
                  <button
                    type="button"
                    onClick={(e) => resetAsset('ktg-visual-1', e)}
                    className="p-1.5 rounded-lg bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. STORY DEVELOPMENT & STORYBOARDING */}
        <section className="space-y-10">
          <div className="max-w-4xl space-y-6">
            <span className="text-xs sm:text-sm text-black/55 block">
              Narrative &amp; pacing
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#003CD7] tracking-tight">
              Story Development &amp; Storyboarding.
            </h2>
            <div className="space-y-5 text-base sm:text-lg text-black/85 leading-relaxed">
              <p>
                The Kindness That Glowed follows Ghostie, a little ghost who feels
                lonely because he is different from his family. One night, he
                encounters a tiny glowing heart that teaches him how kindness can
                bring happiness and warmth. Inspired by this experience, Ghostie
                shares the message with his family, showing how a little kindness
                can brighten the world.
              </p>
              <p>
                Once the story was developed, it was translated into a visual
                sequence through storyboarding. This helped plan the scenes,
                character interactions and flow of the narrative before moving on
                to the final illustrated book.
              </p>
            </div>
          </div>

          <div className="w-full">
            <div
              onClick={() => triggerUpload('ktg-storyboard')}
              className="w-full aspect-[1854/445] cursor-pointer relative overflow-hidden bg-white group"
              title="Click to replace storyboard artwork"
            >
              <img
                src={assets['ktg-storyboard'] || DEFAULT_STORYBOARD_IMAGE}
                alt="The Kindness that Glowed — Visual storyboard sequence"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/75 text-white text-xs">
                  Replace Photo
                </span>
                {Boolean(assets['ktg-storyboard']) && (
                  <button
                    type="button"
                    onClick={(e) => resetAsset('ktg-storyboard', e)}
                    className="p-1.5 rounded-lg bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. PUBLICATION SPREADS */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              Book layout
            </span>
            <h2 className="font-body-clean font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              <span className="text-black">Inside the </span>
              <span className="relative inline-block text-[#003CD7] pb-2 sm:pb-3 lg:pb-[0.14em]">
                Storybook.
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
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              Take a look inside the story of a little ghost and discover how
              kindness brings a little light into the world.
            </p>
          </div>

          <StorybookFlipbook pdfUrl="/assets/aistudio/FINAL_STORYBOOK_DOUBLE_SPREAD_WITHOUT_BLEED_883eac02.pdf" />
        </section>

        {/* Bottom Full-Page Footer Navigation */}
        <footer className="pt-12 border-t border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => onSelectProject(prevProject)}
            className="inline-flex items-center gap-2 text-black/70 hover:text-[#003CD7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{prevProject.number} · {prevProject.title}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="font-medium text-black hover:text-[#003CD7] transition-colors cursor-pointer"
          >
            Back to Portfolio
          </button>

          <button
            type="button"
            onClick={() => onSelectProject(nextProject)}
            className="inline-flex items-center gap-2 text-black/70 hover:text-[#003CD7] transition-colors cursor-pointer"
          >
            <span>{nextProject.number} · {nextProject.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </main>
    </div>
  );
};
