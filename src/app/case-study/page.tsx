import type { Metadata } from "next";
import { CST_DETAIL, CST_PATH } from "@/components/art/cst";
import { SneakerSVG } from "@/components/art/SneakerSVG";
import { Footer, Nav } from "@/components/Nav";
import { Reveal } from "@/components/ui";
import { CometLogo } from "@/components/brand/Logo";
import { OriginButton } from "@/components/OriginButton";
import { ReelPlayer } from "@/components/ReelPlayer";
import { DesignerCredit } from "@/components/DesignerCredit";
import { CHAPTERS } from "@/lib/chapters";
import { COLORWAYS } from "@/lib/colorways";

export const metadata: Metadata = {
  title: "Case study — COMET 2.0: Mumbai in Motion",
  description: "How an original sneaker concept, its packaging and a cinematic product story were designed from Mumbai's railway and street culture — and why version 2.0 dropped real-time 3D.",
};

const PRINCIPLES = [
  ["Wearable first", "The silhouette stays a classic low-top court shoe. If the graphics were removed, it should still be a shoe someone wants."],
  ["One scene per panel", "Each quarter carries one composed view with one horizon line, like a picture postcard — never a collage of icons."],
  ["Two scripts, one hierarchy", "Devanagari is the voice (red, hand-painted); Latin capitals are the label (indigo, enamel-board). Every Hindi word is proofread."],
  ["Discover, don't announce", "The loudest references sit where the eye lands first; the small ones (vada pav, the postmark) reward a second look."],
  ["Honest prototype", "Concept renders are labelled as renders. Placeholder footage is labelled as placeholder. Nothing claims to be manufactured, tested or for sale."],
];

const RESEARCH = [
  ["The suburban railway", "The local train as the city's circulation: red-and-yellow rakes, footboard commuters, platform indicators showing fast/slow and 12/15-car trains. India's first passenger train left Bori Bunder for Thane in 1853."],
  ["CST, the terminus", "Chhatrapati Shivaji Maharaj Terminus (F. W. Stevens, 1888; UNESCO World Heritage Site, 2004): Victorian Gothic Revival with Indian craft detail — the dome, the turrets, the arcades."],
  ["Picture postcards & ephemera", "Hand-tinted postcards, air-mail labels, cancellation marks and second-class tickets — framing, borders and limited ink sets."],
  ["Street lettering", "Enamel station boards and hand-painted stall signs: stacked bilingual names, heavy Devanagari strokes, red on cream."],
  ["Everyday culture", "Vada pav between trains; tennis-ball cricket on the maidans; आमची मुंबई — 'our Mumbai' in Marathi."],
];

const MOTION = [
  ["Reveal", "900 ms", "cubic-bezier(.22, 1, .36, 1)", "Editorial text and cards entering the viewport"],
  ["Sequence step", "700 ms", "cubic-bezier(.22, 1, .36, 1)", "Product views, details and box stages advancing with scroll"],
  ["Camera push", "1.6 screens of scroll", "quadratic ease-in", "Opening: city → shoe, transform-only"],
  ["Flip / morph", "750 ms", "cubic-bezier(.65, 0, .35, 1)", "Product detail ↔ reference card; flat breakdown wipe"],
  ["Box opening", "lid → tissue → shoe", "critically damped, staged", "Packaging sequence, each stage waits for the previous one"],
  ["Hotspot", "350 ms", "cubic-bezier(.22, 1, .36, 1)", "Markers fade/scale as they turn toward the camera"],
];

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-14 lg:grid-cols-[16rem_1fr] lg:gap-12 lg:py-20">
      <Reveal>
        <p className="font-mono text-xs text-red">{n}</p>
        <h2 className="h-display mt-3 text-3xl text-ink sm:text-4xl">{title}</h2>
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  );
}

