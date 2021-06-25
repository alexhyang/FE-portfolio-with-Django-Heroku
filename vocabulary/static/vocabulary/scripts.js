function load_page(api_url, page_num = 1, word_group_div_id = "#word-group") {
  fetch(`${api_url}${page_num}`)
    .then((response) => response.json())
    .then((words) => {
      console.log(words);
      load_words(words, word_group_div_id);
      load_page_nav(api_url, page_num);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function load_words(words, word_group_div_id) {
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

// add entries
function addEntryToPage(entry, word_group) {
  entry = entry[0];
  if (Object.keys(entry).length == 2) {
    // create html elements and add to page
    const card = document.createElement("div");
    addStyles(card, word_group);

    // add card content
    card.innerHTML = `
    <div class="card-body word mb-3">
    <div class="word__meta"><div class="card-title word__word">${entry.word}</div></div>
    <div class="word__details card-text">
      <div class="word__meaning">
        <div class="word__error">${entry.error_message}</div>
      </div>
    </div>
    </div>`;
  }
  if (Object.keys(entry).length == 7) {
    // create html elements and add to page
    const card = document.createElement("div");
    addStyles(card, word_group);

    // prepare card elements
    var inflections = "";
    var derivatives = "";
    var audio = "";
    var ipa = "";
    if (entry.inflections) {
      inflections = `<div class="word__inflections">inflections: <strong><em>${entry.inflections}</em></strong></div>`;
    }
    if (entry.derivatives) {
      derivatives = `<div class="word__derivatives">derivatives: <strong><em>${entry.derivatives}</em></strong>`;
    }
    if (entry.audio_link) {
      audio = `<div class="word__pronunciation">
      <i class="fas fa-play-circle play-audio"></i>
      <audio controls src=${entry.audio_link}>Your browser does not support the audio element.</audio>
      </div>`;
    }
    if (entry.ipa) {
      ipa = `<div class="word__ipa">UK /${entry.ipa}/</div>`;
    }
    if (entry.lexical_category) {
      entry.lexical_category = shorten_category(entry.lexical_category);
    }

    // add card content
    card.innerHTML = `
    <div class="card-body word mb-3">
    <div class="word__meta"><div class="card-title word__word">${entry.word}</div>${audio}${ipa}</div>
    <div class="word__details card-text">
      <div class="word__meaning">
        <div class="word__category">${entry.lexical_category}</div> 
        <div class="word__senses">${entry.senses}</div>
      </div>
      <div class="word__variants">${inflections}${derivatives}</div>
    </div>
    </div>`;

    // add event listener
    $(".play-audio").on("click", (event) => {
      var audio = event.target.parentElement.querySelector("audio");
      audio.play();
    });
  }
}

function addStyles(card, word_group) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("col-md");
  card.classList.add("content__card", "card", "h-100");
  word_group.append(wrapper);
  wrapper.append(card);
}

function shorten_category(category) {
  switch (category) {
    case "noun":
      return "n.";
    case "verb":
      return "v.";
    case "adjective":
      return "adj.";
    case "adverb":
      return "adv.";
    case "auxiliary":
      return "aux.";
    case "pronoun":
      return "pron.";
    case "determiner":
      return "det.";
    case "conjunction":
      return "conj.";
    case "preposition":
      return "prep.";
    case "residual":
      return "";
  }
}
