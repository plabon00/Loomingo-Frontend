import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store-Loomingo",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
