import React from 'react';
import { 
  Sparkles, 
  Wand2, 
  Scissors, 
  Focus, 
  Palette, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical,
  Check,
  Info
} from './icons';

export default function StudioControls({
  activeTab,
  adjustments,
  onChangeAdjustment,
  onAutoEnhance,
  onRunUpscale,
  onRunRemoveBackground,
  onRunDeblur,
  bgParams,
  onChangeBgParam,
  dimensions,
  isProcessing,
  onRotate,
  onFlipH,
  onFlipV
}) {
  const COLOR_PALETTES = [
    { label: 'Studio White', color: '#ffffff' },
    { label: 'Deep Charcoal', color: '#0f172a' },
    { label: 'Neutral Slate', color: '#64748b' },
    { label: 'Royal Navy', color: '#1e3a8a' },
    { label: 'Crimson Wine', color: '#881337' },
    { label: 'Emerald Forest', color: '#064e3b' },
    { label: 'Cyber Violet', color: '#581c87' },
  ];

  return (
    <aside className="w-80 border-l border-[#21262d] bg-[#0d1117]/90 flex flex-col h-[calc(100vh-4rem)] select-none overflow-y-auto p-4 space-y-4">
      {/* ======================================================== */}
      {/* 1. ENHANCEMENT WORKSPACE */}
      {/* ======================================================== */}
      {activeTab === 'enhance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              AI Enhancement Suite
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              v1.0
            </span>
          </div>

          {/* Auto Enhance Action Button */}
          <button
            onClick={onAutoEnhance}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Smart Auto-Enhance</span>
          </button>
          <p className="text-[10px] text-slate-500 italic text-center">
            Analyzes exposure, dynamic range, and color casts to apply balanced natural corrections.
          </p>

          {/* AI Super-Resolution Upscaling */}
          <div className="rounded-xl border border-[#21262d] bg-[#161b22]/70 p-3.5 space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">
              AI Super-Resolution Upscaling
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Synthesizes high-frequency details and genuinely expands pixel grid.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onRunUpscale(2)}
                disabled={isProcessing}
                className="py-2 px-3 rounded-lg bg-[#21262d] hover:bg-cyan-950/60 hover:text-cyan-300 hover:border-cyan-500/50 border border-[#30363d] text-xs font-semibold text-slate-200 transition-all flex flex-col items-center justify-center space-y-0.5 disabled:opacity-50"
              >
                <span>2× Neural Upscale</span>
                <span className="text-[9px] font-mono text-slate-400">
                  {dimensions.width ? `${dimensions.width * 2} × ${dimensions.height * 2} px` : 'Double Res'}
                </span>
              </button>
              <button
                onClick={() => onRunUpscale(4)}
                disabled={isProcessing}
                className="py-2 px-3 rounded-lg bg-[#21262d] hover:bg-cyan-950/60 hover:text-cyan-300 hover:border-cyan-500/50 border border-[#30363d] text-xs font-semibold text-slate-200 transition-all flex flex-col items-center justify-center space-y-0.5 disabled:opacity-50"
              >
                <span>4× Ultra Res</span>
                <span className="text-[9px] font-mono text-slate-400">
                  {dimensions.width ? `${dimensions.width * 4} × ${dimensions.height * 4} px` : 'Quad Res'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Sliders */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Exposure:</span>
                <span className="font-mono text-cyan-300">{adjustments.exposure > 0 ? `+${adjustments.exposure}` : adjustments.exposure}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.exposure}
                onChange={(e) => onChangeAdjustment('exposure', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Contrast:</span>
                <span className="font-mono text-cyan-300">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.contrast}
                onChange={(e) => onChangeAdjustment('contrast', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Highlights Recovery:</span>
                <span className="font-mono text-cyan-300">{adjustments.highlights}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.highlights}
                onChange={(e) => onChangeAdjustment('highlights', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Shadows Recovery:</span>
                <span className="font-mono text-cyan-300">{adjustments.shadows}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.shadows}
                onChange={(e) => onChangeAdjustment('shadows', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Clarity & Texture:</span>
                <span className="font-mono text-cyan-300">{adjustments.clarity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.clarity}
                onChange={(e) => onChangeAdjustment('clarity', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BACKGROUND REMOVAL STUDIO */}
      {/* ======================================================== */}
      {activeTab === 'background' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-violet-400" />
              Background Removal Studio
            </span>
            <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 border border-violet-800/40 px-2 py-0.5 rounded">
              DeepLabV3 AI
            </span>
          </div>

          {/* Run Segmentation Button */}
          <button
            onClick={onRunRemoveBackground}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)] flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Scissors className="w-4 h-4" />
            <span>Remove Background (AI)</span>
          </button>

          {/* Replacement Mode Tabs */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] text-slate-400 font-medium block">
              Background Replacement Mode:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'transparent', label: 'Transparent' },
                { id: 'color', label: 'Solid Color' },
                { id: 'gradient', label: 'Studio Gradient' },
                { id: 'image', label: 'Custom Image' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => onChangeBgParam('bg_mode', m.id)}
                  className={`py-1.5 px-2 rounded-lg font-medium transition-all text-left ${
                    bgParams.bg_mode === m.id
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
                      : 'bg-[#161b22] text-slate-400 hover:text-slate-200 border border-[#30363d]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solid Color Picker */}
          {bgParams.bg_mode === 'color' && (
            <div className="p-3 rounded-xl border border-[#21262d] bg-[#161b22]/70 space-y-2.5">
              <span className="text-[11px] text-slate-300 font-medium block">Studio Color Presets</span>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.map(p => (
                  <button
                    key={p.color}
                    onClick={() => onChangeBgParam('bg_color', p.color)}
                    style={{ backgroundColor: p.color }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                      bgParams.bg_color === p.color ? 'border-violet-400 scale-105' : 'border-slate-700'
                    }`}
                    title={p.label}
                  >
                    {bgParams.bg_color === p.color && <Check className="w-3.5 h-3.5 text-slate-900 invert" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="color"
                  value={bgParams.bg_color}
                  onChange={(e) => onChangeBgParam('bg_color', e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={bgParams.bg_color}
                  onChange={(e) => onChangeBgParam('bg_color', e.target.value)}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs font-mono text-slate-200"
                />
              </div>
            </div>
          )}

          {/* Edge Refinement Controls */}
          <div className="space-y-3 pt-2 border-t border-[#21262d]">
            <span className="text-xs font-semibold text-slate-200 block">Edge Refinement & Matting</span>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Edge Feathering:</span>
                <span className="font-mono text-violet-300">{bgParams.feather_radius} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={bgParams.feather_radius}
                onChange={(e) => onChangeBgParam('feather_radius', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-violet-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Confidence Threshold:</span>
                <span className="font-mono text-violet-300">{bgParams.threshold}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={bgParams.threshold}
                onChange={(e) => onChangeBgParam('threshold', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-violet-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. BLUR FIX & RESTORATION */}
      {/* ======================================================== */}
      {activeTab === 'blur_fix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
              <Focus className="w-4 h-4 text-emerald-400" />
              Blur Fix & Restoration
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Deconvolution
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 font-medium block">
              Deblur & Restoration Model:
            </label>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { id: 'balanced', label: 'Balanced Deblur & Sharpen' },
                { id: 'wiener', label: 'Wiener Frequency Deconvolution' },
                { id: 'lucy_richardson', label: 'Lucy-Richardson Iterative' },
                { id: 'mild_blur', label: 'Fast High-Boost Mild Blur' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => onRunDeblur(m.id)}
                  disabled={isProcessing}
                  className="p-2.5 rounded-lg bg-[#161b22] hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 border border-[#30363d] hover:border-emerald-500/50 text-left font-medium transition-all text-xs disabled:opacity-50"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Denoise & Sharpness Sliders */}
          <div className="space-y-3 pt-2 border-t border-[#21262d]">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Non-Local Noise Reduction:</span>
                <span className="font-mono text-emerald-300">{adjustments.noiseReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.noiseReduction}
                onChange={(e) => onChangeAdjustment('noiseReduction', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Acutance Sharpening:</span>
                <span className="font-mono text-emerald-300">{adjustments.sharpness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.sharpness}
                onChange={(e) => onChangeAdjustment('sharpness', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="p-3 rounded-lg bg-[#161b22]/80 border border-slate-800 text-[10px] text-slate-400 flex items-start space-x-2 leading-relaxed">
            <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Restoration recovers real structural edge information via inverse filtering. Severe motion blur or completely missing optical focus cannot be invented from nothing.
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. COLOR LAB WORKSPACE */}
      {/* ======================================================== */}
      {activeTab === 'color_lab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" />
              Cinematic Color Lab
            </span>
            <button
              onClick={() => {
                onChangeAdjustment('temperature', 0);
                onChangeAdjustment('tint', 0);
                onChangeAdjustment('vibrance', 0);
                onChangeAdjustment('saturation', 0);
                onChangeAdjustment('vignette', 0);
                onChangeAdjustment('grain', 0);
              }}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Reset Color
            </button>
          </div>

          {/* White Balance */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">White Balance</span>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Temperature (Kelvin):</span>
                <span className="font-mono text-amber-300">{adjustments.temperature > 0 ? `+${adjustments.temperature}` : adjustments.temperature}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.temperature}
                onChange={(e) => onChangeAdjustment('temperature', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>Cool Blue</span>
                <span>Warm Gold</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Tint:</span>
                <span className="font-mono text-amber-300">{adjustments.tint}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.tint}
                onChange={(e) => onChangeAdjustment('tint', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>Green</span>
                <span>Magenta</span>
              </div>
            </div>
          </div>

          {/* Vibrance & Saturation */}
          <div className="space-y-3 pt-2 border-t border-[#21262d]">
            <span className="text-xs font-semibold text-slate-300 block">Color Intensity</span>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Vibrance (Skin-Safe):</span>
                <span className="font-mono text-amber-300">{adjustments.vibrance}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.vibrance}
                onChange={(e) => onChangeAdjustment('vibrance', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Saturation:</span>
                <span className="font-mono text-amber-300">{adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.saturation}
                onChange={(e) => onChangeAdjustment('saturation', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Vignette & Film Grain */}
          <div className="space-y-3 pt-2 border-t border-[#21262d]">
            <span className="text-xs font-semibold text-slate-300 block">Cinematic Effects</span>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Vignette:</span>
                <span className="font-mono text-amber-300">{adjustments.vignette}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.vignette}
                onChange={(e) => onChangeAdjustment('vignette', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">35mm Film Grain:</span>
                <span className="font-mono text-amber-300">{adjustments.grain}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.grain}
                onChange={(e) => onChangeAdjustment('grain', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. CROP & TRANSFORM */}
      {/* ======================================================== */}
      {activeTab === 'crop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-rose-400" />
              Transform & Orientation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRotate}
              className="p-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d] flex flex-col items-center justify-center space-y-1 transition-all text-xs font-medium"
            >
              <RotateCw className="w-4 h-4 text-rose-400" />
              <span>Rotate 90°</span>
            </button>
            <button
              onClick={onFlipH}
              className="p-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d] flex flex-col items-center justify-center space-y-1 transition-all text-xs font-medium"
            >
              <FlipHorizontal className="w-4 h-4 text-rose-400" />
              <span>Flip Horizontal</span>
            </button>
            <button
              onClick={onFlipV}
              className="p-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d] flex flex-col items-center justify-center space-y-1 transition-all text-xs font-medium"
            >
              <FlipVertical className="w-4 h-4 text-rose-400" />
              <span>Flip Vertical</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
