/**
 * Enhance Studio Client-Side Real-Time Editing Engine
 * Pure HTML5 Canvas pixel manipulation for 60fps real-time adjustments.
 */

export const DEFAULT_ADJUSTMENTS = {
  // Basic Tone
  exposure: 0,      // -100 to +100
  brightness: 0,    // -100 to +100
  contrast: 0,      // -100 to +100
  highlights: 0,    // -100 to +100
  shadows: 0,       // -100 to +100
  whites: 0,        // -100 to +100
  blacks: 0,        // -100 to +100

  // Color & White Balance
  temperature: 0,   // -100 (cool) to +100 (warm)
  tint: 0,          // -100 (green) to +100 (magenta)
  vibrance: 0,      // -100 to +100
  saturation: 0,    // -100 to +100

  // Detail & Texture
  sharpness: 0,     // 0 to 100
  clarity: 0,       // 0 to 100
  noiseReduction: 0,// 0 to 100

  // Effects & Grading
  vignette: 0,      // 0 to 100
  grain: 0,         // 0 to 100
  splitHighlightHue: 40,   // warm yellow
  splitHighlightSat: 0,
  splitShadowHue: 200,     // cool cyan
  splitShadowSat: 0,
};

export const CINEMATIC_PRESETS = [
  {
    id: 'none',
    name: 'Default / Raw',
    category: 'Standard',
    adjustments: { ...DEFAULT_ADJUSTMENTS }
  },
  {
    id: 'teal_orange',
    name: 'Teal & Orange',
    category: 'Cinematic',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: 5,
      contrast: 22,
      highlights: -15,
      shadows: 18,
      temperature: 12,
      vibrance: 25,
      splitHighlightHue: 35,
      splitHighlightSat: 38,
      splitShadowHue: 195,
      splitShadowSat: 42,
      vignette: 24,
      clarity: 15
    }
  },
  {
    id: 'dark_cinematic',
    name: 'Dark Cinematic',
    category: 'Cinematic',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: -12,
      contrast: 28,
      highlights: -25,
      shadows: -15,
      temperature: -8,
      tint: 5,
      vibrance: -10,
      splitShadowHue: 215,
      splitShadowSat: 35,
      vignette: 45,
      grain: 12,
      clarity: 20
    }
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    category: 'Warm',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: 8,
      contrast: 14,
      highlights: 10,
      shadows: 20,
      temperature: 38,
      tint: -4,
      vibrance: 30,
      saturation: 10,
      splitHighlightHue: 42,
      splitHighlightSat: 40,
      vignette: 15
    }
  },
  {
    id: 'cool_blue',
    name: 'Cool Blue Nordic',
    category: 'Cool',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: 4,
      contrast: 18,
      highlights: -10,
      shadows: 12,
      temperature: -35,
      tint: 8,
      vibrance: 12,
      splitShadowHue: 210,
      splitShadowSat: 30,
      clarity: 12
    }
  },
  {
    id: 'vintage_film',
    name: 'Vintage 35mm Film',
    category: 'Vintage',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: -5,
      contrast: -8,
      highlights: -20,
      shadows: 25,
      temperature: 15,
      tint: 12,
      vibrance: -15,
      grain: 32,
      vignette: 28,
      splitHighlightHue: 50,
      splitHighlightSat: 25,
      splitShadowHue: 160,
      splitShadowSat: 20
    }
  },
  {
    id: 'soft_pastel',
    name: 'Soft Pastel',
    category: 'Portrait',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: 15,
      contrast: -12,
      highlights: -18,
      shadows: 22,
      whites: 10,
      temperature: 5,
      vibrance: 18,
      saturation: -5,
      vignette: 8
    }
  },
  {
    id: 'moody_shadows',
    name: 'Moody Shadows',
    category: 'Dramatic',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: -18,
      contrast: 35,
      highlights: -30,
      shadows: -25,
      blacks: -15,
      temperature: -12,
      vibrance: -20,
      clarity: 25,
      vignette: 50
    }
  },
  {
    id: 'natural_clean',
    name: 'Natural Clean',
    category: 'Commercial',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      exposure: 6,
      contrast: 8,
      highlights: -8,
      shadows: 14,
      vibrance: 12,
      clarity: 10,
      sharpness: 15
    }
  },
  {
    id: 'bw_high_contrast',
    name: 'B&W Film Noir',
    category: 'Monochrome',
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      saturation: -100,
      vibrance: -100,
      contrast: 42,
      exposure: 4,
      highlights: 15,
      shadows: -20,
      whites: 20,
      blacks: -18,
      clarity: 25,
      grain: 22,
      vignette: 35
    }
  }
];

