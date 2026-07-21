import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Manager | Loomingo",
  description: "Create and manage your beautiful digital storefront. Showcase your products with stunning layouts, organize collections, and connect with customers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
