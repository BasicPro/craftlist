"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/lib/supabase/types";

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setIsLoading(false);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Hi, {user.email}!</span>
        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? "Loading..." : "Sign Out"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      size="sm"
      className="bg-green-700 hover:bg-green-800"
    >
      {isLoading ? "Loading..." : "Sign In"}
    </Button>
  );
}
