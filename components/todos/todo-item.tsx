"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, Check, X, ChevronDown } from "lucide-react";
import { TodoItem, TodoStatus } from "@/lib/supabase/types";

interface TodoItemProps {
  item: TodoItem;
  onUpdate: (
    id: string,
    data: { name?: string; description?: string; status?: TodoStatus }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  inProgress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const statusLabels = {
  pending: "Pending",
  inProgress: "In Progress",
  completed: "Completed",
};

export function TodoItemComponent({ item, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(
    item.description || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editName.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(item.id, {
        name: editName,
        description: editDescription || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(item.id);
    } catch (error) {
      console.error("Failed to delete todo item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: TodoStatus) => {
    setIsLoading(true);
    try {
      await onUpdate(item.id, { status });
    } catch (error) {
      console.error("Failed to update todo item status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = async (checked: boolean) => {
    const newStatus: TodoStatus = checked ? "completed" : "pending";
    await handleStatusChange(newStatus);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditDescription(item.description || "");
    setIsEditing(false);
  };

  return (
    <Card
      className={`transition-all ${
        item.status === "completed" ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdate();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
            />
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdate();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isLoading || !editName.trim()}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={item.status === "completed"}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium ${
                      item.status === "completed"
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {item.name}
                  </h3>
                  {item.description && (
                    <p
                      className={`text-sm text-muted-foreground mt-1 ${
                        item.status === "completed" ? "line-through" : ""
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        className="h-8 px-2"
                      >
                        <Badge className={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("pending")}
                      >
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("inProgress")}
                      >
                        <Badge className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("completed")}
                      >
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
