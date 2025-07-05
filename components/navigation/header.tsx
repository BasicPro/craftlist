"use client";

import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { AuthButton } from "../auth/auth-button";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/supabase/types";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <header className="w-full border-b border-b-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <CheckSquare className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">CraftList</span>
            </Link>
          </div>

          {/* Right side - Auth and Theme */}
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {!isLoading && <AuthButton user={user} />}
          </div>
        </div>
      </div>
    </header>
  );
}
