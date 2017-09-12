# read underscore7.5

先说昨天的一个问题, 为什么 _.each 和 _.map 函数两个函数内部分别用了 optimizeCb 和 cb 函数, 这里是因为 _.map 函数是需要返回值的, 也就是说处理数据的函数最后是需要
return 数据的, 所以它需要保证 _.map 回调是有返回值的, 而且为了处理回调传值的各种情况, 传对象数组函数会分别怎么样, 这样才可以保证 _.map 函数最后得到的数据是原来的对象
经过处理后的数据. 反过来想, 为什么 _.each 为何不用 cb 函数? 这就很简单了, 因为不需要, _.each 不需要返回值, 所以不需要做各种各样的数据类型判断和处理.

第二就是为什么 _.each 使用的是 if...else 形式的代码结构, 而 _.map 使用的是三目运算符来代替? 
我个人的答案是这样的, 不能从为什么 _.each 方法不用三元运算符这个角度来思考, 而是使用 _.map 为什么使用三目运算符, 我觉得是为了简洁写法:
如果 _.map 采用 if else
```
if(isArrayLike(obj)) {
  length = obj.length;
  result = Array(length);
  for(...) {

  }
} else {
  keys = _.keys(obj);
  length = keys.length;
  result = Array(length);
  for(...){
    .....
  }
}
```
这样可以看到, 有些代码像 result = Array(length) 已经重复了, 而它又必须这么写, 因为只有拿到 length 之后才能声明一个定长的数组.而且 keys 值在上一个代码块中没有赋值, 而下面一个
就有赋值, 这样是不易于代码的可读性的, 因为代码的赋值断开了, 而且是通过判断来赋值, 相比于 三目运算符的 keys = !isArrayLike(obj) && _.keys(obj); 这样清晰易懂.而且 result 的赋值也不用重复写. length 的值也非常清晰, 因为就是 (keys || obj) 的属性值, 如果在 if...else 代码块里面的话, 会稍微显得不够清晰. 在编写可维护的 javascript 的时候, 尽量是将所有的变量
声明与赋值都写到前面去, 这样会比较清晰.
至于为什么 _.each 不使用三目运算符, 这个问题我还没有想透.


[hasEnumBug](https://segmentfault.com/q/1010000007464712/a-1020000007466031)