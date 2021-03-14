$(function () {
  $("#count").on("click", () => {
    const inputText = $("#textarea").val();
    if (inputText.length > 0) {
      $("#index-result-col").show();
      updateTotalNumber(inputText, $("#word-counter"));
      showTable(inputText, $("#freq-table"));
    } else {
      alert("Please input valid text!");
    }
    $("#result").val(inputText);

    $("#introduction")
      .addClass("justify-content-between")
      .removeClass("justify-content-center");

    $("#freq-counter-app")
      .addClass("justify-content-between")
      .removeClass("justify-content-center");

    return false; //prevent page reload after button click
  });
});
