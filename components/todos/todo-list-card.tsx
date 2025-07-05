"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { TodoList } from "@/lib/supabase/types";

interface TodoListCardProps {
  todoList: TodoList;
  itemCount: number;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClick: () => void;
}

export function TodoListCard({
  todoList,
  itemCount,
  onUpdate,
  onDelete,
  onClick,
}: TodoListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(todoList.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editName.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(todoList.id, editName);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(todoList.id);
    } catch (error) {
      console.error("Failed to delete todo list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName(todoList.name);
    setIsEditing(false);
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdate();
                  if (e.key === "Escape") handleCancel();
                }}
                autoFocus
                className="flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate();
                }}
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-lg">{todoList.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{itemCount} items</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  disabled={isLoading}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created {new Date(todoList.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
