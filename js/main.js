"use strict";

let todoArray = []; // aktív feladatok
let completedArray = []; // befejezett feladatok

// Set date
(function setDate() {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const now = new Date();
  document.querySelector(".weekDay").textContent = weekDays[now.getDay()];
  document.querySelector(".date").textContent = now
    .toLocaleDateString("en-GB")
    .split("/")
    .join("-");
})();

const localStorageHandleObject = {
  createItem(key, value) {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  },
  getItem(key) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return [];
    }
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};

todoArray = localStorageHandleObject.getItem("activeTodo");
completedArray = localStorageHandleObject.getItem("completedTodos");

const setNewTodoTemplate = (task) => {
  return `<div class="task">
  <input type="checkbox" class="checkbox" name="task"><label class="task-text" for="task">${task}</label><div class="fa fa-trash-o"></div>
</div>`;
};

const addTemplateToDOM = (className, template) => {
  document.querySelector(className).insertAdjacentHTML("afterend", template);
};

const setPendingTodos = (array) => {
  const pendingTodo = document.querySelector(".pending-items");
  pendingTodo.textContent = `You have ${array.length} pending items`;
};

const setCompletedTasks = (array1, array2) => {
  const completedTodo = document.querySelector(".completed-items");
  completedTodo.textContent = Number.isNaN(
    array2.length / (array1.length + array2.length)
  )
    ? `Completed tasks: 0%`
    : `Completed tasks: ${
        Math.round(array2.length / (array1.length + array2.length)) * 100
      }%`;
};

const setInitialTodoListToDOM = () => {
  console.log("setInitialTodoListToDOM");
  todoArray.forEach((item) => {
    addTemplateToDOM(".todo-list", setNewTodoTemplate(item));
    console.log("item");
  });
  completedArray.forEach((item) =>
    addTemplateToDOM(".completed-list", setNewTodoTemplate(item))
  );
  setPendingTodos(todoArray);
  setCompletedTasks(todoArray, completedArray);
};

setInitialTodoListToDOM();

// Add a new todo to an array
const addTodo = (arr, element) => {
  arr.unshift(element);
};

// Clear input field
const clearInputField = () => {
  document.querySelector(".input-todo").value = "";
};

// Add new todo to the todo list
const addNewTodo = () => {
  document.querySelector(".plus").addEventListener("click", () => {
    let input = document.querySelector(".input-todo").value;
    if (input !== "") {
      console.log("plus");
      addTodo(todoArray, input);
      //todoArray.forEach((item, index) => setNewTodoTemplate(item));
      localStorageHandleObject.createItem("activeTodo", todoArray);
      addTemplateToDOM(".todo-list", setNewTodoTemplate(todoArray[0]));
      clearInputField();
      //pendingItems(todoArray);
      //completedTasks(todoArray, completedArray);
      //todoCheckboxes = todoContainer.querySelectorAll(".checkbox");
      //pendingToCompleted();
      //clearCompletedItem();
      //clearTodoItem();
      //emptyTodoList();
      //return todoCheckboxes;
    }
  });
};

addNewTodo();
