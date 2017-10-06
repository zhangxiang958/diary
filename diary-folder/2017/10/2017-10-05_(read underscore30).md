# read underscore27

```
  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };
 // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };
```

对于 initial 函数来说, 第一个参数就是传递数组, 然后将数组进行分割, 使用 slice 来分割数组. 保留 length - n 个元素, 也就是去除从后面开始的 n 个元素.
个人觉得这个 API 不是非常有存在的必要, slice 已经非常强大了.
对于 first 来说, 提取的是数组的第一个元素.如果 array 是空的, 那么就返回 void 0, 如果没有划分数组, 也就是不输入 n, 那么就直接返回 array[0], 如果需要划分数组.也就是输入了
n, 那么它的意思就是返回前 n 个元素, 所以使用 initial 来划分数组.