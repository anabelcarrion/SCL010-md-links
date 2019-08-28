const fetch = require("fetch");
const fetchUrl = fetch.fetchUrl;

// source file is iso-8859-15 but it is converted to utf-8 automatically
fetchUrl("https://www.facebook.com  ", function (error, meta, body) {
  // console.log("HTTP STATUS:", meta.status);
   // console.log("FINAL URL:", meta.finalUrl);
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    console.log(r.test('https://www.facebook.com')); 

});

fetchUrl("/directorio/prueba.txt", function (error, meta, body) {
    //console.log("HTTP STATUS:", meta.status);
    //console.log("FINAL URL:", meta.finalUrl);
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    console.log(r.test('/directorio/prueba.txt')); 

});



const FileHound = require('filehound');
 
const files = FileHound.create()
  .paths('./')
  .ext('md')
  .find();
 
files.then(console.log);

var file = require('file-system');
file.recurse('path', function(filepath, relative, filename) { });
 
file.recurse('path', [
  '*.css',
  '**/*.js', 
  'path/*.html',
  '!**/path/*.js'
], function(filepath, relative, filename) {  
  if (filename) {
  console.log("es verdadero");
  } else {
    console.log("es verdadero");
  }
});
 
//  Only using files
file.recurse('path', function(filepath, relative, filename) {  
  if (!filename) return;
});