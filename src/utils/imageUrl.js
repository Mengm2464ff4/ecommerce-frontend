// Builds a full image URL from a stored relative path.
const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:8080";

const DEFAULT_FALLBACK =
  "https://placehold.co/400x400/eef2ff/6c7bf5?text=No+Image";

/**
 * Turn a stored image path into a full URL the browser can load.
 * Handles:
 *   null / undefined        → fallback placeholder
 *   https://...             → returned as-is
 *   /uploads/products/x.jpg → BACKEND_URL + path
 *   uploads/products/x.jpg  → BACKEND_URL + "/" + path
 *   x.jpg (bare filename)   → BACKEND_URL + /uploads/products/x.jpg
 */
export const getImageUrl = (imageUrl, fallback = DEFAULT_FALLBACK) => {
  if (!imageUrl) return fallback;
  if (typeof imageUrl !== "string") return fallback;

  const trimmed = imageUrl.trim();
  if (!trimmed) return fallback;

  // Already a full URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Protocol-relative
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  // Starts with "/" → relative to backend root
  if (trimmed.startsWith("/")) {
    return `${BACKEND_URL}${trimmed}`;
  }

  // Bare filename → assume uploads/products folder
  return `${BACKEND_URL}/uploads/products/${trimmed}`;
};

export default getImageUrl;