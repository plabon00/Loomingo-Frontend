import { getCollectionByTokenAction } from "@/app/actions/store";
import { CollectionViewClient } from "./CollectionViewClient";

export default async function CollectionPage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const collection = await getCollectionByTokenAction(shareToken);

  if (!collection) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-zinc-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="size-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
            <svg className="size-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Collection Not Found</h1>
          <p className="text-zinc-500 max-w-sm">This collection doesn&apos;t exist or has been removed by its creator.</p>
        </div>
      </div>
    );
  }

  return <CollectionViewClient collection={collection} />;
}
