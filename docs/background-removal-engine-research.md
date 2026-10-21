# Toolioz cutout engine: research, implementation, and limits

Research and implementation date: 1 October 2026.

## Product-status research

[Designkit’s 30 September report](https://www.designkit.com/blog/remove-bg-shutting-down-user-reactions) reports that remove.bg’s standalone website will close on 1 December 2026, with migration to other Canva products. However, the [official homepage](https://www.remove.bg/) returned by the research tool still advertised the service; focused searches on remove.bg did not surface an official shutdown announcement. The reported date is **not independently confirmed from a primary source in this investigation**. No shutdown claim is used in Toolioz marketing or tool metadata.

## Constraint and decision

The requested engine must not depend on a paid API, copied implementation, downloaded neural-model weights, or a newly introduced third-party image-processing package requiring redistribution notices. Existing Next.js/React/UI dependencies remain unchanged and keep their existing licensing requirements. The new engine has no package imports and calls no network service. The sample image is procedural artwork authored in the tool.

The feasible deliverable is classical automatic segmentation for contrasting subjects on simple backgrounds, supplemented by direct keep/remove brushes. A general-purpose portrait segmentation network trained from scratch would additionally need legally usable labeled data, substantial training compute, evaluation, and deployment work. It would be misleading to present this classical implementation as equivalent to remove.bg’s trained system.

## Primary research consulted

- [Bai and Sapiro, A Geodesic Framework for Fast Interactive Image and Video Segmentation and Matting](https://conservancy.umn.edu/bitstreams/25484eba-06c3-471d-ac9f-b6a3d3c0d2dd/download): seed-connected image paths and interactive corrections are relevant concepts. Toolioz does not reproduce its algorithm or implementation; our minimax path cost is different from an additive geodesic distance.
- [He, Sun, and Tang, Guided Image Filtering](https://people.csail.mit.edu/kaiming/eccv10/index.html): edge-aware filtering, feathering, and guided upsampling are useful design directions. Our reconstruction is a small joint color/spatial weighted neighborhood, **not** an implementation of their guided filter.
- [Zhang et al., Interactive Binary Image Segmentation with Edge Preservation](https://arxiv.org/abs/1809.03334): appearance overlap and edge preservation explain why a purely automatic color rule is not sufficient for all images. We do not use its MRF, superpixel method, software, or weights.

Research citations acknowledge conceptual context; they are not dependencies or bundled source code. No source implementation, model, SDK, or image asset was downloaded into the application. Independently written code is not a legal guarantee of patent clearance or ownership of general mathematical techniques.

## Actual algorithm

1. Decode JPEG/PNG/WebP with browser image decoding; cap input at 25 MB, 16 MP, and 8192 pixels per side. Make an analysis image with maximum side 720 pixels. Keep original decoded pixels for export.
2. Collect opaque image-boundary samples. Fit up to eight RGB representatives by deterministic farthest-color initialization and six centroid updates. If no opaque boundary samples exist, preserve the existing mask and suggest manual cleanup.
3. For each analysis pixel, compute the minimum weighted RGB distance to that palette:

   `d = sqrt(0.28 ΔR² + 0.52 ΔG² + 0.20 ΔB²) / 255`.

4. Perform a four-neighbor minimum-bottleneck search seeded from the image boundary and fully transparent pixels. The path cost is the maximum palette distance encountered along that path. A binary heap settles lowest-cost paths first. This connectivity barrier helps preserve background-colored regions enclosed inside a contrasting object.
5. Convert cost into opacity using `threshold = 0.025 + 0.003 × separation`, a transition half-band of 0.025, clamping to [0,1], and the smoothstep polynomial `t²(3−2t)`. Report a warning when retained coverage is below 1% or above 96%; this is a heuristic, not a learned confidence score.
6. Reconstruct source-size opacity using spatial distance and source/analysis RGB similarity weights in a small neighboring analysis window. Softness zero uses nearest-neighbor mask sampling. Larger softness widens the neighborhood. This does not recover detail already lost during downscaling.
7. Apply normalized keep/remove brush strokes as joined circular capsules. The last stroke wins in its covered area; fractional edge coverage antialiases brushes. Multiply the resulting mask by the source alpha. Preserve decoded RGB unchanged.
8. Encode a transparent, original-size PNG with browser Canvas. Preview backdrops never enter the export. Image processing/export run in a disposable Web Worker, with cancellation, stale-result guards, and a 60-second processing timeout. Working pixels are not stored persistently.

## Known failures

- Edge-touching foreground can enter the boundary palette and be erased. Manual Keep is required.
- Clutter, matching foreground/background colors, fine hair, semi-transparent objects, shadows, and noisy camera images can defeat automatic separation.
- Enclosed background holes can remain opaque; use Remove. An enclosed pale label may correctly remain opaque.
- No color decontamination: a background-colored fringe can survive around edges. Source RGB is deliberately preserved.
- Analysis resolution limits tiny features even though PNG dimensions are original-size. Export does not preserve camera metadata or guarantee original color profiles.
- Large images and long brush histories consume significant memory and can be slow on mobile devices. This is not a real-photo benchmarked AI service.

## Verification

Run `node scripts/test-background-removal.mjs` for 12 deterministic engine checks: simple/gradient/multicolor backgrounds, enclosed pale details, uniform-image warning, transparency preservation, continuous and ordered brush strokes, edge restoration, source-size reconstruction, RGB preservation, and invalid inputs.

The synthetic gradient/rectangle case measured IoU 1.0000. A 720×540 synthetic analysis took approximately 75–87 ms in the local Node test. These results are machine-specific and intentionally simple; they do **not** measure portrait or arbitrary-photo quality.

`npx tsc --noEmit` and the production static-export build passed. The new route is included in the design catalog and exported sitemap. Browser checks cover the generated sample, cleanup/undo, original/cutout views, and PNG export; final results are recorded after completing UI verification.
