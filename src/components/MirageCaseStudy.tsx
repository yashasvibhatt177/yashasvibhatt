import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Project } from '../data/projects';
import { attachTightSpringMotion } from '../utils/springMotion';

interface MirageCaseStudyProps {
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  prevProject: Project;
  nextProject: Project;
}

const DEFAULT_HERO_IMAGE = '/assets/aistudio/mirage_cover_50994d9c.png';
const DEFAULT_PREPROD_IMAGE = '/assets/aistudio/stop_motion_moodboard_7690eea2.png';
const DEFAULT_LAYOUT_IMAGE = '/assets/aistudio/Screenshot_2026-11-18_131730_0b415195.png';
const DEFAULT_SET_PROCESS_IMAGE = '/assets/aistudio/mirage_process_313710c3.png';
const DEFAULT_FINAL_SET_IMAGE = '/assets/aistudio/stopmotion_final_set_87c7c22a.png';

const CONTRIBUTIONS = [
  {
    num: '01',
    title: 'Set Design',
    desc: 'Led the set design department and worked on creating the overall environment for the film.',
  },
  {
    num: '02',
    title: 'Set Construction',
    desc: 'Worked on building the mountains, terrain and Japanese-inspired architectural elements, along with the final detailing and set preparation.',
  },
];

const DEFAULT_SET_BTS_PHOTOS = [
  {
    id: 'mirage-set-2',
    src: '/assets/aistudio/PXL_20260302_045244532_83fac09b.jpg',
    title: 'Newspaper mountain cone shaping',
  },
  {
    id: 'mirage-set-3',
    src: '/assets/aistudio/PXL_20260223_093712874_f3beb1f5.jpg',
    title: 'White terrain and character scale check',
  },
  {
    id: 'mirage-set-4',
    src: '/assets/aistudio/PXL_20260309_084341879_d6a11622.jpg',
    title: 'Tissue and Fevicol mountain sculpting',
  },
  {
    id: 'mirage-set-5',
    src: '/assets/aistudio/PXL_20260318_054934782_19585507.jpg',
    title: 'Painted rock textures and terrain detailing',
  },
  {
    id: 'mirage-set-6',
    src: '/assets/aistudio/PXL_20260320_061718510_51003a24.jpg',
    title: 'Studio lighting and camera rig setup',
  },
  {
    id: 'mirage-set-7',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_2.40.10_PM_567d1c86.jpeg',
    title: 'Miniature set blocking with torii gate',
  },
  {
    id: 'mirage-set-8',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_2.40.10_PM__1__45f5d7e2.jpeg',
    title: 'Stop-motion frame capture on set',
  },
];

