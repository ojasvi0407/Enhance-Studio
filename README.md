# Enhance Studio 📸✨
> **Professional AI Image Enhancement, Matting & Cinematic Color Studio**

Enhance Studio is a high-performance, full-stack image editing application designed for professional-quality image enhancement, background removal, blur correction, super-resolution upscaling, and cinematic color grading.

---

## 🚀 Key Features

### 1. AI Image Enhancement
- **Smart Auto-Enhance:** Analyzes image luminance histogram, contrast dynamics, and color casts to calculate balanced, natural exposure and tone adjustments without artificial textures or oversaturation.
- **AI Super-Resolution Upscaling (2× & 4×):** Sub-pixel neural super-resolution network genuinely expanding pixel dimensions (e.g. $600\times600 \to 1200\times1200$ or $2400\times2400$).
- **Highlights & Shadows Recovery:** Protects clipping in bright regions and recovers deep shadow detail.
- **Clarity & Texture:** Unsharp high-frequency spatial convolution boosting fine edges.

### 2. Background Removal Studio
- **Neural Subject Segmentation:** DeepLabV3-MobileNetV3 PyTorch segmentation model isolating human subjects and objects.
- **Sub-Pixel Alpha Matting & Edge Feathering:** Morphological noise suppression and Gaussian edge feathering for smooth hair/edge transitions.
- **Checkerboard Alpha Preview:** Real transparent pixels (RGBA) preserved in image memory.
- **Solid-Color Replacement:** Studio palettes (White, Deep Charcoal, Royal Navy, Crimson Wine, Emerald) plus custom HEX color picker.
- **Studio Gradient Replacement:** Multi-stop vertical and diagonal background gradients.
- **Custom Backdrop Composite:** Upload any background image and composite the isolated foreground subject seamlessly.

### 3. Blur Fix & Image Restoration
- **Wiener Frequency Deconvolution:** Frequency-domain restoration based on the optical Point Spread Function (PSF):
  $$F(u, v) = \frac{H^*(u, v)}{|H(u, v)|^2 + K} G(u, v)$$
- **Lucy-Richardson Iterative Deconvolution:** Iterative non-linear deblurring for camera shake and defocus blur.
- **Non-Local Means (NL-Means) Denoising:** Advanced color patch similarity denoising eliminating high-ISO sensor noise.
- **Acutance Sharpening:** High-pass spatial edge boost.

### 4. Cinematic Color Lab
- **Live Tone Adjustments:** Exposure, Brightness, Contrast, Highlights, Shadows, Whites, Blacks.
- **Color & White Balance:** Temperature (Kelvin cool blue to warm gold), Tint (green to magenta), Vibrance (skin-tone safe), and Saturation.
- **Split Toning:** Independent Highlight and Shadow hue & saturation tinting.
- **Atmospheric Effects:** Smooth radial Vignette and natural 35mm Film Grain.
- **10 One-Click Cinematic Presets:**
  1. *Teal & Orange* (Hollywood blockbuster look)
  2. *Dark Cinematic* (Moody contrast with cyan shadow cast)
  3. *Golden Hour* (Warm radiant sunlight)
  4. *Cool Blue Nordic* (Clean editorial Scandinavian tone)
  5. *Vintage 35mm Film* (Warm highlights, faded shadows, authentic grain)
  6. *Soft Pastel* (Airy, low contrast portrait glow)
  7. *Moody Shadows* (Deep rich blacks with high contrast)
  8. *Natural Clean* (Faithful commercial grading)
  9. *B&W Film Noir* (High-contrast monochromatic film look)
  10. *Default / Raw* (Neutral reset)

### 5. Professional UI & Workspace
- **Non-Destructive Editing Pipeline:** Edits are stored as a parameter sequence rendered against untouched source pixels.
- **History Stack:** Full Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) with snapshot state tracking.
- **Before-and-After Comparison:**
  - Interactive **Split Curtain Wipe Slider** with draggable divider.
  - **Side-by-Side** dual viewer.
- **Zoom & Pan Navigation:** 40% to 400% zoom with canvas pan.
- **Multi-Format Export:** PNG with alpha transparency, JPEG with quality factor, and WebP at 1× or 2× upscaled resolution.

---

## 🛠️ Technology Architecture

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Dark Charcoal aesthetic)
- **Canvas Rendering:** HTML5 2D Canvas pipeline for 60fps real-time adjustments
- **Icons:** Custom high-DPI SVG icons

### Backend
- **Framework:** Python 3.14 + FastAPI + Uvicorn
- **AI / Computer Vision Engines:**
  - PyTorch 2.13 (DeepLabV3-MobileNetV3 for subject segmentation, ESPCN neural super-resolution)
  - OpenCV 5.0 (NL-Means denoising, Lanczos interpolation, morphological edge refinement)
  - NumPy & Pillow (Frequency FFT deconvolution, multi-channel image manipulation)

---

## 🏃 Getting Started

### 1. Start the FastAPI AI Backend
```bash
# In the backend directory:
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```
Backend health check: `http://127.0.0.1:8000/api/health`

### 2. Start the Frontend Development Server
```bash
# In the project root:
node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3000
```
Open in browser: `http://127.0.0.1:3000/`

### 3. Run Automated End-to-End API Tests
```bash
python backend/test_api.py
```
Validates all 6 backend endpoints (`/api/health`, `/api/remove-background`, `/api/upscale`, `/api/restore`, `/api/denoise`, `/api/export`).

---

## 📁 Repository Structure

```
DIP_project/
├── index.html                   # HTML5 Entrypoint
├── package.json                 # Frontend dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind dark palette tokens
├── README.md                    # Project documentation
├── backend/
│   ├── app.py                   # FastAPI server & route handlers
│   ├── test_api.py              # Automated test suite
│   └── services/
│       ├── segmentation.py      # DeepLabV3 AI background removal
│       ├── upscaling.py         # Neural super-resolution upscaler
│       └── restoration.py       # Wiener & Lucy-Richardson deblurring
└── src/
    ├── main.jsx                 # React root mounting
    ├── App.jsx                  # Master application coordinator & history stack
    ├── index.css                # Global stylesheet & design tokens
    ├── components/
    │   ├── StudioHeader.jsx     # Top bar with backend badge, undo/redo, export
    │   ├── StudioSidebar.jsx    # Left navigation tabs (Enhance, Matting, Blur Fix, Color)
    │   ├── StudioCanvas.jsx     # Center canvas with interactive split wipe & zoom
    │   ├── StudioControls.jsx   # Right settings panel with live sliders & AI buttons
    │   ├── PresetBar.jsx        # Bottom collapsible 10-preset filmstrip
    │   ├── ExportModal.jsx      # High-res format & resolution export modal
    │   ├── StockModal.jsx       # Benchmark demo dataset picker
    │   └── icons.jsx            # High-performance SVG icon components
    └── utils/
        ├── apiClient.js         # HTTP client communicating with backend
        ├── clientEditingEngine.js # 60fps Canvas render pipeline & presets
        └── stockSamples.js      # Procedural portrait, landscape & motion blur samples
```
