import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STORE_API_URL || "http://localhost:3002"}/api/store/${handle}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.store) {
      return {
        title: data.store.name,
        description: data.store.description || `Check out ${data.store.name} on Loomingo!`,
        openGraph: {
          title: data.store.name,
          description: data.store.description || `Check out ${data.store.name} on Loomingo!`,
          images: data.store.logoUrl ? [data.store.logoUrl] : ["/icon.png"],
        },
        twitter: {
          card: "summary", // forces small thumbnail
          title: data.store.name,
          description: data.store.description || `Check out ${data.store.name} on Loomingo!`,
          images: data.store.logoUrl ? [data.store.logoUrl] : ["/icon.png"],
        }
      };
    }
  } catch (e) {}

  return {
    title: "Store Not Found",
  };
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
