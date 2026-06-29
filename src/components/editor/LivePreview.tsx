import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type LivePreviewProps = {
  content: string;
};

export default function LivePreview({ content }: LivePreviewProps) {
  const markdown = htmlToMarkdown(content);

  return (
    <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-zinc-800 dark:prose-a:text-zinc-200 prose-img:rounded-xl prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:text-sm prose-pre:bg-zinc-950 dark:prose-pre:bg-zinc-900 prose-pre:text-zinc-100">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown || "*Start writing to see the preview…*"}
      </ReactMarkdown>
    </div>
  );
}

function htmlToMarkdown(html: string): string {
  if (!html.trim()) return "";

  let md = html;

  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
  md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<code>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  md = md.replace(/<ul[^>]*>/gi, "");
  md = md.replace(/<\/ul>/gi, "");
  md = md.replace(/<ol[^>]*>/gi, "");
  md = md.replace(/<\/ol>/gi, "");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n\n");
  md = md.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n");
  md = md.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    "![$2]($1)\n\n",
  );
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match) => {
    const rows = match.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    const mdRows = rows.map((row) => {
      const cells = row.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi) || [];
      return (
        "| " +
        cells
          .map((c) => c.replace(/<\/?t[dh][^>]*>/gi, "").trim())
          .join(" | ") +
        " |"
      );
    });
    if (mdRows.length > 1) {
      const header = mdRows[0];
      const colCount = (header.match(/\|/g)?.length ?? 2) - 1;
      const sepRow = "|" + " --- |".repeat(colCount);
      return [header, sepRow, ...mdRows.slice(1)].join("\n") + "\n\n";
    }
    return "";
  });
  md = md.replace(/<[^>]*>/g, "");

  return md.replace(/\n{3,}/g, "\n\n").trim();
}
