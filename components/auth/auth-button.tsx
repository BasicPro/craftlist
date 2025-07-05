"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/lib/supabase/types";
import { UserAccountDropdown } from "./user-account-dropdown";

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    router.push("/auth/login");
    setIsLoading(false);
  };

  if (user) {
    return <UserAccountDropdown user={user} />;
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
