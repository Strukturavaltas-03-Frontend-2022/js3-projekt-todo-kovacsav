"use strict";

let todoArray = []; // aktív feladatok
let completedArray = []; // befejezett feladatok

// A dátum beállítása
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

// a localstorage kezelő
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

// a gondot az okozza, hogy egyedi classname kellene a checkboxokra és a kukákra,
// amit az input mezőből állítanánk elő,
// de a user bármit megadhat az input mezőben, olyan karaktereket is,
// ami nem használható classname - nek, kicsit trükközünk
const setUniqueClassname = (str) => {
  const pattern = /[a-zA-Z]/;
  str =
    (str[0].match(pattern) ? str[0] : "a") +
    str.length +
    (str[str.length - 2].match(pattern) ? str[str.length - 2] : "b");
  return str;
};

// az új tennivaló template-je
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

// a template hozzáadása a DOM-hoz
const addTemplateToDOM = (className, template) => {
  document.querySelector(className).insertAdjacentHTML("afterend", template);
};

// A tennivaló eltávolítása a DOM-ból
const removeFromDOM = (element) => {
  element.parentNode.remove();
};

// a függőben lévő tennivalók számának beállítása
// ezzel egyidőben a notodo containerről a hide class levétele, visszarakása
// ezzel ellentétesen mozog a button container hide classa
const setPendingTodos = (array) => {
  const pendingTodo = document.querySelector(".pending-items");
  pendingTodo.textContent = `You have ${array.length} pending items`;
  if (todoArray.length === 0) {
    document.querySelector(".notodo__container").classList.remove("hide");
    document.querySelector(".button__container").classList.add("hide");
  } else if (
    !document.querySelector(".notodo__container").classList.contains("hide")
  ) {
    document.querySelector(".notodo__container").classList.add("hide");
    document.querySelector(".button__container").classList.remove("hide");
  }
};

// az elvégzett tennivalók arányának beállítása
const setCompletedTasks = (array1, array2) => {
  const completedTodo = document.querySelector(".completed-items");
  completedTodo.textContent = Number.isNaN(
    array2.length / (array1.length + array2.length)
  )
    ? `Completed tasks: 0%`
    : `Completed tasks: ${Math.round(
        (array2.length / (array1.length + array2.length)) * 100
      )}%`;
};

// Aktív és elvégzett teendők checkboxának alapbeállítása
const setCheckbox = () => {
  let activeTodoCheckBoxes = document.querySelectorAll(
    "div.todo-list__container > div.task > .checkbox"
  );
  activeTodoCheckBoxes.forEach((item) => (item.checked = false));

  let completedTodoCheckBoxes = document.querySelectorAll(
    "div.completed-list__container > div.task > .checkbox"
  );
  completedTodoCheckBoxes.forEach((item) => (item.checked = true));
};

// Új teendő felvétele
const addTodo = (arr, element) => {
  arr.unshift(element);
};

// Beviteli mező törlése
const clearInputField = () => {
  document.querySelector(".input-todo").value = "";
};

// Teendő törlése az aktív teendők tömbjéből
const removeTodoFromArray = (toDoName) => {
  todoArray = todoArray.filter(
    (item, index) => index !== todoArray.findIndex((item) => item === toDoName)
  );
};

// Teendő törlése az elvégzett tendők tömbjéből
const removeTodoFromCompletedArray = (toDoName) => {
  completedArray = completedArray.filter(
    (item, index) =>
      index !== completedArray.findIndex((item) => item === toDoName)
  );
};

// Teendő törlése a localstorage-ból
const removeTodoFromLocalStorage = () => {
  todoArray.length > 0
    ? localStorageHandleObject.createItem("activeTodo", todoArray)
    : localStorageHandleObject.removeItem("activeTodo");

  completedArray.length > 0
    ? localStorageHandleObject.createItem("completedTodo", completedArray)
    : localStorageHandleObject.removeItem("completedTodo");
};

// Teendő törlése
const removeTodoItem = (uniqueClassName) => {
  const todoTrash = document.querySelector("." + uniqueClassName);
  const label = todoTrash.previousSibling.textContent;

  removeFromDOM(todoTrash);

  removeTodoFromArray(label);
  removeTodoFromCompletedArray(label);

  removeTodoFromLocalStorage();

  setPendingTodos(todoArray);
  setCompletedTasks(todoArray, completedArray);

  //emptyTodoList();
};

