import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Project } from '../data/projects';
import { PerspectiveCarousel } from './ui/perspective-carousel';
import { attachTightSpringMotion } from '../utils/springMotion';

const DEFAULT_HERO_PHOTO = '/assets/aistudio/real_estate_cover_inside_240cfae2.png';

interface RealEstateCaseStudyProps {
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  prevProject: Project;
  nextProject: Project;
}

const REELS = [
  {
    num: '01',
    title: 'Navratri Campaign Reel',
    videoSrc:
      '/assets/aistudio/Adobe_Express_-_savefromins.com_Big_joys._Bigger_spaces._The_grandest_celebrations._____This_Navratri__step_out_of_compromised_spaces_and_step_into_a_home_that_is_built_for_your_grandest_moments._Because_a_moth_ef67071f.mp4',
  },
  {
    num: '02',
    title: 'Rakshabandhan Campaign Reel',
    videoSrc:
      '/assets/aistudio/Adobe_Express_-_savefromins.com_Some_return_gifts_aren_t_bought__they_are_earned._____From_fulfilling_every_childhood_demand_to_silently_compromising_on_his_own_dreams__a_brother_s_love_rarely_asks_for_anything_a601970c.mp4',
  },
  {
    num: '03',
    title: 'Janmashtami Campaign Reel',
    videoSrc:
      '/assets/aistudio/Adobe_Express_-_savefromins.com_Every__Natkhat_Kanhaiya__deserves_their_own_open_sky.____This_Janmashtami__step_into_a_grand_3BHK_lifestyle_where_your_family_s_biggest_celebrations_can_finally_unfold_without_lim_ed3d848a.mp4',
  },
  {
    num: '04',
    title: 'Ganesh Chaturthi Campaign Reel',
    videoSrc:
      '/assets/aistudio/Adobe_Express_-_savefromins.com_Big_dreams_need_a_bigger_space_to_grow._____Every_big_ambition_starts_with_a_small_step._For_this_father-daughter_duo__it_started_with_finding_the_perfect_home_to_welcome_Bappa_a_cad04728.mp4',
  },
  {
    num: '05',
    title: 'Father & Son Campaign Reel',
    videoSrc:
      '/assets/aistudio/Adobe_Express_-_savefromins.com_Every_father_s_anger_is_just_love_and_worry_in_disguise.____Watch_this_beautiful_moment_where_a_father_s_financial_stress_turns_into_overwhelming_pride_when_he_realizes_his_son_ha_21bc9cac.mp4',
  },
];

const CONTRIBUTIONS = [
  {
    num: '01',
    title: 'Moodboards & Visual References',
    desc: 'Prepared the moodboards and visual references for the campaign.',
  },
  {
    num: '02',
    title: 'Props & Sourcing',
    desc: 'Sourced and arranged props for the shoot.',
  },
  {
    num: '03',
    title: 'Set Preparation',
    desc: 'Prepared and styled the sets before filming.',
  },
  {
    num: '04',
    title: 'On-set Art Direction Assistance',
    desc: 'Assisted the art direction team during the shoot.',
  },
];

const DEFAULT_PREPROD_ITEMS = [
  { src: '/assets/aistudio/Screenshot_2026-11-16_213317_6b486fae.png', title: 'Reference 01' },
  { src: '/assets/aistudio/Screenshot_2026-11-16_213521_c1ec1dde.png', title: 'Reference 02' },
  { src: '/assets/aistudio/Screenshot_2026-11-16_213505_c28bb2d8.png', title: 'Reference 03' },
  { src: '/assets/aistudio/Screenshot_2026-11-16_213444_30c5a31b.png', title: 'Reference 04' },
  { src: '/assets/aistudio/Screenshot_2026-11-16_213425_bb8c5d7e.png', title: 'Reference 05' },
  { src: '/assets/aistudio/Screenshot_2026-11-16_213412_8ecf2bca.png', title: 'Reference 06' },
  { src: '/assets/aistudio/Screenshot_2026-11-16_213337_285cb55a.png', title: 'Reference 07' },
];

const DEFAULT_ON_SET_PHOTOS = [
  {
    id: 'onset-1',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_12.41.31_AM__1__fed78345.jpeg',
    title: 'On set 01 — Ganpati floral drape setup',
  },
  {
    id: 'onset-2',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_12.41.31_AM_a405743b.jpeg',
    title: 'On set 02 — Living room lighting rig and sofa blocking',
  },
  {
    id: 'onset-3',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_12.41.32_AM_5fc6ee03.jpeg',
    title: 'On set 03 — Dahi handi marigold frame and crew',
  },
  {
    id: 'onset-4',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_12.41.34_AM__1__7581b29b.jpeg',
    title: 'On set 04 — Pre-lighting Krishna scene setup',
  },
  {
    id: 'onset-5',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_12.41.34_AM_368a94ba.jpeg',
    title: 'On set 05 — Silk diffuser scrim and lighting rig',
  },
  {
    id: 'onset-6',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_12.41.30_AM_587c578f.jpeg',
    title: 'On set 06 — Living room softbox and set dressing',
  },
];

