"use client";

import { useState } from "react";
import { StoreHeader } from "@/components/features/store/StoreHeader";
import ProductGrid from "@/components/features/store/ProductGrid";
import { MobileNavbar, BottomDock, DesktopSidebar } from "@/components/layout/AppNavigation";
import { useAuthUser } from "@/hooks/use-auth-user";
import { GridBackground } from "@/components/ui/grid-background";
import { Store, BG_TEMPLATES } from "@/lib/store";

export function StorefrontClient({ store }: { store: Store }) {
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const inApp = !isAuthLoading && !!user;
  const [activeCategory, setActiveCategory] = useState("All");
  const isFlat = store.layoutStyle === "flat";
  const flatBg = BG_TEMPLATES[store.bgTemplate || "sunset"]?.page;

  const allCategories = store.products.flatMap(p => p.category ? p.category.split(",").map(s => s.trim()) : []);
  const uniqueCategories = Array.from(new Set(allCategories.filter(Boolean)));
  const hasOthers = uniqueCategories.includes("Others");
  const categories = [
    "All", 
    ...uniqueCategories.filter(c => c !== "Others"), 
    ...(hasOthers ? ["Others"] : [])
  ];
  
  const filteredProducts = activeCategory === "All" 
    ? store.products 
    : store.products.filter(p => p.category && p.category.split(",").map(s => s.trim()).includes(activeCategory));

  const shell = `${inApp ? "pt-[calc(3.5rem+var(--promo-h,0px))] md:pt-[calc(3rem+var(--promo-h,0px))] pb-20 md:pb-0" : "pb-0"}`;

  const content = (
    <>
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
            variant={isFlat ? "flat" : "card"}
          />
        )}
      </main>
    </>
  );

  // Flat look: clean gradient backdrop from the chosen template, no grid texture.
  if (isFlat) {
    return (
      <div className={`min-h-screen ${shell}`} style={{ background: flatBg }}>
        {content}
      </div>
    );
  }

  return (
    <GridBackground themeColor={store.themeColor} className={`bg-zinc-200 ${shell}`}>
      {content}
    </GridBackground>
  );
}
