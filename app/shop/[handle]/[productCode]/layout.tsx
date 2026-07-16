import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ handle: string, productCode: string }> }): Promise<Metadata> {
  const { handle, productCode } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STORE_API_URL || "http://localhost:3002"}/api/store/${handle}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.store) {
      const product = data.store.products.find((p: any) => p.code === productCode || p.id === productCode);
      if (product) {
        return {
          title: `${product.name} | ${data.store.name}`,
          description: product.description || `Buy ${product.name} at ${data.store.name}`,
          openGraph: {
            title: product.name,
            description: product.description || `Buy ${product.name} at ${data.store.name}`,
            images: [
              {
                url: product.imageUrls && product.imageUrls[0] ? product.imageUrls[0] : "https://loomingo.vercel.app/icon.png",
                width: 256,
                height: 256,
              }
            ],
          },
          twitter: {
            card: "summary",
            title: product.name,
            description: product.description || `Buy ${product.name} at ${data.store.name}`,
            images: [product.imageUrls && product.imageUrls[0] ? product.imageUrls[0] : "https://loomingo.vercel.app/icon.png"],
          }
        };
      }
    }
  } catch (e) {}

  return {
    title: "Product Not Found",
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
