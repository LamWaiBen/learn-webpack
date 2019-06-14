const path = require('path')
const argv = require('yargs').argv

const webpack = require('../lib/webpack')

let curPath = process.cwd()

let options = {}

let [input, output = 'output.js'] = argv._
if (!input) return

options.input = path.join(curPath, input)

options.context = path.dirname(options.input)

if(path.isAbsolute(output)){
    options.output = output
}else{
    options.output = path.join(options.context, output)
}

webpack(options)