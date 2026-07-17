"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransitionState } from "@/components/providers/transition-provider";

interface TransitionLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function TransitionLink({ children, href, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition } = useTransitionState();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // If the user is already on this page, just fire the onClick (e.g. to close a menu) and prevent the reload/animation
    if (pathname === href.toString() || pathname.startsWith(href.toString()) && href.toString() !== "/") {
      if (onClick) onClick(e);
      e.preventDefault();
      return;
    }

    if (onClick) onClick(e);

    // Allow native behavior for new tabs or external logic
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = (e.currentTarget as HTMLAnchorElement).target;
    if (target === "_blank") return;

    e.preventDefault();
    
    // 1. Trigger the splash screen overlay to expand from click coordinates
    startTransition(e.clientX, e.clientY);

    // 2. Wait for 1 second (hold up for a second showing the animation)
    setTimeout(() => {
      router.push(href.toString());
    }, 1000); 
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}
