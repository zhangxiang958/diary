# read underscore2

继续阅读 underscore 源码.
```
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;
```
将一些常用的原生方法缓存起来, 可以方便压缩和提高读取速度. Array.isArray 方法其实就是我们常用判断是不是数组的方法, 不过我自己常用的是 Object.prototype.toString.call() 这个方法
判断值是不是 [object Array], 如果是就是数组对象, 实际上 Array.isArray 的 polyfill 也是这么做的.
Object.keys 是返回对象的所有键名数组, 这样就可以直接时候迭代器, 而不需要 for in 循环了. Object.create 方法是常用于原型继承的, 它返回一个新的对象, 这个对象和输入的对象已经进行了
原型链中的原型指针的连接(__proto__).

```
var Ctor = function(){};

```

先说第一个 var Ctor = function(){}, 为什么要声明这个函数呢? 看命名 Ctor 知道这是一个构造器, 一开始并不知道这个有什么用, 其实往下看就明白了:
```
var baseCreate = function(prototype){
  if(!_.isObject(prototype)) return {};
  if(nativeCreate) return nativeCreate(prototype);
  Ctor.prototype = prototype;
  var result = new Ctor;
  Ctor.prototype = null;
  return result;
}
```
上面这个函数就是最最常用的组合继承的优化方式, 也就是优化组合继承 Sub.prorotype = new Super() 中子类原型对象有多一份父类的属性这个缺点的. 我们可以看到这个 baseCreate 函数本质上
就是为了连接对象的原型指针 __proto__ 的, 所以 baseCreate 函数会优先使用 Object.create 方法, 如果不兼容则使用 
```
Ctor.prototype = prototype;
var result = new Ctor;
Ctor.prototype = null;
return result;
```
这个方法在高程里面就有, 这里不细讲了, 这里的 Ctor 函数需要是一个"干净"的函数, 只是为了链接两个对象的原型链用, 使用完就会将 Ctor.prototype = null 还原;

```
var _ = function(obj){
  if(obj instanceof _) return obj;
  if(!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}
```
这里是创建了 underscore 对象