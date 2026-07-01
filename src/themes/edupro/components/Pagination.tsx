import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function EduProPagination({
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
            border: "1px solid var(--edupro-border)",
            color: "var(--edupro-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--edupro-accent)";
            e.currentTarget.style.color = "var(--edupro-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--edupro-border)";
            e.currentTarget.style.color = "var(--edupro-text-muted)";
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
              page === currentPage ? "var(--edupro-accent)" : "transparent",
            color: page === currentPage ? "#fff" : "var(--edupro-text-muted)",
            border:
              page === currentPage
                ? "1px solid var(--edupro-accent)"
                : "1px solid var(--edupro-border)",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--edupro-accent)";
              e.currentTarget.style.color = "var(--edupro-accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--edupro-border)";
              e.currentTarget.style.color = "var(--edupro-text-muted)";
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
            border: "1px solid var(--edupro-border)",
            color: "var(--edupro-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--edupro-accent)";
            e.currentTarget.style.color = "var(--edupro-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--edupro-border)";
            e.currentTarget.style.color = "var(--edupro-text-muted)";
          }}
        >
          Next
        </Link>
      )}
    </div>
  );
}
