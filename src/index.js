const chalk = require('chalk');

//importo funcion mdLinks
var mdLinks = require('./md-links.js');
export const init = (args) => {

  let path = process.argv[2];
  let options = {
    stats: false,
    validate: false,
  }

  //dandole valores falso a otions.state y options.validate
  args.forEach(element => {
    if (element == "--stats" || element == "-s") {
      options.stats = true
    }
    if (element == "--validate" || element == "-v") {
      options.validate = true
    }
  })


  mdLinks.mdLinks(path, options).then(resList => {
    resList.forEach(res => {
      if (options.validate && options.stats) {
        if (res.total === 0) {
          return console.log(chalk.red("No se encontraron links"))
        }else{
        let validateAndStats = chalk.magenta("Total Links: " + res.total) + "\n" + chalk.green("Ok Links: " + res.ok) + "\n" + chalk.red("Broken Links: " + res.broken);
        return console.log(validateAndStats);
        }
      }
      if (options.validate) {
        if (res.length === 0) {
          return console.log(chalk.red("No se encontraron links"))
        }else{
        let validate = res.map(x => x.file + "  " + chalk.blue(x.href) + "  " + chalk.magenta(x.status) + "  " + chalk.green(x.statusCode) + "  " + chalk.yellow(x.text.substr(0, 40)));
        return console.log(validate.join("\n "));
      }
      }
      if (options.stats) {
        if (res.total === 0) {
          return console.log(chalk.red("No se encontraron links"))
        }else{
        let stats = chalk.magenta("Total Links: " + res.total) + "\n" + chalk.yellow("Unique Links: " + res.unique);
        return console.log(stats);
        }
      }
      if( !options.stats && !options.validate){
        if (res.length === 0) {
          return console.log(chalk.red("No se encontraron links"))
        }else{
        let validate = res.map(x => x.file + "  " + chalk.blue(x.href) + "  " + chalk.yellow(x.text.substr(0, 40)));
        return console.log(validate.join("\n "));
      }
      }
    });
    
  }).catch(err => {
    console.log(chalk.red(err.message))
  });
};
