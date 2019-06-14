/**
 * loader对代码转换
 */


module.exports = function(filename, code){
    if (/index/.test(filename)) {
        console.log('this is loader ')
    }
    return code
}