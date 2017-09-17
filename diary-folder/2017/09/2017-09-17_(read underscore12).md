# read underscore12

源码已经读了超过 1/5 了, 小结一下
前部分的源码, 集合部分, 其实核心方法是 _.each 和 _.map, 后面的很多 API 都是根据这两
函数作出一点修改得到的.
underscore 将大量的对象数组等集合形式的数据用 map-reduce 形式来代替, 取消了 for 循环. 好处在于不必在意循环下标等细节, 可以将注意力放在了函数的
最大的体会就是源码中大量使用了闭包, 柯里化.
编写函数的时候需要注意的就是保持纯, 让函数只做一件事情.这样可以最大程度地保证代码的可阅读性与可复用性.
下面总结一下一些非常有用的函数:
```
javascript 中的类型判断
//判断是不是 NaN
_.NaN: function(obj){}

//判断是不是数字
_.isNumber: function(){}

//判断是不是 Null
_.isNull: function(){}

//判断是不是 undefined
_.isUnderfined: function(){}

//判断是不是函数
_.isFunction: function(){}

//判断是不是对象
_.isObject: function(){}

//判断是不是布尔值
_.isBoolean: function(){}

//判断是不是字符串
_.isString: function(){}

//判断是不是 arguments 对象
_.isArguments: function(){}

//判断是不是 DOM 元素
_.isElement: function(){}
```

批量生产基本类型判断函数:
```
_.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });
```
使用 object 原型的 toString 方法判断数据的类型, 使用 each 来批量生产判断类型的函数. 一般的类型还好说, toString 一般能解决, toString.call 是因为
只有继承于 Object.prototype 的才有.
判断布尔值:
```
isBoolean: function(obj){
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}
```
null: 不能用 toString, 因为 null 是一个对象
```
isNull: function(obj){
  return obj === null;
}
```
undefined: 使用 void 0 是因为 undefined 不是保留字, undefined 可以被重写, 使用 void 命令可以保证 void 0 返回值肯定是 undefined.
```
isUndefined: function(obj){
  return obj === void 0;
}
```
isElement: 检查是不是 DOM 元素, 利用 DOM 节点类型的 nodeType 属性, 属性值为 1 则为元素类型.
```
isElement: function(obj){
  return !!(obj && obj.nodeType === 1);
}
```
object: 对象有很多种, 像数组, Number 等等都可以是对象, 但是为了方便, underscore 只认两种形式的对象: function 和原生对象
```
isObject: function(obj){
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}
```
!! 就是将值强制转化为布尔值, 什么时候该用? 在你需要一个值为布尔值的时候, 那在写 if 语句的时候需不需要? 不需要, 因为 if 语句内部已经做了 if(toBoolean(value))
的操作, 所以 if(!!value) 没有意义.

isNaN:
```
isNaN: function(obj){
    return isNumber(obj) && isNaN(obj);
}
```
这个是因为 NaN 既是一个全局属性, 又是一个 Number 类型的属性, 说明该值不是一个数字.
这里 isNaN 函数先判断它是不是一个 Number 类型, 然后再使用 isNaN 来判断, 这里是对 ES6 的 polyfill 了, 因为 ES6 中 Number 也有 isNaN 方法, 只不过
ES6 Number 的 isNaN 只有在传入的值为数字对象的时候, 并且值为 NaN 才返回 true. 可以使用 toString.call(NaN) 就可以知道 NaN 是 [object Number], 所以这个
polyfill 先判断 Number 类型再使用 NaN 方法. 