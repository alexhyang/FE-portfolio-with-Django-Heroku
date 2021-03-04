$(function () {

	// count result
	$("#count").on("click", () => {
		$('#resultTable').show();
		const inputText = $("#textarea").val();
		if (inputText.length > 0) {
			updateTotalNumber(inputText, $("#counter"));
			showTable(inputText, $("#freq-table"));
		} else {
			alert("Please input valid text!");
		}
		return false; //prevent page reload after button click
	});

	// clear text
	$("#clear").on("click", () => {
		$("#textarea").val("");
	});
});