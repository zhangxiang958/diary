# read underscore13

```
// Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };
```
一句一句来:
```
var index = 0;
iteratee = cb(iteratee, context);
```
初始化下标变量, 生成迭代的回调函数.
接下来有点绕: 一开始的那个 return 函数其实是像下面这样:
```
return _.pluck(array, 'value');
```
提取 array 中 item 中的 value 属性的值并返回一个数组.
而对于 array 数组, 它相当于:
```
_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    })
```
首先它对一开始传进来的 obj 进行一个 map 迭代, 将里面的值换成类似 { value: obj[i], index: i, criteria: returnValue } 这样的结构, criteria 属性就是使用 obj[i] 进行
sortBy 传入的回调执行后得到的值.
_.map 返回一个数组, 然后利用数组本身的 sort 方法, 进行排序, 利用 item 里面的 criteria 进行比较, 将数字大的放在前面, 1 表示在 left 在前面, -1 表示 right 在前面, 然后得到的数组
使用 pluck 来过滤得到排序后的 obj.