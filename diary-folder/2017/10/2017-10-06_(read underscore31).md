# read underscore27

for in 循环是有 bug 的, 不过 bug 的触发条件是有限制的.
1. 需要在 IE9 以下的浏览器
2. 被枚举的对象被重写了一些不可枚举属性.

```
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };
```
这段代码就是用来兼容 bug 的.
第一: hasEnumBug 是用来判断有没有 for in bug 的, 因为重写了Object 原型中的 toString 属性
```
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
```
然后. 核心在于在 collectNonEnumProps 函数, 第一先确定哪些属性名在低版本浏览器是不可枚举的, 分别是 valueOf, isPrototypeOf, toString, propertyIsEnumberable, hasOwnProperty
toLocalString 这几个方法, 当然还有 constructor, 但是不知道为什么 contructor 在函数内部做判断的时候需要独立出来判断.
```
var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
```
得到不可枚举的属性名列表接下来就好办了, 就是判断对象里面的和原型链里面的同属姓名的值相不相同, 不相同就是重写了, 将这个属性名加到 keys 数组里面, 如果相同就不加.
这就是为什么一进入函数就需要存储 obj.prototype.
之前看博文说循环里面 prop in obj 多余, 这个并不是, 可以试试:
```
var obj = Object.create(null);
'toString' in obj;  // false
```
这样是 false 的, underscore 为了避免这样的情况发生, 添加了判断.
最后说一下感受, for in 循环到底有没有必要进行兼容, 不兼容的危害大不大? 我认为并不大, 但是作为一个类库, 代码的严谨性是需要的, 但是我们在平时使用 for in 循环的时候有没有必要担惊受怕呢?
其实没有必要的, 我们如果不是特别需要, IE9 以下的兼容情况会越来越少, 第二一般来说我们也不会在对象里面去覆盖像 toString 这样的原型属性.