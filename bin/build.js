var mkdirp = require('mkdirp')
var buildHTML = require('./build-html')
var buildCSS = require('./build-css')

mkdirp.sync('dist')
buildHTML(function (err) {
  buildCSS(function (err) {
  
  })
})



