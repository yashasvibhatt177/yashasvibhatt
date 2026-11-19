import React from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#03082a] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a55ff]/20 border border-[#1a55ff]/40 text-[#6095ff] text-xs font-sans-main font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Portfolio In Progress
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
          Selected Works & Case Studies
        </h3>

        <p className="font-sans-main text-white/80 text-sm leading-relaxed mb-6">
          The curated collection of communication design projects, branding explorations, publication layouts, and visual systems is currently being assembled.
        </p>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
          <div className="text-xs font-sans-main text-white/60 uppercase tracking-wider mb-1 font-semibold">
            Disciplines
          </div>
          <p className="font-sans-main text-sm text-white/90">
            Communication Design · Brand Identity · Publications · Typography · Systems Thinking
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs font-sans-main text-white/50">
            Yashasvi Bhatt Portfolio
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a55ff] hover:bg-[#1242d4] text-white text-xs font-sans-main font-semibold rounded-full transition-colors cursor-pointer"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
