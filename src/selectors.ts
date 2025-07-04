const todoItems = document.querySelector(".todo__items") as HTMLElement;
const todoInput = document.querySelector(".todo__input") as HTMLInputElement;
const addTodoBtn = document.querySelector(
  ".todo__btn--add"
) as HTMLButtonElement;
const backdrop = document.querySelector(".backdrop") as HTMLDivElement;
const modal = document.querySelector(".modal") as HTMLDivElement;
const modalFormInput = document.querySelector(
  ".modal .form__input"
) as HTMLInputElement;
const cancelBtn = document.querySelector(
  ".modal__btns .btn--cancel"
) as HTMLButtonElement;
const modalForm = document.querySelector(".modal__form") as HTMLButtonElement;
const sortSelect = document.querySelector(
  ".todo__sort select"
) as HTMLSelectElement;

export {
  todoItems,
  todoInput,
  addTodoBtn,
  backdrop,
  modal,
  modalFormInput,
  cancelBtn,
  modalForm,
  sortSelect,
};
