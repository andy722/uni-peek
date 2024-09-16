// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge } = require('electron')
const unicode = require('unicode-properties');

contextBridge.exposeInMainWorld('unicode-api', {
  getInfo: function (s) {

    let info = []

    function stringAsUnicodeEscape(str){
      return str.split("").map(function(s){
        return "\\u"+("0000" + s.charCodeAt(0).toString(16)).slice(-4);
      }).join(" ");
    }

    Array.from(s).forEach(function (c) {
      if (info.find(e => e.symbol === c)) {
        return
      }

      let cp = c.charCodeAt();

      let name = [];

      if (unicode.getScript(cp) !== null && unicode.getScript(cp) !== 'null') {
        name.push(unicode.getScript(cp));
      }

      if (unicode.isLowerCase(cp)) {
        name.push("LowerCase");
      }

      if (unicode.isUpperCase(cp) || unicode.isTitleCase(cp)) {
        name.push("UpperCase");
      }

      if (unicode.isAlphabetic(cp)) {
        name.push("Letter");
      }

      if (unicode.isDigit(cp)) {
        name.push("Digit");
      }

      if (unicode.isPunctuation(cp)) {
        name.push("Punctuation");
      }

      if (unicode.isWhiteSpace(cp)) {
        name.push("WhiteSpace");
      }

      if (unicode.isMark(cp)) {
        name.push("Mark");
      }

      if (name.length === 0) {
        name.push("Category: " + unicode.getCategory(cp));
      }

      info.push({
        symbol: c,
        category: unicode.getCategory(cp),
        numericValue: unicode.getNumericValue(cp),
        combiningClass: unicode.getCombiningClass(cp),
        script: unicode.getScript(cp),
        name: name.join(' '),
        code: stringAsUnicodeEscape(c)
      })
    });

    return info
  }
})