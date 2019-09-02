// librerias importados
const fileHound = require('filehound');
const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');


//funcion principal
const mdLinks = ( path, option) => {
  return new Promise((resolve, reject) => {
    if (option.stats && option.validate) {
       searchLinks(path)
         .then(links => {
           statsAndValidateLinks(links)
             .then(statsAndValidateLinks => {
               resolve(statsAndValidateLinks)
             })
         })
    } else if (option.stats) {
      searchLinks(path)
        .then(links => {
          resolve(stats(links))
        })
    } else if (option.validate) {
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
      return new Promise((resolve,reject) => {
      FileHound.create()
      .paths(path)
      .ext('md')
      .find()
      .then(files => {
        console.log("Archivos MD encontrados: ", files);
        if(files.length != 0){
        resolve(files)}
        else {(console.log("No se encontraron archivos .md dentro de " + path))}
      })
      .catch(err => {
      reject(new Error("Ruta no es válida"))
      })
    })

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

//exportando el modulo de funciones
module.exports = {
  mdLinks,
  readPath,
  searchLinks,
  urlValidate,
  stats,
  statsAndValidateLinks
}































