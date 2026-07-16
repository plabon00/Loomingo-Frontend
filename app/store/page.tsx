"use client";

import { useEffect, useState, useOptimistic, startTransition } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { StoreHeader } from "@/components/features/store/StoreHeader";
import ProductGrid from "@/components/features/store/ProductGrid";
import { GridBackground } from "@/components/ui/grid-background";
import { StoreDetailsModal } from "@/components/modals/store-details-modal";
import { ProductModal } from "@/components/modals/product-modal";
import { Store, Product, API_URL, storeFetcher, mapStoreFromDB, emptyStore } from "@/lib/store";
import { addProductAction, deleteProductAction, saveStoreAction } from "@/app/actions/store";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { Footer } from "@/components/layout/Footer";
import { Toaster, toast } from "sonner";

type OptimisticAction = { action: 'add' | 'edit' | 'delete', product: Product };

export default function StoreManagerPage() {
  const { user } = useAuthUser();
  
  // 1. Highly optimized SWR fetching with stale-while-revalidate
  const { data: rawData, error, mutate, isLoading } = useSWR(
    user ? `${API_URL}/api/store?userId=${user.uid}` : null,
    storeFetcher
  );

  const [isEditingStore, setIsEditingStore] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [confirmAction, setConfirmAction] = useState<{ type: 'edit' | 'delete', product: Product } | null>(null);

  const store = rawData?.store 
    ? mapStoreFromDB(rawData.store) 
    : user 
      ? emptyStore(user.uid) 
      : null;

  // 2. React useOptimistic for instant, 0-latency UI updates
  const [optimisticProducts, setOptimisticProducts] = useOptimistic(
    store?.products || [],
    (state, { action, product }: OptimisticAction) => {
      if (action === 'delete') return state.filter(p => p.id !== product.id);
      const exists = state.some(p => p.id === product.id);
      if (exists) return state.map(p => p.id === product.id ? product : p);
      return [...state, product];
    }
  );

  if (isLoading || !store || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-zinc-900">
        <Loader2 className="size-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  const handleSaveStore = async (updated: Store) => {
    setIsEditingStore(false);
    toast.success("Store details updated");
    // Server action handles DB save and cache revalidation
    const result = await saveStoreAction(user.uid, updated);
    if (result.success) {
      mutate({ store: result.store });
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setIsAddingProduct(false);
    setEditingProduct(undefined);
    
    const isEdit = store.products.some(p => p.id === product.id);
    const tempProduct = { ...product, id: product.id || Math.random().toString() };
    
    // 3. Instant Optimistic UI Update (Preserves animations)
    startTransition(() => {
      setOptimisticProducts({ action: isEdit ? 'edit' : 'add', product: tempProduct });
    });

    // 4. Background Server Action
    const result = await addProductAction(store.id, store.handle, product);
    
    if (result.success) {
      toast.success(isEdit ? "Product updated" : "Product added");
      mutate(); // Sync final state
    } else {
      toast.error("Failed to save product");
      mutate(); // Rollback
    }
  };

  const executeDeleteProduct = async (product: Product) => {
    // Optimistic Delete
    startTransition(() => {
      setOptimisticProducts({ action: 'delete', product });
    });
    
    const result = await deleteProductAction(store.handle, product.id);
    
    if (result.success) {
      toast.success("Product deleted");
      mutate();
    } else {
      toast.error("Failed to delete product");
      mutate(); // Rollback
    }
  };

  const allCategories = optimisticProducts.flatMap(p => p.category ? p.category.split(",").map(s => s.trim()) : []);
  const uniqueCategories = Array.from(new Set(allCategories.filter(Boolean)));
  const hasOthers = uniqueCategories.includes("Others");
  const categories = [
    "All", 
    ...uniqueCategories.filter(c => c !== "Others"), 
    ...(hasOthers ? ["Others"] : [])
  ];
  
  const filteredProducts = activeCategory === "All" 
    ? optimisticProducts 
    : optimisticProducts.filter(p => p.category && p.category.split(",").map(s => s.trim()).includes(activeCategory));

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
          onEdit={(p) => setConfirmAction({ type: 'edit', product: p })} 
          onDelete={(id) => {
            const p = store.products.find(x => x.id === id);
            if (p) setConfirmAction({ type: 'delete', product: p });
          }}
          onAddProduct={() => setIsAddingProduct(true)}
          themeColor={store.themeColor}
        />
      </main>

      <Footer />
      <Toaster position="bottom-center" />

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

      {confirmAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 fade-in duration-200 text-center">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {confirmAction.type === 'delete' ? 'Delete Product?' : 'Edit Product?'}
            </h3>
            <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
              {confirmAction.type === 'delete' 
                ? 'Are you sure you want to permanently delete this product? This action cannot be undone.' 
                : 'Are you sure you want to edit the details of this product?'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (confirmAction.type === 'delete') {
                    executeDeleteProduct(confirmAction.product);
                  } else {
                    setEditingProduct(confirmAction.product);
                  }
                  setConfirmAction(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-white transition shadow-sm ${confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {confirmAction.type === 'delete' ? 'Yes, Delete' : 'Yes, Edit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GridBackground>
  );
}