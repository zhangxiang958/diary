# read underscore29

```
// Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

```
last 函数是和 first 相对的, 相对就是获取数组后面的 1 位甚至 n 位的元素. 同样地, first 依赖 initial, last 依赖 rest, 而对于 rest 来说, 也就是利用 slice 函数来作为核心, 对于
slice 来说, 省缺第二第三个参数, 只有一个参数的话, 就是将数组从第 n - 1 个位置开始切割, 保留后面的数组部分.
为什么 underscore 需要封装那么多的 API, 而其中又是依赖于 slice 的? 其实我觉得在数组中最为强大的 slice 因为过于强大, 导致它的很多用法未必能够全部记住, 而且为了提高易用性与降低使用门槛, underscore 才包装了很多的 API 函数.
compact 函数则是利用 filter 函数, 将数组中值为 false 的过滤掉.
underscore 最为精华的集合部分已经过去了, 数组与对象部分比较水但是还是值得看看, 接下来需要封装自己的工具库, 提高效率.
## op
开始封装个人用库:
```
_.keys = function(obj){
    var results = [],
        key;

    for(key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
            results.push(key);
        }
    }

    return results;
}
```