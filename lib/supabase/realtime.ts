import { createClient } from "./client";

class RealtimeManager {
  private supabase = createClient();
  private channels = new Map<string, any>();
  private listeners = new Map<string, Set<Function>>();

  // Subscribe to todo lists changes
  subscribeToTodoLists(callback: (payload: any) => void) {
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
          (payload) => {
            console.log("Todo lists change:", payload);
            this.notifyListeners(channelName, payload);
          }
        )
        .subscribe((status) => {
          console.log("Todo lists subscription status:", status);
        });

      this.channels.set(channelName, channel);
    }

    this.addListener(channelName, callback);
    return () => this.removeListener(channelName, callback);
  }

  // Subscribe to todo items changes for a specific list
  subscribeToTodoItems(listId: string, callback: (payload: any) => void) {
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
          (payload) => {
            console.log(`Todo items change for list ${listId}:`, payload);
            this.notifyListeners(channelName, payload);
          }
        )
        .subscribe((status) => {
          console.log(
            `Todo items subscription status for list ${listId}:`,
            status
          );
        });

      this.channels.set(channelName, channel);
    }

    this.addListener(channelName, callback);
    return () => this.removeListener(channelName, callback);
  }

  // Subscribe to todo items changes globally
  subscribeToAllTodoItems(callback: (payload: any) => void) {
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
          (payload) => {
            console.log("Todo items change:", payload);
            this.notifyListeners(channelName, payload);
          }
        )
        .subscribe((status) => {
          console.log("Todo items global subscription status:", status);
        });

      this.channels.set(channelName, channel);
    }

    this.addListener(channelName, callback);
    return () => this.removeListener(channelName, callback);
  }

  private addListener(channelName: string, callback: Function) {
    if (!this.listeners.has(channelName)) {
      this.listeners.set(channelName, new Set());
    }
    this.listeners.get(channelName)!.add(callback);
  }

  private removeListener(channelName: string, callback: Function) {
    const channelListeners = this.listeners.get(channelName);
    if (channelListeners) {
      channelListeners.delete(callback);

      // If no more listeners for this channel, unsubscribe
      if (channelListeners.size === 0) {
        const channel = this.channels.get(channelName);
        if (channel) {
          this.supabase.removeChannel(channel);
          this.channels.delete(channelName);
        }
        this.listeners.delete(channelName);
      }
    }
  }

  private notifyListeners(channelName: string, payload: any) {
    const channelListeners = this.listeners.get(channelName);
    if (channelListeners) {
      channelListeners.forEach((callback) => callback(payload));
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      this.supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.listeners.clear();
  }
}

// Export a singleton instance
export const realtimeManager = new RealtimeManager();
