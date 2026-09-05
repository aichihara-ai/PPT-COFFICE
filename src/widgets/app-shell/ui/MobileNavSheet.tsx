"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";

import { routeMeta } from "@/shared/config";
import { cn } from "@/shared/lib/cn";
import { useDarkMode } from "@/widgets/app-shell/ui/use-dark-mode";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ppt/luminis";

export function MobileNavSheet() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isDark, toggle } = useDarkMode();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle>Office Hub</SheetTitle>
          <SheetDescription>Go to a page</SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Office pages"
          className="flex flex-col gap-1 px-4 pb-4"
        >
          {Object.values(routeMeta).map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted/70"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {route.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={toggle}
            className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/70"
          >
            {isDark ? (
              <Sun className="size-4 shrink-0" aria-hidden />
            ) : (
              <Moon className="size-4 shrink-0" aria-hidden />
            )}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