export const MirageCaseStudy: React.FC<MirageCaseStudyProps> = ({
  onBack,
  onSelectProject,
  prevProject,
  nextProject,
}) => {
  const [photos, setPhotos] = useState<Record<string, string>>({});

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

    const savedPhotos: Record<string, string> = {};
    [
      'mirage-hero',
      'mirage-preprod',
      'mirage-layout',
      'mirage-set-1',
      'mirage-final-set',
      ...DEFAULT_SET_BTS_PHOTOS.map((s) => s.id),
    ].forEach((id) => {
      try {
        const val = localStorage.getItem(`yashasvi_${id}`);
        if (val) savedPhotos[id] = val;
      } catch {
        // Ignore storage errors
      }
    });
    setPhotos(savedPhotos);
  }, []);

  const triggerPhotoUpload = (slotId: string) => {
    uploadTargetRef.current = slotId;
    photoInputRef.current?.click();
  };

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = uploadTargetRef.current;
    if (file && slotId && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setPhotos((prev) => ({ ...prev, [slotId]: result }));
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

  const resetPhoto = (slotId: string, ev: React.MouseEvent) => {
    ev.stopPropagation();
    setPhotos((prev) => {
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

  const heroImageSrc = photos['mirage-hero'] || DEFAULT_HERO_IMAGE;
  const hasCustomHero = Boolean(photos['mirage-hero']);

  return (
    <div className="min-h-screen w-full bg-[#FFFFFD] text-black font-poppins">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoFile}
        className="hidden"
      />

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFD]/95 backdrop-blur-sm border-b border-black/10">
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-5 sm:py-6">
          <span className="font-poppins text-sm sm:text-base font-medium text-black">
            Mirage - Stop Motion Film
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
          {/* Left: Eyebrow, Title & Aligned Sub-line */}
          <div
            ref={heroTitleRef}
            className="px-6 sm:px-10 md:px-14 lg:pl-16 xl:pl-[max(5rem,calc((100vw-1680px)/2+5rem))] lg:pr-8 xl:pr-10 py-10 sm:py-12 lg:py-12 xl:py-14 flex flex-col justify-center items-start will-change-transform"
          >
            <div className="inline-flex items-center gap-3 sm:gap-4 text-[#003CD7] font-body-clean text-xs sm:text-sm tracking-[0.18em] uppercase mb-6">
              <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
              <span>College Project / Set Design / 2026</span>
            </div>

            <h1 className="font-bubbly font-bold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[50px] xl:text-[64px] 2xl:text-[78px] leading-[1.04] tracking-[-0.01em] text-black -ml-[0.04em]">
              <span className="block font-bubbly">MIRAGE</span>
              <span className="block font-bubbly text-[#003CD7]">STOP MOTION FILM</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-black/80 font-normal leading-relaxed">
              Lead Set Design
            </p>
          </div>

          {/* Right: Full-bleed Hero Photo filling space beside Title */}
          <div className="w-full px-6 sm:px-10 md:px-14 lg:px-0 pb-10 lg:pb-0 flex">
            <div
              onClick={() => triggerPhotoUpload('mirage-hero')}
              className="w-full h-full lg:aspect-[2/1] rounded-2xl lg:rounded-none border border-black/10 lg:border-0 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-[#f8f8f5] group"
              title="Click to replace hero photo"
            >
              <img
                src={heroImageSrc}
                alt="Mirage — Stop Motion Film miniature set"
                className="w-full h-auto lg:h-full object-cover object-center block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px]">
                  Replace
                </span>
                {hasCustomHero && (
                  <button
                    type="button"
                    onClick={(e) => resetPhoto('mirage-hero', e)}
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
        {/* Metadata Row: Context, Role, Year */}
        <section className="w-full">
          <div className="border-t border-black/15 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-black/15 py-6 gap-6 lg:gap-10">
              <div>
                <span className="text-xs text-black/50 block mb-1">Context</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  College Project
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Role</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Set designer
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Year</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  2026
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="max-w-4xl space-y-6">
          <span className="text-xs sm:text-sm text-black/55 block">
            Project overview
          </span>
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            Building the <span className="text-[#003CD7]">World of Mirage.</span>
          </h2>

          <div className="space-y-5 text-base sm:text-lg text-black/85 leading-relaxed">
            <p>
              As part of the Semester 6 Communication Design curriculum, we
              undertook a stop-motion film project, working in teams with each
              member taking on a specific role to simulate the functioning of a
              production house. The film follows a samurai and a cowboy whose
              paths collide in a conflict over a sacred relic. The project
              involved developing the narrative, designing and building the
              environment, and bringing the story to life through stop-motion
              animation and post-production.
            </p>
          </div>
        </section>

        {/* The Brief */}
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
                Project context
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                The project centred on creating a stop-motion film about a
                samurai and a cowboy who encounter each other in a battle over a
                sacred relic. From developing the story to designing and
                constructing the miniature environment, the project brought
                together different aspects of filmmaking. Working in designated
                production roles, we collaborated to build the visual world and
                bring the narrative to life through stop-motion animation.
              </p>
            </div>

            <div className="border-l-4 border-[#003CD7] pl-6 py-1 space-y-2">
              <h3 className="font-body-clean font-bold text-lg sm:text-xl text-black">
                Objective
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                The objective was to understand the filmmaking process through a
                production-house approach, where each team member took
                responsibility for a specific department. The project aimed to
                explore visual storytelling, environment and set design,
                physical model-making, and the technical process of creating a
                stop-motion film through teamwork and collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* Pre-production */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              Pre-production
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#003CD7] tracking-tight">
              Concept &amp; Set Exploration.
            </h2>
            <div className="space-y-3 pt-1">
              <p className="text-sm sm:text-base text-black/75 leading-relaxed">
                Inspired by Japanese landscapes and visual aesthetics, Mirage brings together two contrasting characters a samurai and a cowboy whose paths cross over a sacred relic. The story unfolds in a rugged, Japanese-inspired setting, creating a distinctive visual world for their confrontation.
              </p>
              <p className="text-sm sm:text-base text-black/75 leading-relaxed">
                The visual development began with moodboarding, exploring Japanese architecture, landscapes, natural textures, colour palettes and environmental elements. These references helped establish the visual direction for the set before moving into environment design and the physical construction of the miniature world.
              </p>
            </div>
          </div>

          <div className="w-full">
            <div
              onClick={() => triggerPhotoUpload('mirage-preprod')}
              className="w-full aspect-[16/9] border border-black/15 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-white group"
              title="Click to replace moodboard photo"
            >
              <img
                src={photos['mirage-preprod'] || DEFAULT_PREPROD_IMAGE}
                alt="Mirage — Concept and set exploration moodboard"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 bg-black/75 text-white text-xs">
                  Replace Photo
                </span>
                {Boolean(photos['mirage-preprod']) && (
                  <button
                    type="button"
                    onClick={(e) => resetPhoto('mirage-preprod', e)}
                    className="p-1.5 bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-black/75 leading-relaxed">
                After establishing the visual direction through moodboarding, We began translating the references into an initial set layout.
              </p>
            </div>

            <div className="lg:col-span-7 w-full">
              <div
                onClick={() => triggerPhotoUpload('mirage-layout')}
                className="w-full aspect-[3/2] border border-black/15 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-white group"
                title="Click to replace set layout photo"
              >
                <img
                  src={photos['mirage-layout'] || DEFAULT_LAYOUT_IMAGE}
                  alt="Mirage — Initial set layout sketch"
                  className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 bg-black/75 text-white text-xs">
                    Replace Photo
                  </span>
                  {Boolean(photos['mirage-layout']) && (
                    <button
                      type="button"
                      onClick={(e) => resetPhoto('mirage-layout', e)}
                      className="p-1.5 bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
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

        {/* Set Execution */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              Set execution
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
              Building the <span className="text-[#003CD7]">Miniature Set.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/75 leading-relaxed pt-1">
              Behind-the-scenes set construction, texture work, and miniature
              fabrication process.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-2.5">
              <div
                onClick={() => triggerPhotoUpload('mirage-set-1')}
                className="w-full aspect-[1854/974] cursor-pointer relative overflow-hidden bg-white group"
                title="Click to replace set construction photo"
              >
                <img
                  src={photos['mirage-set-1'] || DEFAULT_SET_PROCESS_IMAGE}
                  alt="Mirage — Behind-the-scenes miniature set construction process"
                  className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {!photos['mirage-set-1'] && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="hidden lg:block lg:absolute lg:top-0 lg:right-0 lg:w-[32.5%] lg:h-full lg:pt-3 lg:pr-5 lg:pl-2 cursor-auto select-text"
                  >
                    <div
                      className="float-left w-[48%] h-full"
                      style={{
                        shapeOutside:
                          'polygon(0 27%, 73% 27%, 73% 51%, 100% 51%, 100% 100%, 0 100%)',
                      }}
                      aria-hidden="true"
                    />
                    <p className="text-[11.5px] xl:text-[13px] text-black/80 leading-[1.55]">
                      The mountain formations were created by first shaping large paper cones, which were filled with crumpled newspaper to build volume and form the rocky structures. The entire framework was secured with tape, then covered with tissue paper and Fevicol to harden the surface before painting. The terrain followed a similar process, beginning with a plywood base topped with PVC sheets, followed by layers of crumpled newspaper, tissue paper and Fevicol. Once hardened, the surfaces were painted and detailed to create the rugged mountainous landscape.
                    </p>
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 bg-black/75 text-white text-xs">
                    Replace Photo
                  </span>
                  {Boolean(photos['mirage-set-1']) && (
                    <button
                      type="button"
                      onClick={(e) => resetPhoto('mirage-set-1', e)}
                      className="p-1.5 bg-black/75 text-white text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <p className="lg:hidden text-sm sm:text-base text-black/75 leading-relaxed pt-1">
                The mountain formations were created by first shaping large paper cones, which were filled with crumpled newspaper to build volume and form the rocky structures. The entire framework was secured with tape, then covered with tissue paper and Fevicol to harden the surface before painting. The terrain followed a similar process, beginning with a plywood base topped with PVC sheets, followed by layers of crumpled newspaper, tissue paper and Fevicol. Once hardened, the surfaces were painted and detailed to create the rugged mountainous landscape.
              </p>
              <p className="text-xs text-black/70">Behind the scenes</p>
            </div>

            <div className="relative w-full overflow-hidden py-2">
              <div className="flex w-max animate-marquee-scroll">
                {[0, 1].map((dupIdx) => (
                  <div key={dupIdx} className="flex shrink-0 gap-5 sm:gap-6 pr-5 sm:pr-6">
                    {DEFAULT_SET_BTS_PHOTOS.map((slot) => {
                      const hasCustomOverride = Boolean(photos[slot.id]);
                      const photoSrc = photos[slot.id] || slot.src;

                      return (
                        <div
                          key={`${dupIdx}-${slot.id}`}
                          onClick={() => triggerPhotoUpload(slot.id)}
                          className="w-[260px] sm:w-[320px] lg:w-[370px] aspect-[4/3] shrink-0 rounded-2xl border border-black/10 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-[#f8f8f5] group"
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
                              onClick={(e) => resetPhoto(slot.id, e)}
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
          </div>
        </section>

        {/* Final Output */}
        <section className="space-y-10">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm text-black/55 block">
              Final output
            </span>
            <h2 className="font-body-clean font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              <span className="relative inline-block text-[#003CD7] pb-2 sm:pb-3 lg:pb-[0.14em]">
                Final Set.
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

          <div className="w-full">
            <div
              onClick={() => triggerPhotoUpload('mirage-final-set')}
              className="w-full aspect-[1854/2098] cursor-pointer relative overflow-hidden bg-white group"
              title="Click to replace final set photo"
            >
              <img
                src={photos['mirage-final-set'] || DEFAULT_FINAL_SET_IMAGE}
                alt="Final Set"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 bg-black/75 text-white text-xs">
                  Replace Photo
                </span>
                {Boolean(photos['mirage-final-set']) && (
                  <button
                    type="button"
                    onClick={(e) => resetPhoto('mirage-final-set', e)}
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

        {/* My contribution */}
        <section className="max-w-4xl space-y-10">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm text-black/55 block">
              My contribution
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              <span className="text-black">What I </span>
              <span className="text-[#FEBC00]">Worked On.</span>
            </h2>
          </div>

          <div className="space-y-8 divide-y divide-black/10">
            {CONTRIBUTIONS.map((item) => (
              <div key={item.num} className="pt-8 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline">
                <span className="sm:col-span-2 text-xs sm:text-sm font-semibold text-black/45">
                  {item.num}
                </span>
                <div className="sm:col-span-10 space-y-1.5">
                  <h3 className="font-body-clean font-extrabold text-2xl sm:text-3xl text-black tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-black/65">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What I Took Away */}
        <section className="max-w-4xl space-y-5 pt-4">
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            What I <span className="text-[#FEBC00]">Took Away.</span>
          </h2>
          <p className="text-base sm:text-lg text-black/80 leading-relaxed">
            This project gave me hands-on experience in translating visual
            references into a physical environment. I learned about miniature
            construction, material experimentation, texturing and the importance
            of scale and detailing. More importantly, leading the set design
            process taught me how to coordinate with a team, solve practical
            challenges and understand the role of environment design in visual
            storytelling.
          </p>
        </section>

        {/* Team */}
        <section className="space-y-8 pt-4">
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#003CD7] tracking-tight">
            Team.
          </h2>

          <div className="border-t border-black/15 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-black/15 py-6 gap-6 lg:gap-10">
              <div>
                <span className="text-xs text-black/50 block mb-1">Set Designer</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Yashasvi Bhatt
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Lead DP and Editor</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Divyarajsinh Vihol
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Story and Concept</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Bhavya Desai
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Animator</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Taanya Fernandez
                </span>
              </div>
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
