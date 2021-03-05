function updateTotalNumber(inputText, element) {
	let textArr = strToArr(inputText);
	let uniqueNumber = uniqueWords(textArr);
	element.html(`${uniqueNumber} / ${textArr.length} (unique / total words)`);
}

function showTable(inputText, tableRef) {
	let textDict = countFreq(strToArr(inputText));
	createTable(textDict, tableRef);
}

/* Helper functions */

function strToArr(str) {
	// str -> arr
	// extract each word in the long string and store the words in an arr

	if (true) {
		// change condition later???
		str = str.toLowerCase();
	}
	return str
		.trim()
		.split(/[^A-Za-z\-]+/)
		.filter((str) => str !== "");
}

function countFreq(arr) {
	// arr -> object
	// calculate the frequency of each word and store count in an object

	let freqObj = {};
	for (var i in arr) {
		if (arr[i] in freqObj) {
			freqObj[arr[i]]++;
		} else {
			freqObj[arr[i]] = 1;
		}
	}
	return freqObj;
}

function createTable(freqObj, tableRef) {
	// obj, table jQuery object -> update table
	// include frequency information in a string

	// reset table rows
	tableRef.find("tr:gt(0)").remove();
	// show table
	for (var key in freqObj) {
		tableRef.append(
			"<tr><td>" + key + "</td>" + "<td>" + freqObj[key] + "</td></tr>"
		);
	}
}

function uniqueWords(textArr) {
	let arr = [];
	for (var i in textArr) {
		if (!arr.includes(textArr[i])) {
			arr.push(textArr[i]);
		}
	}
	return arr.length;
}

//export { updateTotalNumber, showTable };