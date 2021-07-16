$(function () {
  loadRandomPage();
  $("#reload").on("click", () => {
    loadRandomPage();
  });
});

function loadRandomPage() {
  fetch("/app/random/new")
    .then((response) => response.json())
    .then((words) => {
      console.log(words);
      loadWords(words, "#word-group");
    })
    .catch((error) => console.log("Error: ", error));
}
