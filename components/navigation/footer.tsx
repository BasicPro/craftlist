import Link from "next/link";
import { CheckSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-t-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CraftList</span>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">
              Shape Your Day, One Task at a Time.
            </p>
          </div>

          {/* Copyright */}
          <div>
            <p className="text-sm text-muted-foreground">
              © 2025 Didac Corbi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
