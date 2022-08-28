"use strict";

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
