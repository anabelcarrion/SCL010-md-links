// librerias importados
const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');
const pathLib = require('path');

//funcion principal
const mdLinks = (path, option) => {
  return new Promise((resolve, reject) => {
    //convirtiedo de relativa a absoluta la ruta
    paths = [];
    if (!pathLib.isAbsolute(path)) {
      path = pathLib.normalize(path)
      path = pathLib.resolve(path)
    }
    if (fs.lstatSync(path).isDirectory()) {
      let files = fs.readdirSync(path);

      //listing all files using forEach
      files.forEach(function (file) {
        if (file.substr(-3) === ".md") {
          file = pathLib.normalize(file);
          file = pathLib.resolve(file);
          paths.push(file);
        }
      });
    }
    if (fs.lstatSync(path).isFile()) {
      paths.push(path)
    }
    let response = [];
    let promises = paths.map(p => {
      return new Promise((resolve, reject) => {
        if (option.stats && option.validate) {
          searchLinks(p)
            .then(links => {
              statsAndValidateLinks(links)
                .then(statsAndValidateLinks => {
                  response.push(statsAndValidateLinks)
                  resolve(statsAndValidateLinks)
                })
            })
        } else if (option.stats) {
          searchLinks(p)
            .then(links => {
              response.push(stats(links))
              resolve(stats(links))
            })
        } else if (option.validate) {
          searchLinks(p)
            .then(links => {
              urlValidate(links)
                .then(urlValidate => {
                  response.push(urlValidate)
                  resolve(urlValidate)
                })
            })
        } else {
          searchLinks(p)
            .then(searchLinks => {
              response.push(searchLinks)
              resolve(searchLinks)
            })
        }
      })
    });
    Promise.all(promises).then(res => {
      resolve(response);
    });
  });
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
const urlValidate = (links) => {
  return new Promise((resolve, reject) => {
    let fetchLinks = links.map(x => {
      return fetch(x.href).then(res => {
        x.statusCode = res.status;
        x.status = res.statusText;
      }).catch((err) => {
        x.status = err.code
      })
    })
    Promise.all(fetchLinks).then(res => {
      resolve(links)
    })
  })
};

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
const statsAndValidateLinks = (links) => {
  return new Promise((resolve, reject) => {
    urlValidate(links).then(links => {
      const statusLinks = links.map(x => x.statusCode)
      let okLinks = statusLinks.toString().match(/200/g)
      const totalLinks = links.length
      let brokenLinks = 0

      if (okLinks != null) {
        okLinks = okLinks.length
      } else {
        okLinks = 0
      }

      brokenLinks = totalLinks - okLinks
      resolve({
        total: totalLinks,
        ok: okLinks,
        broken: brokenLinks
      })
    }).catch(err => {
      reject(err)
    })
  })
};

//exportando el modulo de funciones
module.exports = {
  mdLinks,
  searchLinks,
  urlValidate,
  stats,
  statsAndValidateLinks
};
