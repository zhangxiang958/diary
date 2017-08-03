# principle of bundle.js

经常用 webpack,但是对里面 bundle.js 不太了解, 也就是打包出来的那个文件.
用了我之前写的一个小 demo:
```
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var greeter = __webpack_require__(1);

	document.getElementById('root').appendChild(greeter());

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function() {
	  var greet = document.createElement('div');
	  greet.textContent = "Hi there and greetings!";
	  return greet;
	};

/***/ }
/******/ ]);
```
其实我自己写的就是下面那两个函数而已
```
//greeter.js
module.exports = function() {
  var greet = document.createElement('div');
  greet.textContent = "Hi there and greetings!";
  return greet;
};

//main.js
var greeter = require('./greeter.js');

document.getElementById('root').appendChild(greeter());
```
上面明显是用了 commonjs 加载, 问题就在于怎么理解打包出来的 bundle.js. 看到 main 就是第一个模块, 因为 main 是指定的入口文件.
整个 bundle 就是一个自执行表达式, 传进去的 modules 是一个数组, 数组里面存储了我们加载的各个模块. 前面的 var installedModules = {}; 是模块的缓存
然后可以看到, bundle 使用闭包在里面定义了一个函数, require
```
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
```
接收模块的 id, 也就是数组的索引值, 真正执行模块的是
```
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```
而对于模块来说是:
```
function(module, exports, __webpack_require__) {

	var greeter = __webpack_require__(1);

	document.getElementById('root').appendChild(greeter());

}
```
那么就是说, 我们平时所写的那些 js 文件, 其实 module 就是 require 函数中创建的一个对象, 对象中存放是否加载完成的 flag(loaded), 模块 id, 然后还有导出的模块对象 module.exports.
然后平时引用的那个 reqiure 函数这里就替换成 _webpack_require_ 函数, require 函数首先先判断模块是否已经加载过, 如果是就直接返回 exports, 如果没有加载过则在 installedModules 对象爱中存储模块信息, 然后加载模块,也就是直接执行数组中的模块函数, 执行完后修改 loaded 为 true, 并且返回这个模块的 module.exports. 
启动第一个模块就是用 _webpack_require_(0) 开始, 必定是 0 ,因为是第一个模块是入口文件.
每个模块传进 require 函数就是为了模块的加载而传的.如果是两个入口文件的,打包的形式是雷同的,但是注意每个模块的 id 的唯一的, 比如说 a 依赖 b,c, d 依赖 c, a,d 是入口文件, 那个
在 a 的 bundle 里面的 0->a, 1->b, 2->c, 然后 d 的 bundle 里面的 0->d, 1->'', 2->c, 可以看到 d 的 bundle 是没有的, 因为被 b 占据了这个 id, 有个问题就是 webpack 有 common chunk, 它是怎么提取公共模块的? 这个我还不知道.

其实这里还顺带解决了之前的日记中的疑问,就是 module.exports 和 exports 的区别, 简单地来说就是 exports 就是 module.exports 的一个引用, 直接赋值修改引用等等的就是 js 的语言特性导致的. 



tip:
并发与并行：
并发的反义词是顺序，并行的反义词是串行
并发，举个生动的例子就是顺序执行就相当于陪女朋友去看电影（1小时），看完电影去买花（1小时，等待花店搞好花），买了花去吃饭（1小时，等待饭店做好菜），但是如果是并发那么就是陪女朋友看电影（1小时），打电话给花店送花（0.5 小时，看电影过程中已经搞好了）到吃饭的地方，看完电影吃饭（1小时，看电影过程中已经做好菜了），等我看完电影就可以直接送花吃饭了，那这样省了时间，这就是并发在同一时间段有不同的处理线程在帮忙处理任务。

并行的反义词是串行，就相当于给 100 万个元素的数组找出最小元素，串行就是从第一个找到最后一个，类似冒泡，但是并行就是分为 10 个数组，10 个数组分别同时计算，然后将结果再排序，串行改并行会遇到很多问题像锁，共享，任务依赖等等。

最后说说 node 为什么能够处理大量并发，是因为它采取事件形式，在处理并发请求的时候，等待异步 I/O，主线程是空闲的，可以处理后续请求，但是对于 PHP 这些脚本语言，一个线程只能处理一个请求，当大量请求被 IO 阻塞了，而且线程数短缺的话，就无法处理后续请求了，会出现 502 bad gateway。
所以 node 特别适合 IO 密集型场景。

https://www.zhihu.com/question/33515481