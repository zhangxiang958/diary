# read underscore19

## Typeof
我们都使用 typeof 是用来判断数据类型的命令, 在常规的场景中足以应付数据类型判断的需求:
```
var obj = {
   name: 'zhangxiang'
};

function foo() {
    console.log('this is a function');
}

var arr = [1,2,3];

console.log(typeof 1);  // number
console.log(typeof '1');  //string
console.log(typeof true);  //boolean
console.log(typeof null); //object
console.log(typeof undefined); //undefined
console.log(typeof obj); //object
console.log(typeof foo);  //object
console.log(typeof arr);   //object
```
可以看到, typeof 命令可以判断所有 javascript 中的基本数据类型(Null, Undefined, Boolean, String, Number), 虽然 null 使用 typeof 返回的是 object 字符串, 但是无碍
它的基本使用, 但是在一些复杂的场景比如 object 与 null, array 与 object, function 与 object 等等的类型区分, typeof 就会显得心有余力不足了.
所以一般来说, typeof 会使用在比较简单的场景, 比如你几乎可以确定数据是哪一类数据然后稍微加以区分的时候.举个简单的例子来说明情况:
```
function unique(array){
  var hash = {};
  var result = [], key;
  array.forEach(function(item, index){
    key = item;
    if(typeof item === 'string') {
      key = '_' + item;
    }
    if(!hash[item]) {
      result.push(item);
    } else {
      hash[item] = true;
    }
  });
  return result;
}
```
## instanceof
instanceof 其实适合用于判断自定义的类实例对象, 而不是用来判断原生的数据类型, 举个例子:
```
// a.html
<script>
  var a = [1,2,3];
</script>
```

```
//main.html
<iframe src="a.html"></iframe>

<script>
  var frame = window.frame[0];
  var a = frame.a;
  console.log(a instanceof Array);  // false
  console.log(a.contructor === Array);  //false
  console.log(a instanceof frame.Array); // true
</script>
```
是什么原因导致上面的结果呢? 其实 iframe 之间不会共享原型链, 因为他们有独立的执行环境, 所以 frame a 中的数组 a 不会是本执行环境的实例对象. 通过特性嗅探同样不靠谱, 像通过 contructor
sort, slice 等等的特有的数组(或者其他数据类型)方法或属性, 万一对象中也有 sort, slice 属性, 就会发生误判. 所以最靠谱的方法是使用 Object.prototype.toString 方法.

## Object..prototype.toString
使用 Object.prototype.toString 方法, 可以获取到变量的准确的类型.
```
function foo(){};

Object.prototype.toString.call(1);  '[object Number]'
Object.prototype.toString.call('1'); '[object String]'
Object.prototype.toString.call(NaN); '[object Number]'
Object.prototype.toString.call(foo);  '[object Function]'
Object.prototype.toString.call([1,2,3]); '[object Array]'
Object.prototype.toString.call(undefined); '[object Undefined]'
Object.prototype.toString.call(null); '[object Null]'
Object.prototype.toString.call(true); '[object Boolean]'
....
```
Object.prototype.toString 的原理是当调用的时候, 就取值内部的 [[Class]] 属性值, 然后拼接成 '[object ' + [[Class]] + ']'  这样的字符串并返回. 然后我们使用 call 方法来获取任何值的数据类型.

## 有用的数据类型判断函数

### isArray polyfill
isArray 是数组类型内置的数据类型判断函数, 但是会有兼容性问题, 所以模拟 underscore 中的写法如下:
```
isArray = Array.isArray || function(array){
  return Object.prototype.toString.call(array) === '[object Array]';
}
```
### isNaN polyfill
判断一个数是不是 NaN 不能单纯地使用 === 这样来判断, 因为 NaN 不与任何数相等, 包括自身, 所以:
```
isNaN: function(value){
  return isNumber(value) && isNaN(value);
}
```
这里的 isNumber 就是用上面所说的 Object.prototype.toString 进行判断的, 然后使用 isNaN 来判断值, 至于为什么需要在判断 isNaN 之前需要判断是不是 Number 类型, 这是因为 NaN 本身
也是数字类型(Object.prototype.toString 可知), 在 ES6 的 isNaN 中只有值为数字类型使用 NaN 才会返回 true, 这是为了模拟 ES6 的 isNaN.

### 判断是否是 DOM 元素
在实际项目里面, 有时或许我们需要判断是否是 DOM 元素对象, 那么在判断的时候利用的是 DOM 对象特有的 nodeType 属性:
```
isElement: function(obj){
  return !!(obj && obj.nodeType === 1);
}
```

### 判断是否是对象
```
isObject: function(obj){
  var type = typeof obj;
  return type === 'function' || typeof === 'object' && obj !== null;
}
```
这里的对象是狭义的, 是通常所指的 key-value 型的集合, 或者是 function 函数并且不为 null.

### 判断是否是 arguments 对象 polyfill
判断一个对象是不是 arguments 对象可以通过 Object.prototype.toString 来判断, 但是低版本的浏览器不支持, 他们返回的是 [object Object], 所以需要兼容:
```
isArguments: function(obj){
  return Object.prototype.toString.call(obj) === '[object Arguments]' || (obj != null && Object.hasOwnProperty.call(obj, 'callee'));
}
```
兼容做法原理是通过对象的 hasOwnProperty 方法来判断对象是否拥有 callee 属性从而判断是不是 arguments 对象.