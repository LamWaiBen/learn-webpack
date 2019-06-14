const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
// const tarverse = require('babel-traverse').default
const { transformFromAst, transform, transformFileSync } = require('babel-core')

const parse = require('./parse')
const loader = require('./loader')

let ID = 0

module.exports = function (options){
    let { input, output, context } = options

    // 获得入口文件的依赖
    //  mid, code, dependencies, filePath
    const inputAsset = parseDependencies(input)

    const graph = [inputAsset]

    const mid2Asset = {}

    // 开始遍历引用模块
    for(let asset of graph){

        if (!asset.midMapping) asset.midMapping = {}

        asset.dependencies.forEach(dependencyPath => {

            let absolutePath = path.resolve(context, dependencyPath)
            
            // 兼容省略".js"的写法
            if (path.extname(absolutePath) === "") absolutePath += ".js"
            

            // 判断是否已经引用过这个模块, 如果没有引用过则对其转换, 否则直接获取, 避免重复获取
            let dependencyAsset = null
            if (mid2Asset[absolutePath]){
                dependencyAsset = mid2Asset[absolutePath]
            }else{
                dependencyAsset = parseDependencies(absolutePath)

                mid2Asset[absolutePath] = dependencyAsset
                // push到graph里会继续遍历
                graph.push(dependencyAsset)
            }

            asset.midMapping[dependencyPath] = dependencyAsset.mid
        })
    }

    console.log(graph)


    // 把各个模块的代码放到函数 `function(require, module, exports)` 中, 
    // 达到替换/定义 require,module,exports的效果, 使模块里的这些本来在浏览器上不能用的api也有效果
    let modules = ''
    graph.forEach(asset => {
        modules += `\n/******/${asset.mid}:[\n`
        modules += `function(require,module,exports){\n`
        modules += `${asset.code}\n`
        modules += `}, ${JSON.stringify(asset.midMapping)}],`
        
        // modules += `/******/${asset.mid}:[function(require,module,exports){
        //         \n/******/${asset.code}
        //     \n/******/},
        //     ${JSON.stringify(asset.midMapping)}],
        // \n`
    })

    const template = readFileSync(path.join(__dirname, './template.js'), 'utf-8')

    const wrap = `${template}({${modules}});` // 注意这里需要给 modules 加上一个 {}, 把modules作为对象参数,传到模板中


    writeFileSync(path.resolve(context, output), wrap)
    
}


function parseDependencies(filePath){
    // 读取文本内容
    const rawCode = readFileSync(filePath, 'utf-8')

    // 使用babel的transform方法转换原始代码,获得ast树
    const ast = transform(rawCode).ast

    // 把代码从AST 转换成CommonJS 代码
    const es5Babel = transformFromAst(ast, null, {
        presets: ['env']
    })

    const es5Code = es5Babel.code

    // 存放当前文件所依赖的模块
    const dependencies = parse(ast)

    // 把文件名以及代码传进loader转换
    // todo  
    // webpack的loader之间传递的是转换好的代码,而不是AST, 所以在每一个loader中都需要进行 code -> AST的转换, 所以消耗时间 
    // 参考parcel的loader处理:  直接将AST传递
    const customCode = loader(filePath, es5Code)


    return {
        mid: ID++,
        code: customCode,
        dependencies,
        filePath, 
    }
}