/**
 * Auto-Enhance Analyzer
 * Inspects image histogram and dynamic range, generating smart conservative corrections.
 */
export function analyzeAndAutoEnhance(imageData) {
  const data = imageData.data;
  let sumLuma = 0;
  let minLuma = 255;
  let maxLuma = 0;
  const numPixels = data.length / 4;

  let sumR = 0, sumG = 0, sumB = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    sumLuma += luma;
    if (luma < minLuma) minLuma = luma;
    if (luma > maxLuma) maxLuma = luma;

    sumR += r;
    sumG += g;
    sumB += b;
  }

  const avgLuma = sumLuma / numPixels;
  const avgR = sumR / numPixels;
  const avgG = sumG / numPixels;
  const avgB = sumB / numPixels;

  // Exposure correction toward target midtone (approx 125)
  const exposureDelta = Math.round(Math.max(-30, Math.min(30, (125 - avgLuma) * 0.4)));

  // Contrast correction based on dynamic range
  const dynamicRange = maxLuma - minLuma;
  const contrastDelta = dynamicRange < 180 ? Math.round((180 - dynamicRange) * 0.25) : 8;

  // White balance color cast estimation
  const avgColor = (avgR + avgG + avgB) / 3;
  const tempDelta = Math.round(Math.max(-25, Math.min(25, (avgColor - avgB) * 0.4)));
  const tintDelta = Math.round(Math.max(-20, Math.min(20, (avgColor - avgG) * 0.3)));

  return {
    ...DEFAULT_ADJUSTMENTS,
    exposure: exposureDelta,
    contrast: contrastDelta,
    shadows: 18,
    highlights: -12,
    temperature: tempDelta,
    tint: tintDelta,
    vibrance: 16,
    clarity: 12,
    sharpness: 15
  };
}

/**
 * Applies full parameter stack onto an ImageData buffer
 */
