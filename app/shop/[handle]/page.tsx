import { getStoreByHandleAction } from "@/app/actions/store";
import { StorefrontClient } from "./StorefrontClient";
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const store = await getStoreByHandleAction(resolvedParams.handle);
  
  if (!store) {
    return { title: 'Store Not Found | Loomingo' };
  }

  return {
    title: `${store.name} | Loomingo`,
    description: store.description,
    openGraph: {
      title: store.name,
      description: store.description,
      images: store.bannerUrl ? [store.bannerUrl] : [],
    },
  };
}

export default async function StoreDirectLinkPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const store = await getStoreByHandleAction(resolvedParams.handle);

  if (!store) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-zinc-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Store Not Found</h1>
          <p className="text-zinc-500">This store doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return <StorefrontClient store={store} />;
}
