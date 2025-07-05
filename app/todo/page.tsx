"use client";

import { useEffect, useState, useCallback } from "react";
import { TodoList, TodoItem } from "@/lib/supabase/types";
import { TodoListCard } from "@/components/todos/todo-list-card";
import { CreateTodoList } from "@/components/todos/create-todo-list";
import {
  createTodoList,
  updateTodoList,
  deleteTodoList,
  getTodoLists,
  getTodoItems,
} from "@/lib/supabase/database";
import { realtimeManager } from "@/lib/supabase/realtime";
import { useRouter } from "next/navigation";

export default function TodoListsPage() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [todoItems, setTodoItems] = useState<Record<string, TodoItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadTodoLists = useCallback(async () => {
    try {
      setError(null);
      const lists = await getTodoLists();
      setTodoLists(lists);

      // Load items for each list
      const itemsMap: Record<string, TodoItem[]> = {};
      for (const list of lists) {
        const items = await getTodoItems(list.id);
        itemsMap[list.id] = items;
      }
      setTodoItems(itemsMap);
    } catch (error) {
      console.error("Failed to load todo lists:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      setError("Failed to load todo lists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadTodoLists();

    // Subscribe to real-time updates
    const unsubscribeLists = realtimeManager.subscribeToTodoLists(
      async (payload) => {
        console.log("Todo lists change received:", payload);
        await loadTodoLists();
      }
    );

    const unsubscribeItems = realtimeManager.subscribeToAllTodoItems(
      async (payload) => {
        console.log("Todo items change received:", payload);
        await loadTodoLists();
      }
    );

    return () => {
      unsubscribeLists();
      unsubscribeItems();
    };
  }, [loadTodoLists]);

  const handleCreateList = async (name: string) => {
    try {
      setError(null);
      await createTodoList({ name });
    } catch (error) {
      console.error("Failed to create todo list:", error);
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

  const handleUpdateList = async (id: string, name: string) => {
    try {
      setError(null);
      await updateTodoList(id, { name });
    } catch (error) {
      console.error("Failed to update todo list:", error);
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

  const handleDeleteList = async (id: string) => {
    try {
      setError(null);
      await deleteTodoList(id);
    } catch (error) {
      console.error("Failed to delete todo list:", error);
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

  const handleListClick = (listId: string) => {
    router.push(`/todo/${listId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Todo Lists</h1>
        <p className="text-muted-foreground">
          Create and manage your todo lists
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateTodoList onCreate={handleCreateList} />

        {todoLists.map((list) => (
          <TodoListCard
            key={list.id}
            todoList={list}
            itemCount={todoItems[list.id]?.length || 0}
            onUpdate={handleUpdateList}
            onDelete={handleDeleteList}
            onClick={() => handleListClick(list.id)}
          />
        ))}
      </div>

      {todoLists.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No todo lists yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first todo list to get started!
          </p>
        </div>
      )}
    </div>
  );
}
