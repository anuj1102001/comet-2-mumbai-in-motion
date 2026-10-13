/**
 * The three editions of the COMET 2.0 "Mumbai in Motion" collection, one per
 * approved design board in /design/source. Every image listed here is a crop
 * of that board (see scripts/crop.mjs) — the boards are the source of truth.
 */
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
  /** Ordered product views for the silhouette sequence. */
  views: { src: string; label: string; note: string }[];
  /** Hero render used for edition cards. */
  hero: string;
  /**
   * Studio photographs made from this edition's board renders (design/photo):
   * the cutout is unchanged; set, light, shadows and grade are photographic.
   */
  studio: { src: string; label: string; note: string; tone: "light" | "dark" }[];
  details: string[];
};

export const COLORWAYS: Colorway[] = [
  {
    id: "local",
    name: "Platform Local",
    hindi: "लोकल",
    board: "/img/board-1.webp",
    tagline: "The everyday edition: cream canvas, navy star, chai-brown laces, gum sole.",
    story:
      "Built around the morning slow local: a red-and-yellow rake along the lateral quarter with a station sign above it, and on the inside the things you meet on the platform — vada pav, a gully cricketer, the terminus itself.",
    colors: { canvas: "#ece2cf", star: "#1d2a4c", heel: "#1d2a4c", laces: "#6a3b22", lining: "#1d2a4c", midsole: "#ece4d3", outsole: "#7a4a29", collar: "#e6dbc6" },
    palette: [
      { name: "Platform cream", hex: "#ece2cf" },
      { name: "Signal navy", hex: "#1d2a4c" },
      { name: "Terracotta", hex: "#b3533a" },
      { name: "Chai brown", hex: "#6a3b22" },
      { name: "Gum", hex: "#7a4a29" },
    ],
    hero: "/img/local-lateral.webp",
    studio: [
      { src: "/img/photo/01-local-lateral-hero.webp", label: "Studio · lateral", note: "The everyday edition on a cream paper sweep.", tone: "light" },
      { src: "/img/photo/02-local-medial.webp", label: "Studio · medial", note: "Vada pav, the cricketer and the terminus on the inside.", tone: "light" },
    ],
    views: [
      { src: "/img/local-lateral.webp", label: "Lateral", note: "The train, the station sign and the star — the side the city sees." },
      { src: "/img/local-medial.webp", label: "Medial", note: "Vada pav, the cricketer and the terminus — the side you see." },
      { src: "/img/local-top.webp", label: "Top", note: "Clean vamp, six eyelets, a CST etching on the footbed." },
      { src: "/img/local-toe.webp", label: "Toe", note: "Perforated toe box with a small terminus vignette." },
      { src: "/img/local-heel.webp", label: "Heel", note: "Navy suede counter, MUMBAI embroidered under the star." },
      { src: "/img/local-outsole.webp", label: "Outsole", note: "Gum herringbone with a star medallion at the pivot." },
    ],
    details: ["train", "cst", "sign", "vadapav", "cricket", "heel", "star", "outsole"],
  },
  {
    id: "postcard",
    name: "Postcard",
    hindi: "पोस्टकार्ड",
    board: "/img/board-2.webp",
    tagline: "The collector's edition: air-mail lettering, red Devanagari, natural laces.",
    story:
      "Composed like a picture postcard sent home: मुंबई लोकल in hand-painted red over the train, a cricket bat beside the star and वड़ा पाव near the toe. It ships in the poster box.",
    colors: { canvas: "#efe7d6", star: "#1f2b4d", heel: "#1f2b4d", laces: "#ebe2cf", lining: "#e9dfcb", midsole: "#efe8da", outsole: "#6e4527", collar: "#efe7d6" },
    palette: [
      { name: "Postcard white", hex: "#efe7d6" },
      { name: "Air-mail navy", hex: "#1f2b4d" },
      { name: "Sign-paint red", hex: "#b8402c" },
      { name: "Saffron", hex: "#d18a2a" },
      { name: "Gum", hex: "#6e4527" },
    ],
    hero: "/img/postcard-shoe.webp",
    studio: [{ src: "/img/photo/03-postcard-lateral.webp", label: "Studio · lateral", note: "Air-mail lettering and natural laces on a cream sweep.", tone: "light" }],
    views: [
      { src: "/img/postcard-shoe.webp", label: "Lateral", note: "मुंबई लोकल over the rake, the bat, वड़ा पाव at the toe." },
      { src: "/img/postcard-d-heel.webp", label: "Heel", note: "Embroidered MUMBAI between two stars." },
      { src: "/img/postcard-d-tongue.webp", label: "Tongue", note: "Woven COMET label with the terminus beneath." },
      { src: "/img/postcard-d-insole.webp", label: "Insole", note: "आमची मुंबई — 'our Mumbai' — under the heel." },
      { src: "/img/postcard-d-sole.webp", label: "Outsole", note: "Gum herringbone and the star medallion." },
    ],
    details: ["train", "typography", "vadapav", "cricket", "tongue", "heel", "star", "outsole"],
  },
  {
    id: "harbour",
    name: "Harbour",
    hindi: "बंदर",
    board: "/img/board-3.webp",
    tagline: "The all-over edition: one harbour panorama, navy laces, navy cupsole.",
    story:
      "One continuous etching wraps the upper: ferries off Apollo Bunder, the skyline behind them and the Gateway of India at the heel. A Bombay postmark sits on the toe like a franked stamp.",
    colors: { canvas: "#e9dcc2", star: "#1c2a50", heel: "#1c2a50", laces: "#1c2a50", lining: "#1c2a50", midsole: "#ece3d1", outsole: "#1c2a50", collar: "#e3d4b8" },
    palette: [
      { name: "Sandstone", hex: "#e9dcc2" },
      { name: "Harbour navy", hex: "#1c2a50" },
      { name: "Monsoon blue", hex: "#3b5f8f" },
      { name: "Basalt gold", hex: "#c79a52" },
      { name: "Postmark red", hex: "#a8442e" },
    ],
    hero: "/img/harbour-lateral.webp",
    studio: [{ src: "/img/photo/04-harbour-closeup.webp", label: "Studio · close-up", note: "The harbour panorama on a deep navy set.", tone: "dark" }],
    views: [
      { src: "/img/harbour-lateral.webp", label: "Lateral", note: "Ferries, skyline and the Gateway in one continuous view." },
      { src: "/img/harbour-medial.webp", label: "Medial", note: "The panorama continues around the inside." },
      { src: "/img/harbour-top.webp", label: "Top", note: "The pair from above: the print carries over the vamp." },
      { src: "/img/harbour-heel.webp", label: "Heel", note: "MUMBAI and मुंबई on the heel, a lighthouse on the tab." },
    ],
    details: ["harbour", "gateway", "stamp", "tongue", "heel", "star"],
  },
];

export const colorwayById = (id: Colorway["id"]) => COLORWAYS.find((c) => c.id === id)!;
