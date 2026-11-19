import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Project } from '../data/projects';
import { attachTightSpringMotion } from '../utils/springMotion';

interface TypeDesignCaseStudyProps {
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  prevProject: Project;
  nextProject: Project;
}

const DEFAULT_HERO_IMAGE = '/assets/aistudio/image_9e4e2252.png';
const DEFAULT_SKETCH_IMAGE = '/assets/aistudio/type_sketch_9b7dfbb5.png';
const DEFAULT_ALPHABET_IMAGE = '/assets/aistudio/type_9fa6eada.png';

const POSTER_SLOTS = [
  {
    id: 'td-poster-1',
    src: '/assets/aistudio/type_poster_30961f0d.png',
    title: 'Book Fair Poster Application',
  },
  {
    id: 'td-poster-2',
    src: '/assets/aistudio/type_play_d9f4a9fb.png',
    title: 'PLAY Poster Application',
  },
  {
    id: 'td-poster-3',
    src: '/assets/aistudio/Screenshot_2026-11-18_193940_5dc36c8a.png',
    title: 'Doraemon Poster Application',
  },
  {
    id: 'td-poster-4',
    src: '/assets/aistudio/type_implement_alien_5bdb79ea.jpg',
    title: 'Alien Poster Application',
  },
];

const ALL_SLOT_IDS = [
  'td-hero',
  'td-sketch',
  'td-alphabet',
  ...POSTER_SLOTS.map((slot) => slot.id),
];

