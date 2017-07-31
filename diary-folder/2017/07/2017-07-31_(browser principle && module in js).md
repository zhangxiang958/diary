# browser principle && module in js

## browser principle
浏览器分为用户界面，渲染引擎，网络，浏览器引擎， js引擎，数据存储。 
对于渲染引擎：解析 HTML 代码得到 DOM 树，构建 render 树，布局树，绘制。解析将节点流变成token， token 变为标签，标签转化为 DOM 树，构建渲染树，布局树，绘制
实际上解析就是类似于语法分析与词法分析的过程，通过匹配，在构建 DOM 树的过程中，依赖于树的构建算法，其实相当于状态机，这个部分还会纠错，将一个没有闭合或者漏掉的标签补齐。所以不会在 html 上看到无效的语法这样的错误。

CSS 解析也是类似的，将 CSS 通过匹配解析，构建样式树。自顶向下，将 CSS 样式解析为一个个对象。

脚本解析，是同步的，浏览器会先请求文件，然后解析文件，然后执行，在这个过程中，会阻塞 html 文档的渲染与解析。但是像很多浏览器都做了一些优化，采用预解析，
也就是说，会有两个进程，一个加载执行脚本， 一个解析剩下的文档，而对于样式表，因为有可能在脚本里面就会请求一个外部样式表，如果是这样，样式表异步的话有可能脚本
获取的样式计算是错误的。所以一些浏览器会倾向于在样式表还在加载解析的时候阻塞所有脚本。chrome 则是在试图访问那些还未加载解析完成的样式表的时候阻塞那些脚本。

渲染树与 DOM 树对应，但是不是一一对应，一些不可见元素不会插入到渲染树中，比如 head，display:none 这样的元素。

CSS 解析会对应生成规则树，因为使用样式共享，在样式匹配的过程中，如果发现有兄弟元素设置了样式，可以使用兄弟元素的路径，加快解析速度。
浏览器的渲染进程是单线程的，所以 javscript 的执行会阻塞渲染进程的解析。


## module in js
AMD 模块就是浏览器端异步加载模块的规范，浏览器不可能过多地存储模块在客户端，而且根据按需加载，所以异步加载是需要的。AMD 规范在 requirejs 体现得淋漓尽致。
```
//some
define(['jquery.js'], function($){
    ....
});

//index
require.config({
    path: {
        jquery: 'jquery.min',
        'some': 'some'
    }
});

define(['some'], function(some){
    some();
});
```
上面就是 AMD 模块加载的形式，前面先写上依赖的模块，后面写上回调。
对于 CommonJS，它主要是服务端同步加载模块的规范，因为在服务端一般文件都是放在本地，所以可以使用同步加载。
```
//some
exports.some = function(){

}

//main
var some = require('./some.js');

console.log(some.some());
```
上面的就是用了 commonjs 的加载形式。也就是 exports 与 module.exports 的使用方式，在编译的过程中，node 会对文件进行包装
```
(function(exports, require, module, __filename, __dirname){
    //file
});
```
上面 module 就是指代的模块，exports 与 module.exports 指向一个空对象。
而所谓 UMD 规范就是通用规范，也就是兼容 AMD 与 CommonJs 的加载方式：
```
(function(root, factory){
    if(typeof define === 'function' && define.amd){
        define([], factory);
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.moduleName = factory();
    }
}(this, function(){
    return {

    }
}))
```
ES6 也提供了模块机制，而且非常强大。它使用 export 导出，使用 import from 引入，当然还有一些好用的小技巧比如 export default 这样的导出方式。
而对于 webpack 来说，就是模块管理工具。它同是支持 AMD ，CommonJs 的规范。它的基本概念就分为 entry 入口作为模块入口，分析依赖关系， output 产出，打包生成的文件，chunk 分片将单个文件进行拆分优化性能，loader 加载器用于处理各类文件。

links:
https://webpack.toobug.net/zh-cn/chapter2/amd.html
https://github.com/Aphasia2015/webLog/issues/12
