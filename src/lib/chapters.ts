/**
 * The sneaker story: one camera, nine compositions. Each chapter owns a camera
 * pose; scrolling through the second half of a chapter blends into the next
 * pose (see three/StoryScene.tsx). The shoe model sits centred at the origin.
 */
export type Pose = {
  cam: [number, number, number];
  target: [number, number, number];
  fov: number;
  /** shoe rotation [x, y, z] */
  rot: [number, number, number];
  /** 0..1 how much idle sway / turntable motion is allowed */
  sway: number;
  /** contact shadow opacity */
  shadow: number;
  /** horizontal framing: positive pushes the shoe right to make room for copy on the left */
  shift: number;
};

export type Chapter = {
  id: string;
  index: string;
  nav: string;
  title: string;
  hindi?: string;
  body: string;
  interaction: string;
  pose: Pose;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "reveal",
    index: "00",
    nav: "Reveal",
    title: "Mumbai never stands still.",
    hindi: "मुंबई कभी नहीं रुकती",
    body: "Every platform has a story. Every step leaves a mark.",
    interaction: "Scroll to explore the sneaker",
    pose: { cam: [0, 0.32, 6.6], target: [0, 0.14, 0], fov: 30, rot: [0, 0, 0], sway: 1, shadow: 0.55, shift: 0 },
  },
  {
    id: "silhouette",
    index: "01",
    nav: "Silhouette",
    title: "The silhouette",
    body:
      "A low-top court shape with a cupsole and a padded collar — deliberately familiar. The proportions stay classic so the city can be the expressive part: a shoe you wear on a Tuesday, not a souvenir you keep in a box.",
    interaction: "Drag the shoe to inspect the silhouette",
    pose: { cam: [3.6, 1.55, 4.1], target: [0, -0.05, 0], fov: 30, rot: [0, 0, 0], sway: 0.25, shadow: 0.55, shift: 0.22 },
  },
  {
    id: "postcard",
    index: "02",
    nav: "Postcard",
    title: "The Mumbai postcard",
    hindi: "पोस्टकार्ड",
    body:
      "Vintage Indian picture postcards framed one view per card, tinted by hand, with a printed border. Each quarter panel works the same way: one scene, one horizon line, a limited ink set — so the illustration reads as a composed view rather than a collage.",
    interaction: "Tap a marker to see what inspired it",
    pose: { cam: [-1.2, 0.35, 3.9], target: [-0.4, -0.08, 0.15], fov: 30, rot: [0, 0, 0], sway: 0.1, shadow: 0.5, shift: -0.22 },
  },
  {
    id: "cst",
    index: "03",
    nav: "CST",
    title: "Architectural identity",
    hindi: "सीएसटी",
    body:
      "Chhatrapati Shivaji Maharaj Terminus is the station where the Mumbai railway story begins. On a curved, flexing canvas panel the façade is reduced to an etching: dome, towers and arches in a single indigo line weight, ornament implied with hatching.",
    interaction: "Switch between the full illustration and its details",
    pose: { cam: [-1.25, 0.4, -3.9], target: [-0.45, -0.08, -0.15], fov: 30, rot: [0, 0, 0], sway: 0.1, shadow: 0.5, shift: 0.22 },
  },
  {
    id: "local",
    index: "04",
    nav: "Local culture",
    title: "Mumbai local culture",
    hindi: "लोकल",
    body:
      "Second-class tickets, platform boards, fast and slow indicators, the snack you grab between trains. These references are scaled down and placed where the eye lands second, so they reward a closer look without crowding the shoe.",
    interaction: "Activate a marker to transform a detail into its reference",
    pose: { cam: [1.8, 0.5, 3.9], target: [0.4, -0.1, 0.12], fov: 30, rot: [0, 0, 0], sway: 0.1, shadow: 0.5, shift: -0.22 },
  },
  {
    id: "type",
    index: "05",
    nav: "Typography",
    title: "Typography & street language",
    hindi: "अक्षर",
    body:
      "Two scripts, one hierarchy. Devanagari carries the voice — hand-painted, warm, in signal red — while Latin capitals carry the label in indigo. Every Hindi word is proofread: मुंबई, लोकल, वड़ा पाव, आमची मुंबई.",
    interaction: "Flatten the shoe into its graphic breakdown",
    pose: { cam: [-4.1, 1.1, 2.0], target: [-0.45, 0.0, 0], fov: 30, rot: [0, 0, 0], sway: 0.1, shadow: 0.5, shift: 0.22 },
  },
  {
    id: "details",
    index: "06",
    nav: "Hidden details",
    title: "The hidden details",
    body:
      "Some details work, some tell the story, a few do both. The heel tab locks the heel and names the city; the toe perforations vent a humid commute; lace colour names the edition.",
    interaction: "Tap a marker, then rotate to find the next one",
    pose: { cam: [2.3, 3.1, 2.6], target: [0.05, 0.05, 0], fov: 30, rot: [0, 0, 0], sway: 0.2, shadow: 0.5, shift: -0.22 },
  },
  {
    id: "sole",
    index: "07",
    nav: "Sole",
    title: "The sole",
    body:
      "A stitched-look cupsole in cream rubber over a herringbone outsole, with a star medallion at the forefoot pivot. Herringbone is chosen for multi-directional grip on wet platforms. These are design intentions — no performance testing has been done.",
    interaction: "Drag to turn the outsole",
    pose: { cam: [0.4, 0.4, 6.2], target: [0, 0, 0], fov: 30, rot: [-1.95, 0, 0.05], sway: 0.15, shadow: 0, shift: 0.16 },
  },
  {
    id: "final",
    index: "08",
    nav: "Composition",
    title: "Built from the city. Made to move.",
    hindi: "शहर से बना। चलने के लिए।",
    body: "Silhouette, postcard panels, the terminus, the lettering and the sole — one object, one city.",
    interaction: "Choose an edition below",
    pose: { cam: [3.3, 1.05, 4.6], target: [0, 0, 0], fov: 30, rot: [0, 0, 0], sway: 1, shadow: 0.6, shift: 0 },
  },
];
