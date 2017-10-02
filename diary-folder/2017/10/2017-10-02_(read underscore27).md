# read underscore24

## 自己的链式语法
其实我们需要实现链式语法就是需要在函数在最后返回的时候 return this, 返回这个对象, 然后根据 oop 的 prototype 可以不断调用对象的方法, 但是如果每个方法都需要自己添加
这个 return 语句就非常麻烦, 所以抽象一个方法来代替, 思路就是将原函数重新包装, 类似于装饰者模式, 这样在调用 apply 之后, 可以 return this 对象.
```
function chain(obj, functions){
  functions.forEach(function(name, index){
    var fn = obj[name];
    obj[name] = function(){
      var args = [].slice.call(arguments, 0);
      fn.apply(this, args);
      return this;
    }
  });
}
```

这样就可以:
```
var foo = {
  test: function(){
    console.log('test');
  },
  bar: function(){
    console.log('bar');
  }
}

chain(foo, ['test', 'bar']);

foo.test().bar();
```