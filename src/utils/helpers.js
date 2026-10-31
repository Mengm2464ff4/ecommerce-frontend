export const formatPrice = (price) => {
  if (price == null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// export const getImageUrl = (imageUrl) => {
//   if (!imageUrl) return '/placeholder.png';
//   if (imageUrl.startsWith('http')) return imageUrl;
//   const base = import.meta.env.VITE_API_URL || 'http://localhost:8080';
//   return `${base}${imageUrl}`;
// };
export const getImageUrl = (imageUrl) => {
  const DEFAULT = 'https://placehold.co/400x400/eef2ff/6c7bf5?text=No+Image';
  if (!imageUrl) return DEFAULT;
  if (typeof imageUrl !== 'string') return DEFAULT;

  const trimmed = imageUrl.trim();
  if (!trimmed) return DEFAULT;

  // Already a full URL
  if (trimmed.startsWith('http')) return trimmed;

  // Protocol-relative
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  // Strip "/api" from the base URL (images don't live under /api)
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:8080')
    .replace(/\/api\/?$/, '');

  // Relative path starting with "/"
  if (trimmed.startsWith('/')) return `${base}${trimmed}`;

  // Bare filename → assume uploads/products
  return `${base}/uploads/products/${trimmed}`;
};