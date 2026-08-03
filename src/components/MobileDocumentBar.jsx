import { FilePlus2, FolderOpen } from "lucide-react";
import { IconButton } from "./IconButton";

export function MobileDocumentBar({
  documents,
  activeId,
  onCreate,
  onImportRequest,
  onSelect,
}) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 bg-brand-panelSoft p-3 xl:hidden">
      <select
        aria-label="Select document"
        className="block min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm font-semibold text-white focus:border-brand-cyan focus:ring-brand-cyan"
        onChange={(event) => onSelect(event.target.value)}
        value={activeId || ""}
      >
        {documents.map((document) => (
          <option key={document.id} value={document.id}>
            {document.title || "Untitled document"}
          </option>
        ))}
      </select>
      <IconButton
        id="mobile-new-document"
        label="New"
        icon={FilePlus2}
        onClick={onCreate}
      />
      <IconButton
        id="mobile-import-document"
        label="Import"
        icon={FolderOpen}
        onClick={onImportRequest}
      />
    </div>
  );
}
