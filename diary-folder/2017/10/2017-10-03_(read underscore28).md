# read underscore25

集合篇差不多了, 之后会将函数式的代码作为今后编写代码的目标, 但是无论如何, oop 是不可以丢弃的, oop 即面向对象的思想在 javascript 中就是 prototype 那一套.
虽然我们可以将很多工具函数封装成一个个函数, 但是之间可能没有关联, 其实我们没有必要每一个东西都用一个类来包装, 这样稍显累赘, 我们可以稍微将需要使用工具函数的对象进行包装,
让他可以使用这些函数.
```
function underscore(obj){
  if(obj instanceof underscore) return obj;
  if(!(this instanceof underscore)) return new(obj);
  this._wrap = obj;
}
```
然后工具函数就可以写在这个 underscore 的类上面, 比如 underscore.tool = function(){} 这样, 之前在自己封装类库的时候, 确实是使用了原型的方式, 但是确实不是属于简洁的方法, 
所以就今后封装改为使用这样, 这样的话构造函数里面就可以像上面这样, 不用再像之前那样只是一个空对像, 这样有两种使用方式, 非常好.
像之前写的懒加载脚本, lazyload.init() 这样, 其实可以提供两种用法, lazyload(list).init()  /  lazyload.init(list)
改良后的函数库:
```
(function(root, factory){
  if(typeof define === 'object' && define.amd) {
    define([], factory);
  } else if(typeof module === 'object' && module.exports){
    module.exports = factory();
  } else {
    root.tools = factory();
  }
}(window, function(){

  var tools = function(obj){
    if(obj instanceof tools) return obj;
    if(!(this instanceof tools)) return new tools(obj);
    this.wrapped = obj;
  }

  tools.map = funtion(){

  }

  ....

  function mixin(obj){
    for(var key in obj){
      if(obj.hasOwnProperty(key)) {
        if(Object.prototype.toString.call(obj[key]) === '[object Function]') {
          obj.prototype[key] = obj[key];
        }
      }
    }
  }

  mixin(tools);

  return tools;
}));
```