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
    const elem = document.createElement("li");
    elem.setAttribute("data-weight", count);
    elem.style.setProperty("--size", Math.log(count)*2+1);
    elem.innerHTML = key;
    ul.append(elem);
  }
}
