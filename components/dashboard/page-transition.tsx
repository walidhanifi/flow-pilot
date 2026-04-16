"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={cn("motion-safe:animate-page-enter will-change-transform", className)}
    >
      {children}
    </div>
  );
}
