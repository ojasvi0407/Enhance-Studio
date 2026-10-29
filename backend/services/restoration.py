import cv2
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger("enhance_studio.restoration")

def wiener_deblur(image_np: np.ndarray, kernel_size: int = 5, k_ratio: float = 0.01) -> np.ndarray:
    """
    Wiener deconvolution in frequency domain:
    F(u, v) = [ H*(u, v) / (|H(u, v)|^2 + K) ] * G(u, v)
    """
    # Create point spread function (PSF) kernel
    psf = np.ones((kernel_size, kernel_size)) / (kernel_size * kernel_size)
    h, w = image_np.shape[:2]
    
    # Pad PSF to image size
    psf_padded = np.zeros((h, w), dtype=np.float32)
    kh, kw = psf.shape
    psf_padded[:kh, :kw] = psf
    psf_padded = np.roll(psf_padded, -kh // 2, axis=0)
    psf_padded = np.roll(psf_padded, -kw // 2, axis=1)

    # 2D FFT of PSF
    psf_fft = np.fft.fft2(psf_padded)
    psf_fft_conj = np.conj(psf_fft)
    psf_mag2 = np.abs(psf_fft) ** 2

    # Wiener filter transfer function
    wiener_filter = psf_fft_conj / (psf_mag2 + k_ratio)

    # Apply per color channel
    deblurred_channels = []
    for c in range(image_np.shape[2]):
        img_c = image_np[:, :, c].astype(np.float32)
        img_fft = np.fft.fft2(img_c)
        res_fft = img_fft * wiener_filter
        res_spatial = np.fft.ifft2(res_fft).real
        deblurred_channels.append(np.clip(res_spatial, 0, 255).astype(np.uint8))

    return np.dstack(deblurred_channels)

def lucy_richardson_deblur(image_np: np.ndarray, iterations: int = 10) -> np.ndarray:
    """
    Iterative Lucy-Richardson deconvolution algorithm for motion & defocus blur.
    f_{t+1} = f_t * ( (g / (f_t * h)) * h_rev )
    """
    kernel = np.ones((5, 5), dtype=np.float32) / 25.0
    kernel_rev = np.flip(kernel)

    channels = []
    for c in range(image_np.shape[2]):
        im = image_np[:, :, c].astype(np.float32) / 255.0
        im_est = np.copy(im)

        for _ in range(iterations):
            est_conv = cv2.filter2D(im_est, -1, kernel)
            est_conv = np.maximum(est_conv, 1e-6)
            relative_blur = im / est_conv
            error_est = cv2.filter2D(relative_blur, -1, kernel_rev)
            im_est = np.clip(im_est * error_est, 0.0, 1.0)

        channels.append((im_est * 255.0).astype(np.uint8))

    return np.dstack(channels)

def restore_and_deblur(
    image: Image.Image,
    mode: str = "balanced", # 'mild_blur', 'wiener', 'lucy_richardson', 'denoise_only'
    denoise_strength: float = 0.5,
    sharpness: float = 1.2
) -> Image.Image:
    """
    Executes advanced deblurring, noise reduction, and detail restoration.
    """
    has_alpha = image.mode == 'RGBA'
    if has_alpha:
        alpha = image.getchannel('A')
        img_rgb = image.convert('RGB')
    else:
        img_rgb = image.convert('RGB')

    img_np = np.array(img_rgb)

    # 1. Deconvolution or Deblur algorithm
    if mode == "wiener":
        restored = wiener_deblur(img_np, kernel_size=5, k_ratio=0.015)
    elif mode == "lucy_richardson":
        restored = lucy_richardson_deblur(img_np, iterations=8)
    elif mode == "mild_blur":
        # Unsharp high-pass deblur
        gaussian = cv2.GaussianBlur(img_np, (0, 0), sigmaX=2.0)
        restored = cv2.addWeighted(img_np, 1.5, gaussian, -0.5, 0)
    else:
        restored = img_np.copy()

    # 2. Non-Local Means / Bilateral Denoising
    if denoise_strength > 0:
        h = max(2, int(denoise_strength * 12))
        restored = cv2.fastNlMeansDenoisingColored(restored, None, h, h, 7, 21)

    # 3. Final sharpness enhancement
    if sharpness != 1.0:
        kernel = np.array([
            [0, -1, 0],
            [-1, 4 + sharpness, -1],
            [0, -1, 0]
        ], dtype=np.float32)
        norm_kernel = kernel / (np.sum(kernel) if np.sum(kernel) != 0 else 1.0)
        restored = cv2.filter2D(restored, -1, norm_kernel)
        restored = np.clip(restored, 0, 255).astype(np.uint8)

    result_pil = Image.fromarray(restored)
    if has_alpha:
        result_pil.putalpha(alpha)

    return result_pil
