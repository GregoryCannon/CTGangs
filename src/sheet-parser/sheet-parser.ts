const fetch = require("node-fetch");

export function fetchSpreadsheetData(callback: Function) {
  fetch(
    "https://docs.google.com/spreadsheets/u/0/d/1lSTbhpqodhqQn7Dg5cN-lcBavdOuimGOKFMg9tVhIMA/gviz/tq?tqx=out:html&tq&gid=1540266327"
  )
    .then((res: any) => res.text())
    .then((body: string) => {
      callback(createPlayerList(formatSheetsData(body)));
    });
}

function createPlayerList(sheetsData: Array<Array<string>>) {
  return sheetsData.map((entry: Array<string>) => ({
    id: entry[0],
    name: entry[1],
    gangName: entry[3],
    rating: entry[8],
  }));
}

function formatSheetsData(rawString: string) {
  let newString = rawString;
  newString = newString.replace(/\r?\n|\r/g, "");
  newString = newString.replace(
    /<tr style="background-color: #f0f0f0">/g,
    "<tr>"
  );
  newString = newString.replace(
    /<tr style="background-color: #ffffff">/g,
    "<tr>"
  );
  newString = newString.replace(/<td align="right">/g, "<td>");
  newString = newString.replace(/<\/tr>/g, "");

  // Cut off the start and end junk
  newString = newString.split("@ Join</td>")[1];
  newString = newString.split("</table></body>")[0];

  let rawRows = newString.split("<tr>").filter((x) => x.length > 0);
  let finalRows = rawRows.map((row) =>
    row.split(/<td>|<\/td><td>|<\/td>/).slice(1)
  );
  finalRows = finalRows.filter((row) => row[1] !== "&nbsp;");
  return finalRows;
}

// fetchSpreadsheetData((result: any) => {
//   console.log(result);
// });
