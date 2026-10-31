// import { useState, useEffect, useCallback } from "react";
// import api from "../api/axios"; // 👈 Import your API instance

// const STORAGE_KEY = "wishlist";

// function read() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// function write(ids) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
//     window.dispatchEvent(new Event("wishlist:change"));
//   } catch {}
// }

// export function useWishlist() {
//   const [ids, setIds] = useState(read());

//   useEffect(() => {
//     const sync = () => setIds(read());
//     window.addEventListener("wishlist:change", sync);
//     window.addEventListener("storage", sync);
//     return () => {
//       window.removeEventListener("wishlist:change", sync);
//       window.removeEventListener("storage", sync);
//     };
//   }, []);

//   const has = useCallback((id) => ids.includes(id), [ids]);

//   const toggle = useCallback(
//     async (id) => {
//       const isCurrentlySaved = ids.includes(id);
//       const next = isCurrentlySaved
//         ? ids.filter((x) => x !== id)
//         : [...ids, id];
      
//       // 1. Update UI instantly
//       write(next);
//       setIds(next);

//       // 2. Sync with Spring Boot Backend
//       try {
//         if (isCurrentlySaved) {
//           await api.delete(`/wishlist/${id}`);
//         } else {
//           await api.post(`/wishlist/${id}`);
//         }
//       } catch (err) {
//         console.error("Wishlist backend sync failed:", err);
//       }
//     },
//     [ids]
//   );

//   const remove = useCallback(
//     async (id) => {
//       const next = ids.filter((x) => x !== id);
//       write(next);
//       setIds(next);

//       try {
//         await api.delete(`/wishlist/${id}`);
//       } catch (err) {
//         console.error("Failed to remove from backend:", err);
//       }
//     },
//     [ids]
//   );

//   const clear = useCallback(() => {
//     write([]);
//     setIds([]);
//     // Note: To clear all from DB, you would need a custom backend endpoint.
//   }, []);

//   return { ids, has, toggle, remove, clear, count: ids.length };
// }
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const STORAGE_KEY = "wishlist";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("wishlist:change"));
  } catch {}
}

export function useWishlist() {
  const [ids, setIds] = useState(read());

  // 👈 1. FETCH REAL DATA FROM BACKEND ON LOAD
  useEffect(() => {
    const fetchBackendWishlist = async () => {
      try {
        const response = await api.get("/wishlist");
        // Assuming your backend returns a list of Wishlist objects with a product property
        const dbItems = response.data.data || response.data;
        
        if (Array.isArray(dbItems)) {
          // Extract product IDs from the database objects
          // const dbIds = dbItems.map((item) => item.product.id);
          const dbIds = dbItems
              .map((item) => item?.product?.id ?? item?.productId)
              .filter((id) => id != null);
          
          // Merge with local storage (or just use DB as source of truth)
          const mergedIds = [...new Set([...read(), ...dbIds])];
          write(mergedIds);
          setIds(mergedIds);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist from backend:", err);
      }
    };

    fetchBackendWishlist();
  }, []);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener("wishlist:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wishlist:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (id) => {
      const isCurrentlySaved = ids.includes(id);
      const next = isCurrentlySaved
        ? ids.filter((x) => x !== id)
        : [...ids, id];
      
      write(next);
      setIds(next);

      try {
        if (isCurrentlySaved) {
          await api.delete(`/wishlist/${id}`);
        } else {
          await api.post(`/wishlist/${id}`);
        }
      } catch (err) {
        console.error("Wishlist backend sync failed:", err);
      }
    },
    [ids]
  );

  const remove = useCallback(
    async (id) => {
      const next = ids.filter((x) => x !== id);
      write(next);
      setIds(next);

      try {
        await api.delete(`/wishlist/${id}`);
      } catch (err) {
        console.error("Failed to remove from backend:", err);
      }
    },
    [ids]
  );

  const clear = useCallback(() => {
    write([]);
    setIds([]);
  }, []);

  return { ids, has, toggle, remove, clear, count: ids.length };
}