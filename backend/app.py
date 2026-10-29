import os
import io
import time
import logging
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from PIL import Image

from services.segmentation import remove_background
from services.upscaling import upscale_image
from services.restoration import restore_and_deblur

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("enhance_studio")

# Initialize FastAPI App
app = FastAPI(
    title="Enhance Studio AI Backend",
    description="Professional AI image enhancement, background removal, upscaling, and restoration API",
    version="1.0.0"
)

# Enable CORS for frontend development server and custom origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}

def validate_image_file(file: UploadFile, contents: bytes) -> Image.Image:
    """Validates file size, MIME type, and image integrity."""
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds maximum allowed limit of 25MB.")
    
    try:
        image = Image.open(io.BytesIO(contents))
        image.verify()
        # Re-open after verify()
        image = Image.open(io.BytesIO(contents))
        return image
    except Exception as e:
        logger.error(f"Image validation failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid or corrupt image file format.")

def image_to_response(image: Image.Image, output_format: str = "png", quality: int = 95) -> Response:
    """Encodes PIL Image to bytes and returns streaming HTTP Response."""
    out_buf = io.BytesIO()
    fmt_upper = output_format.upper()
    mime_type = "image/png" if fmt_upper == "PNG" else "image/webp" if fmt_upper == "WEBP" else "image/jpeg"

    if fmt_upper == "PNG":
        image.save(out_buf, format="PNG", optimize=True)
    elif fmt_upper == "WEBP":
        image.save(out_buf, format="WEBP", quality=quality)
    else:
        # Convert RGBA to RGB for JPEG
        if image.mode in ('RGBA', 'LA'):
            bg = Image.new("RGB", image.size, (255, 255, 255))
            bg.paste(image, mask=image.split()[-1])
            bg.save(out_buf, format="JPEG", quality=quality, optimize=True)
        else:
            image.convert("RGB").save(out_buf, format="JPEG", quality=quality, optimize=True)

    out_bytes = out_buf.getvalue()
    return Response(content=out_bytes, media_type=mime_type)

@app.get("/api/health")
async def health_check():
    """Health check endpoint exposing real hardware capabilities."""
    import torch
    import cv2
    return {
        "status": "online",
        "service": "Enhance Studio AI Engine",
        "version": "1.0.0",
        "capabilities": {
            "background_removal": True,
            "super_resolution_upscaling": True,
            "blur_restoration": True,
            "noise_reduction": True,
            "color_grading": True
        },
        "hardware": {
            "torch_version": torch.__version__,
            "cuda_available": torch.cuda.is_available(),
            "device": "cuda" if torch.cuda.is_available() else "cpu",
            "opencv_version": cv2.__version__
        }
    }

@app.post("/api/remove-background")
async def api_remove_background(
    file: UploadFile = File(...),
    feather_radius: int = Form(2),
    threshold: float = Form(0.5),
    bg_mode: str = Form("transparent"),
    bg_color: str = Form("#ffffff"),
    custom_bg: Optional[UploadFile] = File(None)
):
    """
    Removes background using AI subject segmentation.
    Returns RGBA PNG with true alpha transparency or replaced background.
    """
    contents = await file.read()
    image = validate_image_file(file, contents)

    custom_bg_img = None
    if custom_bg is not None:
        bg_contents = await custom_bg.read()
        if len(bg_contents) > 0:
            custom_bg_img = validate_image_file(custom_bg, bg_contents)

    processed = remove_background(
        image=image,
        feather_radius=feather_radius,
        threshold=threshold,
        bg_mode=bg_mode,
        bg_color=bg_color,
        custom_bg_image=custom_bg_img
    )

    return image_to_response(processed, output_format="png")

@app.post("/api/upscale")
async def api_upscale(
    file: UploadFile = File(...),
    scale: int = Form(2),
    denoise: float = Form(0.5),
    clarity: float = Form(1.2)
):
    """
    Genuinely upscales the image by 2x or 4x using neural super-resolution.
    """
    contents = await file.read()
    image = validate_image_file(file, contents)

    upscaled = upscale_image(
        image=image,
        scale=scale,
        denoise_strength=denoise,
        clarity_boost=clarity
    )

    fmt = "png" if image.mode == "RGBA" else "jpeg"
    return image_to_response(upscaled, output_format=fmt)

@app.post("/api/restore")
async def api_restore(
    file: UploadFile = File(...),
    mode: str = Form("balanced"),
    denoise: float = Form(0.5),
    sharpness: float = Form(1.2)
):
    """
    Executes Wiener / Lucy-Richardson deblurring and noise reduction.
    """
    contents = await file.read()
    image = validate_image_file(file, contents)

    restored = restore_and_deblur(
        image=image,
        mode=mode,
        denoise_strength=denoise,
        sharpness=sharpness
    )

    fmt = "png" if image.mode == "RGBA" else "jpeg"
    return image_to_response(restored, output_format=fmt)

@app.post("/api/denoise")
async def api_denoise(
    file: UploadFile = File(...),
    strength: float = Form(0.6)
):
    """
    Performs fast Non-Local Means color denoising.
    """
    contents = await file.read()
    image = validate_image_file(file, contents)

    denoised = restore_and_deblur(
        image=image,
        mode="denoise_only",
        denoise_strength=strength,
        sharpness=1.0
    )

    fmt = "png" if image.mode == "RGBA" else "jpeg"
    return image_to_response(denoised, output_format=fmt)

@app.post("/api/export")
async def api_export(
    file: UploadFile = File(...),
    format: str = Form("png"),
    quality: int = Form(95),
    target_width: Optional[int] = Form(None),
    target_height: Optional[int] = Form(None)
):
    """
    Server-side high-resolution rendering and export encoding.
    """
    contents = await file.read()
    image = validate_image_file(file, contents)

    if target_width and target_height and (target_width != image.width or target_height != image.height):
        image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)

    return image_to_response(image, output_format=format, quality=quality)
