# read underscore9

```
// Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };
```
find 函数的作用在于说在列表中找到符合回调函数条件的元素, 一旦找到, 马上返回, 不会遍历整个列表. 理解 find 先需要看 findIndex 和 findKey 这两个函数.
```
// Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

```
其实 findIndex 就是核心方法了, 通过 createPredicateIndexFinder 这个函数来生成函数, 同样的, 和昨天看的 reduce 和 reduceRight 函数一样, 作者通过 dir 来表示开始寻找的方向.
道理很简单, 其实就是通过遍历, 然后判断是否符合设定的回调的规则, 如果符合, 那么就是返回这个数的 index, 然后 find 将对应值输出.
```
 // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };
```
findKey 其实和 findIndex 是非常类似的, 唯一不同就是在于 findIndex 里面的 length 变成了 _.keys(obj).
