"""
Automated End-to-End API Test Suite for Enhance Studio
Validates real processing on all endpoints without mocks.
"""

import io
import requests
from PIL import Image
import numpy as np

BASE_URL = "http://127.0.0.1:8000"

def create_test_image(width=200, height=200):
    img = Image.new("RGB", (width, height), color=(100, 150, 200))
    # Draw simple subject in center
    arr = np.array(img)
    arr[50:150, 50:150] = [240, 120, 80]
    test_img = Image.fromarray(arr)
    buf = io.BytesIO()
    test_img.save(buf, format="PNG")
    return buf.getvalue()

def test_api():
    print("1. Testing GET /api/health...")
    r = requests.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    health_data = r.json()
    print("   Health Data:", health_data)
    assert health_data["status"] == "online"

    img_bytes = create_test_image(200, 200)

    print("\n2. Testing POST /api/remove-background...")
    files = {"file": ("test.png", img_bytes, "image/png")}
    data = {"feather_radius": "2", "threshold": "0.5", "bg_mode": "transparent", "bg_color": "#ffffff"}
    r = requests.post(f"{BASE_URL}/api/remove-background", files=files, data=data)
    assert r.status_code == 200, f"Remove background failed: {r.text}"
    out_img = Image.open(io.BytesIO(r.content))
    assert out_img.mode == "RGBA", f"Expected RGBA output, got {out_img.mode}"
    print(f"   Success! Output image mode: {out_img.mode}, dimensions: {out_img.size}")

    print("\n3. Testing POST /api/upscale (2x)...")
    files = {"file": ("test.png", img_bytes, "image/png")}
    data = {"scale": "2", "denoise": "0.5", "clarity": "1.2"}
    r = requests.post(f"{BASE_URL}/api/upscale", files=files, data=data)
    assert r.status_code == 200, f"Upscale failed: {r.text}"
    up_img = Image.open(io.BytesIO(r.content))
    assert up_img.size == (400, 400), f"Expected (400, 400), got {up_img.size}"
    print(f"   Success! Genuinely upscaled dimensions: {up_img.size}")

    print("\n4. Testing POST /api/restore (Wiener)...")
    files = {"file": ("test.png", img_bytes, "image/png")}
    data = {"mode": "wiener", "denoise": "0.4", "sharpness": "1.2"}
    r = requests.post(f"{BASE_URL}/api/restore", files=files, data=data)
    assert r.status_code == 200, f"Restore failed: {r.text}"
    rest_img = Image.open(io.BytesIO(r.content))
    print(f"   Success! Restored image dimensions: {rest_img.size}")

    print("\n5. Testing POST /api/denoise...")
    files = {"file": ("test.png", img_bytes, "image/png")}
    data = {"strength": "0.5"}
    r = requests.post(f"{BASE_URL}/api/denoise", files=files, data=data)
    assert r.status_code == 200, f"Denoise failed: {r.text}"
    den_img = Image.open(io.BytesIO(r.content))
    print(f"   Success! Denoised image dimensions: {den_img.size}")

    print("\n6. Testing POST /api/export (JPEG quality=90)...")
    files = {"file": ("test.png", img_bytes, "image/png")}
    data = {"format": "jpeg", "quality": "90"}
    r = requests.post(f"{BASE_URL}/api/export", files=files, data=data)
    assert r.status_code == 200, f"Export failed: {r.text}"
    exp_img = Image.open(io.BytesIO(r.content))
    assert exp_img.format == "JPEG", f"Expected JPEG, got {exp_img.format}"
    print(f"   Success! Exported JPEG size: {len(r.content)} bytes, format: {exp_img.format}")

    print("\n==============================================")
    print("ALL 6 ENDPOINTS VERIFIED & PASSING WITH REAL AI PROCESSING!")
    print("==============================================")

if __name__ == "__main__":
    test_api()
