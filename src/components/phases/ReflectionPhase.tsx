/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReflectiveLog, StudentProfile } from '../../types/timadi';
import { 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Printer, 
  Star, 
  HeartHandshake,
  RotateCcw
} from 'lucide-react';

interface ReflectionPhaseProps {
  studentProfile: StudentProfile;
  reflectiveLog: ReflectiveLog;
  onUpdateReflectiveLog: (data: Partial<ReflectiveLog>) => void;
  onRestartLesson: () => void;
}

export const ReflectionPhase: React.FC<ReflectionPhaseProps> = ({
  studentProfile,
  reflectiveLog,
  onUpdateReflectiveLog,
  onRestartLesson,
}) => {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleAutofillReflection = () => {
    onUpdateReflectiveLog({
      helpfulAspect: 'The interactive gas cylinder simulation where I could compress the piston and immediately watch the molecular collisions increase in real time helped me visualize abstract gas behavior.',
      importantDetails: 'Boyle\'s Law establishes that at constant temperature and fixed gas mass, pressure is inversely proportional to volume (P₁V₁ = P₂V₂). Temperature must be constant so particle speed does not change.',
      realLifeApplication: 'I will apply this when understanding why scuba divers must breathe continuously when ascending to avoid lung overexpansion, and how syringe plungers work in medical settings.',
      hardshipsAndSuggestions: 'Remembering that molecules themselves do not change size when compressed was challenging at first. Using the particle collision counter helped clarify that only the empty distance changes.',
      confidenceRating: 5,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Phase Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
              TI-MADI Phase 7 · Reflection & Metacognitive Log
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Reflective Synthesis & Self-Efficacy Assessment
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Consolidate your metacognitive learnings from Lesson 1. Reflecting on your learning journey 
              builds enduring scientific process skills and self-efficacy.
            </p>
          </div>

          <button
            onClick={handleAutofillReflection}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Reflective Insights</span>
          </button>
        </div>
      </div>

      {/* Reflective Log Form (Matching Page 12 of PDF) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 text-base">Lesson 1 Metacognitive Reflective Questions</h2>
          <p className="text-xs text-slate-500">Respond thoughtfully to each of the four prompts below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800">
              1. Which helps you to learn more in this session?
            </label>
            <textarea
              rows={3}
              value={reflectiveLog.helpfulAspect}
              onChange={(e) => onUpdateReflectiveLog({ helpfulAspect: e.target.value })}
              placeholder="e.g., The interactive particle collision simulation, the round-robin argumentation..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800">
              2. What are the important details from the lesson you learned?
            </label>
            <textarea
              rows={3}
              value={reflectiveLog.importantDetails}
              onChange={(e) => onUpdateReflectiveLog({ importantDetails: e.target.value })}
              placeholder="e.g., P₁V₁ = P₂V₂, inverse relationship at constant T, Kinetic Molecular Theory..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800">
              3. How will you apply your learnings in real-life situations?
            </label>
            <textarea
              rows={3}
              value={reflectiveLog.realLifeApplication}
              onChange={(e) => onUpdateReflectiveLog({ realLifeApplication: e.target.value })}
              placeholder="e.g., Scuba diving depth safety, weather balloon inflation, syringe mechanics..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Question 4 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800">
              4. What topic does not come easy in our class? Hint some suggestions to overcome those hardships.
            </label>
            <textarea
              rows={3}
              value={reflectiveLog.hardshipsAndSuggestions}
              onChange={(e) => onUpdateReflectiveLog({ hardshipsAndSuggestions: e.target.value })}
              placeholder="Share areas of difficulty and strategies you recommend..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Self-Efficacy / Confidence Rating */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-800">Self-Efficacy Confidence Rating</div>
              <div className="text-[11px] text-slate-500">How confident do you feel explaining Boyle's Law to a peer?</div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => onUpdateReflectiveLog({ confidenceRating: star })}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (reflectiveLog.confidenceRating || 0)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-slate-700 ml-2">
                {reflectiveLog.confidenceRating || 0}/5 Stars
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-200" />
              <span>Submit Reflective Log & Generate Certificate</span>
            </button>
          </div>
        </form>
      </div>

      {/* Completion Certificate */}
      {submitted && (
        <div className="bg-white rounded-2xl border-4 border-double border-sky-600 p-8 sm:p-12 text-center shadow-lg space-y-6 print:border-none print:shadow-none animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center border-2 border-sky-200">
            <Award className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
              Certificate of Inquiry Achievement
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              TI-MADI CHEMISTRY 10 MASTERY
            </h2>
            <div className="text-sm text-sky-700 font-medium">
              Lesson 1: Boyle's Law & Argument-Driven Inquiry
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            This certificate recognizes that <strong className="text-slate-900 underline">{studentProfile.name || 'Grade 10 Learner'}</strong>{' '}
            from <strong className="text-slate-900">{studentProfile.gradeSection || 'Grade 10'}</strong> has successfully 
            conducted virtual laboratory experiments, defended scientific claims with quantitative evidence, 
            and mastered the mathematical formulation of Boyle's Law.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-6 max-w-md mx-auto text-xs text-slate-700 border-t border-slate-200">
            <div>
              <div className="font-semibold text-slate-900">Dr. Curie</div>
              <div className="text-[11px] text-slate-500">Intelligent Chemistry Lab Mentor</div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</div>
              <div className="text-[11px] text-slate-500">Date of Completion</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 no-print">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onRestartLesson}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Lesson 1</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
