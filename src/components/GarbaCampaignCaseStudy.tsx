import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Project } from '../data/projects';
import { attachTightSpringMotion } from '../utils/springMotion';

const DEFAULT_GARBA_HERO_PHOTO = '/assets/aistudio/112413.jpg_b862bf11.jpeg';

interface GarbaCampaignCaseStudyProps {
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  prevProject: Project;
  nextProject: Project;
}

const REELS = [
  {
    num: '01',
    title: 'Garba Campaign Reel 01 — Where Traditional Garbo Meets Modern Energy',
    videoSrc:
      '/assets/aistudio/savefromins.com_When_traditional_Garbo_meets_modern_energy___the_vibe_hits_different._____Production__that_yellow_company__Styling__innoocent_munda__Jewellery__culture_signature_jalpathakkar__Clothing__tun__1__91bba1d8.mp4',
  },
  {
    num: '02',
    title: 'Garba Campaign Reel 02 — New-Age Garba at The Garbo',
    videoSrc:
      '/assets/aistudio/savefromins.com_The_wait_is_over.__Where_traditional_Garba_meets_modern_beats._This_Navratri__we_re_turning_it_up_at_garbo.____Come_feel_the_new-age_Garba.___navratri2026__thegarbo__garbo2026_ahmedabadgarba__Pr_7fa06f20.mp4',
  },
  {
    num: '03',
    title: 'Garba Campaign Reel 03 — Experience the Ultimate Navratri',
    videoSrc:
      '/assets/aistudio/savefromins.com_Experience_the_ultimate_Navratri_at__garbo____Where_tradition_meets_modern_beats_and_the_energy_never_sleeps______See_you_on_the_garba_ground_______TheGarbo__NavratriNights__ModernGarba__Prod_21a41d8f.mp4',
  },
  {
    num: '04',
    title: 'Garba Campaign Reel 04 — 10 Nights Together at The Garbo',
    videoSrc:
      '/assets/aistudio/savefromins.com_Let_s_celebrate_10_nights_together__the.garbo____garbo2026__navratri2026__moderngarba__garbalovers_____Production__that_yellow_company__Styling__innoocent_munda__Jewellery__culture_signature_jalp_94ae0afa.mp4',
  },
  {
    num: '05',
    title: 'Garba Campaign Reel 05 — Aatham & Aaradhana of Maa Shakti',
    videoSrc:
      '/assets/aistudio/savefromins.com_Aatham___where_ancient_devotion_meets_modern_energy.________Aaradhana_of_Maa_Shakti_reminds_us_that_traditions_don_t_need_to_stay_in_the_past__they_evolve_with_every_generation._From_sacred_pra_012462bf.mp4',
  },
];

const DEFAULT_GARBA_BTS_PHOTOS = [
  {
    id: 'garba-bts-1',
    src: '/assets/aistudio/112481.jpg_ef16189a.jpeg',
    title: 'Building the red fabric canopy and hanging clay pots',
  },
  {
    id: 'garba-bts-2',
    src: '/assets/aistudio/112480.jpg_0d6cb78f.jpeg',
    title: 'Rigging the blue fabric drape outdoors',
  },
  {
    id: 'garba-bts-3',
    src: '/assets/aistudio/112476.jpg_16d0b5a4.jpeg',
    title: 'Night lighting and atmosphere in the red setup',
  },
  {
    id: 'garba-bts-4',
    src: '/assets/aistudio/112479.jpg_27852d56.jpeg',
    title: 'Blue setup with lunar and floral motif panels',
  },
  {
    id: 'garba-bts-5',
    src: '/assets/aistudio/112477.jpg_52c23723.jpeg',
    title: 'Filming on set inside the red drape setup',
  },
  {
    id: 'garba-bts-6',
    src: '/assets/aistudio/112478.jpg_eb728111.jpeg',
    title: 'Shoot in progress inside the blue setup',
  },
];

const CONTRIBUTIONS = [
  {
    num: '01',
    title: 'Set Preparation',
    desc: 'Prepared and styled the blue and red sets before filming.',
  },
  {
    num: '02',
    title: 'On-set Art Direction Assistance',
    desc: 'Assisted the art direction team during the shoot.',
  },
];

