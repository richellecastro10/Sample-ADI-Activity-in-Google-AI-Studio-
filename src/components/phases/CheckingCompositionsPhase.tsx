/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArgumentationBoardData, StudentProfile, SimulationTrial } from '../../types/timadi';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface CheckingCompositionsPhaseProps {
  studentProfile: StudentProfile;
  argumentData: ArgumentationBoardData;
  onUpdateArgument: (data: Partial<ArgumentationBoardData>) => void;
  loggedTrials: SimulationTrial[];
  onProceedToNext: () => void;
}

export const CheckingCompositionsPhase: React.FC<CheckingCompositionsPhaseProps> = ({
  studentProfile,
  argumentData,
  onUpdateArgument,
  loggedTrials,
  onProceedToNext,
}) => {
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Phase Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
              TI-MADI Phase 6 · Checking Compositions
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Final Individual Written Scientific Argumentation Report
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Synthesize feedback from the peer round-robin session and instructor critique to finalize your individual 
              Argument-Driven Inquiry lab sheet. You can export or print this official report for grading!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print Official Lab Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Formatted Lab Sheet Container (Optimized for Screen & Print) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-10 space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Institutional / Academic Header */}
        <div className="border-b-2 border-slate-800 pb-5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                Department of Education · Science 10 Chemistry
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                LABORATORY INVESTIGATION REPORT: BOYLE'S LAW
              </h2>
              <div className="text-xs text-slate-600 font-medium">
                TI-MADI Approach (Technology-Integrated Metacognitive Argument-Driven Inquiry)
              </div>
            </div>

            {/* Rubric Rating Stamp */}
            {argumentData.rubricEvaluation && (
              <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-xl border-2 border-sky-600 bg-sky-50 text-sky-900 shrink-0">
                <span className="text-[10px] font-mono font-bold uppercase">ADI Assessment</span>
                <span className="text-xl font-extrabold font-mono">{argumentData.rubricEvaluation.overallScore}/4</span>
                <span className="text-[10px] font-semibold">{argumentData.rubricEvaluation.levelLabel}</span>
              </div>
            )}
          </div>

          {/* Student Credentials Row (From PDF Page 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-medium text-slate-800">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Student Name:</span>
              <span className="text-sm font-bold text-slate-900">{studentProfile.name || 'Student Learner'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Grade & Section:</span>
              <span className="text-sm font-bold text-slate-900">{studentProfile.gradeSection || 'Grade 10'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Date & Status:</span>
              <span className="text-sm font-bold text-slate-900">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · Completed
              </span>
            </div>
          </div>
        </div>

        {/* Guiding Question Section */}
        <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-800">
            GUIDING QUESTION:
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {argumentData.guidingQuestion}
          </div>
        </div>

        {/* Finalized Claim Section */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center justify-between">
            <span>CLAIM:</span>
            <span className="text-[11px] font-sans font-normal text-slate-500 no-print">
              (Direct answer to guiding question)
            </span>
          </div>
          <div className="p-4 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm leading-relaxed text-slate-900 font-medium">
            {argumentData.claim || 'No claim entered yet.'}
          </div>
        </div>

        {/* Evidence & Reasoning Dual Box (Figure 5 & Page 11 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Evidence */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center justify-between">
              <span>EVIDENCE:</span>
              <span className="text-[11px] font-sans font-normal text-slate-500 no-print">
                (Empirical data & constant P·V product)
              </span>
            </div>
            <div className="p-4 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-mono min-h-48">
              {argumentData.evidence || 'No evidence entered yet.'}
            </div>
          </div>

          {/* Reasoning */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center justify-between">
              <span>REASONING:</span>
              <span className="text-[11px] font-sans font-normal text-slate-500 no-print">
                (Kinetic Molecular Theory linkage)
              </span>
            </div>
            <div className="p-4 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed text-slate-800 whitespace-pre-wrap min-h-48">
              {argumentData.reasoning || 'No reasoning entered yet.'}
            </div>
          </div>
        </div>

        {/* Summary Table of Simulation Trials */}
        {loggedTrials.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
              EXPERIMENTAL DATA TABLE (Piston Gas Chamber at T = 298.15 K)
            </div>
            <table className="w-full text-xs text-left border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono">
                  <th className="py-2 px-3 border-r border-slate-300 font-semibold">Trial #</th>
                  <th className="py-2 px-3 border-r border-slate-300 font-semibold">Volume (V, L)</th>
                  <th className="py-2 px-3 border-r border-slate-300 font-semibold">Pressure (P, kPa)</th>
                  <th className="py-2 px-3 border-r border-slate-300 font-semibold">1 / V (L⁻¹)</th>
                  <th className="py-2 px-3 font-semibold">P × V (kPa·L)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {loggedTrials.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">Trial {t.trialNumber}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{t.volume.toFixed(2)}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{t.pressure.toFixed(1)}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{t.inverseVolume.toFixed(3)}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{t.pvProduct.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Certification Signatures Footer */}
        <div className="border-t border-slate-300 pt-8 mt-6 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div className="space-y-6">
            <div className="border-b border-slate-400 w-48" />
            <div>
              <div className="font-semibold text-slate-900">{studentProfile.name || 'Student Learner'}</div>
              <div className="text-slate-500 text-[11px]">Investigating Student Signature</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-400 w-48" />
            <div>
              <div className="font-semibold text-slate-900">Science 10 Chemistry Instructor</div>
              <div className="text-slate-500 text-[11px]">Teacher / ADI Facilitator Sign-Off</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between no-print pt-2">
        <span className="text-xs text-slate-500">
          Individual composition ready for submission.
        </span>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <span>Proceed to Reflective Log (Phase 7)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
