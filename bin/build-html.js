var fs = require('fs')
var path = require('path')
var pug = require('pug')
var mkdirp = require('mkdirp')
var { version } = require('../package.json')
var parallel = require('run-parallel')

var basedir = path.join(__dirname, '../src/pages')

module.exports = async function (callback) {
  try {
    await processDirectory(basedir)
    callback(null)
  } catch (err) {
    callback(err)
  }
}

function processDirectory (dirname) {
  return new Promise((resolve, reject) => {

    fs.readdir(dirname, async function (err, files) {
      if (err) return reject(err)

      try {
        var promises = files.map(function checkDirectoy (filename) {
          var filepath = path.join(dirname, filename)
          var stats = fs.statSync(filepath)

          return stats.isDirectory() ? processDirectory(filepath) : processFile(filepath)
        })

        await Promise.all(promises)
        resolve()
        
      } catch (err) {
        reject(err)
      }

    })

  })
}

function processFile (filepath) {
  return new Promise((resolve, reject) => {

    fs.readFile(filepath, function (err, str) {
      if (err) return reject(err)

      try {
        var locals = {}
        var fn = pug.compile(str, { basedir: path.join(__dirname, '../src') })
        var html = fn(locals)

        var subfolder = path.relative(path.join(__dirname, '../src/pages'), path.dirname(filepath))
        var folder =  path.join(__dirname, '../dist', subfolder)

        mkdirp(folder, function (err) {
          if (err) return reject(err)

          var output = path.join(folder, path.basename(filepath, '.pug') + '.html')

          fs.writeFile(output, html, function (err) {
            if (err) console.log(err)

            resolve()
          })

        })
      } catch (err) {
        reject(err)
      }
    })

  })
}