# read underscore10

```
// Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };
```
_.filter 就是通过调用回调, 然后过滤出符合条件的元素, 然后加入到 result 数组中, 然后最终得到这个数组. 所谓 _.reject 就是 filter 的反函数, 它是过滤出不符合条件的元素, 然后将不符合
条件的元素加入到新数组中, 最终得到这个数组.

对于 _.negate 就是将 predicate 函数返回值取反, 然后就可以得到相反的结果了.
```
 // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };
```
下面看 every 和 some
```
  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };
```
我感觉将 each 和 map 函数读懂之后, 其他的函数就是稍微修改一下代码就可以了, every 函数就是为了让集合中每个 item 都能使用回调来执行, 然后如果回调都是返回 true, 则最后返回 true, 
一旦有一个 item 执行回调之后返回 false, 那么 every 返回的也是 false. 也就是验证每个 item 是否都符合规则.

而对于 some 就是监测集合中是否存在符合规则的, 如果一旦找到一个, 那么就结束循环然后返回 true, 否则就返回 false.