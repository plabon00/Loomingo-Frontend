"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { StoreHeader } from "@/components/features/store/StoreHeader";
import ProductGrid from "@/components/features/store/ProductGrid";
import { GridBackground } from "@/components/ui/grid-background";
import { StoreDetailsModal } from "@/components/modals/store-details-modal";
import { ProductModal } from "@/components/modals/product-modal";
import { Store, Product, saveStore, saveProduct, deleteProduct, API_URL, storeFetcher, mapStoreFromDB, emptyStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { Footer } from "@/components/layout/Footer";

export default function StoreManagerPage() {
  const { user } = useAuthUser();
  
  // Use SWR for highly optimized, cached fetching
  const { data: rawData, error, mutate, isLoading } = useSWR(
    user ? `${API_URL}/api/store?userId=${user.uid}` : null,
    storeFetcher
  );

  const [isEditingStore, setIsEditingStore] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Derive store data from SWR cache or fallback to empty
  const store = rawData?.store 
    ? mapStoreFromDB(rawData.store) 
    : user 
      ? emptyStore(user.uid) 
      : null;

  if (isLoading || !store || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-zinc-900">
        <Loader2 className="size-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  const handleSaveStore = async (updated: Store) => {
    try {
      const saved = await saveStore(user.uid, updated);
      // Immediately mutate the SWR cache with new data
      mutate({ store: saved }, false); 
      setIsEditingStore(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      const saved = await saveProduct(store.id, product);
      const isExisting = store.products.some(p => p.id === saved.id);
      
      const newProducts = isExisting 
        ? store.products.map(p => p.id === saved.id ? saved : p)
        : [...store.products, saved];
        
      // Mutate local cache
      mutate({ store: { ...store, products: newProducts } }, false);
      setIsAddingProduct(false);
      setEditingProduct(undefined);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      const newProducts = store.products.filter(p => p.id !== productId);
      // Mutate local cache
      mutate({ store: { ...store, products: newProducts } }, false);
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ["All", ...Array.from(new Set(store.products.map(p => p.category).filter(Boolean)))];
  const filteredProducts = activeCategory === "All" ? store.products : store.products.filter(p => p.category === activeCategory);

  return (
    <GridBackground themeColor={store.themeColor} className="pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64 bg-zinc-200">
      <MobileNavbar />
      <DesktopSidebar />
      <BottomDock />

      <StoreHeader store={store} onEdit={() => setIsEditingStore(true)} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex overflow-x-auto scrollbar-hide gap-2">
          {categories.map(c => (
            <button 
              key={c as string} 
              onClick={() => setActiveCategory(c as string)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shadow-sm ${activeCategory === c ? "text-white" : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200"}`}
              style={activeCategory === c ? { backgroundColor: store.themeColor || '#dc2626' } : undefined}
            >
              {c as string}
            </button>
          ))}
        </div>

        <ProductGrid 
          products={filteredProducts} 
          onEdit={setEditingProduct} 
          onDelete={handleDeleteProduct}
          onAddProduct={() => setIsAddingProduct(true)}
          themeColor={store.themeColor}
        />
      </main>

      <Footer />

      {isEditingStore && (
        <StoreDetailsModal
          store={store}
          onClose={() => setIsEditingStore(false)}
          onSave={handleSaveStore}
        />
      )}

      {(isAddingProduct || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setIsAddingProduct(false);
            setEditingProduct(undefined);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </GridBackground>
  );
}