import {
  Copy,
  FilePlus2,
  FileText,
  FolderOpen,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { formatDate } from "../utils/markdown";
import { IconButton } from "./IconButton";

export function Sidebar({
  documents,
  activeId,
  onCreate,
  onDuplicate,
  onDeleteRequest,
  onImportRequest,
  onSelect,
}) {
  return (
    <aside className="hidden min-h-0 w-72 shrink-0 border-r border-white/10 bg-brand-panelSoft/70 backdrop-blur xl:flex xl:flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-cyan">
            Workspace
          </p>
          <h2 className="font-display text-lg font-bold text-white">Documents</h2>
        </div>
        <div className="flex items-center gap-2">
          <IconButton id="new-document" label="New" icon={FilePlus2} onClick={onCreate} />
          <IconButton
            id="import-document"
            label="Import"
            icon={FolderOpen}
            onClick={onImportRequest}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {documents.map((document) => {
          const isActive = document.id === activeId;

          return (
            <button
              className={`group w-full rounded-lg border p-3 text-left transition ${
                isActive
                  ? "border-brand-cyan/45 bg-brand-cyan/10 shadow-cyan"
                  : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
              key={document.id}
              onClick={() => onSelect(document.id)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                    isActive
                      ? "border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan"
                      : "border-white/10 bg-white/[0.04] text-slate-300"
                  }`}
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-sm font-bold leading-snug text-white">
                    {document.title || "Untitled document"}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {formatDate(document.updatedAt)}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          id="document-actions-button"
          className="inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-bold text-slate-200 transition hover:border-brand-cyan/35 hover:bg-brand-cyan/10"
          data-dropdown-toggle="document-actions-menu"
          type="button"
        >
          <span>Document actions</span>
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <div
          id="document-actions-menu"
          className="z-10 hidden w-48 divide-y divide-white/10 rounded-lg border border-white/10 bg-slate-950 shadow"
        >
          <ul className="py-2 text-sm text-slate-200" aria-labelledby="document-actions-button">
            <li>
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-white/[0.06]"
                onClick={onDuplicate}
                type="button"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                Duplicate
              </button>
            </li>
            <li>
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-300 hover:bg-red-500/10"
                onClick={onDeleteRequest}
                type="button"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
