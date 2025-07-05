"use client";

import { useEffect, useState, use, useCallback } from "react";
import { TodoList, TodoItem, TodoStatus } from "@/lib/supabase/types";
import { TodoItemComponent } from "@/components/todos/todo-item";
import { CreateTodoItem } from "@/components/todos/create-todo-item";
import {
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
  getTodoLists,
  getTodoItems,
} from "@/lib/supabase/database";
import { realtimeManager } from "@/lib/supabase/realtime";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PageContainer,
  PageHeader,
  LoadingContainer,
  ErrorContainer,
  EmptyState,
} from "@/components/ui/layout";

interface TodoListPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TodoListPage({ params }: TodoListPageProps) {
  const { id } = use(params);
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadTodoList = useCallback(async () => {
    try {
      setError(null);
      const lists = await getTodoLists();
      const list = lists.find((l) => l.id === id);
      if (!list) {
        router.push("/todo");
        return;
      }
      setTodoList(list);
    } catch (error) {
      console.error("Failed to load to-do list:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      router.push("/todo");
    }
  }, [id, router]);

  const loadTodoItems = useCallback(async () => {
    try {
      setError(null);
      const items = await getTodoItems(id);
      setTodoItems(items);
    } catch (error) {
      console.error("Failed to load to-do items:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      setError("Failed to load to-do items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadTodoList();
    loadTodoItems();

    // Subscribe to real-time updates for this specific list
    const unsubscribeItems = realtimeManager.subscribeToTodoItems(
      id,
      async (payload) => {
        console.log(`Todo items change for list ${id}:`, payload);
        await loadTodoItems();
      }
    );

    const unsubscribeLists = realtimeManager.subscribeToTodoLists(
      async (payload) => {
        console.log("Todo list change received:", payload);
        console.log("Current list ID:", id);
        console.log("Payload new record:", payload.new);
        console.log("Payload old record:", payload.old);

        if (
          payload.eventType === "DELETE" &&
          payload.old &&
          payload.old.id === id
        ) {
          console.log("Current list deleted, redirecting to lists page");
          router.push("/todo");
        } else {
          console.log("Updating current list:", payload.new);
          await loadTodoList();
        }
      }
    );

    return () => {
      unsubscribeItems();
      unsubscribeLists();
    };
  }, [id, loadTodoList, loadTodoItems, router]);

  const handleCreateItem = async (data: {
    name: string;
    description?: string;
    list_id: string;
  }) => {
    try {
      setError(null);
      await createTodoItem(data);
    } catch (error) {
      console.error("Failed to create to-do item:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      throw error;
    }
  };

  const handleUpdateItem = async (
    id: string,
    data: { name?: string; description?: string; status?: TodoStatus }
  ) => {
    try {
      setError(null);
      await updateTodoItem(id, data);
    } catch (error) {
      console.error("Failed to update to-do item:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      throw error;
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      setError(null);

      // Optimistic update - remove item from UI immediately
      setTodoItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );

      // Perform the actual delete
      await deleteTodoItem(itemId);

      // The real-time subscription should handle the update, but we can also reload if needed
      console.log("Item deleted successfully:", itemId);
    } catch (error) {
      console.error("Failed to delete to-do item:", error);

      // Revert optimistic update on error
      await loadTodoItems();

      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      setError("Failed to delete item. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer />
      </PageContainer>
    );
  }

  if (!todoList) {
    return (
      <PageContainer>
        <div className="text-center">
          <p className="text-lg">Todo list not found</p>
          <Button onClick={() => router.push("/todo")} className="mt-4">
            Back to Lists
          </Button>
        </div>
      </PageContainer>
    );
  }

  const completedCount = todoItems.filter(
    (item) => item.status === "completed"
  ).length;
  const totalCount = todoItems.length;

  return (
    <PageContainer>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/todo")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lists
        </Button>

        <PageHeader
          title={todoList.name}
          description={`${completedCount} of ${totalCount} items completed`}
        />
      </div>

      {error && <ErrorContainer message={error} onRetry={loadTodoItems} />}

      <div className="space-y-4">
        <CreateTodoItem listId={id} onCreate={handleCreateItem} />

        {todoItems.map((item) => (
          <TodoItemComponent
            key={item.id}
            item={item}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {todoItems.length === 0 && !error && (
        <EmptyState
          title="No to-do items yet"
          description="Add your first to-do item to get started!"
        />
      )}
    </PageContainer>
  );
}
