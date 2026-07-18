"use server";

import { revalidateTag } from "next/cache";
import { API_URL, Store, Product, mapStoreFromDB } from "@/lib/store";

export async function getStoreByHandleAction(handle: string): Promise<Store | null> {
  try {
    const res = await fetch(`${API_URL}/api/store/${handle}`, {
      next: { tags: [`store-${handle}`, "stores"] },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.store ? mapStoreFromDB(data.store) : null;
  } catch (error) {
    console.error("Failed to fetch store:", error);
    return null;
  }
}

export async function addProductAction(storeId: string, storeHandle: string, product: Product) {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, product }),
    });

    if (!res.ok) throw new Error("Failed to add product");
    const data = await res.json();

    const savedProduct = {
      ...data.product,
      images: data.product.imageUrls || [],
    };

    revalidateTag(`store-${storeHandle}`);
    
    return { success: true, product: savedProduct };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false, error: "Failed to add product" };
  }
}

export async function deleteProductAction(storeHandle: string, productId: string) {
  try {
    const res = await fetch(`${API_URL}/api/products?id=${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete product");

    revalidateTag(`store-${storeHandle}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function saveStoreAction(uid: string, store: Store) {
  try {
    const res = await fetch(`${API_URL}/api/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: uid,
        name: store.name,
        creator: store.creator,
        description: store.description,
        bannerUrl: store.banner || store.bannerUrl,
        logoUrl: store.logoUrl,
        themeColor: store.themeColor,
      }),
    });

    if (!res.ok) throw new Error("Failed to save store");
    const data = await res.json();

    const savedStore = mapStoreFromDB({ ...data.store, products: store.products });

    revalidateTag(`store-${savedStore.handle}`);
    
    return { success: true, store: savedStore };
  } catch (error) {
    console.error("Failed to save store:", error);
    return { success: false, error: "Failed to save store" };
  }
}

// ─── Collection Actions ────────────────────────────────────────────────

export async function createCollectionAction(
  storeId: string,
  name: string,
  description: string,
  thumbnailUrl: string,
  productIds: string[]
) {
  try {
    const res = await fetch(`${API_URL}/api/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, name, description, thumbnailUrl, productIds }),
    });

    if (!res.ok) throw new Error("Failed to create collection");
    const data = await res.json();

    return { success: true, collection: data.collection };
  } catch (error) {
    console.error("Failed to create collection:", error);
    return { success: false, error: "Failed to create collection" };
  }
}

export async function getCollectionsAction(storeId: string) {
  try {
    const res = await fetch(`${API_URL}/api/collections?storeId=${storeId}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch collections");
    const data = await res.json();

    return { success: true, collections: data.collections || [] };
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return { success: false, collections: [] };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  try {
    const res = await fetch(`${API_URL}/api/collections?id=${collectionId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete collection");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete collection:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}

export async function getCollectionByTokenAction(shareToken: string) {
  try {
    const res = await fetch(`${API_URL}/api/collections/${shareToken}`, {
      next: { tags: [`collection-${shareToken}`] },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.collection) return null;

    const collection = data.collection;
    // Map products imageUrls → images
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
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return null;
  }
}

