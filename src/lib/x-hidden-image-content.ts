export const xHiddenImageKeywords = [
  'X tap to reveal PNG',
  'X tap to reveal image maker',
  'Twitter hidden image maker',
  'Twitter tap and hold image',
  'X tap and hold image trend',
  'how to make tap to reveal images on X',
  'how to make hidden image on Twitter',
  'X timeline reveal trend 2026',
  'viral X image trick transparency',
  'X feed vs opened image PNG',
  'checkerboard PNG Twitter upload',
  'dual view PNG X post',
  'PNG8 X upload',
  'hidden picture X feed',
  'open image full color X',
  'Twitter tap to open image',
  'x.com hidden picture generator',
  'free tap to reveal image maker',
  'X PNG transparency hack',
  'Twitter engagement image PNG',
  'client-side PNG encoder',
  'Toolioz',
];

export const xRevealFaqs = [
  {
    question: 'What is the X tap-to-reveal or tap-and-hold image trend?',
    answer:
      'Creators post a single PNG that looks washed out or partially hidden in the X timeline, then shows the full artwork when someone opens the post or uses tap-and-hold on mobile. The effect comes from how X composites transparency in the feed versus the full-screen viewer. It is not a special X setting.',
  },
  {
    question: 'How do I make a hidden image PNG for X (Twitter)?',
    answer:
      'Upload your art to a tap-to-reveal encoder, paint where the feed should stay visible if you want partial previews, tune line art or open brightness, then export PNG8. Post the file as a normal image on X from desktop web (x.com) for the most reliable upload path.',
  },
  {
    question: 'Why does my picture look dull in the feed but normal when opened?',
    answer:
      'X blends alternating transparent pixels in timeline previews. This encoder writes those regions so the feed shows a muted version while the opened view uses the full-color pixels.',
  },
  {
    question: 'Should I export PNG8 or RGBA for X?',
    answer:
      'PNG8 is tuned for posting on X (indexed color, smaller file). RGBA is useful if you want a lossless master or to edit elsewhere; re-export PNG8 before posting if X rejects large RGBA files.',
  },
  {
    question: 'Are my images uploaded to Toolioz?',
    answer:
      'No. Encoding, masking, and export run in this tab. Image bytes are not uploaded to Toolioz. The website still loads scripts and analytics. You upload to X yourself if you post.',
  },
  {
    question: 'Is this the same as four-tile "tap each corner" split posts?',
    answer:
      'No. Split-tile posts use multiple images in one tweet. Tap-to-reveal uses one PNG with a transparency pattern for feed versus opened. This tool builds that single file.',
  },
  {
    question: 'Why post from desktop X instead of the mobile app?',
    answer:
      'Mobile apps often re-encode uploads to JPEG, which destroys the transparency pattern the trend relies on. Uploading PNG from desktop x.com keeps the hidden feed effect intact.',
  },
  {
    question: 'What image size works best for X tap-to-reveal posts?',
    answer:
      'Square and 4:5 presets match common timeline crops. Keep important detail away from extreme edges, preview both light and dark timeline backgrounds in the tool, and export PNG8 before posting.',
  },
  {
    question: 'Can brands use tap-to-reveal PNGs for marketing on X?',
    answer:
      'Yes. Teasers, before and after reveals, and puzzle-style art hide detail in the timeline until viewers tap. Use the brush mask to show a logo or headline in-feed while hiding the rest until open.',
  },
];

export const xRevealHowToSteps = [
  {
    name: 'Upload your artwork',
    text: 'Add a JPEG, PNG, or WebP file and pick a square or 4:5 canvas preset that matches how you post on X.',
  },
  {
    name: 'Paint the timeline mask',
    text: 'By default the whole image is hidden in the feed. Paint blue regions where the timeline should show detail before tap; use eraser to refine.',
  },
  {
    name: 'Preview feed vs opened',
    text: 'Compare the in-feed mock (light or dark timeline) with the opened view. Optional line art and open brightness tune how dramatic the reveal feels.',
  },
  {
    name: 'Export PNG8 and post on x.com',
    text: 'Download PNG8 and attach it as a normal image post from desktop web. Avoid mobile re-encoding so transparency survives.',
  },
];

export const xRevealSeoSection = {
  title: 'the X Tap-to-Reveal PNG Maker',
  description:
    'The X and Twitter tap-to-reveal trend uses one PNG that looks muted in the timeline, then shows full color when viewers open the post or long-press on mobile. This page encodes that feed-versus-opened transparency pattern in the browser, with brush masks, live feed previews, and PNG8 export for x.com uploads.',
  howToUse: [
    'Upload art and choose a canvas preset (square or 4:5 work well for timeline crops).',
    'Paint blue on areas that should stay visible in the feed; leave the rest hidden until tap or open.',
    'Use optional line art on the feed preview and brightness boost after open for stronger reveals.',
    'Check light and dark timeline mocks, then download PNG8 (recommended for X).',
    'Post the PNG from desktop x.com, not the mobile app, so JPEG re-encoding does not break the effect.',
  ],
  benefits: [
    'Build a tap-to-reveal PNG without Photoshop or command-line encoders.',
    'Live in-feed and opened previews so you see the reveal before posting.',
    'Brush-based timeline masks with undo. You do not have to paint checkerboard pixels by hand.',
    'Encoding runs in this tab. Art is not uploaded to Toolioz. Page scripts and analytics still load.',
    'PNG8 export sized for X posts, with RGBA available for editing masters.',
  ],
};
