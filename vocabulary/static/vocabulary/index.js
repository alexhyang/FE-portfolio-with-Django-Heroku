$(function () {
	//$('#resultTable').show();

	// count result
	$("#count").on("click", () => {
		const inputText = $("#textarea").val();
		if (inputText.length > 0) {
			updateTotalNumber(inputText, $("#counter"));
			showTable(inputText, $("#freq-table"));
		} else {
			alert("Please input valid text!");
		}
		return false; //prevent page reload after click
	});

	// clear text
	$("#clear").on("click", () => {
		$("#textarea").val("");
	});
});