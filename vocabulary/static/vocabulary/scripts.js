const renderPage = (apiUrl, pageNum = 1, wordGroupDivId = "#word-group") => {
  fetch(`${apiUrl}${pageNum}`)
    .then((response) => response.json())
    .then((words) => renderPageElements(words, wordGroupDivId, apiUrl, pageNum))
    .catch((error) => {
      console.log("Error: ", error);
    });
};

const renderPageElements = (words, wordGroupDivId, apiUrl, pageNum) => {
  renderWordCards(words, wordGroupDivId);
  renderPageNav(apiUrl, pageNum);
};

// loadWords
const renderWordCards = (words, targetDivId) => {
  $(targetDivId).html("");
  for (let word of words) {
    fetchWordAndAppendCard(word, targetDivId);
  }
};

const fetchWordAndAppendCard = (word, targetDivId) => {
  console.log(word);
  fetch(`/vocabulary-app/dict/${word.word}`)
    .then((response) => response.json())
    .then((data) => {
      appendWordCardToDiv(data[0], targetDivId);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

// loadPageNav
const renderPageNav = (apiUrl, currentPageNum) => {
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
      let newCurrentPageNum = Number(element.dataset.page);
      renderPage(apiUrl, (page = newCurrentPageNum));
    });
  });
};

const appendWordCardToDiv = (wordObj, targetDivId) => {
  function enablePronunciation() {
    $(".play-audio").on("click", (event) => {
      let audio = event.target.parentElement.querySelector("audio");
      audio.play();
    });
  }

  // get setting from DOM
  let setting = {};
  setting.titlecase = $("#setting-title").data("titlecase");
  setting.definition = $("#setting-definition").data("definition");
  let card = new Card(wordObj, setting);
  let cardWrapper = document.createElement("div");
  cardWrapper.innerHTML = card.getCardHtml();
  console.log(cardWrapper);

  document.querySelector(targetDivId).append(cardWrapper);
  enablePronunciation();
};

class Card {
  constructor(word, setting) {
    this.word = new Word(word);
    this.setting = setting;
    // settings: { titlecase: "uppercase", definition: "short" }
  }

  getCardHtml() {
    let content = "";

    if ("error_message" in this.word) {
      content = this._getInvalidEntryCardHtml();
    } else {
      content = this._getValidEntryCardHtml();
    }

    return `
    <div class="col-md">
      <div class="content__card card h-100">
        ${content}
      </div>
    </div>`;
  }

  _getInvalidEntryCardHtml() {
    return `
    <div class="card-body word mb-3">
      <div class="word__meta">
        <div class="card-title word__word">${this.word.word}</div>
      </div>
      <div class="word__error">${this.word.error_message}</div>
    </div>`;
  }

  _getValidEntryCardHtml() {
    let wordMetaHtml = this._getWordMetaHtml();
    let entriesHtml = this._getEntriesHtml();
    let derivativesHtml = this._getDerivativesHtml();

    return `
    <div class="card-body word mb-3">
      ${wordMetaHtml}
      ${entriesHtml}
      ${derivativesHtml}
    </div>`;
  }

  _getWordMetaHtml() {
    let titleCase = "";
    let pronunciationHtml = "";

    if (this.setting.titlecase === "uppercase") {
      titleCase = "uppercase";
    }

    if (this.word.hasSinglePronunciation()) {
      pronunciationHtml = this._getPronunciationHtmlByEntry(
        this.word.entries[0]
      );
    }

    return `
    <div class="word__meta">
      <div class="card-title word__word ${titleCase}">${this.word.word}</div>
      ${pronunciationHtml}
    </div>`;
  }

  _getEntriesHtml() {
    let entriesHtml = "";

    for (let entry of this.word.entries) {
      entriesHtml += this._getEntryHtml(entry);
    }

    return entriesHtml;
  }

