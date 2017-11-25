var fs = require('fs')
var URL = require('url')
var path = require('path')
var budo = require('budo')
var mkdirp = require('mkdirp')

var buildHTML = require('./build-html')
var buildCSS = require('./build-css')

mkdirp.sync('dist')

buildHTML(function (err) {
  if (err) {
    console.log('\u0007')
    console.log(err)
    return
  }

  buildCSS(function (err) {
    if (err) {
      console.log('\u0007')
      console.log(err)
      return
    }

    var b = budo('src/index.js:bundle.js', {
      dir: ['dist', 'assets'],
      port: 1111,
      live: true,
      ssl: true,
      pushstate: true,
      stream: process.stdout,
      watchGlob: 'src/**/*.{sss,pug,js}',
      staticOptions: {
        extensions: [ 'html' ]
      }
    })

    b.on('watch', (e, file) => {

      switch(path.extname(file)) {
        case '.sss': {
          buildCSS(done)
          return
        }
        case '.pug': {
          buildHTML(done)
          return
        }
        default:
          return
      }
    })

    function done (err) {
      if (err) {
        console.log('\u0007')
        console.log(err)
        return 
      }

      b.reload()
    }

  })
})
