"use strict";

const TIME_OUT_SECONDS = 10;
const url = "https://restcountries.com/v3.1/name/";
let isFetching = false;
let dropped;

//selecting elements
const input = document.querySelector("input");
const dragTarget = document.querySelector(".drag-target");
const spinner = document.querySelector(".spinner");
const dropTarget = document.getElementById("drop-target");
const countryInfosBox = document.querySelector(".country-infos-box");
const container = document.querySelector(".container");
const outputBox = document.querySelector(".output-box");

const outputContainer = document.querySelector(".output-container");

input.addEventListener("change", function (e) {
  dragTarget.textContent = e.target.value;
});

dragTarget.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text", e.target.textContent);
});

dropTarget.addEventListener("dragenter", (e) => e.preventDefault());

dropTarget.addEventListener("dragover", (e) => {
  e.preventDefault();
});

//FETCHING DATA FROM AN API
const createMarkup = function (data) {
  return ` 
  <div class='country-infos '>
  <img src="${data.flags.png}" alt="${data.flags.alt}"class="image" />
  <h3>welcome to: ${data.name.official}</h3>
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

//function creates an error message and renders this message to the screen
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
    if (!dropped) countryInfosBox.classList.add("hidden");
    countryInfosBox.innerHTML = "";
    this.classList.add("hidden");
    outputBox.style.opacity = 1;
    dropTarget.style.zIndex = 10000;
  });
};

//getting country infos from API
const countryData = async function (name) {
  try {
    isFetching = true;
    if (isFetching) {
      dropTarget.textContent = "Loading...";
    }
    const res = await fetch(`${url}${name}`);

    if (!res.ok)
      throw new Error(
        "Oops 😲! There was an error fetching the data. Invalid input/spelling error"
      );

    const [data] = await res.json();

    countryInfosBox.insertAdjacentHTML("afterbegin", createMarkup(data));
  } catch (err) {
    //HANDLING ERRORS
    dropTarget.style.zIndex = 0;

    //display error message to user
    errorMessage(err);
    container.classList.add("hidden");

    const errorBtn = document.querySelector(".btn-close-error");

    //removes error message
    errorBtn.addEventListener("click", function () {
      document.querySelector(".error").classList.add("hidden");
      container.classList.remove("hidden");
    });
  } finally {
    isFetching = false;
    dropTarget.textContent = "Drop here";
    outputBox.style.opacity = 0.05;
    createCloseBtn();
  }
};

//function implements drop functionality
const handleDrop = function (e) {
  const data = e.dataTransfer.getData("text");

  input.value = "";
  dragTarget.textContent = "";
  dropped = true;
  console.log(dropped);
  if (dropped) countryInfosBox.classList.remove("hidden");

  dropped && countryData(data);
};

dropTarget.addEventListener("drop", handleDrop);
