import { useState, useEffect } from "react";
import { productApi } from "../api/product";

let cache = null;

export function useProductsCache() {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    productApi
      .getActive(0, 500)
      .then((res) => {
        if (cancelled) return;
        const data = res.data.data || res.data;
        const list = Array.isArray(data) ? data : data?.content || [];
        cache = list;
        setProducts(list);
      })
      .catch((err) => console.error(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}