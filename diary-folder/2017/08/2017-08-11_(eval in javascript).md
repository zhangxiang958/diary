# eval in javascript

之前没看 eval, 因为这个函数是被很多书像精粹和富有成效的 js 都提及不要使用, 之前也一直没看, 但是最近有个 bug 需要研究一下它才能得到核心问题.

eval 接收字符串,并执行字符串里面的 javascript 代码:
```
eval("var test = 'test';");
console.log(test);
```

eval 只有在被直接调用和调用函数就是 eval 本身才是在当前作用域下执行:
```
var test = '1';
(function(){
  var test = '2';
  eval("test = '3'");
  console.log(test);  //3
}());

console.log(test);  //1
```

eval 会将一个执行上下文推到作用域链的前端, 所以有可能会有性能问题.

```
var test = '1';
(function(){
  var test = '2';
  var ev = eval;
  ev("test = '3';");
  console.log(test);  //2
}());

console.log(test);  //3
```

而对于 ES5 如果使用了严格模式的话, eval 里面的代码是肯定不会影响到外部的, 严格模式下的 eval 会被包裹在一个作用域内,不会影响 eval 外的变量