  _getEntryHtml(entry) {
    let entryMetaHtml = this._getEntryMetaHtml(entry);
    let entryDefinitionHtml = this._getEntryDefinitionHtml(entry);
    let entryInflectionsHtml = this._getEntryInflectionsHtml(entry);

    return `
    <div class="word__entry entry">
      ${entryMetaHtml}
      ${entryDefinitionHtml}
      ${entryInflectionsHtml}
    </div>`;
  }

  _getEntryMetaHtml(entry) {
    let lexicalCategoryHtml = `
    <div class="entry__lexical-category">${this._shortenCategory(
      entry.lexicalCategory
    )}</div>`;

    let pronunciationHtml = "";

    if (this.word.hasMultiplePronunciations()) {
      pronunciationHtml = this._getPronunciationHtmlByEntry(entry);
    }

    return `
    <div class="entry__meta">
      ${lexicalCategoryHtml}
      ${pronunciationHtml}
    </div>`;
  }

  _getEntryDefinitionHtml(entry) {
    let definitionHtml = "";
    let definitions;

    // select short or full definition
    if (this.setting.definition === "short") {
      definitions = entry.shortDefinitions;
    } else {
      definitions = entry.definitions;
    }

    if (definitions.length === 1) {
      definitionHtml = `
        <span class="entry__sense">${definitions[0]}</span>
      `;
    } else {
      for (var i in definitions) {
        let index = parseInt(i) + 1;
        definitionHtml += `
        <span class="entry__sense">
          <strong>${index}.</strong>
          <span>${definitions[i]}</span>
        </span>`;
      }
    }

    return `
    <div class="entry__definitions">
      ${definitionHtml}
    </div>`;
  }

  _getEntryInflectionsHtml(entry) {
    let inflectionsHtml = "";
    if (entry.inflections.length !== 0) {
      inflectionsHtml = `(inflections: <em>${entry.inflections.join(
        ", "
      )}</em>)`;
    }
    return `
    <div class="entry__inflections">
      ${inflectionsHtml}
    </div>`;
  }

  _getDerivativesHtml() {
    let derivativesHtml = "";
    if (this.word.derivatives !== "") {
      derivativesHtml = `derivatives: <em>${this.derivatives}<em>`;
    }
    return `
    <div class="word__derivatives">
      ${derivativesHtml}
    </div>`;
  }

  // helper methods
  _getPronunciationHtmlByEntry(entry) {
    let pronunciationHtml = "";
    let audioFileLink = entry.pronunciation[0].audioFile;
    let phoneticSpelling = entry.pronunciation[0].phoneticSpelling;

    if (phoneticSpelling !== "") {
      pronunciationHtml = `
      <div class="word__audio">
        <i class="fas fa-play-circle play-audio"></i>
        <audio controls src="${audioFileLink}">Your browser does not support the audio element.</audio>
        <div class="word__ipa">US /${phoneticSpelling}/</div>
      </div>`;
    }

    return pronunciationHtml;
  }

  _shortenCategory(category) {
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
      default:
        return "";
    }
  }
}

class Word {
  /* 
    {
      word: "web",
      entries: [
        {
          lexicalCategory: "xx",
          pronunciation: [{ 
            audioFile: "xxx", 
            phoneticSpelling: "xx"
          }],
          definitions: ["xxx", "yyy", "zzz"],
          shortDefinitions: ["xxx", "yyy", "zzz"],
          inflections: []
        },
        ...
      ],
      derivatives: "abcd"
    }
  */
  constructor(data) {
    Object.assign(this, data);
  }

  /* pronunciation: single (<= 1), multiple (> 1) */
  hasSinglePronunciation() {
    if (this._hasSingleSense()) {
      return true;
    } else {
      return !this._hasDifferentPronunciations();
    }
  }

  hasMultiplePronunciations() {
    return !this.hasSinglePronunciation();
  }

  _hasSingleSense() {
    return this.entries.length === 1;
  }

  _hasDifferentPronunciations() {
    const audio = this.entries[0].pronunciation[0].audioFile;
    for (let entry of this.entries) {
      let newAudio = entry.pronunciation[0].audioFile;
      if (newAudio !== audio) {
        return true;
      }
    }
    return false;
  }
}
