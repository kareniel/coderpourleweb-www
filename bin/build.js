var mkdirp = require('mkdirp')
var buildHTML = require('./build-html')

mkdirp.sync('dist')
buildHTML(function (err) {
  
})



