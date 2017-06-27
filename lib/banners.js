const figlet  = require('figlet');
const header  = () => figlet.textSync("JS-IL DEMO", { font: 'Standard' });
const started = () => figlet.textSync("Started", { font: 'Slant' });
const closing = () => figlet.textSync("Shutdown", { font: 'Small Slant' });
const error   = () => figlet.textSync("Error", { font: 'Bloody' });

module.exports = {
  header,
  started,
  error,
  closing
}

