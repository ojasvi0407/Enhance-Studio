import React, { useState, useEffect, useRef, useCallback } from 'react';
import StudioHeader from './components/StudioHeader';
import StudioSidebar from './components/StudioSidebar';
import StudioCanvas from './components/StudioCanvas';
import StudioControls from './components/StudioControls';
import PresetBar from './components/PresetBar';
import ExportModal from './components/ExportModal';
import StockModal from './components/StockModal';

import { 
  DEFAULT_ADJUSTMENTS, 
  CINEMATIC_PRESETS,
  analyzeAndAutoEnhance,
  renderAdjustments 
} from './utils/clientEditingEngine';
import { STUDIO_SAMPLES } from './utils/stockSamples';
import {
  checkBackendHealth,
  apiRemoveBackground,
  apiUpscale,
  apiRestore,
  apiDenoise,
  apiExportImage
} from './utils/apiClient';

export default function App() {
  // Navigation & Workspace state
  const [activeTab, setActiveTab] = useState('enhance');
  const [compareMode, setCompareMode] = useState('split');
  const [isPresetBarCollapsed, setIsPresetBarCollapsed] = useState(false);
  const [activePresetId, setActivePresetId] = useState('none');

  // Backend telemetry
  const [backendOnline, setBackendOnline] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState(null);

  // Processing indicator
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);

  // Core Image Data
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [adjustments, setAdjustments] = useState({ ...DEFAULT_ADJUSTMENTS });
  const [bgParams, setBgParams] = useState({
    feather_radius: 2,
    threshold: 0.5,
    bg_mode: 'transparent',
    bg_color: '#ffffff'
  });

  // Canvas element references
  const origCanvasRef = useRef(null);
  const procCanvasRef = useRef(null);

  // In-memory untouched master original and current working base
  const masterOriginalRef = useRef(null);
  const workingBaseRef = useRef(null);

  // History stack for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Check Backend Health on mount & periodic polling
  useEffect(() => {
    const verifyHealth = async () => {
      const info = await checkBackendHealth();
      if (info) {
        setBackendOnline(true);
        setHardwareInfo(info.hardware);
      } else {
        setBackendOnline(false);
      }
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper to push history state
  const pushHistory = useCallback((newWorkingData, newAdjustments) => {
    const snapshot = {
      workingData: newWorkingData,
      adjustments: { ...newAdjustments }
    };
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, snapshot];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Load image onto canvases
  const loadImageFromDataUrl = useCallback((dataUrl, isInitial = false) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      setDimensions({ width: w, height: h });

      // Draw original
      if (origCanvasRef.current) {
        origCanvasRef.current.width = w;
        origCanvasRef.current.height = h;
        const ctxO = origCanvasRef.current.getContext('2d');
        ctxO.drawImage(img, 0, 0);
        masterOriginalRef.current = ctxO.getImageData(0, 0, w, h);
      }

      // Draw working base
      if (procCanvasRef.current) {
        procCanvasRef.current.width = w;
        procCanvasRef.current.height = h;
        const ctxP = procCanvasRef.current.getContext('2d');
        ctxP.drawImage(img, 0, 0);
        const baseData = ctxP.getImageData(0, 0, w, h);
        workingBaseRef.current = baseData;

        // Reset adjustments
        setAdjustments({ ...DEFAULT_ADJUSTMENTS });
        setActivePresetId('none');

        // Reset history
        setHistory([{ workingData: baseData, adjustments: { ...DEFAULT_ADJUSTMENTS } }]);
        setHistoryIndex(0);
      }
    };
    img.src = dataUrl;
  }, []);

  // Initialize with Stock Model Portrait on first load
  useEffect(() => {
    const initialSample = STUDIO_SAMPLES[0];
    const dataUrl = initialSample.generate(600, 600);
    loadImageFromDataUrl(dataUrl, true);
  }, [loadImageFromDataUrl]);

  // 60fps Real-Time Render Pipeline
  const applyLiveAdjustments = useCallback(() => {
    if (!workingBaseRef.current || !procCanvasRef.current) return;

    const base = workingBaseRef.current;
    const canvas = procCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create target buffer
    const targetBuffer = ctx.createImageData(base.width, base.height);
    renderAdjustments(base, targetBuffer, adjustments);
    ctx.putImageData(targetBuffer, 0, 0);
  }, [adjustments]);

  useEffect(() => {
    applyLiveAdjustments();
  }, [applyLiveAdjustments]);

  // Handle single adjustment change
  const handleChangeAdjustment = (key, value) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const handleChangeBgParam = (key, value) => {
    setBgParams(prev => ({ ...prev, [key]: value }));
  };

  // Undo & Redo Handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      workingBaseRef.current = targetState.workingData;
      setAdjustments({ ...targetState.adjustments });
      setHistoryIndex(prev => prev - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      workingBaseRef.current = targetState.workingData;
      setAdjustments({ ...targetState.adjustments });
      setHistoryIndex(prev => prev + 1);
    }
  };

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Smart Auto Enhance
  const handleAutoEnhance = () => {
    if (!workingBaseRef.current) return;
    const suggested = analyzeAndAutoEnhance(workingBaseRef.current);
    setAdjustments(suggested);
    pushHistory(workingBaseRef.current, suggested);
  };

  // Preset Selection
  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setAdjustments({ ...preset.adjustments });
    pushHistory(workingBaseRef.current, preset.adjustments);
  };

  // Reset to original
  const handleReset = () => {
    if (!masterOriginalRef.current) return;
    workingBaseRef.current = masterOriginalRef.current;
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
    setActivePresetId('none');
    pushHistory(masterOriginalRef.current, DEFAULT_ADJUSTMENTS);
  };

  // Helper to convert current working canvas to Blob
  const getCanvasBlob = async (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  // AI Feature 1: Background Removal
  const handleRunRemoveBackground = async () => {
    if (!procCanvasRef.current) return;
    setIsProcessing(true);
    setProcessingMessage('AI Segmenting Subject (DeepLabV3)...');

    try {
      const blob = await getCanvasBlob(procCanvasRef.current);
      const resultBlob = await apiRemoveBackground(blob, bgParams);
      const url = URL.createObjectURL(resultBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = procCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const newBase = ctx.getImageData(0, 0, canvas.width, canvas.height);
        workingBaseRef.current = newBase;
        pushHistory(newBase, adjustments);
        setIsProcessing(false);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      alert(`AI Background Removal: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // AI Feature 2: Super-Resolution Upscaling
  const handleRunUpscale = async (scale = 2) => {
    if (!procCanvasRef.current) return;
    setIsProcessing(true);
    setProcessingMessage(`Neural Super-Resolution ${scale}× Upscaling...`);

    try {
      const blob = await getCanvasBlob(procCanvasRef.current);
      const resultBlob = await apiUpscale(blob, {
        scale,
        denoise: adjustments.noiseReduction / 100,
        clarity: 1.2
      });
      const url = URL.createObjectURL(resultBlob);

      const img = new Image();
      img.onload = () => {
        const targetW = img.width;
        const targetH = img.height;
        setDimensions({ width: targetW, height: targetH });

        // Update both original and processed canvas size
        if (origCanvasRef.current) {
          const tempO = document.createElement('canvas');
          tempO.width = origCanvasRef.current.width;
          tempO.height = origCanvasRef.current.height;
          tempO.getContext('2d').drawImage(origCanvasRef.current, 0, 0);

          origCanvasRef.current.width = targetW;
          origCanvasRef.current.height = targetH;
          origCanvasRef.current.getContext('2d').drawImage(tempO, 0, 0, targetW, targetH);
        }

        const canvas = procCanvasRef.current;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const newBase = ctx.getImageData(0, 0, targetW, targetH);
        workingBaseRef.current = newBase;
        pushHistory(newBase, adjustments);
        setIsProcessing(false);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      alert(`AI Upscaling: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // AI Feature 3: Blur Fix & Restoration
  const handleRunDeblur = async (mode = 'balanced') => {
    if (!procCanvasRef.current) return;
    setIsProcessing(true);
    setProcessingMessage(`Running ${mode.replace('_', ' ')} algorithm...`);

    try {
      const blob = await getCanvasBlob(procCanvasRef.current);
      const resultBlob = await apiRestore(blob, {
        mode,
        denoise: adjustments.noiseReduction / 100,
        sharpness: 1.0 + (adjustments.sharpness / 100) * 0.8
      });
      const url = URL.createObjectURL(resultBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = procCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const newBase = ctx.getImageData(0, 0, canvas.width, canvas.height);
        workingBaseRef.current = newBase;
        pushHistory(newBase, adjustments);
        setIsProcessing(false);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      alert(`Restoration: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // Transform Actions
  const handleRotate = () => {
    if (!procCanvasRef.current || !workingBaseRef.current) return;
    const canvas = procCanvasRef.current;
    const prevW = canvas.width;
    const prevH = canvas.height;

    // Create temp rotated canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = prevH;
    tempCanvas.height = prevW;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.translate(prevH / 2, prevW / 2);
    tCtx.rotate((90 * Math.PI) / 180);
    tCtx.drawImage(canvas, -prevW / 2, -prevH / 2);

    canvas.width = prevH;
    canvas.height = prevW;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempCanvas, 0, 0);

    const newBase = ctx.getImageData(0, 0, prevH, prevW);
    workingBaseRef.current = newBase;
    setDimensions({ width: prevH, height: prevW });
    pushHistory(newBase, adjustments);
  };

  const handleFlipH = () => {
    if (!procCanvasRef.current) return;
    const canvas = procCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    const newBase = ctx.getImageData(0, 0, canvas.width, canvas.height);
    workingBaseRef.current = newBase;
    pushHistory(newBase, adjustments);
  };

  const handleFlipV = () => {
    if (!procCanvasRef.current) return;
    const canvas = procCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    const newBase = ctx.getImageData(0, 0, canvas.width, canvas.height);
    workingBaseRef.current = newBase;
    pushHistory(newBase, adjustments);
  };

  // High-Res Export Download
  const handleExport = async (format = 'png', quality = 95, resolutionScale = 1) => {
    if (!procCanvasRef.current) return;

    let targetCanvas = procCanvasRef.current;
    if (resolutionScale > 1) {
      targetCanvas = document.createElement('canvas');
      targetCanvas.width = procCanvasRef.current.width * resolutionScale;
      targetCanvas.height = procCanvasRef.current.height * resolutionScale;
      const tCtx = targetCanvas.getContext('2d');
      tCtx.imageSmoothingEnabled = true;
      tCtx.imageSmoothingQuality = 'high';
      tCtx.drawImage(procCanvasRef.current, 0, 0, targetCanvas.width, targetCanvas.height);
    }

    const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const link = document.createElement('a');
    link.download = `EnhanceStudio_Export_${Date.now()}.${format}`;
    link.href = targetCanvas.toDataURL(mime, quality / 100);
    link.click();
  };

  // File Upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      loadImageFromDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Studio Header */}
      <StudioHeader
        backendOnline={backendOnline}
        hardwareInfo={hardwareInfo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSamples={() => setIsStockOpen(true)}
        isProcessing={isProcessing}
        processingMessage={processingMessage}
      />

      {/* Main Studio Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <StudioSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Center Canvas Stage */}
        <StudioCanvas
          origCanvasRef={origCanvasRef}
          procCanvasRef={procCanvasRef}
          compareMode={compareMode}
          isProcessing={isProcessing}
          processingMessage={processingMessage}
          onFileUpload={handleFileUpload}
          onOpenSamples={() => setIsStockOpen(true)}
          hasImage={Boolean(workingBaseRef.current)}
        />

        {/* Right Settings Panel */}
        <StudioControls
          activeTab={activeTab}
          adjustments={adjustments}
          onChangeAdjustment={handleChangeAdjustment}
          onAutoEnhance={handleAutoEnhance}
          onRunUpscale={handleRunUpscale}
          onRunRemoveBackground={handleRunRemoveBackground}
          onRunDeblur={handleRunDeblur}
          bgParams={bgParams}
          onChangeBgParam={handleChangeBgParam}
          dimensions={dimensions}
          isProcessing={isProcessing}
          onRotate={handleRotate}
          onFlipH={handleFlipH}
          onFlipV={handleFlipV}
        />
      </div>

      {/* Bottom Preset Filmstrip */}
      <PresetBar
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        isCollapsed={isPresetBarCollapsed}
        onToggleCollapse={() => setIsPresetBarCollapsed(!isPresetBarCollapsed)}
      />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        dimensions={dimensions}
      />

      <StockModal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        onSelectSample={(sample) => {
          loadImageFromDataUrl(sample.generate(600, 600));
          if (sample.id === 'studio_portrait') setActiveTab('background');
          else if (sample.id === 'sunset_mountains') setActiveTab('color_lab');
          else setActiveTab('blur_fix');
        }}
      />
    </div>
  );
}
