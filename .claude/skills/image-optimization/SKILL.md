---
name: image-optimization
description: Optimize newly added local images into this project's `assets/optimized/` pattern. Use this whenever the user adds or replaces site images, asks to compress images, create responsive WebP/AVIF variants, reduce asset size, or wants HTML snippets that match this repo's image conventions. Prefer this skill over ad-hoc shell commands so the workflow stays consistent and token-cheap.
---

# Image Optimization

Use this skill when the user adds new local images and wants them processed to match this repo's existing `assets/optimized/` workflow.

## What this skill does
- Converts source images into project-ready optimized assets under `assets/optimized/`
- Generates `.webp` and optionally `.avif` variants at chosen widths
- Can preserve a `.png` fallback when useful
- Prints a ready-to-paste HTML `<picture>` snippet
- Keeps naming consistent with the repo's current pattern (`name-372.webp`, `name-744.avif`, etc.)

## Project conventions
### Typical width sets
Pick widths by usage:

- **Icon / tiny decorative asset**: `76`
- **Small decorative / inline image**: `260`, `280`, `300`, `320`
- **Card / service image**: `372,744`
- **Medium content image**: `490`
- **Large content image / pricing image**: `560`, `567`, `620`, `744`
- **Hero image**: handled separately under `assets/hero/`, not by this skill

### Output location
Always write to:
- `assets/optimized/`

### HTML conventions
When inserting optimized images into the page:
- prefer `<picture>`
- include `avif` source if generated
- include `webp` source
- keep fallback image local
- set `width` / `height`
- set `loading="lazy"` and `decoding="async"` for non-LCP images

## Default workflow
When the user asks to optimize a new image:
1. Inspect where the image will be used
2. Choose widths that match that usage
3. Run helper script
4. Review file sizes quickly
5. Update HTML to use `<picture>` if requested

## Helper script
Use this script instead of hand-writing long `magick` commands:

```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py <source>
```

### Common examples
#### Card image (default B2B site image)
```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py \
  ~/Downloads/new-fruit-box.png \
  --name fruit-box \
  --widths 372,744
```

#### Decorative image with one size only
```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py \
  ~/Downloads/icon.png \
  --name fruit-platter \
  --widths 280
```

#### Keep PNG fallback too
```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py \
  ~/Downloads/pricing-board.png \
  --name fruit-box-pricing \
  --widths 560,744 \
  --keep-png
```

#### Skip AVIF if it breaks or is unnecessary
```bash
uv run py .claude/skills/image-optimization/scripts/optimize_image.py \
  ~/Downloads/logo-art.png \
  --name logo-art \
  --widths 320 \
  --no-avif
```

## Decision rules
### Use `--keep-png` when
- the image may be reused as a manual fallback
- the asset is likely to be used for social previews or external consumers
- the user explicitly wants PNG kept

### Avoid giant SVGs in page content
If the user provides a huge SVG used only as an illustration:
- do **not** blindly embed it
- consider rasterizing to `.webp` / `.avif`
- keep SVG only if it is lightweight and semantically right (logo/icon/vector art)

## What to tell the user
After running the script, report:
- output filenames
- approximate sizes
- which one should be used in HTML
- whether the old asset should be replaced or kept

## If editing HTML too
When you also replace markup, prefer concise updates like:
- swap old `src` / `srcset`
- use the generated `<picture>` snippet
- keep existing classes and dimensions aligned with surrounding code

## Guardrails
- Do not optimize hero images with this skill unless the user explicitly wants that; hero images in this repo use a separate `assets/hero/` multi-size pattern
- Do not delete original files unless the user asks
- Do not invent widths randomly; choose them based on visible usage
- If unsure between two width sets, pick the smaller one first and verify visually
