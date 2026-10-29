/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArgumentationBoardData, SimulationTrial, ADIEvaluation } from '../../types/timadi';
import { TutorEngine } from '../../services/tutorEngine';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  HelpCircle,
  FileText,
  PlusCircle,
  Layers
} from 'lucide-react';

interface JustifyingArgumentsPhaseProps {
  argumentData: ArgumentationBoardData;
  onUpdateArgument: (data: Partial<ArgumentationBoardData>) => void;
  loggedTrials: SimulationTrial[];
  onProceedToNext: () => void;
}

export const JustifyingArgumentsPhase: React.FC<JustifyingArgumentsPhaseProps> = ({
  argumentData,
  onUpdateArgument,
  loggedTrials,
  onProceedToNext,
}) => {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<ADIEvaluation | null>(
    argumentData.rubricEvaluation || null
  );
  const [activeTab, setActiveTab] = useState<'board' | 'roundRobin'>('board');
  const [selectedPeerStation, setSelectedPeerStation] = useState<number>(0);

  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  // Scaffolding Sentence Starters
  const claimStarters = [
    "When temperature and gas mass are held constant, the pressure of a gas is inversely proportional to its volume.",
    "If the temperature of an enclosed gas remains constant, decreasing its volume causes the pressure to increase proportionally.",
  ];

  const reasoningStarters = [
    "According to the Kinetic Molecular Theory of Gases, pressure is the result of gas particles colliding against the walls of the container. At a constant temperature (298 K), the speed of the gas particles remains unchanged. However, when the volume is halved, the particles are confined to a smaller space and must travel shorter distances between collisions. Consequently, the frequency of collisions per unit of surface area doubles, causing the measured pressure to double.",
  ];

  // Insert logged trial data into evidence field
  const handleInsertLoggedData = () => {
    if (loggedTrials.length === 0) {
      setValidationNotice("Please record some simulation trials in Phase 3 first (or click 'Load Exemplary Argument')!");
      setTimeout(() => setValidationNotice(null), 4000);
      return;
    }
    setValidationNotice(null);
    const lines = loggedTrials.map(
      (t) => `• Trial ${t.trialNumber}: Volume = ${t.volume.toFixed(2)} L, Pressure = ${t.pressure.toFixed(1)} kPa (P × V = ${t.pvProduct.toFixed(1)} kPa·L, Collision Rate = ${t.collisionCount}/s).`
    );
    const summary = `Based on our virtual simulation trials at a constant temperature of 298.15 K:\n${lines.join('\n')}\nWhen the volume was reduced from ${loggedTrials[0].volume.toFixed(2)} L to ${loggedTrials[loggedTrials.length - 1].volume.toFixed(2)} L, the pressure rose from ${loggedTrials[0].pressure.toFixed(1)} kPa to ${loggedTrials[loggedTrials.length - 1].pressure.toFixed(1)} kPa. Across all trials, the product of pressure and volume remained essentially constant at approximately 100 kPa·L.`;
    
    onUpdateArgument({ evidence: summary });
  };

  const handleEvaluateArgument = async () => {
    if (!argumentData.claim.trim() || !argumentData.evidence.trim() || !argumentData.reasoning.trim()) {
      setValidationNotice("Please enter your Claim, Evidence, and Reasoning before requesting rubric evaluation.");
      setTimeout(() => setValidationNotice(null), 4000);
      return;
    }
    setValidationNotice(null);
    setIsEvaluating(true);
    try {
      const evalRes = await TutorEngine.evaluateArgument({
        claim: argumentData.claim,
        evidence: argumentData.evidence,
        reasoning: argumentData.reasoning,
        guidingQuestion: argumentData.guidingQuestion,
        loggedData: loggedTrials,
      });
      setEvaluationResult(evalRes);
      onUpdateArgument({ rubricEvaluation: evalRes });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleLoadExemplarySample = () => {
    onUpdateArgument({
      claim: "When temperature is held constant, the pressure of an enclosed gas is inversely proportional to its volume (as volume decreases, pressure increases proportionately).",
      reasoning: "According to Kinetic Molecular Theory, gas pressure is caused by molecules colliding with the container walls (P = Force / Area). Because temperature is held constant at 298 K, particle velocity does not change. When the chamber volume is reduced, the particles have less distance to travel before bouncing, resulting in a higher collision frequency per unit of wall area, thus exerting greater pressure.",
    });
    handleInsertLoggedData();
  };

  // Peer Round-Robin Stations for collaborative discourse (PDF Page 9)
  const peerStations = [
    {
      group: "Room Table 1: Station Alpha",
      claim: "When volume goes down, pressure goes down too because there is less room for the air.",
      evidence: "We saw the pressure meter move when we moved the piston.",
      reasoning: "Because molecules shrink when compressed, they take up less space and push less.",
      errorToIdentify: "Misconception: Claims direct relationship instead of inverse, no numerical data cited, and wrongly assumes molecules themselves shrink.",
    },
    {
      group: "Room Table 2: Station Beta",
      claim: "Pressure and volume have an inverse relationship at constant temperature.",
      evidence: "At 4.0 L pressure was 25 kPa, and at 2.0 L pressure was 50 kPa.",
      reasoning: "The particles move faster when squeezed so they hit harder.",
      errorToIdentify: "Misconception: At constant temperature (298 K), particles DO NOT move faster! Their speed depends only on temperature; only collision frequency increases.",
    },
    {
      group: "Room Table 3: Station Gamma",
      claim: "Under constant temperature conditions, gas volume and pressure are inversely proportional.",
      evidence: "Recorded 5 trials: 5.0L (20 kPa), 4.0L (25 kPa), 2.5L (40 kPa), 2.0L (50 kPa), 1.0L (100 kPa). In all trials, P × V = 100 kPa·L.",
      reasoning: "Pressure arises from collisions of gas particles with container surfaces. With constant kinetic energy (T=298 K), halving the volume halves the travel distance between wall impacts, doubling collision frequency and thus doubling pressure.",
      errorToIdentify: "Exemplary Argument! Explicit claim, quantitative proof of constant product, and sound Kinetic Molecular Theory reasoning.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Phase Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
            TI-MADI Phase 4 · Justifying Arguments
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Digital ADI Argumentation Board & Round-Robin Session
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Synthesize your empirical findings into a rigorous scientific argument containing a 
            <strong> Claim</strong>, <strong>Evidence</strong>, and <strong>Reasoning</strong>. 
            Participate in the round-robin discourse to identify and fix faulty scientific logic!
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('board')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'board'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Our Digital Argumentation Board</span>
        </button>

        <button
          onClick={() => setActiveTab('roundRobin')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'roundRobin'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Round-Robin Peer Review Stations</span>
        </button>
      </div>

      {activeTab === 'board' && (
        <div className="space-y-6">
          
          {/* Quick Helper Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl text-xs">
            <span className="text-sky-950 font-medium">
              💡 Need assistance assembling your scientific evidence or reasoning?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInsertLoggedData}
                className="px-3 py-1.5 bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 rounded-lg transition-colors font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Insert Simulation Data into Evidence</span>
              </button>
              <button
                onClick={handleLoadExemplarySample}
                className="px-3 py-1.5 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition-colors font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Exemplary Argument</span>
              </button>
            </div>
          </div>

          {/* Validation Notice Banner */}
          {validationNotice && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{validationNotice}</span>
            </div>
          )}

          {/* Authentic Digital Argumentation Board UI (Figure 5 from PDF Page 9) */}
          <div className="bg-white rounded-xl border-2 border-sky-600 shadow-md overflow-hidden">
            
            {/* Board Header: Guiding Question */}
            <div className="bg-sky-600 text-white p-4 sm:p-5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-200">
                GUIDING QUESTION:
              </div>
              <div className="text-base sm:text-lg font-bold mt-1">
                {argumentData.guidingQuestion}
              </div>
            </div>

            {/* Board Section: Claim */}
            <div className="p-5 border-b border-sky-200 bg-sky-50/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-sky-900 font-mono tracking-wider uppercase flex items-center gap-1.5">
                  <span>CLAIM:</span>
                  <span className="font-sans font-normal text-slate-500 text-[11px] normal-case">
                    (An explicit statement or conclusion that answers the guiding question)
                  </span>
                </label>
              </div>
              <textarea
                rows={3}
                value={argumentData.claim}
                onChange={(e) => onUpdateArgument({ claim: e.target.value })}
                placeholder="e.g., If temperature is held constant, the pressure of a gas is inversely proportional to its volume..."
                className="w-full text-xs sm:text-sm p-3.5 bg-white rounded-lg border border-sky-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Board Section: Evidence & Reasoning Split (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-sky-200">
              
              {/* Left: Evidence Box */}
              <div className="p-5 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-sky-900 font-mono tracking-wider uppercase">
                    EVIDENCE:
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Data observed & collected
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={argumentData.evidence}
                  onChange={(e) => onUpdateArgument({ evidence: e.target.value })}
                  placeholder="Cite specific trial measurements: e.g., In Trial 1 (V=5.0 L, P=20 kPa), Trial 2 (V=2.5 L, P=40 kPa)... Show that P × V remains constant!"
                  className="w-full text-xs leading-relaxed p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              {/* Right: Reasoning Box */}
              <div className="p-5 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-sky-900 font-mono tracking-wider uppercase">
                    REASONING:
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Kinetic Molecular Principles
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={argumentData.reasoning}
                  onChange={(e) => onUpdateArgument({ reasoning: e.target.value })}
                  placeholder="Explain WHY the data occurred using scientific principles: What happens to gas particles, their speed at constant 298 K, distance between walls, and frequency of collisions per unit area?"
                  className="w-full text-xs leading-relaxed p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Board Footer Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                Ready to test your argument against the official Grade 10 ADI Rubric?
              </span>
              <button
                onClick={handleEvaluateArgument}
                disabled={isEvaluating}
                className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>{isEvaluating ? 'Evaluating with ADI Rubric...' : 'Evaluate My Scientific Argument'}</span>
              </button>
            </div>
          </div>

          {/* Intelligent Rubric Evaluation Card */}
          {evaluationResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    evaluationResult.levelLabel === 'Exemplary' ? 'bg-emerald-600' :
                    evaluationResult.levelLabel === 'Proficient' ? 'bg-sky-600' :
                    evaluationResult.levelLabel === 'Developing' ? 'bg-amber-500' : 'bg-red-500'
                  }`}>
                    {evaluationResult.overallScore}/4
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-500">
                      ADI Argument Proficiency Level
                    </div>
                    <div className="font-bold text-slate-900 text-base">
                      {evaluationResult.levelLabel} Mastery
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  Claim: {evaluationResult.claimScore}/4 · Evidence: {evaluationResult.evidenceScore}/4 · Reasoning: {evaluationResult.reasoningScore}/4
                </div>
              </div>

              {/* Praise & Encouragement */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{evaluationResult.praise}</p>
              </div>

              {/* Detected Misconceptions Alert */}
              {evaluationResult.detectedMisconceptions.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Scientific Misconception Detected!</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                    {evaluationResult.detectedMisconceptions.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Component Feedbacks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800 flex justify-between">
                    <span>Claim Evaluation</span>
                    <span className="font-mono text-sky-700">{evaluationResult.claimScore}/4</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{evaluationResult.claimFeedback}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800 flex justify-between">
                    <span>Evidence Evaluation</span>
                    <span className="font-mono text-sky-700">{evaluationResult.evidenceScore}/4</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{evaluationResult.evidenceFeedback}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800 flex justify-between">
                    <span>Reasoning Evaluation</span>
                    <span className="font-mono text-sky-700">{evaluationResult.reasoningScore}/4</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{evaluationResult.reasoningFeedback}</p>
                </div>
              </div>

              {/* Actionable Tips */}
              {evaluationResult.actionableTips.length > 0 && (
                <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-lg space-y-1.5">
                  <div className="text-xs font-semibold text-sky-900">Recommended Next Steps for Full Points:</div>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {evaluationResult.actionableTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation Action */}
          <div className="flex justify-end pt-3">
            <button
              onClick={onProceedToNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <span>Proceed to Expounding Era (Phase 5)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Round-Robin Discourse Tab (Page 9 of PDF) */}
      {activeTab === 'roundRobin' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Round-Robin Peer Review Arrangement</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                As detailed in the module, two members remain stationary at your station to defend your work, 
                while other members rotate to examine the arguments of peer tables. Review the arguments below 
                and determine which flaws need correction:
              </p>
            </div>

            {/* Station Selector */}
            <div className="flex flex-wrap gap-2 pt-1">
              {peerStations.map((station, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPeerStation(idx)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    selectedPeerStation === idx
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {station.group}
                </button>
              ))}
            </div>

            {/* Selected Station Board Display */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm">
                  {peerStations[selectedPeerStation].group}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Peer Argument Presentation</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-sky-800 uppercase font-mono text-[11px] block">Claim:</span>
                  <p className="p-2.5 bg-white rounded border border-slate-200 text-slate-800 mt-1">
                    "{peerStations[selectedPeerStation].claim}"
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-sky-800 uppercase font-mono text-[11px] block">Evidence:</span>
                  <p className="p-2.5 bg-white rounded border border-slate-200 text-slate-800 mt-1 font-mono">
                    "{peerStations[selectedPeerStation].evidence}"
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-sky-800 uppercase font-mono text-[11px] block">Reasoning:</span>
                  <p className="p-2.5 bg-white rounded border border-slate-200 text-slate-800 mt-1">
                    "{peerStations[selectedPeerStation].reasoning}"
                  </p>
                </div>
              </div>

              {/* Tutor Critique Analysis */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-1.5">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Dr. Curie's Peer Review Feedback:</span>
                </div>
                <p className="text-amber-950 leading-relaxed">
                  {peerStations[selectedPeerStation].errorToIdentify}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
