const botApiUrl = 'botが動いているwebアプリのurl';

function myFunction() {
  UrlFetchApp.fetch(botApiUrl);
}

function setTrigger() {
  ScriptApp.newTrigger('myFunction')
    .timeBased()
    .everyMinutes(1)
    .create();
}
