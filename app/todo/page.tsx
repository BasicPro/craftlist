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
import {
  PageContainer,
  PageHeader,
  LoadingContainer,
  ErrorContainer,
  CardGrid,
  EmptyState,
} from "@/components/ui/layout";

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
      console.error("Failed to load to-do lists:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.push("/auth/login");
        return;
      }
      setError("Failed to load to-do lists. Please try again.");
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
      console.error("Failed to create to-do list:", error);
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
      console.error("Failed to update to-do list:", error);
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
      console.error("Failed to delete to-do list:", error);
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
      <PageContainer>
        <LoadingContainer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="My Todo Lists"
        description="Create and manage your to-do lists"
      >
        <CreateTodoList onCreate={handleCreateList} />
      </PageHeader>

      {error && <ErrorContainer message={error} onRetry={loadTodoLists} />}

      <CardGrid>
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
      </CardGrid>

      {todoLists.length === 0 && !error && (
        <EmptyState
          title="No to-do lists yet"
          description="Create your first to-do list to get started!"
        />
      )}
    </PageContainer>
  );
}
