# read underscore20

## 迭代
在 underscore 中, 对象, 数组, 类数组都可以进行迭代. 为什么 underscore 需要提供若干个 API 煞费苦心地解决我们的循环问题呢? for 循环到底有什么不好?
```
for(var i = 0; i < length; i++) {
  doSomething(array[i], i);
}
```
这样的代码说不上错误, 但是实在是平庸至极. 
第一, 如果你需要很多个循环, 那么你就需要编写很多次 for 循环, 其实这个是不必要的. 
第二, 面对数组你可能还可以使用简单的 for 循环来应付, 但是面对对象这种 key-value 型的, 你还需要 for-in 循环并且需要注意兼容性问题.
第三, 将遍历的细节封装起来, 并且可以透明访问集合中的元素, 符合设计模式中的迭代器模式, 更有利于代码的可读性与可维护性.

所以我建议在编写代码的时候, 尽量不要使用 for 循环, 而是使用 map/reduce 来代替.
```
_.each = function(obj, iteratee, context){
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if(isArrayLike(obj)) {
    for(var i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var keys = _.keys(obj);
    for(var i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
}
```