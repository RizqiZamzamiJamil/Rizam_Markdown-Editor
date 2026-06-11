export function countWords(markdown) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_[\]()`~\-|]/g, " ")
    .trim();

  if (!text) return 0;
  return text.split(/\s+/).length;
}

export function getReadingTime(words) {
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function sanitizeFileName(title) {
  const fallback = "rizam-md-document";
  const cleaned = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || fallback;
}

export function extractTitleFromMarkdown(markdown) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim() || "Untitled document";
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=[\]{};:'"\\|,.<>/?]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(value, counts) {
  const baseSlug = slugify(value) || "section";
  const currentCount = counts.get(baseSlug) || 0;
  counts.set(baseSlug, currentCount + 1);
  return currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount}`;
}

export function buildTableOfContents(markdown) {
  const counts = new Map();

  return markdown
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (!match) return null;

      const text = match[2]
        .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
        .replace(/[*_`~]/g, "")
        .trim();

      return {
        id: uniqueSlug(text, counts),
        level: match[1].length,
        text,
      };
    })
    .filter(Boolean);
}

export function insertInline(view, before, after = "", placeholder = "text") {
  if (!view || !view.dom?.isConnected) return false;

  const selection = view.state.selection.main;
  const selected = view.state.sliceDoc(selection.from, selection.to) || placeholder;
  const insert = `${before}${selected}${after}`;
  const anchor = selection.from + before.length;

  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert },
    selection: { anchor, head: anchor + selected.length },
  });
  view.focus();
  return true;
}

export function insertBlock(view, block) {
  if (!view || !view.dom?.isConnected) return false;

  const selection = view.state.selection.main;
  const currentLine = view.state.doc.lineAt(selection.from);
  const prefix = currentLine.from === 0 ? "" : "\n";
  const suffix = block.endsWith("\n") ? "" : "\n";
  const insert = `${prefix}${block}${suffix}`;

  view.dispatch({
    changes: { from: currentLine.from, to: selection.to, insert },
    selection: { anchor: currentLine.from + insert.length },
  });
  view.focus();
  return true;
}
