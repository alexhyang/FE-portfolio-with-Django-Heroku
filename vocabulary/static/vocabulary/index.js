$(function(){

    $('#count').on('click', () => {
        let textDict = countFreq(strToArr($('#textarea').val()));
        updateTable(textDict, $('#freq-table'));
        return false;
    })

    $('#clear').on('click', () => {
        $('#textarea').val("");
        return false;
    })

    function strToArr(str) {
        // str -> arr
        // extract each word in the long string and store the words in an arr
        return str.trim().split(/[^A-Za-z]+/).filter(str => str !== '');
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

    function updateTable(obj, tableRef) {
        // obj, table jQuery object -> update table
        // include frequency information in a string
        for (i in obj) {
            tableRef.append('<tr><td>' + i + '</td>' + '<td>' + obj[i] + '</td></tr>');
        }
    }

});