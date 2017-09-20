# read underscore15

```
  // An internal function used for aggregate "group by" operations.
  // 这是用来生成 group by 类函数的内部方法
  var group = function(behavior, partition) {
    // 返回闭包
    return function(obj, iteratee, context) {
      // 初始化 result 变量, 作为最后的返回结果
      var result = partition ? [[], []] : {};
      // 生成包装回调
      iteratee = cb(iteratee, context);
      // 使用 each 遍历传入的 obj
      _.each(obj, function(value, index) {
        // 根据每个 API 调用时传入的回调, 生成一类元素的 key, 比如 1.3, 1.5 生成的类键名就是 1
        var key = iteratee(value, index, obj);
        //通过闭包, 执行创建 API 的时候传入的 behavior 函数
        behavior(result, value, key);
      });
      // 返回结果
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    // 如果 result 本身有这个键名, 那么就将 value 添加到对应的 key 数组中
    // 如果没有的话, 就创建 key 属性, 值为包含 value 值的数组
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  // 这个 indexBy API 是 groupBy 的特殊用法, 和 groupBy 的用法与意义是类似的, 只是在使用这个 API 的时候, 你需要知道
  // 用于进行分类的键名是在传入的对象中是唯一的.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  // 这个 API 和 group API 也是非常相似, 只是 groupBy 函数返回的是分类数组, 其中的 item 是分类的一个个元素
  // countBy 则是一个类的数量, 比如 1.3, 1.5 使用分类就是 { '1': [1.3, 1.5] }, 使用 countBy 就是 { '1': 2 }
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });
```
