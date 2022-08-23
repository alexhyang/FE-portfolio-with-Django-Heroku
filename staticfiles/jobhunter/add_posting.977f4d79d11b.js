$(function () {
  if ($(".alert").length == 0) {
    $("#save").prop("disabled", true);
  }
  createUrlCheckResultElem();
  autoFillDueDate();
  listenToUrlFieldChange();
  listenToFormatterBtn();
});

function createUrlCheckResultElem() {
  let urlResultElem = document.createElement("p");
  urlResultElem.setAttribute("id", "url-checker");
  document.querySelector("#div_id_url").append(urlResultElem);
}

function autoFillDueDate() {
  let today = new Date();
  let thirtyDaysAfterToday = new Date(new Date().setDate(today.getDate() + 30));
  let dueMonth = convertToTwoDigits(thirtyDaysAfterToday.getMonth() + 1);
  let dueDate = convertToTwoDigits(thirtyDaysAfterToday.getDate());
  document.querySelector("#id_due_date").value =
    thirtyDaysAfterToday.getFullYear() + "-" + dueMonth + "-" + dueDate;
}

function convertToTwoDigits(dateOrMonth) {
  if (dateOrMonth < 10) {
    dateOrMonth = "0" + dateOrMonth;
  }
  return dateOrMonth;
}

function listenToUrlFieldChange() {
  $("#id_url").on("change", (e) => {
    const url = e.target.value;
    if (url != "") {
      let jobKey = getJobKey(url);
      if (jobKey !== "" && validURL(url)) {
        fetch(`/jobhunter-app/add/check?jk=${jobKey}`)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            updateUrlCheckResultElem(true, result.posting_is_new);
          })
          .catch((error) => console.log("Error: ", error));
      } else {
        updateUrlCheckResultElem(false);
      }
    } else {
      resetUrlCheckResultElem();
    }
  });
}

function updateUrlCheckResultElem(urlIsValid, posting_is_new = false) {
  let urlResultElem = document.querySelector("#url-checker");
  if (urlIsValid) {
    urlResultElem.innerHTML = posting_is_new ? "posting is new" : "posting existed";
    let style = posting_is_new ? "text-success" : "text-danger";
    urlResultElem.className = "";
    urlResultElem.classList.add(style);
  } else {
    urlResultElem.innerHTML =
    "Invalid URL! Please make sure your url is in correct format.";
    urlResultElem.className = "text-danger";
  }
}

function resetUrlCheckResultElem() {
  let urlResultElem = document.querySelector("#url-checker");
  urlResultElem.innerHTML = "";
  urlResultElem.className = "";
}

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function getJobKey(url) {
  let jk = url.split(/[?&]/).filter((section) => /^jk/.test(section));
  if (jk.length === 0) {
    return "";
  } else {
    return jk[0].slice(3);
  }
}

function listenToFormatterBtn() {
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
