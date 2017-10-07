# read underscore28

```
    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
```
第一, 原本 toString 那些不可枚举的属性能不能用 hasOwnProperty 来检验有咩有被重写, 我觉得是不可以, 在谨慎程度上, hasOwnProperty 本身也可能被重写, 但是原本 underscore 中
就使用了变量来存储 hasOwnProperty, 但是为什么不用, 这个我倒是不清楚作者的意图.其实对于判断有没有 obj 存在对应属性或者 constructor 属性都是可以使用原先存储的 hashOwnProperty 的.
因为 constructor 的特殊性, 哪里特殊呢? 我做了一些测试:
```
var obj = Object.create(null);

obj.toString // undefined

var o = new Object();
o.toString; // function toString(){ [native code] }

var obj2 = Object.create(obj);

function foo() {

}

obj.constructor = foo;
obj1.constructor //foo;
```
因为 Object.toString 等等的这些属性是通过点操作符拿不到的, 但是 constructor 可以, 所以需要做特别处理, 使用 hasOwnProperty 来判断, 不能使用 obj[prop] !== proto[prop].
主要原因其实是 Object.create(null); 的特殊性, 它让对象的原型链变为了 null, 找不到对象的原生函数.