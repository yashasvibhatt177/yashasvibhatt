import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { Navbar } from './components/Navbar';
import { AboutSection } from './components/AboutSection';
import { WorkSection } from './components/WorkSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CustomCursor } from './components/CustomCursor';
import { BottomScrollFade } from './components/BottomScrollFade';
import { Project, PROJECTS } from './data/projects';

const getProjectFromHash = (): Project | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  return PROJECTS.find((p) => p.id === hash) || null;
};

export default function App() {
  const initialProject = getProjectFromHash();
  const [isSliding, setIsSliding] = useState(Boolean(initialProject));
  const [isCompleted, setIsCompleted] = useState(Boolean(initialProject));
  const [selectedProject, setSelectedProject] = useState<Project | null>(initialProject);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startIntroSequence = useCallback(() => {
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    setIsSliding(false);
    setIsCompleted(false);

    // Display intro screen for 4 seconds, then slide upwards
    slideTimerRef.current = setTimeout(() => {
      setIsSliding(true);

      // Smooth upward transition lasts 1.3 seconds (1300ms)
      completeTimerRef.current = setTimeout(() => {
        setIsCompleted(true);
      }, 1300);
    }, 4000);
  }, []);

  useEffect(() => {
    if (!initialProject) {
      startIntroSequence();
    }

    const onHashChange = () => {
      setSelectedProject(getProjectFromHash());
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, [startIntroSequence]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    window.history.replaceState(null, '', `#${project.id}`);
  };

  const handleSkipIntro = () => {
    if (!isSliding) {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      setIsSliding(true);
      completeTimerRef.current = setTimeout(() => {
        setIsCompleted(true);
      }, 1300);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    requestAnimationFrame(() => {
      const workEl = document.getElementById('work');
      if (workEl) {
        workEl.scrollIntoView({ behavior: 'auto' });
      }
    });
  };

  return (
    <>
      <CustomCursor />
      {selectedProject ? (
        <div className="relative w-full min-h-screen bg-[#FFFFFD] text-black selection:bg-[#003CD7] selection:text-white">
          <ProjectDetailModal
            project={selectedProject}
            onClose={handleCloseProject}
            onSelectProject={handleSelectProject}
            allProjects={PROJECTS}
          />
        </div>
      ) : (
        <div className="relative w-full min-h-screen bg-[#FFFFFD] text-black selection:bg-[#003CD7] selection:text-white overflow-x-hidden">
          {/* Intro Screen curtain overlay */}
          {!isCompleted && (
            <IntroScreen
              isSliding={isSliding}
              onSkip={handleSkipIntro}
            />
          )}

          {/* Persistent navigation visible while scrolling down */}
          <Navbar
            onReplayIntro={startIntroSequence}
            onOpenResume={() => setIsResumeOpen(true)}
          />

          {/* About Section positioned directly underneath the intro screen */}
          <AboutSection />

          {/* Work Section following the exact visual language of the portfolio */}
          <WorkSection
            onScrollToTop={startIntroSequence}
            onSelectProject={handleSelectProject}
          />

          {/* Portfolio Footer */}
          <Footer
            onSelectProject={handleSelectProject}
            onOpenResume={() => setIsResumeOpen(true)}
            onReplayIntro={startIntroSequence}
          />
        </div>
      )}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      <BottomScrollFade
        visible={Boolean(selectedProject) || isCompleted}
        viewKey={selectedProject ? selectedProject.id : 'home'}
      />
    </>
  );
}
