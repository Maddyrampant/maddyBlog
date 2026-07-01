import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export default function EduProCategoryBadge({
  name,
  slug,
}: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="edupro-subject-badge inline-flex"
    >
      {name}
    </Link>
  );
}
