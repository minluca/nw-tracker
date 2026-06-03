"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Navigation items defined statically — update here to add/remove routes
const navItems = [
  { href: "/", label: "Home", icon: "ti-home" },
  { href: "/analytics", label: "Analisi", icon: "ti-chart-bar" },
  { href: "/portfolio", label: "Portfolio", icon: "ti-trending-up" },
  { href: "/settings", label: "Impostazioni", icon: "ti-settings" },
];

/**
 * Fixed bottom navigation bar, present on all pages.
 * Active item is highlighted based on the current pathname.
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg border-t border-gray-200 bg-white/95 backdrop-blur-sm flex justify-around items-center h-16">
      {" "}
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center gap-1 text-xs text-gray-400",
            pathname === item.href && "text-black font-medium",
          )}
        >
          <i className={`ti ${item.icon} text-xl`} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
