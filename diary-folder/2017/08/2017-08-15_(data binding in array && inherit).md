# data binding in array && inherit
## data binding in array
vue 里面数组非常常用，循环渲染的时候经常用到。其实在 vue 中，监听数组变化实现双向数据绑定就是通过重写数组的数组方法像 push，pop，shift，unshift，slice，splice 等等一些改变数组大小或者数据的方法。
```
original = Array.peototype;
fakeArray.prototype.push = function(){
    console.log('数组被改变了');
    return original.push.call(this, arguments);
}
```
所以我们就懂了为什么 vue 里面必须使用像 $set 或者是 push，pop 这样的方法来改变数组才能触发数据双向绑定，而且不能通过下标或者修改 length 属性来改变数组来触发数据双向绑定，因为无法监听数组的下标属性和 length 属性。
## inherit
这部分是由上面带起的，为什么 vue 作者要使用原型继承也就是类似于 Object.create() 这样的方法来实现数组的数据双向绑定呢？组合继承不是最常用的继承方式吗？
```
function Super(){
    this.super = true;
}

Super.prototype.saySuper = function(){
    console.log('super');
}

function Sub(){
    Super.call(this, arguments);
}

Sub.prototype = new Super();
Sub.prototype.constructor = Sub;

var sub1 = new Sub();
var sub2 = new Sub();
```
组合继承有个问题就在于有一份属性多余了，就是在 Sub.prototype 上面，因为在实例化 Sub 的时候，Sub 实例对象已经有一份 Super 的属性了（Super.call），所以 Sub.prototype 在 new 的时候的那份属性就被屏蔽了，显得多余，改进如下：
```
function beget(obj){
    var Func = function(){};
    Func.prototype = obj;
    return new Func();
}

....
var proto = beget(Super.prototype);
proto.constructor = Sub;
Sub.prototype = proto;
```
截断了 Super.prototype, 但是为什么 vue 作者不用这种继承呢? 原因在于 Array 的特殊性，因为像 String，Object， Array 等等的这些构造函数，都是不对 this 做处理的，也就是在 new 的时候，组合继承没办法使用 Array.call() 这样的方式来达到目的。此外 Array 还有像 length， [[classes]] 这样的内部属性，我们是没有办法模拟出来的， 所以组合继承中的 Array.call 这样的方法就不适用。
所以原型继承就非常适合，直接修改数组的 ```__proto__``` , 让内部原型链指针指向我们伪造的数组。
```
function fakeArray(){
    var arr = Array.apply(null, arguments);
    a.__proto__ = fakeArray.prototype;
    a.constructor = fakeArray;
    return a;
}

fakeArray.prototype.push = function(){
    console.log('change');
    return orginal.push.apply(this, arguments);
}

var arr = fakeArray();
```