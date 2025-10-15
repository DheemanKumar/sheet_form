// Google Apps Script code to be deployed as a web app

function doGet(e) {
  // Get the form data from the query parameters
  var name = e.parameter.name;
  var nxt_id = e.parameter.nxt_id;
  var branch = e.parameter.branch;
  var ntfy_id = e.parameter.ntfy_id;
  var reason = e.parameter.reason;

  // Get the active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1"); // Replace "Sheet1" with the name of your sheet

  // Append a new row with the form data
  sheet.appendRow([name, nxt_id, branch, ntfy_id, reason, new Date()]);

  // Return a JSON response
  return ContentService.createTextOutput(JSON.stringify({
    "result": "success",
    "data": JSON.stringify(e.parameter)
  })).setMimeType(ContentService.MimeType.JSON);
}
