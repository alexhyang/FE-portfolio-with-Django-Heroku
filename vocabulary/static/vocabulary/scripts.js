function loadPage(apiUrl, pageNum = 1, wordGroupDivId = "#word-group") {
  fetch(`${apiUrl}${pageNum}`)
    .then((response) => response.json())
    .then((words) => {
      // console.log(words);
      loadWords(words, wordGroupDivId);
      loadPageNav(apiUrl, pageNum);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
}

function loadWords(words, wordGroupDivId) {
  // clear group content
  const wordGroupDiv = document.querySelector(wordGroupDivId);
  wordGroupDiv.innerHTML = "";

  // create word elements
  for (let i in words) {
    const word = words[i].word;
    fetch(`/app/dict/${word}`)
      .then((response) => response.json())
      .then((word) => {
        console.log(word);
        addWordToPage(word, wordGroupDiv);
        updateWordTitleStyle();
      })
      .catch((error) => console.log("Error: ", error));
  }
}

function loadPageNav(apiUrl, currentPageNum) {
  // initialize variables for page buttons
  let previousPageNum = currentPageNum - 1;
  let nextPageNum = currentPageNum + 1;
  let maxPageNum = Number(document.querySelector("#max-page").dataset.page);

  // create page buttons
  let previousPage = `<li class="page-item">
    <button id="page-previous" class="page-link" data-page="${previousPageNum}">Previous</button></li>`;
  let currentPage = `<li class="page-item">
    <button id="page-previous" class="page-link" data-page="${currentPageNum}">${currentPageNum}</button></li>`;
  let nextPage = `<li class="page-item">
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
  const pagesLinks = document.querySelectorAll(".page-link");
  pagesLinks.forEach((element) => {
    element.addEventListener("click", () => {
      // update posts
      let newCurrentPageNum = Number(element.dataset.page);
      loadPage(apiUrl, (page = newCurrentPageNum));
    });
  });
}

function addWordToPage(word_js, wordGroupDiv) {
  word = word_js[0];
  // word retrieve failed
  if (Object.keys(word).length == 2) {
    const card = newCard((parentDiv = wordGroupDiv));
    card.innerHTML = `
    <div class="card-body word mb-3">
    <div class="word__meta"><div class="card-title word__word">${word.word}</div></div>
    <div class="word__details card-text">
      <div class="word__meaning">
        <div class="word__error">${word.error_message}</div>
      </div>
    </div>
    </div>`;
  }

  // word retrieve succeeded
  if (Object.keys(word).length == 3) {
    // create card
    createWordCard(word, (parentDiv = wordGroupDiv));

    // add event listener
    $(".play-audio").on("click", (event) => {
      let audio = event.target.parentElement.querySelector("audio");
      audio.play();
    });
  }
}

function updateWordTitleStyle() {
  if ($("#setting-title").data("titlecase") == "uppercase") {
    $(".word__word").addClass("uppercase");
  }
}

function newCard(parentDiv) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("col-md");
  parentDiv.append(wrapper);

  const card = document.createElement("div");
  card.classList.add("content__card", "card", "h-100");
  wrapper.append(card);
  return card;
}

function singlePronunciation(word) {
  const audio = word.entries[0].pronunciation[0].audioFile;
  for (let i in word.entries) {
    newAudio = word.entries[i].pronunciation[0].audioFile;
    if (newAudio != audio) {
      return false;
    }
  }
  return true;
}

function createWordCard(word, parentDiv) {
  card = newCard(parentDiv);
  let pronunciationHtml = "";
  let singleAudio = singlePronunciation(word);

  // if word has single pronunciation, add it after word title
  if (singleAudio) {
    let pronunciation = word.entries[0].pronunciation[0];
    pronunciationHtml = preparePronunciationHtml(pronunciation);
  }

  // word entries
  let entriesHtml = prepareEntriesHtml(word, singleAudio);

  // word derivatives
  let derivativesHtml = prepareDerivativesHtml(word);

  card.innerHTML = `
  <div class="card-body word mb-3">
    <div class="word__meta">
      <div class="word__word card-title">${word.word}</div>
      ${pronunciationHtml}
    </div>
    ${entriesHtml}
    ${derivativesHtml}
  </div>`;
}

function preparePronunciationHtml(pronunciation) {
  /* obj -> str, return HTML for .pronunciation */
  let pronunciationHtml = "";
  let audioFile = pronunciation.audioFile;
  let phoneticSpelling = pronunciation.phoneticSpelling;
  if (phoneticSpelling != "") {
    pronunciationHtml = `<div class="pronunciation">
        <i class="fas fa-play-circle play-audio"></i>
        <audio controls src="${audioFile}">Your browser does not support the audio element.</audio>
        <div class="ipa">US /${phoneticSpelling}/</div>
      </div>`;
  }
  return pronunciationHtml;
}

function prepareEntriesHtml(word, singleAudio) {
  let entriesHtml = "";
  for (let i in word.entries) {
    entriesHtml += prepareOneEntryHtml(word.entries[i], singleAudio);
  }
  return entriesHtml;
}

function prepareOneEntryHtml(entry, singleAudio) {
  let entryHtml = "";

  // lexical category
  let category = shortenCategory(entry.lexicalCategory);
  let lexicalCategoryHtml = `<div class="entry__lexical-category">${category}</div>`;

  // pronunciation
  let pronunciationHtml = "";
  if (!singleAudio) {
    pronunciationHtml = preparePronunciationHtml(entry.pronunciation[0]);
  }

  // definitions
  let definitionsHtml = "";
  let definitions = [];
  if ($("#setting-definition").data("definition") == "short") {
    definitions = entry.shortDefinitions;
  } else {
    definitions = entry.definitions;
  }
  let senses = "";
  if (definitions.length == 1) {
    senses = `<span class="entry__sense">
    ${definitions[0]}
    <span>`;
  } else {
    for (var i in definitions) {
      let index = parseInt(i) + 1;
      senses += `<span class="entry__sense">
      <strong>${index}.</strong> 
      <span>${definitions[i]}</span>
      <span>`;
    }
  }
  definitionsHtml = `<div class="entry__definitions">${senses}</div>`;

  // inflections
  let inflectionsHtml = "";
  if (entry.inflections.length != 0) {
    inflectionsHtml = `<div class="entry__inflections">(inflections: <em>${entry.inflections.join(
      ", "
    )}</em>)</div>`;
  }

  entryHtml = `<div class="word__entry entry">
    <div class="entry__meta">${lexicalCategoryHtml}${pronunciationHtml}</div>
    ${definitionsHtml}
    ${inflectionsHtml}
  </div>`;

  return entryHtml;
}

function prepareDerivativesHtml(word) {
  let derivativesHtml = "";
  if (word.derivatives != "") {
    derivativesHtml = `<div class="word__derivatives">derivatives: <em>${word.derivatives}<em></div>`;
  }
  return derivativesHtml;
}

function shortenCategory(category) {
  switch (category) {
    case "Noun":
      return "n.";
    case "Verb":
      return "v.";
    case "Adjective":
      return "adj.";
    case "Adverb":
      return "adv.";
    case "Auxiliary":
      return "aux.";
    case "Pronoun":
      return "pron.";
    case "Determiner":
      return "det.";
    case "Conjunction":
      return "conj.";
    case "Preposition":
      return "prep.";
    case "Interjection":
      return "int.";
    case "Residual":
      return "";
  }
}
