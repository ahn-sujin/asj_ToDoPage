export interface TodoData {
  id: string;
  todo: string;
}

export interface BoardData {
  id: string;
  title: string;
  todos: TodoData[];
}
