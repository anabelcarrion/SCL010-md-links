const fileHound = require('filehound');
const fs = require('fs');
const marked = require('marked');
const fetch = require('node-fetch');
const pathLib = require('path');
const mdLinks = require('../src/md-links.js');

describe('mdLinks', () => {

  test('deberia estar definida mdLinks', () => {
    expect(mdLinks).toBeDefined();
  });

  test('deberia estar definida urlValidate', () => {
    expect(mdLinks.urlValidate).toBeDefined();
  });

  it('debería retornar  un arreglo con todos links encontrads en el test/test.md', async () => {
    await expect(mdLinks.searchLinks('test/test.md')).resolves.toEqual(
      [{
          file: "test/test.md",
          href: "https://nodejs.org/es/",
          text: "Node.js"
        },
        {
          file: "test/test.md",
          href: "https://nodejs.org/es/",
          text: "Node1.js",
        },
        {
          file: "test/test.md",
          href: "https://daringfireball.net/projects/markdhasdi",
          text: "markdown"
        }
      ]);
  });

  it('debería retornar las url encontradas', async () => {

    test=["https://nodejs.org/es/", "https://daringfireball.net/projects/markdhasdi"];

      await expect(mdLinks.urlValidate(test)).resolves.toEqual(
       test,
      );
  });

  it('debería retornar el total de links y los links unicos de las url', () => {

    test=["https://nodejs.org/es/", "https://nodejs.org/es/", "https://daringfireball.net/projects/markdhasdi"];

      expect(mdLinks.stats(test)).toEqual(
        {"total": 3, "unique": 1}
      );
  });

  it('debería retornar las estadisticas del archivo', async () => {

    options={validate: false, stats: true};

      await expect(mdLinks.mdLinks("test/test.md", options)).resolves.toEqual(
        [{"total": 3, "unique": 2}]
      );
  });

  it('debería retornar las estadisticas y validaciones del archivo', async () => {

    options={validate: true, stats: true};
    await expect(mdLinks.mdLinks("test/test.md", options)).resolves.toEqual(
        [{"broken": 1,"ok": 2,"total": 3}]
      );
  });

  it('debería retornar los links del archivo', async () => {
    path = pathLib.normalize("test/test.md")
    path = pathLib.resolve(path)
    options={validate: false, stats: false};

      await expect(mdLinks.mdLinks("test/test.md", options)).resolves.toEqual(
        [[{
          file: path,
          href: "https://nodejs.org/es/",
          text: "Node.js"
        },
        {
          file: path,
          href: "https://nodejs.org/es/",
          text: "Node1.js",
        },
        {
          file: path,
          href: "https://daringfireball.net/projects/markdhasdi",
          text: "markdown"
        }
      ]]
      );
  });
  
});
