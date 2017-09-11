# read underscore7

继续继续:
each 函数是一个核心方法, 像处理数组一样处理所有的类数组数据.  
```
// Collection Functions
// --------------------

// The cornerstone, an `each` implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
_.each = _.forEach = function(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var keys = _.keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
};
```
先简单解释一个 API 的使用, obj 就是你需要遍历的那个对象, iteratee 是你定义的处理数据回调函数, context 是执行上下文, 回调函数的 this 值将会是 context. 而对于第一句 iteratee = optimizeCb(iteratee, context);, 就是之前所说的视命名参数数量而使用 call 或 apply 动态生成回调的函数, 这里函数式编程的优势就体现了, 每个函数只负责单一的功能, 组合起来威力很大.
然后对传进来的对象进行类型判断, 如果是类数组类型(有 length 属性, 并且是一个大于 1 小于 2 的 23 次方减 1 的数), 那么就使用下标的形式也就是方括号的形式来遍历对象. 如果不是, 那么就使用
_.keys 函数, 将对象的键名提取出来, 并返回键名数组, 然后根据键名数组中的键名, 逐个提取 obj 对象中的键值, 进行遍历.
不知道大家在对象遍历的时候有没有疑问, 我在看的时候, 我觉得 _.keys 非常奇怪, 为什么需要先提取键名数组, 使用 for...in 循环然后使用 hasOwnProperty 来判断对象是否拥有该键不可以吗?
其实这里作者非常巧妙, 第一将获取键名的函数独立出去, 有利于其他函数的复用, 而且这样显得非常简洁.第二 keys 数组如果能用原生的 Object.keys 当然最好, 但是会有兼容性问题, 所以需要使用
for...in 循环来兼容, 所以不将 for...in 循环不写在 each 函数里面可以减低耦合度, 优化代码性能(for..in 不是必需执行的循环).最后一点在于 IE9 的兼容问题, 在低于 IE9 的浏览器版本里面,
当对象中含有像 toString, valueOf, isPropertyOf, propertyIsEnumerable, hasOwnProperty, toLocaleString 这些属性名的键值对时, 这些属性是无法使用 for...in 循环遍历出来的.
其实到这里, _.each 函数已经解读完了, 但是如果像完全解读 _.keys 函数的话,需要读一读 collectNonEnumProps 函数, 这个稍后阅读.

```

// Return the results of applying the iteratee to each element.
_.map = _.collect = function(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length,
      results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
};
```
_.each 和 _.map 类似的, 只不过 _.map 会返回一个使用回调函数处理过的集合数据.这里有点奇怪, 明明 _.each 处理逻辑与 _.map 处理逻辑类似的, 为什么 _.map 的代码写得这么简洁?
这一点还不知道作者是出于什么考虑, 如果是我肯定是两个都是第二种写法.
还有一点疑问就是为什么 _.each 函数和 _.map 函数在生成回调的时候, 一个采用 optimizeCb, 一个采用 cb 函数?