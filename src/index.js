const chalk = require('chalk');
const log = console.log;

//importo fincion mdLinks
var mdLinks = require('./md-links.js');
export const init = (args) => {
  mdLinks.mdLinks(args)
  .then(res => {
    console.log(res);
  })
};






























