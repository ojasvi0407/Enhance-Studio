/**
 * API Client connecting the frontend to the local FastAPI AI backend
 */

export const API_BASE_URL = 'http://127.0.0.1:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function apiRemoveBackground(imageBlob, params) {
  const formData = new FormData();
  formData.append('file', imageBlob, 'image.png');
  formData.append('feather_radius', params.feather_radius.toString());
  formData.append('threshold', params.threshold.toString());
  formData.append('bg_mode', params.bg_mode);
  formData.append('bg_color', params.bg_color);

  if (params.custom_bg) {
    formData.append('custom_bg', params.custom_bg, 'custom_bg.png');
  }

  const res = await fetch(`${API_BASE_URL}/api/remove-background`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Background removal failed on backend.');
  }

  return await res.blob();
}

export async function apiUpscale(imageBlob, params) {
  const formData = new FormData();
  formData.append('file', imageBlob, 'image.png');
  formData.append('scale', params.scale.toString());
  formData.append('denoise', params.denoise.toString());
  formData.append('clarity', params.clarity.toString());

  const res = await fetch(`${API_BASE_URL}/api/upscale`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Upscaling failed on backend.');
  }

  return await res.blob();
}

export async function apiRestore(imageBlob, params) {
  const formData = new FormData();
  formData.append('file', imageBlob, 'image.png');
  formData.append('mode', params.mode);
  formData.append('denoise', params.denoise.toString());
  formData.append('sharpness', params.sharpness.toString());

  const res = await fetch(`${API_BASE_URL}/api/restore`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Restoration failed on backend.');
  }

  return await res.blob();
}

export async function apiDenoise(imageBlob, strength) {
  const formData = new FormData();
  formData.append('file', imageBlob, 'image.png');
  formData.append('strength', strength.toString());

  const res = await fetch(`${API_BASE_URL}/api/denoise`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Denoising failed on backend.');
  }

  return await res.blob();
}

export async function apiExportImage(imageBlob, format, quality, targetWidth, targetHeight) {
  const formData = new FormData();
  formData.append('file', imageBlob, `export.${format}`);
  formData.append('format', format);
  formData.append('quality', quality.toString());
  if (targetWidth && targetHeight) {
    formData.append('target_width', targetWidth.toString());
    formData.append('target_height', targetHeight.toString());
  }

  const res = await fetch(`${API_BASE_URL}/api/export`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Server-side export failed.');
  }

  return await res.blob();
}
