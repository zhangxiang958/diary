# Iterator && Generator

迭代器不仅仅是一种设计模式, 我觉得它在一定程度上避免了很多在循环时候的错误, ES6 中有一个特性就是遍历器, 可以帮助我们减少在遍历的时候出现错误.
迭代器是一个特殊的对象, 它拥有一个 next 方法, 内部保存一个指针来指向当前值的位置的.还有一个 next 方法, 就是下一个值的意思. next 函数返回来的是一个对象:
```
{
  value: 'value',
  done: false
}
``` 

done 是一个布尔值, 表示遍历是否完了, 也就是是不是最后一个值.
```
function iterator = function(items){
  var i = 0;
  
  return {
    next: function(){

      var done = ( i >= items.length); 
      var value = !done ? items[i++] : undefined;

      return {
        value: value,
        done: done
      }
    }
  }
};
```

而对于生成器对象就是为了简便地创造 iterator 的, 也就是生成器对象简化了上面这样创造迭代器的代码, 所谓生成器就是返回迭代器的函数:
```
function *iterator(items) {
  for(let i = 0; i < items.length; i++) {
    yield items[i];
  }
}
```
函数名前面的那个 * 就说明这是一个生成器, 对于 yield, 是用来返回一次迭代的值的, 
```
yield ...;

//返回
{
  value: value,
  done: done
}
```
有意思的在于, yield 会按照出现的顺序返回而且函数遇到它之后就会返回退出函数, 就像 return 一样, 也是同样不能穿越函数边界退出函数, 也就是不能像这样:
```
function *test(items) {
  items.forEach((item) => {
    yield item;   //error
  });
}
```
为什么很多人说生成器强大, 其实就是因为生成器是可以深入到 js 引擎的, 其实我们在使用 for of 循环来遍历数组对象的时候, 引擎就隐含了获取对象的内置迭代器, 然后
输入值.
```
let arr = [1,2,3];
var iterator = arr[Symbol.iterator]();

console.log(iterator.next());
```
