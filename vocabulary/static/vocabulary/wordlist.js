$(function () {
  const listId = $("#list-id").text();
  load_page(`/app/lists/${listId}/`);
});

function load_page(api_url, page_num = 1, word_group_div_id = "#word-group") {
  fetch(`${api_url}${page_num}`)
    .then((response) => response.json())
    .then((words) => {
      console.log(words);
      display_words(words, word_group_div_id);
      load_page_nav(api_url, page_num);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function display_words(words, word_group_div_id) {
  // clear group content
  const word_group = document.querySelector(word_group_div_id);
  word_group.innerHTML = "";

  // create word elements
  for (var i in words) {
    const word = words[i].word;
    fetch(`/app/dict/${word}`)
      .then((response) => response.json())
      .then((entry) => {
        console.log(entry);
        addEntryToPage(entry, word_group);
      })
      .catch((error) => console.log("Error: ", error));
  }
}

// display page navigation on page
function load_page_nav(api_url, currentPageNum) {
  var previousPageNum = currentPageNum - 1;
  var nextPageNum = currentPageNum + 1;
  var maxPageNum = Number(document.querySelector("#max-page").dataset.page);
  // create page buttons
  var previousPage = `<li class="page-item">
    <button id="page-previous" class="page-link" data-page="${previousPageNum}">Previous</button></li>`;
  var currentPage = `<li class="page-item">
    <button id="page-previous" class="page-link" data-page="${currentPageNum}">${currentPageNum}</button></li>`;
  var nextPage = `<li class="page-item">
    <button id="page-previous" class="page-link" data-page="${nextPageNum}">Next</button></li>`;

  // add buttons to page navigation
  if (maxPageNum <= 1) {
    document.querySelector("#page-nav-list").innerHTML = currentPage;
  } else {
    if (currentPageNum == 1) {
      document.querySelector("#page-nav-list").innerHTML =
        currentPage + nextPage;
    } else if (currentPageNum == maxPageNum) {
      document.querySelector("#page-nav-list").innerHTML =
        previousPage + currentPage;
    } else {
      document.querySelector("#page-nav-list").innerHTML =
        previousPage + currentPage + nextPage;
    }
  }

  // add event listener to page nav buttons
  const pages_links = document.querySelectorAll(".page-link");
  pages_links.forEach((element) => {
    element.addEventListener("click", () => {
      // update posts
      var newCurrentPageNum = Number(element.dataset.page);
      load_page(api_url, (page = newCurrentPageNum));
    });
  });
}

function addEntryToPage(entry, word_group) {
  entry = entry[0];
  if (Object.keys(entry).length != 0) {
    // create html elements and add to page
    const wrapper = document.createElement("div");
    wrapper.classList.add("col-md");

    const card = document.createElement("div");
    card.classList.add("content__card", "card");

    word_group.append(wrapper);
    wrapper.append(card);

    // prepare card elements
    var inflections = "";
    var derivatives = "";
    if (entry.inflections) {
      inflections = `<div class="word__inflections">inflections: <em>${entry.inflections}</em></div>`;
    }
    if (entry.derivatives) {
      derivatives = `<div class="derivatives">derivatives: <em>${entry.derivatives}</em>`;
    }
    

    // add card content
    card.innerHTML = `
    <div class="card-body word">
      <div class="word__meta">
        <div class="card-title word__word">${entry.word}</div>
        <audio class="word__pronunciation"controls src=${entry.audio_link}>Your browser does not support the audio element.</audio>
        <div class="word__ipa">/${entry.ipa}/</div>
      </div>
      <div class="card-text">
        <div class="word__senses">${entry.senses}</div>
        <div class="word__variants">
          ${inflections}
          ${derivatives}
        </div>
      </div>
    </div>`;
  }
}
