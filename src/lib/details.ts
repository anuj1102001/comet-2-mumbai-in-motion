import type { Colorway } from "./colorways";

type CwId = Colorway["id"];

export type Detail = {
  id: string;
  title: string;
  hindi?: string;
  location: string;
  /** zone highlighted on the flat shoe diagram */
  zone: "lateral-rear" | "lateral-mid" | "lateral-front" | "medial-rear" | "medial-mid" | "medial-front" | "heel" | "tongue" | "laces" | "toe" | "outsole" | "star";
  inspiration: string;
  decision: string;
  contribution: string;
  kind: "Decorative" | "Functional" | "Conceptual" | "Functional + conceptual";
  images: Partial<Record<CwId, string>> & { default?: string };
  swatches?: string[];
};

export const DETAILS: Record<string, Detail> = {
  typography: {
    id: "typography",
    title: "Hindi–English Lettering",
    hindi: "मुंबई लोकल",
    location: "Lateral quarter, over the train",
    zone: "lateral-rear",
    inspiration:
      "Hand-painted stall boards and enamel station signs, where the city's name is stacked in Devanagari over Latin capitals.",
    decision:
      "Devanagari carries the voice — hand-painted, warm, in signal red — and Latin capitals carry the label in navy. Lettering is kept to proofread words only: मुंबई, लोकल, वड़ा पाव, आमची मुंबई.",
    contribution: "Bilingual identity that reads as street language, not decoration.",
    kind: "Conceptual",
    images: { default: "/img/postcard-d-train.webp" },
    swatches: ["#b8402c", "#1f2b4d", "#efe7d6"],
  },
  train: {
    id: "train",
    title: "The Mumbai Local",
    hindi: "मुंबई लोकल",
    location: "Lateral quarter, behind the star",
    zone: "lateral-rear",
    inspiration:
      "The suburban EMU rake — red and yellow livery, open doors, commuters riding the footboard. India's first passenger train left Bori Bunder, where the terminus now stands, for Thane in April 1853.",
    decision:
      "The train runs heel-to-toe along the quarter so it reads as motion when the wearer walks. It stops short of the star and keeps below the eyestay, leaving the lacing zone clean.",
    contribution: "The literal engine of the concept: movement, the commute, the city's daily rhythm.",
    kind: "Conceptual",
    images: { local: "/img/local-d-train.webp", postcard: "/img/postcard-d-train.webp", default: "/img/local-d-train.webp" },
    swatches: ["#b3402d", "#e0b33b", "#1d2a4c"],
  },
  sign: {
    id: "sign",
    title: "Station Signage",
    hindi: "मुंबई",
    location: "Lateral quarter, above the train",
    zone: "lateral-mid",
    inspiration:
      "Enamel platform boards: the city's name stacked in Devanagari over Latin capitals, framed in a thin rule — the first thing you read when a train pulls in.",
    decision:
      "Kept small and boxed like a real board, so the lettering sits as an object in the scene rather than a slogan. The concept board's Devanagari is corrected here: the sign tile reads मुबई, missing the anusvara — production artwork must read मुंबई.",
    contribution: "Bilingual identity at a glance; the typographic voice of the street.",
    kind: "Conceptual",
    images: { default: "/img/local-d-sign.webp" },
    swatches: ["#ece2cf", "#1d2a4c"],
  },
  vadapav: {
    id: "vadapav",
    title: "Vada Pav",
    hindi: "वड़ा पाव",
    location: "Near the toe",
    zone: "medial-front",
    inspiration:
      "The city's fast food: a spiced potato fritter in a pav, eaten standing up between trains. It is popularly traced to stalls around Dadar station in the 1960s.",
    decision:
      "The one full-colour illustration on the shoe, placed low near the toe where it is discovered rather than announced. Its red Devanagari label borrows the hand-painted lettering of food stalls.",
    contribution: "Humour and warmth — the everyday Mumbai that a souvenir would leave out.",
    kind: "Decorative",
    images: { local: "/img/local-d-vadapav.webp", postcard: "/img/postcard-d-vadapav.webp", default: "/img/local-d-vadapav.webp" },
    swatches: ["#c4682e", "#b3402d", "#e6c27a"],
  },
  cricket: {
    id: "cricket",
    title: "Gully Cricket",
    hindi: "आमची मुंबई",
    location: "Medial quarter",
    zone: "medial-mid",
    inspiration:
      "Tennis-ball cricket on maidans, in lanes and on rooftops — Shivaji Park on a Sunday morning. आमची मुंबई is Marathi for “our Mumbai”.",
    decision:
      "Drawn as a single indigo figure in mid-swing, the most dynamic pose on the shoe, set on the medial side where the wearer sees it when they look down.",
    contribution: "Play and ambition: the energy of the city off the platform.",
    kind: "Decorative",
    images: { local: "/img/local-d-cricket.webp", postcard: "/img/postcard-d-insole.webp", default: "/img/local-d-cricket.webp" },
    swatches: ["#1d2a4c", "#b3402d"],
  },
  cst: {
    id: "cst",
    title: "Chhatrapati Shivaji Maharaj Terminus",
    hindi: "छत्रपती शिवाजी महाराज टर्मिनस",
    location: "Medial heel quarter",
    zone: "medial-rear",
    inspiration:
      "F. W. Stevens' terminus, completed in 1888 and a UNESCO World Heritage Site since 2004 — Victorian Gothic Revival fused with Indian craft traditions: the central dome, pointed arches, turrets and carved stone.",
    decision:
      "Reduced to an etching: one weight of indigo line, the dome and two flanking towers kept, ornament suggested by hatching. At sneaker scale the façade has to read from a metre away, so the silhouette leads and the detail rewards a closer look.",
    contribution: "Architectural identity — the place where the railway, and this story, begins.",
    kind: "Conceptual",
    images: { default: "/img/local-d-cst.webp" },
    swatches: ["#24365f", "#ece2cf"],
  },
  harbour: {
    id: "harbour",
    title: "Harbour Panorama",
    hindi: "हार्बर",
    location: "All-over, both quarters",
    zone: "lateral-rear",
    inspiration:
      "Ferries and launches off Apollo Bunder, the skyline stacked behind them, rendered like a hand-tinted postcard view of the harbour.",
    decision:
      "The only all-over print in the collection. The horizon line sits at a constant height around the shoe so the panorama reads continuously, and the navy cupsole acts as the sea.",
    contribution: "Scale and breadth: the whole city in one continuous view.",
    kind: "Conceptual",
    images: { default: "/img/harbour-d-side.webp" },
    swatches: ["#1c2a50", "#3b5f8f", "#c79a52"],
  },
  gateway: {
    id: "gateway",
    title: "Gateway of India",
    location: "Heel quarter",
    zone: "medial-rear",
    inspiration: "The basalt arch at Apollo Bunder, completed in 1924 — the city's front door from the sea.",
    decision:
      "Placed at the heel so the panorama 'arrives' at the Gateway as the eye travels backwards. Tinted in basalt gold, the warmest tone in an otherwise blue print.",
    contribution: "A landmark anchor that echoes CST's role in the other two colorways.",
    kind: "Conceptual",
    images: { default: "/img/harbour-stamp.webp" },
    swatches: ["#c79a52", "#1c2a50"],
  },
  stamp: {
    id: "stamp",
    title: "Bombay Postmark",
    location: "Toe and quarter",
    zone: "toe",
    inspiration: "Circular post-office cancellation marks and air-mail ephemera: date, city, state.",
    decision:
      "Applied as if the shoe had been posted. The red ring is the only warm accent on the harbour colourway, so it is used once on each side and nowhere else.",
    contribution: "Postcard nostalgia, and a date stamp that makes each pair feel sent.",
    kind: "Decorative",
    images: { default: "/img/harbour-d-toe.webp" },
    swatches: ["#a8442e", "#e9dcc2"],
  },
  tongue: {
    id: "tongue",
    title: "Tongue Label",
    location: "Tongue, top",
    zone: "tongue",
    inspiration: "Woven garment labels and the CST façade drawn on railway timetables.",
    decision: "A woven indigo label, COMET over a small terminus drawing. It is the one place the brand name appears on the upper.",
    contribution: "Brand signature that stays secondary to the city.",
    kind: "Functional + conceptual",
    images: { postcard: "/img/postcard-d-tongue.webp", harbour: "/img/harbour-d-tongue.webp", default: "/img/postcard-d-tongue.webp" },
    swatches: ["#1f2b4d", "#efe7d6"],
  },
  star: {
    id: "star",
    title: "The Comet Star",
    location: "Both quarters",
    zone: "star",
    inspiration: "A four-point star — part compass rose, part the shine on a railway signal lamp.",
    decision:
      "Raised, padded suede in deep indigo. It is placed over the artwork, not around it, so it reads as the constant across all three colourways while the city changes behind it.",
    contribution: "Brand mark and structural overlay: reinforces the quarter panel.",
    kind: "Functional + conceptual",
    images: { local: "/img/local-lateral.webp", postcard: "/img/postcard-shoe.webp", harbour: "/img/harbour-d-side.webp" },
    swatches: ["#1d2a4c"],
  },
  heel: {
    id: "heel",
    title: "Heel Tab",
    hindi: "मुंबई",
    location: "Heel counter",
    zone: "heel",
    inspiration: "Embroidered city patches and the indigo enamel of old platform boards.",
    decision: "An indigo suede heel counter with MUMBAI embroidered in cream under a small star. It stiffens the heel and is the shoe's name tag from behind.",
    contribution: "Locks the heel; the first thing a crowd behind you reads.",
    kind: "Functional + conceptual",
    images: { local: "/img/local-d-heel.webp", postcard: "/img/postcard-d-heel.webp", harbour: "/img/harbour-d-heel.webp" },
    swatches: ["#1d2a4c", "#ece2cc"],
  },
  laces: {
    id: "laces",
    title: "Laces & Eyestay",
    location: "Throat",
    zone: "laces",
    inspiration: "Flat cotton laces, like a railway porter's cord.",
    decision: "Six eyelets, straight-bar lacing so the throat stays tidy. Lace colour is the main differentiator between editions: chai brown, natural, navy.",
    contribution: "Fit and adjustability; a colour cue that names the edition at a glance.",
    kind: "Functional",
    images: { local: "/img/local-top.webp", postcard: "/img/postcard-shoe.webp", harbour: "/img/harbour-top.webp" },
  },
  perforations: {
    id: "perforations",
    title: "Toe Perforations",
    location: "Toe box",
    zone: "toe",
    inspiration: "Classic court-shoe venting, spaced like the rivets on a carriage panel.",
    decision: "A staggered grid confined to the toe box, so the artwork on the quarters is never interrupted.",
    contribution: "Breathability during a humid commute.",
    kind: "Functional",
    images: { local: "/img/local-toe.webp", postcard: "/img/postcard-d-vadapav.webp", harbour: "/img/harbour-d-toe.webp" },
  },
  outsole: {
    id: "outsole",
    title: "Outsole",
    location: "Underfoot",
    zone: "outsole",
    inspiration: "Herringbone traction and the ribbed rubber of station stair-treads, with a star medallion at the pivot point.",
    decision:
      "A cupsole: a cream rubber sidewall over a gum (or navy) herringbone outsole. Herringbone is chosen for multi-directional grip on wet platforms. These are design intentions, not tested performance claims.",
    contribution: "Grounds the concept; the medallion signs the shoe from below.",
    kind: "Functional",
    images: { local: "/img/local-outsole.webp", postcard: "/img/postcard-d-sole.webp", harbour: "/img/harbour-heel.webp" },
    swatches: ["#7a4a29", "#ece4d3"],
  },
};

export function detailsFor(cw: Colorway) {
  return cw.details.map((id) => DETAILS[id]).filter(Boolean);
}

export function imageFor(d: Detail, cw: CwId) {
  return d.images[cw] ?? d.images.default ?? Object.values(d.images)[0]!;
}
