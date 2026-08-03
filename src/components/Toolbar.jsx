import {
  Bold,
  Braces,
  CheckSquare,
  Code2,
  Download,
  Eye,
  FileCode2,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  PanelLeft,
  Quote,
  Rows3,
  Save,
  Sparkles,
  Table2,
  Upload,
} from "lucide-react";
import { IconButton } from "./IconButton";

export function Toolbar({
  activeView,
  isFormatting,
  onDownload,
  onFormat,
  onImportRequest,
  onInsertBlock,
  onInsertInline,
  onSetView,
  saveStatus,
}) {
  return (
    <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#10151d] px-3 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.035] p-1">
          <IconButton
            active={activeView === "split"}
            id="view-split"
            label="Split"
            icon={PanelLeft}
            onClick={() => onSetView("split")}
          />
          <IconButton
            active={activeView === "editor"}
            id="view-editor"
            label="Editor"
            icon={FileCode2}
            onClick={() => onSetView("editor")}
          />
          <IconButton
            active={activeView === "preview"}
            id="view-preview"
            label="Preview"
            icon={Eye}
            onClick={() => onSetView("preview")}
          />
        </div>

        <span className="hidden h-8 w-px bg-white/10 sm:block" />

        <div className="flex flex-wrap items-center gap-2">
          <IconButton
            id="format-h1"
            label="Heading 1"
            icon={Heading1}
            onClick={() => onInsertBlock("# Heading 1\n")}
          />
          <IconButton
            id="format-h2"
            label="Heading 2"
            icon={Heading2}
            onClick={() => onInsertBlock("## Heading 2\n")}
          />
          <IconButton
            id="format-bold"
            label="Bold"
            icon={Bold}
            onClick={() => onInsertInline("**", "**", "bold text")}
          />
          <IconButton
            id="format-italic"
            label="Italic"
            icon={Italic}
            onClick={() => onInsertInline("_", "_", "italic text")}
          />
          <IconButton
            id="format-link"
            label="Link"
            icon={Link}
            onClick={() =>
              onInsertInline("[", "](https://rizam.fun)", "link text")
            }
          />
          <IconButton
            id="format-image"
            label="Image"
            icon={Image}
            onClick={() => onInsertBlock("![Alt text](/favicon.png)\n")}
          />
          <IconButton
            id="format-quote"
            label="Quote"
            icon={Quote}
            onClick={() => onInsertBlock("> Quote text\n")}
          />
          <IconButton
            id="format-ul"
            label="List"
            icon={List}
            onClick={() => onInsertBlock("- First item\n- Second item\n")}
          />
          <IconButton
            id="format-ol"
            label="Ordered list"
            icon={ListOrdered}
            onClick={() => onInsertBlock("1. First item\n2. Second item\n")}
          />
          <IconButton
            id="format-task"
            label="Task list"
            icon={CheckSquare}
            onClick={() => onInsertBlock("- [ ] Task item\n- [x] Done item\n")}
          />
          <IconButton
            id="format-code"
            label="Inline code"
            icon={Code2}
            onClick={() => onInsertInline("`", "`", "code")}
          />
          <IconButton
            id="format-code-block"
            label="Code block"
            icon={Braces}
            onClick={() =>
              onInsertBlock('```js\nconsole.log("Hello Rizam MD");\n```\n')
            }
          />
          <IconButton
            id="format-table"
            label="Table"
            icon={Table2}
            onClick={() =>
              onInsertBlock(
                "| Column A | Column B |\n| --- | --- |\n| Value A | Value B |\n",
              )
            }
          />
          <IconButton
            id="format-divider"
            label="Divider"
            icon={Rows3}
            onClick={() => onInsertBlock("---\n")}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold sm:inline-flex ${
            saveStatus === "Saved"
              ? "border-brand-green/25 bg-brand-green/10 text-emerald-200"
              : saveStatus === "Saving"
                ? "border-brand-amber/25 bg-brand-amber/10 text-amber-200"
                : "border-white/10 bg-white/[0.045] text-slate-300"
          }`}
        >
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
          {saveStatus}
        </span>
        <IconButton
          disabled={isFormatting}
          id="format-document"
          label="Format"
          icon={Sparkles}
          onClick={onFormat}
        />
        <IconButton
          id="upload-document"
          label="Import"
          icon={Upload}
          onClick={onImportRequest}
        />
        <button
          aria-label="Download"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-brand-cyan bg-brand-cyan px-3 text-sm font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/45"
          onClick={onDownload}
          type="button"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  );
}
