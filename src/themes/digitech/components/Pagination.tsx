import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function DigitechPagination({
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
            border: "1px solid var(--digitech-border)",
            color: "var(--digitech-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--digitech-accent)";
            e.currentTarget.style.color = "var(--digitech-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--digitech-border)";
            e.currentTarget.style.color = "var(--digitech-text-muted)";
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
              page === currentPage ? "var(--digitech-accent)" : "transparent",
            color: page === currentPage ? "#fff" : "var(--digitech-text-muted)",
            border:
              page === currentPage
                ? "1px solid var(--digitech-accent)"
                : "1px solid var(--digitech-border)",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--digitech-accent)";
              e.currentTarget.style.color = "var(--digitech-accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--digitech-border)";
              e.currentTarget.style.color = "var(--digitech-text-muted)";
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
            border: "1px solid var(--digitech-border)",
            color: "var(--digitech-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--digitech-accent)";
            e.currentTarget.style.color = "var(--digitech-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--digitech-border)";
            e.currentTarget.style.color = "var(--digitech-text-muted)";
          }}
        >
          Next
        </Link>
      )}
    </div>
  );
}
