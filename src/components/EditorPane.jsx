import CodeMirror from "@uiw/react-codemirror";
import { markdown as markdownExtension } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";

const extensions = [markdownExtension()];

export function EditorPane({ editorViewRef, markdown, onChange }) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 border-white/10 lg:border-r">
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-slate-300">
            Editor
          </h2>
          <span className="rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 px-2.5 py-1 text-xs font-bold text-brand-cyan">
            Markdown
          </span>
        </div>
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <CodeMirror
            basicSetup={{
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              lineNumbers: true,
            }}
            className="h-full"
            extensions={extensions}
            height="100%"
            onChange={onChange}
            onCreateEditor={(view) => {
              editorViewRef.current = view;
            }}
            theme={oneDark}
            value={markdown}
          />
        </div>
      </div>
    </section>
  );
}
