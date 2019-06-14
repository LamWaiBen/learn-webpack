/**
 * 获取模块所包含的依赖
 */

const tarverse = require('babel-traverse').default

module.exports = function(ast){
    const dependencies = []

    tarverse(ast, {
        // 定义变量语句   处理COMMONJS
        VariableDeclaration(path) {
            for (let declarator of path.node.declarations){
                let expression = declarator.init
                
                // 表达式类型
                if (expression.type === "CallExpression"){
                    if (expression.callee 
                        && expression.callee.name === 'require' 
                        && expression.callee.type === 'Identifier'
                        && expression.arguments && expression.arguments.length === 1){
                        console.log('COMMONJS, expression:', expression)
                        dependencies.push(expression.arguments[0].value)
                    }
                }
            }
        },

        // 处理 ES6 模块 
        //ImportDeclaration 类型的 AST节点, 是 `import xx from xxx`
        ImportDeclaration(path) {
            const sourcePath = path.node.source.value
            console.log('ES6 module, path:', path.node.source)

            dependencies.push(sourcePath)
        }
    })

    return dependencies
}
