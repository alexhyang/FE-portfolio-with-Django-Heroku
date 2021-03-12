$(function () {
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
