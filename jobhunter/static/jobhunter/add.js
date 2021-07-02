$(function () {
  $("#formatter").on("click", () => {
    document.querySelectorAll("textarea").forEach((textarea) => {
      textarea.value = "- " + textarea.value.replaceAll("\n", " <br>\n- ");
    });
  });
});

