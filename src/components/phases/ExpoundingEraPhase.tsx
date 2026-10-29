/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PracticeProblem, MetacognitiveEvaluating } from '../../types/timadi';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle
} from 'lucide-react';

interface ExpoundingEraPhaseProps {
  evaluatingData: MetacognitiveEvaluating;
  onUpdateEvaluating: (data: Partial<MetacognitiveEvaluating>) => void;
  onProceedToNext: () => void;
}

export const ExpoundingEraPhase: React.FC<ExpoundingEraPhaseProps> = ({
  evaluatingData,
  onUpdateEvaluating,
  onProceedToNext,
}) => {
  // Practice Problem 1, 2, 3
  const practiceProblems: PracticeProblem[] = [
    {
      id: 'prob-1',
      title: 'Problem 1: Medical Syringe Compression',
      scenario: 'A gas sample inside a sealed piston cylinder occupies 4.0 Liters under an initial pressure of 100.0 kPa. If the cylinder is compressed at constant temperature until the volume is 2.0 Liters, what is the new pressure in kPa?',
      p1: 100.0,
      v1: 4.0,
      v2: 2.0,
      unknownVar: 'P2',
      unitP: 'kPa',
      unitV: 'L',
      correctAnswer: 200.0,
      tolerance: 1.0,
      hint: 'Formula: P₂ = (P₁ · V₁) / V₂. Notice that volume halved, so pressure should double!',
      stepExplanation: [
        'Given: P₁ = 100.0 kPa, V₁ = 4.0 L, V₂ = 2.0 L, T = Constant',
        'Formula: P₁ · V₁ = P₂ · V₂ => P₂ = (P₁ · V₁) / V₂',
        'Substitution: P₂ = (100.0 kPa · 4.0 L) / 2.0 L',
        'Calculation: P₂ = 400.0 / 2.0 = 200.0 kPa',
      ],
    },
    {
      id: 'prob-2',
      title: 'Problem 2: Stratospheric Weather Balloon Expansion',
      scenario: 'A weather balloon is inflated with helium to a volume of 12.0 L at sea level where atmospheric pressure is 101.3 kPa. As it ascends to the stratosphere at constant temperature, ambient pressure drops to 25.0 kPa. What is the balloon\'s final volume in Liters?',
      p1: 101.3,
      v1: 12.0,
      p2: 25.0,
      unknownVar: 'V2',
      unitP: 'kPa',
      unitV: 'L',
      correctAnswer: 48.62,
      tolerance: 0.5,
      hint: 'Formula: V₂ = (P₁ · V₁) / P₂. Pressure decreased by ~4x, so volume must expand ~4x.',
      stepExplanation: [
        'Given: P₁ = 101.3 kPa, V₁ = 12.0 L, P₂ = 25.0 kPa, T = Constant',
        'Formula: P₁ · V₁ = P₂ · V₂ => V₂ = (P₁ · V₁) / P₂',
        'Substitution: V₂ = (101.3 kPa · 12.0 L) / 25.0 kPa',
        'Calculation: V₂ = 1215.6 / 25.0 = 48.62 Liters',
      ],
    },
    {
      id: 'prob-3',
      title: 'Problem 3: Scuba Diver Exhaled Air Bubble',
      scenario: 'A scuba diver exhales an air bubble with a volume of 10.0 mL at a depth of 30 meters where hydrostatic pressure is 4.0 atm. Assuming water temperature is constant, what will the volume of the bubble be in mL when it reaches the ocean surface where pressure is 1.0 atm?',
      p1: 4.0,
      v1: 10.0,
      p2: 1.0,
      unknownVar: 'V2',
      unitP: 'atm',
      unitV: 'mL',
      correctAnswer: 40.0,
      tolerance: 0.5,
      hint: 'Formula: V₂ = (P₁ · V₁) / P₂. At the surface, pressure drops to 1 atm, expanding the bubble 4 times!',
      stepExplanation: [
        'Given: P₁ = 4.0 atm, V₁ = 10.0 mL, P₂ = 1.0 atm, T = Constant',
        'Formula: P₁ · V₁ = P₂ · V₂ => V₂ = (P₁ · V₁) / P₂',
        'Substitution: V₂ = (4.0 atm · 10.0 mL) / 1.0 atm',
        'Calculation: V₂ = 40.0 mL (4x volume expansion)',
      ],
    },
  ];

  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Custom Solver Sandbox
  const [customP1, setCustomP1] = useState<string>('100');
  const [customV1, setCustomV1] = useState<string>('2.5');
  const [customV2, setCustomV2] = useState<string>('1.0');

  const currProblem = practiceProblems[activeProblemIdx];

  const handleCheckAnswer = () => {
    const num = parseFloat(studentAnswer);
    if (isNaN(num)) {
      setFeedback({ isCorrect: false, message: 'Please enter a valid numeric answer.' });
      return;
    }
    const diff = Math.abs(num - currProblem.correctAnswer);
    if (diff <= currProblem.tolerance) {
      setFeedback({
        isCorrect: true,
        message: `Excellent calculation! ${num} ${currProblem.unknownVar === 'P2' ? currProblem.unitP : currProblem.unitV} is correct.`,
      });
      setShowSolution(true);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Not quite. Check your algebra and formula rearrangement. Hint: ${currProblem.hint}`,
      });
    }
  };

  const handleSelectProblem = (idx: number) => {
    setActiveProblemIdx(idx);
    setStudentAnswer('');
    setFeedback(null);
    setShowSolution(false);
  };

  const handleAutofillEvaluating = () => {
    onUpdateEvaluating({
      reachedGoal: 'Yes! We successfully established that pressure and volume follow an inverse relationship, verified mathematically by P₁V₁ = P₂V₂.',
      strategyWorked: 'Logging precise simulation data points at 5 distinct volumes and graphing both P vs V and P vs 1/V worked extraordinarily well.',
      strategyNotWorked: 'Initially, we did not pay close enough attention to the constant 298 K temperature condition, which is essential to keep particle speed unchanged.',
      doDifferently: 'Next time, we will immediately link microscopic collision rates with pressure rather than just describing the macroscopic dial needle.',
    });
  };

  // Custom calculation result
  const calculatedCustomP2 = (() => {
    const p1 = parseFloat(customP1);
    const v1 = parseFloat(customV1);
    const v2 = parseFloat(customV2);
    if (!isNaN(p1) && !isNaN(v1) && !isNaN(v2) && v2 > 0) {
      return ((p1 * v1) / v2).toFixed(2);
    }
    return '--';
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Phase Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
            TI-MADI Phase 5 · Expounding Era
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Mathematical Equations & Step-by-Step Problem Solving
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transition from empirical observation to rigorous quantitative chemistry! Master the 
            <strong> Boyle's Law equation ($P_1 V_1 = P_2 V_2$)</strong>, solve real-world problems, 
            and complete the evaluating metacognitive checkpoint.
          </p>
        </div>
      </div>

      {/* Conceptual & Mathematical Derivation Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-sky-600" />
          <h2 className="font-semibold text-slate-900 text-base">Mathematical Formulation of Boyle's Law</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              Robert Boyle discovered that for a given mass of gas at constant temperature, the volume is inversely 
              proportional to its pressure:
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center text-sm font-bold text-slate-800">
              V ∝ 1 / P &nbsp;⟺&nbsp; P · V = k &nbsp;(constant)
            </div>
            <p>
              Because the product $P \cdot V$ remains invariant between any initial state (State 1) and final state (State 2):
            </p>
            <div className="p-3.5 bg-sky-50 rounded-lg border border-sky-200 font-mono text-center text-base font-bold text-sky-900">
              P₁ · V₁ = P₂ · V₂
            </div>
          </div>

          {/* Algebraic Rearrangement Matrix */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-800">Formula Rearrangement Guide:</div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Solve for P₂:</span>
                <div className="font-bold text-sky-800 mt-0.5">P₂ = (P₁ · V₁) / V₂</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Solve for V₂:</span>
                <div className="font-bold text-sky-800 mt-0.5">V₂ = (P₁ · V₁) / P₂</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Solve for P₁:</span>
                <div className="font-bold text-sky-800 mt-0.5">P₁ = (P₂ · V₂) / V₁</div>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Solve for V₁:</span>
                <div className="font-bold text-sky-800 mt-0.5">V₁ = (P₂ · V₂) / P₁</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Problem Solving Tutor Station */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Guided Problem Solving Lab</h2>
            <p className="text-xs text-slate-500">Work through 3 standard Grade 10 chemistry problems with instant tutoring checks</p>
          </div>

          {/* Problem Selector Buttons */}
          <div className="flex items-center gap-1.5">
            {practiceProblems.map((prob, idx) => (
              <button
                key={prob.id}
                onClick={() => handleSelectProblem(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeProblemIdx === idx
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Problem {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Problem Card */}
        <div className="p-5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">{currProblem.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
              {currProblem.scenario}
            </p>
          </div>

          {/* Given Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-500 text-[10px]">Initial P₁:</span>
              <div className="font-bold text-slate-800">{currProblem.p1} {currProblem.unitP}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-500 text-[10px]">Initial V₁:</span>
              <div className="font-bold text-slate-800">{currProblem.v1} {currProblem.unitV}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-500 text-[10px]">
                {currProblem.unknownVar === 'P2' ? 'Final V₂:' : 'Final P₂:'}
              </span>
              <div className="font-bold text-slate-800">
                {currProblem.unknownVar === 'P2' ? `${currProblem.v2} ${currProblem.unitV}` : `${currProblem.p2} ${currProblem.unitP}`}
              </div>
            </div>
            <div className="p-2 bg-sky-50 rounded border border-sky-200">
              <span className="text-sky-700 text-[10px] font-bold">Find:</span>
              <div className="font-bold text-sky-900">
                {currProblem.unknownVar} ({currProblem.unknownVar === 'P2' ? currProblem.unitP : currProblem.unitV})
              </div>
            </div>
          </div>

          {/* Student Input Field */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder={`Enter calculated ${currProblem.unknownVar}...`}
                className="flex-1 text-xs sm:text-sm font-mono p-2.5 bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:border-sky-500"
              />
              <span className="text-xs font-mono text-slate-600 font-semibold px-1">
                {currProblem.unknownVar === 'P2' ? currProblem.unitP : currProblem.unitV}
              </span>
            </div>

            <button
              onClick={handleCheckAnswer}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Verify Answer</span>
            </button>
          </div>

          {/* Feedback & Step-by-Step Solution */}
          {feedback && (
            <div className={`p-4 rounded-lg border text-xs space-y-3 ${
              feedback.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span>{feedback.message}</span>
              </div>

              {showSolution && (
                <div className="p-3 bg-white/80 rounded border border-slate-200 space-y-1 font-mono text-[11px] text-slate-800">
                  <div className="font-bold text-slate-900 font-sans text-xs mb-1">Step-by-Step Mathematical Derivation:</div>
                  {currProblem.stepExplanation.map((step, sIdx) => (
                    <div key={sIdx} className="leading-relaxed">{step}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Custom Problem Calculator Sandbox */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calculator className="w-5 h-5 text-sky-600" />
          <h2 className="font-semibold text-slate-900 text-base">Custom Boyle's Law Sandbox Calculator</h2>
        </div>
        <p className="text-xs text-slate-600">
          Test any hypothetical gas compression scenario: input initial conditions and target volume to predict new pressure!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-mono text-slate-600 block mb-1">Initial Pressure P₁ (kPa):</label>
            <input
              type="number"
              value={customP1}
              onChange={(e) => setCustomP1(e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-600 block mb-1">Initial Volume V₁ (L):</label>
            <input
              type="number"
              value={customV1}
              onChange={(e) => setCustomV1(e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-600 block mb-1">Target Volume V₂ (L):</label>
            <input
              type="number"
              value={customV2}
              onChange={(e) => setCustomV2(e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200 text-center flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase text-sky-700">Resulting P₂:</span>
            <div className="font-mono text-lg font-bold text-sky-900">
              {calculatedCustomP2} <span className="text-xs font-normal">kPa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluating Metacognitive Checkpoint (Matching Page 10 of PDF) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-amber-600 tracking-wider uppercase font-mono">
              Metacognitive Regulation
            </span>
            <h2 className="font-semibold text-slate-900 text-base">Evaluating Metacognitive Checkpoint</h2>
            <p className="text-xs text-slate-500">
              Assess your inquiry success, problem-solving methods, and areas for strategic improvement
            </p>
          </div>

          <button
            onClick={handleAutofillEvaluating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Evaluation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              1. Have we reached our goal?
            </label>
            <textarea
              rows={2}
              value={evaluatingData.reachedGoal}
              onChange={(e) => onUpdateEvaluating({ reachedGoal: e.target.value })}
              placeholder="Did you verify Boyle's Law with evidence and math?"
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              2. What strategy worked well?
            </label>
            <textarea
              rows={2}
              value={evaluatingData.strategyWorked}
              onChange={(e) => onUpdateEvaluating({ strategyWorked: e.target.value })}
              placeholder="e.g., Using multiple trials, plotting P vs 1/V linear graph..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              3. What strategy did not work?
            </label>
            <textarea
              rows={2}
              value={evaluatingData.strategyNotWorked}
              onChange={(e) => onUpdateEvaluating({ strategyNotWorked: e.target.value })}
              placeholder="e.g., Estimating numbers without recording units..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              4. Would we do things differently next time?
            </label>
            <textarea
              rows={2}
              value={evaluatingData.doDifferently}
              onChange={(e) => onUpdateEvaluating({ doDifferently: e.target.value })}
              placeholder="Future improvements to your scientific investigation..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onProceedToNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>Proceed to Checking Compositions (Phase 6)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
