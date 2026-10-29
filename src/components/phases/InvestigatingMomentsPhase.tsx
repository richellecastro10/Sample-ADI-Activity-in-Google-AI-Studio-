/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationTrial, MetacognitiveMonitoring } from '../../types/timadi';
import { GasChamberSimulation } from '../simulation/GasChamberSimulation';
import { 
  Microscope, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Activity,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';

interface InvestigatingMomentsPhaseProps {
  loggedTrials: SimulationTrial[];
  onAddTrial: (trial: SimulationTrial) => void;
  onClearTrials: () => void;
  onDeleteTrial: (id: string) => void;
  monitoringData: MetacognitiveMonitoring;
  onUpdateMonitoring: (data: Partial<MetacognitiveMonitoring>) => void;
  onProceedToNext: () => void;
}

export const InvestigatingMomentsPhase: React.FC<InvestigatingMomentsPhaseProps> = ({
  loggedTrials,
  onAddTrial,
  onClearTrials,
  onDeleteTrial,
  monitoringData,
  onUpdateMonitoring,
  onProceedToNext,
}) => {
  const handleAutofillMonitoring = () => {
    onUpdateMonitoring({
      understandTask: 'Yes, we are systematically decreasing chamber volume from 5.0 L down to 1.0 L while keeping temperature fixed at 298 K, observing how the pressure responds.',
      makesSense: 'Yes, the task directly tests our hypothesis. As the volume becomes more restricted, molecules hit the walls more often.',
      reachingGoals: 'Yes, we have logged multiple trial points and observed that the product of P and V remains close to 100 kPa·L in all trials.',
      strategiesWorking: 'Our strategy of recording 5 evenly spaced volumes (5.0, 4.0, 2.5, 2.0, 1.0 L) gives us a distinct hyperbolic curve on the graph.',
      improvementsNeeded: 'We should verify that we include the collision frequency per second in our notes to support our reasoning in the argument stage.',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Phase Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
            TI-MADI Phase 3 · Investigating Moments
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Virtual Gas Chamber Simulation & Data Collection
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Manipulate the piston to alter the volume (V) of the enclosed gas while holding temperature constant 
            at 298.15 K (25°C). Record at least 3 to 5 trials across different volumes to serve as quantitative 
            evidence for your scientific argument!
          </p>
        </div>
      </div>

      {/* Lab Procedure Steps Card */}
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex items-start gap-3.5 text-xs text-sky-950">
        <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0">
          <ClipboardCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-sky-900 uppercase font-mono text-[11px]">
            Laboratory Protocol Instructions:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 text-xs">
            <li>Start at maximum volume (V = 5.00 L) and observe initial pressure.</li>
            <li>Click <strong>"Record Data Point"</strong> to log trial #1.</li>
            <li>Gradually compress the piston to 4.00 L, 2.50 L, 2.00 L, and 1.00 L, logging each point.</li>
            <li>Observe how the particles bounce and check the calculated <strong>P × V</strong> product.</li>
            <li>Switch between the <strong>P vs V</strong> and <strong>P vs 1/V</strong> graphs to analyze the curves.</li>
          </ol>
        </div>
      </div>

      {/* Interactive Virtual Laboratory Sandbox */}
      <GasChamberSimulation
        loggedTrials={loggedTrials}
        onAddTrial={onAddTrial}
        onClearTrials={onClearTrials}
        onDeleteTrial={onDeleteTrial}
      />

      {/* Metacognitive Monitoring Checkpoint (Matching Page 8 of PDF) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-amber-600 tracking-wider uppercase font-mono">
              Metacognitive Regulation
            </span>
            <h2 className="font-semibold text-slate-900 text-base">Monitoring Metacognitive Checkpoint</h2>
            <p className="text-xs text-slate-500">
              Reflect with your group while conducting the experiment to ensure high-quality data
            </p>
          </div>

          <button
            onClick={handleAutofillMonitoring}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Monitoring Reflections</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              1. Do we understand what we are doing?
            </label>
            <textarea
              rows={2}
              value={monitoringData.understandTask}
              onChange={(e) => onUpdateMonitoring({ understandTask: e.target.value })}
              placeholder="Reflect on your comprehension of the variables and steps..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              2. Does the task make sense in testing the hypothesis?
            </label>
            <textarea
              rows={2}
              value={monitoringData.makesSense}
              onChange={(e) => onUpdateMonitoring({ makesSense: e.target.value })}
              placeholder="How does changing volume test the pressure relationship?"
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              3. Are we reaching our goals and collecting sufficient trials?
            </label>
            <textarea
              rows={2}
              value={monitoringData.reachingGoals}
              onChange={(e) => onUpdateMonitoring({ reachingGoals: e.target.value })}
              placeholder="Do we have enough data points to prove inverse proportionality?"
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              4. Are strategies working well within the time limit?
            </label>
            <textarea
              rows={2}
              value={monitoringData.strategiesWorking}
              onChange={(e) => onUpdateMonitoring({ strategiesWorking: e.target.value })}
              placeholder="Are tasks distributed effectively between team members?"
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">
              5. Do we need to make improvements or adjustments before arguing?
            </label>
            <input
              type="text"
              value={monitoringData.improvementsNeeded}
              onChange={(e) => onUpdateMonitoring({ improvementsNeeded: e.target.value })}
              placeholder="e.g., We need to log one more high-pressure point at 1.0 L..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            {loggedTrials.length >= 3 ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {loggedTrials.length} trials recorded. You have solid experimental evidence!
              </span>
            ) : (
              <span className="text-amber-700 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Record at least 3 trials in the simulator to unlock argumentation.
              </span>
            )}
          </div>

          <button
            onClick={onProceedToNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>Proceed to Digital Argumentation Board (Phase 4)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
