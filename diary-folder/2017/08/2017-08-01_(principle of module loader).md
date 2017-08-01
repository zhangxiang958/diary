# principle of module loader

之前看过模块加载器的一点原理，这里再深入模块加载器的原理。模块加载器不是像 webpack 一样的工具，构建打包与加载是不同的，这里的模块加载器是
像 requirejs 这样的东西。

每个模块都应该是一个 module 对象， 包括模块 id，模块 name， 模块 url， 模块依赖 dep， 模块成功回调，模块失败回调， 模块状态。
其中模块状态应该是一个 setter， 当状态变为加载完成的状态， 那么就触发依赖它的模块的依赖数减 1，模块依赖 dep 也是一个 setter，当依赖数为 0 的时候，就说明该模块的依赖已经全部加载完成了，那就会执行模块的 excute 方法执行模块。

模块对应也有几个方法：初始化 init， 通过网络请求进行 fetch， 分析依赖 analyzeDep， 执行模块 excute。

当模块引用变得多或复杂的时候，少不了循环依赖的情况出现。
```
//a
define(['b'], function(b){
    b();
});

//b
define(['a'], function(a){
    a();
});
```
在 commonjs 里面，因为他们本身加载模块是在内存缓存中的，他们是执行脚本然后将他们返回的对象存起来，其他模块引入就直接从缓存中取，所以他们遇到循环
依赖是将已经执行的代码导出
```
//a
exports.done = false;
require('b');
console.log(b.done); //true
exports.done = true;
console.log(a.done); //true

//b
exports.done = false;
require('a');
console.log(a.done); //false
exports.done = true;
```

而对于 ES6， 它只是生成一个模块引用，当需要模块的时候再去取值，所以是动态加载的。


此外还有脚本的异步加载方式：可以通过 XHR eval，也可以通过动态插入 script 节点但是需要自己保证模块执行的顺序。或者使用 document.write 的方法，也就是
document.write('<script type="text/javascript" src="src"></script>'); 这个方法和 dom 节点不同在于它保证并行加载和文件出现顺序执行但是会阻塞其他资源
的加载， dom 节点不阻塞其他资源下载，但是需要自己保证执行顺序。或者使用 defer、async。
对于保证顺序可以使用队列来存储加载了的模块，顺序执行。



links:
require 加载原理： http://www.ruanyifeng.com/blog/2015/05/require.html

commonjs 循环依赖： http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html

http://foio.github.io/javascript-async/
http://foio.github.io/requireJS/

http://www.jianshu.com/p/0505b1718dab