export default function CaseStudy() {
  return (
    <>
      <Nav home={false} />
      <main className="mx-auto max-w-[1200px] px-4 pb-10 pt-28 sm:px-8">
        <header className="pb-14">
          <p className="eyebrow text-ink-3">Design case study · concept</p>
          <h1 className="h-display mt-5 text-[clamp(3rem,8vw,7rem)] text-ink">
            <CometLogo size="xl" className="text-ink" />
            <span className="mt-4 block italic text-indigo">Mumbai in Motion</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            An original sneaker, its packaging and a cinematic product story, built from Mumbai&apos;s local trains, the CST terminus, vintage postcards and street lettering. This page explains the thinking behind it.
          </p>
          <DesignerCredit variant="case" />
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm sm:grid-cols-4">
            {[
              ["Type", "Concept · portfolio"],
              ["Scope", "Product, packaging, digital experience"],
              ["Role", "Concept & creative direction, AI-assisted"],
              ["Tools", "AI image model, Claude, Adobe Photoshop & Lightroom, Next.js"],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper p-4">
                <dt className="eyebrow text-[10px] text-ink-3">{k}</dt>
                <dd className="mt-1 font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl border border-red/30 bg-red/5 px-4 py-3 text-sm text-ink-2">
            <b className="text-red">Concept, not product.</b> COMET 2.0 is a fictional label. No pair has been manufactured, tested or sold, and no user research or usability testing was carried out for this concept.
          </p>
          <section aria-labelledby="glance" className="mt-10 rounded-2xl bg-ink p-6 text-paper sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="glance" className="eyebrow text-paper/60">At a glance · 30-second read</h2>
              <span className="font-mono text-xs text-paper/40">Concept · 2026</span>
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.4fr_1fr]">
              <div>
                <p className="eyebrow text-[10px] text-saffron">The challenge</p>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/85">
                  Turn a city into a sneaker without making a souvenir: culture on a curved, flexing canvas, in two scripts, with a website that tells the story without trapping the visitor.
                </p>
              </div>
              <div>
                <p className="eyebrow text-[10px] text-saffron">Three decisions that shaped it</p>
                <ol className="mt-2 space-y-3 text-[15px] leading-relaxed text-paper/85">
                  <li>
                    <b className="text-paper">One scene per panel.</b> Each quarter is composed like a picture postcard, never a collage of landmarks, so the shoe stays wearable.
                  </li>
                  <li>
                    <b className="text-paper">Devanagari leads, Latin labels.</b> Red hand-painted Hindi is the voice, navy capitals the label, and every word is proofread.
                  </li>
                  <li>
                    <b className="text-paper">Honest presentation over flashy 3D.</b> The first build&apos;s real-time 3D shoe looked worse than the boards, so v2 replaced it with the approved renders and studio composites, clearly labelled.
                  </li>
                </ol>
              </div>
              <div>
                <p className="eyebrow text-[10px] text-saffron">What it became</p>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-paper/85">
                  <li>3 editions, 1 silhouette</li>
                  <li>Collectible poster box and inserts</li>
                  <li>COMET 2.0 identity</li>
                  <li>8-chapter scroll story, live</li>
                  <li>Studio photo set and 20 s launch reel</li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <OriginButton href="/" tone="dark" size="sm">
                    Open the experience <span aria-hidden>→</span>
                  </OriginButton>
                </div>
              </div>
            </div>
          </section>
          <figure className="mt-10">
            <ReelPlayer tone="dark" allowTall={false} />
            <figcaption className="mt-3 text-xs text-ink-3">The launch reel: 20 seconds, cut in 16:9 and 9:16 from the studio photographs, rendered frame by frame from an HTML timeline.</figcaption>
          </figure>
        </header>

        <section aria-labelledby="my-role" className="grid gap-6 border-t border-line py-14 lg:grid-cols-[16rem_1fr] lg:gap-12 lg:py-20">
          <div>
            <p className="font-mono text-xs text-red">00</p>
            <h2 id="my-role" className="h-display mt-3 text-3xl text-ink sm:text-4xl">
              My role
            </h2>
          </div>
          <div>
            <p className="text-[17px] leading-relaxed text-ink">
              I&apos;m the concept owner and creative director. The ideas are mine; the images and the code were produced with AI tools working from my direction.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink p-5">
                <p className="eyebrow text-[10px] text-terracotta">What I did</p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink">
                  <li>The concept: a sneaker built from Mumbai&apos;s movement, its trains, CST, postcards, street lettering and food.</li>
                  <li>The sneaker design ideas and the three editions.</li>
                  <li>The packaging concept: poster box, tissue, postcard, tag and dust bag.</li>
                  <li>The brand direction: the COMET 2.0 name and the comet mark.</li>
                  <li>Directing the AI model with my ideas, and choosing the results.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-paper-2 p-5">
                <p className="eyebrow text-[10px] text-ink-3">What AI tools did</p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-2">
                  <li>An AI image model rendered the sneaker and packaging boards from my ideas.</li>
                  <li>Claude (Anthropic) built this website and produced the studio composites and launch reel, using Adobe Photoshop and Lightroom.</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-2">
              The renders are AI output, so they carry AI flaws, such as the misspelled मुबई on one sign. These are listed in section 06 rather than hidden.
            </p>
          </div>
        </section>

        <Section n="01" title="Overview">
          <p className="text-[17px] leading-relaxed text-ink">
            Mumbai is movement — a train every few minutes, footboard commuters, a snack eaten standing up. The brief I set myself: turn that energy into a sneaker that stays wearable, a box worth keeping, and a website that tells the story as one continuous journey from a crowded platform to the smallest stitch.
          </p>
        </Section>

        <Section n="02" title="The creative challenge">
          <ul className="grid gap-4 text-[15px] leading-relaxed text-ink-2 sm:grid-cols-2">
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Culture without cliché</b>City-themed products tend toward souvenirs: every landmark, everywhere. The shoe had to edit hard.
            </li>
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Illustration on a curved object</b>Postcard compositions are flat rectangles; a quarter panel curves, flexes and is cut by the eyestay and star.
            </li>
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Two scripts</b>Hindi and English had to share a hierarchy and stay legible at small sizes.
            </li>
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Story vs. usability</b>A cinematic, scroll-driven site that never traps the visitor, stays fast on ordinary phones and respects reduced motion.
            </li>
          </ul>
        </Section>

        <Section n="03" title="Research & cultural inspiration">
          <p className="mb-6 text-sm text-ink-3">Desk research and visual reference gathering. No interviews or surveys were run.</p>
          <ol className="divide-y divide-line border-y border-line">
            {RESEARCH.map(([k, v], i) => (
              <li key={k} className="grid gap-2 py-4 sm:grid-cols-[2rem_12rem_1fr]">
                <span className="font-mono text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                <b className="text-ink">{k}</b>
                <span className="text-[15px] leading-relaxed text-ink-2">{v}</span>
              </li>
            ))}
          </ol>
          <figure className="mt-8 rounded-2xl border border-line bg-paper-2 p-6">
            <svg viewBox="0 0 1000 420" className="w-full" role="img" aria-label="Simplified CST silhouette used throughout the project">
              <path d={CST_PATH} fill="#24365f" />
              <path d={CST_DETAIL} fill="none" stroke="#e5d9c2" strokeWidth="2" />
            </svg>
            <figcaption className="mt-3 text-xs text-ink-3">The CST silhouette as drawn for the project — one path shared by the opening scene, the box artwork and this page.</figcaption>
          </figure>
        </Section>

        <Section n="04" title="Intended audience">
          <p className="mb-5 text-sm text-ink-3">Assumptions to validate, not research findings.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Daily commuters", "18–30, city-based, wear one pair of sneakers for everything — they need wearability first."],
              ["Sneaker collectors", "Care about story, packaging and limited editions; the box and inserts are for them."],
              ["The diaspora", "Mumbaikars abroad, for whom the references are memory rather than decoration."],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line p-5">
                <b className="text-ink">{k}</b>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{v}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n="05" title="Design principles">
          <ol className="grid gap-3">
            {PRINCIPLES.map(([k, v], i) => (
              <li key={k} className="grid gap-1 rounded-2xl border border-line p-5 sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline">
                <span className="font-mono text-xs text-red">P{i + 1}</span>
                <b className="text-ink">{k}</b>
                <span className="text-[15px] leading-relaxed text-ink-2">{v}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section n="06" title="Concept development">
          <p className="mb-6 text-[15px] leading-relaxed text-ink-2">
            Three directions on one silhouette, each a full board: views, details and — for the second — packaging. They became the three editions.
          </p>
          <div className="grid gap-6">
            {COLORWAYS.map((c) => (
              <figure key={c.id} className="overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.board} alt={`${c.name} concept board`} loading="lazy" className="w-full" />
                <figcaption className="grid gap-2 p-5 sm:grid-cols-[12rem_1fr]">
                  <span>
                    <b className="text-ink">{c.name}</b> <span className="deva text-red">{c.hindi}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-ink-2">{c.story}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 rounded-xl border border-line bg-paper-2 p-4 text-sm leading-relaxed text-ink-2">
            <b className="text-ink">What the boards got wrong.</b> Concept renders are not production artwork. The Platform Local sign tile reads मुबई — the anusvara is missing; it must be मुंबई. The Harbour board draws the star at two different sizes in two views. Both are logged for the production artwork rather than hidden.
          </p>
        </Section>

        <Section n="07" title="Visual identity">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-5">
              <p className="eyebrow text-[10px] text-ink-3">Palette</p>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Paper", "#eee5d3"],
                  ["Charcoal", "#1f1d1b"],
                  ["Indigo", "#24365f"],
                  ["Railway red", "#b3402d"],
                  ["Saffron", "#d18a2a"],
                  ["Gum", "#774a2a"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center gap-3">
                    <i className="block h-9 w-9 rounded-lg border border-black/10" style={{ background: v }} />
                    <span>
                      <b className="block text-ink">{k}</b>
                      <span className="font-mono text-xs text-ink-3">{v}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-3">The interface stays quiet so the shoe&apos;s own materials and illustrations carry the colour.</p>
            </div>
            <div className="rounded-2xl border border-line p-5">
              <p className="eyebrow text-[10px] text-ink-3">Type</p>
              <p className="h-display mt-4 text-5xl text-ink">Mumbai</p>
              <p className="text-xs text-ink-3">DM Serif Display — editorial display</p>
              <p className="deva mt-4 text-4xl text-red">मुंबई लोकल</p>
              <p className="text-xs text-ink-3">Yatra One — hand-painted Devanagari voice</p>
              <p className="deva-text mt-4 text-2xl text-ink">आमची मुंबई</p>
              <p className="text-xs text-ink-3">Tiro Devanagari Hindi — readable Devanagari text</p>
              <p className="mt-4 text-lg font-semibold text-ink">Archivo — interface and body</p>
              <p className="font-mono text-sm text-ink">IBM Plex Mono — tickets, data, 19.0760° N</p>
            </div>
          </div>
        </Section>

        <Section n="08" title="Graphics & placement">
          <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
            <div className="rounded-2xl border border-line bg-paper-2 p-5">
              <SneakerSVG colors={COLORWAYS[0].colors} className="w-full" />
              <SneakerSVG colors={COLORWAYS[0].colors} zone="lateral-rear" className="mt-2 w-full" detailed={false} />
            </div>
            <ul className="space-y-3 text-[15px] leading-relaxed text-ink-2">
              <li>
                <b className="text-ink">Quarters</b> carry the scenes; the train runs heel-to-toe so it reads as motion.
              </li>
              <li>
                <b className="text-ink">The star</b> overlays the art — the constant across editions.
              </li>
              <li>
                <b className="text-ink">The vamp and eyestay</b> stay clean: perforations and stitching only.
              </li>
              <li>
                <b className="text-ink">Heel and tongue</b> carry the names: MUMBAI embroidered, COMET woven.
              </li>
              <li>
                <b className="text-ink">Small references</b> (vada pav, postmark) sit low, near the toe, to be discovered.
              </li>
            </ul>
          </div>
        </Section>

        <Section n="09" title="Packaging development">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["/img/box-closed.webp", "Lid as poster: the shoe breaks the frame, CST etched behind, red sun."],
              ["/img/box-open.webp", "Indigo toile tissue redrawn with Mumbai scenes, closed with a star seal."],
              ["/img/box-inserts.webp", "Postcard, ticket-style hang tag and navy dust bag."],
            ].map(([src, cap]) => (
              <figure key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={cap} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                <figcaption className="mt-2 text-sm text-ink-2">{cap}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
            On the site, the box is told in three stages — closed, opened, inserts — that advance with scroll, with markers on each stage explaining the decisions behind it.
          </p>
        </Section>

        <Section n="10" title="Interaction & motion">
          <div className="grid gap-5">
            <ol className="grid gap-2 sm:grid-cols-3">
              {CHAPTERS.map((c) => (
                <li key={c.id} className="rounded-xl border border-line p-3 text-sm">
                  <span className="font-mono text-xs text-red">{c.n}</span> <b className="text-ink">{c.label}</b>
                </li>
              ))}
            </ol>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-paper-2 text-xs text-ink-3">
                  <tr>
                    {["Token", "Timing", "Easing", "Used for"].map((h) => (
                      <th key={h} className="px-4 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOTION.map((r) => (
                    <tr key={r[0]} className="border-t border-line">
                      <td className="px-4 py-2 font-semibold text-ink">{r[0]}</td>
                      <td className="px-4 py-2 text-ink-2">{r[1]}</td>
                      <td className="px-4 py-2 font-mono text-xs text-ink-2">{r[2]}</td>
                      <td className="px-4 py-2 text-ink-2">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="grid gap-3 text-[15px] leading-relaxed text-ink-2 sm:grid-cols-2">
              <li className="rounded-2xl border border-line p-5">
                <b className="block text-ink">Native scroll, stepped sequences</b>The page scrolls natively. Long sections split their scroll range into steps; React only re-renders when a step changes, and every step is reachable from a tab, the chapter rail or the menu.
              </li>
              <li className="rounded-2xl border border-line p-5">
                <b className="block text-ink">Why 2.0 dropped real-time 3D</b>Version 1 built the shoe as a parametric mesh in code and projected the board art onto it. It read as a blocky toe, a slab sole and floating laces, with smeared, upscaled artwork — worse than the boards it came from. Without a properly modelled GLB, the honest choice was the approved renders, presented as renders.
              </li>
              <li className="rounded-2xl border border-line p-5">
                <b className="block text-ink">Accessible by default</b>Skip-intro control, keyboard-reachable hotspots with labels, Esc to close details, a list alternative to every hotspot, and a static opening when reduced motion is requested.
              </li>
              <li className="rounded-2xl border border-line p-5">
                <b className="block text-ink">Light where it counts</b>No WebGL, no animated filters, no scroll-jacking library. Only transform and opacity animate; images below the fold lazy-load; the illustrated opening uses CSS keyframes and pauses under reduced motion.
              </li>
            </ul>
          </div>
        </Section>

        <Section n="11" title="Final experience">
          <p className="text-[15px] leading-relaxed text-ink-2">
            A cinematic opening on a CSMT platform that pushes in to the shoe, a silhouette sequence, the postcard system, eight explained details, a three-stage packaging story, a campaign frame and a product page that ends in this case study — not a checkout. The opening is illustrated rather than filmed: the platform is drawn in the same navy-etching language as the shoe&apos;s artwork, so the city and the product read as one world.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["01-local-lateral-hero", "Platform Local"],
              ["03-postcard-lateral", "Postcard"],
              ["04-harbour-closeup", "Harbour"],
              ["02-local-medial", "Platform Local · medial"],
              ["05-box-terracotta", "Poster box"],
              ["06-campaign-box-and-shoe", "Campaign frame"],
            ].map(([f, cap]) => (
              <figure key={f}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/photo/${f}.webp`} alt={`${cap}, studio photograph`} loading="lazy" className="aspect-[3/2] w-full rounded-xl object-cover" />
                <figcaption className="mt-1.5 text-xs text-ink-3">{cap}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            <b className="text-ink">Studio photography.</b> Each product was cut from its board with Adobe Photoshop, staged on a paper sweep with shadows traced from its own outline, then graded in Lightroom and finished with grain. The product pixels are never redrawn. These are composites of concept renders, not photographs of a manufactured shoe.
          </p>
          <div className="mt-6">
            <OriginButton href="/">
              Open the experience <span aria-hidden>→</span>
            </OriginButton>
          </div>
        </Section>

        <Section n="12" title="Outcomes & reflections">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-[10px] text-ink-3">Delivered</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-2">
                <li>Three sneaker editions on one silhouette</li>
                <li>Collectible box, tissue, postcard, tag and bag</li>
                <li>Eight-chapter scroll story, with slots ready for the cinematic shots</li>
                <li>COMET 2.0 identity: a comet mark (the shoe&apos;s four-point star trailing a tapered tail) and wordmark</li>
                <li>Bilingual type system and design tokens</li>
                <li>This case study</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-[10px] text-ink-3">Next, if this went further</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-2">
                <li>Generate and edit the cinematic shots, then swap them into the video slots</li>
                <li>Sculpt a production 3D model on a real last before bringing back real-time 3D</li>
                <li>Correct the board lettering and redraw the art as vector separations</li>
                <li>Material sampling and print strike-offs on canvas</li>
                <li>Usability-test the scroll story, especially on low-end phones</li>
              </ul>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