export const RealEstateCaseStudy: React.FC<RealEstateCaseStudyProps> = ({
  onBack,
  onSelectProject,
  prevProject,
  nextProject,
}) => {
  const [onSetPhotos, setOnSetPhotos] = useState<Record<string, string>>({});
  const [reelMedia, setReelMedia] = useState<Record<string, { type: 'video' | 'image'; src: string }>>({});

  const photoInputRef = useRef<HTMLInputElement>(null);
  const reelInputRef = useRef<HTMLInputElement>(null);
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
      're-hero',
      ...DEFAULT_ON_SET_PHOTOS.map((slot) => slot.id),
      ...DEFAULT_PREPROD_ITEMS.map((_, i) => `preprod-${i}`),
    ].forEach((id) => {
      try {
        const val = localStorage.getItem(`yashasvi_re_${id}`);
        if (val) savedPhotos[id] = val;
      } catch {
        // Ignore storage errors
      }
    });
    setOnSetPhotos(savedPhotos);
  }, []);

  const triggerOnSetUpload = (slotId: string) => {
    uploadTargetRef.current = slotId;
    photoInputRef.current?.click();
  };

  const handleOnSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = uploadTargetRef.current;
    if (file && slotId && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setOnSetPhotos((prev) => ({ ...prev, [slotId]: result }));
          try {
            localStorage.setItem(`yashasvi_re_${slotId}`, result);
          } catch {
            // Quota fallback
          }
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const resetOnSetPhoto = (slotId: string, ev: React.MouseEvent) => {
    ev.stopPropagation();
    setOnSetPhotos((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    try {
      localStorage.removeItem(`yashasvi_re_${slotId}`);
    } catch {
      // Ignore
    }
  };

  const triggerReelUpload = (reelNum: string) => {
    uploadTargetRef.current = reelNum;
    reelInputRef.current?.click();
  };

  const handleReelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reelNum = uploadTargetRef.current;
    if (file && reelNum) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      setReelMedia((prev) => ({
        ...prev,
        [reelNum]: { type: isVideo ? 'video' : 'image', src: url },
      }));
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFD] text-black font-poppins">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handleOnSetFile}
        className="hidden"
      />
      <input
        ref={reelInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleReelFile}
        className="hidden"
      />

      {/* Sticky Top Header matching Page 1 of PDF */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFD]/95 backdrop-blur-sm border-b border-black/10">
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-5 sm:py-6">
          <span className="font-poppins text-sm sm:text-base font-medium text-black">
            Real Estate Campaign
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
              <span>Commercial Production / 2026</span>
            </div>

            <h1 className="font-bubbly font-bold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[50px] xl:text-[64px] 2xl:text-[78px] leading-[1.04] tracking-[-0.01em] text-black -ml-[0.04em]">
              <span className="block font-bubbly">REAL ESTATE</span>
              <span className="block font-bubbly text-[#003CD7]">CAMPAIGN</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-black/80 font-normal leading-relaxed">
              Assistant Art Direction
            </p>
          </div>

          {/* Right: Full-bleed Hero Photo filling space beside Title */}
          <div className="w-full px-6 sm:px-10 md:px-14 lg:px-0 pb-10 lg:pb-0 flex">
            <div
              onClick={() => triggerOnSetUpload('re-hero')}
              className="w-full h-full lg:aspect-[1510/647] rounded-2xl lg:rounded-none border border-black/10 lg:border-0 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-[#f8f8f5] group"
            >
              <img
                src={onSetPhotos['re-hero'] || DEFAULT_HERO_PHOTO}
                alt="Real Estate Campaign — Rameshwar City"
                className="w-full h-auto lg:h-full object-cover object-center block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {onSetPhotos['re-hero'] ? (
                <button
                  type="button"
                  onClick={(e) => resetOnSetPhoto('re-hero', e)}
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
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-0 pb-24 space-y-20 sm:space-y-28">
        {/* 6 Metadata Items: 3 in a row, 2 rows (2 items per column) */}
        <section className="w-full">
          <div className="border-t border-black/15 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-black/15 py-6 gap-6 lg:gap-10">
              <div>
                <span className="text-xs text-black/50 block mb-1">Client</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Rameshwar City
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Production House</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Indie Production
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Year</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  2026
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-black/15 py-6 gap-6 lg:gap-10">
              <div>
                <span className="text-xs text-black/50 block mb-1">My Involvement</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  Assistant Art Director
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Deliverables</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  5 Instagram Reels
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Project Type</span>
                <span className="text-base sm:text-lg font-semibold text-black leading-snug block">
                  Commercial Production / Real Estate Marketing / Social Media Campaign
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 2: Bringing Spaces to Life */}
        <section className="max-w-4xl space-y-6">
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            Bringing <span className="text-[#003CD7]">Spaces to Life.</span>
          </h2>

          <div className="space-y-5 text-base sm:text-lg text-black/85 leading-relaxed">
            <p>
              A commercial social media campaign created for Rameshwar City,
              featuring five Instagram reels developed for real estate
              marketing.
            </p>
            <p>
              As part of the art direction team at Indie Production, I
              contributed to the pre-production and on-set execution of the
              campaign. My involvement included moodboard development, prop
              sourcing, set preparation and assisting with the visual
              execution during the shoot.
            </p>
            <p>
              The experience gave me an opportunity to explore how visual
              concepts are translated into physical setups and eventually into
              engaging digital content.
            </p>
          </div>
        </section>

        {/* PAGE 3: The Brief — Understanding the Project */}
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
                Campaign context
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                Rameshwar City is a real estate project for which a series of
                five Instagram reels were produced as part of its social media
                marketing campaign. The project involved creating visual content
                to present the property through short-form videos, bringing
                together art direction, set preparation and on-set production.
              </p>
            </div>

            <div className="border-l-4 border-[#003CD7] pl-6 py-1 space-y-2">
              <h3 className="font-body-clean font-bold text-lg sm:text-xl text-black">
                Objective
              </h3>
              <p className="text-sm sm:text-base text-black/80 leading-relaxed">
                To develop five engaging Instagram reels that showcase Rameshwar
                City through visually planned and well-executed content. The
                focus was on translating the campaign requirements into
                compelling visual setups through thoughtful prop selection, set
                styling and art direction.
              </p>
            </div>
          </div>
        </section>

        {/* PAGES 3-5: Pre-production — Before the Cameras Rolled */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              Pre-production
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
              Before the <span className="text-[#003CD7]">Cameras Rolled.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              Moodboards and visual references set the look of a campaign before
              anything is built. These are the references I prepared during
              pre-production.
            </p>
          </div>

          <PerspectiveCarousel
            items={DEFAULT_PREPROD_ITEMS.map((item, idx) => ({
              src: onSetPhotos[`preprod-${idx}`] || item.src,
              title: item.title,
            }))}
            defaultActiveIndex={1}
            slideWidth={260}
            onReplaceSlide={(idx) => triggerOnSetUpload(`preprod-${idx}`)}
            className="text-black"
          />
        </section>

        {/* PAGES 5-6: On-set execution — From Preparation to Production */}
        <section className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              On-set execution
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
              From <span className="text-[#003CD7]">Preparation to Production.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              During the shoot I was on set as part of the art direction team,
              preparing and supporting the visual setup as filming progressed.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <div className="flex w-max animate-marquee-scroll">
              {[0, 1].map((dupIdx) => (
                <div key={dupIdx} className="flex shrink-0 gap-5 sm:gap-6 pr-5 sm:pr-6">
                  {DEFAULT_ON_SET_PHOTOS.map((slot) => {
                    const hasCustomOverride = Boolean(onSetPhotos[slot.id]);
                    const photoSrc = onSetPhotos[slot.id] || slot.src;

                    return (
                      <div
                        key={`${dupIdx}-${slot.id}`}
                        onClick={() => triggerOnSetUpload(slot.id)}
                        className="w-[210px] sm:w-[250px] lg:w-[280px] aspect-[3/4] shrink-0 rounded-2xl border border-black/10 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-[#f8f8f5] group"
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
                            onClick={(e) => resetOnSetPhoto(slot.id, e)}
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

        {/* PAGES 6-9: Final outputs — Five Reels. One Campaign. */}
        <section className="space-y-10">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm text-black/55 block">
              Final outputs
            </span>
            <h2 className="font-body-clean font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              <span className="block text-black">Five Reels.</span>
              <span className="block text-[#FEBC00]">One Campaign.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6 w-full">
            {REELS.map((reel) => {
              const customMedia = reelMedia[reel.num];
              const isImage = customMedia?.type === 'image';
              const mediaSrc = customMedia?.src || reel.videoSrc;

              return (
                <div key={reel.num} className="space-y-3">
                  <div className="w-full aspect-[9/16] rounded-2xl border border-black/10 bg-black relative overflow-hidden group">
                    {isImage ? (
                      <img
                        src={mediaSrc}
                        alt={reel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={`${mediaSrc}#t=0.05`}
                        aria-label={reel.title}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => triggerReelUpload(reel.num)}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Replace
                    </button>
                  </div>

                  <div>
                    <span className="font-body-clean font-extrabold text-2xl sm:text-3xl text-[#FEBC00] block leading-none">
                      {reel.num}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PAGES 9-10: My contribution — What I Worked On */}
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

        {/* PAGE 10: What I Took Away */}
        <section className="max-w-4xl space-y-5 pt-4">
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
            What I <span className="text-[#FEBC00]">Took Away.</span>
          </h2>
          <p className="text-base sm:text-lg text-black/80 leading-relaxed">
            Working on the Rameshwar City campaign strengthened my understanding
            of how pre-production research and moodboarding translate directly
            into spatial storytelling on set. From sourcing culturally resonant
            props to adapting set styling quickly between five distinct reel
            setups, I learned how thoughtful visual preparation brings warmth,
            authenticity, and clarity to commercial real estate narratives.
          </p>
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
