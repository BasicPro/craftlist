import { createClient } from "./client";
import {
  RealtimePostgresChangesPayload,
  default as RealtimeChannel,
} from "@supabase/realtime-js/dist/module/RealtimeChannel";
import { TodoList, TodoItem } from "./types";

class RealtimeManager {
  private supabase = createClient();
  private channels = new Map<string, RealtimeChannel>();
  private todoListListeners = new Set<
    (payload: RealtimePostgresChangesPayload<TodoList>) => void
  >();
  private todoItemListeners = new Map<
    string,
    Set<(payload: RealtimePostgresChangesPayload<TodoItem>) => void>
  >();
  private allTodoItemListeners = new Set<
    (payload: RealtimePostgresChangesPayload<TodoItem>) => void
  >();

  // Subscribe to to-do lists changes
  subscribeToTodoLists(
    callback: (payload: RealtimePostgresChangesPayload<TodoList>) => void
  ) {
    const channelName = "todo_lists_global";

    if (!this.channels.has(channelName)) {
      const channel = this.supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "todo_lists",
          },
          (payload: RealtimePostgresChangesPayload<TodoList>) => {
            console.log("Todo lists change:", payload);
            this.todoListListeners.forEach((cb) => cb(payload));
          }
        )
        .subscribe((status) => {
          console.log("Todo lists subscription status:", status);
        });

      this.channels.set(channelName, channel as unknown as RealtimeChannel);
    }

    this.todoListListeners.add(callback);
    return () => this.todoListListeners.delete(callback);
  }

  // Subscribe to to-do items changes for a specific list
  subscribeToTodoItems(
    listId: string,
    callback: (payload: RealtimePostgresChangesPayload<TodoItem>) => void
  ) {
    const channelName = `todo_items_${listId}`;

    if (!this.channels.has(channelName)) {
      const channel = this.supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "todo_items",
            filter: `list_id=eq.${listId}`,
          },
          (payload: RealtimePostgresChangesPayload<TodoItem>) => {
            console.log(`Todo items change for list ${listId}:`, payload);
            const listeners = this.todoItemListeners.get(listId);
            if (listeners) listeners.forEach((cb) => cb(payload));
          }
        )
        .subscribe((status) => {
          console.log(
            `Todo items subscription status for list ${listId}:`,
            status
          );
        });

      this.channels.set(channelName, channel as unknown as RealtimeChannel);
    }

    if (!this.todoItemListeners.has(listId)) {
      this.todoItemListeners.set(listId, new Set());
    }
    this.todoItemListeners.get(listId)!.add(callback);
    return () => {
      const listeners = this.todoItemListeners.get(listId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.todoItemListeners.delete(listId);
        }
      }
    };
  }

  // Subscribe to to-do items changes globally
  subscribeToAllTodoItems(
    callback: (payload: RealtimePostgresChangesPayload<TodoItem>) => void
  ) {
    const channelName = "todo_items_global";

    if (!this.channels.has(channelName)) {
      const channel = this.supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "todo_items",
          },
          (payload: RealtimePostgresChangesPayload<TodoItem>) => {
            console.log("Todo items change:", payload);
            this.allTodoItemListeners.forEach((cb) => cb(payload));
          }
        )
        .subscribe((status) => {
          console.log("Todo items global subscription status:", status);
        });

      this.channels.set(channelName, channel as unknown as RealtimeChannel);
    }

    this.allTodoItemListeners.add(callback);
    return () => this.allTodoItemListeners.delete(callback);
  }

  // Clean up all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      this.supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.todoListListeners.clear();
    this.todoItemListeners.clear();
    this.allTodoItemListeners.clear();
  }
}

// Export a singleton instance
export const realtimeManager = new RealtimeManager();
