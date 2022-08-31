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
completedArray = localStorageHandleObject.getItem("completedTodo");

const setUniqueClassname = (str) => {
  // a gondot az okozza, hogy egyedi classname kellene, de a user bármit megadhat
  // az input mezőben, olyan karaktereket is, ami nem használható classname-nek
  const pattern = /[a-zA-Z]/;
  str =
    (str[0].match(pattern) ? str[0] : "a") +
    str.length +
    (str[str.length - 2].match(pattern) ? str[str.length - 2] : "b");
  console.log("str: ", str);
  return str;
};

const setNewTodoTemplate = (task, string) => {
  let task1 = setUniqueClassname(task);
  return `<div class="task">
  <input type="checkbox" class="checkbox ${
    "checkbox" + task1
  }" name="task"><label class="task-text" for="task">${task}</label><div class="fa fa-trash-o ${
    task1 + string
  }"></div>
  </div>`;
};

const addTemplateToDOM = (className, template) => {
  document.querySelector(className).insertAdjacentHTML("afterend", template);
};

// Remove todo from DOM
const removeFromDOM = (element) => {
  element.parentNode.remove();
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

let activeTodoCheckBoxes = document.querySelectorAll(
  "div.todo-list__container > div.task > .checkbox"
);
activeTodoCheckBoxes.forEach((item) => (item.checked = false));

let completedTodoCheckBoxes = document.querySelectorAll(
  "div.completed-list__container > div.task > .checkbox"
);
completedTodoCheckBoxes.forEach((item) => (item.checked = true));

// Add a new todo to an array
const addTodo = (arr, element) => {
  arr.unshift(element);
};

// Clear input field
const clearInputField = () => {
  document.querySelector(".input-todo").value = "";
};

const removeTodoFromArray = (toDoName) => {
  todoArray = todoArray.filter(
    (item, index) => index !== todoArray.findIndex((item) => item === toDoName)
  );
};

const removeTodoFromCompletedArray = (toDoName) => {
  completedArray = completedArray.filter(
    (item, index) =>
      index !== completedArray.findIndex((item) => item === toDoName)
  );
};

const removeTodoFromLocalStorage = () => {
  console.log("remove todo");
  console.log("todoarray: ", todoArray);
  console.log("completedArray: ", completedArray);
  // if (activeOrCompleted == "active") {
  todoArray.length > 0
    ? localStorageHandleObject.createItem("activeTodo", todoArray)
    : localStorageHandleObject.removeItem("activeTodo");
  // } else if (activeOrCompleted == "completed") {
  completedArray.length > 0
    ? localStorageHandleObject.createItem("completedTodo", completedArray)
    : localStorageHandleObject.removeItem("completedTodo");
  //}
};

const removeTodoItem = (uniqueClassName) => {
  const todoTrash = document.querySelector("." + uniqueClassName);
  const label = todoTrash.previousSibling.textContent;
  console.log("todoTrash: ", todoTrash);
  console.log("label: ", label);

  removeFromDOM(todoTrash);

  removeTodoFromArray(label);
  removeTodoFromCompletedArray(label);

  removeTodoFromLocalStorage();

  setPendingTodos(todoArray);
  setCompletedTasks(todoArray, completedArray);

  //emptyTodoList();
};

const setInitialTodoListToDOM = () => {
  console.log("setInitialTodoListToDOM");
  todoArray.forEach((item) => {
    addTemplateToDOM(".todo-list", setNewTodoTemplate(item, "active"));
    //console.log("item");
    // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + active) az
    // eseményfigyelőt a törléshez
    document
      .querySelector("." + setUniqueClassname(item) + "active")
      .addEventListener("click", () =>
        removeTodoItem(setUniqueClassname(item) + "active")
      );
    // rárakjuk az eseményfigyelőt a completed státuszba való áttevéshez a
    // checkboxra
    console.log("selected checkbox: ", ".checkbox" + setUniqueClassname(item));
    document
      .querySelector(".checkbox" + setUniqueClassname(item))
      .addEventListener("change", (ev) => {
        if (ev.target.checked) {
          taskDone(".checkbox" + setUniqueClassname(item));
        }
      });
  });
  completedArray.forEach((item) => {
    addTemplateToDOM(".completed-list", setNewTodoTemplate(item, "completed"));
    // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + completed) az
    // eseményfigyelőt a törléshez
    document
      .querySelector("." + setUniqueClassname(item) + "completed")
      .addEventListener("click", () =>
        removeTodoItem(setUniqueClassname(item) + "completed")
      );
  });

  setPendingTodos(todoArray);
  setCompletedTasks(todoArray, completedArray);
};

const taskDone = (uniqueClassName) => {
  let checkBox = document.querySelector(uniqueClassName);
  console.log("activeTodoCheckBox: ", checkBox);
  const label = checkBox.nextSibling.textContent;
  removeFromDOM(checkBox);
  const findItem = todoArray.find((item) => item === label);

  addTemplateToDOM(
    ".completed-list",
    setNewTodoTemplate(findItem, "completed")
  );

  // set the new arrays
  completedArray = completedArray.concat(findItem);

  removeTodoFromCompletedArray(label);

  console.log("label: ", label);
  // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + completed) az
  // eseményfigyelőt a törléshez
  document
    .querySelector("." + setUniqueClassname(label) + "completed")
    .addEventListener("click", () =>
      removeTodoItem(setUniqueClassname(label) + "completed")
    );

  console.log("completedArray: ", completedArray);
  console.log("todoArray: ", todoArray);

  // overwrite the database with the new arrays
  removeTodoFromLocalStorage();
  removeTodoFromLocalStorage();

  setPendingTodos(todoArray);
  setCompletedTasks(todoArray, completedArray);
  activeTodoCheckBoxes = document.querySelectorAll(
    "div.todo-list__container > div.task > .checkbox"
  );
  activeTodoCheckBoxes.forEach((item) => (item.checked = false));

  completedTodoCheckBoxes = document.querySelectorAll(
    "div.completed-list__container > div.task > .checkbox"
  );
  completedTodoCheckBoxes.forEach((item) => (item.checked = true));

  //clearCompletedItem();
  //clearTodoItem();
  //emptyTodoList();
  return activeTodoCheckBoxes, completedTodoCheckBoxes;
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

      addTemplateToDOM(
        ".todo-list",
        setNewTodoTemplate(todoArray[0], "active")
      );
      console.log("todoArray[0]: ", todoArray[0]);
      // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + active) az
      // eseményfigyelőt a törléshez
      document
        .querySelector("." + setUniqueClassname(todoArray[0]) + "active")
        .addEventListener("click", () =>
          removeTodoItem(setUniqueClassname(todoArray[0]) + "active")
        );

      // rárakjuk az eseményfigyelőt a completed státuszba való áttevéshez a
      // checkboxra
      console.log(
        "selected checkbox: ",
        ".checkbox" + setUniqueClassname(todoArray[0])
      );
      document
        .querySelector(".checkbox" + setUniqueClassname(todoArray[0]))
        .addEventListener("change", (ev) => {
          if (ev.target.checked) {
            taskDone(".checkbox" + setUniqueClassname(todoArray[0]));
          }
        });

      clearInputField();
      setPendingTodos(todoArray);
      setCompletedTasks(todoArray, completedArray);
      activeTodoCheckBoxes = document.querySelectorAll(
        "div.todo-list__container > div.task > .checkbox"
      );
      //pendingToCompleted();
      //clearCompletedItem();
      //clearTodoItem();
      //emptyTodoList();
      //return todoCheckboxes;
    }
  });
};