// Az oldal betöltésekor a localstorage-ben lévő adatok feltöltése
const setInitialTodoListToDOM = () => {
  todoArray.forEach((item) => {
    addTemplateToDOM(".todo-list", setNewTodoTemplate(item, "active"));

    setCheckbox();

    // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + active) az
    // eseményfigyelőt a törléshez
    document
      .querySelector("." + setUniqueClassname(item) + "active")
      .addEventListener("click", () =>
        removeTodoItem(setUniqueClassname(item) + "active")
      );

    // rárakjuk az eseményfigyelőt a completed státuszba való áttevéshez a
    // checkboxra
    document
      .querySelector(".checkbox" + setUniqueClassname(item))
      .addEventListener("change", (ev) => {
        if (ev.target.checked) {
          taskDone(".checkbox" + setUniqueClassname(item));
        }
      });

    // letiltjuk a checkbox-ra való kattintást
    document
      .querySelectorAll("div.completed-list__container > div.task > .checkbox")
      .forEach((item) => (item.disabled = true));
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

// A teendő elvégzésekor, a checkbox bepipálásakor végrehajtandó feladatok
// 1. Az aktív teendők közül törölni kell (DOM, localstorage, tömb)
// 2. Az elvégzett teendők közé föl kell venni (DOM, localstorage, tömb)
// 3. Az elemhez tartozó kuka ikonra rá kell rakni a törlés eseményfigyelőt
// 4. Újra kell számolni az aktív és elvégzett teendőket
const taskDone = (uniqueClassName) => {
  let checkBox = document.querySelector(uniqueClassName);
  const label = checkBox.nextSibling.textContent;

  removeFromDOM(checkBox);
  const findItem = todoArray.find((item) => item === label);

  addTemplateToDOM(
    ".completed-list",
    setNewTodoTemplate(findItem, "completed")
  );

  // letiltjuk a checkbox-ra való kattintást
  document
    .querySelectorAll("div.completed-list__container > div.task > .checkbox")
    .forEach((item) => (item.disabled = true));

  completedArray = completedArray.concat(findItem);

  removeTodoFromArray(label);

  // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + completed) az
  // eseményfigyelőt a törléshez
  document
    .querySelector("." + setUniqueClassname(label) + "completed")
    .addEventListener("click", () =>
      removeTodoItem(setUniqueClassname(label) + "completed")
    );

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
};

// Új teendő fölvétele
// 1. Az aktív teendők közé föl kell venni (DOM, localstorage, tömb)
// 2. Az elemhez tartozó checkbox-ra és kuka ikonra rá kell rakni az eseményfigyelőket
// 3. Törölni kell az input mezőt
// 4. Újra kell számolni az aktív és elvégzett teendőket
const addNewTodo = () => {
  document.querySelector(".plus").addEventListener("click", () => {
    let input = document.querySelector(".input-todo").value;
    if (input !== "") {
      addTodo(todoArray, input);

      localStorageHandleObject.createItem("activeTodo", todoArray);

      addTemplateToDOM(
        ".todo-list",
        setNewTodoTemplate(todoArray[0], "active")
      );

      // rárakjuk a kuka ikonra (aminek egyedi class-a a feladat szövege + active) az
      // eseményfigyelőt a törléshez
      document
        .querySelector("." + setUniqueClassname(todoArray[0]) + "active")
        .addEventListener("click", () =>
          removeTodoItem(setUniqueClassname(todoArray[0]) + "active")
        );

      // rárakjuk az eseményfigyelőt a completed státuszba való áttevéshez a
      // checkboxra
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
    }
  });
};

// show - hide button működése
const showHideBtn = document.querySelector(".show-hide");
const showHide = () => {
  let clickEvent = true;
  showHideBtn.addEventListener("click", () => {
    clickEvent
      ? (document
          .querySelector(".completed-list__container")
          .classList.add("hide"),
        (showHideBtn.textContent = "Show Complete"))
      : (document
          .querySelector(".completed-list__container")
          .classList.remove("hide"),
        (showHideBtn.textContent = "Hide Complete"));
    return (clickEvent = !clickEvent);
  });
};

// clear all button működése
const clearAllBtn = document.querySelector(".clearAll");
const clearAll = () => {
  clearAllBtn.addEventListener("click", () => {
    document
      .querySelectorAll("div.todo-list__container > div.task")
      .forEach((item) => item.remove());
    localStorageHandleObject.removeItem("activeTodo");
    todoArray = [];
    setPendingTodos(todoArray);
    setCompletedTasks(todoArray, completedArray);
  });
};

const start = () => {
  setInitialTodoListToDOM();
  addNewTodo();
  showHide();
  clearAll();
};

start();
