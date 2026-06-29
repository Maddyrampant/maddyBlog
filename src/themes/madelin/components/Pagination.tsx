import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function MadelinPagination({
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
          className="px-4 py-2 text-sm rounded-lg transition-all"
          style={{
            border: "1px solid var(--madelin-border)",
            color: "var(--madelin-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--madelin-accent)";
            e.currentTarget.style.color = "var(--madelin-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--madelin-border)";
            e.currentTarget.style.color = "var(--madelin-text-muted)";
          }}
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className="px-3 py-2 text-sm rounded-lg transition-all"
          style={{
            background:
              page === currentPage ? "var(--madelin-accent)" : "transparent",
            color: page === currentPage ? "#fff" : "var(--madelin-text-muted)",
            border:
              page === currentPage
                ? "1px solid var(--madelin-accent)"
                : "1px solid var(--madelin-border)",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--madelin-accent)";
              e.currentTarget.style.color = "var(--madelin-accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--madelin-border)";
              e.currentTarget.style.color = "var(--madelin-text-muted)";
            }
          }}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm rounded-lg transition-all"
          style={{
            border: "1px solid var(--madelin-border)",
            color: "var(--madelin-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--madelin-accent)";
            e.currentTarget.style.color = "var(--madelin-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--madelin-border)";
            e.currentTarget.style.color = "var(--madelin-text-muted)";
          }}
        >
          Next
        </Link>
      )}
    </div>
  );
}
