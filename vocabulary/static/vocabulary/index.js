$(function () {
  listenToInput();
});

// helper functions
// add event listen to "count" button
function listenToInput() {
  $("#count").on("click", (e) => {
    let inputText = $("#textarea").val();
    let words = getWords(inputText);
    let uniqueWords = getUniqueWords(words);
    if (uniqueWords.length == 0) {
      alert("Please input valid text!");
      return false;
    } else if (uniqueWords.length == 1) {
      showResultCard([{ word: uniqueWords[0] }], "#result-output");
    } else {
      showResultTable(words, uniqueWords.length, "#result-output");
    }
    $("#result").val(uniqueWords);

    e.preventDefault();
  });
}

function getWords(str) {
  return str
    .trim()
    .split(/[^A-Za-z\-]+/)
    .filter((str) => str !== "");
}

function getUniqueWords(words) {
  let arr = [];
  for (var i in words) {
    if (!arr.includes(words[i])) {
      arr.push(words[i]);
    }
  }
  return arr;
}

function showResultCard(word_js, resultDisplayId) {
  // reset word counter
  $("#word-counter").html("");

  // load card
  loadWords(word_js, resultDisplayId);
  updateLayout();
}

function showResultTable(words, uniqueWordsNumber, resultDisplayId) {
  // update word counter
  $("#word-counter").html(
    `${uniqueWordsNumber} / ${words.length} (unique / total words)`
  );

  // initialize table
  let tableHtml = `<div style="overflow-y: auto; max-height: 400px">
    <table
      id="freq-table"
      class="app__table table table-striped overflow-auto"
    >
      <tr>
        <th>Word</th>
        <th>Count</th>
      </tr>
    </table>
  </div>`;
  $(resultDisplayId).html(tableHtml);

  // display results
  let textDict = countFreq(words);
  addWordsToTable(textDict, $("#freq-table"));

  // update layout
  updateLayout();
}

function updateLayout() {
  // change style from centering one column
  // to centering two columns
  $("#header")
    .addClass("justify-content-between")
    .removeClass("justify-content-center");
  $("#application")
    .addClass("justify-content-between")
    .removeClass("justify-content-center");
  $("#app-result-col").show();
}

// count word frequency in the original input
function countFreq(arr) {
  let freqObj = {};
  for (var i in arr) {
    if (arr[i] in freqObj) {
      freqObj[arr[i]]++;
    } else {
      freqObj[arr[i]] = 1;
    }
  }
  return freqObj;
}

// add words to table
function addWordsToTable(freqObj, tableRef) {
  tableRef.find("tr:gt(0)").remove();
  for (var key in freqObj) {
    tableRef.append(`<tr><td>${key}</td><td>${freqObj[key]}</td></tr>`);
  }
}