export function renderAdjustments(srcImageData, destImageData, adj) {
  const s = srcImageData.data;
  const d = destImageData.data;
  const w = srcImageData.width;
  const h = srcImageData.height;
  const len = s.length;

  // Precalculate multipliers
  const expFactor = Math.pow(2, adj.exposure / 50);
  const brightOffset = (adj.brightness / 100) * 128;
  const contrastFactor = (259 * (adj.contrast + 100)) / (100 * (259 - adj.contrast));

  const tempFactorR = 1 + (adj.temperature / 100) * 0.25;
  const tempFactorB = 1 - (adj.temperature / 100) * 0.25;
  const tintFactorG = 1 - (adj.tint / 100) * 0.15;
  const tintFactorM = 1 + (adj.tint / 100) * 0.15;

  const satFactor = 1 + (adj.saturation / 100);
  const vibFactor = 1 + (adj.vibrance / 100) * 0.8;

  // Split toning RGB offsets
  const hRad = (adj.splitHighlightHue * Math.PI) / 180;
  const sRad = (adj.splitShadowHue * Math.PI) / 180;
  const hR = Math.cos(hRad) * (adj.splitHighlightSat / 100) * 35;
  const hG = Math.cos(hRad - 2.094) * (adj.splitHighlightSat / 100) * 35;
  const hB = Math.cos(hRad + 2.094) * (adj.splitHighlightSat / 100) * 35;

  const sR = Math.cos(sRad) * (adj.splitShadowSat / 100) * 35;
  const sG = Math.cos(sRad - 2.094) * (adj.splitShadowSat / 100) * 35;
  const sB = Math.cos(sRad + 2.094) * (adj.splitShadowSat / 100) * 35;

  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const vigAmount = adj.vignette / 100;
  const grainAmount = adj.grain / 100;

  for (let i = 0; i < len; i += 4) {
    let r = s[i];
    let g = s[i + 1];
    let b = s[i + 2];
    const a = s[i + 3];

    // 1. Exposure & Brightness
    r = r * expFactor + brightOffset;
    g = g * expFactor + brightOffset;
    b = b * expFactor + brightOffset;

    // 2. Contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // 3. Highlights & Shadows
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const normLuma = luma / 255;

    // Shadows affect low range, highlights affect high range
    if (adj.shadows !== 0 && normLuma < 0.6) {
      const shadowWeight = (1.0 - normLuma / 0.6) * (adj.shadows / 100) * 50;
      r += shadowWeight;
      g += shadowWeight;
      b += shadowWeight;
    }
    if (adj.highlights !== 0 && normLuma > 0.4) {
      const hlWeight = ((normLuma - 0.4) / 0.6) * (adj.highlights / 100) * 50;
      r += hlWeight;
      g += hlWeight;
      b += hlWeight;
    }

    // Whites & Blacks
    if (adj.whites !== 0 && normLuma > 0.7) {
      const wWeight = (adj.whites / 100) * 40;
      r += wWeight; g += wWeight; b += wWeight;
    }
    if (adj.blacks !== 0 && normLuma < 0.3) {
      const bWeight = (adj.blacks / 100) * 40;
      r += bWeight; g += bWeight; b += bWeight;
    }

    // 4. White Balance (Temperature & Tint)
    r *= tempFactorR;
    b *= tempFactorB;
    g = g * tintFactorG;
    r = r * tintFactorM;

    // 5. Saturation & Vibrance
    const maxCh = Math.max(r, g, b);
    const minCh = Math.min(r, g, b);
    const currentSat = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;
    const lumaNew = 0.299 * r + 0.587 * g + 0.114 * b;

    // Vibrance boosts less-saturated colors more to protect skin tones
    const vibBoost = 1 + (1 - currentSat) * (vibFactor - 1);
    const totalSat = satFactor * vibBoost;

    r = lumaNew + (r - lumaNew) * totalSat;
    g = lumaNew + (g - lumaNew) * totalSat;
    b = lumaNew + (b - lumaNew) * totalSat;

    // 6. Split Toning
    if (adj.splitHighlightSat > 0 && normLuma > 0.5) {
      const weight = (normLuma - 0.5) * 2;
      r += hR * weight;
      g += hG * weight;
      b += hB * weight;
    }
    if (adj.splitShadowSat > 0 && normLuma < 0.5) {
      const weight = (0.5 - normLuma) * 2;
      r += sR * weight;
      g += sG * weight;
      b += sB * weight;
    }

    // 7. Vignette
    if (vigAmount > 0) {
      const px = (i / 4) % w;
      const py = Math.floor((i / 4) / w);
      const dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
      const vigFactor = Math.max(0, 1 - (dist / maxDist) * vigAmount);
      r *= vigFactor;
      g *= vigFactor;
      b *= vigFactor;
    }

    // 8. Film Grain
    if (grainAmount > 0) {
      const noise = (Math.random() - 0.5) * grainAmount * 60;
      r += noise;
      g += noise;
      b += noise;
    }

    d[i] = Math.min(255, Math.max(0, Math.round(r)));
    d[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
    d[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    d[i + 3] = a; // preserve alpha channel
  }

  // 9. Sharpness & Clarity (Convolution Pass)
  if (adj.sharpness > 0 || adj.clarity > 0) {
    const kSharp = (adj.sharpness / 100) * 1.5 + (adj.clarity / 100) * 1.0;
    const tempCopy = new Uint8ClampedArray(d);

    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = (row + x) * 4;
        for (let c = 0; c < 3; c++) {
          const center = tempCopy[idx + c];
          const top = tempCopy[((y - 1) * w + x) * 4 + c];
          const bottom = tempCopy[((y + 1) * w + x) * 4 + c];
          const left = tempCopy[(row + (x - 1)) * 4 + c];
          const right = tempCopy[(row + (x + 1)) * 4 + c];

          const highFreq = 4 * center - (top + bottom + left + right);
          d[idx + c] = Math.min(255, Math.max(0, Math.round(center + highFreq * kSharp * 0.25)));
        }
      }
    }
  }
}
