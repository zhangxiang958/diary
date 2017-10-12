# read underscore22

## 链式调用
链式语法非常语义化, 写出的代码非常流畅, 所以我给自己的目标就是今后的代码都尽量使用链式语法.所以怎么样才能包装出一个通用的函数?
```
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);
```
其实在 underscore 里面, chain 方法就是用 _ 构造方法将传入的 obj 包装成一个 underscore 对象, 那么这样就可以连续地使用.
这里还是借用了 OOP 也就是面向对象的方法, 将方法都放在对象的 prototype 上.
其实核心方法并不在 chain, 而是在 mixin 方法, 它在一开始就执行了 mixin 函数, mixin 将 _ 里面的方法提取出来(functions), 然后将这些函数都进行包装.
这里的包装返回需要注意的是, 需要通过 flag 值来判别是否启用链式语法, 如果是才返回包装过的结果对象, 但是没有启用 chain, 也就是 _.chain 为 false, 那么就返回函数本身的返回值.