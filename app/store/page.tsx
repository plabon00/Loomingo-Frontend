"use client";

import { useEffect, useState, useOptimistic, startTransition, useRef, useCallback } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { StoreHeader } from "@/components/features/store/StoreHeader";
import ProductGrid from "@/components/features/store/ProductGrid";
import { CollectionList } from "@/components/features/store/CollectionList";
import { GridBackground } from "@/components/ui/grid-background";
import { StoreDetailsModal } from "@/components/modals/store-details-modal";
import { ProductModal } from "@/components/modals/product-modal";
import { CreateCollectionModal } from "@/components/modals/create-collection-modal";
import { Store, Product, ProductCollection, API_URL, storeFetcher, mapStoreFromDB, emptyStore } from "@/lib/store";
import { addProductAction, deleteProductAction, saveStoreAction, createCollectionAction, getCollectionsAction, deleteCollectionAction } from "@/app/actions/store";
import { Loader2, ChevronDown, Trash2, PencilLine, CheckSquare, X, FolderOpen, PackagePlus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useSWR from "swr";
import { Footer } from "@/components/layout/Footer";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

type OptimisticAction = { action: 'add' | 'edit' | 'delete', product: Product };

// Tab type for switching between products and collections
type StoreTab = "products" | "collections";



function ResponsiveCategories({ categories, activeCategory, setActiveCategory, themeColor }: { categories: string[], activeCategory: string, setActiveCategory: (c: string) => void, themeColor: string }) {
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      const containerWidth = container.parentElement?.offsetWidth || container.offsetWidth;

      // Calculate total width if all tabs were rendered
      let totalWidth = 0;
      const childWidths = children.map(child => {
        if (child.hasAttribute('data-more-btn')) return 0;
        return child.offsetWidth + 6; // width + gap (gap-1.5 = 6px)
      });
      totalWidth = childWidths.reduce((a, b) => a + b, 0) - 6; // subtract last gap

      if (totalWidth <= containerWidth) {
        // Everything fits perfectly, no need for dropdown
        setVisibleCount(categories.length);
        return;
      }

      // If not everything fits, calculate how many fit WITH the more button
      let width = 0;
      let count = 0;
      const moreButtonWidth = 46 + 6; // button width + gap

      for (let i = 0; i < children.length; i++) {
        if (children[i].hasAttribute('data-more-btn')) continue;

        const nextWidth = width + childWidths[i];
        if (nextWidth + moreButtonWidth > containerWidth) {
          break;
        }
        width = nextWidth;
        count++;
      }
      setVisibleCount(Math.max(1, count));
    };

    update();
    window.addEventListener('resize', update);

    // Also use MutationObserver just in case font loads change widths
    const observer = new MutationObserver(update);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true, characterData: true });
    }

    return () => {
      window.removeEventListener('resize', update);
      observer.disconnect();
    }
  }, [categories]);

  const visibleCategories = categories.slice(0, visibleCount);
  const hiddenCategories = categories.slice(visibleCount);

  return (
    <div className="mb-6 relative w-full overflow-hidden">
      {/* Invisible full render for measurement */}
      <div ref={containerRef} className="absolute opacity-0 pointer-events-none flex gap-1.5 w-max" aria-hidden="true">
        {categories.map(c => (
           <button key={c} className="px-3.5 py-1.5 rounded-full text-[11px] md:text-xs font-medium border whitespace-nowrap">{c}</button>
        ))}
      </div>

      <div className="flex gap-1.5 items-center w-full">
        <div className="flex gap-1.5 items-center flex-nowrap overflow-hidden">
          {visibleCategories.map(c => {
            const isActive = activeCategory === c;
            return (
              <button
                key={c as string}
                onClick={() => setActiveCategory(c as string)}
                className={`relative px-3.5 py-1.5 rounded-full text-[11px] md:text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${isActive ? "text-white" : "text-zinc-600 hover:text-zinc-950"}`}
              >
                {/* Sliding active pill */}
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full shadow-sm"
                    style={{ backgroundColor: themeColor || '#dc2626' }}
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-white border border-zinc-950/10" aria-hidden="true" />
                )}
                <span className="relative z-10">{c as string}</span>
              </button>
            );
          })}
        </div>

        {hiddenCategories.length > 0 && (
          <div className="ml-auto flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-more-btn className="h-[28px] w-[28px] md:h-[32px] md:w-[32px] rounded-full bg-white text-zinc-700 border border-zinc-950/10 shadow-sm flex items-center justify-center hover:border-zinc-950/30 transition-colors cursor-pointer" aria-label="More categories">
                   <ChevronDown className="size-3.5 md:size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[100] max-h-[350px] overflow-y-auto rounded-2xl bg-white border border-zinc-950/10 shadow-[0_16px_40px_-12px_rgb(0,0,0,0.2)] p-1.5">
                {hiddenCategories.map(c => (
                  <DropdownMenuItem
                    key={c as string}
                    onClick={() => setActiveCategory(c as string)}
                    className={`cursor-pointer rounded-xl px-3.5 py-2.5 mb-0.5 last:mb-0 transition-colors font-medium ${activeCategory === c ? "text-white" : "text-zinc-700 hover:bg-zinc-100"}`}
                    style={activeCategory === c ? { backgroundColor: themeColor || '#dc2626' } : undefined}
                  >
                    {c as string}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

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

  // ─── Collections state ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<StoreTab>("products");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [collectionsLoaded, setCollectionsLoaded] = useState(false);

  const store = rawData?.store
    ? mapStoreFromDB(rawData.store)
    : user
      ? emptyStore(user.uid)
      : null;

  // Load collections when store is available
  useEffect(() => {
    if (store?.id && !collectionsLoaded) {
      getCollectionsAction(store.id).then((result) => {
        if (result.success) {
          setCollections(result.collections);
        }
        setCollectionsLoaded(true);
      });
    }
  }, [store?.id, collectionsLoaded]);

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

  // ─── Selection helpers ─────────────────────────────────────────────
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleExitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds([]);
  }, []);

  const handleCreateCollection = useCallback(async (name: string, description: string, thumbnailUrl: string): Promise<string | null> => {
    if (!store) return null;
    const result = await createCollectionAction(store.id, name, description, thumbnailUrl, selectedIds);
    if (result.success && result.collection) {
      toast.success("Collection created!");
      setCollections(prev => [result.collection, ...prev]);
      handleExitSelectionMode();
      return result.collection.shareToken;
    } else {
      toast.error("Failed to create collection");
      return null;
    }
  }, [store, selectedIds, handleExitSelectionMode]);

  const handleDeleteCollection = useCallback(async (id: string) => {
    const result = await deleteCollectionAction(id);
    if (result.success) {
      setCollections(prev => prev.filter(c => c.id !== id));
      toast.success("Collection deleted");
    } else {
      toast.error("Failed to delete collection");
    }
  }, []);

  if (isLoading || !store || !user) {
    return (
      <div className="flex h-screen flex-col gap-3 items-center justify-center bg-white text-zinc-900">
        <Loader2 className="size-7 animate-spin text-zinc-300" />
        <p className="font-editorial text-zinc-400 text-lg">setting up your shop…</p>
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
    const result = await addProductAction(store.id, store.handle || store.id, product);

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

    const result = await deleteProductAction(store.handle || store.id, product.id);

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

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ─── Tab Bar + Selection Controls ────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            {/* Products / Collections tabs */}
            <div className="flex bg-white rounded-xl border border-zinc-950/10 p-1 shadow-sm">
              <button
                onClick={() => { setActiveTab("products"); handleExitSelectionMode(); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "products"
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => { setActiveTab("collections"); handleExitSelectionMode(); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "collections"
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <FolderOpen className="size-3.5" />
                Collections
                {collections.length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "collections"
                      ? "bg-white/20 text-white"
                      : "bg-zinc-200 text-zinc-600"
                  }`}>
                    {collections.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Selection mode toggle — only visible on products tab */}
          {activeTab === "products" && (
            <div className="flex items-center gap-2">
              {selectionMode ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm font-semibold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200">
                    {selectedIds.length} selected
                  </span>
                  <button
                    onClick={handleExitSelectionMode}
                    className="h-9 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="size-3.5" />
                    Cancel
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setSelectionMode(true)}
                  className="h-9 px-4 rounded-lg bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold flex items-center gap-2 hover:border-zinc-400 transition-colors cursor-pointer shadow-sm"
                >
                  <CheckSquare className="size-4" />
                  <span className="hidden sm:inline">Select Products</span>
                  <span className="sm:hidden">Select</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ─── Products Tab ───────────────────────────────────────── */}
        {activeTab === "products" && (
          <>
            {/* Section header */}
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                The Shelf
                <span className="font-editorial font-normal text-zinc-400 text-base sm:text-lg ml-2">
                  {optimisticProducts.length === 0
                    ? "— waiting for its first product"
                    : `— ${optimisticProducts.length} ${optimisticProducts.length === 1 ? "item" : "items"} on display`}
                </span>
              </h2>
            </div>

            <ResponsiveCategories
              categories={categories as string[]}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              themeColor={store.themeColor || '#dc2626'}
            />

            <ProductGrid
              products={filteredProducts}
              onEdit={selectionMode ? undefined : (p) => setConfirmAction({ type: 'edit', product: p })}
              onDelete={selectionMode ? undefined : (id) => {
                const p = store.products.find(x => x.id === id);
                if (p) setConfirmAction({ type: 'delete', product: p });
              }}
              onAddProduct={selectionMode ? undefined : () => setIsAddingProduct(true)}
              themeColor={store.themeColor}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
            />
          </>
        )}

        {/* ─── Collections Tab ────────────────────────────────────── */}
        {activeTab === "collections" && (
          <>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                Your Collections
                <span className="font-editorial font-normal text-zinc-400 text-base sm:text-lg ml-2">
                  — {collections.length} {collections.length === 1 ? "collection" : "collections"}
                </span>
              </h2>
            </div>

            <CollectionList
              collections={collections}
              onDelete={handleDeleteCollection}
              themeColor={store.themeColor}
            />
          </>
        )}
      </main>

      {/* ─── Floating Action Bar (selection mode) ─────────────────── */}
      <AnimatePresence>
        {selectionMode && selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] md:left-[calc(50%+8rem)] w-[calc(100%-2rem)] max-w-md"
          >
            <div className="bg-zinc-950 rounded-2xl shadow-xl border border-white/10 px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 shrink-0 rounded-xl bg-violet-600 flex items-center justify-center">
                  <PackagePlus className="size-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} selected</p>
                  <p className="text-zinc-400 text-xs">Ready to bundle</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateCollection(true)}
                className="shrink-0 h-10 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                Create
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {showCreateCollection && (
        <CreateCollectionModal
          selectedCount={selectedIds.length}
          onClose={() => setShowCreateCollection(false)}
          onSubmit={handleCreateCollection}
        />
      )}

      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="bg-white rounded-2xl shadow-[0_24px_60px_-16px_rgb(0,0,0,0.35)] p-6 max-w-sm w-full text-center border border-zinc-950/10"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-label={confirmAction.type === 'delete' ? 'Confirm delete product' : 'Confirm edit product'}
            >
              <div className={`mx-auto size-12 rounded-full flex items-center justify-center mb-4 ${confirmAction.type === 'delete' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-700'}`}>
                {confirmAction.type === 'delete' ? <Trash2 className="size-5" /> : <PencilLine className="size-5" />}
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-1.5">
                {confirmAction.type === 'delete' ? `Remove "${confirmAction.product.name}"?` : `Edit "${confirmAction.product.name}"?`}
              </h3>
              <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
                {confirmAction.type === 'delete'
                  ? 'This takes it off your shelf for good — it cannot be undone.'
                  : 'You are about to update the details of this product.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors duration-200 cursor-pointer active:scale-[0.98]"
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
                  className={`flex-1 h-11 rounded-xl font-semibold text-sm text-white transition-colors duration-200 cursor-pointer active:scale-[0.98] ${confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-950 hover:bg-zinc-800'}`}
                >
                  {confirmAction.type === 'delete' ? 'Yes, Remove' : 'Yes, Edit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GridBackground>
  );
}
