// librerias importados

const fileHound = require('filehound');
const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');


//aqui se elige que opcion desea ejecutar si validate o stats 
const mdLinks = (args) => {
  let path = args[2];
  let option1 = args[3];
  let option2 = args[4];
  return new Promise((resolve, reject) => {
    if (option1 === '--stats' && option2 === '--validate' || option2 === '--stats' && option1 === '--validate' || option1 === '--s' && option2 === '--v' || option2 === '--s' && option1 === '--v') {
       searchLinks(path)
         .then(links => {
           statsAndValidateLinks(links)
             .then(statsAndValidateLinks => {
               resolve(statsAndValidateLinks)
             })
         })
    } else if (option1 === '--stats' || option1 === '--s') {
      searchLinks(path)
        .then(links => {
          resolve(stats(links))
        })
    } else if (option1 === '--validate' || option1 === '--v') {
      searchLinks(path)
        .then(links => {
          urlValidate(links)
            .then(urlValidate => {
              resolve(urlValidate)
            })
        })
    } else {
      searchLinks(path)
        .then(searchLinks => {
          resolve(searchLinks)
        })
    }
  })
}

// Imprime en terminal los archivos que concuerden con la extención del formato markdown ".md".
const readPath = (path) => {
  return fileHound.create()
    .paths(path)
    .ext('.md')
    .find();
};

// Lee los archivos y extrae links con su información adicional, texto que lo acompaña y hubicación.
const searchLinks = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }
      let links = [];
      const renderer = new marked.Renderer();
      renderer.link = function (href, title, text) {
        links.push({
          href: href,
          text: text,
          file: path
        })
      }
      marked(data, {
        renderer: renderer
      })
      resolve(links)
    });
  })
};

//valida cada link y agrega "status" a cada uno segun respuesta del fetch
const urlValidate = (links) =>{
  return new Promise((resolve, reject) => {
     
      let fetchLinks = links.map(x=>{  
        
        return fetch(x.href).then(res =>{
            x.statusCode = res.status;
            x.status=res.statusText;
          }).catch((err)=>{
            x.status = err.code
          }) 
      })
      
      Promise.all(fetchLinks).then(res=>{
        resolve(links)
      })
      
    
  })
}

//stats de cada link 
const stats = (links) => {
  let href = links.map(x => x.href);
  const uniqueLinks = new Set(href);
  return {
    total: links.length,
    unique: uniqueLinks.size
  };
};

//entrega la cantidad de links totales, links con status OK y links rotos.
const statsAndValidateLinks = (links) =>{
  return new Promise((resolve,reject)=>{
    urlValidate(links).then(links=>{
      const statusLinks = links.map(x=>x.statusCode)
      let okLinks = statusLinks.toString().match(/200/g)
      const totalLinks = links.length
      let brokenLinks = 0

      if(okLinks != null){
        okLinks = okLinks.length
      }else{
        okLinks =  0
      }
      
      brokenLinks = totalLinks-okLinks
      resolve({
        total:totalLinks,
        ok: okLinks,
        broken:brokenLinks})
    }).catch(err=>{
      reject(err)
    })
  })
}


module.exports = {
  mdLinks,
  readPath,
  searchLinks,
  urlValidate,
  stats,
  statsAndValidateLinks
}































