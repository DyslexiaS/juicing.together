#!/usr/bin/env -S uv run py
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OPTIMIZED_DIR = ROOT / "assets" / "optimized"

DEFAULT_WEBP_QUALITY = 84
DEFAULT_AVIF_QUALITY = 62


def slugify(name: str) -> str:
    name = Path(name).stem.lower()
    name = re.sub(r"[^a-z0-9]+", "-", name)
    name = re.sub(r"-+", "-", name).strip("-")
    return name or "image"


def require_magick() -> None:
    if shutil.which("magick"):
        return
    print("error: ImageMagick 'magick' not found in PATH", file=sys.stderr)
    sys.exit(1)


def run(cmd: list[str]) -> None:
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print(result.stderr.strip() or result.stdout.strip(), file=sys.stderr)
        raise SystemExit(result.returncode)


def build_targets(base: str, widths: list[int], make_avif: bool, keep_png: bool) -> list[Path]:
    outputs: list[Path] = []
    for width in widths:
        outputs.append(OPTIMIZED_DIR / f"{base}-{width}.webp")
        if make_avif:
            outputs.append(OPTIMIZED_DIR / f"{base}-{width}.avif")
    if keep_png:
        outputs.append(OPTIMIZED_DIR / f"{base}.png")
    return outputs


def optimize_image(src: Path, base: str, widths: list[int], make_avif: bool, keep_png: bool) -> list[Path]:
    outputs: list[Path] = []
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)

    for width in widths:
        webp_out = OPTIMIZED_DIR / f"{base}-{width}.webp"
        run([
            "magick", str(src),
            "-resize", f"{width}x{width}>",
            "-quality", str(DEFAULT_WEBP_QUALITY),
            str(webp_out),
        ])
        outputs.append(webp_out)

        if make_avif:
            avif_out = OPTIMIZED_DIR / f"{base}-{width}.avif"
            run([
                "magick", str(src),
                "-resize", f"{width}x{width}>",
                "-quality", str(DEFAULT_AVIF_QUALITY),
                str(avif_out),
            ])
            outputs.append(avif_out)

    if keep_png:
        png_out = OPTIMIZED_DIR / f"{base}.png"
        shutil.copy2(src, png_out)
        outputs.append(png_out)

    return outputs


def print_usage_snippet(base: str, widths: list[int], make_avif: bool, keep_png: bool) -> None:
    widths = sorted(widths)
    largest = widths[-1]
    print("\nSuggested HTML snippet:\n")
    print("<picture>")
    if make_avif:
        avif_srcset = ", ".join(f"assets/optimized/{base}-{w}.avif {w}w" for w in widths)
        print(f'  <source srcset="{avif_srcset}" type="image/avif">')
    webp_srcset = ", ".join(f"assets/optimized/{base}-{w}.webp {w}w" for w in widths)
    print(f'  <source srcset="{webp_srcset}" type="image/webp">')
    fallback = f"assets/optimized/{base}.png" if keep_png else f"assets/optimized/{base}-{largest}.webp"
    print(f'  <img src="{fallback}" alt="" width="{largest}" height="{largest}" loading="lazy" decoding="async">')
    print("</picture>\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Optimize project images into assets/optimized")
    parser.add_argument("src", nargs="+", help="source image path(s)")
    parser.add_argument("--name", help="base output slug (single-source only)")
    parser.add_argument("--widths", default="372,744", help="comma-separated widths, e.g. 280,490 or 372,744")
    parser.add_argument("--no-avif", action="store_true", help="skip AVIF output")
    parser.add_argument("--keep-png", action="store_true", help="copy source PNG into assets/optimized/<name>.png")
    return parser.parse_args()


def main() -> None:
    require_magick()
    args = parse_args()
    widths = [int(x.strip()) for x in args.widths.split(",") if x.strip()]
    if not widths:
        print("error: no widths provided", file=sys.stderr)
        sys.exit(1)

    all_outputs: list[Path] = []
    for i, src_raw in enumerate(args.src):
        src = Path(src_raw).expanduser().resolve()
        if not src.exists():
            print(f"error: source not found: {src}", file=sys.stderr)
            sys.exit(1)
        base = args.name if args.name and len(args.src) == 1 else slugify(src.name)
        outputs = optimize_image(src, base, widths, make_avif=not args.no_avif, keep_png=args.keep_png)
        all_outputs.extend(outputs)
        print(f"optimized: {src.name} -> {base}")
        for out in outputs:
            size_kb = round(out.stat().st_size / 1024, 1)
            rel = out.relative_to(ROOT)
            print(f"  - {rel} ({size_kb} KB)")
        print_usage_snippet(base, widths, make_avif=not args.no_avif, keep_png=args.keep_png)

    print(f"done: wrote {len(all_outputs)} files to {OPTIMIZED_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
