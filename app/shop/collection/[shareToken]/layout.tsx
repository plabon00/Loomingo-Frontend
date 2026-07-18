import { Metadata } from "next";
import { API_URL } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ shareToken: string }> }): Promise<Metadata> {
  const { shareToken } = await params;

  try {
    const res = await fetch(`${API_URL}/api/collections/${shareToken}`, { cache: 'no-store' });
    const data = await res.json();

    if (data.collection) {
      const storeName = data.collection.store?.name || "Store";
      const productCount = data.collection.products?.length || 0;

      return {
        title: `${data.collection.name} — ${storeName} | Loomingo`,
        description: data.collection.description || `A curated collection of ${productCount} products from ${storeName}`,
        openGraph: {
          title: `${data.collection.name} — ${storeName}`,
          description: data.collection.description || `A curated collection of ${productCount} products from ${storeName}`,
          images: data.collection.store?.logoUrl
            ? [{ url: data.collection.store.logoUrl, width: 256, height: 256 }]
            : [{ url: "https://loomingo.vercel.app/icon.png", width: 256, height: 256 }],
        },
        twitter: {
          card: "summary",
          title: `${data.collection.name} — ${storeName}`,
          description: data.collection.description || `A curated collection of ${productCount} products from ${storeName}`,
          images: [data.collection.store?.logoUrl || "https://loomingo.vercel.app/icon.png"],
        },
      };
    }
  } catch (e) {}

  return {
    title: "Collection Not Found | Loomingo",
  };
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
