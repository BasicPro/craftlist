export type TodoStatus = "pending" | "completed" | "inProgress";

export interface TodoList {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
}

export interface TodoItem {
  id: string;
  user_id: string;
  created_at: string;
  status: TodoStatus;
  name: string;
  description?: string;
  list_id: string;
}

export interface CreateTodoListData {
  name: string;
}

export interface UpdateTodoListData {
  name: string;
}

export interface CreateTodoItemData {
  name: string;
  description?: string;
  list_id: string;
}

export interface UpdateTodoItemData {
  name?: string;
  description?: string;
  status?: TodoStatus;
}
