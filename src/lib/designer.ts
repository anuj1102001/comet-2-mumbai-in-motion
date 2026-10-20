/**
 * Who made this. Fill these in and the credit appears in the footer and on
 * the case study; while `name` is empty nothing is rendered, so the live site
 * never shows placeholder text.
 */
export const DESIGNER = {
  name: "Anuj",
  role: "Concept, art direction & design", // e.g. "Product & UX designer"
  location: "", // e.g. "Mumbai, India"
  bio: "", // one or two sentences, first person
  links: [{ label: "anujleo46@gmail.com", href: "mailto:anujleo46@gmail.com" }] as { label: string; href: string }[], // e.g. { label: "LinkedIn", href: "https://..." }
};

export const hasDesigner = DESIGNER.name.trim().length > 0;
