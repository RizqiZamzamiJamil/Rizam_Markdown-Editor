import { initFlowbite } from "flowbite";
import { Clock3, Copy, FilePlus2, Globe2, Trash2, Type } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import brandMark from "./assets/brand-mark-clean.png";
import { DeleteDialog } from "./components/DeleteDialog";
import { EditorPane } from "./components/EditorPane";
import { IconButton } from "./components/IconButton";
import { MobileDocumentBar } from "./components/MobileDocumentBar";
import { PreviewPane } from "./components/PreviewPane";
import { Sidebar } from "./components/Sidebar";
import { Toast } from "./components/Toast";
import { Toolbar } from "./components/Toolbar";
import {
  ACTIVE_DOCUMENT_KEY,
  createDocument,
  getDocuments,
  removeDocument,
  saveDocument,
  sortDocuments,
} from "./lib/storage";
import {
  countWords,
  extractTitleFromMarkdown,
  getReadingTime,
  insertBlock,
  insertInline,
  sanitizeFileName,
} from "./utils/markdown";

function getInitialView() {
  return "split";
}

function updateDocumentTitle(title, markdown) {
  return title.trim() || extractTitleFromMarkdown(markdown);
}

export default function App() {
  const [activeId, setActiveId] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isBooting, setIsBooting] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [title, setTitle] = useState("");
  const [toast, setToast] = useState("");
  const [viewMode, setViewMode] = useState(getInitialView);

  const documentsRef = useRef([]);
  const editorViewRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeIdRef = useRef("");
  const markdownRef = useRef("");
  const saveTimerRef = useRef(null);
  const titleRef = useRef("");
  const toastTimerRef = useRef(null);

  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeId) || null,
    [activeId, documents],
  );

  const words = useMemo(() => countWords(markdown), [markdown]);
  const readingTime = useMemo(() => getReadingTime(words), [words]);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    initFlowbite();
  }, [activeId, documents.length, isDeleteOpen, toast, viewMode]);

  useEffect(() => {
    let cancelled = false;

    async function bootWorkspace() {
      try {
        let storedDocuments = await getDocuments();

        if (storedDocuments.length === 0) {
          const firstDocument = createDocument();
          await saveDocument(firstDocument);
          storedDocuments = [firstDocument];
        }

        if (cancelled) return;

        const lastActiveId = localStorage.getItem(ACTIVE_DOCUMENT_KEY);
        const activeDocumentId =
          storedDocuments.find((document) => document.id === lastActiveId)
            ?.id || storedDocuments[0].id;

        setDocuments(storedDocuments);
        setActiveId(activeDocumentId);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Unable to open workspace",
        );
      } finally {
        if (!cancelled) setIsBooting(false);
      }
    }

    bootWorkspace();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;

    const document = documentsRef.current.find((item) => item.id === activeId);
    if (!document) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    titleRef.current = document.title;
    markdownRef.current = document.content;
    setTitle(document.title);
    setMarkdown(document.content);
    setSaveStatus("Saved");
    localStorage.setItem(ACTIVE_DOCUMENT_KEY, document.id);
  }, [activeId]);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    },
    [],
  );

  function scheduleSave() {
    if (isBooting || !activeIdRef.current) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    setSaveStatus("Unsaved");

    saveTimerRef.current = window.setTimeout(async () => {
      const baseDocument = documentsRef.current.find(
        (document) => document.id === activeIdRef.current,
      );
      if (!baseDocument) return;

      const updatedDocument = {
        ...baseDocument,
        content: markdownRef.current,
        title: updateDocumentTitle(titleRef.current, markdownRef.current),
        updatedAt: new Date().toISOString(),
      };

      try {
        setSaveStatus("Saving");
        await saveDocument(updatedDocument);
        setDocuments((currentDocuments) =>
          sortDocuments(
            currentDocuments.map((document) =>
              document.id === updatedDocument.id ? updatedDocument : document,
            ),
          ),
        );
        setSaveStatus("Saved");
      } catch (error) {
        setSaveStatus("Unsaved");
        showToast(
          error instanceof Error ? error.message : "Unable to save document",
        );
      }
    }, 700);
  }

  function showToast(message) {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2600);
  }

  async function createNewDocument() {
    const document = createDocument({
      title: "Untitled document",
      content: "# Untitled document\n\nStart writing here.\n",
    });

    await saveDocument(document);
    setDocuments((currentDocuments) =>
      sortDocuments([document, ...currentDocuments]),
    );
    setActiveId(document.id);
    showToast("New document created");
  }

  async function duplicateDocument() {
    if (!activeDocument) return;

    const document = createDocument({
      title: `${title || activeDocument.title} copy`,
      content: markdown,
    });

    await saveDocument(document);
    setDocuments((currentDocuments) =>
      sortDocuments([document, ...currentDocuments]),
    );
    setActiveId(document.id);
    showToast("Document duplicated");
  }

  async function confirmDeleteDocument() {
    if (!activeDocument) return;

    const nextDocuments = documents.filter(
      (document) => document.id !== activeDocument.id,
    );

    if (nextDocuments.length === 0) {
      const replacement = createDocument({
        title: "Untitled document",
        content: "# Untitled document\n\nStart writing here.\n",
      });
      await saveDocument(replacement);
      await removeDocument(activeDocument.id);
      setDocuments([replacement]);
      setActiveId(replacement.id);
    } else {
      await removeDocument(activeDocument.id);
      const sortedDocuments = sortDocuments(nextDocuments);
      setDocuments(sortedDocuments);
      setActiveId(sortedDocuments[0].id);
    }

    setIsDeleteOpen(false);
    showToast("Document deleted");
  }

  function downloadMarkdown() {
    const fileTitle = updateDocumentTitle(title, markdown);
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${sanitizeFileName(fileTitle)}.md`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Markdown downloaded");
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      showToast("Markdown copied");
    } catch {
      showToast("Unable to copy Markdown");
    }
  }

  async function formatMarkdown() {
    try {
      setIsFormatting(true);
      const [{ default: prettier }, { default: markdownPlugin }] =
        await Promise.all([
          import("prettier/standalone"),
          import("prettier/plugins/markdown"),
        ]);
      const formatted = await prettier.format(markdown, {
        parser: "markdown",
        plugins: [markdownPlugin],
        proseWrap: "preserve",
      });

      handleMarkdownChange(formatted.trimEnd() + "\n");
      showToast("Markdown formatted");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to format Markdown",
      );
    } finally {
      setIsFormatting(false);
    }
  }

  function requestImport() {
    fileInputRef.current?.click();
  }

  async function importMarkdown(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const content = await file.text();
    const document = createDocument({
      title:
        file.name.replace(/\.md$/i, "") || extractTitleFromMarkdown(content),
      content,
    });

    await saveDocument(document);
    setDocuments((currentDocuments) =>
      sortDocuments([document, ...currentDocuments]),
    );
    setActiveId(document.id);
    showToast("Markdown imported");
  }

  function insertEditorInline(before, after, placeholder) {
    const inserted = insertInline(
      editorViewRef.current,
      before,
      after,
      placeholder,
    );
    if (inserted) return;

    handleMarkdownChange(
      `${markdownRef.current}\n\n${before}${placeholder}${after}\n`,
    );
  }

  function insertEditorBlock(block) {
    const inserted = insertBlock(editorViewRef.current, block);
    if (inserted) return;

    const currentMarkdown = markdownRef.current.trimEnd();
    handleMarkdownChange(
      `${currentMarkdown}\n\n${block.endsWith("\n") ? block : `${block}\n`}`,
    );
  }

  function handleMarkdownChange(value) {
    markdownRef.current = value;
    setMarkdown(value);
    scheduleSave();
  }

  function handleTitleChange(value) {
    titleRef.current = value;
    setTitle(value);
    scheduleSave();
  }

  if (isBooting) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-bg text-white">
        <div className="rounded-lg border border-brand-cyan/20 bg-brand-panel p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <img className="h-11 w-11" src={brandMark} alt="" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-cyan">
                Markdown Editor | Rizam
              </p>
              <p className="font-display text-xl font-bold">
                Opening workspace...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell flex h-screen min-h-0 flex-col overflow-hidden bg-brand-bg text-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black px-4 py-3 lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center">
            <img
              className="h-10 w-10 object-contain"
              src={brandMark}
              alt="Markdown Editor | Rizam"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-cyan">
              Markdown Editor | Rizam
            </p>
            <input
              aria-label="Document title"
              className="block w-full min-w-0 border-0 bg-transparent p-0 font-display text-xl font-bold text-white placeholder:text-slate-500 focus:ring-0"
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Untitled document"
              value={title}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.045] px-2.5 py-2">
            <Type className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
            {words} words
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.045] px-2.5 py-2">
            <Clock3
              className="h-3.5 w-3.5 text-brand-green"
              aria-hidden="true"
            />
            {readingTime} min
          </span>
          <IconButton
            id="copy-markdown"
            label="Copy"
            icon={Copy}
            onClick={copyMarkdown}
          />
          <IconButton
            id="duplicate-document-top"
            label="Duplicate"
            icon={FilePlus2}
            onClick={duplicateDocument}
          />
          <IconButton
            id="delete-document-top"
            label="Delete"
            icon={Trash2}
            onClick={() => setIsDeleteOpen(true)}
          />
          <a
            aria-label="Website Pribadi Rizam"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-slate-200 transition hover:border-brand-cyan/40 hover:bg-brand-cyan/10 hover:text-white"
            href="https://rizam.fun"
            rel="noreferrer"
            target="_blank"
            title="Website Pribadi Rizam"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <MobileDocumentBar
        activeId={activeId}
        documents={documents}
        onCreate={createNewDocument}
        onImportRequest={requestImport}
        onSelect={setActiveId}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          activeId={activeId}
          documents={documents}
          onCreate={createNewDocument}
          onDeleteRequest={() => setIsDeleteOpen(true)}
          onDuplicate={duplicateDocument}
          onImportRequest={requestImport}
          onSelect={setActiveId}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Toolbar
            activeView={viewMode}
            isFormatting={isFormatting}
            onDownload={downloadMarkdown}
            onFormat={formatMarkdown}
            onImportRequest={requestImport}
            onInsertBlock={insertEditorBlock}
            onInsertInline={insertEditorInline}
            onSetView={setViewMode}
            saveStatus={saveStatus}
          />

          <div className="min-h-0 flex-1 overflow-hidden">
            <div
              className={`h-full min-h-0 ${
                viewMode === "split" ? "flex flex-col lg:flex-row" : "flex"
              }`}
            >
              {viewMode !== "preview" && (
                <EditorPane
                  editorViewRef={editorViewRef}
                  markdown={markdown}
                  onChange={handleMarkdownChange}
                />
              )}
              {viewMode !== "editor" && <PreviewPane markdown={markdown} />}
            </div>
          </div>
        </div>
      </div>

      <input
        accept=".md,.markdown,text/markdown,text/plain"
        className="hidden"
        onChange={importMarkdown}
        ref={fileInputRef}
        type="file"
      />

      <DeleteDialog
        documentTitle={title}
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteDocument}
      />
      <Toast message={toast} />
    </main>
  );
}
