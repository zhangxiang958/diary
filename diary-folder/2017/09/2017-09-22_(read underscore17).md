# read underscore16

```
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
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
昨天的字符串匹配, 利用字符串的 match 函数, 将匹配的结果转化为数组, 但是主要是匹配什么? 正则主要是匹配三个模式:
```
[^\ud800-\udfff] : 
[\ud800-\udbff][\udc00-\udfff] : 
[\ud800-\udfff] :
```
在 javascript 中使用 utf-16 来进行编码

明日更, 这部分要再看看