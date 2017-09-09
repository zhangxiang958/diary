# read underscore4

继续阅读 underscore 源码:
```
  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };
```
cb 函数到底是做什么的? cb 函数是一个内部方法, 一下子可能看不出来它的功能, 但是我们可以借助 _.iteratee 函数来看, 根据文档 "_.iteratee 函数是用来生成可以应用到集合中每个元素的回调的, 返回想要的结果", 而 _.iteratee 函数主要是用在了 _.each, _.map, _.find, _.filter 等等的这些需要回调的函数的. 
```
if(_.iteratee !== builtIteratee) return _.iteratee(value, context);
```
上面这句是判断 _.iteratee 函数是否有被重写, 如果已经被重写, 也就是 _.iteratee 与 builtinIteratee 变量缓存的函数不同时, 则使用用户自定义的那个函数并返回.

```
if(value == null) return _.identify;
```
这句是判断 value, 也就是第一个函数是不是为空, 因为像 _.each, _.map 这些函数是需要回调函数来构造出需要的数据(对象, 数组等)的, 但是用户有可能会省缺这个函数, 作为一个优秀的工具库, 当然
需要考虑这种情况, 所以当 value 为空的时候, 自动使用一个匿名函数, 然后这个匿名函数并没有做什么特别的操作, 只是将传入的参数直接返回而已, 为什么呢? 既然省缺了回调当然就不知道需要做什么操作,所以直接返回就可以了:
```
_.identify = function(value){
  return value;
}
```
接下来:
```
if (_.isFunction(value)) return optimizeCb(value, context, argCount);
```
这里会判断 value 是不是一个函数, 如果是函数, 说明用户传入回调, 那么就是用 optimizeCb 将传入的回调函数进行 this 硬绑定.
```
if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
```
如果传入的 value 是一个非数组对象, 那么就返回一个匿名函数, 判断传入的 obj 是否包含了 value 对象: 如果包含则返回 true, 不包含则返回 false
```
_.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };
```
然后:
```
return _.property(value);
```
到了最后这一步, 那就说明传入的既不是函数, 也不是 key:value 形式的对象, 而是集合(数组)或者是字符串之类的值. _.property 函数返回一个匿名函数, 这个匿名函数会返回传入的对象的对应的键值,
而对应的键名也就是这里的 value 了. 
