# read underscore33

```
  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };
```
这个 API 是返回传入数组的交集.
```
var result = [];
var argsLength = arguments.length;
```
初始化结果数组. argsLength 存储起传入的数组的个数, 看有多少个数组.
```
for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      // 这里使用 contains 优化遍历, 如果 result 数组里面已经有了元素了, 那么就不需要做接下来的判断了.
      // (这里的 contain 函数会收入我的自封装函数库)
      if (_.contains(result, item)) continue;
      var j;
      // 从第二个数组开始检查, 数组中是否含有元素 item
      for (j = 1; j < argsLength; j++) {
        // 如果发现其中有一个数组不含有 item, 那么就退出循环
        if (!_.contains(arguments[j], item)) break;
      }
      // 如果 j 等于 argslength, 说明上面的那个循环遍历到了最后, 说明所有数组都含有这个 item, 所以加入到 result 中.
      if (j === argsLength) result.push(item);
    }
```
