# make a webpack1

昨天看了 bundle.js 里面的东西，而对于 webpack 来说，就是如何将多个模块或者是文件打包成这样的单文件，分为几个步骤：
1. 可以发现 bundle.js 和打包后的模块格式都是类似的，应该有一个模板文件
2. 分析依赖，记录模块与模块间的依赖情况。
3. 自动查找模块，因为有时候我们引用模块会直接使用名字，应该像 node 模块查找那样自动查找。
4. 拼接 output 的时候，将模块名字转为模块 id

第一个 template 文件：
```
(function(modules){

	var installedModule = {};

	function _webpack_reqiure(moduleId) {

		if(installedModule[moduleId])
			return installedModule[moduleId];
		
		var module = installModule[moduleId] = {
			exports: {},
			loaded: false,
			id: moduleId
		};

		modules[moduleId].call(module.exports, module, module.exports, _webpack_require_);
		module.loaded = true;
		return module.exports;
	}
}()); 
```
至于分析依赖文件，我一开始也想到正则，但是正则有个问题在于它会把注释里面的也匹配了，万一我注释写的东西和真正请求模块的写法完全一样，那注释里面也加载了模块。另外就是 require 可以会是一个表达式，比如:
```
require('./template' + name + '.ejs');
```
这样的话，正则的作用就有限了。所以需要使用 js 代码解析工具，将 js 代码转成 AST。
另外，由于 webpack 是在浏览器端实现 commonjs 的模块规范，那么就是当加载一个模块的时候是同步加载代码，而且是当这个模块加载执行完了之才加载下一个模块的，所以
当得到 AST 之后，可以使用遍历来遍历模块，由于上面所说的遍历模块的问题，所以采用深度遍历的算法。

上面的解析 AST 树可以用 esprima 这样的库来做, 解析出来的像下面这样:
```
var answer = 6 * 7;  

=> 

{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "answer"
                    },
                    "init": {
                        "type": "BinaryExpression",
                        "operator": "*",
                        "left": {
                            "type": "Literal",
                            "value": 6,
                            "raw": "6"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 7,
                            "raw": "7"
                        }
                    }
                }
            ],
            "kind": "var"
        }
    ],
    "sourceType": "script"
}
``` 
我们在遍历的时候可以只解析那些 type 为 variableDeclaration 这样的, 然后变量语句里面只分析变量类型的 "variableDeclarator" 的, 最后其实就是分析表达式, 也就是 init 部分, 
我在 esprima 的官网上的在线例子试了一下, http://esprima.org/demo/parse.html, 发现如果是 var a = require('./a.js'); 这样的形式就变成下面的形式:
```
var a = require('./a.js');

=> 

{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "answer"
                    },
                    "init": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "Identifier",
                            "name": "require"
                        },
                        "arguments": [
                            {
                                "type": "Literal",
                                "value": "./a.js",
                                "raw": "'./a.js'"
                            }
                        ]
                    }
                }
            ],
            "kind": "var"
        }
    ],
    "sourceType": "script"
}
```
也就是说我们就是分析 init 部分, 然后分析 init 对象的 callee 是不是 name 属性是不是 require, 并且 type 是不是 identifier, 而且 argument 的 length 是不是 1, 因为像上面的就是 1, 如果都符合那么就认为模块通过 require 函数引入模块, 那么就将 arguments 数组压入 module 模块的 reuqire 数组里面, 即记录模块依赖.模块名就是 value.


理解 webpack，首先要知道 4 个核心概念， entry 入口，output 输入文件，chunk 分片，module loader 加载器。

明天继续这部分,也就是依赖分析和查找模块

https://github.com/youngwind/blog/issues/99
http://taobaofed.org/blog/2016/09/09/webpack-flow/