# read underscore3

```
var _ = function(obj){
  if(obj instanceof _) return obj;
  if(!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}
```
这里是创建了 underscore 对象.这个函数的目的其实就是为了创建 underscore 对象, 如果在 new 命令的时候有对象传进来, 那么就将这个对象传给新建对象的 _wrapped 属性存储起来.

```
if(typeof exports != 'undefined' && !exports.nodeType) {
  if(typeof module != 'undefined' && !module.nodeType && module.exports) {
    exports = module.exports = _;
  }
  exports._ = _;
} else {
  root._ = _;
}
```
这段代码如何理解呢? 这个是前端与 node.js 通用的模块封装模式, 我们知道 exports 和 module.exports 是 node 模块化的显著标志, 第一个先判断 exports 是否存在, 还有就是判断 exports
变量是否有 nodeType 属性, 如果有, 说明 exports 变量是一个 html 元素, 所以不使用 node 方式模块加载, 同理 module 变量也是这样.这里不再细讲 exports 和 module.exports 的区别, 简单总结就是 exports 看作是 module.exports 的一个快照.

```
var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-parameter case has been omitted only because no current consumers
      // made use of it.
      case null:
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };
```
