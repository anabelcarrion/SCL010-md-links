    
const chalk = require('chalk');

//importo funcion mdLinks
var mdLinks = require('./md-links.js');
export const init = (args) => {

//variable global
let path =args[2];
let options = {
  stats: false,
  validate: false,
}

//dandole valores falso a otions.state options.validate
args.forEach(element =>{
 if( element == "--stats" || element == "-s"){
   options.stats = true
 }
if(element == "--validate" || element == "-v"){
  options.validate = true
}
})

mdLinks.mdLinks(path,options).then(res=>{
  if(options.validate && options.stats){
    return console.log(chalk.magenta("Total Links: "+ res.total)+"\n"+chalk.green("Ok Links: "+res.ok)+"\n"+chalk.red("Broken Links: "+res.broken))
  }
  if(options.validate){
    if(res.length === 0){
      return console.log(chalk.red("No se encontraron links"))
    }
    let validateLinks = res.map(x=>x.file+"  "+ chalk.blue(x.href) +"  "+ chalk.magenta(x.status) +"  "+ chalk.green(x.statusCode)+"  "+chalk.yellow(x.text.substr(0,40)))
    return console.log(validateLinks.join("\n "))
  }
  if(options.stats){
    return console.log(chalk.magenta("Total Links: "+ res.total)+"\n"+chalk.yellow("Unique Links: "+res.unique))
  }else{
    if(res.length === 0){
      return console.log(chalk.red("No se encontraron links"))
    } 
    const resLinks = res.map(x=>x.file+"  "+chalk.blue(x.href)+"  "+chalk.magenta(x.text.substr(0,40)))
    return console.log(resLinks.join("\n "))
  }
}).catch(err=>{
  console.log(chalk.red(err.message))
});
};