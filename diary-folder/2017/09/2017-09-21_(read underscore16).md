# read underscore16

```
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);
```
```
_.toArray = function(obj) {
    // 如果没有传入集合, 返回空数组
    if (!obj) return [];
    // 如果传入的是数组, 那么直接返回
    // 这里也还没搞懂为啥要 slice.call, 不是判断为数组应该直接返回吗? 这样不是多此一举?
    if (_.isArray(obj)) return slice.call(obj);
    // 如果传入的是字符串
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      // 这个正则还没看懂
      return obj.match(reStrSymbol);
    }
    // 如果是类数组类型(鸭子模型), 那么就使用 map 函数将集合转为真正的数组
    // _.identity 函数只是将遍历的值返回, 这样可以得到"纯净"的数组了.
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    // 
    return _.values(obj);
  };
```
将集合转变成数组, 这个方法我在之前的项目中手写过, 算是比较熟悉.

```
// Return the number of elements in an object.
  _.size = function(obj) {
    // 对传入的集合进行判空
    if (obj == null) return 0;
    // 进行集合类型判断, 如果是类数组型的, 那么就返回集合中的 length 属性(鸭子模型)
    // 如果不是的话, 那么就先获取集合中键名数组(借助 _.keys 方法), 然后返回键名数组的长度.
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };
```
这个函数就非常容易理解了, size 返回的就是集合的大小(长度)

```
// Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);
```
partition 是使用了 group 函数生成的 API 函数, 它的用途在于将数组分为两类函数, 看到这里也许你会顿悟为啥之前的 group 函数中有一个三目运算符将 result 赋值成 [[], []] 这样的形式.
其目的就是在于将原数组分为两类, 一类一个数组. 根据 group 后面的那个 partition 参数进行区分, 可以看到 _.partition 函数后面添加了一个 true. 符合条件的放在前面, 不符合条件的放在后面.
result[pass ? 0 : 1].push(value);