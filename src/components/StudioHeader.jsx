import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  RotateCw, 
  Download, 
  SplitSquareVertical, 
  Columns, 
  RefreshCw,
  ImageIcon
} from './icons';

export default function StudioHeader({
  backendOnline,
  hardwareInfo,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  compareMode,
  setCompareMode,
  onOpenExport,
  onOpenSamples,
  isProcessing,
  processingMessage
}) {
  return (
    <header className="h-16 border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & AI Engine Badge */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 bg-clip-text text-transparent">
              Enhance Studio
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Pro AI Suite
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Professional Image Enhancement, Matting & Cinematic Color Lab
          </p>
        </div>
      </div>

      {/* Center: Processing Status, Undo/Redo & Compare Modes */}
      <div className="flex items-center space-x-3">
        {/* Active Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-medium animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>{processingMessage || 'Running AI Model...'}</span>
          </div>
        )}

        {/* Backend Connectivity Status */}
        <div 
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
            backendOnline 
              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
              : 'bg-amber-950/50 text-amber-300 border-amber-800/60'
          }`}
          title={backendOnline ? `Connected to FastAPI Backend (PyTorch ${hardwareInfo?.torch_version || 'Ready'})` : 'Backend offline - operating in local Browser Canvas mode'}
        >
          <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`} />
          <span className="hidden md:inline font-semibold">
            {backendOnline ? 'Local AI Engine' : 'Browser Mode'}
          </span>
        </div>

        {/* Undo & Redo History */}
        <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition-colors ${
              canUndo ? 'text-slate-200 hover:bg-[#21262d] hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition-colors ${
              canRedo ? 'text-slate-200 hover:bg-[#21262d] hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Mode Toggle */}
        <div className="hidden lg:flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setCompareMode('split')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
              compareMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Interactive Split Curtain Comparison"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Wipe</span>
          </button>
          <button
            onClick={() => setCompareMode('side_by_side')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
              compareMode === 'side_by_side' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Side by Side Dual Comparison"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>
        </div>
      </div>

      {/* Right: Samples, Reset & Export */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenSamples}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#161b22] hover:bg-[#21262d] text-cyan-300 border border-[#30363d] hover:border-cyan-500/50 transition-all"
          title="Load Stock Benchmark Image"
        >
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Stock Samples</span>
        </button>

        <button
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#21262d] border border-transparent hover:border-[#30363d] transition-all"
          title="Reset All Adjustments"
        >
          Reset
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] transition-all transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Image</span>
        </button>
      </div>
    </header>
  );
}
