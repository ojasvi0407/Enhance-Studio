import React, { useRef, useState, useEffect } from 'react';
import { 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move,
  Sparkles,
  RefreshCw,
  ImageIcon
} from './icons';

export default function StudioCanvas({
  origCanvasRef,
  procCanvasRef,
  compareMode,
  isProcessing,
  processingMessage,
  onFileUpload,
  onOpenSamples,
  hasImage
}) {
  const containerRef = useRef(null);

  // Split curtain position (0% to 100%)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Handle Drag & Drop Upload
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileUpload(file);
      }
    }
  };

  // Slider Mouse Dragging
  const handleMouseDownSlider = (e) => {
    e.stopPropagation();
    setIsDraggingSlider(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSlider || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    };

    const handleMouseUp = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSlider]);

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e) => {
    if (isDraggingSlider) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleCanvasMouseMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(4, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.4, prev - 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSliderPos(50);
  };

  return (
    <div
      className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-[#070a12] relative overflow-hidden select-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Zoom and Pan Floating Pill */}
      <div className="absolute top-4 right-6 z-30 flex items-center space-x-1.5 p-1 rounded-xl bg-[#161b22]/90 border border-[#30363d] backdrop-blur-md shadow-xl">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-cyan-300 px-1 font-semibold">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-[#30363d] mx-1" />
        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Canvas Stage */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-8 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
      >
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Checkerboard Pattern for Alpha Transparency */}
        <style>{`
          .checkerboard-bg {
            background-color: #0f172a;
            background-image: 
              linear-gradient(45deg, #1e293b 25%, transparent 25%), 
              linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #1e293b 75%), 
              linear-gradient(-45deg, transparent 75%, #1e293b 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
        `}</style>

        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-800/80 shadow-2xl flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-center">
                <div className="text-sm font-bold text-white tracking-tight">{processingMessage}</div>
                <div className="text-xs text-slate-400 mt-0.5">Running neural inference...</div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 1: Split Slider Curtain */}
        {compareMode === 'split' ? (
          <div
            className="relative rounded-xl overflow-hidden border border-[#30363d] shadow-2xl checkerboard-bg transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Processed Canvas (Base) */}
            <canvas
              ref={procCanvasRef}
              className="block max-h-[70vh] max-w-[65vw] object-contain"
            />

            {/* Original Canvas (Clipped by Slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <canvas
                ref={origCanvasRef}
                className="block max-h-[70vh] max-w-[65vw] object-contain"
              />
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-auto cursor-ew-resize group"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDownSlider}
            >
              <div className="w-0.5 h-full bg-cyan-400 shadow-[0_0_12px_#06b6d4] group-hover:bg-cyan-300 transition-colors" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500/90 border-2 border-white shadow-lg flex items-center justify-center text-slate-950">
                <Move className="w-4 h-4" />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute bottom-3 left-3 z-20 pointer-events-none px-2.5 py-1 rounded bg-[#0d1117]/90 border border-[#30363d] text-[10px] font-mono font-semibold text-slate-300">
              ORIGINAL
            </div>
            <div className="absolute bottom-3 right-3 z-20 pointer-events-none px-2.5 py-1 rounded bg-cyan-950/90 border border-cyan-800 text-[10px] font-mono font-semibold text-cyan-300">
              EDITED ({Math.round(100 - sliderPos)}%)
            </div>
          </div>
        ) : (
          /* Mode 2: Side by Side */
          <div
            className="flex items-center space-x-6 transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          >
            <div className="space-y-1.5 text-center">
              <span className="text-xs font-mono text-slate-400">Original Reference</span>
              <div className="rounded-xl overflow-hidden border border-[#30363d] shadow-2xl checkerboard-bg">
                <canvas
                  ref={origCanvasRef}
                  className="block max-h-[65vh] max-w-[32vw] object-contain"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <span className="text-xs font-mono text-cyan-400">Edited Studio Output</span>
              <div className="rounded-xl overflow-hidden border border-cyan-800/80 shadow-2xl shadow-cyan-950/40 checkerboard-bg">
                <canvas
                  ref={procCanvasRef}
                  className="block max-h-[65vh] max-w-[32vw] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Upload & Demo Bar */}
      <div className="h-12 border-t border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md px-6 flex items-center justify-between text-xs z-20">
        <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-cyan-400 transition-colors">
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">Upload Image (JPG, PNG, WebP)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>

        <button
          onClick={onOpenSamples}
          className="flex items-center space-x-1.5 font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Select Stock Demo Dataset</span>
        </button>
      </div>
    </div>
  );
}
