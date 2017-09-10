# read underscore5

```
// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
  // This accumulates the arguments passed into an array, after a given index.
  var restArgs = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };
```
从原作者的注释可看出,这个函数是用来模仿 ES6 语法中的拓展运算符的. 那究竟 ES6 的函数 rest 运算符是怎么样的? 举个简单的例子就懂了:
```
function push(array, ...items){
  items.forEach(function(item){
    array.push(item);
    console.log(item);
  });
}

var a = [];
push(a, 1, 2, 3);
```
这里大家应该就懂了, items 代表的就是除了第一个定义的形参 array 之外, 剩余的其他参数都变成了 items 的一部分, 而 items 会将剩余的所有参数集中起来, 放入一个数组里面, 所以 items 本身
就是一个数组, 里面按顺序存放了除 array 之外的传进来的参数.
那么我们在没有 ES6 语法的情况下, 就需要使用 arguments 对象, 将传进来的没有对应形参名的参数放入到一个数组里面, 所以我们当然需要知道函数本来已经定义了多少个已经命名了的形参的数量, 
假如原来函数已经定义了 2 个参数, 那么我们就从 arguments 的第三个参数也就是 arguments 转化后得到的数组的下标为 2 的元素开始放入到 rest 数组中.
这也就是 startIndex 的意义.
然后通过一个闭包, 缓存起 startIndex 的值, 然后将模拟 rest 数组的生成:
```
return function() {
  var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
  for (; index < length; index++) {
    rest[index] = arguments[index + startIndex];
  }
};
```
初始化一个 rest 数组, 长度为除去命名参数剩下的参数数量, 利用 for 循环将 arguments 除去命名了的参数外得到的数组, 将里面的值赋给 rest 数组.
```
switch (startIndex) {
  case 0: return func.call(this, rest);
  case 1: return func.call(this, arguments[0], rest);
  case 2: return func.call(this, arguments[0], arguments[1], rest);
}
var args = Array(startIndex + 1);
for (index = 0; index < startIndex; index++) {
  args[index] = arguments[index];
}
args[startIndex] = rest;
return func.apply(this, args);
```
这里如果看过之前的 optimizeCb 函数这里就不难理解了, 也是对于 call 和 apply 函数的代码性能优化.如果命名形参少于 3 个就使用 call 来进行硬绑定, 多于 3 个则使用 apply, 最后一个参数就是 rest 数组.
tips:
startIndex 是用来定位下标的, 这里学到一个小技巧就是 function.length 代表函数定义形参的数量, 对于将字符串转化为数字可以使用 +"1" 这样就可以转化为数字 1.


