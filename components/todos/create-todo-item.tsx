"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface CreateTodoItemProps {
  listId: string;
  onCreate: (data: {
    name: string;
    description?: string;
    list_id: string;
  }) => Promise<void>;
}

export function CreateTodoItem({ listId, onCreate }: CreateTodoItemProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        list_id: listId,
      });
      setName("");
      setDescription("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create todo item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <Button
        variant="outline"
        className="w-full border-dashed border-2 hover:border-solid"
        onClick={() => setIsCreating(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Item
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add New Todo Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Enter item name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={isLoading || !name.trim()}>
              Add Item
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
  );
}
