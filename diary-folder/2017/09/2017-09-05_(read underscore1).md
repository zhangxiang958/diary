# read underscore1

想要进一步扎实自己的 javascript 功力, 所以阅读一下 underscore 的源码希望将一些工具函数记住, 提高编码效率.
看的是 underscore 1.8.3, 就是 github 上的版本, 首先需要看的就是整体文件. 整个 underscore 有 1491 行, 比之前的 zepto 少了一点(虽然 zepto 没有细读).

首先当然是将所有函数封装在一个 IIFE 里面, 避免污染全局对象:
```
(function(){
    
}());
```
第一行代码:
```
var root = typeof self == 'object' && self.self === self && self || 
          typeof global == 'object' && global.global === global && global ||
          this ||
          {};
```
第一行代码就有所收获, self 是 window.self, self 属性是对窗口的自身的只读引用, 经常会使用 self 来代替 window 对象. 之前在防 HTTP 劫持的时候就是用 window.top 是不是等于
window.self 来判断是不是被劫持了.
第一行的意思就是是不是在客户端也就是 window 对象里面, 如果 self 是一个对象而且 self.self === self 的话那么就说明是在浏览器端, 就将 self 值传给 root, 相当于下面:
```
var root = typeof self == 'object' && self.self === self && self;

// var root = true && true && self;  
// ==> 
// var root = self;
```
global 是 node 环境下的全局对象的引用, 类似于 self, global.global === global 的话就说明是 node 环境下, 那么就是:
```
var root = typeof global == 'object' && global.global && global;

// var root = true && true && global;
// ==>
// var root = global;
```
如果都不是那么就是在其他的一些 js 环境里面比如 web worker, 你可以在浏览器里面试试, 打印出来的 this 是 worker 对象:
```
new Worker('console.log(this);');  //  Worker { onmessage: null, onerror: null }
```
所以 root 用这个 this 对象.如果最后连 this 对象都不存在, 那么就让 root 值为一个对象.

第二行:
```
// 将 root 对象里面的 _ 属性缓存起来, 全文后面之后 noConflict 函数有用到这个 previousUnderscore 变量. 
var previousUnderscore = root._;
```
这个就是防冲突函数 noConflict, 具体是什么意思呢? underscore 使用了 '_' 这个变量, 如果有其他地方有用到这个变量, 那么就使用 noConflict 函数还原, 也就是 root._ = previousUnderscore. 然后函数返回 underscore 在 root._ 设置的那个对象也就是 return this;, 然后你可以使用其他的命名:
```
var us = _.noConflict();
```
第三行:
```
var ArrayProto = Array.prototype, Objproto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
```
将常用的 Array.Protype 数组对象原型, Object.prototype 对象原型用变量缓存起来, Symbol.protytope 也缓存起来, 为什么要缓存起来呢? 原因是这些原型对象需要被经常性使用,
第一是缓存提高读取速度, 第二是为了 javascript uglify 化, 因为如果多次使用 Array.prototype, 那么就无法压缩, 因为如果用其他变量名来代替, 就无法正确获取, 请看:
```
var ArrayProto = Array.prototype, Objproto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

ArrayProto ...  Objproto ....

==>

var a = Array.prototype, b = Object.prototype;
var c = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

a ... b ....
``` 
可以看到轻便了许多.