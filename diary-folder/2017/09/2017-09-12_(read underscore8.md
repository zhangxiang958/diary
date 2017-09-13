# read underscore8

```
// Create a reducing function iterating left or right.
var createReduce = function(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function(obj, iteratee, memo, initial) {
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
};

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
_.reduce = _.foldl = _.inject = createReduce(1);

// The right-associative version of reduce, also known as `foldr`.
_.reduceRight = _.foldr = createReduce(-1);
```
先看 reduce 干什么用的, 如果是正常的 reduce 的话, 那么就是将输入的集合从左到右集合成一个数字, 而对于 reduceRight 就是从右边开始, 从字面来看, 这两个 API 会有很大的相似点, 
而在实际编写的时候页确实是这样的. 作者先用一个 reducer 来构造 reduce 函数, 然后通过一个 flag 值来确定合并的方向, 也就是使用 dir, 当 dir 为 1, 那么就是从左边开始, 当 dir 为 -1,
那么就是从右边开始.
对于 createReduce 这个函数来说, 其实所做的时候就是通过闭包, 确定集合的方向, 然后还有调用 reducer 这个核心的方法.
当然, 里面那个函数经过前面的解析, 估计能一眼看懂:
```
return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
```

先用 initial 判断形参有多少个, 然后进行 optimizeCb 回调函数包装优化. 回调是有 4 个参数的, 分别是 memo, value, index(key), list.
memo 就是初始值, list 里面的 item 值就会逐个相加到 memo 里面.
对于 reducer 这个函数:
```
var reducer = function(obj, iteratee, memo, initial) {
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
```

前面的话应该已经清楚了, keys 通过三目运算符来达到获取对象的 key 列表.length 就是 keys 或者是数组形式的 obj 的 length 属性, index 也就是开始循环的下标, 如果左边开始就是 0, 
从右边开始就是 length - 1, 下面:
```
if (!initial) {
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }
```
这里的意思是, 如果传参少于三个的时候(也就是在 _.reduce(obj, callback) 没有传 memo 初始值), memo 就会取方向(左边或右边)遍历的第一个元素作为初始值. 然后 index 就等于 mome 的下一个

如果传参大于三个说明有初始化 memo, 那么就直接使用传进来的 memo.
for 循环页很有意思, index += dir, 一开始不知道作者为什么要使用 1 和 -1 来做 flag 值, 现在这里懂了.然后就是循环不断遍历, 然后将得到的 memo 返回.