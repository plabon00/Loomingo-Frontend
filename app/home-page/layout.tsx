import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Loomingo",
  description:
    "Your Loomingo command center. Manage automations, storefront, invoices, and track your growth — all in one place.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