/*
// Add todo from the todo list to the completed list
const taskDone = () => {
  activeTodoCheckBoxes = document.querySelectorAll(
    "div.todo-list__container > div.task > .checkbox"
  );
  console.log("activeTodoCheckBoxes: ", activeTodoCheckBoxes);
  activeTodoCheckBoxes.forEach((checkbox, index) =>
    checkbox.addEventListener("change", (ev) => {
      if (ev.target.checked) {
        const label = checkbox.nextSibling.textContent;
        removeFromDOM(checkbox);

        const findItem = todoArray.find((item) => item === label);

        addTemplateToDOM(
          ".completed-list",
          setNewTodoTemplate(findItem, "completed")
        );

        // set the new arrays
        completedArray = completedArray.concat(findItem);

        removeTodoFromArray(label);

        // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + completed) az
        // eseményfigyelőt a törléshez
        document
          .querySelector("." + label + "completed")
          .addEventListener("click", () => removeTodoItem(label + "completed"));

        //console.log("completedArray: ", completedArray);
        //console.log("todoArray: ", todoArray);

        // overwrite the database with the new arrays
        removeTodoFromLocalStorage();
        removeTodoFromLocalStorage();

        setPendingTodos(todoArray);
        setCompletedTasks(todoArray, completedArray);
        activeTodoCheckBoxes = document.querySelectorAll(
          "div.todo-list__container > div.task > .checkbox"
        );

        completedTodoCheckBoxes = document.querySelectorAll(
          "div.completed-list__container > div.task > .checkbox"
        );
        completedTodoCheckBoxes.forEach((item) => (item.checked = true));

        //clearCompletedItem();
        //clearTodoItem();
        //emptyTodoList();
        return activeTodoCheckBoxes, completedTodoCheckBoxes;
      }
    })
  );
};
*/

setInitialTodoListToDOM();
addNewTodo();
