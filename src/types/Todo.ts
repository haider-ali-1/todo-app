type Todo = {
  id: number;
  title: string;
  isEdit: boolean;
  createdAt: string;
};

type SortFilters = "newest" | "oldest" | "az" | "za";

export type { Todo, SortFilters };
