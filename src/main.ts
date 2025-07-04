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
let id: number = 1;
let editingTodoId: number | null = null;

function getVisibleTodos(): Todo[] {
  const { value } = sortSelect;
  let sortedTodos = [...todos];

  switch (value as SortFilters) {
    case "newest":
      return sortedTodos.sort(
        (a, b) =>
          +new Date(b.createdAt).getTime() - +new Date(a.createdAt).getTime()
      );

    // haider -> 100030 1
    // maha -> 100050   2

    case "oldest":
      return sortedTodos.sort(
        (a, b) =>
          +new Date(a.createdAt).getTime() - +new Date(b.createdAt).getTime()
      );

    case "az":
      return sortedTodos.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );

    case "za":
      return sortedTodos.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
      );

    default:
      return sortedTodos;
  }
}
const render = () => {
  RenderTodos(getVisibleTodos());
};

sortSelect.addEventListener("change", render);

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = todos.find((t) => t.id === editingTodoId);
  if (todo) {
    todo.title = modalFormInput.value;
  }
  editingTodoId = null;
  toggleBackdropAndModal();
  render();
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

function RenderTodos(todosParam: Todo[]) {
  todoItems.innerHTML = "";

  if (todosParam.length === 0) {
    const p = makeElement("p");
    p.textContent = "Nothing to show here";
    p.style.textAlign = "center";
    todoItems.appendChild(p);
    return;
  }

  todosParam.forEach((todo) => {
    const todoItemElem = makeElement("div", "todo__item");

    const titleElem = makeElement("p", "todo__title");
    titleElem.textContent = todo.title;

    const controlsDiv = makeElement("div", "todo__controls");

    const editBtn = makeBtn(editBtnSvg, ["todo__btn", "todo__btn--edit"]);
    editBtn.addEventListener("click", () => {
      openEditModal(todo);
    });

    const delBtn = makeBtn(deleteBtnSvg, ["todo__btn", "todo__btn--delete"]);
    delBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      render();
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
  sortSelect.value = "oldest";

  todos.push({
    id: id++,
    title,
    isEdit: false,
    createdAt: new Date().toISOString(),
  });
  render();
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

render();

setInterval(() => {
  updateRelativeTimes();
}, 1000);
