"use strict";

// HTML ELEMENT DECLARATION
const searchTermEl = document.querySelector(".js-search-input");
const searchIcon = document.querySelector(".js-search-icon");
const mainApp = document.querySelector(".app-main");

document.querySelector(".font-tab").addEventListener("click", () => {
  const fontType = document.querySelector(".font-type");

  fontType.classList.toggle("font-type-style");
});

// Toggle Theme (Dark and Light Mode)
const theme = localStorage.getItem("theme");
if (theme === "dark-theme") {
  document.body.classList.add("dark-theme");
} else if (theme === "light-theme") {
  document.body.classList.remove("dark-theme");
}

// Change the Text Content for the font and apply font on the page
document.querySelectorAll(".font").forEach((el) => {
  el.addEventListener("click", function (e) {
    const fontName = document.querySelector(".font-tab span");
    if (e.target.textContent === "Serif") {
      document.body.style.fontFamily = "Lora";
      fontName.textContent = "Serif";
    } else if (e.target.textContent === "San Serif") {
      document.body.style.fontFamily = "Inter";
      fontName.textContent = "San Serif";
    } else if ((e.target.textContent = "Mono")) {
      fontName.textContent = "Mono";
      document.body.style.fontFamily = "Inconsolata";
    }
  });
});

// Fetching Data
async function getTerm(url) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      mainApp.innerHTML = `<div class="unknown-feed">
          <div class="app-unknown-feed">
            <div style="width: 300px">
              <img
                class="unknown-feed-image"
                src="./asset/images/unknown.svg"
                alt="Picture"
              />
            </div>
            <div>
              <p class="unknown-feed-text">
                Sorry pal, we couldn't find definitions for the word you were
                looking for.
              </p>
            </div>
          </div>
        </div>`;
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error(error);
  }
}

// Rendering the Data on the Page

function renderTerm(term) {
  if (term && term.length > 0) {
    const data = term[0];

    const html1 = `
        <div class="dictionary-feed">
          <div class="dictionary-term">
            <div class="word">
              <h1 class="term">${data.word}</h1>
              <p class="term-phonetics">${data.phonetic}</p>
            </div>
            <div class="sound">
              <button class="btn-term-sound">
                <svg
                  stroke="currentColor"
                  fill="white"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="text-light-100 js-play-icon"
                  height="35"
                  width="35"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"
                  ></path>
                  <path
                    d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
      `;

    let html2 = "";
    for (let i = 0; i < data.meanings.length; i++) {
      html2 += `
  

      <div class="term-data">
        <div class="col">
          <p class="partOfSpeech">${data.meanings[i].partOfSpeech}</p>
          <div
            style="
              height: 0.1rem;
              width: 100%;
              border: 1px solid var(--color-primary);
            "
          ></div>
        </div>
        <div class="term-meaning">
          <p class="meaning">Meaning</p>

          <ul>
          ${data.meanings[i].definitions
            .map((def) => {
              return `<li style='margin: 1.2rem'> ${def.definition} </li>`;
            })
            .join("")}
          
          </ul>

          
        </div>
      </div>
    </div>

</div>

`;
    }

    document.querySelector(".app-main").innerHTML = html1;
    document.querySelector(".app-main").innerHTML += html2;
    document.querySelector(".btn-term-sound").addEventListener("click", () => {
      const audioEl = document.createElement("audio");
      console.log(data.phonetics);

      if (data.phonetics[0].audio === "") {
        audioEl.src = data.phonetics[2].audio;
      } else {
        audioEl.src = data.phonetics[0].audio;
      }

      audioEl.play();
    });
  }
}
async function fetchAndRenderTerm() {
  const searchTerm = searchTermEl.value;
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`;

  try {
    const data = await getTerm(url);

    renderTerm(data);
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
}

searchIcon.addEventListener("click", function () {
  mainApp.innerHTML = `
  <div style='display: flex; justify-content: center align-item: center; flex-direction:column; text-align: center'>
    <img style="width: 130px; margin:0 auto; display: " src='../asset/images/loading.svg'>
    <p> Loading, Please wait... </p>
  </div>
`;
  fetchAndRenderTerm();
});

searchTermEl.addEventListener("input", function (e) {
  if (e.target.value === "") {
    mainApp.innerHTML = ` <div class="empty-feed">
    <div class="app-empty-feed">
      <div style="width: 300px; height: 250px">
        <img
          class="empty-feed-image"
          src="./asset/images/empty-feed-svg.svg"
          alt="Picture"
        />
      </div>
      <div>
        <h2 class="empty-feed-title">Online Dictionary</h2>
        <p class="empty-feed-text">
          Hi there, search any word to find the nouns, verbs, synonyms, meanings
          and much more.😊
        </p>
      </div>
    </div>
  </div>`;
  } else {
    mainApp.innerHTML = `
    <div style='display: flex; justify-content: center align-item: center; flex-direction:column; text-align: center'>
      <img style="width: 130px; margin:0 auto; display: " src='../asset/images/loading.svg'>
      <p> Loading, Please wait... </p>
    </div>
  `;
    fetchAndRenderTerm();
  }
});

document.addEventListener("keypress", (e) => {
  const key = e.key;
  if (e.key === "Enter") fetchAndRenderTerm();
});

// Save Theme To Local Storage
const themeBtn = document.querySelector(".app-theme");
themeBtn.style.cursor = "pointer";
themeBtn.addEventListener("click", function () {
  if (!document.body.classList.contains("dark-theme")) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark-theme");
  } else {
    localStorage.removeItem("theme");
    localStorage.setItem("theme", "light-theme");
    document.body.classList.remove("dark-theme");
  }
});
