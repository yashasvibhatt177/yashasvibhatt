import React, { useEffect, useState } from 'react';
import { X, Download, Mail, Phone, ArrowUpRight, Loader2 } from 'lucide-react';
import { downloadResumePdf } from '../utils/downloadResume';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXPERIENCE_SUMMARY = [
  {
    role: 'On-ground Set Execution',
    org: 'The Garbo Event Marketing · That Yellow Company',
    date: 'Oct 2026',
  },
  {
    role: 'Assistant Art Director',
    org: 'A. Shridhar Group · Rameshwar City · Indie Production',
    date: 'Aug 2026',
  },
  {
    role: 'Direction & Costume Team',
    org: 'Before He Spoke (Short Film) · Storython Studios',
    date: 'Jul 2026',
  },
  {
    role: 'Character & Background Designer',
    org: 'Bicharo Bachelor (Gujarati Feature Film) · Veer Studios',
    date: 'Jan 2026',
  },
  {
    role: 'Core Team Member & Social Media Manager',
    org: 'Rotaract Club of Ahmedabad, Sarvam - RCAS',
    date: 'Jan – Jun 2026',
  },
];

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDownloadError(null);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleDownloadResume = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);

    try {
      await downloadResumePdf();
    } catch {
      setDownloadError('Unable to download PDF cleanly. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="bg-[#003CD7] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white font-poppins relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-white/75 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-white/20 pb-5 mb-5">
          <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-white">
            Yashasvi Bhatt
          </h2>
          <p className="text-sm font-poppins text-white/85 mt-1">
            Communication Design Student
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-white/85 font-poppins">
            <a
              href="mailto:bhtyashasvi@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#FEBC00] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>bhtyashasvi@gmail.com</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-white/35">|</span>
            <a
              href="tel:+917874182660"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FEBC00]" />
              <span>+91 7874182660</span>
            </a>
          </div>
        </div>

        {/* Concise Summary Body */}
        <div className="space-y-5 mb-6 text-sm font-poppins">
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-white/65 mb-1.5 font-semibold">
              About
            </h4>
            <p className="text-white/95 leading-relaxed text-xs sm:text-sm">
              Communication Design student driven by research, visual storytelling,
              and intentional design—turning deep conceptual exploration into clear,
              engaging visuals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-white/65 mb-1.5 font-semibold">
                Skills
              </h4>
              <p className="text-white/90 text-xs sm:text-[13px] leading-relaxed">
                Art Direction · Set Design · Graphic Design · Moodboarding · Design
                Research · Storytelling
              </p>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-white/65 mb-1.5 font-semibold">
                Tools
              </h4>
              <p className="text-white/90 text-xs sm:text-[13px] leading-relaxed">
                Illustrator · Photoshop · Lightroom · Figma · Procreate · Premiere
                Pro
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-white/65 mb-2.5 font-semibold">
              Work Experience
            </h4>
            <div className="space-y-2.5">
              {EXPERIENCE_SUMMARY.map((item) => (
                <div
                  key={`${item.role}-${item.date}`}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4 border-b border-white/15 pb-2 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="text-xs sm:text-[13px] font-semibold text-white">
                      {item.role}
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/75">
                      {item.org}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-[#FEBC00] shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-white/65 mb-1.5 font-semibold">
              Education
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
              <div>
                <p className="text-xs sm:text-[13px] font-semibold text-white">
                  Bachelor’s in Communication Design
                </p>
                <p className="text-[11px] sm:text-xs text-white/75">
                  Indus University, Ahmedabad
                </p>
              </div>
              <span className="text-[11px] font-medium text-[#FEBC00] shrink-0">
                2023 – 2027
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/20 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFFFFD] hover:bg-[#FFFFFD]/90 disabled:opacity-75 text-[#003CD7] text-xs font-poppins font-semibold rounded-full transition-colors cursor-pointer"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? 'Downloading...' : 'Download Resume'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-poppins font-semibold rounded-full transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
          {downloadError && (
            <p className="text-xs text-[#FEBC00] font-poppins">{downloadError}</p>
          )}
        </div>
      </div>
    </div>
  );
};
