import { BookOpenText } from "lucide-react";
import { useRef } from "react";
import { buildTableOfContents } from "../utils/markdown";
import { MarkdownPreview } from "./MarkdownPreview";

export function PreviewPane({ markdown }) {
  const tableOfContents = buildTableOfContents(markdown);
  const previewScrollerRef = useRef(null);

  function scrollToSection(id) {
    const scroller = previewScrollerRef.current;
    const target = document.getElementById(id);

    if (!scroller || !target) return;

    const scrollerTop = scroller.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const offset = targetTop - scrollerTop + scroller.scrollTop - 20;

    scroller.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1">
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-slate-300">
            Preview
          </h2>
          <span className="rounded-lg border border-brand-green/20 bg-brand-green/10 px-2.5 py-1 text-xs font-bold text-emerald-200">
            GFM
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <div
            className="min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
            data-preview-scroller
            ref={previewScrollerRef}
          >
            <article className="markdown-preview prose prose-invert max-w-none">
              <MarkdownPreview markdown={markdown} />
            </article>
          </div>

          <aside className="hidden min-h-0 overflow-hidden border-l border-white/10 bg-white/[0.025] p-4 xl:block">
            <div className="flex h-full min-h-0 flex-col">
              <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-cyan">
                <BookOpenText className="h-4 w-4" aria-hidden="true" />
                Outline
              </div>
              {tableOfContents.length > 0 ? (
                <nav
                  className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1"
                  data-outline-nav
                >
                  {tableOfContents.map((item) => (
                    <a
                      className="block w-full rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 transition hover:bg-brand-cyan/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
                      data-target-id={item.id}
                      href={`#${item.id}`}
                      key={`${item.id}-${item.level}`}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(item.id);
                      }}
                      style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.5}rem` }}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-xs font-semibold text-slate-400">
                  No headings
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
