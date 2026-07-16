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
  products: Product[];
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
      themeColor: store.themeColor 
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
