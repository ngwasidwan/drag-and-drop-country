"use strict";

const TIME_OUT_SECONDS = 10;
const url = "https://restcountries.com/v3.1/name/";
let isFetching = false;
let dropped;
let arrList = [];

//selecting elements
const input = document.querySelector("input");
const dragTarget = document.querySelector(".drag-target");
const spinner = document.querySelector(".spinner");
const dropTarget = document.getElementById("drop-target");
const countryInfosBox = document.querySelector(".country-infos-box");
const container = document.querySelector(".container");
const outputBox = document.querySelector(".output-box");
const historyBtn = document.querySelector(".history-btn");
const searchList = document.querySelector(".search-list");

const outputContainer = document.querySelector(".output-container");

const addHistoryIcon = document.querySelector(".add-menu");
const removeHistoryIcon = document.querySelector(".remove-menu");
const menuText = document.querySelector(".menu-text");

//functions adds hidden class to selected element
const addHiddenClass = (element) => element.classList.add("hidden");

//function removes hidden class from selected element
const removeHiddenClass = (element) => element.classList.remove("hidden");

//function creates history list
const createList = function (arr, curData) {
  if (!curData) return;

  const markup = `<li class="search-list">
  ${arr.find((el) => el === curData)}
  </li>`;

  searchList.insertAdjacentHTML("afterbegin", markup);
};

input.addEventListener("change", (e) => {
  dragTarget.textContent = e.target.value;
});

//implementing drag and drop events
dragTarget.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text", e.target.textContent);
});

dropTarget.addEventListener("dragenter", (e) => {
  e.preventDefault();
});

dropTarget.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropTarget.addEventListener("drop", (e) => {
  const historyData = e.dataTransfer.getData("text");
  arrList.push(historyData);
  createList(arrList, historyData);

  searchList.style.opacity = 0;
});

//DISPLAYING FETCHED DATA TO THE UI
const createMarkup = function (data) {
  return ` 
  <div class='country-infos '>
  <img src="${data.flags.png}" alt="${data.flags.alt}"class="image" />
  <h3>Country Name: ${data.name.official}</h3>
  <h5>🌎Continent: <em>${data.continents}</em></h5>
  <h5>🌆Capital City: <em>${data.capital[0]}</em></h5>
  <h5>🪙Currency:<em> ${Object.values(data.currencies)[0].name}</em></h5>
  <h5 class='special'>Languages:<em> ${Object.values(data.languages).join(
    " / "
  )}</em></h5>

  <h5 class='special'>Borders: <em>${data.borders}</em></h5>
  <h5>🧑🏻‍🤝‍🧑🏽Total Population: <em>${(data.population / 1000000).toFixed(
    2
  )} million</em></h5>
</div>`;
};

//function creates an and renders error message to UI
const errorMessage = function (error) {
  const markup = `<div class='error'><span>${error.message} 💥
    </span>
      <button class='btn-close-error'>❌</button>
    </div>`;
  document.body.insertAdjacentHTML("afterbegin", markup);
};

//function creates a close button to remove country infos box
const createCloseBtn = function () {
  const markup = `<button class='close-btn'>close</button>`;

  outputContainer.insertAdjacentHTML("afterbegin", markup);

  const closeBtn = document.querySelector(".close-btn");

  closeBtn.addEventListener("click", function () {
    dropped = false;

    !dropped && addHiddenClass(countryInfosBox);

    countryInfosBox.innerHTML = "";

    addHiddenClass(this);

    outputBox.style.opacity = 1;
    dropTarget.style.zIndex = 10000;
  });
};

//getting country infos from API
const countryData = async function (name) {
  try {
    isFetching = true;
    if (isFetching) dropTarget.textContent = "Loading...";

    const res = await fetch(`${url}${name}`);

    if (!res.ok)
      throw new Error(
        "Oops 😲! There was an error fetching the data. Invalid input/spelling error"
      );

    const [data] = await res.json();

    countryInfosBox.insertAdjacentHTML("afterbegin", createMarkup(data));
  } catch (err) {
    dropTarget.style.zIndex = 0;

    ///////////
    //HANDLING ERRORS///////
    //////////
    //display error message to user
    errorMessage(err);

    //hide container
    addHiddenClass(container);

    const errorBtn = document.querySelector(".btn-close-error");

    //removes error message
    errorBtn.addEventListener("click", function () {
      const err = document.querySelector(".error");
      addHiddenClass(err);

      removeHiddenClass(container);
    });
  } finally {
    isFetching = false;
    dropTarget.textContent = "Drop here";
    outputBox.style.opacity = 0;
    createCloseBtn();
  }
};

//function implements drop functionality
const handleDrop = function (e) {
  const data = e.dataTransfer.getData("text");

  input.value = "";
  dragTarget.textContent = "";
  dropped = true;

  dropped && removeHiddenClass(countryInfosBox);

  dropped && countryData(data);
};

dropTarget.addEventListener("drop", handleDrop);

//implementing search history
const addInvisibleClass = (element) => element.classList.add("invisible");

const removeInvisibleClass = (element) => element.classList.remove("invisible");

historyBtn.addEventListener("click", () => (searchList.style.opacity = 1));

removeHistoryIcon.addEventListener("click", function () {
  this.classList.toggle("invisible");

  searchList.style.opacity = 0;

  this.classList.contains("invisible")
    ? removeInvisibleClass(addHistoryIcon) ||
      historyBtn.classList.remove("scale-effect") ||
      addInvisibleClass(historyBtn)
    : addInvisibleClass(addHistoryIcon) ||
      historyBtn.classList.add("scale-effect") ||
      removeInvisibleClass(historyBtn);

  // if (this.classList.contains("invisible")) {
  //   removeInvisibleClass(addHistoryIcon);
  //   historyBtn.classList.remove("scale-effect");

  //   addInvisibleClass(historyBtn);
  // } else {
  //   addInvisibleClass(addHistoryIcon);

  //   historyBtn.classList.add("scale-effect");

  //   removeInvisibleClass(historyBtn);
  // }
});
