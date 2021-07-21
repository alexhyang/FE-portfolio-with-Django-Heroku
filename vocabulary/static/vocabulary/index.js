$(function () {
  listenToInput();
});

// helper functions
// add event listen to "count" button
function listenToInput() {
  $("#count").on("click", () => {
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
    $("#result").val(inputText);
    
    return false; //prevent page reload after button click
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
  loadWords(word_js, resultDisplayId);
  $("#app-result-col").show();
  updateLayout();
}

function showResultTable(words, uniqueWordsNumber, resultDisplayId) {
  // update word counter
  $("#word-counter").html(`${uniqueWordsNumber} / ${words.length} (unique / total words)`);
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
  const resultDiv = $(resultDisplayId);
  let textDict = countFreq(words);
  createTable(textDict, $("#freq-table"));

  $("#app-result-col").show();
  updateLayout();
}

// show results after "count" button clicked
function showResults(inputText) {
  $("#app-result-col").show();
  updateTotalNumber(inputText, $("#word-counter"));
  showTable(inputText, $("#freq-table"));
  $("#result").val(inputText);
  updateLayout();
}

// update layout
function updateLayout() {
  $("#header")
    .addClass("justify-content-between")
    .removeClass("justify-content-center");
  $("#application")
    .addClass("justify-content-between")
    .removeClass("justify-content-center");
}

// update word counter
function updateTotalNumber(inputText, element) {
  let textArr = strToArr(inputText);
  let uniqueNumber = uniqueWords(textArr);
  element.html(`${uniqueNumber} / ${textArr.length} (unique / total words)`);
}

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

function createTable(freqObj, tableRef) {
  // reset table rows
  tableRef.find("tr:gt(0)").remove();
  // show table
  for (var key in freqObj) {
    tableRef.append(
      "<tr><td>" + key + "</td>" + "<td>" + freqObj[key] + "</td></tr>"
    );
  }
}
