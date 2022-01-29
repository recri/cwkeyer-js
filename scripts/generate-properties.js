#!/usr/bin/env node
// import * from fs
import * from './CWKeyerProperties.js'
// load ./CWKeyerProperties
// for (key in controls) {
//   console.log(`key $key has property ${controls[key].property}`)
// }

// this won't work without a module export
// const props = require('./CWKeyerProperties.js')

//const fs = require('fs')
//fs.readFile('./CWKeyerProperties.js', 'utf8') , (err, data) => {
//  if (err) {
//    console.error(err)
//    return
//  }
//  console.log(data)
//})
console.log(`hello world`)
console.log(`PATH=${process.env.PATH}`)
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

