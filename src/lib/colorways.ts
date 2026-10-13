/**
 * The three Comet concept colorways, one per source board in /design/source.
 *
 * `lateral` / `medial` describe where the shoe sits inside a board image so the
 * board artwork can be projected onto the 3D upper (see three/textures.ts).
 * Coordinates are pixels in the ORIGINAL board image:
 *   heelX / toeX   – back of the heel and tip of the toe along the upper
 *   baseY          – where the upper meets the midsole
 *   collarY        – top of the heel collar
 *   star           – centre and width of the star patch, so the 3D star lands on it
 * A photo whose toe points right is applied to the lateral side (viewed from +z),
 * one whose toe points left to the medial side, so lettering never reads mirrored.
 */
export type SideSource = {
  board: string;
  heelX: number;
  toeX: number;
  baseY: number;
  collarY: number;
  star: { x: number; y: number; w: number };
};

export type Decal = {
  img: string;
  side: "lateral" | "medial";
  /** u range along the shoe (0 heel → 1 toe) and height band above the sole in model units */
  u: [number, number];
  y: [number, number];
};

export type Colorway = {
  id: "local" | "postcard" | "harbour";
  name: string;
  hindi: string;
  board: string;
  tagline: string;
  story: string;
  colors: {
    canvas: string;
    star: string;
    heel: string;
    laces: string;
    lining: string;
    midsole: string;
    outsole: string;
    collar: string;
  };
  palette: { name: string; hex: string }[];
  lateral: SideSource;
  medial?: SideSource;
  decals: Decal[];
  heelText: string;
  renders: { src: string; label: string }[];
  /** colorway-specific artwork details; shared construction details are added by details.ts */
  details: string[];
};

