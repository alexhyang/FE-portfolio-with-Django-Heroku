document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');
    const inputText = document.querySelector('#text_input');
    const sentence = document.querySelector('#sentence');
    const sentenceBreakdown = document.querySelector('#sentence_breakdown');
    const freqTable = document.querySelector('#freq_table');

    form.addEventListener('submit', (event) => {

        event.preventDefault();
        
        // sentence breakdown
        let textArr = [];
        textArr = breakdown(inputText.value);
        sentenceBreakdown.innerHTML = textArr.slice(0, 20).join(', ') + ' ...';

        // count frequency and display the table
        textDict = countFreq(textArr);
        display(textDict, freqTable);

        //return false;
    })

    function breakdown(str) {
        // str -> arr
        // extract each word in the long string and store them in an arr
        return str.trim().split(/[^A-Za-z]+/).filter(str => str !== '');
    }

    function countFreq(arr) {
        // arr -> object
        // calculate the frequency of each word and store in an object
        let freqObj = {};
        for (i in arr) {
            if (arr[i] in freqObj) {
                freqObj[arr[i]]++;
            } else {
                freqObj[arr[i]] = 1;
            }
        }
        return freqObj;
    }

    function display(obj, tableRef) {
        // obj, table target -> update table
        // include frequency information in a string
        for (i in obj) {
            let newRow = tableRef.insertRow(-1);
            let word = newRow.insertCell(0);
            let count = newRow.insertCell(1);
            word.innerHTML = i;
            count.innerHTML = obj[i];
        }
    }

});