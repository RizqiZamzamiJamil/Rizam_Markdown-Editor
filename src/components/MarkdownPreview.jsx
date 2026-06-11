import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { MermaidChart } from "./MermaidChart";
import { uniqueSlug } from "../utils/markdown";

function getNodeText(node) {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) return node.children.map(getNodeText).join("");
  return "";
}

function applyHeadingIds(node, counts) {
  if (node.type === "heading") {
    const id = uniqueSlug(getNodeText(node), counts);
    node.data = node.data || {};
    node.data.hProperties = {
      ...(node.data.hProperties || {}),
      id,
    };
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => applyHeadingIds(child, counts));
  }
}

function remarkHeadingIds() {
  return (tree) => {
    applyHeadingIds(tree, new Map());
  };
}

function createHeading(level) {
  const Tag = `h${level}`;

  return function Heading({ children, id }) {
    return (
      <Tag id={id}>
        <a href={`#${id}`}>{children}</a>
      </Tag>
    );
  };
}

export function MarkdownPreview({ markdown }) {
  return (
    <ReactMarkdown
      components={{
        a({ children, href }) {
          return (
            <a href={href} rel="noreferrer" target={href?.startsWith("#") ? undefined : "_blank"}>
              {children}
            </a>
          );
        },
        code({ children, className }) {
          const code = String(children).replace(/\n$/, "");

          if (className?.includes("language-mermaid")) {
            return <MermaidChart chart={code} />;
          }

          return <code className={className}>{children}</code>;
        },
        h1: createHeading(1),
        h2: createHeading(2),
        h3: createHeading(3),
        h4: createHeading(4),
        img({ alt, src }) {
          return (
            <img
              alt={alt || ""}
              className="rounded-lg border border-white/10"
              loading="lazy"
              src={src}
            />
          );
        },
      }}
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm, remarkHeadingIds]}
    >
      {markdown}
    </ReactMarkdown>
  );
}
