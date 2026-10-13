import type { Detail } from "./details";

/** Design-breakdown entries for the collectible box (shown in the same detail view). */
const base = { chapter: 0, zone: "outsole" as const, anchors: {} };

export const BOX_DETAILS: Record<string, Detail> = {
  cover: {
    ...base,
    id: "cover",
    title: "The Cover Poster",
    hindi: "मुंबई",
    location: "Box lid",
    inspiration: "Indian travel and cinema posters of the mid-century: a single hero image, a rising sun, the city name set huge in two scripts.",
    decision:
      "The sneaker is the subject, cropped large and breaking the frame, with the terminus etched behind it and a red sun as the only flat shape. Devanagari sits above the Latin wordmark so the Hindi name leads.",
    contribution: "Turns the box into a poster worth keeping on a shelf.",
    kind: "Conceptual",
    images: { default: "/img/box-closed.webp" },
    swatches: ["#b3402d", "#24365f", "#eee5d3"],
  },
  side: {
    ...base,
    id: "side",
    title: "Side Panels",
    location: "Long sides of the box",
    inspiration: "Railway timetables and the skyline seen from a moving train.",
    decision:
      "One side carries the train-and-skyline frieze with SAME CITY. DIFFERENT STORIES.; the end panel carries the product information block — edition, size, coordinates — set like a ticket.",
    contribution: "Readable on a stockroom shelf, still part of the story.",
    kind: "Functional + conceptual",
    images: { default: "/img/box-closed.webp" },
    swatches: ["#24365f", "#e9dcc2"],
  },
  tissue: {
    ...base,
    id: "tissue",
    title: "Toile Tissue",
    location: "Inside, wrapping the shoes",
    inspiration: "Indigo toile-de-Jouy, redrawn with Mumbai scenes instead of pastoral ones: trains, palms, the Gateway, the sea.",
    decision: "Printed in one indigo ink on thin tissue, closed with a round star seal — the first thing you see when the lid comes off.",
    contribution: "A slow, tactile unboxing moment.",
    kind: "Decorative",
    images: { default: "/img/box-open.webp" },
    swatches: ["#24365f", "#efe7d6"],
  },
  insert: {
    ...base,
    id: "insert",
    title: "Postcard & Hang Tag",
    location: "Under the lid",
    inspiration: "A picture postcard you could actually post, and a second-class ticket stub.",
    decision: "The postcard repeats the cover art with a blank back; the hang tag carries the coordinates 19.0760° N, 72.8777° E and a list of the shoe's references in Devanagari.",
    contribution: "A collectible that leaves the box and keeps the story going.",
    kind: "Conceptual",
    images: { default: "/img/box-inserts.webp" },
    swatches: ["#b3402d", "#e9dcc2", "#1c2a50"],
  },
  bag: {
    ...base,
    id: "bag",
    title: "Dust Bag",
    location: "Inside the box",
    inspiration: "Indigo-dyed cotton and the Comet star.",
    decision: "Plain navy cotton with a single cream star print — the quietest object in the set, so the shoes and poster stay loud.",
    contribution: "Protects the canvas upper between wears.",
    kind: "Functional",
    images: { default: "/img/box-inserts.webp" },
    swatches: ["#1b2643", "#ece2cc"],
  },
};
