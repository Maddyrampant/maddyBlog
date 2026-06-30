import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function ZoomgPagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 text-sm rounded-lg transition-all"
          style={{
            border: "1px solid var(--zoomg-border)",
            color: "var(--zoomg-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--zoomg-accent)";
            e.currentTarget.style.color = "var(--zoomg-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--zoomg-border)";
            e.currentTarget.style.color = "var(--zoomg-text-muted)";
          }}
        >
          قبلی
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className="px-3 py-2 text-sm rounded-lg transition-all"
          style={{
            background: page === currentPage ? "var(--zoomg-accent)" : "transparent",
            color: page === currentPage ? "#fff" : "var(--zoomg-text-muted)",
            border: page === currentPage
              ? "1px solid var(--zoomg-accent)"
              : "1px solid var(--zoomg-border)",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--zoomg-accent)";
              e.currentTarget.style.color = "var(--zoomg-accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.currentTarget.style.borderColor = "var(--zoomg-border)";
              e.currentTarget.style.color = "var(--zoomg-text-muted)";
            }
          }}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 text-sm rounded-lg transition-all"
          style={{
            border: "1px solid var(--zoomg-border)",
            color: "var(--zoomg-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--zoomg-accent)";
            e.currentTarget.style.color = "var(--zoomg-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--zoomg-border)";
            e.currentTarget.style.color = "var(--zoomg-text-muted)";
          }}
        >
          بعدی
        </Link>
      )}
    </div>
  );
}
