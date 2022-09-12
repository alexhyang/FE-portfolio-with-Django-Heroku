$(function () {
  loadPage();
});

function loadPage() {
  fetch("/jobhunter-app/skills/fetch")
    .then((response) => response.json())
    .then((results) => {
      addResultsToPage(results);
    });
}

function addResultsToPage(results) {
  const ul = document.querySelector("#cloud");
  for (var key in results) {
    const count = results[key];
    const skillElem = document.createElement("li");
    if (count > 25) {
      countText = " (" + count + ") ";
      skillElem.setAttribute("data-weight", countText);
    }
    skillElem.style.setProperty("--size", Math.log(count) + 1);
    skillElem.innerHTML = key;
    ul.append(skillElem);
  }
}
