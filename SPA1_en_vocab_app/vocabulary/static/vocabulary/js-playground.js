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

        // count frequency
        textDict = countFreq(textArr);
        freqTable.innerHTML = display(textDict);

        return false;
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

    function display(obj) {
        // obj -> str
        // include frequency information in a string
        msg = '';
        for (i in obj) {
            msg += i + ": " + obj[i] + "\n";
        }
        return msg;
    }

});