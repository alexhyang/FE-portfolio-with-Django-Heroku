$(function () {
  document.body.addEventListener("keydown", function (event) {
    if (event.key === "n") {
      window.location.replace("/jobhunter-app/add_posting");
    }
  });
});
