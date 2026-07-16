"use client";

import { use, useState } from "react";
import { StoreHeader } from "@/components/features/store/StoreHeader";
import ProductGrid from "@/components/features/store/ProductGrid";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { Footer } from "@/components/layout/Footer";
import { useAuthUser } from "@/hooks/use-auth-user";
import { GridBackground } from "@/components/ui/grid-background";
import { API_URL, storeFetcher, mapStoreFromDB } from "@/lib/store";
import { Loader2 } from "lucide-react";
import useSWR from "swr";

export default function StoreDirectLinkPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;
  
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const inApp = !isAuthLoading && !!user;
  const [activeCategory, setActiveCategory] = useState("All");

  // Highly optimized, cached fetching
  const { data: rawData, error, isLoading } = useSWR(
    handle ? `${API_URL}/api/store/${handle}` : null,
    storeFetcher
  );

  const store = rawData?.store ? mapStoreFromDB(rawData.store) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-zinc-900">
        <Loader2 className="size-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-zinc-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Store Not Found</h1>
          <p className="text-zinc-500">This store doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(store.products.map(p => p.category).filter((p): p is string => Boolean(p))))];
  const filteredProducts = activeCategory === "All" ? store.products : store.products.filter(p => p.category === activeCategory);

  return (
    <GridBackground themeColor={store.themeColor} className={`bg-zinc-200 ${inApp ? "pt-14 md:pt-0 pb-20 md:pb-0 md:pl-64" : "pb-0"}`}>
      {inApp && (
        <>
          <MobileNavbar />
          <DesktopSidebar />
          <BottomDock />
        </>
      )}
      
      <StoreHeader store={store} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category 
                  ? "bg-zinc-900 text-white" 
                  : "bg-white/50 text-zinc-600 hover:bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur rounded-3xl border border-zinc-100 shadow-sm">
            <p className="text-zinc-500 font-medium">No products available in this category.</p>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            themeColor={store.themeColor}
          />
        )}
      </main>
    </GridBackground>
  );
}
