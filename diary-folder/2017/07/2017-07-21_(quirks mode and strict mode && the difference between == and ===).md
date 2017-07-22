# quirks mode and strict mode && the difference between == and ===

## quirks mode and strict mode
strict mode 就是标准模式, 按照 W3C 标准, quirks mode 就是怪异模式, 按照浏览器自己的标准. 可以使用
```
window.top.document.compatMode  //来判断是否是标准模式
```
它们差别在于:
在标准模式下, width 是内容宽度, 元素的真正宽度是 margin-left + border-left + padding-left + width + paddding-right + border-right + margin-right.也就是所谓的水平格式化.
但是在怪异模式下, width 是盒子的宽度, 内容宽度是 width - (margin-left + border-left + padding-left + paddding-right + border-right + margin-right);
而且在怪异模式在, 标准模式的限定宽度的盒子 margin: 0 auto 的居中方法没用, 需要用 text-align: center;
在标准模式下, 盒子的高度是内容撑开的, 如果父元素没有设置高度, 子元素设置百分比高度无用.

## the difference between == and ===

一句话总结: == 会自动进行类型转换, === 不会自动进行类型转换, 对于 string/number 等基本类型, 如果不同类型, 则会进行类型转换.
对于数组对象等引用类型, 对比的是引用地址, 除非地址相同, 否则 === 与 == 都是相同的结果(false).

NaN 不和任何值相等, 所以 NaN 根本就不应该使用 ==/=== 来比较, 应当使用 isNaN.

```===``` 比较简单, 通俗来讲就是绝对相等.引用类型地址相同或者基本类型的值绝对相同(字符串完全一样, 布尔值完全一样, 数字绝对相同, undefined 与 undefined, null 与 null).

而对于 ```==``` 有一些不同的规则. 因为 undefined 继承于 null, 所以在 == 里面, 两者相等, 字符串会转化为数字, 布尔值会转化为数字 1/0, 如果是引用类型(对象), 那么会自动使用对象的 toString 与 valueOf 方法. 对于基本包装类型(Number, String, Boolean 等等) 这些会先使用 valueOf 返回原始值.对象使用 toString 方法会返回类似 [object Object] 这样的字符串.
也就是说如果是对象与数值或者字符串, 对象会使用 toString 或者 valueOf 转换.
```
var a = {
  test: 1
}

a == '[object Object]' // true
```

而且我还发现,如果你用数组来比较的话, 是先进行 valueOf, 然后再执行 toString 的
```
var a = [{ test: 1 }];

a.valueOf();  // [object]

a.valueOf().toString() //'[object Object]'

a == '[object Object]'  
```
