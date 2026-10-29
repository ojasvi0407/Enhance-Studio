/**
 * Procedural Stock Sample Images for Instant Demonstration
 * Generated on Canvas with realistic subjects for testing:
 * - Background removal
 * - Color grading
 * - Blur restoration
 * - AI Upscaling
 */

export const STUDIO_SAMPLES = [
  {
    id: 'studio_portrait',
    name: 'Studio Model Portrait',
    category: 'Background Removal & Retouching',
    description: 'Studio headshot with sharp hair contours and neutral background, perfect for background segmentation.',
    generate: (w = 600, h = 600) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // Studio backdrop gradient
      const bg = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w*0.6);
      bg.addColorStop(0, '#e2e8f0');
      bg.addColorStop(1, '#94a3b8');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Torso & jacket
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(w/2, h * 0.92, w * 0.38, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shirt collar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.65);
      ctx.lineTo(w * 0.5, h * 0.78);
      ctx.lineTo(w * 0.58, h * 0.65);
      ctx.fill();

      // Neck
      ctx.fillStyle = '#f8b492';
      ctx.fillRect(w * 0.44, h * 0.56, w * 0.12, h * 0.12);

      // Face silhouette
      ctx.fillStyle = '#fbc09d';
      ctx.beginPath();
      ctx.ellipse(w/2, h * 0.43, w * 0.18, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cheeks & highlights
      ctx.fillStyle = 'rgba(251, 146, 60, 0.25)';
      ctx.beginPath();
      ctx.arc(w * 0.4, h * 0.46, 22, 0, Math.PI * 2);
      ctx.arc(w * 0.6, h * 0.46, 22, 0, Math.PI * 2);
      ctx.fill();

      // Hair (rich texture with strands)
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(w/2, h * 0.36, w * 0.22, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();

      // Hair wisps on the sides
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 6;
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const startX = w * 0.28 + i * (w * 0.44 / 15);
        ctx.moveTo(startX, h * 0.25);
        ctx.quadraticCurveTo(startX + (Math.random() - 0.5) * 40, h * 0.45, startX + (Math.random() - 0.5) * 60, h * 0.6);
        ctx.stroke();
      }

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(w * 0.42, h * 0.42, 14, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(w * 0.58, h * 0.42, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7'; // Blue iris
      ctx.beginPath();
      ctx.arc(w * 0.42, h * 0.42, 6, 0, Math.PI * 2);
      ctx.arc(w * 0.58, h * 0.42, 6, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w * 0.42, h * 0.38, 16, Math.PI * 1.1, Math.PI * 1.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.58, h * 0.38, 16, Math.PI * 1.2, Math.PI * 1.9);
      ctx.stroke();

      // Lips
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.53, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      return canvas.toDataURL('image/png');
    }
  },
  {
    id: 'sunset_mountains',
    name: 'Alpine Sunset Horizon',
    category: 'Cinematic Color Grading',
    description: 'High dynamic range landscape ideal for testing Teal & Orange, Golden Hour, and Split Toning.',
    generate: (w = 600, h = 600) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      sky.addColorStop(0, '#0c4a6e');
      sky.addColorStop(0.4, '#ea580c');
      sky.addColorStop(0.7, '#fbbf24');
      sky.addColorStop(1, '#fef08a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Radiant Sun
      const sun = ctx.createRadialGradient(w * 0.65, h * 0.45, 10, w * 0.65, h * 0.45, 120);
      sun.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      sun.addColorStop(0.3, 'rgba(254, 240, 138, 0.6)');
      sun.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(w * 0.65, h * 0.45, 120, 0, Math.PI * 2);
      ctx.fill();

      // Distant mountains
      ctx.fillStyle = '#431407';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.lineTo(w * 0.25, h * 0.42);
      ctx.lineTo(w * 0.45, h * 0.54);
      ctx.lineTo(w * 0.7, h * 0.38);
      ctx.lineTo(w, h * 0.58);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Foreground alpine peaks
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.75);
      ctx.lineTo(w * 0.3, h * 0.55);
      ctx.lineTo(w * 0.6, h * 0.72);
      ctx.lineTo(w * 0.85, h * 0.52);
      ctx.lineTo(w, h * 0.68);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Lake water reflection
      const lake = ctx.createLinearGradient(0, h * 0.78, 0, h);
      lake.addColorStop(0, '#78350f');
      lake.addColorStop(0.5, '#1e3a8a');
      lake.addColorStop(1, '#0f172a');
      ctx.fillStyle = lake;
      ctx.fillRect(0, h * 0.78, w, h * 0.22);

      return canvas.toDataURL('image/png');
    }
  },
  {
    id: 'blurry_vehicle',
    name: 'Motion Blur Sports Car',
    category: 'Blur Fix & Restoration',
    description: 'Vehicle with horizontal motion blur and camera defocus, ideal for Wiener & Lucy-Richardson deblurring.',
    generate: (w = 600, h = 600) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // Asphalt background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);

      // Motion speed streaks in background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 40; i++) {
        const y = Math.random() * h;
        const x = Math.random() * w * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 120 + Math.random() * 100, y);
        ctx.stroke();
      }

      // Sports car chassis
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(w * 0.2, h * 0.45, w * 0.6, h * 0.16, 20);
      ctx.fill();

      // Cabin & windshield
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.45);
      ctx.lineTo(w * 0.45, h * 0.36);
      ctx.lineTo(w * 0.65, h * 0.36);
      ctx.lineTo(w * 0.72, h * 0.45);
      ctx.closePath();
      ctx.fill();

      // Wheels
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(w * 0.32, h * 0.62, 36, 0, Math.PI * 2);
      ctx.arc(w * 0.68, h * 0.62, 36, 0, Math.PI * 2);
      ctx.fill();

      // Rims
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w * 0.32, h * 0.62, 22, 0, Math.PI * 2);
      ctx.arc(w * 0.68, h * 0.62, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Simulate realistic horizontal motion blur
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      for (let offset = 4; offset <= 24; offset += 4) {
        ctx.fillRect(w * 0.2 - offset, h * 0.45, w * 0.6, h * 0.16);
      }

      return canvas.toDataURL('image/png');
    }
  }
];
