import { DESIGNER, hasDesigner } from "@/lib/designer";

/** "Designed by" block. Renders nothing until src/lib/designer.ts is filled in. */
export function DesignerCredit({ variant = "footer" }: { variant?: "footer" | "case" }) {
  if (!hasDesigner) return null;
  const d = DESIGNER;
  if (variant === "case") {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line py-4 text-sm">
        <p>
          <span className="eyebrow mr-2 text-[10px] text-ink-3">Designed by</span>
          <b className="text-ink">{d.name}</b>
          {d.role && <span className="text-ink-2"> · {d.role}</span>}
          {d.location && <span className="text-ink-3"> · {d.location}</span>}
        </p>
        <ul className="flex flex-wrap gap-4">
          {d.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-terracotta">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="mt-6 border-t border-line pt-5 text-sm">
      <p className="eyebrow text-[10px] text-ink-3">Designed by</p>
      <p className="mt-2 text-base font-semibold text-ink">{d.name}</p>
      {d.role && <p className="text-ink-2">{d.role}{d.location ? ` · ${d.location}` : ""}</p>}
      {d.bio && <p className="mt-2 max-w-md leading-relaxed text-ink-2">{d.bio}</p>}
      <ul className="mt-3 flex flex-wrap gap-4">
        {d.links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-terracotta">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
