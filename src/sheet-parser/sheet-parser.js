"use strict";
exports.__esModule = true;
exports.fetchSpreadsheetData = void 0;
var fetch = require("node-fetch");
function fetchSpreadsheetData(callback) {
    fetch("https://docs.google.com/spreadsheets/u/0/d/1lSTbhpqodhqQn7Dg5cN-lcBavdOuimGOKFMg9tVhIMA/gviz/tq?tqx=out:html&tq&gid=1540266327")
        .then(function (res) { return res.text(); })
        .then(function (body) {
        callback(createPlayerList(formatSheetsData(body)));
    });
}
exports.fetchSpreadsheetData = fetchSpreadsheetData;
function createPlayerList(sheetsData) {
    return sheetsData.map(function (entry) { return ({
        id: entry[0],
        name: entry[1],
        gangName: entry[3],
        rating: entry[8]
    }); });
}
function formatSheetsData(rawString) {
    var newString = rawString;
    newString = newString.replace(/\r?\n|\r/g, "");
    newString = newString.replace(/<tr style="background-color: #f0f0f0">/g, "<tr>");
    newString = newString.replace(/<tr style="background-color: #ffffff">/g, "<tr>");
    newString = newString.replace(/<td align="right">/g, "<td>");
    newString = newString.replace(/<\/tr>/g, "");
    // Cut off the start and end junk
    newString = newString.split("@ Join</td>")[1];
    newString = newString.split("</table></body>")[0];
    var rawRows = newString.split("<tr>").filter(function (x) { return x.length > 0; });
    var finalRows = rawRows.map(function (row) {
        return row.split(/<td>|<\/td><td>|<\/td>/).slice(1);
    });
    finalRows = finalRows.filter(function (row) { return row[1] !== "&nbsp;"; });
    return finalRows;
}
// fetchSpreadsheetData((result: any) => {
//   console.log(result);
// });
