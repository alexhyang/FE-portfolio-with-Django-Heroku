$(function () {
  listenToInput();
});

// helper functions
// add event listen to "count" button
function listenToInput() {
  $("#count").on("click", (e) => {
    let uniqueWordsArray = getUniqueWordsArray();
    showResult(uniqueWordsArray);
    updateLayout();
    $("#result").val(uniqueWordsArray);
    e.preventDefault();
  });
}

function getUniqueWordsArray() {
  return getUniqueWords(getWords($("#textarea").val()));
}

function getWords(str) {
  return str
    .trim()
    .split(/[^A-Za-z\-]+/)
    .filter((str) => str !== "");
}

function getUniqueWords(wordsArray) {
  let arr = [];
  for (let word of wordsArray) {
    if (!arr.includes(word)) {
      arr.push(word);
    }
  }
  return arr;
}

function showResult(uniqueWordsArray) {
  if (uniqueWordsArray.length == 0) {
    alert("Please input valid text!");
    return false;
  } else if (uniqueWordsArray.length == 1) {
    showResultCard([{ word: uniqueWordsArray[0] }], "#result-output");
  } else {
    showResultTable(wordsArray, uniqueWordsArray.length, "#result-output");
  }
}

function showResultCard(wordJson, resultDisplayId) {
  // reset word counter
  $("#word-counter").html("");

  // load card
  renderWordCards(wordJson, resultDisplayId);
}

function showResultTable(wordsArray, uniqueWordsNumber, resultDisplayId) {
  // update word counter
  $("#word-counter").html(
    `${uniqueWordsNumber} / ${wordsArray.length} (unique / total words)`
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
  let textObj = countFreq(wordsArray);
  addWordsToTable(textObj, $("#freq-table"));
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
