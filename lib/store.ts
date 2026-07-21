import imageCompression from "browser-image-compression";

export const API_URL = (process.env.NEXT_PUBLIC_STORE_API_URL || "http://localhost:3002").replace(/\/$/, "");

export type Product = {
  id: string;
  storeId: string;
  code: string;
  name: string;
  description: string;
  link: string;
  images: string[]; // max 3
  imageUrls?: string[]; // fallback for DB schema name
  price?: number;
  category?: string;
  isWhatsapp?: boolean;
  whatsappNumber?: string;
  affiliatePlatform?: string;
};

export type Store = {
  id: string;
  userId: string;
  name: string;
  creator: string;
  description: string;
  bannerUrl: string;
  banner?: string; // fallback for old UI fields
  logoUrl?: string;
  themeColor?: string;
  layoutStyle?: "card" | "flat";
  bgTemplate?: string; // key into BG_TEMPLATES, used when layoutStyle === "flat"
  handle?: string; // store handle (= id), set by mapStoreFromDB
  products: Product[];
};

/* 6 distinctive gradient background templates for the flat storefront look.
   `swatch` renders the circular picker; `page` paints the storefront. */
export const BG_TEMPLATES: Record<string, { label: string; swatch: string; page: string }> = {
  sunset:   { label: "Sunset",   swatch: "linear-gradient(135deg,#ff9a5a,#ff5e7d)",           page: "linear-gradient(160deg,#fff3ec 0%,#ffe3ea 60%,#ffd6e4 100%)" },
  ocean:    { label: "Ocean",    swatch: "linear-gradient(135deg,#38bdf8,#4f46e5)",           page: "linear-gradient(160deg,#eaf6ff 0%,#e3ecff 60%,#e6e3ff 100%)" },
  meadow:   { label: "Meadow",   swatch: "linear-gradient(135deg,#4ade80,#14b8a6)",           page: "linear-gradient(160deg,#effdf3 0%,#e2f8f1 60%,#dcf4ee 100%)" },
  dune:     { label: "Dune",     swatch: "linear-gradient(135deg,#fbbf24,#d97706)",           page: "linear-gradient(160deg,#fffaec 0%,#fdf1d9 60%,#fae9c8 100%)" },
  orchid:   { label: "Orchid",   swatch: "linear-gradient(135deg,#c084fc,#ec4899)",           page: "linear-gradient(160deg,#faf1ff 0%,#fbe9f7 60%,#fde2f0 100%)" },
  charcoal: { label: "Charcoal", swatch: "linear-gradient(135deg,#3f3f46,#09090b)",           page: "linear-gradient(160deg,#f4f4f5 0%,#e4e4e7 60%,#d4d4d8 100%)" },
};

export async function loadStore(uid: string): Promise<Store> {
  if (typeof window === "undefined") return emptyStore(uid);
  try {
    const res = await fetch(`${API_URL}/api/store?userId=${uid}`);
    if (!res.ok) return emptyStore(uid);
    const data = await res.json();
    if (data.store) {
      return mapStoreFromDB(data.store);
    }
    return emptyStore(uid);
  } catch (err) {
    console.error(err);
    return emptyStore(uid);
  }
}

export async function saveStore(uid: string, store: Store): Promise<Store> {
  const res = await fetch(`${API_URL}/api/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId: uid, 
      name: store.name, 
      creator: store.creator,
      description: store.description, 
      bannerUrl: store.banner || store.bannerUrl,
      logoUrl: store.logoUrl,
      themeColor: store.themeColor,
      layoutStyle: store.layoutStyle,
      bgTemplate: store.bgTemplate
    }),
  });
  const data = await res.json();
  return mapStoreFromDB({ ...data.store, products: store.products });
}

export async function loadPublicStore(handle: string): Promise<Store | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`${API_URL}/api/store/${handle}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.store ? mapStoreFromDB(data.store) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function saveProduct(storeId: string, product: Product): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, product }),
  });
  const data = await res.json();
  return {
    ...data.product,
    images: data.product.imageUrls || []
  };
}

export async function deleteProduct(id: string): Promise<void> {
  await fetch(`${API_URL}/api/products?id=${id}`, {
    method: 'DELETE'
  });
}

export function mapStoreFromDB(dbStore: any): Store {
  return {
    ...dbStore,
    handle: dbStore.id,
    banner: dbStore.bannerUrl,
    products: (dbStore.products || []).map((p: any) => ({
      ...p,
      images: p.imageUrls || []
    }))
  };
}

export function emptyStore(uid: string): Store {
  return {
    id: "",
    userId: uid,
    handle: uid.slice(0, 8),
    name: "My Store",
    creator: "",
    description: "",
    bannerUrl: "",
    banner: "",
    logoUrl: "",
    themeColor: "#dc2626",
    layoutStyle: "card",
    bgTemplate: "sunset",
    products: [],
  };
}

export function newId() {
  return Math.random().toString(36).slice(2, 9);
}

const IMGBB_KEY = "180243595d24120bf44f95066ee4384a";

export async function uploadImage(file: File, maxSizeMB: number = 0.5): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  });
  const form = new FormData();
  form.append("image", compressed);
  
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Upload failed");
  return json.data.url as string;
}

export const storeFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

// ─── Product Collections ───────────────────────────────────────────────

export type ProductCollection = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  productIds: string[];
  shareToken: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];   // populated when fetching by shareToken
  store?: Store;          // populated when fetching by shareToken
};

export async function createCollection(
  storeId: string,
  name: string,
  description: string,
  thumbnailUrl: string,
  productIds: string[]
): Promise<ProductCollection> {
  const res = await fetch(`${API_URL}/api/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeId, name, description, thumbnailUrl, productIds }),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  const data = await res.json();
  return data.collection;
}

export async function getCollections(storeId: string): Promise<ProductCollection[]> {
  const res = await fetch(`${API_URL}/api/collections?storeId=${storeId}`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  const data = await res.json();
  return data.collections || [];
}

export async function deleteCollection(id: string): Promise<void> {
  await fetch(`${API_URL}/api/collections?id=${id}`, { method: 'DELETE' });
}

export async function getCollectionByToken(shareToken: string): Promise<ProductCollection | null> {
  try {
    const res = await fetch(`${API_URL}/api/collections/${shareToken}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.collection) return null;
    // Map products imageUrls → images
    const collection = data.collection;
    if (collection.products) {
      collection.products = collection.products.map((p: any) => ({
        ...p,
        images: p.imageUrls || [],
      }));
    }
    if (collection.store) {
      collection.store = {
        ...collection.store,
        banner: collection.store.bannerUrl,
        products: [],
      };
    }
    return collection;
  } catch {
    return null;
  }
}

