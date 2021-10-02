$(function () {
  if ($(".alert").length == 0) {
    $("#save").prop("disabled", true);
  }
  createCheckResultElem();
  autoFillDate();
  listenToUrlChange();
  listenToFormatter();
});

function createCheckResultElem() {
  let urlResultElem = document.createElement("p");
  urlResultElem.setAttribute("id", "url-checker");
  document.querySelector("#div_id_url").append(urlResultElem);
}

function autoFillDate() {
  // to refactor: Aug. 31 but no Sept. 31
  let today = new Date();
  let dueMonth = correctMonthDateFormat(today.getMonth() + 2);
  let dueDate = correctMonthDateFormat(today.getDate());
  document.querySelector("#id_due_date").value =
    today.getFullYear() + "-" + dueMonth + "-" + dueDate;
}

function correctMonthDateFormat(dateOrMonth) {
  if (dateOrMonth < 10) {
    dateOrMonth = "0" + dateOrMonth;
  }
  return dateOrMonth;
}

function updateCheckResultDiv(url_is_new) {
  let urlResultElem = document.querySelector("#url-checker");
  urlResultElem.innerHTML = url_is_new ? "posting is new" : "posting existed";
  let style = url_is_new ? "text-success" : "text-danger";
  urlResultElem.className = "";
  urlResultElem.classList.add(style);
}

function resetCheckResultDiv() {
  // reset style and text
  let urlResultElem = document.querySelector("#url-checker");
  urlResultElem.innerHTML = "";
  urlResultElem.className = "";
}

function listenToUrlChange() {
  $("#id_url").on("change", (e) => {
    const url = e.target.value;
    // if url value is not empty, then update the result div
    // otherwise, clear text in result div
    if (url != "") {
      let jobKey = getJobKey(url);
      fetch(`/jobhunter-app/add/check?jk=${jobKey}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          updateCheckResultDiv(result.url_is_new);
        })
        .catch((error) => console.log("Error: ", error));
    } else {
      resetCheckResultDiv();
    }
  });
}

function getJobKey(url) {
  return url
    .split(/[?&]/)
    .filter((section) => /^jk/.test(section))[0]
    .slice(3);
}

function listenToFormatter() {
  $("#formatter").on("click", () => {
    document.querySelectorAll("textarea").forEach(formatTextarea);
    $("#save").prop("disabled", false);
  });
}

function formatTextarea(textarea) {
  textarea.value =
    "- " +
    textarea.value
      .replaceAll(/[-·][\s]+/g, "")
      .replaceAll(/(\s*<br>)*[\n]+/g, " <br>\n- ");
}
