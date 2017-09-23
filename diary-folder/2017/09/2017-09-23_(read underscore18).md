# read underscore18

已经将 underscore 最精华的集合部分读完了(粗读). 接下来想先精读此部分在往下读.
集合部分核心的两个部分就是关于迭代与规约, 另一部分就是数据类型的判断.

## 类型判断
javascript 是一个弱类型语言, 所以在数据类型的判断上, 我们需要花点心思.
之前看过, 像 Arguments 或者 Array 的类型这些不能简单地使用 typeof 来判断, 因为这些并不是简单的对象, 而且我们还需要知道这是什么类型的对象.
所以我们需要借用 Object.toString 方法, 打印出值的类型, 类如 [object XXX];
当 Object.toString 方法被调用的时候, 其实就是相当于获取 this 对象的 [[Class]] 属性值. 这个属性值就是值的类型了, 然后就会返回这个 [object Type] 这个字符串.
对于原生的对象, 内部 class 属性就只有下面这几种:
```
Array, Boolean, Error, Function, Date, Math, Number, Object, RegExp, String
```
所以在 underscore 中选择使用 each 来批量生产数据类型判断函数
为什么不用 typeof 和 instanceof ? 使用他们可以应付一些场景, 但是终究会有点不严谨的地方, typeof 将 function, arguments, array 等等都判断是对象, 不能详细地分清
对象的类别.
而对于 instanceof 来说, 有一种情况是需要注意的, 就是在 iframe 的时候, 因为不同 iframe 之间的原型链不共享, 所以会有像下面这种情况:
```
//a.html
<script>
  window.foo = [1,2,3];
</script>

//mian.html
<iframe src="a.html"></iframe>
<script>
  var foo = window.frame[0].foo;
  console.log(foo instanceof Array);
  console.log(foo.contructor === Array);
</script>
```