export const COLORWAYS: Colorway[] = [
  {
    id: "local",
    name: "Platform Local",
    hindi: "लोकल",
    board: "/img/board-1.webp",
    tagline: "The everyday edition — cream canvas, indigo star, gum sole.",
    story:
      "Built around the 06:42 slow local: a red-and-yellow rake along the lateral quarter, a station sign above it, and on the inside, the things you meet on the platform — vada pav, a gully cricketer, the terminus itself.",
    colors: {
      canvas: "#ece2cf",
      star: "#1d2a4c",
      heel: "#1d2a4c",
      laces: "#6a3b22",
      lining: "#1d2a4c",
      midsole: "#ece4d3",
      outsole: "#7a4a29",
      collar: "#e6dbc6",
    },
    palette: [
      { name: "Platform cream", hex: "#ece2cf" },
      { name: "Signal indigo", hex: "#1d2a4c" },
      { name: "Rake red", hex: "#b3402d" },
      { name: "Chai brown", hex: "#6a3b22" },
      { name: "Gum", hex: "#7a4a29" },
    ],
    lateral: { board: "/source/1.webp", heelX: 75, toeX: 708, baseY: 400, collarY: 225, star: { x: 384, y: 348, w: 112 } },
    medial: { board: "/source/1.webp", heelX: 1405, toeX: 775, baseY: 405, collarY: 230, star: { x: 1105, y: 348, w: 118 } },
    decals: [],
    heelText: "MUMBAI",
    renders: [
      { src: "/img/local-lateral.webp", label: "Lateral" },
      { src: "/img/local-medial.webp", label: "Medial" },
      { src: "/img/local-top.webp", label: "Top" },
      { src: "/img/local-toe.webp", label: "Toe" },
      { src: "/img/local-heel.webp", label: "Heel" },
      { src: "/img/local-outsole.webp", label: "Outsole" },
    ],
    details: ["train", "sign", "vadapav", "cricket", "cst"],
  },
  {
    id: "postcard",
    name: "Postcard",
    hindi: "पोस्टकार्ड",
    board: "/img/board-2.webp",
    tagline: "The collector's edition — air-mail lettering, red Devanagari, natural laces.",
    story:
      "Composed like a picture postcard sent home: मुंबई लोकल in hand-painted red over the train, a cricket bat tucked under the star, and वड़ा पाव stamped near the toe. It ships in the poster box.",
    colors: {
      canvas: "#efe7d6",
      star: "#1f2b4d",
      heel: "#1f2b4d",
      laces: "#ebe2cf",
      lining: "#e9dfcb",
      midsole: "#efe8da",
      outsole: "#6e4527",
      collar: "#efe7d6",
    },
    palette: [
      { name: "Postcard white", hex: "#efe7d6" },
      { name: "Air-mail indigo", hex: "#1f2b4d" },
      { name: "Sign-paint red", hex: "#b8402c" },
      { name: "Saffron", hex: "#d18a2a" },
      { name: "Gum", hex: "#6e4527" },
    ],
    lateral: { board: "/source/2.webp", heelX: 100, toeX: 805, baseY: 510, collarY: 295, star: { x: 430, y: 422, w: 140 } },
    decals: [
      { img: "/img/postcard-d-insole.webp", side: "medial", u: [0.12, 0.44], y: [0.06, 0.5] },
      { img: "/img/postcard-d-vadapav.webp", side: "medial", u: [0.64, 0.86], y: [0.04, 0.3] },
    ],
    heelText: "MUMBAI",
    renders: [
      { src: "/img/postcard-shoe.webp", label: "Lateral" },
      { src: "/img/postcard-hero.webp", label: "Poster" },
      { src: "/img/postcard-stamp.webp", label: "Air-mail stamp" },
      { src: "/img/postcard-d-train.webp", label: "Side detail" },
      { src: "/img/postcard-d-tongue.webp", label: "Tongue label" },
      { src: "/img/postcard-d-sole.webp", label: "Sole detail" },
    ],
    details: ["train", "vadapav", "cricket", "tongue"],
  },
  {
    id: "harbour",
    name: "Harbour",
    hindi: "बंदर",
    board: "/img/board-3.webp",
    tagline: "The all-over edition — a full harbour panorama with a navy cupsole.",
    story:
      "One continuous etching wraps the upper: ferries off Apollo Bunder, the Gateway of India at the heel, the skyline rising behind. A Bombay cancellation mark sits on the toe like a franked stamp.",
    colors: {
      canvas: "#e9dcc2",
      star: "#1c2a50",
      heel: "#1c2a50",
      laces: "#1c2a50",
      lining: "#1c2a50",
      midsole: "#ece3d1",
      outsole: "#1c2a50",
      collar: "#e3d4b8",
    },
    palette: [
      { name: "Sandstone", hex: "#e9dcc2" },
      { name: "Harbour navy", hex: "#1c2a50" },
      { name: "Monsoon blue", hex: "#3b5f8f" },
      { name: "Basalt gold", hex: "#c79a52" },
      { name: "Postmark red", hex: "#a8442e" },
    ],
    lateral: { board: "/source/3.webp", heelX: 473, toeX: 902, baseY: 685, collarY: 560, star: { x: 690, y: 632, w: 104 } },
    medial: { board: "/source/3.webp", heelX: 1180, toeX: 215, baseY: 385, collarY: 145, star: { x: 752, y: 284, w: 178 } },
    decals: [],
    heelText: "MUMBAI",
    renders: [
      { src: "/img/harbour-lateral.webp", label: "Side" },
      { src: "/img/harbour-medial.webp", label: "Medial" },
      { src: "/img/harbour-top.webp", label: "Top" },
      { src: "/img/harbour-heel.webp", label: "Heel" },
      { src: "/img/harbour-stamp.webp", label: "Bombay stamp" },
      { src: "/img/harbour-d-toe.webp", label: "Toe postmark" },
    ],
    details: ["harbour", "gateway", "stamp", "tongue"],
  },
];

export const colorwayById = (id: Colorway["id"]) => COLORWAYS.find((c) => c.id === id)!;
