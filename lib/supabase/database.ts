import { createClient } from "./client";
import {
  TodoList,
  TodoItem,
  CreateTodoListData,
  UpdateTodoListData,
  CreateTodoItemData,
  UpdateTodoItemData,
} from "./types";

// Helper function to get current user from session
async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session?.user) {
    throw new Error("User not authenticated");
  }
  return session.user;
}

// Todo Lists
export async function getTodoLists(): Promise<TodoList[]> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("todo_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTodoList(
  data: CreateTodoListData
): Promise<TodoList> {
  const supabase = createClient();

  const { data: newList, error } = await supabase
    .from("todo_lists")
    .insert({
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return newList;
}

export async function updateTodoList(
  id: string,
  data: UpdateTodoListData
): Promise<TodoList> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { data: updatedList, error } = await supabase
    .from("todo_lists")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return updatedList;
}

export async function deleteTodoList(id: string): Promise<void> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("todo_lists")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

// Todo Items
export async function getTodoItems(listId: string): Promise<TodoItem[]> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("todo_items")
    .select("*")
    .eq("list_id", listId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTodoItem(
  data: CreateTodoItemData
): Promise<TodoItem> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { data: newItem, error } = await supabase
    .from("todo_items")
    .insert({
      ...data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return newItem;
}

export async function updateTodoItem(
  id: string,
  data: UpdateTodoItemData
): Promise<TodoItem> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { data: updatedItem, error } = await supabase
    .from("todo_items")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return updatedItem;
}

export async function deleteTodoItem(id: string): Promise<void> {
  const supabase = createClient();
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("todo_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
