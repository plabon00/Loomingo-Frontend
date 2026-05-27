import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto-DM",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
