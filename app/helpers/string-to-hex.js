import Ember from 'ember';

export function stringToHex(string) {
    let hex, i, result = "";
    string = string.replace(/[, ]+/g,'').toLowerCase(); // remove spaces from string and make lowercase
    for (i=0; i<string.length; i++) {
        hex = string.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result;
}

export default Ember.Helper.helper(stringToHex);
