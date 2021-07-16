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
  const wordGroup = document.querySelector(wordGroupDivId);
  wordGroup.innerHTML = "";

  // create word elements
  for (let i in words) {
    const word = words[i].word;
    fetch(`/app/dict/${word}`)
      .then((response) => response.json())
      .then((word) => {
        console.log(word);
        addWordToPage(word, wordGroup);
      })
      .catch((error) => console.log("Error: ", error));
  }
}

// display page navigation on page
function loadPageNav(apiUrl, currentPageNum) {
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

// add entries
function addWordToPage(word, wordGroup) {
  word = word[0];
  // word retrieve failed
  if (Object.keys(word).length == 2) {
    // create html elements and add to page
    const card = document.createElement("div");
    addStyles(card, wordGroup);

    // add card content
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
    // create html elements and add to page
    const card = document.createElement("div");
    addStyles(card, wordGroup);

    // single or multiple audio?
    console.log(word.entries);
    if (singlePronunciation(word)) {
      console.log("single pronunciation");
      createWordCard(word, card, (audioType = "single"));
    } else {
      console.log("multiple pronunciation");
      createWordCard(word, card, (audioType = "multiple"));
    }

    // add event listener
    $(".play-audio").on("click", (event) => {
      let audio = event.target.parentElement.querySelector("audio");
      audio.play();
    });
  }
}

function addStyles(card, wordGroup) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("col-md");
  card.classList.add("content__card", "card", "h-100");
  wordGroup.append(wrapper);
  wrapper.append(card);
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

function createWordCard(word, card, audioType) {
  let pronunciationHtml = "";

  // word pronunciation
  if (audioType == "single") {
    let pronunciation = word.entries[0].pronunciation[0];
    pronunciationHtml = preparePronunciationHtml(pronunciation);
  }

  // word entries
  let entriesHtml = prepareEntriesHtml(word, audioType);

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
        <div class="ipa">UK /${phoneticSpelling}/</div>
      </div>`;
  }
  return pronunciationHtml;
}

function prepareEntriesHtml(word, audioType) {
  let entriesHtml = "";
  for (let i in word.entries) {
    entriesHtml += prepareOneEntryHtml(word.entries[i], audioType);
  }
  return entriesHtml;
}

function prepareOneEntryHtml(entry, audioType) {
  let entryHtml = "";

  // lexical category
  let category = shortenCategory(entry.lexicalCategory);
  let lexicalCategoryHtml = `<div class="entry__lexical-category">${category}</div>`;

  // pronunciation
  let pronunciationHtml = "";
  if (audioType == "multiple") {
    pronunciationHtml = preparePronunciationHtml(entry.pronunciation[0]);
  }

  // definitions
  let definitionsHtml = "";
  let definitions = "";
  if (entry.shortDefinitions.length == 1) {
    definitions = `<span class="entry__sense">
    ${entry.definitions[0]}
    <span>`;
  } else {
    for (var i in entry.shortDefinitions) {
      let index = parseInt(i) + 1;
      definitions += `<span class="entry__sense">
      <strong>${index}.</strong> 
      <span>${entry.definitions[i]}</span>
      <span>`;
    }
  }
  definitionsHtml = `<div class="entry__definitions">${definitions}</div>`;

  // inflections
  let inflectionsHtml = "";
  if (entry.inflections.length != 0) {
    inflectionsHtml = `<div class="entry__inflections">(inflections: ${entry.inflections})</div>`;
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
