// "8.0 / 10" reads worse than "8 / 10" — only show the decimal when it's
// not just noise from a whole-number rating.
export function formatRating(rating: number): string {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}
