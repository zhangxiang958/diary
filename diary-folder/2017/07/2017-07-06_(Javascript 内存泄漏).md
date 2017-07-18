# Javascript 内存泄漏

内存泄漏就是在我们不需要这个变量的时候, 仍然因为无法被回收(不需要的引用)而存在内存中.
## 内存泄漏的四种类型
### 全局变量
我们如果在声明变量之前没有使用 var 或者无意中使用 this 来添加属性,那么我们就会在不知觉中生成了一个全局变量
所以我们一般需要在 'use strict' 这样才规避这样的内存泄漏
### 遗忘的计时器或回调
当我们使用定时器的时候如果没有及时 clearTimeout 或者 clearInterval 的话, 那么就会引起内存泄漏, 而且定时器函数中的变量也会保留.
另外元素的监听器如果在元素在移除之前没有 removeListener, 那么也会容易导致内存泄漏.这也就是为什么我们推荐使用事件代理的原因之一.
### DOM 引用
如果代码中保留了父元素中子元素的引用, 那么我们在移除父元素的时候并没有真正地移除, 因为子元素还拥有引用, 所以在保存 DOM 元素引用的时候需要留意
### 闭包
```
var test = null;
var foo = function(){
  var original = test;
  var bar = function (){
    console.log(original);
  }

  test = {
    name: 'test',
    method: function(){
      console.log()
    }
  }
}

setInterval(foo, 1000);
```
此类每次调用 foo 就会创造闭包链表

