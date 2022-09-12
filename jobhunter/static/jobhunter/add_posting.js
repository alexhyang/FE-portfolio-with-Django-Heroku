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
  $("#id_url").on("blur", (e) => {
    if (e.target.value === "") {
      resetUrlCheckResultElem();
    } else {
      let url;
      try {
        url = new URL(e.target.value);
        let jobKey = url.searchParams.get("jk");
        if (jobKey !== null) {
          fetch(`/jobhunter-app/add/check?jk=${jobKey}`)
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              if (result.posting_is_new) {
                updateUrlCheckResultElem(true, "Posting is new");
              } else {
                updateUrlCheckResultElem(false, "Posting already exists");
              }
            })
            .catch((error) => console.log("Error: ", error));
        } else {
          updateUrlCheckResultElem(false, "Couldn't find job key in query parameters (jk=...)");
        }
      } catch(error) {
        updateUrlCheckResultElem(false, "Invalid URL");
      }
    }
  });
}

function updateUrlCheckResultElem(postingIsOk, message="") {
  let urlResultElem = document.querySelector("#url-checker");
  if (postingIsOk) {
    urlResultElem.className = "text-success";
  } else {
    urlResultElem.className = "text-danger";
  }
  urlResultElem.innerHTML = message;
}

function resetUrlCheckResultElem() {
  let urlResultElem = document.querySelector("#url-checker");
  urlResultElem.innerHTML = "";
  urlResultElem.className = "";
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
