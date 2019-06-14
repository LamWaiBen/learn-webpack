
/******/(function (modules) {
/******/	function require(moduleId) {
/******/	    const [fn, midMapping] = modules[moduleId];
/******/        function childRequire(filename){
/******/            return require(midMapping[filename])
/******/        }
/******/		const module = { exports: {} };
/******/        fn(childRequire, module, module.exports);
/******/        return module.exports;
/******/    }
/******/	return require(0);
/******/})({
/******/0:[
function(require,module,exports){
"use strict";

var _b = require("./b");

var _b2 = _interopRequireDefault(_b);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = require('./a.js');

// 我是注释1
/**
 * 我是注释2
 */

var c = 'It"s C';
(0, _b2.default)();
console.log('main', a);

console.log(c);
}, {"./b":1,"./a.js":2}],
/******/1:[
function(require,module,exports){
"use strict";

var a = require('./a');

var B = 'It"s module B!';

module.exports = function () {
  console.log(B);
};
}, {"./a":2}],
/******/2:[
function(require,module,exports){
"use strict";

var a = "It's module A";
module.exports = a;
}, {}],});