# Function && Frontend Security


## Function 
函数声明, 函数声明是以 function 开头的, 在进入执行上下文就会创建, 那就是为什么函数可以在声明前使用, 也就是变量提升. 它存储在上下文的变量对象中.
函数表达式,而所谓函数表达式, 就是类似 var foo = function(){...} 这样的, 他们不会变量提升, 在代码执行阶段执行.函数标识符后面可以跟命名函数也可以跟匿名函数.
也有立即执行表达式这种形式的
```
+function (){


}

(function(){


})();


(function foo(){


}());

```
具体是当第一个字符不是 function 而是其他的标识符的话, 那么编译器就会认为这是一个函数表达式而不是一个函数声明, 同样的, 这些函数表达式同样可以拥有自己的名字,但是不会存在于上一级执行上下文对象的变量对象中
```
console.log(foo);

(function foo(){
  console.log(foo);
}());

console.log(foo);
```
函数表达式可以帮助我们建立一个局部作用域, 封装起局部变量
```
var foo = {};

(functiong(){
  var test = 0;

  foo.bar = function(){
    test ++;
  }
}());

foo.bar();
```
如果解释器知道这个一个表达式, 可以不需要用外部的圆括号来括住
```
var foo = {
  bar: function(x){
    return x === 1 ? 'foo' : 'bar'
  }(1)
}

console.log(foo.bar);  //'foo'
```
这里我们可以看到, 返回来的是一个字符串, 因为解释器在解释的时候, 知道对象中的是函数表达式, 所以立即执行了.
如果是立即执行函数表达式, 如果添加了命名, 那么它的变量对象是怎么样的呢? 命名函数表达式在创建的时候, 解释器创建了一个特殊对象, 并将这个对象压入作用域前端, 然后函数表达式的作用域与这个作用域链链接, 特殊对象中存储函数表达式的信息
```
speacilObj = {};

Scope = speacilObj + Scope;

FEName = new FunctionExpression();
FEName[[scope]] = Scope;
speacilObj.FEName = FEName;

```
如果使用 Function 这样构造器来构造函数会需要更多的资源, 因为每次都是会创建不同的函数对象, 但是如果是声明或者是函数表达式等就不会, 如果 [[scope]] 相同则会使用同一个函数对象.

创建一个函数的算法:
```
Func = new NativeObject();

Func.[[Class]] = 'Function';

Func.protoytpe = Function.prototype;

Func[[call]] = function;


Func.[[constructor]] = Function

Func[[scope]] = activeContext.scope;
Func[[scope]] = globalContext.scope;

Func.length = paramsCount;

obj = new Object();
obj.constructor = Func;

return Func;
```