export const GarbaCampaignCaseStudy: React.FC<GarbaCampaignCaseStudyProps> = ({
  onBack,
  onSelectProject,
  prevProject,
  nextProject,
}) => {
  const [photos, setPhotos] = useState<Record<string, string>>({});
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
      'garba-hero',
      ...DEFAULT_GARBA_BTS_PHOTOS.map((slot) => slot.id),
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
        onChange={handlePhotoFile}
        className="hidden"
      />
      <input
        ref={reelInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleReelFile}
        className="hidden"
      />

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFD]/95 backdrop-blur-sm border-b border-black/10">
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-5 sm:py-6">
          <span className="font-poppins text-sm sm:text-base font-medium text-black">
            Garba Campaign
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
              <span className="block font-bubbly">GARBA</span>
              <span className="block font-bubbly text-[#003CD7]">CAMPAIGN</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-black/80 font-normal leading-relaxed">
              On - Set Execution Setup
            </p>
          </div>

          {/* Right: Full-bleed Hero Photo filling space beside Title */}
          <div className="w-full px-6 sm:px-10 md:px-14 lg:px-0 pb-10 lg:pb-0 flex">
            <div
              onClick={() => triggerPhotoUpload('garba-hero')}
              className="w-full h-full lg:aspect-[2/1] rounded-2xl lg:rounded-none border border-black/10 lg:border-0 hover:border-[#003CD7] transition-colors cursor-pointer relative overflow-hidden bg-black group"
            >
              <img
                src={photos['garba-hero'] || DEFAULT_GARBA_HERO_PHOTO}
                alt="Garba Campaign — The Garbo Set"
                className="w-full h-auto lg:h-full object-cover object-[center_55%] block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {photos['garba-hero'] ? (
                <button
                  type="button"
                  onClick={(e) => resetPhoto('garba-hero', e)}
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
                  The Garbo
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Marketing Agency</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  That Yellow Company
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
                  On-ground Set Execution Support
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Deliverables</span>
                <span className="text-base sm:text-lg font-semibold text-black">
                  5 Promotional Reels
                </span>
              </div>
              <div>
                <span className="text-xs text-black/50 block mb-1">Project Type</span>
                <span className="text-base sm:text-lg font-semibold text-black leading-snug block">
                  Event Marketing / Promotional Video Production
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 2: Project Overview — Creating the Garba Experience */}
        <section className="max-w-4xl space-y-6">
          <span className="text-xs sm:text-sm text-black/55 block">
            Project overview
          </span>
          <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight leading-[1.08]">
            Creating <span className="text-[#003CD7]">the Garba Experience.</span>
          </h2>
          <div className="space-y-5 text-base sm:text-lg text-black/85 leading-relaxed pt-2">
            <p>
              A Garba event marketing project built around two distinct physical
              setups — one blue, one red — created as the visual environments
              for promotional video production.
            </p>
            <p>
              I was part of the on-ground team assisting with the physical
              creation of both setups, which went on to feature across five
              promotional Instagram reels.
            </p>
          </div>
        </section>

        {/* PAGES 3-4: On-ground execution — Building the Set. */}
        <section className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm text-black/55 block">
              On-ground execution
            </span>
            <h2 className="font-body-clean font-extrabold text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight">
              Building <span className="text-[#003CD7]">the Set.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              Both setups were built on the ground by the team. I was there
              throughout, helping physically create and prepare the blue and red
              sets.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <div className="flex w-max animate-marquee-scroll">
              {[0, 1].map((dupIdx) => (
                <div key={dupIdx} className="flex shrink-0 gap-5 sm:gap-6 pr-5 sm:pr-6">
                  {DEFAULT_GARBA_BTS_PHOTOS.map((slot) => {
                    const hasCustomOverride = Boolean(photos[slot.id]);
                    const photoSrc = photos[slot.id] || slot.src;

                    return (
                      <div
                        key={`${dupIdx}-${slot.id}`}
                        onClick={() => triggerPhotoUpload(slot.id)}
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
        </section>

        {/* PAGES 4-6: Final outputs — Five Reels. One Celebration. */}
        <section className="space-y-10">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs sm:text-sm text-black/55 block">
              Final outputs
            </span>
            <h2 className="font-body-clean font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              <span className="block text-[#FEBC00]">Five Reels.</span>
              <span className="block text-black">One Celebration.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed pt-1">
              Both the blue and red setups feature across all five promotional reels.
            </p>
          </div>

          {/* 5 Vertical 9:16 Reels in one clean horizontal row */}
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

        {/* My contribution — What I Worked On */}
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
            This project gave me a hands-on understanding of on-ground set
            execution and the coordination involved in bringing a visual setup
            to life. Working alongside the team, I learned how to adapt to
            practical requirements, pay attention to details, and contribute to
            creating physical spaces within a production environment. It also
            gave me a glimpse into the collaborative and fast-paced nature of
            working on promotional shoots.
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
