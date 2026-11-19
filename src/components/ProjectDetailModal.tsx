import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, Camera, RotateCcw } from 'lucide-react';
import { Project } from '../data/projects';
import { MirageCaseStudy } from './MirageCaseStudy';
import { RealEstateCaseStudy } from './RealEstateCaseStudy';
import { GarbaCampaignCaseStudy } from './GarbaCampaignCaseStudy';
import { TypeDesignCaseStudy } from './TypeDesignCaseStudy';
import { KindnessThatGlowedCaseStudy } from './KindnessThatGlowedCaseStudy';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
}) => {
  const resolveProjectImage = (proj: Project | null): string | null => {
    if (!proj) return null;
    try {
      const saved = localStorage.getItem(`yashasvi_project_detail_v2_${proj.id}`);
      if (saved) return saved;
      if (proj.detailImage) return proj.detailImage;
      const savedThumb = localStorage.getItem(`yashasvi_project_thumb_${proj.id}`);
      return savedThumb || null;
    } catch {
      return proj.detailImage || null;
    }
  };

  const [projectImage, setProjectImage] = useState<string | null>(() =>
    resolveProjectImage(project)
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!project) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    setProjectImage(resolveProjectImage(project));
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && project) handleNext();
      if (e.key === 'ArrowLeft' && project) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const handlePrev = () => onSelectProject(prevProject);
  const handleNext = () => onSelectProject(nextProject);

  // Render full dedicated case study for Project 1: Mirage - Stop Motion Film
  if (project.id === 'project-1') {
    return (
      <MirageCaseStudy
        onBack={onClose}
        onSelectProject={onSelectProject}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  }

  // Render full dedicated case study for Project 2: Real Estate Campaign
  if (project.id === 'project-2') {
    return (
      <RealEstateCaseStudy
        onBack={onClose}
        onSelectProject={onSelectProject}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  }

  // Render full dedicated case study for Project 3: The Garbo Campaign (Garba Campaign)
  if (project.id === 'project-3') {
    return (
      <GarbaCampaignCaseStudy
        onBack={onClose}
        onSelectProject={onSelectProject}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  }

  // Render full dedicated case study for Project 4: The Kindness that Glowed
  if (project.id === 'project-4') {
    return (
      <KindnessThatGlowedCaseStudy
        onBack={onClose}
        onSelectProject={onSelectProject}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  }

  // Render full dedicated case study for Project 5: Type Design
  if (project.id === 'project-5') {
    return (
      <TypeDesignCaseStudy
        onBack={onClose}
        onSelectProject={onSelectProject}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setProjectImage(result);
        try {
          localStorage.setItem(`yashasvi_project_detail_v2_${project.id}`, result);
        } catch {
          // Handled safely
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectImage(project.detailImage || null);
    try {
      localStorage.removeItem(`yashasvi_project_detail_v2_${project.id}`);
    } catch {
      // Handled safely
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFD] text-black font-poppins">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Sticky Top Header matching Full-Page Case Study style */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFD]/95 backdrop-blur-sm border-b border-black/10">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-5 sm:py-6">
          <span className="font-poppins text-sm sm:text-base font-medium text-black truncate pr-4">
            {project.title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 font-poppins text-sm sm:text-base text-black hover:text-[#003CD7] transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </div>
      </header>

      {/* Full-Page Case Study Body */}
      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 pt-12 sm:pt-16 lg:pt-20 pb-24 space-y-16">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-3 sm:gap-4 text-[#003CD7] font-body-clean text-xs sm:text-sm tracking-[0.18em] uppercase">
            <span className="inline-block w-4 sm:w-5 h-[1.5px] bg-[#003CD7]" aria-hidden="true" />
            <span>{project.category} / {project.year}</span>
          </div>

          <h1 className="font-bubbly font-bold text-4xl sm:text-6xl lg:text-7xl text-black tracking-[0.015em] leading-[1.08]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-black/75 max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </section>

        {/* Full-Width Project Image Placeholder */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`w-full aspect-[16/9] overflow-hidden relative cursor-pointer group transition-all duration-200 ${
            isDragging ? 'ring-2 ring-[#003CD7]' : ''
          }`}
          style={{
            backgroundColor: '#cfd2d6',
          }}
          title="Click or drag an image here to replace project visual"
        >
          {projectImage ? (
            <img
              src={projectImage}
              alt={project.title}
              onError={() => {
                if (projectImage !== project.detailImage) {
                  setProjectImage(project.detailImage || null);
                }
              }}
              className="absolute inset-0 w-full h-full object-cover block"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#cfd2d6] flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs uppercase tracking-widest text-slate-600 mb-1">
                Project Visual Placeholder
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {project.number} — {project.title}
              </span>
              <span className="text-xs text-slate-500 mt-2">
                Click to upload custom case study asset
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-6 text-center text-white backdrop-blur-[2px]">
            <div className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md">
              {projectImage ? <Camera className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <p className="text-xs font-semibold text-white">
              {projectImage ? 'Replace Project Artwork' : 'Upload Project Artwork'}
            </p>
            {projectImage && projectImage !== project.detailImage && (
              <button
                type="button"
                onClick={handleResetImage}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-black/70 hover:bg-black text-[11px] text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {project.detailImage ? 'Reset to Default Image' : 'Reset to Grey Placeholder'}
              </button>
            )}
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-black/15">
          <div className="md:col-span-4 space-y-6 text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-black/45 block mb-1">Role & Focus</span>
              <p className="text-black font-medium">{project.role}</p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-black/45 block mb-1">Timeline</span>
              <p className="text-black font-medium">{project.year}</p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-black/45 block mb-2">Deliverables</span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-black/75">
                {project.deliverables.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#003CD7] rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-8 space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-black/45 mb-3">Overview & Concept</h2>
              <p className="text-black/85 text-base sm:text-lg leading-relaxed">
                {project.overview}
              </p>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-black/45 mb-4">Process & Exploration</h2>
              <div className="space-y-3">
                {project.process.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-[#f8f8f5] border border-black/10">
                    <span className="text-xs font-semibold text-[#003CD7] mt-0.5">0{i + 1}.</span>
                    <p className="text-sm text-black/80 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Navigation */}
        <footer className="pt-12 border-t border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 text-black/70 hover:text-[#003CD7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{prevProject.number} · {prevProject.title}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="font-medium text-black hover:text-[#003CD7] transition-colors cursor-pointer"
          >
            Back to Portfolio
          </button>

          <button
            type="button"
            onClick={handleNext}
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
