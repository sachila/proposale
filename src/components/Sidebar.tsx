"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "AI Proposal" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/product-insights", label: "Product Insights" },
  { href: "/roast", label: "Roast" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-black/8 bg-zinc-50 p-4 dark:border-white/[.145] dark:bg-zinc-950">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Proposale
      </p>
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-zinc-700 hover:bg-black/4 dark:text-zinc-300 dark:hover:bg-white/8"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;
