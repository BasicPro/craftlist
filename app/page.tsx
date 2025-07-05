"use client";

import { Button } from "@/components/ui/button";
import { CheckSquare, RefreshCw, FolderOpen, TrendingUp } from "lucide-react";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlexContainer, CardGrid } from "@/components/ui/layout";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("User is authenticated, redirecting to /todo");
        router.push("/todo");
      } else {
        console.log("User not authenticated, redirecting to /auth/login");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FlexContainer
      direction="col"
      align="center"
      className="flex-1 w-full mt-12"
    >
      <FlexContainer
        direction="col"
        gap="8"
        className="flex-1 max-w-7xl p-5"
        align="center"
      >
        <div className="text-center">
          <FlexContainer justify="center" className="mb-6">
            <CheckSquare className="h-16 w-16 text-primary" />
          </FlexContainer>
          <h1 className="text-4xl font-bold mb-4">Welcome to CraftList</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Organize your tasks with real-time collaboration
          </p>
          {hasEnvVars && (
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Started"}
            </Button>
          )}
        </div>
        <FlexContainer direction="col" gap="6" className="px-4">
          <CardGrid>
            <div className="text-center p-6 rounded-lg border">
              <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Sync</h3>
              <p className="text-sm text-muted-foreground">
                Changes appear instantly across all your devices
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border">
              <FolderOpen className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Organize Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Create multiple lists and organize tasks by project
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor completion status and track your productivity
              </p>
            </div>
          </CardGrid>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}
