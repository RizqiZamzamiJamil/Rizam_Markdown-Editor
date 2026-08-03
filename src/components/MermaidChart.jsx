import { useEffect, useMemo, useState } from "react";

function hashChart(chart) {
  let hash = 0;
  for (let index = 0; index < chart.length; index += 1) {
    hash = (hash << 5) - hash + chart.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function MermaidChart({ chart }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const chartId = useMemo(
    () => `rizam-md-mermaid-${hashChart(chart)}`,
    [chart],
  );

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "#0a0f1b",
            mainBkg: "#0a0f1b",
            primaryColor: "#027dfd",
            primaryTextColor: "#f7fbff",
            primaryBorderColor: "#16d8f2",
            lineColor: "#059669",
            secondaryColor: "#111827",
            tertiaryColor: "#05070d",
          },
        });

        const rendered = await mermaid.render(
          `${chartId}-${Date.now()}`,
          chart,
        );
        if (!cancelled) {
          setSvg(rendered.svg);
          setError("");
        }
      } catch (renderError) {
        if (!cancelled) {
          setSvg("");
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Invalid Mermaid chart",
          );
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, chartId]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-red-400/20 bg-red-950/25 p-4 text-sm text-red-100">
        {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-slate-300">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      className="mermaid-output overflow-x-auto rounded-lg border border-brand-cyan/20 bg-slate-950/70 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
