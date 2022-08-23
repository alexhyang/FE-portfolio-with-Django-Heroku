$(function () {
  loadPage();
});

function loadPage() {
  fetch("/jobhunter-app/skills/fetch")
    .then((response) => response.json())
    .then((results) => {
      addToPage(results);
    });
}

function addToPage(results) {
  // add response results to page
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
