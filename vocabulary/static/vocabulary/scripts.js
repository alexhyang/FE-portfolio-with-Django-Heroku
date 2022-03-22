const loadPage = (apiUrl, pageNum = 1, wordGroupDivId = "#word-group") => {
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
};

const loadWords = (words, wordGroupDivId) => {
  function updateWordTitleStyle() {
    if ($("#setting-title").data("titlecase") == "uppercase") {
      $(".word__word").addClass("uppercase");
    }
  }

  // clear group content
  const wordGroupDiv = document.querySelector(wordGroupDivId);
  wordGroupDiv.innerHTML = "";

  // create word elements
  const fetchAndAddWordToPage = (word) => {
    console.log(word);
    fetch(`/vocabulary-app/dict/${word.word}`)
      .then((response) => response.json())
      .then((word) => {
        console.log(word);
        addWordToPage(word[0], wordGroupDiv);
        updateWordTitleStyle();
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  for (let word of words) {
    fetchAndAddWordToPage(word);
  }
};

const loadPageNav = (apiUrl, currentPageNum) => {
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
      loadPage(apiUrl, (page = newCurrentPageNum));
    });
  });
};

const addWordToPage = (wordObj, wordGroupDiv) => {
  function createCardWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("col-md");
    return wrapper;
  }

  function createCard() {
    const card = document.createElement("div");
    card.classList.add("content__card", "card", "h-100");
    return card;
  }

  function prepareCardHtmlWhenNoEntryFound(wordObj, card) {
    card.innerHTML = `
    <div class="card-body word mb-3">
    <div class="word__meta"><div class="card-title word__word">${wordObj.word}</div></div>
    <div class="word__details card-text">
      <div class="word__meaning">
        <div class="word__error">${wordObj.error_message}</div>
      </div>
    </div>
    </div>`;
  }

  function hasSinglePronunciation(wordObj) {
    const audio = wordObj.entries[0].pronunciation[0].audioFile;
    for (let i in wordObj.entries) {
      newAudio = wordObj.entries[i].pronunciation[0].audioFile;
      if (newAudio != audio) {
        return false;
      }
    }
    return true;
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

  function prepareOneEntryHtml(entry, wordHasSinglePronunciation) {
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
        default:
          return "";
      }
    }

    function prepareLexicalCategoryHtml(entry) {
      let category = shortenCategory(entry.lexicalCategory);
      let lexicalCategoryHtml = `<div class="entry__lexical-category">${category}</div>`;

      return lexicalCategoryHtml;
    }

    function prepareDefinitionsHtml(entry) {
      function useShortDefinitions() {
        return $("#setting-definition").data("definition") == "short";
      }

      function hasSingleSense(definitions) {
        return definitions.length == 1;
      }

      function prepareSingleSense(definitions) {
        let senses = "";
        senses = `<span class="entry__sense">${definitions[0]}<span>`;
        return senses;
      }

      function prepareMultipleSenses(definitions) {
        let senses = "";

        for (var i in definitions) {
          let index = parseInt(i) + 1;
          senses += `<span class="entry__sense">
          <strong>${index}.</strong> 
          <span>${definitions[i]}</span>
          <span>`;
        }

        return senses;
      }

      let definitionsHtml = "";
      let definitions = [];
      if (useShortDefinitions()) {
        definitions = entry.shortDefinitions;
      } else {
        definitions = entry.definitions;
      }

      let senses = "";
      if (hasSingleSense(definitions)) {
        senses = prepareSingleSense(definitions);
      } else {
        senses = prepareMultipleSenses(definitions);
      }

      definitionsHtml = `<div class="entry__definitions">${senses}</div>`;
      return definitionsHtml;
    }

    function prepareInflectionsHtml(entry) {
      let inflectionsHtml = "";
      if (entry.inflections.length != 0) {
        inflectionsHtml = `<div class="entry__inflections">(inflections: <em>${entry.inflections.join(
          ", "
        )}</em>)</div>`;
      }
      return inflectionsHtml;
    }

    let entryHtml = "";
    let lexicalCategoryHtml = prepareLexicalCategoryHtml(entry);
    let pronunciationHtml = "";
    if (!wordHasSinglePronunciation) {
      pronunciationHtml = preparePronunciationHtml(entry.pronunciation[0]);
    }
    let definitionsHtml = prepareDefinitionsHtml(entry);
    let inflectionsHtml = prepareInflectionsHtml(entry);

    entryHtml = `<div class="word__entry entry">
      <div class="entry__meta">${lexicalCategoryHtml}${pronunciationHtml}</div>
      ${definitionsHtml}
      ${inflectionsHtml}
    </div>`;

    return entryHtml;
  }

  function prepareMultipleEntriesHtml(wordObj, wordHasSinglePronunciation) {
    let entriesHtml = "";
    for (let i in wordObj.entries) {
      entriesHtml += prepareOneEntryHtml(
        wordObj.entries[i],
        wordHasSinglePronunciation
      );
    }
    return entriesHtml;
  }

  function prepareDerivativesHtml(wordObj) {
    let derivativesHtml = "";
    if (wordObj.derivatives != "") {
      derivativesHtml = `<div class="word__derivatives">derivatives: <em>${wordObj.derivatives}<em></div>`;
    }
    return derivativesHtml;
  }

  function prepareCardHtmlWithEntries(wordObj, card) {
    let singlePronunciationHtml = "";

    if (hasSinglePronunciation(wordObj)) {
      let pronunciation = wordObj.entries[0].pronunciation[0];
      singlePronunciationHtml = preparePronunciationHtml(pronunciation);
    }

    let entriesHtml = prepareMultipleEntriesHtml(
      wordObj,
      hasSinglePronunciation(wordObj)
    );

    let derivativesHtml = prepareDerivativesHtml(wordObj);

    card.innerHTML = `
    <div class="card-body word mb-3">
      <div class="word__meta">
        <div class="word__word card-title">${wordObj.word}</div>
        ${singlePronunciationHtml}
      </div>
      ${entriesHtml}
      ${derivativesHtml}
    </div>`;
  }

  function enablePronunciation() {
    $(".play-audio").on("click", (event) => {
      let audio = event.target.parentElement.querySelector("audio");
      audio.play();
    });
  }

  function addCardBody(wordObj, card) {
    if ("error_message" in wordObj) {
      prepareCardHtmlWhenNoEntryFound(wordObj, card);
    } else {
      prepareCardHtmlWithEntries(wordObj, card);
    }
  }

  const wrapper = createCardWrapper();
  const card = createCard();
  addCardBody(wordObj, card);
  wordGroupDiv.append(wrapper);
  wrapper.append(card);
  enablePronunciation();
};
