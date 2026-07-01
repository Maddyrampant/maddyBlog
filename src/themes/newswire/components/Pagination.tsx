import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function NewsWirePagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-semibold transition-all"
          style={{
            border: "1px solid var(--newswire-border)",
            color: "var(--newswire-text)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--newswire-accent)";
            e.currentTarget.style.color = "var(--newswire-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--newswire-border)";
            e.currentTarget.style.color = "var(--newswire-text)";
          }}
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className="px-3 py-2 text-sm font-semibold transition-all"
          style={{
            background:
              page === currentPage ? "var(--newswire-accent)" : "transparent",
            color: page === currentPage ? "#fff" : "var(--newswire-text-muted)",
            border:
              page === currentPage
                ? "1px solid var(--newswire-accent)"
                : "1px solid var(--newswire-border)",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--newswire-accent)";
              e.currentTarget.style.color = "var(--newswire-accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--newswire-border)";
              e.currentTarget.style.color = "var(--newswire-text-muted)";
            }
          }}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-semibold transition-all"
          style={{
            border: "1px solid var(--newswire-border)",
            color: "var(--newswire-text)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--newswire-accent)";
            e.currentTarget.style.color = "var(--newswire-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--newswire-border)";
            e.currentTarget.style.color = "var(--newswire-text)";
          }}
        >
          Next
        </Link>
      )}
    </div>
  );
}
