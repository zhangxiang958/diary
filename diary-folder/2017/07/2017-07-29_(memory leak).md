# memory leak

很多人印象中都会觉得用户现在的手机都会有个 1,2 G 以上的内存, 电脑更不用说了, 普通点的都有 4-8 G 的内存, 我一个小网页何必关心内存呢? 
而且一般会认为更大的内存会有更好的性能, 而事实是内存占用是会延迟增长与方差性也就是
实际上任何操作都会有代价的, 只是代价的大小而已.

在 javascript 中, 像 number, string, boolean 都是基本类型, 他们一般都是对象引用树的叶子节点或者终结节点.
其余的都是对象, 基本都是字典型数据结构, 数组也是特殊的对象, 只是 key 是顺序递增的数字而已.
既然内存情况基本上是内存对象引用树, 而垃圾回收机制就会将无法从 root 找到一条路径到达的节点回收掉, root 一般是 window 对象或者是 global 对象.

v8 引擎为什么那么快是因为它使用了隐藏类, 比如说像新建一个类, 引擎会先新建一个隐藏类, 然后新增一个属性的时候再新建一个隐藏类, 具体为什么这么做我还不太清楚, 但是好处就在于可以帮助引擎优化代码, 如果我们都是只在构造函数里面添加类, 那么引擎就会猜想这一类的对象都是这种类型, 那么在生成指令的时候会只用一条指令搞定, 这样就会快很多.相反, 如果你在新建一个实例对象之后, 再对对象进行单独的属性修改, 那么就会慢很多, 因为引擎需要新建新的隐藏类, 不能复用之前的实例对象的隐藏类.

为什么内存问题和上面讲的 v8 引擎有关, 就是因为我们如果像下面这样
```
var a = new A();
delete a.prop;
```
以为内存占用少了, 因为我们删除了一个没用的属性, 但是事实是因为这个实例与其他的实例属性个数不同, 所以这个实例对象需要单独新建一个隐藏类, 那么就和我们想象地相反了, 删除一个属性反而是占用内存增大了, 而且根据 chrome 显示, 增大了 15 倍.

还有定时器:像下面这样
```
var obj = {
    callAgain: function(){
        var ref = this;
        var val = setTimeout(function(){
            console.log('call again:' + new Date().toTimeString());
            ref.callAgain();
        }, 1000);
    }
}

obj.callAgain();
obj = null;
```
也会导致内存泄漏的, 因为这个只是将 obj 的指向改变了, 指向 null, 但是里面的定时器没有清除 clearTimeout, 所以还是保持了引用, 其实并没有回收.

此外大家都知道闭包会保持对上一层父级上下文的引用, 所以也可以是内存泄漏的一部分来源.
所以不要滥用闭包.

DOM 节点的话如果想要 remove 的话, 要注意将树节点的引用也要移除, 不然就不会移除树了.
监听器也会造成内存泄漏, 所以尽量用事件代理.

其实像 performance api 可以获取内存的使用情况的, usedJavascriptHeapSize, totaljavascriptHeapSize.

这里有个 tip, 在使用闭包的时候尽量使用命名函数, 这里方便排查闭包的位置:
```
function lc() {
    var str = 'closuers';
    return function clo() {
        console.log(str);
    }
}

function lc() {
    var str = 'closuers';
    var clo = function clo() {
        console.log(str);
    }

    return clo;
}
```


tip:

使用 timeline 来追查内存问题的时候, 可以看到对象保留树, distance 表示根到这个节点对象的距离, 一般不用理会, 除非距离特别长.

使用快照来查看内存问题, summary 是用于查看 DOM 内存泄漏的, comparison 是用于比较两个快照之间的区别的.containment 是用于查看堆内容的, 可以用来分析全局对象和闭包.dominators 视图是用来显示支配树的.

分析步骤就是:打一个断点1(快照), 打一个断电2(快照), 查看两个快照之间可疑的地方, 然后执行这个可疑的步骤, 再打一个断点3(快照), 然后对照查看步骤一二分配的空间.

现在可以使用 chrome 比较方便的 recored all heap allocations 可以看到分配和回收的空间.

links:
http://blog.csdn.net/hgl868/article/details/45095153

http://slides.com/gruizdevilla/memory#/6/15