import React from 'react';
import { CINEMATIC_PRESETS } from '../utils/clientEditingEngine';
import { Palette, Sparkles, ChevronUp, ChevronDown } from './icons';

export default function PresetBar({
  activePresetId,
  onSelectPreset,
  isCollapsed,
  onToggleCollapse
}) {
  return (
    <div className="border-t border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md select-none transition-all duration-200">
      <div className="px-6 py-2 border-b border-[#21262d]/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-300">Cinematic Look Lab (10 Pro Presets)</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px] font-medium"
        >
          <span>{isCollapsed ? 'Show Presets' : 'Hide Presets'}</span>
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-6 py-3 overflow-x-auto flex items-center space-x-3 scrollbar-thin">
          {CINEMATIC_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]'
                    : 'bg-[#161b22] border-[#30363d] hover:bg-[#21262d] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between w-full space-x-2">
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-950 text-amber-300' : 'bg-[#0d1117] text-slate-400'
                  }`}>
                    {preset.category}
                  </span>
                  {isSelected && <Sparkles className="w-3 h-3 text-amber-400" />}
                </div>
                <div className={`text-xs font-semibold mt-1 tracking-tight ${
                  isSelected ? 'text-amber-200' : 'text-slate-200 group-hover:text-white'
                }`}>
                  {preset.name}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
