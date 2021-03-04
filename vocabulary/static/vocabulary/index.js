$(function () {

	// count result
	$("#count").on("click", () => {
		const inputText = $("#textarea").val();
		if (inputText.length > 0) {
			$('#resultTable').show();
			updateTotalNumber(inputText, $("#counter"));
			showTable(inputText, $("#freq-table"));
		} else {
			alert("Please input valid text!");
		}
		$('#result').val(inputText);
		return false; //prevent page reload after button click
	});

	// clear text
	$("#clear").on("click", () => {
		$("#textarea").val("");
	});
});