import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project, PROJECTS } from '../data/projects';

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

interface WorkSectionProps {
  onScrollToTop?: () => void;
  onSelectProject: (project: Project) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  onSelectProject,
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    if (!headingRef.current) return;
    return attachTightSpringMotion(headingRef.current, 8, 6);
  }, []);

  return (
    <section
      id="work"
      className="relative w-full max-w-[1920px] mx-auto bg-[#FFFFFD] text-black px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-10 sm:pt-12 lg:pt-14 pb-4 sm:pb-6 border-t border-black/10 scroll-mt-20"
    >

      {/* Section Header */}
      <div className="max-w-4xl mb-8 lg:mb-10">
        {/* Clear Section Heading matching "HELLO, I'M YASHASVI BHATT" font */}
        <h2
          ref={headingRef}
          className="font-bubbly font-bold text-4xl sm:text-5xl lg:text-6xl text-black tracking-[0.015em] leading-[1.1] will-change-transform"
        >
          Things I've{' '}
          <span className="relative inline-block text-[#003CD7] pb-2 sm:pb-3 lg:pb-[0.14em]">
            Worked On
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

      {/* Project Gallery Grid - First project spans full width; remaining 4 in aligned 2-column rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-16 lg:gap-y-20">
        {PROJECTS.map((project, idx) => {
          const displayImage = project.coverImage || null;
          const hasImage = Boolean(displayImage);
          const isFirst = idx === 0;
          const isSecond = idx === 1;
          const isThird = idx === 2;
          const isFourth = idx === 3;
          const isFifth = idx === 4;
          const isMirageStyle = idx <= 4;

          return (
            <article
              key={project.id}
              data-cursor="view-project"
              onClick={() => onSelectProject(project)}
              className={`group cursor-pointer flex flex-col ${
                isFirst ? 'md:col-span-2' : ''
              }`}
            >
              {/* Section sub-label above Project 1 (SET DESIGN) and Project 2 (ART DIRECTION) */}
              {isFirst && (
                <div
                  data-cursor="default"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[#003CD7] font-body-clean text-xs sm:text-sm md:text-[15px] tracking-[0.2em] uppercase font-normal select-none cursor-default w-fit"
                >
                  <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
                  <span>SET DESIGN</span>
                </div>
              )}

              {isSecond && (
                <div
                  data-cursor="default"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[#003CD7] font-body-clean text-xs sm:text-sm md:text-[15px] tracking-[0.2em] uppercase font-normal select-none cursor-default w-fit"
                >
                  <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
                  <span>ART DIRECTION</span>
                </div>
              )}

              {/* ART DIRECTION label above Project 3 matching Project 2 */}
              {isThird && (
                <div
                  data-cursor="default"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[#003CD7] font-body-clean text-xs sm:text-sm md:text-[15px] tracking-[0.2em] uppercase font-normal select-none cursor-default w-fit"
                >
                  <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
                  <span>ART DIRECTION</span>
                </div>
              )}

              {/* PUBLICATION DESIGN label above Project 4 matching SET DESIGN, ART DIRECTION, and TYPE DESIGN */}
              {isFourth && (
                <div
                  data-cursor="default"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[#003CD7] font-body-clean text-xs sm:text-sm md:text-[15px] tracking-[0.2em] uppercase font-normal select-none cursor-default w-fit"
                >
                  <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
                  <span>PUBLICATION DESIGN</span>
                </div>
              )}

              {/* TYPE DESIGN label above Project 5 matching SET DESIGN and ART DIRECTION */}
              {isFifth && (
                <div
                  data-cursor="default"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[#003CD7] font-body-clean text-xs sm:text-sm md:text-[15px] tracking-[0.2em] uppercase font-normal select-none cursor-default w-fit"
                >
                  <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7] shrink-0" aria-hidden="true" />
                  <span>TYPE DESIGN</span>
                </div>
              )}

              {/* Large Project Thumbnail Placeholder */}
              <div
                className={`w-full relative overflow-hidden rounded-xl transition-all duration-300 group-hover:brightness-95 ${
                  isFirst
                    ? 'aspect-[16/10] md:aspect-[5/2]'
                    : 'aspect-[16/10]'
                }`}
                style={{
                  backgroundColor: hasImage ? '#000000' : '#cfd2d6',
                }}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  /* Solid light-grey placeholder matching Figma visual language */
                  <div className="w-full h-full bg-[#cfd2d6] flex flex-col items-center justify-center p-6 text-center select-none">
                    <span className="font-poppins text-[11px] uppercase tracking-widest text-slate-600 mb-1">
                      {project.number} / {String(PROJECTS.length).padStart(2, '0')}
                    </span>
                    <span className="font-poppins text-sm font-medium text-slate-800">
                      {project.title}
                    </span>
                    <span className="font-poppins text-[11px] text-slate-600 mt-2">
                      [ Replaceable Image Placeholder ]
                    </span>
                  </div>
                )}
              </div>

              {/* Project Metadata below thumbnail */}
              {isMirageStyle ? (
                <div className="mt-5">
                  <h3
                    className={`font-bubbly font-bold text-black tracking-[0.015em] leading-[1.15] group-hover:text-[#003CD7] transition-colors ${
                      isFirst ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl lg:text-[28px]'
                    }`}
                  >
                    {project.title}
                  </h3>
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-poppins text-black/55 tracking-wider">
                    <span className="uppercase text-[11px] text-[#003CD7] font-medium">
                      {project.category}
                    </span>
                    <span>{project.year}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-poppins text-xl sm:text-2xl text-black font-medium group-hover:text-[#003CD7] transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-black/40 group-hover:text-[#003CD7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <p className="font-poppins text-xs sm:text-[13.5px] text-black/65 leading-relaxed max-w-xl font-normal">
                    {project.subtitle}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
