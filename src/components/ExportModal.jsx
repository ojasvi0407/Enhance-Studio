import React, { useState } from 'react';
import { X, Download, ShieldCheck } from './icons';

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  dimensions
}) {
  const [format, setFormat] = useState('png'); // 'png', 'jpeg', 'webp'
  const [quality, setQuality] = useState(95);
  const [resolutionScale, setResolutionScale] = useState(1); // 1x or 2x

  if (!isOpen) return null;

  const outW = (dimensions.width || 0) * resolutionScale;
  const outH = (dimensions.height || 0) * resolutionScale;

  const handleDownload = () => {
    onExport(format, quality, resolutionScale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#21262d] flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Export High-Res Image
              </h2>
              <p className="text-xs text-slate-400">
                Non-destructive render at master resolution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#21262d] hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Options */}
        <div className="p-6 space-y-5 text-xs">
          {/* Format Selection */}
          <div>
            <label className="text-slate-300 font-semibold block mb-2">Export Format:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'png', label: 'PNG', desc: 'Preserves Alpha' },
                { id: 'jpeg', label: 'JPEG', desc: 'Standard Photo' },
                { id: 'webp', label: 'WebP', desc: 'Modern Web' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    format === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-[#161b22] text-slate-400 hover:text-slate-200 border-[#30363d]'
                  }`}
                >
                  <div className="font-bold text-xs">{f.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPEG / WebP) */}
          {format !== 'png' && (
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 font-medium">Encoding Quality:</span>
                <span className="font-mono text-cyan-300 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          )}

          {/* Resolution Multiplier */}
          <div>
            <label className="text-slate-300 font-semibold block mb-2">Target Dimensions:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setResolutionScale(1)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  resolutionScale === 1
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                    : 'bg-[#161b22] text-slate-400 border-[#30363d]'
                }`}
              >
                <div>1× Original</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{dimensions.width} × {dimensions.height} px</div>
              </button>
              <button
                onClick={() => setResolutionScale(2)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  resolutionScale === 2
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                    : 'bg-[#161b22] text-slate-400 border-[#30363d]'
                }`}
              >
                <div>2× Upscaled</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{dimensions.width * 2} × {dimensions.height * 2} px</div>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Master render generated directly from native source pixels with full color fidelity.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#21262d] bg-[#161b22] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
          >
            <Download className="w-4 h-4" />
            <span>Download ({outW} × {outH})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
