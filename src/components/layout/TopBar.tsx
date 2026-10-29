/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TIMADIPhaseId, StudentProfile } from '../../types/timadi';
import { FlaskConical, Award, Printer, Bot } from 'lucide-react';

interface TopBarProps {
  studentProfile: StudentProfile;
  currentPhase: TIMADIPhaseId;
  onOpenTutor: () => void;
  onOpenProfile: () => void;
  onPrintReport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  studentProfile,
  currentPhase,
  onOpenTutor,
  onOpenProfile,
  onPrintReport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand title, single line text */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <a href="/" className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              TI-MADI Chemistry ITS
            </a>
            <div className="text-[11px] text-slate-500 font-medium">
              Grade 10 · Lesson 1: Boyle's Law
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Inquiry Progress Tracker */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Student: <strong className="text-slate-800 font-semibold">{studentProfile.name || 'Grade 10 Learner'}</strong>
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Section: <strong className="text-slate-800 font-semibold">{studentProfile.gradeSection}</strong>
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Duration: <strong className="text-slate-800 font-semibold">4 Hours Module</strong>
          </span>
        </nav>

        {/* Zone 3: Primary Actions (Tutor Assistant & Report Export) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Edit student profile"
          >
            Profile
          </button>

          <button
            onClick={onPrintReport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Print or export lab report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Lab Sheet</span>
          </button>

          <button
            onClick={onOpenTutor}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-sky-200" />
            <span>Dr. Curie (Tutor)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
