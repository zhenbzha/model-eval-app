"use client";

import { ClipboardList, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PageNav() {
  const pathname = usePathname();

  return (
    <div className="px-8 pt-6">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm h-12 rounded-lg inline-flex p-1">
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 px-6 rounded-md text-base transition-colors",
            pathname === "/"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <ClipboardList className="w-4 h-4" />
          Evaluate
        </Link>
        <Link
          href="/statistics"
          className={cn(
            "inline-flex items-center gap-2 px-6 rounded-md text-base transition-colors",
            pathname === "/statistics"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <BarChart3 className="w-4 h-4" />
          Statistics
        </Link>
      </div>
    </div>
  );
}
