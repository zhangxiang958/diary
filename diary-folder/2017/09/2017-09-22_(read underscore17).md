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
[^\ud800-\udfff]: 普通的 BMP 字符
[\ud800-\udbff][\udc00-\udfff]: 成对的代理对 
[\ud800-\udfff]:  未成对代理字
```
在 javascript 中使用 utf-16 来进行编码, 所谓 BMP 字符可以理解成就是平时我们常用的英文字符, 符号, 汉文字等等, 但是这都属于 Unicode 中第 0 个位面, 使用两个字节来标记.
但是从第 1 个位面开始就不止 16 位二进制数了, 多于 16 位的利用一定的转码映射为其他字符, 这就是所谓的 UTF-*. UTF-16 就是使用超过 2 个字节的字符编码为一对 16 比特(32 位, 4 字节)
的码元, 这就是代理对, 所以在判断字符串的时候, 如果有代理对, 那么应该是 length 为 1, 而不是 2, 而且是一个字符而不是两个, 所以在转化为字符串数组的时候, 需要将代理对划分到一个单元格.

而对于那个 sclie.call 我个人觉得是因为可能作者担心 isArray 这个判断方法被覆盖, 所以添加多一层 slice 保证返回的是数组.

https://linux.cn/article-3759-1.html?page=1