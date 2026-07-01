import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function GameversePagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
          style={{
            border: "1px solid var(--gameverse-border)",
            color: "var(--gameverse-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gameverse-neon-purple)";
            e.currentTarget.style.color = "var(--gameverse-neon-purple)";
            e.currentTarget.style.boxShadow =
              "0 0 12px var(--gameverse-accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gameverse-border)";
            e.currentTarget.style.color = "var(--gameverse-text-muted)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className="px-3 py-2 text-sm rounded-lg transition-all font-semibold"
          style={{
            background:
              page === currentPage
                ? "var(--gameverse-neon-purple)"
                : "transparent",
            color:
              page === currentPage ? "#fff" : "var(--gameverse-text-muted)",
            border:
              page === currentPage
                ? "1px solid var(--gameverse-neon-purple)"
                : "1px solid var(--gameverse-border)",
            boxShadow:
              page === currentPage
                ? "0 0 16px var(--gameverse-accent-glow)"
                : "none",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor =
                "var(--gameverse-neon-purple)";
              e.currentTarget.style.color = "var(--gameverse-neon-purple)";
              e.currentTarget.style.boxShadow =
                "0 0 12px var(--gameverse-accent-glow)";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--gameverse-border)";
              e.currentTarget.style.color = "var(--gameverse-text-muted)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
          style={{
            border: "1px solid var(--gameverse-border)",
            color: "var(--gameverse-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gameverse-neon-purple)";
            e.currentTarget.style.color = "var(--gameverse-neon-purple)";
            e.currentTarget.style.boxShadow =
              "0 0 12px var(--gameverse-accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gameverse-border)";
            e.currentTarget.style.color = "var(--gameverse-text-muted)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Next
        </Link>
      )}
    </div>
  );
}
