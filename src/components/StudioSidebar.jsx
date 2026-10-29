import React from 'react';
import { 
  Sparkles, 
  Scissors, 
  Focus, 
  Palette, 
  Crop,
  SlidersHorizontal,
  Wand2
} from './icons';

export default function StudioSidebar({ activeTab, onSelectTab }) {
  const tabs = [
    {
      id: 'enhance',
      label: 'Enhance',
      icon: Wand2,
      subtitle: 'Auto-Enhance & AI Upscale',
      accent: 'text-cyan-400',
      activeBg: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
    },
    {
      id: 'background',
      label: 'Background',
      icon: Scissors,
      subtitle: 'AI Matting & Replacement',
      accent: 'text-violet-400',
      activeBg: 'bg-violet-500/10 border-violet-500/40 text-violet-300'
    },
    {
      id: 'blur_fix',
      label: 'Blur Fix',
      icon: Focus,
      subtitle: 'Deblur & Restoration',
      accent: 'text-emerald-400',
      activeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
    },
    {
      id: 'color_lab',
      label: 'Color Lab',
      icon: Palette,
      subtitle: 'Cinematic Grading & Presets',
      accent: 'text-amber-400',
      activeBg: 'bg-amber-500/10 border-amber-500/40 text-amber-300'
    },
    {
      id: 'crop',
      label: 'Transform',
      icon: Crop,
      subtitle: 'Crop, Rotate & Flip',
      accent: 'text-rose-400',
      activeBg: 'bg-rose-500/10 border-rose-500/40 text-rose-300'
    }
  ];

  return (
    <aside className="w-64 border-r border-[#21262d] bg-[#0d1117]/90 flex flex-col h-[calc(100vh-4rem)] select-none">
      <div className="px-4 py-3.5 border-b border-[#21262d] flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          Studio Workspaces
        </span>
      </div>

      <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center space-x-3 group ${
                isActive
                  ? `${tab.activeBg} shadow-sm`
                  : 'bg-[#161b22]/50 border-transparent text-slate-400 hover:bg-[#161b22] hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-[#0d1117] shadow-inner' : 'bg-[#21262d] text-slate-400 group-hover:text-white'} transition-colors`}>
                <Icon className={`w-4 h-4 ${isActive ? tab.accent : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold tracking-tight text-slate-200 flex items-center justify-between">
                  <span>{tab.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {tab.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Workflow Mode Note */}
      <div className="p-3.5 border-t border-[#21262d] bg-[#161b22]/40 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Non-Destructive Stack</span>
        </div>
        <p className="text-slate-500 leading-relaxed">
          Edits render from untouched original pixels. Undo anytime without compression loss.
        </p>
      </div>
    </aside>
  );
}
