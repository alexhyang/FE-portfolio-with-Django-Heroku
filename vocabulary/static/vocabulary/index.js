$(function(){

    let existingFreqObj = {};

    $('#count').on('click', () => {
        let textDict = countFreq(strToArr($('#textarea').val()));
        showTable(textDict, $('#freq-table'), $('#addToLastCheck').is(':checked'));
        return false;
    })

    $('#clear').on('click', () => {
        $('#textarea').val("");
        return false;
    })

    function strToArr(str) {
        // str -> arr
        // extract each word in the long string and store the words in an arr

        if (true) { // change condition later???
            str = str.toLowerCase(); 
        }
        return str.trim().split(/[^A-Za-z\-]+/).filter(str => str !== '');
    }

    function countFreq(arr) {
        // arr -> object
        // calculate the frequency of each word and store count in an object

        let freqObj = {};
        for (i in arr) {
            if (arr[i] in freqObj) {
                freqObj[arr[i]]++;
            } else { freqObj[arr[i]] = 1; }
        }
        return freqObj;
    }

    function showTable(freqObj, tableRef, update) {
        // obj, table jQuery object -> update table
        // include frequency information in a string

        // update freqObj
        if (update === true){ 
            for (key in freqObj) {
                if (key in existingFreqObj) {
                    existingFreqObj[key] += freqObj[key];
                } else {
                    existingFreqObj[key] = freqObj[key];
                }
            }            
            freqObj = existingFreqObj;
        }
        // reset table rows
        tableRef.find("tr:gt(0)").remove();
        // show table
        for (key in freqObj) {
            tableRef.append('<tr><td>' + key + '</td>' + '<td>' + freqObj[key] + '</td></tr>');
        }
    }

});