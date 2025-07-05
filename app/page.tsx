import { Button } from "@/components/ui/button";
import { CheckSquare, RefreshCw, FolderOpen, TrendingUp } from "lucide-react";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col mt-12 items-center">
      <div className="flex-1 flex flex-col gap-16 max-w-5xl p-5">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <CheckSquare className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to CraftList</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Organize your tasks with real-time collaboration
          </p>
          {hasEnvVars && (
            <Link href="/todo">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        <main className="flex-1 flex flex-col gap-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </main>
      </div>
    </div>
  );
}
