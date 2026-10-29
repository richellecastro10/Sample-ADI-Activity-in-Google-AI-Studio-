/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MetacognitivePlanning } from '../../types/timadi';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  BrainCircuit,
  Puzzle,
  RotateCcw
} from 'lucide-react';

interface RefreshingKnowledgePhaseProps {
  planningData: MetacognitivePlanning;
  onUpdatePlanning: (data: Partial<MetacognitivePlanning>) => void;
  onProceedToNext: () => void;
}

interface VocabItem {
  id: string;
  term: string;
  definition: string;
  matched: boolean;
}

export const RefreshingKnowledgePhase: React.FC<RefreshingKnowledgePhaseProps> = ({
  planningData,
  onUpdatePlanning,
  onProceedToNext,
}) => {
  // Vocabulary Interactive Game State
  const initialTerms: VocabItem[] = [
    { id: '1', term: 'Pressure', definition: 'Force exerted per unit area by gas particles hitting container walls.', matched: false },
    { id: '2', term: 'Volume', definition: 'The 3D space occupied by an enclosed gas sample (measured in Liters).', matched: false },
    { id: '3', term: 'Temperature', definition: 'Measure of average kinetic energy of gas molecules (held constant in Boyle\'s Law).', matched: false },
    { id: '4', term: 'Inverse Proportionality', definition: 'Relationship where an increase in one variable leads to a proportional decrease in another.', matched: false },
    { id: '5', term: 'Kilopascal (kPa)', definition: 'Standard SI metric unit of pressure (1 atm = 101.325 kPa).', matched: false },
    { id: '6', term: 'Piston', definition: 'A movable cylinder component used to compress or expand gas volume.', matched: false },
  ];

  const [vocabList, setVocabList] = useState<VocabItem[]>(initialTerms);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [planningEvaluated, setPlanningEvaluated] = useState<boolean>(false);

  // Handle matching interaction
  const handleSelectTerm = (id: string) => {
    if (selectedTermId === id) {
      setSelectedTermId(null);
      return;
    }
    setSelectedTermId(id);
    if (selectedDefId) {
      checkMatch(id, selectedDefId);
    }
  };

  const handleSelectDef = (id: string) => {
    if (selectedDefId === id) {
      setSelectedDefId(null);
      return;
    }
    setSelectedDefId(id);
    if (selectedTermId) {
      checkMatch(selectedTermId, id);
    }
  };

  const checkMatch = (termId: string, defId: string) => {
    if (termId === defId) {
      // Correct match!
      setVocabList((prev) =>
        prev.map((item) => (item.id === termId ? { ...item, matched: true } : item))
      );
      setMatchScore((s) => s + 20);
      setSelectedTermId(null);
      setSelectedDefId(null);

      // Check if all matched
      const remaining = vocabList.filter((i) => i.id !== termId && !i.matched);
      if (remaining.length === 0) {
        setGameCompleted(true);
      }
    } else {
      // Mismatched
      setTimeout(() => {
        setSelectedTermId(null);
        setSelectedDefId(null);
      }, 500);
    }
  };

  const handleResetGame = () => {
    setVocabList(initialTerms);
    setSelectedTermId(null);
    setSelectedDefId(null);
    setMatchScore(0);
    setGameCompleted(false);
  };

  const handleAutofillPlanning = () => {
    onUpdatePlanning({
      taskDescription: 'Investigate the behavior of ideal gases inside a variable piston chamber when volume is systematically varied at constant temperature (298 K).',
      whyImportant: 'Understanding Boyle\'s Law explains how human respiratory lungs function, why underwater divers risk decompression sickness, and how vehicle pneumatic engines operate.',
      mainGoal: 'Formulate an evidence-based scientific argument (Claim, Evidence, Reasoning) answering how pressure relates to volume when temperature is held constant.',
      resourcesNeeded: 'Interactive Boyle\'s Law gas chamber simulation, virtual manometer pressure sensor, digital data table, and ADI argumentation board.',
      timeNeeded: 'Approximately 45 minutes for virtual simulation trials and argumentation analysis.',
      taskDivision: 'Member 1: Chamber Volume Controller; Member 2: Pressure Data Logger; Member 3 & 4: ADI Argument Synthesizers.',
    });
    setPlanningEvaluated(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
              TI-MADI Phase 1 · Refreshing Knowledge
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Building Conceptual Foundations & Inquiry Planning
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Before entering the virtual laboratory, refresh key scientific vocabulary from Chemistry 10 
              and complete your group's metacognitive planning checkpoint.
            </p>
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 shrink-0 text-center min-w-44">
            <div className="text-xs text-sky-700 font-medium">Vocabulary Score</div>
            <div className="text-3xl font-extrabold text-sky-900 font-mono tabular-nums mt-0.5">
              {matchScore} <span className="text-xs text-sky-600 font-normal">pts</span>
            </div>
            <div className="text-[11px] text-sky-700 mt-1">
              {vocabList.filter((v) => v.matched).length} / {vocabList.length} Terms Matched
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive Word Wall Match Up Game */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Chemistry Word Wall Match-Up</h2>
              <p className="text-xs text-slate-500">Tap a key term on the left, then click its corresponding definition on the right</p>
            </div>
          </div>
          <button
            onClick={handleResetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {gameCompleted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <Trophy className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-emerald-900 text-base">Vocabulary Mastered!</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              You correctly aligned all foundational Boyle's Law terminology. You are now prepared to tackle the Guiding Question.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Terms */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Scientific Term
              </div>
              {vocabList.map((item) => (
                <button
                  key={item.id}
                  disabled={item.matched}
                  onClick={() => handleSelectTerm(item.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                    item.matched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 opacity-70 cursor-default'
                      : selectedTermId === item.id
                      ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.term}</span>
                    {item.matched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column: Definitions (shuffled display) */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Scientific Definition
              </div>
              {vocabList.map((item) => (
                <button
                  key={item.id}
                  disabled={item.matched}
                  onClick={() => handleSelectDef(item.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    item.matched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-70 cursor-default'
                      : selectedDefId === item.id
                      ? 'bg-sky-100 border-sky-400 text-sky-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="leading-relaxed">{item.definition}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guiding Question Callout (Matching PDF Page 7) */}
      <div className="bg-sky-600 text-white rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-200 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4" />
            <span>Guiding Question for Inquiry</span>
          </div>
          <blockquote className="text-xl sm:text-2xl font-bold tracking-tight text-white text-balance">
            "If temperature is held constant, what is the relationship between volume and pressure?"
          </blockquote>
          <p className="text-xs text-sky-100 max-w-2xl pt-1">
            Keep this core question at the center of every simulation trial, peer argumentation session, and written composition.
          </p>
        </div>
      </div>

      {/* Part 2: Planning Metacognitive Checkpoint (Matching PDF Page 7) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-amber-600 tracking-wider uppercase font-mono">
              Metacognitive Regulation
            </span>
            <h2 className="font-semibold text-slate-900 text-base">Planning Metacognitive Checkpoint</h2>
            <p className="text-xs text-slate-500">
              Brainstorm and organize your investigation strategy before starting virtual experiments
            </p>
          </div>

          <button
            onClick={handleAutofillPlanning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Brainstorm</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>1. What is the description of the task?</span>
            </label>
            <textarea
              rows={2}
              value={planningData.taskDescription}
              onChange={(e) => onUpdatePlanning({ taskDescription: e.target.value })}
              placeholder="e.g., We will measure pressure changes when varying gas volume..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>2. Why is this task important to us?</span>
            </label>
            <textarea
              rows={2}
              value={planningData.whyImportant}
              onChange={(e) => onUpdatePlanning({ whyImportant: e.target.value })}
              placeholder="e.g., Helps explain how lungs breathe and scuba divers safely surface..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>3. What is our main goal?</span>
            </label>
            <textarea
              rows={2}
              value={planningData.mainGoal}
              onChange={(e) => onUpdatePlanning({ mainGoal: e.target.value })}
              placeholder="e.g., Gather quantitative proof of inverse pressure-volume relationship..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>4. What are the resources needed?</span>
            </label>
            <textarea
              rows={2}
              value={planningData.resourcesNeeded}
              onChange={(e) => onUpdatePlanning({ resourcesNeeded: e.target.value })}
              placeholder="e.g., Virtual piston chamber, data logger, graph tool..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>5. How much time will we need to finish?</span>
            </label>
            <input
              type="text"
              value={planningData.timeNeeded}
              onChange={(e) => onUpdatePlanning({ timeNeeded: e.target.value })}
              placeholder="e.g., 40 minutes for data collection and analysis"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>6. How do we divide the task among group members?</span>
            </label>
            <input
              type="text"
              value={planningData.taskDivision}
              onChange={(e) => onUpdatePlanning({ taskDivision: e.target.value })}
              placeholder="e.g., Simulator operator, data table recorder, argument drafters"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        {/* Planning Assessment Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {planningData.taskDescription && planningData.mainGoal ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Planning checkpoint initialized! Your team is aligned for investigation.
              </span>
            ) : (
              <span>Fill out the 6 brainstorm prompts above to complete metacognitive planning.</span>
            )}
          </div>

          <button
            onClick={onProceedToNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span>Proceed to Stimulating Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
