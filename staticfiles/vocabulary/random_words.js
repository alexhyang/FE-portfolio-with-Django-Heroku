$(function () {
  renderRandomList();
  $("#reload").on("click", () => {
    renderRandomList();
  });
});

function renderRandomList() {
  fetch("/vocabulary-app/random/new")
    .then((response) => response.json())
    .then((words) => {
      renderWordCards(words, "#word-group");
    })
    .catch((error) => console.log("Error: ", error));
}
