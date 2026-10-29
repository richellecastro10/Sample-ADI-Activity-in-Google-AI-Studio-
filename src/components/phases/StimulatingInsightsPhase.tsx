/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface StimulatingInsightsPhaseProps {
  initialHypothesis: string;
  onUpdateHypothesis: (hypothesis: string) => void;
  onProceedToNext: () => void;
}

export const StimulatingInsightsPhase: React.FC<StimulatingInsightsPhaseProps> = ({
  initialHypothesis,
  onUpdateHypothesis,
  onProceedToNext,
}) => {
  const [selectedHypothesisOption, setSelectedHypothesisOption] = useState<string>('');

  const hypothesisOptions = [
    {
      id: 'opt1',
      text: 'If volume is decreased by half at constant temperature, then pressure will double (inverse relationship).',
      recommended: true,
      hint: 'Supported by Kinetic Molecular Theory: halving volume doubles wall collision frequency.',
    },
    {
      id: 'opt2',
      text: 'If volume is decreased at constant temperature, pressure will also decrease (direct relationship).',
      recommended: false,
      hint: 'Misconception: Pushing a syringe plunger makes it harder to push, not easier!',
    },
    {
      id: 'opt3',
      text: 'If volume is changed, pressure remains identical because gas particles are compressible without resistance.',
      recommended: false,
      hint: 'Misconception: Enclosed gas exerts force through particle impacts against walls.',
    },
  ];

  const handleSelectOption = (opt: typeof hypothesisOptions[0]) => {
    setSelectedHypothesisOption(opt.id);
    onUpdateHypothesis(opt.text);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase font-mono">
            TI-MADI Phase 2 · Stimulating Insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Real-World Phenomena & Hypothesis Formation
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Imagine a world where your breath could inflate a balloon to the size of a car, and a simple squeeze 
            could turn it into a speck. Welcome to the intriguing realm of Boyle's Law, where the pressure and volume 
            of gases dance in a captivating tango.
          </p>
        </div>
      </div>

      {/* Chem-O-Trivia Card (From Page 6 of PDF) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
            Chem-O-Trivia · 1662 Discovery
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            <strong>Did you know?</strong> Boyle's Law is named after <strong>Robert Boyle</strong>, an Anglo-Irish 
            natural philosopher, chemist, and physicist who first published the law in 1662. However, the relationship 
            between pressure and volume was also independently discovered by French physicist <strong>Edme Mariotte</strong> 
            around the same time (which is why in France it is known as <em>Boyle-Mariotte's Law</em>).
          </p>
        </div>
      </div>

      {/* Real-World Exploration Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Observable Gas Phenomena in Nature & Technology</h2>
          <p className="text-xs text-slate-500">Everyday manifestations of Boyle's pressure-volume interplay</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Scuba Diving */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 bg-slate-100">
                <img
                  src="/src/assets/images/scuba_diver_bubbles_1793261223218.jpg"
                  alt="Scuba diver bubbles expanding"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-xs font-medium text-white">
                  Underwater Decompression
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-900">Scuba Divers & The Bends</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As divers descend, hydrostatic water pressure compresses the gas in their gear. When returning to the surface, 
                  ambient pressure drops rapidly—causing air bubbles to expand in volume. Divers must ascend slowly to prevent embolisms!
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 text-[11px] font-mono text-sky-700">
              Low Pressure = Expanding Bubbles
            </div>
          </div>

          {/* Card 2: Weather Balloons */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 bg-slate-100">
                <img
                  src="/src/assets/images/weather_balloon_altitude_1793261223898.jpg"
                  alt="Stratospheric weather balloon expansion"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-xs font-medium text-white">
                  Stratospheric Expansion
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-900">High-Altitude Weather Balloons</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Launched partially inflated at sea level (101.3 kPa), as the balloon ascends into the stratosphere, 
                  atmospheric pressure plunges to less than 5 kPa. The enclosed helium expands up to 100 times its launch size!
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 text-[11px] font-mono text-sky-700">
              High Altitude = Huge Volume Expansion
            </div>
          </div>

          {/* Card 3: Laboratory Compression Piston */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 bg-slate-100">
                <img
                  src="/src/assets/images/boyle_law_apparatus_1793261222853.jpg"
                  alt="Modern gas compression cylinder apparatus"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-xs font-medium text-white">
                  Piston Cylinder Apparatus
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-900">Syringe & Pneumatic Engines</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When you seal the tip of a syringe and push down the plunger, the gas molecules resist compression. 
                  The smaller you make the volume, the greater the counter-force pushing back against your thumb.
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 text-[11px] font-mono text-sky-700">
              Low Volume = High Resistance Pressure
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pre-Lab Hypothesis Formulator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Compass className="w-5 h-5 text-sky-600" />
          <div>
            <h2 className="font-semibold text-slate-900 text-base">Scientific Hypothesis Formulation</h2>
            <p className="text-xs text-slate-500">
              Before running virtual trials, state your team's testable prediction for the guiding question:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {hypothesisOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedHypothesisOption === opt.id || initialHypothesis === opt.text
                  ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  selectedHypothesisOption === opt.id || initialHypothesis === opt.text
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-400 bg-white'
                }`}>
                  {(selectedHypothesisOption === opt.id || initialHypothesis === opt.text) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-900 leading-snug">
                    {opt.text}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {opt.hint}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Edit Option */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-medium text-slate-700">
            Or refine your hypothesis in your own words:
          </label>
          <textarea
            rows={2}
            value={initialHypothesis}
            onChange={(e) => onUpdateHypothesis(e.target.value)}
            placeholder="State: If volume increases/decreases, then pressure will..."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            {initialHypothesis ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Hypothesis logged! You will test this in Phase 3.
              </span>
            ) : (
              'Select or write a hypothesis above.'
            )}
          </span>

          <button
            onClick={onProceedToNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>Proceed to Virtual Simulation (Phase 3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
