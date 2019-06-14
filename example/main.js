let a = require('./a.js')
import b from "./b";
// 我是注释1
/**
 * 我是注释2
 */

let c = 'It"s C' 
b()
console.log('main', a)

console.log(c)