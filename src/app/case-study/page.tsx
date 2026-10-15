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
  description:
    "How an unsolicited sneaker collection, its packaging, a three-world campaign and a cinematic launch site were designed from Mumbai's railway and street culture — the brief, research, decisions, iterations and trade-offs.",
};

/** Evidence labels: every claim on this page is one of these. */
const KINDS = {
  research: { label: "Research", cls: "border-indigo/40 bg-indigo/10 text-indigo", note: "Desk research from public sources, linked." },
  hypothesis: { label: "Hypothesis", cls: "border-saffron/50 bg-saffron/10 text-[#8a5a12]", note: "An assumption to validate, not a finding." },
  proposal: { label: "Proposal", cls: "border-terracotta/40 bg-terracotta/10 text-terracotta", note: "A designed concept, not produced." },
  built: { label: "Built", cls: "border-ink/30 bg-ink/5 text-ink", note: "Exists and can be checked: the site, the assets." },
} as const;
type Kind = keyof typeof KINDS;

function Tag({ k }: { k: Kind }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${KINDS[k].cls}`}>{KINDS[k].label}</span>;
}

function Section({ n, title, kinds, id, children }: { n: string; title: string; kinds: Kind[]; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="grid scroll-mt-20 gap-6 border-t border-line py-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 lg:py-20">
      <Reveal>
        <p className="font-mono text-xs text-red">{n}</p>
        <h2 className="h-display mt-3 text-3xl text-ink sm:text-4xl">{title}</h2>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {kinds.map((k) => (
            <Tag key={k} k={k} />
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.08} className="min-w-0">
        {children}
      </Reveal>
    </section>
  );
}

/** Phone layout for three-column tables: one card per row. */
function Stacked({ rows, heads }: { rows: string[][]; heads: [string, string] }) {
  return (
    <ul className="mt-4 grid gap-3 sm:hidden">
      {rows.map(([a, b, c]) => (
        <li key={a} className="rounded-2xl border border-line p-4">
          <b className="text-ink">{a}</b>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">{heads[0]} · </span>
            {b}
          </p>
          {c !== "—" && (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">{heads[1]} · </span>
              {c}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

const SOURCES = [
  ["Inc42 — Can Comet stir up a sneaker revolution with its storytelling playbook?", "https://inc42.com/startups/can-comet-stir-up-a-sneaker-revolution-with-its-storytelling-playbook"],
  ["Elevation Capital — Comet's mission to rewrite India's sneaker story", "https://elevationcapital.com/comets-mission-to-rewrite-indias-sneaker-story"],
  ["Homegrown — The Gully Labs Naadu sneaker channels Kerala's essence", "https://homegrown.co.in/homegrown-supply/the-gully-labs-naadu-sneaker-channels-keralas-essence-through-intricate-motifs"],
  ["Inc42 — How Gully Labs is luring Indian sneakerheads with desi designs", "https://inc42.com/?p=546186"],
  ["UNESCO World Heritage List — Chhatrapati Shivaji Terminus (formerly Victoria Terminus)", "https://whc.unesco.org/en/list/945/"],
];

const RESEARCH = [
  ["The suburban railway", "The local train as the city's circulation: red-and-yellow rakes, footboard commuters, fast/slow indicators. India's first passenger train left Bori Bunder, where the terminus now stands, for Thane in 1853."],
  ["CSMT, the terminus", "F. W. Stevens' terminus (completed 1888; UNESCO World Heritage Site since 2004): Victorian Gothic Revival fused with Indian craft detail — the dome, turrets and arcades."],
  ["Postcards & ephemera", "Hand-tinted postcards, air-mail labels, cancellation marks and second-class tickets: framing, borders and limited ink sets."],
  ["Street lettering", "Enamel station boards and hand-painted stall signs: stacked bilingual names, heavy Devanagari strokes, red on cream."],
  ["Everyday culture", "Vada pav between trains; tennis-ball cricket on the maidans; आमची मुंबई — 'our Mumbai' in Marathi."],
];

const COMPETITORS = [
  ["COMET", "Limited drops every one to two months, built on nostalgia and Indian everyday culture (releases such as Mango, Pataka and Jugnu).", "The brief's home: a storytelling brand whose next step could be a city told in depth."],
  ["Gully Labs", "Culturally Indian sneakers with regional series — the Kerala-inspired Naadu uses boat motifs and Malayalam script — plus handcraft details and collaborations.", "Proves regional scripts and motifs sell; the gap is a story carried past the shoe."],
  ["Global city editions", "Sneakers named after cities, where the city is often a name and a colourway rather than a narrative.", "Shows the format; leaves the story to the buyer."],
  ["Souvenir merchandise", "Landmark collages on tees and totes: every icon at once.", "The trap to avoid — the reason for 'one scene per panel'."],
];

const PRINCIPLES = [
  ["Wearable first", "The silhouette stays a classic low-top court shoe. Without the graphics, it should still be a shoe someone wants."],
  ["One scene per panel", "Each quarter carries one composed view with one horizon line, like a picture postcard — never a collage of icons."],
  ["Two scripts, one hierarchy", "Devanagari is the voice (red, hand-painted); Latin capitals are the label (navy, enamel-board). Every Hindi word is proofread."],
  ["Discover, don't announce", "The loudest references sit where the eye lands first; the small ones (vada pav, the postmark) reward a second look."],
  ["Honest presentation", "Renders are labelled as renders, proposals as proposals. Nothing claims to be manufactured, tested or for sale."],
];

const SPEC = [
  ["Upper", "Cream cotton canvas, printed artwork (print method to be proven in strike-offs)"],
  ["Star & heel counter", "Navy suede overlays; the star sits over the artwork on both quarters"],
  ["Lettering", "COMET woven tongue label; MUMBAI embroidered at the heel"],
  ["Laces & lining", "Chai-brown cotton laces; navy lining"],
  ["Outsole", "Gum rubber cupsole, herringbone tread, star medallion at the pivot point"],
];

const MOTION = [
  ["Reveal", "900 ms", "cubic-bezier(.22, 1, .36, 1)", "Editorial text and frames entering the viewport"],
  ["Sequence step", "700 ms", "cubic-bezier(.22, 1, .36, 1)", "Product views, details and box stages advancing with scroll"],
  ["Camera push", "1.6 screens of scroll", "quadratic ease-in", "Opening: platform → shoe, transform-only"],
  ["Section jump", "1.2 s", "smooth scroll, header-aware", "Header, menu and chapter links; URL hash updated"],
  ["Frame viewer", "280 ms", "cubic-bezier(.22, 1, .36, 1)", "Full-screen campaign frames, arrow keys and Esc"],
];

const ITERATIONS = [
  ["Real-time 3D → renders", "Version 1 built the shoe as a parametric mesh in code and projected the board art onto it. It read as a blocky toe, a slab sole and smeared artwork.", "Dropped 3D until a properly modelled shoe exists; the approved renders lead, labelled as renders."],
  ["Storyboard → campaign frame", "The illustrated platform proved the camera push into the shoe, but read as a drawing rather than a launch.", "Opened on the platform frame instead, extended to landscape for wide screens; the storyboard is kept in the Studio chapter as process."],
  ["बंदर → हार्बर", "The Harbour edition's first Hindi name, बंदर, is most often read as 'monkey'.", "Renamed हार्बर — the word Mumbaikars use for the Harbour line — across the site and the launch film."],
  ["मुबई, left visible", "The Platform Local board's sign tile drops the anusvara; it must read मुंबई.", "Logged for production artwork and shown in the Studio chapter instead of hidden."],
  ["Consistency over quantity", "Some campaign frames drew the shoe's artwork differently from the approved design.", "Removed the frame whose artwork drifted furthest; consistency of the product beats one more image."],
  ["Depth vs. length", "A ten-chapter story risks losing visitors before the end.", "Every chapter is reachable from the header, the menu and, on wide screens, the chapter rail; the campaign and studio are linked directly."],
];

const ROLES = [
  ["Product / UX designer", "Information architecture of a ten-chapter story; navigation that scrolls, updates the URL and respects the sticky header; interactive product viewer and frame viewer; accessibility defaults.", "No usability testing has been run yet."],
  ["UI designer", "Responsive editorial layouts from phone to desktop, a type system spanning Latin and Devanagari, design tokens shared by site and assets.", "—"],
  ["Visual / brand designer", "Collection lockup, palette, bilingual type system, poster box, inserts and the graphic placement system on the shoe.", "Built around COMET's existing mark; the mark itself is the brand's."],
  ["Art director", "Three campaign worlds, frame selection and sequencing, crop and grade decisions, the red-set brand frame.", "Frames are concept imagery, not a photo shoot."],
  ["Marketing designer / strategist", "Competitive positioning, audience hypotheses, a tease–reveal–drop rollout and channel-specific assets.", "No campaign has run; nothing is measured."],
  ["Creative technologist", "Specified and directed a coded scroll experience, the motion system and the asset pipelines (frames, film, ads).", "Built with an AI coding assistant to my direction."],
];

export default function CaseStudy() {
  const local = COLORWAYS[0];
  return (
    <>
      <Nav home={false} />
      <main className="mx-auto max-w-[1200px] px-4 pb-10 pt-28 sm:px-8">
        <header className="pb-14">
          <p className="eyebrow text-ink-3">Case study · unsolicited concept</p>
          <h1 className="h-display mt-5 text-[clamp(3rem,8vw,7rem)] text-ink">
            <CometLogo size="xl" className="text-ink" />
            <span className="mt-4 block italic text-indigo">Mumbai in Motion</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            A sneaker collection, its packaging, a three-world campaign and a launch site — one concept built from Mumbai&apos;s local trains, the CSMT terminus, vintage postcards and street lettering. This page shows how it was thought through, what was tried, and what is still a proposal.
          </p>
          <DesignerCredit variant="case" />
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm sm:grid-cols-4">
            {[
              ["Type", "Unsolicited concept · portfolio"],
              ["Role", "Concept, product & creative direction"],
              ["Scope", "Product · packaging · campaign · web"],
              ["Year", "2026"],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper p-4">
                <dt className="eyebrow text-[10px] text-ink-3">{k}</dt>
                <dd className="mt-1 font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl border border-red/30 bg-red/5 px-4 py-3 text-sm leading-relaxed text-ink-2">
            <b className="text-red">Independent concept.</b> Made for COMET, the Indian sneaker brand, without a brief from them: not affiliated with, commissioned or endorsed by COMET, whose name and mark belong to their owner. No pair has been manufactured, tested or sold, and no user research or usability testing was carried out.
          </p>

          <section aria-labelledby="glance" className="mt-10 rounded-2xl bg-ink p-6 text-paper sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="glance" className="eyebrow text-paper/60">
                At a glance · 30-second read
              </h2>
              <span className="font-mono text-xs text-paper/40">Concept · 2026</span>
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.4fr_1fr]">
              <div>
                <p className="eyebrow text-[10px] text-saffron">The challenge</p>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/85">Turn a city into a sneaker without making a souvenir — then carry the same story through the box, the campaign and a site, without trapping the visitor.</p>
              </div>
              <div>
                <p className="eyebrow text-[10px] text-saffron">Three decisions that shaped it</p>
                <ol className="mt-2 space-y-3 text-[15px] leading-relaxed text-paper/85">
                  <li>
                    <b className="text-paper">One scene per panel.</b> Each quarter is composed like a picture postcard, never a collage of landmarks, so the shoe stays wearable.
                  </li>
                  <li>
                    <b className="text-paper">The product never changes; the world does.</b> Platform, street, red set — one shoe, three camera languages.
                  </li>
                  <li>
                    <b className="text-paper">Honest over flashy.</b> A weak real-time 3D shoe was dropped for the approved renders, and every proposal is labelled.
                  </li>
                </ol>
              </div>
              <div>
                <p className="eyebrow text-[10px] text-saffron">What it became</p>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-paper/85">
                  <li>3 editions, 1 silhouette</li>
                  <li>Poster box, wrap and inserts</li>
                  <li>Three-world campaign + 3 ad formats</li>
                  <li>20 s launch film (16:9, 9:16)</li>
                  <li>{CHAPTERS.length}-chapter launch site, live</li>
                </ul>
                <div className="mt-5">
                  <OriginButton href="/" tone="dark" size="sm">
                    Open the experience <span aria-hidden>→</span>
                  </OriginButton>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 rounded-2xl border border-line p-5">
            <p className="eyebrow text-[10px] text-ink-3">How to read this page</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(KINDS) as Kind[]).map((k) => (
                <li key={k} className="text-sm text-ink-2">
                  <Tag k={k} />
                  <span className="mt-1.5 block">{KINDS[k].note}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="mt-10">
            <ReelPlayer tone="dark" allowTall={false} />
            <figcaption className="mt-3 text-xs text-ink-3">The launch film: 20 seconds, cut in 16:9 and 9:16 from the studio frames, rendered frame by frame from an HTML timeline.</figcaption>
          </figure>

          <nav aria-label="Case study sections" className="mt-10">
            <ol className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["brief", "Overview & brief"],
                ["problem", "Problem & audience"],
                ["research", "Research & competition"],
                ["concept", "Concept & rationale"],
                ["footwear", "Footwear design"],
                ["brand", "Brand & packaging"],
                ["digital", "Digital experience"],
                ["campaign", "Campaign"],
                ["iterations", "Iterations & trade-offs"],
                ["outcomes", "Deliverables & value"],
              ].map(([id, t], i) => (
                <li key={id}>
                  <a href={`#${id}`} className="group flex gap-2 text-ink-2 hover:text-ink">
                    <span className="font-mono text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                    <span className="group-hover:underline group-hover:underline-offset-4">{t}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <Section id="brief" n="01" title="Overview & creative brief" kinds={["proposal"]}>
          <p className="text-[17px] leading-relaxed text-ink">
            Mumbai is movement — a train every few minutes, footboard commuters, a snack eaten standing up. The self-set brief: design a city collection for an Indian sneaker brand that turns that energy into a shoe people would actually wear, a box worth keeping, a campaign that feels observed rather than staged, and a site that tells the story as one journey from a crowded platform to the smallest stitch.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Objective", "One concept carried consistently across product, packaging, campaign and web."],
              ["Constraints", "A classic, wearable silhouette; two scripts at small sizes; a site that stays fast on ordinary phones."],
              ["Success looks like", "A reviewer can explain the idea in one sentence and find it in every touchpoint."],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line p-5">
                <dt className="font-semibold text-ink">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="problem" n="02" title="Problem, opportunity & audience" kinds={["research", "hypothesis"]}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-5">
              <p className="flex items-center gap-2 font-semibold text-ink">
                The problem <Tag k="research" />
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">City-themed products tend towards souvenirs: every landmark at once, flattened into a collage. They sell a place&apos;s postcard, not its life.</p>
            </div>
            <div className="rounded-2xl border border-line p-5">
              <p className="flex items-center gap-2 font-semibold text-ink">
                The opportunity <Tag k="research" />
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">Homegrown sneaker brands are building on Indian culture and limited drops (see section 03). A city told in depth — everyday rituals, not just monuments — is the next step.</p>
            </div>
          </div>
          <p className="mb-4 mt-8 flex items-center gap-2 text-sm text-ink-3">
            Intended audience <Tag k="hypothesis" />
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Daily commuters", "18–30, city-based, one pair of sneakers for everything — wearability comes first."],
              ["Collectors", "Buy into story, packaging and limited editions; the box and inserts are for them."],
              ["The diaspora", "Mumbaikars abroad, for whom the references are memory rather than decoration."],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line p-5">
                <b className="text-ink">{k}</b>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{v}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="research" n="03" title="Research, references & competition" kinds={["research"]}>
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

          <h3 className="mt-12 font-semibold text-ink">Competitive landscape</h3>
          <Stacked rows={COMPETITORS} heads={["What they do", "What it means for this brief"]} />
          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-line sm:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-paper-2 text-xs text-ink-3">
                <tr>
                  {["Who", "What they do", "What it means for this brief"].map((h) => (
                    <th key={h} className="px-4 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map(([a, b, c]) => (
                  <tr key={a} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-semibold text-ink">{a}</td>
                    <td className="px-4 py-3 text-ink-2">{b}</td>
                    <td className="px-4 py-3 text-ink-2">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 rounded-xl bg-paper-2 p-4 text-[15px] leading-relaxed text-ink">
            <b>Where this sits:</b> one city, told as a complete system — shoe, box, campaign and site — through everyday rituals as much as monuments.
          </p>

          <figure className="mt-8 rounded-2xl border border-line bg-paper-2 p-6">
            <svg viewBox="0 0 1000 420" className="w-full" role="img" aria-label="Simplified CSMT silhouette used throughout the project">
              <path d={CST_PATH} fill="#24365f" />
              <path d={CST_DETAIL} fill="none" stroke="#e5d9c2" strokeWidth="2" />
            </svg>
            <figcaption className="mt-3 text-xs text-ink-3">The CSMT silhouette as drawn for the project — one path shared by the storyboard, the box artwork and this page.</figcaption>
          </figure>

          <details className="mt-6 rounded-xl border border-line p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-ink">Sources</summary>
            <ul className="mt-3 space-y-1.5">
              {SOURCES.map(([t, u]) => (
                <li key={u}>
                  <a href={u} target="_blank" rel="noreferrer" className="text-indigo underline underline-offset-2 hover:text-ink">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </Section>

        <Section id="concept" n="04" title="Concept & design rationale" kinds={["proposal"]}>
          <p className="h-display text-3xl leading-tight text-ink sm:text-4xl">
            Mumbai in Motion: <span className="text-indigo">the city as it moves, worn on the feet that move through it.</span>
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">The railway is the spine — the commute is what every Mumbaikar shares. The terminus gives the architecture, postcards give the framing, street lettering gives the voice and vada pav gives the warmth a souvenir would leave out.</p>
          <ol className="mt-8 grid gap-3">
            {PRINCIPLES.map(([k, v], i) => (
              <li key={k} className="grid gap-1 rounded-2xl border border-line p-5 sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline">
                <span className="font-mono text-xs text-red">P{i + 1}</span>
                <b className="text-ink">{k}</b>
                <span className="text-[15px] leading-relaxed text-ink-2">{v}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="footwear" n="05" title="Footwear exploration & final details" kinds={["proposal"]}>
          <p className="mb-6 text-[15px] leading-relaxed text-ink-2">Three directions on one silhouette, each a full board. Platform Local became the hero because it is the most wearable and carries the commute; Postcard became the collector&apos;s edition and the box system; Harbour, the only all-over print, became the statement edition.</p>
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

          <h3 className="mt-12 font-semibold text-ink">Graphic placement</h3>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
            <div className="rounded-2xl border border-line bg-paper-2 p-5">
              <SneakerSVG colors={local.colors} className="w-full" />
              <SneakerSVG colors={local.colors} zone="lateral-rear" className="mt-2 w-full" detailed={false} />
            </div>
            <ul className="space-y-3 text-[15px] leading-relaxed text-ink-2">
              <li>
                <b className="text-ink">Quarters</b> carry the scenes; the train runs heel to toe so it reads as motion.
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

          <h3 className="mt-12 flex items-center gap-2 font-semibold text-ink">
            Proposed materials <Tag k="proposal" />
          </h3>
          <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {SPEC.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="font-semibold text-ink">{k}</dt>
                <dd className="text-[15px] text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl border border-line bg-paper-2 p-4 text-sm leading-relaxed text-ink-2">
            <b className="text-ink">What the boards got wrong.</b> Concept renders are not production artwork. The Platform Local sign tile reads मुबई — the anusvara is missing; it must be मुंबई. The Harbour board draws the star at two different sizes in two views. Both are logged for the production artwork rather than hidden.
          </p>
        </Section>

        <Section id="brand" n="06" title="Branding, packaging & materials" kinds={["proposal"]}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-5">
              <p className="eyebrow text-[10px] text-ink-3">Collection lockup</p>
              <div className="mt-5 rounded-xl bg-ink p-6 text-paper">
                <CometLogo size="lg" />
                <p className="wide mt-4 text-xs font-semibold tracking-[0.42em]">MUMBAI IN MOTION</p>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-3">Built around COMET&apos;s existing comet mark; the collection adds the &ldquo;2.0&rdquo; and the wide-tracked collection line.</p>
              <p className="eyebrow mt-6 text-[10px] text-ink-3">Palette</p>
              <ul className="mt-3 grid grid-cols-3 gap-3 text-xs">
                {[
                  ["Platform cream", "#ece2cf"],
                  ["Signal navy", "#1d2a4c"],
                  ["Charcoal", "#1f1d1b"],
                  ["Terracotta", "#b3533a"],
                  ["Gum", "#7a4a29"],
                  ["Set vermilion", "#9e2521"],
                ].map(([k, v]) => (
                  <li key={k}>
                    <i className="block h-9 rounded-lg border border-black/10" style={{ background: v }} />
                    <b className="mt-1 block text-ink">{k}</b>
                    <span className="font-mono text-ink-3">{v}</span>
                  </li>
                ))}
              </ul>
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

          <h3 className="mt-12 font-semibold text-ink">Packaging system</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ["/img/box-closed.webp", "Beat 1 · The lid is a poster: the shoe breaks the frame, CSMT etched behind, a red sun."],
              ["/img/box-open.webp", "Beat 2 · Indigo toile tissue redrawn with Mumbai scenes, closed with a star seal."],
              ["/img/box-inserts.webp", "Beat 3 · Postcard, ticket-style hang tag and navy dust bag."],
            ].map(([src, cap]) => (
              <figure key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={cap} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                <figcaption className="mt-2 text-sm text-ink-2">{cap}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
            <b className="text-ink">Structure:</b> a two-piece box — lid 340 × 220 × 40 mm carrying the poster artwork, base 334 × 214 × 120 mm in kraft with a navy interior. The dieline is shown in the Studio chapter. Material choices: canvas because it takes print like poster paper, suede for depth in the navy, gum for warmth underfoot; kraft for the base so the lid does the talking.
          </p>
          <div className="mt-6">
            <OriginButton href="/#studio" size="sm" variant="secondary">
              See the dieline in the Studio <span aria-hidden>→</span>
            </OriginButton>
          </div>
        </Section>

        <Section id="digital" n="07" title="Website & digital experience" kinds={["built"]}>
          <p className="text-[15px] leading-relaxed text-ink-2">A launch site that doubles as the case study&apos;s centrepiece: it opens on the platform, pushes in to the shoe, then moves through the product, the box, the campaign and the studio. Information architecture:</p>
          <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {CHAPTERS.map((c) => (
              <li key={c.id} className="rounded-xl border border-line p-3 text-sm">
                <span className="font-mono text-xs text-red">{c.n}</span> <b className="text-ink">{c.label}</b>
              </li>
            ))}
          </ol>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
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
          <ul className="mt-6 grid gap-3 text-[15px] leading-relaxed text-ink-2 sm:grid-cols-2">
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Navigation that behaves</b>Header, menu, chapter rail and footer links scroll smoothly, clear the sticky header, update the URL hash and work with Back; a direct link to /#studio lands on the heading.
            </li>
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Exploration, not decoration</b>A six-angle product viewer, hotspots on the shoe and box, an edition switcher and a full-screen frame viewer with keyboard support.
            </li>
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Accessible by default</b>Skip-intro control, labelled controls, focus returned after the viewer closes, Esc to close, and a static opening when reduced motion is requested.
            </li>
            <li className="rounded-2xl border border-line p-5">
              <b className="block text-ink">Light where it counts</b>Statically rendered pages, no WebGL, only transform and opacity animated, responsive images and lazy loading below the fold.
            </li>
          </ul>
        </Section>

        <Section id="campaign" n="08" title="Campaign strategy & advertising assets" kinds={["proposal", "built"]}>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              ["Insight", "Everyone in Mumbai shares the commute; no one buys a shoe to remember a monument."],
              ["Idea", "From the platform to the street. From CSMT to the Gateway. From the city to the spotlight."],
              ["Approach", "The product never changes between scenes; the world around it does. Observed on the platform, controlled on the red set."],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line p-5">
                <dt className="font-semibold text-ink">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/ads/billboard.webp" alt="Station hoarding: From the platform to the street" loading="lazy" className="w-full rounded-2xl" />
            <div className="grid grid-cols-[1fr_0.703fr] gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/ads/post.webp" alt="Feed post: From the city to the spotlight" loading="lazy" className="w-full rounded-2xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/ads/story.webp" alt="Story: Same city. Different stories." loading="lazy" className="w-full rounded-2xl" />
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-3">Station hoarding (3:1), feed post (4:5) and story (9:16), set in the collection&apos;s type and lockup. Layouts are built; placements are proposed.</p>
          <h3 className="mt-10 flex items-center gap-2 font-semibold text-ink">
            Proposed rollout <Tag k="proposal" />
          </h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Tease", "Station hoardings and the launch film — the platform, no product name."],
              ["Reveal", "Feed posts and red-set frames: the shoe as the hero object."],
              ["Drop", "Stories from the street, the poster box, and the site as the destination."],
            ].map(([k, v], i) => (
              <li key={k} className="rounded-2xl border border-line p-5">
                <span className="font-mono text-xs text-red">0{i + 1}</span>
                <b className="ml-2 text-ink">{k}</b>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{v}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="iterations" n="09" title="Iterations, challenges & trade-offs" kinds={["built"]}>
          <ol className="divide-y divide-line border-y border-line">
            {ITERATIONS.map(([k, problem, decision], i) => (
              <li key={k} className="grid gap-2 py-5 sm:grid-cols-[2rem_13rem_1fr]">
                <span className="font-mono text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                <b className="text-ink">{k}</b>
                <div className="text-[15px] leading-relaxed text-ink-2">
                  <p>{problem}</p>
                  <p className="mt-1.5 text-ink">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-terracotta">Decision · </span>
                    {decision}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="outcomes" n="10" title="Deliverables, potential value & next steps" kinds={["built", "hypothesis"]}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                Delivered <Tag k="built" />
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-2">
                <li>Three sneaker editions on one silhouette, with placement rationale</li>
                <li>Collection lockup, palette and bilingual type system</li>
                <li>Poster box, wrap, inserts and a proposed dieline</li>
                <li>Three-world campaign, brand frame and three ad formats</li>
                <li>20-second launch film in 16:9 and 9:16</li>
                <li>{CHAPTERS.length}-chapter launch site and this case study</li>
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                Potential value <Tag k="hypothesis" />
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-ink-2">
                <li>Fits a limited-drop model: three editions, three drops.</li>
                <li>A poster box people keep could raise perceived value and unboxing posts.</li>
                <li>The system extends to a city series — the Delhi Metro, Kolkata&apos;s trams — without a new visual language.</li>
                <li>One set of frames feeds every channel, from hoardings to stories.</li>
              </ul>
              <p className="mt-3 text-xs text-ink-3">Unvalidated. To test: waitlist sign-ups per edition, sell-through per drop, and unboxing posts per order.</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-line p-5">
            <p className="text-sm font-semibold text-ink">Next, if this went further</p>
            <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-[15px] text-ink-2 sm:grid-cols-2">
              <li>• Correct the board lettering and redraw the art as vector separations</li>
              <li>• Material sampling and print strike-offs on canvas</li>
              <li>• A properly modelled 3D shoe before bringing back real-time 3D</li>
              <li>• Produce the campaign&apos;s motion pieces for the video slots</li>
              <li>• Usability-test the scroll story, especially on low-end phones</li>
              <li>• Test the box structure with a physical mock-up</li>
            </ul>
          </div>
        </Section>

        <section aria-labelledby="roles" className="grid gap-6 border-t border-line py-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 lg:py-20">
          <Reveal>
            <p className="font-mono text-xs text-red">+</p>
            <h2 id="roles" className="h-display mt-3 text-3xl text-ink sm:text-4xl">
              What this project shows
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="min-w-0">
            <p className="mb-5 text-[15px] leading-relaxed text-ink-2">The strongest evidence is in art direction, brand and the digital experience. Each line below says what the work shows and where it stops.</p>
            <Stacked rows={ROLES} heads={["Evidence", "Limit"]} />
            <div className="hidden overflow-x-auto rounded-2xl border border-line sm:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-paper-2 text-xs text-ink-3">
                  <tr>
                    {["Role", "Evidence in this project", "Limit"].map((h) => (
                      <th key={h} className="px-4 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map(([a, b, c]) => (
                    <tr key={a} className="border-t border-line align-top">
                      <td className="px-4 py-3 font-semibold text-ink">{a}</td>
                      <td className="px-4 py-3 text-ink-2">{b}</td>
                      <td className="px-4 py-3 text-ink-3">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        <section aria-labelledby="method" className="grid gap-6 border-t border-line py-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 lg:py-20">
          <Reveal>
            <p className="font-mono text-xs text-red">+</p>
            <h2 id="method" className="h-display mt-3 text-3xl text-ink sm:text-4xl">
              My role & method
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="min-w-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink p-5">
                <p className="eyebrow text-[10px] text-terracotta">Mine</p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink">
                  <li>The concept, the brief and the cultural direction.</li>
                  <li>The sneaker ideas, the three editions and where every graphic sits.</li>
                  <li>The packaging concept and the unboxing sequence.</li>
                  <li>Art direction: the three campaign worlds, and selecting, correcting and sequencing every frame.</li>
                  <li>The site&apos;s structure, content and motion direction.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-paper-2 p-5">
                <p className="eyebrow text-[10px] text-ink-3">Tools in the workflow</p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-2">
                  <li>Concept boards and campaign frames were generated with image-generation tools from my written briefs, then curated and corrected.</li>
                  <li>Studio frames were composited and graded in Adobe Photoshop and Lightroom; the product pixels are never redrawn.</li>
                  <li>The site was built with an AI coding assistant working to my structure and direction.</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="border-t border-line py-14 text-center">
          <OriginButton href="/">
            Open the experience <span aria-hidden>→</span>
          </OriginButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
