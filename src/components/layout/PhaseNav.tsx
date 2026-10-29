/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TIMADIPhaseId, PhaseInfo } from '../../types/timadi';
import { 
  BookOpen, 
  Lightbulb, 
  Microscope, 
  Scale, 
  Calculator, 
  FileCheck2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface PhaseNavProps {
  currentPhase: TIMADIPhaseId;
  completedPhases: TIMADIPhaseId[];
  onSelectPhase: (phaseId: TIMADIPhaseId) => void;
}

export const PHASES: PhaseInfo[] = [
  { id: 1, name: 'Refreshing Knowledge', subtitle: 'Word Wall & Guiding Question', duration: '30m', iconName: 'BookOpen' },
  { id: 2, name: 'Stimulating Insights', subtitle: 'Chem-o-Trivia & Hypothesis', duration: '20m', iconName: 'Lightbulb' },
  { id: 3, name: 'Investigating Moments', subtitle: 'Piston Simulation & Data Log', duration: '60m', iconName: 'Microscope' },
  { id: 4, name: 'Justifying Arguments', subtitle: 'ADI Digital Argument Board', duration: '45m', iconName: 'Scale' },
  { id: 5, name: 'Expounding Era', subtitle: 'Calculations (P₁V₁=P₂V₂)', duration: '40m', iconName: 'Calculator' },
  { id: 6, name: 'Checking Compositions', subtitle: 'Final Individual Report', duration: '30m', iconName: 'FileCheck2' },
  { id: 7, name: 'Reflection', subtitle: 'Metacognitive Log & Self-Efficacy', duration: '15m', iconName: 'Sparkles' },
];

const getPhaseIcon = (id: TIMADIPhaseId, isCurrent: boolean, isCompleted: boolean) => {
  const iconProps = { className: "w-4 h-4 shrink-0" };
  switch (id) {
    case 1: return <BookOpen {...iconProps} />;
    case 2: return <Lightbulb {...iconProps} />;
    case 3: return <Microscope {...iconProps} />;
    case 4: return <Scale {...iconProps} />;
    case 5: return <Calculator {...iconProps} />;
    case 6: return <FileCheck2 {...iconProps} />;
    case 7: return <Sparkles {...iconProps} />;
  }
};

export const PhaseNav: React.FC<PhaseNavProps> = ({
  currentPhase,
  completedPhases,
  onSelectPhase,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {PHASES.map((phase) => {
            const isCurrent = currentPhase === phase.id;
            const isCompleted = completedPhases.includes(phase.id);

            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isCurrent
                    ? 'bg-sky-600 text-white font-medium shadow-xs'
                    : isCompleted
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : phase.id}
                </span>

                <div className="text-left">
                  <div className="font-semibold leading-tight flex items-center gap-1.5">
                    {phase.name}
                  </div>
                  <div className={`text-[10px] ${isCurrent ? 'text-sky-100' : 'text-slate-500'}`}>
                    {phase.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
