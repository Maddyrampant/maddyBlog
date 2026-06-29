"use client";

import { useState, useCallback } from "react";
import type { SEOResult } from "@/lib/ai";

type SEOPanelProps = {
  title: string;
  content: string;
  metaDescription?: string;
};

export default function SEOPanel({
  title,
  content,
  metaDescription,
}: SEOPanelProps) {
  const [result, setResult] = useState<SEOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/ai/seo-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, metaDescription }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? "Analysis failed");
      }
      const data: SEOResult = await resp.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  }, [title, content, metaDescription]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          SEO Analysis
        </h3>
        <button
          type="button"
          onClick={analyze}
          disabled={loading}
          className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {result && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Score:</span>
            <span
              className={`font-bold text-lg ${
                result.score >= 80
                  ? "text-green-500"
                  : result.score >= 50
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {result.score}/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Title", value: result.titleScore },
              { label: "Description", value: result.descriptionScore },
              { label: "Keywords", value: result.keywordScore },
              { label: "Readability", value: result.readabilityScore },
              { label: "Structure", value: result.structureScore },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      value >= 70
                        ? "bg-green-500"
                        : value >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-zinc-500 w-16 text-right">
                  {label}: {value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <p className="text-zinc-500 mb-1">Details</p>
            <ul className="space-y-0.5">
              <li className="text-zinc-400">Words: {result.wordCount}</li>
              <li className="text-zinc-400">
                Reading time: {result.readingTime} min
              </li>
              <li className="text-zinc-400">
                Headings: H1({result.headings.h1}) H2({result.headings.h2}) H3(
                {result.headings.h3})
              </li>
            </ul>
          </div>

          {result.suggestions.length > 0 && (
            <div className="pt-1">
              <p className="text-zinc-500 mb-1">Suggestions</p>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-zinc-400 flex gap-1.5">
                    <span className="text-blue-400 mt-0.5 shrink-0">
                      &#8594;
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.keywords.length > 0 && (
            <div className="pt-1">
              <p className="text-zinc-500 mb-1">Top Keywords</p>
              <div className="flex flex-wrap gap-1">
                {result.keywords.slice(0, 6).map((kw) => (
                  <span
                    key={kw.word}
                    className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-xs"
                  >
                    {kw.word}
                    <span className="text-zinc-400 ml-1">
                      ({kw.density.toFixed(1)}%)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.suggestedTags.length > 0 && (
            <div className="pt-1">
              <p className="text-zinc-500 mb-1">Suggested Tags</p>
              <div className="flex flex-wrap gap-1">
                {result.suggestedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !error && !loading && (
        <p className="text-xs text-zinc-400">
          Click &quot;Analyze&quot; to check SEO score and get improvement
          suggestions.
        </p>
      )}
    </div>
  );
}
