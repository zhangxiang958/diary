# read underscore32


今天发现在 ubuntu 16.04 会自动将网络设置变为手动代理, 导致无法上网, 花了我 2 个小时 debug.

```
// Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };
```
所谓的 flateen 就是数组扁平化, 将深层的元素抽出来放在一层. 所谓的算法就是树的层次遍历, 将一层先遍历完, 然后遍历第二层, 然后将元素放到一个数组里面.
这里会判断元素是不是类数组, 如果是就使用递归的方式进行遍历.