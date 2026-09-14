"""Regenerate content/media-manifest.json from the files in /public/media.

next/image needs an intrinsic width and height to reserve layout space before
an image loads. Rather than hand-writing those per call site, where they drift
from the files, they are measured here and read back by lib/media.ts.

Run this after adding or replacing anything in /public/media:

    python scripts/measure-media.py

Requires Pillow:  pip install pillow
"""

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "media"
OUT = ROOT / "content" / "media-manifest.json"

EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".avif"}

manifest: dict[str, dict[str, int]] = {}
for path in sorted(MEDIA.rglob("*")):
    if path.suffix.lower() not in EXTENSIONS:
        continue
    with Image.open(path) as image:
        width, height = image.size
    manifest["/" + path.relative_to(ROOT / "public").as_posix()] = {
        "width": width,
        "height": height,
    }

OUT.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"Measured {len(manifest)} images -> {OUT.relative_to(ROOT)}")
