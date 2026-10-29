import React from 'react';
import { X, ImageIcon, ArrowRight, Sparkles } from './icons';
import { STUDIO_SAMPLES } from '../utils/stockSamples';

export default function StockModal({
  isOpen,
  onClose,
  onSelectSample
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#21262d] flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Select Stock Demo Image
              </h2>
              <p className="text-xs text-slate-400">
                100% local, high-fidelity procedural benchmark images
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

        {/* List of cards */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {STUDIO_SAMPLES.map(sample => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="p-4 rounded-xl border border-[#21262d] bg-[#161b22]/70 hover:bg-[#161b22] hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    {sample.category}
                  </span>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {sample.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pr-4">
                  {sample.description}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-[#21262d] text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all flex-shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
