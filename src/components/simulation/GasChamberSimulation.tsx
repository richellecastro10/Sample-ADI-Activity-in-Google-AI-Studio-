/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SimulationTrial } from '../../types/timadi';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  PlusCircle, 
  Trash2, 
  Download, 
  Info, 
  Sparkles,
  Thermometer,
  Gauge,
  Activity,
  Layers
} from 'lucide-react';

interface GasChamberSimulationProps {
  loggedTrials: SimulationTrial[];
  onAddTrial: (trial: SimulationTrial) => void;
  onClearTrials: () => void;
  onDeleteTrial: (id: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const GasChamberSimulation: React.FC<GasChamberSimulationProps> = ({
  loggedTrials,
  onAddTrial,
  onClearTrials,
  onDeleteTrial,
}) => {
  // Volume in Liters (Range 0.50 L to 5.00 L)
  const [volume, setVolume] = useState<number>(2.50);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [graphMode, setGraphMode] = useState<'pv' | 'pinv'>('pv');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Boyle's constant k: at 2.50 L, P = 40.0 kPa => k = 100.0 kPa*L
  const CONSTANT_K = 100.0; // in kPa*L
  const calculatedPressure = useMemo(() => {
    return Number((CONSTANT_K / volume).toFixed(2));
  }, [volume]);

  const pressureAtm = useMemo(() => {
    return Number((calculatedPressure / 101.325).toFixed(3));
  }, [calculatedPressure]);

  const inverseVolume = useMemo(() => {
    return Number((1 / volume).toFixed(3));
  }, [volume]);

  // Particle collision counter stats
  const [collisionFrequency, setCollisionFrequency] = useState<number>(120);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const collisionCounterRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize particles
  useEffect(() => {
    const numParticles = 48;
    const initialParticles: Particle[] = [];
    const baseSpeed = 2.4; // Fixed speed representing constant 298 K temperature

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      initialParticles.push({
        x: 30 + Math.random() * 200,
        y: 80 + Math.random() * 180,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: 3.5,
        color: '#38bdf8',
      });
    }
    particlesRef.current = initialParticles;
  }, []);

  // Continuous physics engine loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastSecTime = performance.now();
    let localCollisions = 0;

    const render = (time: number) => {
      // Calculate collision frequency every 600ms
      if (time - lastSecTime >= 600) {
        const ratePerSec = Math.round((localCollisions / (time - lastSecTime)) * 1000);
        setCollisionFrequency(ratePerSec);
        localCollisions = 0;
        lastSecTime = time;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chamberX = 35;
      const chamberWidth = canvas.width - 70;
      const chamberMaxHeight = 240;
      const chamberTopY = 30;
      const chamberBottomY = chamberTopY + chamberMaxHeight;

      // Map volume (0.50 L to 5.00 L) to piston height
      // Volume = 0.50 L -> height ~45px
      // Volume = 5.00 L -> height ~230px
      const minPistonY = chamberTopY + 35;
      const maxPistonY = chamberBottomY - 35;
      const pistonY = chamberBottomY - ((volume - 0.5) / 4.5) * (chamberMaxHeight - 50) - 30;

      // Draw Chamber Cylinder Outer Wall
      ctx.save();
      ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
      ctx.fillRect(chamberX, chamberTopY, chamberWidth, chamberMaxHeight);

      // Glass reflection highlights
      const grad = ctx.createLinearGradient(chamberX, 0, chamberX + chamberWidth, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(1, 'rgba(203, 213, 225, 0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(chamberX, chamberTopY, chamberWidth, chamberMaxHeight);

      // Chamber outer border
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.strokeRect(chamberX, chamberTopY, chamberWidth, chamberMaxHeight);

      // Volume calibration ruler marks on left side
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      for (let v = 1; v <= 5; v++) {
        const markY = chamberBottomY - ((v - 0.5) / 4.5) * (chamberMaxHeight - 50) - 30;
        ctx.beginPath();
        ctx.moveTo(chamberX - 6, markY);
        ctx.lineTo(chamberX, markY);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillText(`${v}.0L`, chamberX - 8, markY + 3);
      }

      // Draw Gas particles in the active volume space (below pistonY and above chamberBottomY)
      const particles = particlesRef.current;
      particles.forEach((p) => {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;

          // Elastic bounce off left wall
          if (p.x - p.radius <= chamberX + 2) {
            p.x = chamberX + 2 + p.radius;
            p.vx = -p.vx;
            localCollisions++;
          }
          // Elastic bounce off right wall
          if (p.x + p.radius >= chamberX + chamberWidth - 2) {
            p.x = chamberX + chamberWidth - 2 - p.radius;
            p.vx = -p.vx;
            localCollisions++;
          }
          // Elastic bounce off bottom chamber floor
          if (p.y + p.radius >= chamberBottomY - 2) {
            p.y = chamberBottomY - 2 - p.radius;
            p.vy = -p.vy;
            localCollisions++;
          }
          // Elastic bounce off moving Piston bottom plate
          if (p.y - p.radius <= pistonY + 12) {
            p.y = pistonY + 12 + p.radius;
            p.vy = Math.abs(p.vy);
            localCollisions += 1.5;
          }
        }

        // Keep inside bounds if piston compressed rapidly
        if (p.y < pistonY + 14) {
          p.y = pistonY + 16 + Math.random() * 8;
        }

        // Draw particle with subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();

        // Core highlight
        ctx.beginPath();
        ctx.arc(p.x - 1, p.y - 1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#e0f2fe';
        ctx.fill();
      });

      // Draw Movable Piston
      // Piston Shaft
      const shaftWidth = 14;
      const shaftX = chamberX + chamberWidth / 2 - shaftWidth / 2;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(shaftX, 5, shaftWidth, pistonY - 5);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(shaftX, 5, shaftWidth, pistonY - 5);

      // Piston Handle
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(shaftX - 25, 2, shaftWidth + 50, 10);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(shaftX - 25, 2, shaftWidth + 50, 10);

      // Piston Plate Head (Inside chamber)
      const pistonHeight = 14;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(chamberX + 2, pistonY, chamberWidth - 4, pistonHeight);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(chamberX + 2, pistonY, chamberWidth - 4, pistonHeight);

      // Rubber seal gaskets on piston edges
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(chamberX + 2, pistonY + 2, 4, pistonHeight - 4);
      ctx.fillRect(chamberX + chamberWidth - 6, pistonY + 2, 4, pistonHeight - 4);

      // Active volume level indicator label
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`V = ${volume.toFixed(2)} L`, chamberX + 10, chamberBottomY - 10);

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [volume, isPlaying]);

  // Handle logging a data trial
  const handleRecordTrial = () => {
    const newTrial: SimulationTrial = {
      id: `trial-${Date.now()}`,
      trialNumber: loggedTrials.length + 1,
      volume: volume,
      pressure: calculatedPressure,
      temperature: 298,
      pvProduct: Number((calculatedPressure * volume).toFixed(2)),
      inverseVolume: inverseVolume,
      collisionCount: collisionFrequency,
    };
    onAddTrial(newTrial);
  };

  // Pre-load standard investigation set
  const handleLoadStandardSet = () => {
    onClearTrials();
    const presets = [
      { v: 5.0, p: 20.0 },
      { v: 4.0, p: 25.0 },
      { v: 2.5, p: 40.0 },
      { v: 2.0, p: 50.0 },
      { v: 1.0, p: 100.0 },
    ];
    presets.forEach((item, idx) => {
      onAddTrial({
        id: `preset-${idx}-${Date.now()}`,
        trialNumber: idx + 1,
        volume: item.v,
        pressure: item.p,
        temperature: 298,
        pvProduct: Number((item.v * item.p).toFixed(1)),
        inverseVolume: Number((1 / item.v).toFixed(3)),
        collisionCount: Math.round(300 / item.v),
        notes: `Standard verification point #${idx + 1}`,
      });
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    if (loggedTrials.length === 0) return;
    let csv = 'Trial,Volume (L),Pressure (kPa),Temperature (K),P * V (kPa*L),1/Volume (1/L),Collision Rate (/s)\n';
    loggedTrials.forEach((t) => {
      csv += `${t.trialNumber},${t.volume.toFixed(2)},${t.pressure.toFixed(2)},${t.temperature},${t.pvProduct.toFixed(2)},${t.inverseVolume.toFixed(3)},${t.collisionCount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boyle_law_lab_data_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick preset volume selections
  const volumePresets = [
    { label: '5.0 L (Max)', val: 5.0 },
    { label: '4.0 L', val: 4.0 },
    { label: '2.5 L (Half)', val: 2.5 },
    { label: '2.0 L', val: 2.0 },
    { label: '1.0 L (High P)', val: 1.0 },
    { label: '0.5 L (Extreme)', val: 0.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Stage & Sensor Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Canvas Chamber (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Virtual Piston Gas Chamber</h3>
              <p className="text-xs text-slate-500">Movable piston compressing an enclosed sample of ideal gas</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                title={isPlaying ? 'Pause Particle Motion' : 'Play Particle Motion'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="whitespace-nowrap">{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={() => { setVolume(2.5); }}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                title="Reset Volume to 2.50 L"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas Container */}
          <div className="relative mt-4 flex justify-center bg-slate-50 rounded-lg p-2 border border-slate-100">
            <canvas
              ref={canvasRef}
              width={380}
              height={300}
              className="max-w-full h-auto"
            />

            {/* In-Chamber Live Annotations */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-xs pointer-events-none">
              <div className="text-slate-500 text-[10px] uppercase font-mono">Particle Count</div>
              <div className="font-bold text-slate-800 font-mono">48 molecules</div>
            </div>
          </div>

          {/* Volume Control Slider */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="volume-slider" className="font-medium text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>Adjust Chamber Volume (V)</span>
              </label>
              <span className="font-mono text-base font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                {volume.toFixed(2)} Liters
              </span>
            </div>

            <input
              id="volume-slider"
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-500 mr-1">Presets:</span>
              {volumePresets.map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setVolume(preset.val)}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                    Math.abs(volume - preset.val) < 0.05
                      ? 'bg-sky-600 text-white font-medium shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Scientific Sensor & Telemetry Gauges (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Pressure Sensor Readout */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-600" />
                Manometer Pressure Sensor
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                Active Sensor
              </span>
            </div>

            {/* Analog Needle Visualization */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36 rounded-full border-4 border-slate-300 bg-linear-to-b from-slate-100 to-white flex items-center justify-center shadow-inner">
                {/* Gauge Tick Marks */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-slate-300" />
                <span className="absolute top-2 text-[9px] font-mono text-slate-400">100 kPa</span>
                <span className="absolute bottom-2 text-[9px] font-mono text-slate-400">200 kPa</span>
                <span className="absolute left-2 text-[9px] font-mono text-slate-400">20</span>
                <span className="absolute right-2 text-[9px] font-mono text-slate-400">50</span>

                {/* Animated Needle */}
                {/* Angle: 20 kPa -> -120 deg, 200 kPa -> 120 deg */}
                <div
                  className="absolute w-1 h-14 bg-red-600 rounded-full origin-bottom transition-transform duration-200"
                  style={{
                    transform: `translateY(-50%) rotate(${Math.min(130, Math.max(-130, -120 + ((calculatedPressure - 20) / 180) * 240))}deg)`,
                  }}
                />
                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-white z-10" />
              </div>
            </div>

            {/* Digital Readout */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-500 uppercase font-mono">Pressure (P)</div>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {calculatedPressure.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">kPa</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-500 uppercase font-mono">Atmospheres</div>
                <div className="text-2xl font-bold font-mono text-sky-700 tabular-nums">
                  {pressureAtm.toFixed(3)}
                  <span className="text-xs font-normal text-slate-500 ml-1">atm</span>
                </div>
              </div>
            </div>

            {/* Constant & Verification Product */}
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700">Calculated P × V Product:</span>
                <span className="font-mono font-bold text-sky-900 text-sm">
                  {(calculatedPressure * volume).toFixed(1)} kPa·L
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Notice that as volume decreases, pressure increases proportionally such that P × V remains constant!
              </p>
            </div>
          </div>

          {/* Environmental Fixed Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-mono uppercase">Temperature (T)</div>
                <div className="text-sm font-bold text-slate-800 font-mono">298.15 K <span className="text-xs font-normal text-slate-500">(25°C)</span></div>
                <div className="text-[10px] text-emerald-700 font-medium">● HELD CONSTANT</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-mono uppercase">Collision Rate</div>
                <div className="text-sm font-bold text-slate-800 font-mono">{collisionFrequency} <span className="text-xs font-normal text-slate-500">/sec</span></div>
                <div className="text-[10px] text-slate-500 font-medium">Wall impacts</div>
              </div>
            </div>
          </div>

          {/* Action Button: Record to Lab Notebook */}
          <button
            onClick={handleRecordTrial}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Data Point in Lab Notebook</span>
          </button>
        </div>
      </div>

      {/* Scientific Lab Notebook & Real-Time Graph Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Recorded Data & Graphical Analysis</h3>
            <p className="text-xs text-slate-500">Compare empirical data points and evaluate the relationship</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLoadStandardSet}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Load Sample Trials
            </button>
            <button
              onClick={handleExportCSV}
              disabled={loggedTrials.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClearTrials}
              disabled={loggedTrials.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Table</span>
            </button>
          </div>
        </div>

        {/* Dual Mode Graph / Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Table Container (7 cols) */}
          <div className="lg:col-span-7 overflow-x-auto">
            {loggedTrials.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-lg">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No data points recorded yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Adjust the volume slider on the chamber above and click "Record Data Point" to collect experimental evidence for your scientific argument!
                </p>
                <button
                  onClick={handleLoadStandardSet}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded border border-sky-200"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Standard 5-Point Investigation
                </button>
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-mono">
                    <th className="py-2.5 px-3 font-semibold">Trial #</th>
                    <th className="py-2.5 px-3 font-semibold">Volume (V, L)</th>
                    <th className="py-2.5 px-3 font-semibold">Pressure (P, kPa)</th>
                    <th className="py-2.5 px-3 font-semibold">1 / V (L⁻¹)</th>
                    <th className="py-2.5 px-3 font-semibold">P × V (kPa·L)</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {loggedTrials.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-900">Trial {t.trialNumber}</td>
                      <td className="py-2.5 px-3 text-sky-700 font-semibold">{t.volume.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-slate-800">{t.pressure.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.inverseVolume.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-semibold">{t.pvProduct.toFixed(1)}</td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => onDeleteTrial(t.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Remove trial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Interactive Plot (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700">Experimental Plot</span>
                <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setGraphMode('pv')}
                    className={`px-2 py-1 rounded transition-colors ${
                      graphMode === 'pv' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    P vs V
                  </button>
                  <button
                    onClick={() => setGraphMode('pinv')}
                    className={`px-2 py-1 rounded transition-colors ${
                      graphMode === 'pinv' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    P vs 1/V
                  </button>
                </div>
              </div>

              {/* SVG Graph Rendering */}
              <div className="relative bg-white rounded-lg border border-slate-200 p-3 h-52 flex items-center justify-center">
                <svg viewBox="0 0 260 170" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="30" y1="20" x2="250" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="55" x2="250" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="90" x2="250" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="125" x2="250" y2="125" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Axes */}
                  <line x1="30" y1="20" x2="30" y2="140" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="30" y1="140" x2="250" y2="140" stroke="#64748b" strokeWidth="1.5" />

                  {/* Axis labels */}
                  <text x="140" y="162" textAnchor="middle" className="text-[9px] fill-slate-500 font-mono">
                    {graphMode === 'pv' ? 'Volume (V, L)' : 'Inverse Volume 1/V (L⁻¹)'}
                  </text>
                  <text x="12" y="80" textAnchor="middle" transform="rotate(-90 12 80)" className="text-[9px] fill-slate-500 font-mono">
                    Pressure (kPa)
                  </text>

                  {/* Theoretical Curve / Line */}
                  {graphMode === 'pv' ? (
                    // Smooth inverse hyperbolic path
                    <path
                      d="M 40 30 Q 60 70 100 105 T 240 133"
                      fill="none"
                      stroke="#94a3b8"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                    />
                  ) : (
                    // Straight linear path through origin
                    <line
                      x1="30"
                      y1="140"
                      x2="240"
                      y2="30"
                      stroke="#94a3b8"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Logged Data Points */}
                  {loggedTrials.map((t) => {
                    let cx = 30;
                    let cy = 140;

                    if (graphMode === 'pv') {
                      // x = Volume (0 to 5.5 L -> 30 to 240)
                      cx = 30 + (t.volume / 5.5) * 210;
                      // y = Pressure (0 to 120 kPa -> 140 to 20)
                      cy = 140 - (Math.min(120, t.pressure) / 120) * 120;
                    } else {
                      // x = 1/V (0 to 2.2 L^-1 -> 30 to 240)
                      cx = 30 + (t.inverseVolume / 2.2) * 210;
                      // y = Pressure (0 to 120 kPa -> 140 to 20)
                      cy = 140 - (Math.min(120, t.pressure) / 120) * 120;
                    }

                    return (
                      <g key={t.id}>
                        <circle cx={cx} cy={cy} r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                        <title>{`Trial ${t.trialNumber}: V=${t.volume}L, P=${t.pressure}kPa`}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Scientific Explanation Note */}
            <div className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
              {graphMode === 'pv' ? (
                <span>
                  <strong className="text-slate-800">Hyperbolic Inverse Curve:</strong> Shows that Pressure is inversely proportional to Volume ($P \propto 1/V$).
                </span>
              ) : (
                <span>
                  <strong className="text-slate-800">Linear Proportionality Line:</strong> When plotted against reciprocal volume ($1/V$), the points form a straight line passing through the origin!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
