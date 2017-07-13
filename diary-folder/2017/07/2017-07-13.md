# Front Router && Scope chain

## Front Router
前端路由目前如果是做单页面应用都需要一个路由库来支持, 目前有两种路由模式, 一种是 hash 模式, 一种是 html5 提供的 history 接口.
hash: 所谓 hash 也就是 url 中 # 后面的字符串,其实以前我们就已经见过了, a 标签的 '#hash', # 符号以及后面的字符串浏览器不会发送给服务器,
正好用来根据 url 的变化指示页面的内容组件变化
```
//浏览器监听 hash 的变化, 一旦变化就执行函数
window.on('hashchange', function(){
    switchComponent();
});

Router.AppRouer = {

}

Router.route('/path', function(){
    
    switchToPathComponent();
});

```
上面是路由 hash 变化的大概内容.

另外一种是 history 路由, 主要是利用了 pushState() 和 popState() 这两个 API, 这两个 API 修改的路由必须要同域, 否则会报错.
明天我将会实现一个简单的路由库.
links:
https://segmentfault.com/a/1190000007422616#articleHeader4
https://segmentfault.com/a/1190000007238999
https://github.com/cheft/minrouter
https://juejin.im/entry/5887833d8d6d81006cf781b4
https://github.com/joeyguo/blog/issues/2
http://kdylan.me/2016/05/21/hash-router/
https://github.com/k-dylan/SRouter/blob/master/src/SRouter.js

## Scope chain
所谓作用域链就是函数变量对象的列表，可以在函数执行的时候找到相对应的变量值。
```
var x = 10;

function foo(){
    var y = 20;

    function bar(){
        var z = 30;
        console.log(x + y + z);
    }

    bar();
}
```
这样的话，全局变量对象就是
```
VO {
    x: 10,
    foo: FunctionReference
}
```

foo 函数变量对象就是：
```
AO {
    y: 20,
    bar: FunctionRenference,
    [[scope]]: {
        global.VO
    }
}
```

bar 变量对象就是：
```
AO {
    z: 30,
    [[scope]]: {
        foo.AO,
        global.VO
    }
}
```
所以这样就解释了函数内部可以访问函数外部变量，而外部函数不能访问函数内部的变量，就是因为函数的变量对象列表，也就是作用域链不能找到这个变量的解析。
这也解释了闭包的存在，不过值得注意的是函数在创建的时候已经将变量对象生成了，也就是说在函数定义的时候，作用域链已经存在，所以访问的是生成声明的时候的变量。(函数有两个时间，一个创建时间，就是在这个时间函数创建了变量对象，包含了scope，另一个是激活时间，将活动对象推到作用域的前端)
```
var x = 10;

function foo() {
    console.log(x);
}

(function(){
    var x = 20;
    foo();  // 10, not 20
}());
```
通过 Function('....'); 这样创建的函数，它的作用域链始终只有全局对象变量对象，所以没有办法创建闭包。

对于作用域链，它有二维查找，第一步在作用域链中查找，第二是作用域链的每个环节，然后深入到原型链中。
```
function foo(){
    console.log(x);
}

Object.prototype.x = 10;

foo(); // 10
```
