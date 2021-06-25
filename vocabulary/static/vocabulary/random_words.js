$(function () {
  load_random_page();
});

function load_random_page() {
  fetch("/app/random/new")
    .then((response) => response.json())
    .then((words) => {
      console.log(words);
      load_words(words, "#word-group");
    })
    .then(() => {
      $("#reload").on("click", () => {
        load_random_page();
      });
    })
    .catch((error) => console.log("Error: ", error));
}
