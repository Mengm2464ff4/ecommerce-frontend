// src/utils/productBadges.js

const BADGES = [
  "Hot Deal",
  "Best Seller",
  "Trending",
  "Limited",
  "Popular",
  "Flash Sale",
  "New Arrival",
  "Top Rated",
];

const DISCOUNTS = [20, 30, 40, 25, 35, 45, 15, 10];

/**
 * Get a stable badge for a product based on its ID.
 * Same product always gets the same badge (deterministic).
 */
export const getProductBadge = (product) => {
  if (!product?.id) return null;
  return BADGES[product.id % BADGES.length];
};

/**
 * Get a stable discount % for a product based on its ID.
 * Same product always gets the same discount.
 */
export const getProductDiscount = (product) => {
  if (!product?.id) return 0;
  return DISCOUNTS[product.id % DISCOUNTS.length];
};

/**
 * Compute the "original price" (before discount) from a sale price.
 */
export const getOriginalPrice = (price, discountPercent) => {
  const sale = Number(price);
  if (!sale || !discountPercent) return sale;
  return Number((sale / (1 - discountPercent / 100)).toFixed(2));
};

/**
 * Return true if the badge is one of the "hot" variants.
 */
export const isHotBadge = (badge) => {
  return ["Hot Deal", "Flash Sale", "Trending"].includes(badge);
};