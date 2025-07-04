import {
  todoItems,
  todoInput,
  addTodoBtn,
  backdrop,
  modal,
  modalFormInput,
  cancelBtn,
  modalForm,
  sortSelect,
} from "./selectors";

import { editBtnSvg, deleteBtnSvg } from "./icons";
import { makeBtn, makeElement, getRelativeTime } from "./utils";
import type { Todo, SortFilters } from "./types/Todo";

let todos: Todo[] = [];
let sortedTodos: Todo[] = [];

let id: number = 1;
let editingTodoId: number | null = null;

sortSelect.addEventListener("change", (e: Event) => {
  const target = e.target as HTMLSelectElement;
  console.log(todos);
  sortedTodos = [...todos];

  switch (target.value as SortFilters) {
    case "newest":
      sortedTodos = sortedTodos.sort((a, b) => {
        const aMs = new Date(a.createdAt).getTime();
        const bMs = new Date(b.createdAt).getTime();

        if (aMs < bMs) {
          return 1;
        } else if (aMs > bMs) {
          return -1;
        } else {
          return 0;
        }
      });
      RenderTodos(sortedTodos);
      break;

    case "oldest":
      sortedTodos = sortedTodos.sort((a, b) => {
        const aMs = new Date(a.createdAt).getTime();
        const bMs = new Date(b.createdAt).getTime();

        if (aMs > bMs) {
          return 1;
        } else if (aMs < bMs) {
          return -1;
        } else {
          return 0;
        }
      });
      RenderTodos(sortedTodos);
      break;

    case "az":
      sortedTodos = sortedTodos.sort((a, b) => {
        const aFl = a.title[0].toLowerCase();
        const bFl = b.title[0].toLowerCase();

        if (aFl > bFl) {
          return 1;
        } else if (aFl < bFl) {
          return -1;
        } else {
          return 0;
        }
      });
      RenderTodos(sortedTodos);
      break;

    case "za":
      sortedTodos = sortedTodos.sort((a, b) => {
        const aFl = a.title[0].toLowerCase();
        const bFl = b.title[0].toLowerCase();

        if (aFl < bFl) {
          return 1;
        } else if (aFl > bFl) {
          return -1;
        } else {
          return 0;
        }
      });
      RenderTodos(sortedTodos);
      break;
  }
});

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = todos.find((t) => t.id === editingTodoId);
  if (todo) {
    todo.title = modalFormInput.value;
  }
  editingTodoId = null;
  toggleBackdropAndModal();
  RenderTodos(sortedTodos);
});

function toggleBackdropAndModal() {
  backdrop.classList.toggle("backdrop--active");
  modal.classList.toggle("modal--open");
}

function updateRelativeTimes() {
  document
    .querySelectorAll<HTMLParagraphElement>(".todo__time")
    .forEach((time) => {
      const todo = getTodoById(Number(time.dataset.id));
      if (todo) {
        time.textContent = getRelativeTime(todo.createdAt);
      }
    });
}

function getTodoById(id: number) {
  const item = todos.find((t) => t.id === id);
  return item;
}

function openEditModal(todo: Todo): void {
  toggleBackdropAndModal();
  modalFormInput.value = todo.title;
  editingTodoId = todo.id;
}

function RenderTodos(todosArr: Todo[]) {
  todoItems.innerHTML = "";

  if (todosArr.length === 0) {
    const p = makeElement("p");
    p.textContent = "Nothing to show here";
    p.style.textAlign = "center";
    todoItems.appendChild(p);
    return;
  }

  todosArr.forEach((todo) => {
    const todoItemElem = makeElement("div", "todo__item");

    const titleElem = makeElement("p", "todo__title");
    titleElem.textContent = todo.title;

    const controlsDiv = makeElement("div", "todo__controls");

    const editBtn = makeBtn(editBtnSvg, ["todo__btn", "todo__btn--delete"]);
    editBtn.addEventListener("click", () => {
      openEditModal(todo);
    });

    const delBtn = makeBtn(deleteBtnSvg, ["todo__btn", "todo__btn--delete"]);
    delBtn.addEventListener("click", () => {
      todos = todosArr.filter((t) => t.id !== todo.id);
      RenderTodos(todos);
    });

    const timeElem = makeElement("span", "todo__time");
    timeElem.dataset.id = todo.id.toString();
    timeElem.textContent = getRelativeTime(todo.createdAt);

    // controls
    controlsDiv.append(editBtn, delBtn);

    // Single Todo Item
    todoItemElem.append(titleElem, controlsDiv, timeElem);

    // Todos Container
    todoItems?.appendChild(todoItemElem);
  });
}

function addTodo(title: string) {
  const targetSelect = "oldest" as SortFilters;

  for (const option of sortSelect.options) {
    if (option.value === targetSelect) {
      option.selected = true;
      break;
    }
  }

  todos.push({
    id: id++,
    title,
    isEdit: false,
    createdAt: new Date().toISOString(),
  });
  RenderTodos(todos);
}

addTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const InputValue = todoInput.value.trim();
  if (!InputValue) {
    alert("please enter todo");
    return;
  }
  addTodo(InputValue);
  todoInput.value = "";
});

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleBackdropAndModal();
  editingTodoId = null;
});

backdrop.addEventListener("click", (e) => {
  e.preventDefault();
  toggleBackdropAndModal();
  editingTodoId = null;
});

RenderTodos(todos);

setInterval(() => {
  updateRelativeTimes();
}, 1000);
