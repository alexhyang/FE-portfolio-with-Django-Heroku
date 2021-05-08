$(function () {
  load_list();
  $("#case-toggle").on("click", () => {
    if ($("#case-toggle").html() === "Show uppercase") {
      $(".card-title").css("text-transform", "uppercase");
      $("#case-toggle").html("Show lowercase");
    } else {
      $(".card-title").css("text-transform", "lowercase");
      $("#case-toggle").html("Show uppercase");
    }
  });
});

function load_list() {
  // fetch list
  // create div elements
  // display word card
}
