import { Archivo, DM_Serif_Display, IBM_Plex_Mono, Tiro_Devanagari_Hindi, Yatra_One } from "next/font/google";

/** Editorial display serif — chapter titles, the big MUMBAI wordmark. */
export const display = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });

/** Contemporary grotesk with a width axis — UI, body copy, poster captions. */
export const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });

/** Ticket stubs, coordinates, spec tables. */
export const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

/** Expressive hand-painted Devanagari — signage voice. */
export const yatra = Yatra_One({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-yatra", display: "swap" });

/** Bookish Devanagari serif — readable Hindi body text. */
export const tiro = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-tiro", display: "swap" });

export const fontVars = [display, sans, mono, yatra, tiro].map((f) => f.variable).join(" ");