export const TypeDesignCaseStudy: React.FC<TypeDesignCaseStudyProps> = ({
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
            // Quota fallback
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
            Type Design
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

      {/* Hero Section — Full-bleed right photo aligned with header & metadata dividers */}
      <section className="w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[41%_59%] items-stretch">
          {/* Left: Typography-led Cover Header */}
          <div
            ref={heroTitleRef}
            className="px-6 sm:px-10 md:px-14 lg:pl-16 xl:pl-[max(5rem,calc((100vw-1680px)/2+5rem))] lg:pr-8 xl:pr-10 py-10 sm:py-12 lg:py-12 xl:py-14 flex flex-col justify-center items-start will-change-transform"
          >
            <div className="inline-flex items-center gap-3 sm:gap-4 text-[#003CD7] font-body-clean text-xs sm:text-sm tracking-[0.18em] uppercase mb-6">
              <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
              <span>Individual Project | 2024</span>
            </div>

            <h1 className="font-bubbly font-bold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[50px] xl:text-[64px] 2xl:text-[78px] leading-[1.04] tracking-[-0.01em] text-black -ml-[0.04em]">
              <span className="block font-bubbly">TYPE</span>
              <span className="block font-bubbly text-[#003CD7]">DESIGN</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-black/80 font-normal leading-relaxed">
              Display Typeface Design
            </p>
          </div>

          {/* Right: Full-bleed Hero Artwork filling space beside Title */}
          <div className="w-full px-6 sm:px-10 md:px-14 lg:px-0 pb-10 lg:pb-0 flex">
            <div
              onClick={() => triggerUpload('td-hero')}
              className="w-full h-full lg:aspect-[2/1] rounded-2xl lg:rounded-none border border-black/10 lg:border-0 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-black group"
              title="Click to replace typeface cover artwork"
            >
              <img
                src={assets['td-hero'] || DEFAULT_HERO_IMAGE}
                alt="Type Design — PLAY display typeface cover artwork"
                className="w-full h-auto lg:h-full object-cover object-center block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px]">
                  Replace
                </span>
                {Boolean(assets['td-hero']) && (
                  <button
                    type="button"
                    onClick={(e) => resetAsset('td-hero', e)}
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
                  2024
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Software</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Adobe Illustrator
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROJECT OVERVIEW */}
        <section className="max-w-4xl space-y-6">
          <span className="text-xs sm:text-sm text-black/55 block">
            Project overview
          </span>
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            Developing <span className="text-[#003CD7]">a Display Typeface.</span>
          </h2>
          <div className="space-y-5 text-base sm:text-lg text-black/85 leading-relaxed">
            <p>
              This project involved designing a display typeface by
              exploring different letterforms, shapes and visual structures.
              Through experimentation with form, proportion and detailing, I
              developed a distinctive typeface with a consistent visual
              character, eventually extending the design across the complete A–Z
              alphabet.
            </p>
          </div>
        </section>

        {/* THE BRIEF */}
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
                As part of an individual academic project, the focus was on
                understanding how letterforms can be constructed and transformed
                into a cohesive typeface. The process began with rough sketches
                and explorations of different geometric forms, gradually moving
                towards a selected design direction. A recurring teardrop
                element became one of the defining features of the final
                typeface.
              </p>
            </div>

            <div className="border-l-4 border-[#003CD7] pl-6 py-1 space-y-2">
              <h3 className="font-body-clean font-bold text-lg sm:text-xl text-black">
                Objective
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                The objective was to explore the process of typeface creation,
                from initial letterform experimentation to developing a complete
                alphabet. The project aimed to understand consistency,
                proportion, visual balance and the relationship between
                individual letterforms while creating a distinctive display
                typeface.
              </p>
            </div>
          </div>
        </section>

        {/* 3. INITIAL EXPLORATION */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#003CD7] tracking-tight">
              Initial Explorations.
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              The process began with exploring different ways of constructing
              letterforms through rough sketches. I experimented with geometric
              shapes, angular structures, proportions and curves to explore
              different visual possibilities. These early explorations helped me
              understand how individual forms could be developed into a
              consistent display typeface.
            </p>
          </div>

          <div className="w-full">
            <div
              onClick={() => triggerUpload('td-sketch')}
              className="w-full aspect-[1854/558] cursor-pointer relative overflow-hidden bg-white group"
              title="Click to replace initial exploration sketch"
            >
              <img
                src={assets['td-sketch'] || DEFAULT_SKETCH_IMAGE}
                alt="Type Design — Initial letterform exploration sketches"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 bg-black/75 text-white text-xs">
                  Replace Photo
                </span>
                {Boolean(assets['td-sketch']) && (
                  <button
                    type="button"
                    onClick={(e) => resetAsset('td-sketch', e)}
                    className="p-1.5 bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm sm:text-base text-black/80 leading-relaxed">
              After exploring different letterform possibilities, I chose the
              teardrop shape as the defining element of my typeface. Its
              distinctive form added a unique visual character to the
              letterforms and became a recurring feature throughout the design.
              I incorporated this element into different letters while
              maintaining a balance between individuality and consistency,
              creating a recognisable visual identity for the typeface.
            </p>
          </div>
        </section>

        {/* 5. THE COMPLETE TYPEFACE */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              The complete typeface
            </span>
            <h2 className="font-body-clean font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              <span className="text-black">Complete </span>
              <span className="relative inline-block text-[#003CD7] pb-2 sm:pb-3 lg:pb-[0.14em]">
                A–Z Alphabet.
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
              Bringing together the explored letterforms and the defining
              teardrop element, the final typeface was developed into a complete
              A–Z alphabet. Each letter was designed to maintain a consistent
              visual style while retaining its own form and character. The
              result is an original display typeface built around distinctive
              shapes and details.
            </p>
          </div>

          <div className="w-full">
            <div
              onClick={() => triggerUpload('td-alphabet')}
              className="w-full aspect-[1269/736] cursor-pointer relative overflow-hidden bg-white group"
              title="Click to replace complete A–Z alphabet artwork"
            >
              <img
                src={assets['td-alphabet'] || DEFAULT_ALPHABET_IMAGE}
                alt="Complete A–Z display typeface alphabet"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 bg-black/75 text-white text-xs">
                  Replace Photo
                </span>
                {Boolean(assets['td-alphabet']) && (
                  <button
                    type="button"
                    onClick={(e) => resetAsset('td-alphabet', e)}
                    className="p-1.5 bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 6. TYPOGRAPHY APPLICATIONS */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              Typography applications
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              <span className="text-black">Type in </span>
              <span className="text-[#FEBC00]">Context.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              The typeface was applied across four different poster designs to
              explore its use in different themes and visual settings.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <div className="flex w-max animate-marquee-scroll">
              {[0, 1].map((dupIdx) => (
                <div key={dupIdx} className="flex shrink-0 gap-5 sm:gap-6 pr-5 sm:pr-6">
                  {[...POSTER_SLOTS, ...POSTER_SLOTS].map((slot, itemIdx) => {
                    const hasCustomOverride = Boolean(assets[slot.id]);
                    const photoSrc = assets[slot.id] || slot.src;

                    return (
                      <div
                        key={`${dupIdx}-${itemIdx}-${slot.id}`}
                        onClick={() => triggerUpload(slot.id)}
                        className="w-[230px] sm:w-[270px] lg:w-[310px] aspect-[3508/4961] shrink-0 rounded-2xl border border-black/10 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-[#f8f8f5] group"
                      >
                        <img
                          src={photoSrc}
                          alt={slot.title}
                          draggable={false}
                          className="w-full h-full object-cover"
                        />
                        {hasCustomOverride ? (
                          <button
                            type="button"
                            onClick={(e) => resetAsset(slot.id, e)}
                            className="absolute top-3 right-3 p-2 rounded-lg bg-black/75 text-white text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                          </button>
                        ) : (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Replace
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
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
