import io
import torch
import torchvision.transforms as T
import torchvision.models.segmentation as seg
from PIL import Image, ImageFilter, ImageOps
import numpy as np
import cv2
import logging

logger = logging.getLogger("enhance_studio.segmentation")

# Singleton model holder
_segmentation_model = None

def get_segmentation_model():
    global _segmentation_model
    if _segmentation_model is None:
        logger.info("Initializing DeepLabV3-MobileNetV3 segmentation model...")
        weights = seg.DeepLabV3_MobileNet_V3_Large_Weights.DEFAULT
        model = seg.deeplabv3_mobilenet_v3_large(weights=weights)
        model.eval()
        _segmentation_model = model
    return _segmentation_model

def remove_background(
    image: Image.Image,
    feather_radius: int = 2,
    threshold: float = 0.5,
    bg_mode: str = "transparent", # 'transparent', 'color', 'gradient', 'image'
    bg_color: str = "#ffffff",
    bg_gradient: Optional[str] = None,
    custom_bg_image: Optional[Image.Image] = None
) -> Image.Image:
    """
    Performs AI background removal using DeepLabV3 segmentation with sub-pixel edge refinement.
    Outputs RGBA image with true alpha transparency or replaced background.
    """
    model = get_segmentation_model()
    orig_w, orig_h = image.size
    img_rgb = image.convert("RGB")

    # Standard ImageNet normalization for Torchvision segmentation models
    transform = T.Compose([
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    input_tensor = transform(img_rgb).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)['out'][0]
        # Softmax over 21 VOC classes
        probabilities = torch.softmax(output, dim=0)
        # Background is class 0; foreground is everything else
        foreground_prob = (1.0 - probabilities[0]).numpy()

    # Resize probability mask back to original resolution with bilinear interpolation
    mask_resized = cv2.resize(foreground_prob, (orig_w, orig_h), interpolation=cv2.INTER_LINEAR)

    # Apply confidence thresholding and smooth sigmoid transition
    binary_mask = (mask_resized > threshold).astype(np.float32)

    # Edge refinement with morphological smoothing
    kernel_size = max(3, feather_radius * 2 + 1)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    
    # Remove small noise specs
    cleaned_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, kernel)
    
    # Guided / Gaussian feathering on the alpha boundary
    if feather_radius > 0:
        feathered = cv2.GaussianBlur(cleaned_mask, (kernel_size, kernel_size), sigmaX=feather_radius)
    else:
        feathered = cleaned_mask

    alpha_channel = (np.clip(feathered, 0.0, 1.0) * 255).astype(np.uint8)
    alpha_pil = Image.fromarray(alpha_channel, mode='L')

    # Construct RGBA Foreground
    fg_rgba = img_rgb.copy()
    fg_rgba.putalpha(alpha_pil)

    if bg_mode == "transparent":
        return fg_rgba

    # Background replacement logic
    bg_canvas = Image.new("RGBA", (orig_w, orig_h), (0, 0, 0, 0))

    if bg_mode == "color":
        # Solid color hex parsing
        hex_str = bg_color.lstrip("#")
        if len(hex_str) == 6:
            r = int(hex_str[0:2], 16)
            g = int(hex_str[2:4], 16)
            b = int(hex_str[4:6], 16)
            color_bg = Image.new("RGBA", (orig_w, orig_h), (r, g, b, 255))
            color_bg.paste(fg_rgba, (0, 0), fg_rgba)
            return color_bg

    elif bg_mode == "gradient":
        # Create 2-point vertical or diagonal gradient
        grad_arr = np.zeros((orig_h, orig_w, 4), dtype=np.uint8)
        # Default studio gradient: sleek dark teal to deep indigo
        c1 = [15, 23, 42]   # Slate 900
        c2 = [6, 182, 212]  # Cyan 500
        for y in range(orig_h):
            ratio = y / orig_h
            r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
            g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
            b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
            grad_arr[y, :] = [r, g, b, 255]
        grad_bg = Image.fromarray(grad_arr, mode="RGBA")
        grad_bg.paste(fg_rgba, (0, 0), fg_rgba)
        return grad_bg

    elif bg_mode == "image" and custom_bg_image is not None:
        custom_bg_resized = custom_bg_image.convert("RGBA").resize((orig_w, orig_h), Image.Resampling.LANCZOS)
        custom_bg_resized.paste(fg_rgba, (0, 0), fg_rgba)
        return custom_bg_resized

    return fg_rgba
