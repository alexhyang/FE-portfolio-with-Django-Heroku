$(function(){
    /*$('#resultTable').hide();
    $('#resultTable').show();

    $('#textarea').on('keypress', () => {
        $('#counter').html($('#textarea').val());
         if ($('#textarea').val() !== "") {
            $('#count').prop('diabled', false);
            $('#clear').prop('diabled', false);
        } else {
            $('#count').prop('diabled', true);
            $('#clear').prop('diabled', true);
        } 
    })*/

    $('#count').on('click', () => {
        let textArr = strToArr($('#textarea').val());
        $('#counter').html(`${textArr.length} words`);
        $('#result').val(textArr.join(','));
        let textDict = countFreq(textArr);
        showTable(textDict, $('#freq-table')); //$('#addToLastCheck').is(':checked')
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

    function showTable(freqObj, tableRef) {
        // obj, table jQuery object -> update table
        // include frequency information in a string

        // reset table rows
        tableRef.find("tr:gt(0)").remove();
        // show table
        for (key in freqObj) {
            tableRef.append('<tr><td>' + key + '</td>' + '<td>' + freqObj[key] + '</td></tr>');
        }
    }

});