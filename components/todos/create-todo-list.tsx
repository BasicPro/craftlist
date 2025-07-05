"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface CreateTodoListProps {
  onCreate: (name: string) => Promise<void>;
}

export function CreateTodoList({ onCreate }: CreateTodoListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(name);
      setName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create to-do list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setIsCreating(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="whitespace-nowrap"
        onClick={() => setIsCreating(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create List
      </Button>

      {isCreating && (
        <div className="absolute top-full right-0 mt-2 z-50 w-80">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Todo List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter list name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") handleCancel();
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreate}
                    disabled={isLoading || !name.trim()}
                  >
                    Create List
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
