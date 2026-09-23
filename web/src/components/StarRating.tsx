import { Star, StarHalf } from "lucide-react";

export default function StarRating({
  rating,
  className = "h-4 w-4",
}: {
  rating: number;
  className?: string;
}) {
  const stars = rating / 2; // our scale is 0-10; render as 5 stars

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (stars >= i + 1) {
          return <Star key={i} className={`${className} fill-amber-400 text-amber-400`} />;
        }
        if (stars >= i + 0.5) {
          return <StarHalf key={i} className={`${className} fill-amber-400 text-amber-400`} />;
        }
        return <Star key={i} className={`${className} text-neutral-300 dark:text-neutral-700`} />;
      })}
    </span>
  );
}
